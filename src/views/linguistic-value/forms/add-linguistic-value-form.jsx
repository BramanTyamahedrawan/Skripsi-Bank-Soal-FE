import React, { Component } from "react";
import {Form , Input, Modal , Select, Upload, Icon} from "antd";

class AddLinguisticValueForm extends Component {
    state = {
        fileList: [],
        selectedExamTypes: [],
      };
    
      handleBeforeUpload = (file) => {
        if (file) {
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }));
        }
        return false; // return false to prevent automatic upload
      };
    render(){
        const {visible, onCancel, onOk, form, confirmLoading} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return(
            <Modal
                title="Tambah Nilai Linguistik"
                visible={visible}
                onCancel={onCancel}
                onOk={onOk}
                confirmLoading={confirmLoading}
            >
                <Form {...formItemLayout} encType="multipart/form-data">
                    
                    <Form.Item label="Level index:">
                        {getFieldDecorator("name", {
                            rules: [
                                {required: true, message: "Silahkan isikan nama"},
                            ],
                        })(<Input placeholder="Name" />)}
                    </Form.Item>
                    <Form.Item label="Value 1:">
                        {getFieldDecorator("value1", {
                            rules: [
                                {required: true, message: "Silahkan isikan value 1"},
                            ],
                        })(<Input placeholder="Value 1" />)}
                    </Form.Item>
                    <Form.Item label="Value 2:">
                        {getFieldDecorator("value2", {
                            rules: [
                                {required: true, message: "Silahkan isikan value 2"},
                            ],
                        })(<Input placeholder="Value 2" />)}
                    </Form.Item>
                    <Form.Item label="Value 3:">
                        {getFieldDecorator("value3", {
                            rules: [
                                {required: true, message: "Silahkan isikan value 3"},
                            ],
                        })(<Input placeholder="Value 3" />)}
                    </Form.Item>
                    <Form.Item label="Value 4:">
                        {getFieldDecorator("value4", {
                            rules: [
                                {required: true, message: "Silahkan isikan value 4"},
                            ],
                        })(<Input placeholder="Value 4" />)}
                    </Form.Item>
                    <Form.Item label="File">
                        {getFieldDecorator('file')(
                            <Upload.Dragger
                            name="file"
                            beforeUpload={this.handleBeforeUpload}
                            maxCount={1}
                            >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        )}
                        </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default Form.create({ name: "AddLinguisticValueForm" })(AddLinguisticValueForm);