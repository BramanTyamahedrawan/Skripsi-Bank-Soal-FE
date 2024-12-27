import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class AddReligionForm extends Component {
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
        title="Tambah Agama"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama Agama:">
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "Silahkan isikan nama agama" },
              ],
            })(<Input placeholder="Nama Agama" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Agama:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi agama",
                },
              ],
            })(<TextArea rows={4} placeholder="Deskripsi Pengguna" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddReligionForm" })(AddReligionForm);
