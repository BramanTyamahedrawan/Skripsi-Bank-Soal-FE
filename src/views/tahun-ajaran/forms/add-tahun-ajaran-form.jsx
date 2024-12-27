import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import {getProgramKeahlian} from '@/api/programKeahlian'
const { TextArea } = Input;
const { Option } = Select;
class AddTahunAjaranForm extends Component {
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
        title="Tambah Tahun Ajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Tahun Ajaran:">
            {getFieldDecorator("idTahun", {
              rules: [
                { required: true, message: "Silahkan isikan ID Tahun Ajaran" },
              ],
            })(<Input placeholder="ID Tahun Ajaran" />)}
          </Form.Item>
          <Form.Item label="Tahun Ajaran:">
            {getFieldDecorator("tahunAjaran", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan Tahun Ajaran",
                },
              ],
            })(<Input placeholder="Tahun Ajaran" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddTahunAjaranForm" })(AddTahunAjaranForm);
