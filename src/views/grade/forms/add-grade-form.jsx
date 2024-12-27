import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
import { reqValidatUserID } from "@/api/user";
const { TextArea } = Input;
class AddGradeForm extends Component {
  validatUserID = async (rule, value, callback) => {
    if (value) {
      if (!/^[a-zA-Z0-9]{1,6}$/.test(value)) {
        callback("ID Pengguna必须为1-6位数字或字母组合");
      }
      let res = await reqValidatUserID(value);
      const { status } = res.data;
      if (status) {
        callback("该ID Pengguna已存在");
      }
    } else {
      callback("请输入ID Pengguna");
    }
    callback();
  };
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
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
          <Form.Item label="ID Pengguna:">
            {getFieldDecorator("id", {
              rules: [{ required: true, validator: this.validatUserID }],
            })(<Input placeholder="请输入ID Pengguna" />)}
          </Form.Item>
          <Form.Item label="Nama:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入Nama!" }],
            })(<Input placeholder="请输入Nama" />)}
          </Form.Item>
          <Form.Item label="Peran:">
            {getFieldDecorator("role", {
              initialValue: "admin",
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="admin">admin</Select.Option>
                <Select.Option value="student">guest</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Deskripsi Pengguna:">
            {getFieldDecorator("description", {
            })(<TextArea rows={4} placeholder="请输入Deskripsi Pengguna" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddGradeForm" })(AddGradeForm);
