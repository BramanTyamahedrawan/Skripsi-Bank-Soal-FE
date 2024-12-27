import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
const { TextArea } = Input;

class EditLinguisticValueForm extends Component {
  render() {
    const {
        visible,
        onCancel,
        onOk,
        form,
        confirmLoading,
        currentRowData,
        file_path,
      } = this.props;
      const { getFieldDecorator } = form;
      const { id, name,value1,value2,value3,value4 } = currentRowData;
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
    const BASE_URL = 'http://hadoop-primary:9870/';

    return (
        <Modal
            title="Edit Linguistic Value"
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            confirmLoading={confirmLoading}
        >
            <Form {...formItemLayout}>
                <Form.Item label="ID Tabel Linguistic:">
                    {getFieldDecorator("id", {
                    initialValue: id,
                    })(<Input disabled />)}
                </Form.Item>
                <Form.Item label="Name:">
                    {getFieldDecorator("name", {
                        rules: [
                            {required: true, message: "Please input name"},
                        ],
                        initialValue: name,
                    })(<Input placeholder="Name" />)}
                </Form.Item>
                <Form.Item label="Value 1:">
                    {getFieldDecorator("value1", {
                        rules: [
                            {required: true, message: "Please input value 1"},
                        ],
                        initialValue: value1,
                    })(<Input placeholder="Value 1" />)}
                </Form.Item>
                <Form.Item label="Value 2:">
                    {getFieldDecorator("value2", {
                        rules: [
                            {required: true, message: "Please input value 2"},
                        ],
                        initialValue: value2,
                    })(<Input placeholder="Value 2" />)}
                </Form.Item>
                <Form.Item label="Value 3:">
                    {getFieldDecorator("value3", {
                        rules: [
                            {required: true, message: "Please input value 3"},
                        ],
                        initialValue: value3,
                    })(<Input placeholder="Value 3" />)}
                </Form.Item>
                <Form.Item label="Value 4:">
                    {getFieldDecorator("value4", {
                        rules: [
                            {required: true, message: "Please input value 4"},
                        ],
                        initialValue: value4,
                    })(<Input placeholder="Value 4" />)}
                </Form.Item>
                {file_path && (
                    <img src={`${BASE_URL}${file_path}`} alt="Linguistic Value" style={{width: '200px', height: '200px', marginLeft: '10px'}}/>
                )}
            </Form>
        </Modal>
    );
    }
}
export  default Form.create()(EditLinguisticValueForm);