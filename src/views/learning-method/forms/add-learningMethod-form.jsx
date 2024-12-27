import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class AddLearningMethodForm extends Component {
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
        title="Tambah Metode Pembelajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama Metode Pembelajaran:">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan nama metode pembelajaran",
                },
              ],
            })(<Input placeholder="Nama Metode Pembelajaran" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Metode Pembelajaran:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi metode pembelajaran",
                },
              ],
            })(<TextArea rows={4} placeholder="Deskripsi Pengguna" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddLearningMethodForm" })(
  AddLearningMethodForm
);
