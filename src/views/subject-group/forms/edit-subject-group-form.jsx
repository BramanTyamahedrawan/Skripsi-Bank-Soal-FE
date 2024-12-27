import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class EditSubjectGroupForm extends Component {
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
        title="Edit Rumpun Mata Kuliah"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Rumpun Mata Kuliah:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama Rumpun Mata Kuliah:">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan nama rumpun mata kuliah",
                },
              ],
              initialValue: name,
            })(<Input placeholder="Nama Rumpun Mata Kuliah" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Rumpun Mata Kuliah:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi rumpun mata kuliah",
                },
              ],
              initialValue: description,
            })(
              <TextArea rows={4} placeholder="Deskripsi Rumpun Mata Kuliah" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditSubjectGroupForm" })(
  EditSubjectGroupForm
);
