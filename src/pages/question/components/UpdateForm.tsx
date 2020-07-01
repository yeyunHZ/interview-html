import React , { useState }from 'react';
import {QuestionListItem,AnswerListItem} from '../data'
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps ,message} from 'antd';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  values: QuestionListItem;
  answers:Array<AnswerListItem>;
  onSubmit: (values: FormValueType) => void;
}

export interface FormValueType{
  title?: string;
  rightAnswerId?: number;
  categoryId?:number;
  answers?:string;
  id?:number;
}


const FormItem = Form.Item;
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { modalVisible, onCancel,values,onSubmit,answers} = props;
  const [form] = Form.useForm();
  var answerStr="[";
  for(let i=0;i<answers.length;i++){
    answerStr = answerStr + "{\"id\":"+ answers[i].id+",\"content\":\""+answers[i].content+"\"}";
    if(i != answers.length - 1){
      answerStr = answerStr + ",";
    }
  }
  answerStr = answerStr +"]";
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
      title="更新问答题"
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >

     <Form
         form={form}
         initialValues={{
          title: values.title,
          rightAnswerId: values.answerId,
          id:values.id,
          categoryId:values.categoryId,
          answers:answerStr
         }}>
     <FormItem
          name="title"
          label="问题"
          rules={[{ required: true, message: '请输入问题！' }]}
        >
          <Input placeholder="请输入" />
      </FormItem>
      <FormItem
          name="answers"
          label="答案"
          rules={[{ required: true, message: '请输入答案！' }]}
        >
          <Input placeholder="请输入" />
      </FormItem>
      <FormItem
          name="rightAnswerId"
          label="正确答案"
          rules={[{ required: true, message: '请输入正确答案！' }]}
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

    </Form>
    </Modal>
  );


};

export default UpdateForm;
