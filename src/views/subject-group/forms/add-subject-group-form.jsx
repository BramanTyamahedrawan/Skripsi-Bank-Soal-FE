import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class AddSubjectGroupForm extends Component {
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
        title="Tambah Rumpun Mata Kuliah"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama:">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan nama rumpun mata kuliah",
                },
              ],
            })(<Input placeholder="Nama Rumpun Mata Kuliah" />)}
          </Form.Item>
          <Form.Item label="Deskripsi:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi rumpun mata kuliah",
                },
              ],
            })(
              <TextArea rows={4} placeholder="Deskripsi Rumpun Mata Kuliah" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddSubjectGroupForm" })(
  AddSubjectGroupForm
);
