import styles from "./index.less";
import { text } from "express";
import moment from 'moment'
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu,Tag,message} from 'antd';
import React, { useRef,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import{questionList,addQuestion,questionDetail,removeQuestion,updateQuestion} from '../service'
import {QuestionListItem,AnswerListItem} from '../data'
import CreateForm from "../components/CreateForm";
import AnswerDialog from "../components/AnswerDialog";
import UpdateForm,{FormValueType} from "../components/UpdateForm";


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: QuestionListItem) => {
  const hide = message.loading('正在添加');
  try {
    const data = await addQuestion({ ...fields });
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
const handleRemove = async (item: QuestionListItem) => {
  const hide = message.loading('正在删除');
  try {
    const data =  await removeQuestion(item);
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
    const data =  await updateQuestion({
      title: fields.title,
      rightAnswerId: fields.rightAnswerId,
      id:fields.id,
      categoryId:fields.categoryId,
      answers:fields.answers,
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
  const [createModalVisible, handleCteateModalVisible] = useState<boolean>(false);
  const [answerModalVisible, handleAnswerModalVisible] = useState<boolean>(false);
  const [answerValue, handleAnswerValue] = useState<Array<AnswerListItem>>([]);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const columns: ProColumns[] = [
    {
      title: "题目",
      dataIndex: "title",
      key: "title",
      hideInSearch:true,
      width: 800,
      rules: [
        {
          required: true,
          message: '题目为必填项',
        },
      ],
      render: (text,record)  => <a  onClick={async () => {

        const hide = message.loading('正在查询');
        try {
          const data = await questionDetail(record.id)
          hide();
          if(data.code  === 200){
            handleAnswerValue(data.data.answerist)
            handleAnswerModalVisible(true)
          }else{
            message.error(data.message);
          }

        } catch (error) {
          hide();
          message.error('查询失败请重试！');
        }
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
      title: "答案",
      dataIndex: "answers",
      hideInSearch:true,
      key: "answers",
      hideInTable:true,
      rules: [
        {
          required: true,
          message: '答案为必填项',
        },
      ],

    },
    {
      title: "答案id",
      hideInSearch:true,
      hideInTable:true,
      dataIndex: "rightAnswerId",
      key: "rightAnswerId",
      rules: [
        {
          required: true,
          message: '答案为必填项',
        },
      ],
      render: text => <a>{text}</a>
    },
    {
      title: "答案id",
      hideInSearch:true,
      hideInForm:true,
      dataIndex: "answerId",
      key: "answerId",
      rules: [
        {
          required: true,
          message: '答案为必填项',
        },
      ],
      render: text => <a>{text}</a>
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
      title: "操作",
      key: "action",
      hideInForm: true,
      hideInSearch:true,
      render: (record) => (
        <span>
          <Button style={{ marginRight: 16 }}
           onClick={async () => {

            const hide = message.loading('正在查询');
            try {
              const data = await questionDetail(record.id)
              hide();
              if(data.code  === 200){
                handleAnswerValue(data.data.answerist)
                setUpdateFormValues(record);
              handleUpdateModalVisible(true);
              }else{
                message.error(data.message);
              }

            } catch (error) {
              hide();
              message.error('查询失败请重试！');
            }
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
          <ProTable<QuestionListItem,QuestionListItem>
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
       updateModalVisible?(
        <UpdateForm modalVisible={updateModalVisible} values={updateFormValues} answers={answerValue} onCancel={() => {
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
          const data = await questionList(params)
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
