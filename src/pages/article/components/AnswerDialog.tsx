import React from 'react';
import { Modal } from 'antd';

interface AnswerDialogProps {
  modalVisible: boolean;
  onCancel: () => void;
  answer:string;
}

const AnswerDialog: React.FC<AnswerDialogProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="内容"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
 <span>{props.answer}</span>
    </Modal>
  );
};

export default AnswerDialog;
