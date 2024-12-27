import React, { Component } from "react";
import { Card, Button, Table, Modal } from "antd";
import { getQuiz } from "@/api/quiz";
import { getQuestions } from "@/api/question";
import { getRPS } from "@/api/rps";

import TypingCard from "@/components/TypingCard";
import { getQuestionsByRPS } from "../../api/question";
import { withRouter } from "react-router-dom";
import { getAttemptQuizByUserID } from "../../api/attemptQuiz";
import { getUserInfo } from "../../store/actions/user";
import { connect } from "react-redux";
import moment from "moment";

const { Column } = Table;
class StudentQuiz extends Component {
  state = {
    quiz: [],
    questions: [],
    rps: [],
    editQuizModalVisible: false,
    editQuizModalLoading: false,
    currentRowData: {},
    addQuizModalVisible: false,
    addQuizModalLoading: false,
  };
  getQuiz = async () => {
    const result = await getQuiz();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const attemptQuizResult = await getAttemptQuizByUserID(this.props.idUser);
      const { content: attemptQuizContent, statusCode: attemptQuizStatusCode } =
        attemptQuizResult.data;

      if (attemptQuizStatusCode === 200) {
        const quizWithStatus = content.map((quiz) => {
          const attemptQuiz = attemptQuizContent.find(
            (attempt) => attempt.quiz.id === quiz.id
          );

          // Jika ada data nilai ujian, tambahkan properti status ke quiz dengan nilai dari attemptQuiz.status
          if (attemptQuiz) {
            return {
              ...quiz,
              status: "sudah",
              grade: attemptQuiz.grade,
              state: attemptQuiz.state,
            };
          }

          // Jika tidak ada data nilai ujian, tambahkan properti status ke quiz dengan nilai 'Belum dikerjakan'
          return {
            ...quiz,
            status: "Belum dikerjakan",
          };
        });

        this.setState({
          quiz: quizWithStatus,
        });

        console.log(this.state.quiz);
      }
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
      this.setState({
        questions: content,
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

  handleDoQuiz = (row) => {
    const { history } = this.props;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin memulai ujian?",
      okText: "OK",
      cancelText: "Batal",
      onOk: () => {
        history.push(`/quiz/do/${row.id}`);
      },
      onCancel: () => {
        // Kode yang akan dijalankan saat pengguna menekan tombol "Cancel"
      },
    });
  };

  componentDidMount() {
    this.getQuiz();
    this.getQuestions();
    this.getRps();
  }
  render() {
    const { quiz } = this.state;
    const filteredQuiz = quiz.filter(q => q.questions !== null);
    const title = <span></span>;
    const cardContent = `Di sini, Anda dapat mengelola Quiz sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list Quiz yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Ujian" source={cardContent} />
        <br />
        <Card title={title}>
        <Table bordered rowKey="id" dataSource={filteredQuiz} pagination={false}>
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
              title="Nilai"
              dataIndex="grade"
              key="grade"
              align="center"
              render={(grade, row) => (
                <>{row.status === "sudah" ? <span>{grade}</span> : null}</>
              )}
            />

            <Column
              title="Status"
              dataIndex="state"
              key="state"
              align="center"
              render={(state, row) => (
                <>{row.status === "sudah" ? <span>{state}</span> : null}</>
              )}
            />
            <Column
              title="Operasi"
              key="action"
              width={195}
              align="center"
              render={(text, row) => (
                <span>
                  {row.status === "sudah" ? (
                    <>
                      <Button
                        type="primary"
                        shape="circle"
                        icon="container"
                        title="Ujian Sudah Dikerjakan"
                        disabled
                      />
                    </>
                  ) : (
                    <Button
                      type="primary"
                      shape="circle"
                      icon="container"
                      title="Ujian Sekarang"
                      onClick={this.handleDoQuiz.bind(null, row)}
                    />
                  )}
                </span>
              )}
            />
          </Table>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: () => dispatch(getUserInfo()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StudentQuiz)
);
