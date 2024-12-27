import React, { Component } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";

const { TextArea } = Input;

class AddExerciseForm extends Component {
  state = {
    selectedOption: null,
    randomQuestions: [],
  };

  handleSelectChange = (value) => {
    this.setState({ selectedOption: value }, () => {
      this.generateRandomQuestions();
      const selectedQuestionIds = this.state.randomQuestions.map(question => question.id);
      this.props.form.setFieldsValue({ questions: selectedQuestionIds });
    });
  };

  generateRandomQuestions = () => {
    const { selectedOption } = this.state;
    const { questions } = this.props; // Assuming questions are passed as props

    // Create a copy of the questions array
    const questionsCopy = [...questions];

    // Shuffle the questions
    for (let i = questionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
    }

    // Get the first 'selectedOption' questions
    const randomQuestions = questionsCopy.slice(0, selectedOption);

    this.setState({ randomQuestions });
  };
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
      rpsDetail,
      handleRPSChange,
      handleExerciseTypeChange,
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
        title="Tambah Exercise"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama Latihan:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama wajib diisi" }],
            })(<Input placeholder="Nama" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Latihan:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi latihan",
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
          <Form.Item label="Durasi Latihan:">
            {getFieldDecorator("duration", {
              rules: [
                { required: true, message: "Durasi latihan wajib diisi" },
              ],
            })(
              <InputNumber
                placeholder="Durasi latihan (menit)"
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
                onChange={handleRPSChange}
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
          <Form.Item label="Pilih ujian:">
            {getFieldDecorator("type_exercise", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih RPS Detail",
                },
              ],
            })(
            <Select
              style={{ width: 300 }}
              placeholder="Pilih tipe latihan ujian"
              onChange={handleExerciseTypeChange}

              >
              <Select.Option value="Latihan quiz 1">
              Latihan quiz 1 (Weeks 1-4)
              </Select.Option>
              <Select.Option value="Latihan quiz 2">
              Latihan quiz 2 (Weeks 9-13)
              </Select.Option>
              <Select.Option value="Latihan UTS">
              Latihan UTS (Weeks 1-8): 
              </Select.Option>
              <Select.Option value="Latihan UAS">
              Latihan UAS (Weeks 1-18):
              </Select.Option>
            </Select>
            )}
          </Form.Item>
          <Form.Item label="Pilih Pertanyaan">
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
                value={this.state.selectedQuestionIds} // Set the value to the IDs of the selected questions
                >
                {this.state.randomQuestions.map((arr, key) => {
                    return (
                    <Select.Option value={arr.id} key={"question-" + key}>
                        {arr.title}
                    </Select.Option>
                    );
                })}
                </Select>
            )}
            </Form.Item>
            <Form.Item label="pilih jumlah soal:">
              <Select
                style={{ width: 300 }}
                placeholder="pilih jumlah soal yang akan di ujikan"
                onChange={this.handleSelectChange}
              >
                {[10, 20, 30, 40, 50].map((value, key) => (
                  <Select.Option value={value} key={"option-" + key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
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

export default Form.create({ name: "AddExerciseForm" })(AddExerciseForm);
