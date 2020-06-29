import styles from "./index.less";
import { text } from "express";
import moment from 'moment'
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu,Tag,message} from 'antd';
import React, { useRef,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import{articleList,addArticle,removeArticl,updateArticle} from '../service'
import {ArticleListItem} from '../data'
import AnswerDialog from "../components/AnswerDialog";
import ImageDialog from "../components/ImageDialog";
import CreateForm from "../components/CreateForm";
import UpdateForm,{FormValueType} from "../components/UpdateForm";



/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: ArticleListItem) => {
  const hide = message.loading('正在添加');
  try {
    const data = await addArticle({ ...fields });
    hide();
    if(data.code  === 200){
      message.success('添加成功');
      return true;
    }else{
      message.error(data.message);
      return false;
    }


  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};


/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (item: CategoryListItem) => {
  const hide = message.loading('正在删除');
  try {
    const data =  await removeArticle(item);
    hide();
    if(data.code  === 200){
      message.success('删除成功，即将刷新');
      return true;
    }else{
      message.error(data.message);
      return false;
    }
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    const data =  await updateArticle({
      title: fields.title,
      imageUrl: fields.imageUrl,
      id:fields.id,
      categoryId:fields.categoryId,
      showType:fields.showType,
    });
    hide();
    if(data.code  === 200){
      message.success('更新成功');
      return true;
    }else{
      message.error(data.message);
      return false;
    }
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};



const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [answerModalVisible, handleAnswerModalVisible] = useState<boolean>(false);
  const [answerValue, handleAnswerValue] = useState<String>('');
  const [answerImageModalVisible, handleAnswerImageModalVisible] = useState<boolean>(false);
  const [answerImageUrlValue, handleAnswerImageUrlValue] = useState<String>('');
  const [createModalVisible, handleCteateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const columns: ProColumns[] = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      hideInSearch:true,
      rules: [
        {
          required: true,
          message: '标题为必填项',
        },
      ],
      render: (text,record)  => <a  onClick={() => {
        handleAnswerValue(record['content'])
        handleAnswerModalVisible(true)
      }} >{text}</a>
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      hideInSearch:true,
      key: "updatedAt",
      hideInForm: true,
    render:text=><span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "内容",
      dataIndex: "content",
      hideInSearch:true,
      key: "content",
      hideInTable:true,
      rules: [
        {
          required: true,
          message: '内容为必填项',
        },
      ],

    },
    {
      title: "图片地址",
      hideInSearch:true,
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text,record)  =>{
        if(text.length >2){
          return <img src={text} alt="avatar" style={{width:50,height:50}}  onClick={() => {
            handleAnswerImageUrlValue(record['imageUrl'])
            handleAnswerImageModalVisible(true)
          }}  />
        }
      }
    },
    {
      title: "分类id",
      dataIndex: "categoryId",
      key: "categoryId",
      rules: [
        {
          required: true,
          message: '分类id为必填项',
        },
      ],
      render: text => <a>{text}</a>
    },
    {
      title: "是否显示",
      key: "showType",
      dataIndex: "showType",
      hideInSearch:true,
      hideInForm: true,
      render:(text) =>(
        <span>
          <Tag color={text == 1? "geekblue" : "green"}>
              {text == 1?"显示":"不显示"}
          </Tag>
        </span>
      )
    },
    {
      title: "操作",
      key: "action",
      hideInForm: true,
      hideInSearch:true,
      render: (record) => (
        <span>
          <Button style={{ marginRight: 16 }} onClick={() => {
              setUpdateFormValues(record);
              handleUpdateModalVisible(true);
            }}>编辑</Button>
          <Button onClick={async () => {
             const success = await handleRemove(record);
             if (success) {
               if (actionRef.current) {
                   actionRef.current.reload();
                 }
             }
          }

            }>删除</Button>
        </span>

      )
    }
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleCteateModalVisible(true)}>
            新建
          </Button>,
         selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                onClick={async (e) => {
                  if (e.key === 'remove') {
                    await handleRemove(selectedRows);
                    action.reload();
                  }
                }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>

          ),
          <CreateForm onCancel={() => handleCteateModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable<ArticleListItem,ArticleListItem>
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              if (success) {
                handleCteateModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="key"
            type="form"
            columns={columns}
            rowSelection={{}}
          />
        </CreateForm>,
          answerModalVisible?(
            <AnswerDialog modalVisible={answerModalVisible} answer={answerValue}  onCancel={() => {
              handleAnswerModalVisible(false);}}>
         </AnswerDialog>
         ):null,
         answerImageModalVisible?(
          <ImageDialog modalVisible={answerImageModalVisible} imageUrl={answerImageUrlValue}  onCancel={() => {
            handleAnswerImageModalVisible(false);}}>
       </ImageDialog>
       ):null,
       updateModalVisible?(
        <UpdateForm modalVisible={updateModalVisible} values={updateFormValues} onCancel={() => {
          handleUpdateModalVisible(false);
          setUpdateFormValues({});
        }}  onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
           handleUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}>


     </UpdateForm>
     ):null,
        ]}
        request={async (params ={})=>{
          const data = await articleList(params)
          return {
            data:data.data.list,
            page:params.current,
            total:data.data.totalPage*20
          }
        }}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
