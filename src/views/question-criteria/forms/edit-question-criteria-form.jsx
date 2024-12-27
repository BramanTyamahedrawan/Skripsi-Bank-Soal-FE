import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
const { TextArea } = Input;
class EditQuestionCriteriaForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const { getFieldDecorator } = form;
    const { id, name, description,category } = currentRowData;
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
        title="mengedit"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        >
        <Form {...formItemLayout}>
            <Form.Item label="ID Dosen:">
            {getFieldDecorator("id", {
                initialValue: id,
            })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="Nama:">
            {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入Nama!" }],
                initialValue: name,
            })(<Input placeholder="请输入Nama" />)}
            </Form.Item>
            <Form.Item label="Deskripsi:">
            {getFieldDecorator("description", {
                rules: [{ required: true, message: "请输入Deskripsi!" }],
                initialValue: description,
            })(<Input placeholder="请输入Deskripsi" />)}
            </Form.Item>
            <Form.Item label="Kategori:">
            {getFieldDecorator("category", {
                rules: [{ required: true, message: "请选择Kategori!" }],
                initialValue: category,
            })(
                <Select placeholder="请选择Kategori">
                <Select.Option value="Cognitive">Cognitive</Select.Option>
                <Select.Option value="Non Cognitive">Non Cognitive</Select.Option>
                </Select>
            )}
            </Form.Item>
        </Form>
        </Modal>
      );
    }
  }
export default Form.create()(EditQuestionCriteriaForm);
