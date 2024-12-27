import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
import { InputNumber } from 'antd';
const { TextArea } = Input;
class EditRPSForm extends Component {
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
    const { getFieldValue } = this.props.form;
    const currentSubjectId = getFieldValue('subject_id');
    const { id, name, sks,semester,cpl_prodi,cpl_mk,learningMediaSoftwares,learningMediaHardwares, subjects,lectures,studyPrograms,   } = currentRowData;
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
        title="mengedit"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Pengguna:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama wajib diisi" }],
              initialValue: name,
            })(<Input placeholder="Nama" />)}
          </Form.Item>
          <Form.Item label="SKS:">
            {getFieldDecorator("sks", {
              rules: [{ required: true, message: "SKS wajib diisi" }],
              initialValue: sks,
            })(
              <InputNumber
                placeholder="SKS RPS"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Semester:">
            {getFieldDecorator("semester", {
              rules: [{ required: true, message: "Semester wajib diisi" }],
              initialValue: semester,
            })(
              <InputNumber
                placeholder="Semester"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="CPL Prodi:">
            {getFieldDecorator("cpl_prodi", {
              rules: [{ required: true, message: "CPL Prodi wajib diisi" }],
              initialValue: cpl_prodi,
            })(<Input placeholder="CPL Prodi" />)}
          </Form.Item>
          <Form.Item label="CPL Mata Kuliah:">
            {getFieldDecorator("cpl_mk", {
              rules: [{ required: true, message: "CPL Mata Kuliah wajib diisi" }],
              initialValue: cpl_mk,
            })(<Input placeholder="CPL Mata Kuliah" />)}
          </Form.Item>
          <Form.Item label="Learning Media Softwares">
            {getFieldDecorator('learningMediaSoftwares', {
              initialValue: currentRowData.learning_media_softwares ? currentRowData.learning_media_softwares.map(software => software.id) : [],
              rules: [{ required: true, message: 'Learning Media Softwares is required' }],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Select Learning Media Softwares"
              >
                {learningMediaSoftwares ? learningMediaSoftwares.map((software, key) => {
                  return (
                    <Select.Option value={software.id} key={"software-" + key}>
                      {software.name}
                    </Select.Option>
                  );
                }) : null}
              </Select>
            )}
            
          </Form.Item>
          <Form.Item label="Hardware Media Pembelajaran:">
            {getFieldDecorator('learningMediaHardwares', {
              initialValue: currentRowData.learning_media_hardwares ? currentRowData.learning_media_hardwares.map(hardware => hardware.id) : [],
              rules: [{ required: true, message: 'Silahkan pilih Hardware Media Pembelajaran' }],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Hardware Media Pembelajaran"
              >
                {learningMediaHardwares ? learningMediaHardwares.map((hardware, key) => {
                  return (
                    <Select.Option value={hardware.id} key={"hardware-" + key}>
                      {hardware.name}
                    </Select.Option>
                  );
                }) : null}
              </Select>
            )}
          </Form.Item>
          
          <Form.Item label="Subject ID">
            {getFieldDecorator('subjects', {
              initialValue: currentRowData.subject ? currentRowData.subject.id : undefined,
              rules: [{ required: true, message: 'Subject ID is required' }],
            })(
              <Select
                style={{ width: 300 }}
                placeholder="Subject ID"
              >
                {subjects ? subjects.map((subject, key) => {
                  return (
                    <Select.Option value={subject.id} key={"subject-" + key}>
                      {subject.name}
                    </Select.Option>
                  );
                }) : null}
              </Select>
            )}
          </Form.Item>
          
          <Form.Item label="Dosen Pengembang:">
            {getFieldDecorator('dev_lecturers', {
              initialValue: currentRowData && currentRowData.dev_lecturers ? currentRowData.dev_lecturers.map(lecturer => lecturer.name) : [],
              rules: [{ required: true, message: 'Silahkan pilih dosen pengembang' }],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Dosen Pengembang"
              >
                {lectures && lectures.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"dev-lecture-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Program Study (Prodi):">
            {getFieldDecorator('study_program_id', {
              initialValue: currentRowData && currentRowData.study_program_id ? currentRowData.study_program_id : undefined,
              rules: [{ required: true, message: 'Silahkan pilih prodi' }],
            })(
              <Select style={{ width: 300 }} placeholder="Pilih Prodi">
                {studyPrograms && studyPrograms.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"study-program-" + key}>
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

export default Form.create({ name: "EditRPSForm" })(EditRPSForm);
