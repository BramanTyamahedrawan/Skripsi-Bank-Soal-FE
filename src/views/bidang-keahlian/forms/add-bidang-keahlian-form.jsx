import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
const { TextArea } = Input;
class AddBidangKeahlianForm extends Component {
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
        title="Tambah Bidang Keahlian"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Bidang Keahlian:">
            {getFieldDecorator("id", {
              rules: [
                { required: true, message: "Silahkan isikan id bidang keahlian" },
              ],
            })(<Input placeholder="ID Bidang Keahlian" />)}
          </Form.Item>
          <Form.Item label="Nama Bidang Keahlian:">
            {getFieldDecorator("bidang", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan Bidang Keahlian",
                },
              ],
            })(<Input placeholder="ID Bidang Keahlian" />)}
          </Form.Item>
          <Form.Item label="Sekolah:">
            {getFieldDecorator("school_id", {
              initialValue: "RWK001",
            })(
              <Select style={{ width: 240 }}>
                <Select.Option value="RWK001">SMK Negeri Rowokangkung</Select.Option>
                <Select.Option value="TMP001">SMK Negeri Tempeh</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddBidangKeahlianForm" })(AddBidangKeahlianForm);
