import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
const { Option } = Select;

class AddSubjectForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    };

    return (
      <Modal
        title="Tambah Mata Pelajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Mapel:">
            {getFieldDecorator("idMapel", {
              rules: [
                { required: true, message: "Silahkan isikan id bidang keahlian" },
              ],
            })(<Input placeholder="ID Mapel" />)}
          </Form.Item>
          <Form.Item label="Nama:" htmlFor="name">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan nama mata pelajaran",
                },
              ],
            })(<Input id="name" placeholder="Nama Mata Pelajaran" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddSubjectForm" })(AddSubjectForm);
