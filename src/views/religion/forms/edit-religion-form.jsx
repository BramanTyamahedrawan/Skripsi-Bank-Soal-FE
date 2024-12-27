import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class EditReligionForm extends Component {
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
        title="Edit Agama"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Agama:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama Agama:">
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "Silahkan isikan nama agama" },
              ],
              initialValue: name,
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
              initialValue: description,
            })(<TextArea rows={4} placeholder="Deskripsi Agama" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditReligionForm" })(EditReligionForm);
