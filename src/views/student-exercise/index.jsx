import React, { Component } from "react";
import { Card, Button, Table, Modal } from "antd";
import { getExercise } from "@/api/exercise";
import { getQuestions } from "@/api/question";
import { getRPS } from "@/api/rps";

import TypingCard from "@/components/TypingCard";
import { getQuestionsByRPS } from "../../api/question";
import { withRouter } from "react-router-dom";
import { getAttemptExerciseByUserID } from "../../api/attemptExercise";
import { getUserInfo } from "../../store/actions/user";
import { connect } from "react-redux";
import moment from "moment";

const { Column } = Table;
class StudentExercise extends Component {
  state = {
    exercise: [],
    questions: [],
    rps: [],
    editExerciseModalVisible: false,
    editExerciseModalLoading: false,
    currentRowData: {},
    addExerciseModalVisible: false,
    addExerciseModalLoading: false,
  };
  getExercise = async () => {
    const result = await getExercise();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const attemptExerciseResult = await getAttemptExerciseByUserID(
        this.props.idUser
      );
      const {
        content: attemptExerciseContent,
        statusCode: attemptExerciseStatusCode,
      } = attemptExerciseResult.data;

      if (attemptExerciseStatusCode === 200) {
        const exerciseWithStatus = content.map((exercise) => {
          const attemptExercise = attemptExerciseContent.find(
            (attempt) => attempt.exercise && attempt.exercise.id === exercise.id
          );

          // Jika ada data nilai ujian, tambahkan properti status ke exercise dengan nilai dari attemptExercise.status
          if (attemptExercise) {
            return {
              ...exercise,
              status: "sudah",
              grade: attemptExercise.grade,
              total_right: attemptExercise.total_right,
              state: attemptExercise.state,
              total_wrong: attemptExercise.student_answers.length - attemptExercise.total_right,
              attemptExerciseId: attemptExercise.id, // Added this line

            };
          }

          // Jika tidak ada data nilai ujian, tambahkan properti status ke exercise dengan nilai 'Belum dikerjakan'
          return {
            ...exercise,
            status: "Belum dikerjakan",
          };
        });

        this.setState({
          exercise: exerciseWithStatus,
        });

        console.log(this.state.exercise);
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

  handleDoExercise = (row) => {
    const { history } = this.props;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin memulai ujian?",
      okText: "OK",
      cancelText: "Batal",
      onOk: () => {
        history.push(`/exercise/do/${row.id}`);
      },
      onCancel: () => {
        // Kode yang akan dijalankan saat pengguna menekan tombol "Cancel"
      },
    });
  };
  handleDoExerciseReview = (row) => {
    const { history } = this.props;
  
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin melihat review ujian anda?",
      okText: "OK",
      cancelText: "Batal",
      onOk: () => {
        history.push(`/exercise-review/${row.attemptExerciseId}`); // Modified this line
      },
      onCancel: () => {
        // Code to run when the user clicks "Cancel"
      },
    });
  };
  componentDidMount() {
    this.getExercise();
    this.getQuestions();
    this.getRps();
  }
  render() {
    const { exercise } = this.state;
    const title = <span></span>;
    const cardContent = `Di sini, Anda dapat mengelola Exercise sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list Exercise yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Ujian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={exercise} pagination={false}>
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
              render={(text) => `${text} minute`}
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
              title="Jumlah benar"
              dataIndex="total_right"
              key="total_right"
              align="center"
            />
            <Column
              title="Jumlah salah"
              dataIndex="total_wrong"
              key="total_wrong"
              align="center"
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
                      <Button
                      type="primary"
                      shape="circle"
                      icon="container"
                      title="Review  Sekarang"
                      onClick={this.handleDoExerciseReview.bind(null, row)}
                      // disabled={
                      //   moment().isBefore(row.date_start) ||
                      //   moment().isAfter(row.date_end)
                      // }
                    />
                    </>
                  ) : (
                    <Button
                      type="primary"
                      shape="circle"
                      icon="container"
                      title="Ujian Sekarang"
                      onClick={this.handleDoExercise.bind(null, row)}
                      // disabled={
                      //   moment().isBefore(row.date_start) ||
                      //   moment().isAfter(row.date_end)
                      // }
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
  connect(mapStateToProps, mapDispatchToProps)(StudentExercise)
);
