import React, { Component } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
class AddCriteriaValue extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      studyPrograms,
      learningMediaSoftwares,
      learningMediaHardwares,
      subjects,
      lectures,
    } = this.props;
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
        width={1000}
        title="Tambah RPS"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama wajib diisi" }],
            })(<Input placeholder="Nama" />)}
          </Form.Item>
          <Form.Item label="SKS:">
            {getFieldDecorator("sks", {
              rules: [
                {
                  required: true,
                  message: "SKS wajib diisi",
                },
              ],
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
            })(<Input placeholder="CPL Prodi" />)}
          </Form.Item>
          <Form.Item label="CPL Mata Kuliah:">
            {getFieldDecorator("cpl_mk", {
              rules: [
                { required: true, message: "CPL Mata Kuliah wajib diisi" },
              ],
            })(<Input placeholder="CPL Mata Kuliah" />)}
          </Form.Item>
          <Form.Item label="Software Media Pembelajaran:">
            {getFieldDecorator("learning_media_softwares", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih Software Media Pembelajaran",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Software Media Pembelajaran"
              >
                {learningMediaSoftwares.map((arr, key) => {
                  return (
                    <Select.Option
                      value={arr.id}
                      key={"learning-media-software-" + key}
                    >
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Hardware Media Pembelajaran:">
            {getFieldDecorator("learning_media_hardwares", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih Hardware Media Pembelajaran",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Hardware Media Pembelajaran"
              >
                {learningMediaHardwares.map((arr, key) => {
                  return (
                    <Select.Option
                      value={arr.id}
                      key={"learning-media-hardware-" + key}
                    >
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Program Study (Prodi):">
            {getFieldDecorator("study_program_id", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih prodi",
                },
              ],
            })(
              <Select style={{ width: 300 }} placeholder="Pilih Prodi">
                {studyPrograms.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"study-program-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Untuk Mata Kuliah:">
            {getFieldDecorator("subject_id", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih matkul",
                },
              ],
            })(
              <Select style={{ width: 300 }} placeholder="Pilih Matkul">
                {subjects.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"subject-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Mata Kuliah Wajib:">
            {getFieldDecorator("requirement_subjects", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih matkul wajib",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Matkul Wajib"
              >
                {subjects.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"subject-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Dosen Pengembang:">
            {getFieldDecorator("dev_lecturers", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih dosen pengembang",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Dosen Pengembang"
              >
                {lectures.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"dev-lecture-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Dosen Pengampu:">
            {getFieldDecorator("teaching_lecturers", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih dosen pengampu",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Dosen Pengampu"
              >
                {lectures.map((arr, key) => {
                  return (
                    <Select.Option
                      value={arr.id}
                      key={"teaching-lecture-" + key}
                    >
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Dosen Koordinator:">
            {getFieldDecorator("coordinator_lecturers", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih dosen koordinator",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Dosen Koordinator"
              >
                {lectures.map((arr, key) => {
                  return (
                    <Select.Option
                      value={arr.id}
                      key={"teaching-lecture-" + key}
                    >
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Ka Prodi:">
            {getFieldDecorator("ka_study_program", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih Ka Prodi",
                },
              ],
            })(
              <Select style={{ width: 300 }} placeholder="Pilih Ka Prodi">
                {lectures.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"ka-prodi-" + key}>
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

export default Form.create({ name: "AddCriteriaValue" })(AddCriteriaValue);
