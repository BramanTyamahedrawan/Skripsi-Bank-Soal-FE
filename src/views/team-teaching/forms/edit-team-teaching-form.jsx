import React,{Component} from "react";
import {Form , Input ,Select , Modal} from "antd";
const {TextArea} = Input;

class EditTeamTeachingForm extends Component{
    render(){
        const {visible,onCancel,onOk,form,confirmLoading,currentRowData} = this.props;
        const {getFieldDecorator} = form;
        const {id,name,description,lecture_id} = currentRowData;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
              },
        }
        return(
            <Modal
            title="Edit Team Teaching"
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            confirmLoading={confirmLoading}
            >
            
            <Form {...formItemLayout}>
                <Form.Item label="ID Team Teaching:">
                    {getFieldDecorator("id", {
                        initialValue: id,
                    })(<Input disabled />)}
                </Form.Item>
                <Form.Item label="Nama Team Teaching:">
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Silahkan isi nama team teaching" }],
                        initialValue: name,
                    })(<Input placeholder="Nama team teaching" />)}
                </Form.Item>
                <Form.Item label="Deskripsi Team Teaching:">
                    {getFieldDecorator("description", {
                        rules: [{ required: true, message: "Silahkan isi deskripsi team teaching" }],
                        initialValue: description,
                    })(<TextArea rows={4} placeholder="Deskripsi team teaching" />)}
                </Form.Item>
                <Form.Item label="ID Lecture:">
                    {getFieldDecorator("lecture_id", {
                        rules: [{ required: true, message: "Silahkan isi id lecture" }],
                        initialValue: lecture_id,
                    })(<Input placeholder="ID lecture" />)}
                </Form.Item>
            </Form>
        </Modal>
        )
    }
}
export default Form.create()(EditTeamTeachingForm);