import React, { Component } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";

const { TextArea } = Input;

class AddQuizForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      questions,
      rps,
      handleUpdateQuestion,
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
        title="Tambah Quiz"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama Kuis:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama wajib diisi" }],
            })(<Input placeholder="Nama" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Kuis:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi kuis",
                },
              ],
            })(<TextArea rows={4} placeholder="Deskripsi pertanyaan" />)}
          </Form.Item>
          <Form.Item label="Nilai Minimum:">
            {getFieldDecorator("min_grade", {
              rules: [
                {
                  required: true,
                  message: "Nilai minimum wajib diisi",
                },
              ],
            })(
              <InputNumber
                placeholder="Nilai minimum"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Durasi Kuis:">
            {getFieldDecorator("duration", {
              rules: [{ required: true, message: "Durasi kuis wajib diisi" }],
            })(
              <InputNumber
                placeholder="Durasi kuis (menit)"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="RPS:">
            {getFieldDecorator("rps_id", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih RPS",
                },
              ],
            })(
              <Select
                style={{ width: 300 }}
                placeholder="Pilih RPS"
                onChange={handleUpdateQuestion}
              >
                {rps.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"rps-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          {/* <Form.Item label="Pertanyaan:">
            {getFieldDecorator("questions", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih pertanyaan",
                },
              ],
            })(
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Pilih Pertanyaan"
              >
                {questions.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"question-" + key}>
                      {arr.title}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item> */}
          <Form.Item label="Tipe Kuis:">
            {getFieldDecorator("type_quiz", {
              rules: [{ required: true, message: "Tipe Kuis Wajib diisi" }],
            })(
              <Select style={{ width: 120 }} placeholder="Tipe Kuis">
                <Select.Option value="quiz1">Kuis 1</Select.Option>
                <Select.Option value="quiz2">Kuis 2</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Tanggal Mulai:">
            {getFieldDecorator("date_start", {
              rules: [{ required: true, message: "Tanggal Mulai wajib diisi" }],
            })(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Pilih tanggal"
              />
            )}
          </Form.Item>
          <Form.Item label="Tanggal Selesai:">
            {getFieldDecorator("date_end", {
              rules: [
                { required: true, message: "Tanggal Selesai wajib diisi" },
              ],
            })(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Pilih tanggal"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddQuizForm" })(AddQuizForm);
