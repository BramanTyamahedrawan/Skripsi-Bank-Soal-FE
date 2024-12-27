import React,{Component} from "react";
import {Form,Modal,Input,Select} from "antd";
const {TextArea} = Input;

class AddTeamTeachingForm extends Component{
    render(){
        const {visible,onCancel,onOk,form,confirmLoading,lecture} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol:{
                xs:{span:24},
                sm:{span:8},
            },
            wrapperCol:{
                xs:{span:24},
                sm:{span:16},
            },
        };
        return(
            <Modal
                title="Tambah Team Teaching"
                visible={visible}
                onCancel={onCancel}
                onOk={onOk}
                confirmLoading={confirmLoading}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="Nama:">
                        {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Nama Team teaching wajib diisi" }],
                        })(<Input placeholder="Nama" />)}
                    </Form.Item>
                    <Form.Item label="Deskripsi:">
                        {getFieldDecorator("description", {
                        rules: [
                            {
                            required: true,
                            message: "Deskripsi Team teaching wajib diisi",
                            },
                        ],
                        })(<TextArea placeholder="Deskripsi Team teaching" />)}
                    </Form.Item>
                    <Form.Item label="Dosen 1:">
                        {getFieldDecorator("lecture", {
                        rules: [
                            {
                            required: true,
                            message: "Silahkan pilih dosen",
                            },
                        ],
                        })(
                        <Select style={{ width: 300 }} placeholder="Pilih Dosen">
                            {lecture && Array.isArray(lecture) && lecture.map((arr, key) => {
                            return (
                                <Select.Option value={arr.id} key={"lecture-" + key}>
                                {arr.name}
                                </Select.Option>
                            );
                            })}
                        </Select>
                        
                        )}
                    </Form.Item>
                    <Form.Item label="Dosen 2:">
                        {getFieldDecorator("lecture2", {
                        rules: [
                            {
                            required: true,
                            message: "Silahkan pilih dosen",
                            },
                        ],
                        })(
                        <Select style={{ width: 300 }} placeholder="Pilih Dosen">
                            {lecture && Array.isArray(lecture) && lecture.map((arr, key) => {
                            return (
                                <Select.Option value={arr.id} key={"lecture2-" + key}>
                                {arr.name}
                                </Select.Option>
                            );
                            })}
                        </Select>
                        
                        )}
                    </Form.Item>
                    <Form.Item label="Dosen 3:">
                        {getFieldDecorator("lecture3", {
                        rules: [
                            {
                            required: true,
                            message: "Silahkan pilih dosen",
                            },
                        ],
                        })(
                        <Select style={{ width: 300 }} placeholder="Pilih Dosen">
                            {lecture && Array.isArray(lecture) && lecture.map((arr, key) => {
                            return (
                                <Select.Option value={arr.id} key={"lecture3-" + key}>
                                {arr.name}
                                </Select.Option>
                            );
                            })}
                        </Select>
                        
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({name: "AddTeamTeaching"})(AddTeamTeachingForm);