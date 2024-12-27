import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;
class EditAssessmentCriteriaForm extends Component {
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
        title="Edit Penilaian"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Penilaian:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama Penilaian:">
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "Silahkan isikan nama penilaian" },
              ],
              initialValue: name,
            })(<Input placeholder="Nama Penilaian" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Penilaian:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi penilaian",
                },
              ],
              initialValue: description,
            })(<TextArea rows={4} placeholder="Deskripsi Penilaian" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditAssessmentCriteriaForm" })(
  EditAssessmentCriteriaForm
);
