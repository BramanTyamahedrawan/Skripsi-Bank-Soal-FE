import React, { Component } from "react";
import { Card, Button, Table, Modal } from "antd";
import { getExam } from "@/api/exam";
import { getQuestions } from "@/api/question";
import { getRPS } from "@/api/rps";

import TypingCard from "@/components/TypingCard";
import { getQuestionsByRPS } from "../../api/question";
import { withRouter } from "react-router-dom";
import { getAttemptExamByUserID } from "../../api/attemptExam";
import { getUserInfo } from "../../store/actions/user";
import { connect } from "react-redux";
import moment from "moment";

const { Column } = Table;
class StudentExam extends Component {
  state = {
    exam: [],
    questions: [],
    rps: [],
    editExamModalVisible: false,
    editExamModalLoading: false,
    currentRowData: {},
    addExamModalVisible: false,
    addExamModalLoading: false,
  };
  getExam = async () => {
    const result = await getExam();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const attemptExamResult = await getAttemptExamByUserID(this.props.idUser);
      const { content: attemptExamContent, statusCode: attemptExamStatusCode } =
        attemptExamResult.data;

      if (attemptExamStatusCode === 200) {
        const examWithStatus = content.map((exam) => {
          const attemptExam = attemptExamContent.find(
            (attempt) => attempt.exam.id === exam.id
          );

          // Jika ada data nilai ujian, tambahkan properti status ke exam dengan nilai dari attemptExam.status
          if (attemptExam) {
            return {
              ...exam,
              status: "sudah",
              grade: attemptExam.grade,
              state: attemptExam.state,
            };
          }

          // Jika tidak ada data nilai ujian, tambahkan properti status ke exam dengan nilai 'Belum dikerjakan'
          return {
            ...exam,
            status: "Belum dikerjakan",
          };
        });

        this.setState({
          exam: examWithStatus,
        });

        console.log(this.state.exam);
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

  handleDoExam = (row) => {
    const { history } = this.props;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin memulai ujian?",
      okText: "OK",
      cancelText: "Batal",
      onOk: () => {
        history.push(`/exam/do/${row.id}`);
      },
      onCancel: () => {
        // Kode yang akan dijalankan saat pengguna menekan tombol "Cancel"
      },
    });
  };

  componentDidMount() {
    this.getExam();
    this.getQuestions();
    this.getRps();
  }
  render() {
    const { exam } = this.state;
    const title = <span></span>;
    const cardContent = `Di sini, Anda dapat mengelola Exam sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list Exam yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Ujian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={exam} pagination={false}>
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
                      onClick={this.handleDoExam.bind(null, row)}
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
  connect(mapStateToProps, mapDispatchToProps)(StudentExam)
);
