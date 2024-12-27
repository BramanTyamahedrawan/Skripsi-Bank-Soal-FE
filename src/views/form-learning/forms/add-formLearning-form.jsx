import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class AddFormLearningForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="Tambah Bentuk Pembelajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama Bentuk Pembelajaran:">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan nama bentuk pembelajaran",
                },
              ],
            })(<Input placeholder="Nama Bentuk Pembelajaran" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Bentuk Pembelajaran:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi bentuk pembelajaran",
                },
              ],
            })(<TextArea rows={4} placeholder="Deskripsi Pengguna" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddFormLearningForm" })(
  AddFormLearningForm
);
