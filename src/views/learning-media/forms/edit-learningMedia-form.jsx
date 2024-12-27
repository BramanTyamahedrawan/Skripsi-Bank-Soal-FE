import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class EditLearningMediaForm extends Component {
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
        title="Edit Media Pembelajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Media Pembelajaran:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama Media Pembelajaran:">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan nama media pembelajaran",
                },
              ],
              initialValue: name,
            })(<Input placeholder="Nama Media Pembelajaran" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Media Pembelajaran:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi media pembelajaran",
                },
              ],
              initialValue: description,
            })(
              <TextArea rows={4} placeholder="Deskripsi Media Pembelajaran" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditLearningMediaForm" })(
  EditLearningMediaForm
);
