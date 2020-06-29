import styles from "./index.less";
import { text } from "express";
import moment from 'moment'
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu,Tag,message} from 'antd';
import React, { useRef,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import{cateroryList,addCaterory,removeCaterory,updateCaterory} from '../service'
import CreateForm from '../components/CreateForm';
import UpdateForm, { FormValueType } from '../components/UpdateForm';
import {CategoryListItem} from '../data'



/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await updateCaterory({
      name: fields.name,
      iconUrl: fields.iconUrl,
      id:fields.id,
      showType:fields.showType,
    });
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: CategoryListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addCaterory({ ...fields });
    hide();
    message.success('添加成功');
    return true;
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
    await removeCaterory(item);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [updateFormValues, setUpdateFormValues] = useState({});
  const columns: ProColumns[] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      rules: [
        {
          required: true,
          message: '类型名称为必填项',
        },
      ],
      render: text => <a>{text}</a>
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      hideInForm: true,
    render:text=><span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "图标",
      dataIndex: "iconUrl",
      key: "iconUrl",
      rules: [
        {
          required: true,
          message: '类型图标为必填项',
        },
      ],
      render: text =>(
        <img src={text} alt="avatar" style={{width:50,height:50}}/>
      )
    },
    {
      title: "查看人数",
      dataIndex: "viewNum",
      key: "viewNum",
      hideInForm: true,
    },
    {
      title: "是否显示",
      key: "showType",
      dataIndex: "showType",
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
      render: (text,record) => (
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
        search={false}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
            新建
          </Button>,
           <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
           <ProTable<CategoryListItem,CategoryListItem>
             onSubmit={async (value) => {
               const success = await handleAdd(value);
               if (success) {
                 handleModalVisible(false);
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
        request={(params) => cateroryList(params)}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
