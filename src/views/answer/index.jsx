import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import { getAnswers, deleteAnswer, editAnswer, addAnswer } from "@/api/answer";
import TypingCard from "@/components/TypingCard";
import EditAnswerForm from "./forms/edit-answer-form";
import AddAnswerForm from "./forms/add-answer-form";
import { withRouter } from "react-router";

const { Column } = Table;

class Answer extends Component {
  state = {
    answers: [],
    editAnswerModalVisible: false,
    editAnswerModalLoading: false,
    currentRowData: {},
    addAnswerModalVisible: false,
    addAnswerModalLoading: false,
    rpsDetailID: "",
    rpsID: "",
    questionID: "",
  };
  getAnswers = async (questionID) => {
    const result = await getAnswers(questionID);
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
      this.setState({
        answers: content,
      });
    }
  };

  handleEditAnswer = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editAnswerModalVisible: true,
    });
  };

  handleDeleteAnswer = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("error");
      return;
    }
    deleteAnswer({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getAnswers(this.state.questionID);
    });
  };

  handleEditAnswerOk = (_) => {
    const { form } = this.editAnswerFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editAnswer(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            editAnswerModalVisible: false,
            editAnswerModalLoading: false,
          });
          message.success("berhasi;!");
          this.getAnswers(this.state.questionID);
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editAnswerModalVisible: false,
      addAnswerModalVisible: false,
    });
  };

  handleAddAnswer = (row) => {
    this.setState({
      addAnswerModalVisible: true,
    });
  };

  handleAddAnswerOk = () => {
    const { form } = this.addAnswerFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addAnswerModalLoading: true });
      const { file, ...otherValues } = values;
      if (file !== undefined) {
        const formData = new FormData();
        formData.append("title", otherValues.title);
        formData.append("description", otherValues.description);
        formData.append("type", otherValues.type);
        formData.append("is_right", otherValues.is_right);
        formData.append("file", file.fileList[0].originFileObj);
        formData.append("question_id", this.state.questionID);

        addAnswer(formData)
          .then((response) => {
            form.resetFields();
            this.setState({
              addAnswerModalVisible: false,
              addAnswerModalLoading: false,
            });
            message.success("Berhasil!");
            this.getAnswers(this.state.questionID);
          })
          .catch((e) => {
            message.success("添加失败，请重试!");
          });
      } else {
        const formData = new FormData();
        formData.append("title", otherValues.title);
        formData.append("description", otherValues.description);
        formData.append("type", otherValues.type);
        formData.append("is_right", otherValues.is_right);
        formData.append("question_id", this.state.questionID);
        addAnswer(formData)
          .then((response) => {
            form.resetFields();
            this.setState({
              addAnswerModalVisible: false,
              addAnswerModalLoading: false,
            });
            message.success("Berhasil!");
            this.getAnswers(this.state.questionID);
          })
          .catch((e) => {
            message.success("添加失败，请重试!");
          });
      }
    });
  };
  componentDidMount() {
    this.setState({
      rpsID: this.props.match.params.rpsID,
      rpsDetailID: this.props.match.params.rpsDetailID,
      questionID: this.props.match.params.questionID,
    });
    this.getAnswers(this.props.match.params.questionID);
  }
  render() {
    const { answers } = this.state;
    const questionTitle = answers.length > 0 ? answers[0].question.title : 'No question available';

    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddAnswer}>
          Tambahkan jawaban
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola jawaban di sistem, seperti menambahkan jawaban baru, atau mengubah jawaban yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Jawaban" source={cardContent} />
        <br />
        <Card title={title}>
        <h3>{questionTitle}</h3>

          <Table bordered rowKey="id" dataSource={answers} pagination={false}>
            <Column title="ID Jawaban" dataIndex="id" key="id" align="center" />
            <Column
              title="Jawaban"
              dataIndex="title"
              key="title"
              align="center"
            />
            <Column
              title="Deskripsi Jawaban"
              dataIndex="description"
              key="description"
              align="center"
            />
            <Column
              title="Tipe Soal"
              dataIndex="type"
              key="type"
              align="center"
            />
            <Column
              title="Operasi"
              key="action"
              width={195}
              align="center"
              render={(text, row) => (
                <span>
                  <Button
                    type="primary"
                    shape="circle"
                    icon="edit"
                    title="mengedit"
                    onClick={this.handleEditAnswer.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteAnswer.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditAnswerForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editAnswerFormRef = formRef)}
          visible={this.state.editAnswerModalVisible}
          confirmLoading={this.state.editAnswerModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditAnswerOk}
        />
        <AddAnswerForm
          wrappedComponentRef={(formRef) => (this.addAnswerFormRef = formRef)}
          visible={this.state.addAnswerModalVisible}
          confirmLoading={this.state.addAnswerModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddAnswerOk}
        />
      </div>
    );
  }
}

export default withRouter(Answer);
