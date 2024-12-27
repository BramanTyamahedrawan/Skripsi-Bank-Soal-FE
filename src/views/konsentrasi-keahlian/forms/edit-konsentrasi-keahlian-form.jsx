import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import {getProgramKeahlian} from '@/api/programKeahlian'
const { TextArea } = Input;
const { Option } = Select;
class EditKonsentrasiKeahlianForm extends Component {
  state = {
    programList: []
  };

  fetchProgramKeahlianList = async () => {
    try {
      const result = await getProgramKeahlian(); 
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const programList = content.map((program) => ({
          id: program.id,
          program: program.program
        }));
        this.setState({ programList });
      }
    } catch (error) {
      // Handle error if any
      console.error("Error fetching program data: ", error);
    }
  };

  componentDidMount (){
    this.fetchProgramKeahlianList();
  }
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } = this.props;
    const { programList} = this.state;
    const { getFieldDecorator } = form;
    const { id, name, description } = currentRowData;
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
        title="Edit Konsentrasi Keahlian"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Konsentrasi Keahlian:">
            {getFieldDecorator("id", {
              rules: [
                { required: true, message: "Silahkan isikan ID Konsentrasi Keahlian" },
              ],
            })(<Input placeholder="ID Konsentrasi Keahlian" />)}
          </Form.Item>
          <Form.Item label="Konsentrasi Keahlian:">
            {getFieldDecorator("konsentrasi", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan Konsentrasi Keahlian",
                },
              ],
            })(<Input placeholder="Konsentrasi Keahlian" />)}
          </Form.Item>
          <Form.Item label="Program Keahlian:">
            {getFieldDecorator("programkeahlian_id", {
              rules: [
                { required: true, message: "Silahkan isi program keahlian" },
              ],
            })(
              <Select placeholder="Pilih Program Keahlian">
                {programList.map((program) => (
                  <Option key={program.id} value={program.id}>
                    {program.program}
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

export default Form.create({ name: "EditKonsentrasiKeahlianForm" })(EditKonsentrasiKeahlianForm);
