import React, { Component } from "react";
import {reqUserInfo} from "@/api/user";

import { Form, Input, InputNumber, Modal, Select } from "antd";
class AddTeamTeachingForm extends Component {
    

    render() {
        const { visible, onCancel, onOk, form, confirmLoading,questionID,linguisticValues} = this.props;
        const { getFieldDecorator } = form;
        const criteriaNames = [
            "Evaluation",
            "Synthesis",
            "Comprehension",
            "Analysis",
            "Difficulty",
            "Reliability",
            "Discrimination",
            "Application",
            "Knowledge"
        ];
        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 9 },
            },
            wrapperCol: {
                xs: { span: 15 },
                sm: { span: 10 },
            },
        };

        return (
            <Modal
                visible={visible}
                title="Berikan Nilai Untuk Soal"
                okText="Add"
                onCancel={onCancel}
                onOk={onOk}
                confirmLoading={confirmLoading}
            >
                <Form {...formItemLayout}>
                <Form.Item label="Question ID" >
                    {getFieldDecorator('questionId', {
                        rules: [{ required: true, message: 'Please input the Question ID!' }],
                        initialValue: this.props.questionID, // Set the initial value to the questionID prop
                    })(<Input disabled />)}
                </Form.Item>
                <Form.Item label="User ID" style={{ display: 'none' }}>
                    {getFieldDecorator('user_id', {
                        rules: [{ required: true, message: 'Please input the Question ID!' }],
                        initialValue: this.props.userID, // Set the initial value to the questionID prop
                    })(<Input disabled />)}
                </Form.Item>
                    {criteriaNames.map((name, index) => (
                        <Form.Item label={`Kriteria ${index + 1}: ${name}`}>
                            {getFieldDecorator(`value${index + 1}`, {
                                rules: [{ required: true, message: `Silahkan pilih nilai kriteria ${index + 1}` }],
                            })(
                                <Select style={{ width: 300 }} placeholder={'Pilih Nilai Linguistik '}>
                                    {linguisticValues && Array.isArray(linguisticValues) && linguisticValues.map((arr, key) => {
                                        return (
                                            <Select.Option value={arr.id} key={`value${index + 1}-${key}`}>
                                                {arr.name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </Form.Item>
                    ))}
                    
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(AddTeamTeachingForm);