import React, { Component } from "react";
import { Form, Input, Modal, Select, Checkbox } from "antd";
const { TextArea } = Input;
class EditQuestionForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const { getFieldDecorator } = form;
    const { id,name,title } = currentRowData;
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
        title="Edit Jurusan"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Pertanyaan:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="pertanyaan:">
            {getFieldDecorator("title", {
              rules: [
                { required: true, message: "Silahkan isikan nama jurusan" },
              ],
              initialValue: currentRowData.title,
            })(<Input placeholder="pertanyaan" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Jurusan:">
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isikan deskripsi jurusan",
                },
              ],
              initialValue: currentRowData.description,
            })(<TextArea rows={4} placeholder="Deskripsi Pertanyaan" />)}
          </Form.Item>
          <Form.Item label="Tipe Pertanyaan:">
            {getFieldDecorator("questionType", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih tipe pertanyaan",
                },
              ],
              initialValue: currentRowData.questionType,
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

          <Form.Item label="Tipe Jawaban:">
            {getFieldDecorator("answerType", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih tipe jawaban",
                },
              ],
              initialValue: currentRowData.answerType,
            })(
              <Select style={{ width: 300 }} placeholder="Pilih tipe jawaban">
                <Select.Option value={"MULTIPLE_CHOICE"}>
                  Pilihan Ganda
                </Select.Option>
                <Select.Option value={"BOOLEAN"}>Benar / Salah</Select.Option>
                <Select.Option value={"COMPLETION"}>
                  Menyelesaikan kalimat rumpang
                </Select.Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Pilih jenis soal:">
            {getFieldDecorator("examType", {
              initialValue: currentRowData.examType === 'EXERCISE' ? ['EXERCISE'] : [],
            })(
              <Checkbox.Group>
                <Checkbox value="EXERCISE">Exercise</Checkbox>
              </Checkbox.Group>
            )}
          </Form.Item>

          <Form.Item label="Pilih jenis soal:">
            {getFieldDecorator("examType2", {
              initialValue: currentRowData.examType2 === 'QUIZ' ? ['QUIZ'] : [],
            })(
              <Checkbox.Group>
                <Checkbox value="QUIZ">Quiz</Checkbox>
              </Checkbox.Group>
            )}
          </Form.Item>

          <Form.Item label="Pilih jenis soal:">
            {getFieldDecorator("examType3", {
              initialValue: currentRowData.examType3 === 'EXAM' ? ['EXAM'] : [],
            })(
              <Checkbox.Group>
                <Checkbox value="EXAM">Exam</Checkbox>
              </Checkbox.Group>
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditQuestionForm" })(EditQuestionForm);
