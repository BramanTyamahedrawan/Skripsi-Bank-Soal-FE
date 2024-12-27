import React, { Component } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";

const { TextArea } = Input;

class AddQuizForm extends Component {
  state = {
    selectedQuestionCount: 5, // Default to 5
  };
  handleSelectChange = (value) => {
    this.setState({ selectedQuestionCount: value });
  };
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      list_questions,
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
    const { selectedQuestionCount } = this.state;

    return (
      <Modal
        width={1000}
        title="Tambah Soal Dalam Quiz"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama Kuis:" style={{ display: 'none' }}>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama wajib diisi" }],
              initialValue: this.props.quizName, // Set the initial value to the questionID prop

            })(<Input placeholder="Nama" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Kuis:" style={{ display: 'none' }}>
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi kuis",

                },
              ],
              initialValue: this.props.quizDesc, // Set the initial value to the questionID prop

            })(<TextArea rows={4} placeholder="Deskripsi pertanyaan" />)}
          </Form.Item>
          <Form.Item label="Nilai Minimum:" style={{ display: 'none' }}>
            {getFieldDecorator("min_grade", {
              rules: [
                {
                  required: true,
                  message: "Nilai minimum wajib diisi",

                },
              ],
              initialValue: this.props.quizMinGrade, // Set the initial value to the questionID prop

            })(
              <InputNumber
                placeholder="Nilai minimum"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Durasi Kuis:" style={{ display: 'none' }}>
            {getFieldDecorator("duration", {
              rules: [{ required: true, message: "Durasi kuis wajib diisi" }],
              initialValue: this.props.quizDuration, // Set the initial value to the questionID prop

            })(
              <InputNumber
                placeholder="Durasi kuis (menit)"
                min={1}
                style={{ width: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="RPS:" style={{ display: 'none' }} >
            {getFieldDecorator("rps_id" , {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih RPS",

                },
              ],
              initialValue: this.props.quizRpsId, // Set the initial value to the questionID prop

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
          <Form.Item label="Pilih jumlah soal:">
          <Select
            style={{ width: 300 }}
            placeholder="Pilih jumlah soal yang akan di ujikan"
            onChange={this.handleSelectChange}
          >
            {[5, 10, 20, 30, 40, 50].map((value, key) => (
              <Select.Option value={value} key={"option-" + key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
              {list_questions.slice(0, selectedQuestionCount).map((arr, key) => (
                <Select.Option value={arr.rank} key={"list_questions-" + key}>
                  {arr.title} (Rank: {arr.rank})
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
          <Form.Item label="Tipe Kuis:"style={{ display: 'none' }}>
            {getFieldDecorator("type_quiz", {
              rules: [{ required: true, message: "Tipe Kuis Wajib diisi" }],
              initialValue: this.props.quizType, // Set the initial value to the questionID prop

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
