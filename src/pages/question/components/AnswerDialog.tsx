import React from 'react';
import { Modal } from 'antd';
import {AnswerListItem} from '../data'

interface AnswerDialogProps {
  modalVisible: boolean;
  onCancel: () => void;
  answer: Array<AnswerListItem>;
}

const AnswerDialog: React.FC<AnswerDialogProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="答案"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
  <ul>


    {
            props.answer.map((item: AnswerListItem, index: number) =>
            <li>{item.content}</li>
                )
            }
      </ul>
    </Modal>
  );
};

export default AnswerDialog;
