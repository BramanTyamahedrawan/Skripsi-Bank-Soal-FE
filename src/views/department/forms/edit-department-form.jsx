import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class EditDepartmentForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const { getFieldDecorator } = form;
    const { id, name, description } = currentRowData;
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
        title="Edit Jurusan"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Jurusan:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama Jurusan:">
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "Silahkan isikan nama jurusan" },
              ],
              initialValue: name,
            })(<Input placeholder="Nama Jurusan" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Jurusan:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi jurusan",
                },
              ],
              initialValue: description,
            })(<TextArea rows={4} placeholder="Deskripsi Jurusan" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditDepartmentForm" })(EditDepartmentForm);
