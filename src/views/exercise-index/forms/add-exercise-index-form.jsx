import React, { Component } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import moment from "moment";

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
      componentDidMount() {
        const { form, exercise } = this.props;
      
        if (exercise && exercise.rps) {
          const { id, name, description, min_grade, duration, rps, date_end } = exercise;
      
          form.setFieldsValue({
            id,
            name,
            description,
            min_grade,
            duration,
            rps_id: rps.id,
            date_end: moment(date_end),
            // set other fields as needed
          });
        }
      }
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      rps,
      questions,   
    } = this.props;

    // const { getFieldDecorator } = form;
    const { getFieldDecorator } = this.props.form;
    const { exercise } = this.props;
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
         <Form.Item label="ID">
         {getFieldDecorator('id', {
        initialValue: exercise && exercise.id,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Name">
        {getFieldDecorator('name', {
          initialValue: exercise && exercise.name,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Description">
        {getFieldDecorator('description', {
          initialValue: exercise && exercise.description,
        })(<Input />)}
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
         {/* <Form.Item label="Pilih Pertanyaan">
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
            </Form.Item> */}
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
