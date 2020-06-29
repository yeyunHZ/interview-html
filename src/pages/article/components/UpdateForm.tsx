import React , { useState }from 'react';
import {ArticleListItem} from '../data'
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps ,message} from 'antd';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  values: ArticleListItem;
  onSubmit: (values: FormValueType) => void;
}

export interface FormValueType{
  title?: string;
  content?: string;
  imageUrl?: string;
  categoryId?: number;
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
      title="更新文章"
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >

     <Form
         form={form}
         initialValues={{
          title: values.title,
          content: values.content,
           imageUrl: values.imageUrl,
           id:values.id,
           showType:values.showType,
           categoryId:values.categoryId
         }}>
     <FormItem
          name="title"
          label="文章标题"
          rules={[{ required: true, message: '请输入文章标题！' }]}
        >
          <Input placeholder="请输入" />
      </FormItem>
      <FormItem
          name="content"
          label="文章内容"
          rules={[{ required: true, message: '请输入文章内容！' }]}
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
          name="categoryId"
          style={{width:0,height:0}}
        >
          <Input style={{width:0,height:0}} type="hidden"/>
      </FormItem>
      <FormItem
          name="imageUrl"
          label="图标链接"

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
