import React, { Component } from "react";
import { DatePicker, Form, Input, Select, Modal, Upload, Icon } from "antd";
const { TextArea } = Input;
class EditSchoolProfileForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const { getFieldDecorator } = form;
    const { 
      npsn, 
      status,
      bentukKependidikan,
      kepemilikan, 
      SKPendirianSekolah,
      SKIzinOperasional} = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="mengedit"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
        <Form.Item label="NPSN:">
            {getFieldDecorator("npsn", {
              initialValue: npsn,
              rules: [
                { required: true, message: "Silahkan isi NPSN Sekolah!" },
              ],
            })(<Input placeholder="NPSN" />)}
          </Form.Item>
          <Form.Item label="Status:">
            {getFieldDecorator("status", {
              initialValue: status
            })(<Input placeholder="Status" />)}
          </Form.Item>
          <Form.Item label="Bentuk Kependidikan:">
            {getFieldDecorator("bentukKependidikan", {
              initialValue: bentukKependidikan
            })(<Input placeholder="Bentuk Kependidikan" />)}
          </Form.Item>
          <Form.Item label="Status Kepemilikan:">
            {getFieldDecorator("kepemilikan", {
              initialValue: kepemilikan
            })(<Input placeholder="Status Kepemilikan" />)}
          </Form.Item>
          <Form.Item label="SK Pendirian Sekolah:">
            {getFieldDecorator("SKPendirianSekolah", {
              initialValue: SKPendirianSekolah
            })(<Input placeholder="SK Pendirian Sekolah" />)}
          </Form.Item>
          <Form.Item label="Tanggal SK Pendirian :">
            {getFieldDecorator("tglSKPendirian", {
            })(<DatePicker
              showTime
              format="YYYY-MM-DD"
              placeholder="Pilih tanggal"
            />)}
          </Form.Item>
          <Form.Item label="SK Izin Operasional:">
            {getFieldDecorator("SKIzinOperasional", {
              initialValue: SKIzinOperasional
            })(<Input placeholder="SK Izin Operasional" />)}
          </Form.Item>
          <Form.Item label="Tanggal SK Izin Operasional:">
            {getFieldDecorator("tglSKOperasional", {
            })(<DatePicker
              showTime
              format="YYYY-MM-DD"
              placeholder="Pilih tanggal"
            />)}
          </Form.Item>
          <Form.Item label="Sekolah:">
            {getFieldDecorator("school_id", {
              initialValue: "RWK001",
            })(
              <Select style={{ width: 240 }}>
                <Select.Option value="RWK001">SMK Negeri Rowokangkung</Select.Option>
                <Select.Option value="TMP001">SMK Negeri Tempeh</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Foto Profil Sekolah" name="file">
            {getFieldDecorator("file")(
              <Upload.Dragger
                beforeUpload={() => false}
                listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditSchoolProfileForm" })(EditSchoolProfileForm);
