import React, { Component } from "react";
import { Form, InputNumber, Modal, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
class AddRPSForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      formLearnings,
      learningMethods,
      assessmentCriterias,
      appraisalForms,
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
          <Form.Item label="Minggu Ke:">
            {getFieldDecorator("week", {
              rules: [
                {
                  required: true,
                  message: "Minggu wajib diisi",
                },
              ],
            })(
              <InputNumber
                placeholder="Minggu ke"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Sub CP MK:">
            {getFieldDecorator("sub_cp_mk", {
              rules: [{ required: true, message: "Sub CP MK wajib diisi" }],
            })(
              <TextArea
                placeholder="Sub CP MK"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Materi Pembelajaran :">
            {getFieldDecorator("learning_materials", {
              rules: [
                {
                  required: true,
                  message: "Silahkan Isikan Materi Pembelajaran",
                },
              ],
            })(
              <Select
                mode="tags"
                style={{ width: 300 }}
                placeholder="Isikan Materi Pembelajaran"
              ></Select>
            )}
          </Form.Item>
          <Form.Item label="Bentuk Pembelajaran:">
            {getFieldDecorator("form_learning_id", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih Bentuk Pembelajaran",
                },
              ],
            })(
              <Select
                style={{ width: 300 }}
                placeholder="Pilih Bentuk Pembelajaran"
              >
                {formLearnings.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"form-learning-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Metode Pembelajaran:">
            {getFieldDecorator("learning_methods", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih Metode Pembelajaran",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Metode Pembelajaran"
              >
                {learningMethods.map((arr, key) => {
                  return (
                    <Select.Option
                      value={arr.id}
                      key={"learning-method-" + key}
                    >
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Penugasan:">
            {getFieldDecorator("assignments", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan Penugasan",
                },
              ],
            })(
              <Select
                mode="tags"
                style={{ width: 300 }}
                placeholder="Isikan Penugasan"
              ></Select>
            )}
          </Form.Item>
          <Form.Item label="Estimasi Waktu:">
            {getFieldDecorator("estimated_times", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi estimasi waktu",
                },
              ],
            })(
              <Select
                mode="tags"
                style={{ width: 300 }}
                placeholder="Isikan Estimasi Waktu"
              ></Select>
            )}
          </Form.Item>
          <Form.Item label="Pengalaman Belajar Mahasiswa:">
            {getFieldDecorator("student_learning_experiences", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi pengalaman belajar mahasiswa",
                },
              ],
            })(
              <Select
                mode="tags"
                style={{ width: 300 }}
                placeholder="Isikan Pengalaman Belajar Mahasiswa"
              ></Select>
            )}
          </Form.Item>
          <Form.Item label="Kriteria Penilaian :">
            {getFieldDecorator("assessment_criterias", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih kriteria penilaian",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Kriteria Penilaian"
              >
                {assessmentCriterias.map((arr, key) => {
                  return (
                    <Select.Option
                      value={arr.id}
                      key={"assessment-criteria-" + key}
                    >
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Bentuk Penilaian:">
            {getFieldDecorator("appraisal_forms", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih bentuk penilaian",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Bentuk Penilaian"
              >
                {appraisalForms.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"subject-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Indikator Penilaian:">
            {getFieldDecorator("assessment_indicators", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi indikator penilaian",
                },
              ],
            })(
              <Select
                mode="tags"
                style={{ width: 300 }}
                placeholder="Isikan Indikator Penilaian"
              ></Select>
            )}
          </Form.Item>
          <Form.Item label="Bobot:">
            {getFieldDecorator("weight", {
              rules: [
                {
                  required: true,
                  message: "Bobot wajib diisi",
                },
              ],
            })(
              <InputNumber placeholder="Bobot" min={1} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddRPSForm" })(AddRPSForm);
