import React from 'react';
import { Modal } from 'antd';

interface ImageDialogProps {
  modalVisible: boolean;
  onCancel: () => void;
  imageUrl:string;
}

const ImageDialog: React.FC<ImageDialogProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <img src={props.imageUrl} alt="avatar"  />
    </Modal>
  );
};

export default ImageDialog;
