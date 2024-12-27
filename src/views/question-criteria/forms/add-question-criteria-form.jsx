import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
const { TextArea } = Input;
class AddQuestionCriteriaForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,

    } = this.props;
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
            title="Tambah Kriteria Pertanyaan"
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            confirmLoading={confirmLoading}
        >
            <Form {...formItemLayout}>
                <Form.Item label="Kriteria Pertanyaan:">
                    {getFieldDecorator("name", { // changed from "question_criteria" to "name"
                    rules: [
                        { required: true, message: "Kriteria Pertanyaan wajib diisi" },
                    ],
                    })(<Input placeholder="Kriteria Pertanyaan" />)}
                </Form.Item>
                <Form.Item label="Deskripsi Kriteria Pertanyaan:">
                    {getFieldDecorator("description", {
                    rules: [
                        {
                        required: true,
                        message: "Deskripsi Kriteria Pertanyaan wajib diisi",
                        },
                    ],
                    })(<TextArea placeholder="Deskripsi Kriteria Pertanyaan" />)}
                </Form.Item>
                <Form.Item label="Kategori:">
                    {getFieldDecorator("category", {
                    rules: [{ required: true, message: "Kategori wajib diisi" }],
                    })(
                    <Select style={{ width: 120 }} placeholder="Kategori">
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
export default Form.create({ name: "AddQuestionCriteriaForm" })(AddQuestionCriteriaForm);