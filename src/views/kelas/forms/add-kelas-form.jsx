import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import {getProgramKeahlian} from '@/api/programKeahlian'
const { TextArea } = Input;
const { Option } = Select;
class AddKelasForm extends Component {
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
        title="Tambah Kelas"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Kelas:">
            {getFieldDecorator("idKelas", {
              rules: [
                { required: true, message: "Silahkan isikan ID Kelas" },
              ],
            })(<Input placeholder="ID Kelas" />)}
          </Form.Item>
          <Form.Item label="Nama Kelas:">
            {getFieldDecorator("namaKelas", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan Kelas",
                },
              ],
            })(<Input placeholder="Nama Kelas" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddKelasForm" })(AddKelasForm);
