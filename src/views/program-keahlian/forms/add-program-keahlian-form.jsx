import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import {getBidangKeahlian} from '@/api/bidangKeahlian'
const { TextArea } = Input;
const { Option } = Select;
class AddProgramKeahlianForm extends Component {
  state = {
    bidangList: []
  };

  fetchBidangKeahlianList = async () => {
    try {
      const result = await getBidangKeahlian(); 
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const bidangList = content.map((bidang) => ({
          id: bidang.id,
          bidang: bidang.bidang
        }));
        this.setState({ bidangList });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching bidang data: ", error);
    }
  };

  componentDidMount (){
    this.fetchBidangKeahlianList();
  }
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { bidangList} = this.state;
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
        title="Tambah Program Keahlian"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Program Keahlian:">
            {getFieldDecorator("id", {
              rules: [
                { required: true, message: "Silahkan isikan ID Program Keahlian" },
              ],
            })(<Input placeholder="ID Program Keahlian" />)}
          </Form.Item>
          <Form.Item label="Program Keahlian:">
            {getFieldDecorator("program", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan Program Keahlian",
                },
              ],
            })(<Input placeholder="Program Keahlian" />)}
          </Form.Item>
          <Form.Item label="Bidang Keahlian:">
            {getFieldDecorator("bidangKeahlian_id", {
              rules: [
                { required: true, message: "Silahkan isi bidang keahlian" },
              ],
            })(
              <Select placeholder="Pilih Bidang Keahlian">
                {bidangList.map((bidang) => (
                  <Option key={bidang.id} value={bidang.id}>
                    {bidang.bidang}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddProgramKeahlianForm" })(AddProgramKeahlianForm);
