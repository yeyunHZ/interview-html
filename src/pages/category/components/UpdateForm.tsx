import React , { useState }from 'react';
import {CategoryListItem} from '../data'
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps ,message} from 'antd';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  values: CategoryListItem;
  onSubmit: (values: FormValueType) => void;
}

export interface FormValueType{
  name?: string;
  iconUrl?: string;
  id?:number;
  showType?:number;
}


const FormItem = Form.Item;
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { modalVisible, onCancel,values,onSubmit} = props;
  const [form] = Form.useForm();
  const renderFooter = () => {
  return (
    <>
      <Button onClick={() => onCancel()}>取消</Button>
      <Button type="primary" onClick={async () => {
        const fieldsValue = await form.validateFields();
        onSubmit(fieldsValue);
        }}>
        确定
      </Button>
    </>
  );
};
  return (
    <Modal
      destroyOnClose
      title="更新分类"
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >

     <Form
         form={form}
         initialValues={{
           name: values.name,
           iconUrl: values.iconUrl,
           id:values.id,
           showType:values.showType
         }}>
     <FormItem
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称！' }]}
        >
          <Input placeholder="请输入" />
      </FormItem>
      <FormItem
          name="id"
          style={{width:0,height:0}}
        >
          <Input style={{width:0,height:0}} type="hidden"/>
      </FormItem>
      <FormItem
          name="iconUrl"
          label="图标链接"
          rules={[{ required: true, message: '请输入图标链接！' }]}
        >
          <Input placeholder="请输入" />
      </FormItem>
      <FormItem
          name="showType"
          label="是否显示"
          rules={[{ required: true, message: '请输入是否显示！' }]}
        >
          <Input placeholder="请输入" />
      </FormItem>
    </Form>
    </Modal>
  );


};

export default UpdateForm;
