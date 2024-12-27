import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import { getQuiz, deleteQuiz, editQuiz, addQuiz } from "@/api/quiz";
import { getQuizAnnouncements ,addQuizAnnouncement,deleteQuizAnnouncement} from "@/api/quizAnnouncement";
import { getQuestions } from "@/api/question";
import { getRPS } from "@/api/rps";

import { Link } from "react-router-dom";
import TypingCard from "@/components/TypingCard";
import EditQuizForm from "./forms/edit-quiz-form";
import AddQuizForm from "./forms/add-quiz-form";
import { getQuestionsByRPS } from "../../api/question";
import moment from "moment";
const { Column } = Table;
class Quiz extends Component {
  state = {
    quiz: [],
    questions: [],
    rps: [],
    criteravaluetest: [],
    editQuizModalVisible: false,
    editQuizModalLoading: false,
    currentRowData: {},
    addQuizModalVisible: false,
    addQuizModalLoading: false,
  };
  getQuiz = async () => {
    const result = await getQuiz();
    const { content, statusCode } = result.data;
    console.log(result.data);
    if (statusCode === 200) {
      this.setState({
        quiz: content,
      });
    }
  };
 
  getQuestions = async () => {
    const result = await getQuestions();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      
      this.setState({
        questions: content,
      });
    }
  };
  updateQuestion = async (id) => {
    const result = await getQuestionsByRPS(id);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredQuestions = content.filter(question => question.examType2 === 'QUIZ');
      this.setState({
        questions: filteredQuestions,
      });
    }
  };
  getRps = async () => {
    const result = await getRPS();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        rps: content,
      });
    }
  };
  handleEditQuiz = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editQuizModalVisible: true,
    });
  };

  handleDeleteQuiz = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    deleteQuiz({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getQuiz();
    });
  };

  handleEditQuizOk = (_) => {
    const { form } = this.editQuizFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editQuiz(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editQuizModalVisible: false,
            editQuizModalLoading: false,
          });
          message.success("berhasi;!");
          this.getQuiz();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editQuizModalVisible: false,
      addQuizModalVisible: false,
    });
  };

  handleAddQuiz = (row) => {
    this.setState({
      addQuizModalVisible: true,
    });
  };

  handleAddQuizOk = (_) => {
    const { form } = this.addQuizFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addQuizModalLoading: true });
      addQuiz(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addQuizModalVisible: false,
            addQuizModalLoading: false,
          });
          message.success("Berhasil!");
          this.getQuiz();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    
    this.getQuiz();
    this.getQuestions();
    this.getRps();
  }
  render() {
    const { quiz, questions, rps } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddQuiz}>
          Tambahkan Kuis
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola Quiz sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list Quiz yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Kuis" source={cardContent} />
        <br />
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={quiz} pagination={false}>
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="RPS"
              dataIndex="rps.name"
              key="rps.name"
              align="center"
            />
            <Column
              title="Nilai Minimal"
              dataIndex="min_grade"
              key="min_grade"
              align="center"
            />
            <Column
              title="Tipe Kuis"
              dataIndex="type_quiz"
              key="type_quiz"
              align="center"
            />
            <Column
              title="Tanggal Mulai"
              dataIndex="date_start"
              key="date_start"
              align="center"
              render={(text) => moment(text).format("DD MMMM YYYY, HH:mm:ss")}
            />
            <Column
              title="Tanggal Selesai"
              dataIndex="date_end"
              key="date_end"
              align="center"
              render={(text) => moment(text).format("DD MMMM YYYY, HH:mm:ss")}
            />
            <Column
              title="Durasi"
              dataIndex="duration"
              key="duration"
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
                    title="Edit Kuis"
                    onClick={this.handleEditQuiz.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Link to={`/setting-quiz/result/${row.id}`}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon="diff"
                      title="Detail Hasil"
                    />
                  </Link>
                  <Divider type="vertical" />
                  <Link to={`/setting-quiz/generate-quiz/${row.id}`}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon="diff"
                      title="Detail Generate Quiz"
                    />
                  </Link>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="Hapus Data"
                    onClick={this.handleDeleteQuiz.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditQuizForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editQuizFormRef = formRef)}
          visible={this.state.editQuizModalVisible}
          confirmLoading={this.state.editQuizModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditQuizOk}
          handleUpdateQuestion={this.updateQuestion}
          questions={questions}
          rpsAll={rps}
        />
        <AddQuizForm
          wrappedComponentRef={(formRef) => (this.addQuizFormRef = formRef)}
          visible={this.state.addQuizModalVisible}
          confirmLoading={this.state.addQuizModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddQuizOk}
          handleUpdateQuestion={this.updateQuestion}
          questions={questions}
          rps={rps}
        />
      </div>
    );
  }
}

export default Quiz;
