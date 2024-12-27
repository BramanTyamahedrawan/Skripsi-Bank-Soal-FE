import React, { Component } from "react";
import { Form, Input, Select, Modal, InputNumber, DatePicker } from "antd";
import moment from "moment";
const { TextArea } = Input;
class EditQuizForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
      rpsAll,
      questions,
      handleUpdateQuestion,
    } = this.props;
    const { getFieldDecorator } = form;
    const { id, name, description, min_grade, duration, date_start, date_end } =
      currentRowData;

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
        width={1000}
        title="Edit Quiz"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Kuis:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Nama Kuis:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama wajib diisi" }],
              initialValue: name,
            })(<Input placeholder="请输入Nama" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Kuis:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi kuis",
                },
              ],
              initialValue: description,
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
              initialValue: min_grade,
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
              initialValue: duration,
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
                {rpsAll.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"rps-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          ''
          <Form.Item label="Pertanyaan:">
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
          </Form.Item>
          <Form.Item label="Tanggal Mulai:">
            {getFieldDecorator("date_start", {
              rules: [{ required: true, message: "Tanggal Mulai wajib diisi" }],
              initialValue: moment(date_start),
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
              initialValue: moment(date_end),
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

export default Form.create({ name: "EditQuizForm" })(EditQuizForm);
