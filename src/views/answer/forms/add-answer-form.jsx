import React, { Component } from "react";
import { Form, Input, Modal, Select, Upload, Icon, Switch } from "antd";
const { TextArea } = Input;
class AddAnswerForm extends Component {
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
        title="Tambah Jawaban"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout} encType="multipart/form-data">
          <Form.Item label="Jawaban :">
            {getFieldDecorator("title", {
              rules: [
                { required: true, message: "Silahkan isikan pertanyaan" },
              ],
            })(<Input placeholder="Jawaban" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Jawaban:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi pertanyaan",
                },
              ],
              initialValue: "This is the default value", // Set the default value

            })(<TextArea rows={4} placeholder="Deskripsi pertanyaan" />)}
          </Form.Item>
          <Form.Item label="Jawaban Benar / Salah">
            {getFieldDecorator("is_right", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan benar / salah",
                },
              ],
              initialValue: false, // Set the default value
            })(
              <Switch
                checkedChildren="Benar"
                unCheckedChildren="Salah"
                defaultChecked
              />
            )}
          </Form.Item>
          <Form.Item label="Tipe Jawaban:">
            {getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih tipe pertanyaan",
                },
              ],
              initialValue: "NORMAL", // Set the default value

            })(
              <Select
                style={{ width: 300 }}
                placeholder="Pilih tipe pertanyaan"
              >
                <Select.Option value={"IMAGE"}>Gambar</Select.Option>
                <Select.Option value={"AUDIO"}>Musik / Audio</Select.Option>
                <Select.Option value={"VIDEO"}>Video</Select.Option>
                <Select.Option value={"NORMAL"}>Normal</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="File">
            {getFieldDecorator("file")(
              <Upload.Dragger
                name="file"
                beforeUpload={() => false}
                maxCount={1}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Klik atau Seret file ke sini</p>
                <p className="ant-upload-hint">support semua file</p>
              </Upload.Dragger>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddAnswerForm" })(AddAnswerForm);
