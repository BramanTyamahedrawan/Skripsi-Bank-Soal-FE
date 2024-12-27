import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
const { TextArea } = Input;
class EditStudyProgramForm extends Component {
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
    const { id, name, role, description } = currentRowData;
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
        title="Edit Program Studi"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Program Studi:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Peran:">
            {getFieldDecorator("role", {
              initialValue: role,
            })(
              <Select style={{ width: 120 }} disabled={id === "admin"}>
                <Select.Option value="admin">Jurusan Teknologi Informasi</Select.Option>
                <Select.Option value="lecture">Jurusan Sipil</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Nama Prodi:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Silahkan isi nama program studi" }],
              initialValue: name,
            })(<Input placeholder="Nama program studi" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Prodi:">
            {getFieldDecorator("description", {
              rules: [{ required: true, message: "Silahkan isi deskripsi program studi" }],
              initialValue: description,
            })(<TextArea rows={4} placeholder="Deskripsi program studi" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditStudyProgramForm" })(EditStudyProgramForm);
