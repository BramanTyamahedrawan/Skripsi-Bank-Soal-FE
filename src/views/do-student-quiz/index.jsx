import React, { Component } from "react";
import { Card, Button, Modal, Row, Col, Radio, message } from "antd";
import { getQuizByID } from "@/api/quiz";
import { addAttemptQuiz } from "@/api/attemptQuiz";
import { getStudentByUser } from "@/api/student";
import { getAnswers } from "@/api/answer";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "../../store/actions/user";

class DoStudentQuiz extends Component {
  state = {
    quiz: [],
    questions: [],
    selectedAnswers: {},
    editQuizModalVisible: false,
    editQuizModalLoading: false,
    currentQuestion: 1,
    addQuizModalVisible: false,
    addQuizModalLoading: false,
    timerInterval: null,
    remainingTime: 0,
    hadoopURL: "http://hadoop-primary:9870/",
  };

  startTimer = () => {
    const { remainingTime } = this.state;

    const interval = setInterval(() => {
      if (remainingTime > 0) {
        this.setState((prevState) => ({
          remainingTime: prevState.remainingTime - 1,
        }));

        localStorage.setItem("remainingTime", (remainingTime - 1).toString());
      } else {
        clearInterval(this.state.timerInterval);
      }
    }, 1000);

    this.setState({
      timerInterval: interval,
    });
  };

  getQuiz = async (id) => {
    const result = await getQuizByID(id);
    const { content } = result.data;
    if (result.status === 200) {
      const questionsWithNumber = content.questions.map((question, index) => ({
        ...question,
        number: index + 1,
      }));

      const answerPromises = questionsWithNumber.map((question) =>
        this.getAnswers(question.id)
      );

      const answers = await Promise.all(answerPromises);

      const questionsWithAnswers = questionsWithNumber.map(
        (question, index) => ({
          ...question,
          answers: answers[index],
        })
      );

      const duration = content.duration * 60; // Konversi durasi dari menit ke detik

      this.setState({
        quiz: content,
        questions: questionsWithAnswers,
        remainingTime: duration, // Set waktu tersisa awal sesuai dengan durasi ujian
      });

      // Simpan durasi ujian ke dalam storage browser
      localStorage.setItem("quizDuration", duration.toString());

      // Mulai timer
      this.startTimer();
    }
  };

  getAnswers = async (questionID) => {
    const result = await getAnswers(questionID);
    const { content } = result.data;

    if (result.status === 200) {
      return content;
    }
  };

  saveSelectedAnswer = (questionId, answerId) => {
    this.setState((prevState) => ({
      selectedAnswers: {
        ...prevState.selectedAnswers,
        [questionId]: answerId,
      },
    }));
  };

  handleNextQuestion = () => {
    const { currentQuestion, questions } = this.state;
    if (currentQuestion < questions.length) {
      this.setState((prevState) => ({
        currentQuestion: prevState.currentQuestion + 1,
      }));
    }
  };

  handlePreviousQuestion = () => {
    const { currentQuestion } = this.state;
    if (currentQuestion > 1) {
      this.setState((prevState) => ({
        currentQuestion: prevState.currentQuestion - 1,
      }));
    }
  };

  handleQuestionClick = (questionNumber) => {
    this.setState({
      currentQuestion: questionNumber,
    });
  };

  handleSubmit = (row) => {
    const { idUser, history } = this.props;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin mengakhiri ujian?",
      okText: "OK",
      cancelText: "Batal",
      onOk: async () => {
        this.setState({ addAppraisalFormModalLoading: true });
        const result = await getStudentByUser(idUser);
        const { content } = result.data;

        if (result.status === 200) {
          const values = {
            quiz_id: this.props.match.params.id,
            user_id: idUser,
            student_id: content[0].id,
            duration: Math.floor(this.state.remainingTime / 60),
            studentAnswers: Object.values(this.state.selectedAnswers),
          };

          addAttemptQuiz(values)
            .then((response) => {
              message.success("Berhasil menyimpan data!");
              history.push("/quiz");
            })
            .catch((e) => {
              message.success("Gagala menyimpan data!");
            });
        }
      },
      onCancel: () => {
        // Kode yang akan dijalankan saat pengguna menekan tombol "Cancel"
      },
    });
  };

  componentDidMount() {
    const storedDuration = localStorage.getItem("quizDuration");

    if (storedDuration) {
      const duration = parseInt(storedDuration, 10);

      const storedRemainingTime = localStorage.getItem("remainingTime");
      let remainingTime = duration;

      if (storedRemainingTime) {
        remainingTime = parseInt(storedRemainingTime, 10);
      } else {
        localStorage.setItem("remainingTime", remainingTime.toString());
      }

      this.setState({
        remainingTime,
      });

      this.startTimer();
    }

    this.getQuiz(this.props.match.params.id);

    window.addEventListener("beforeunload", this.handleBeforeUnload);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);

    const { remainingTime } = this.state;
    localStorage.setItem("remainingTime", remainingTime.toString());
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }

  handleBeforeUnload = () => {
    const { remainingTime } = this.state;
    localStorage.setItem("remainingTime", remainingTime.toString());
  };

  render() {
    const { questions, currentQuestion, hadoopURL } = this.state;

    const currentQuestionData = questions.find(
      (question) => question.number === currentQuestion
    );

    const isFirstQuestion = currentQuestion === 1;
    const isLastQuestion = currentQuestion === questions.length;

    const currentAnswers = currentQuestionData?.answers || [];
    const { selectedAnswers } = this.state;

    const { remainingTime } = this.state;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div className="app-container">
        <Card
          title={
            "Waktu tersisa: " +
            minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0")
          }
        >
          <Row>
            <Col span={18}>
              <Card>
                <Row>
                  <Col span={4}>
                    <p>No. Soal</p>
                    <h1>{currentQuestion}</h1>
                  </Col>
                  <Col span={20}>
                    {currentQuestionData ? (
                      <>
                        <h2>
                          Pertanyaan:
                          <br />
                          {currentQuestionData?.title}
                        </h2>
                        {currentQuestionData?.question_type === "VIDEO" && (
                          <video
                            src={hadoopURL + currentQuestionData?.file_path}
                            controls
                            style={{ width: "100%" }}
                          />
                        )}
                        {currentQuestionData?.question_type === "AUDIO" && (
                          <audio
                            src={hadoopURL + currentQuestionData?.file_path}
                            controls
                            style={{ width: "100%" }}
                          />
                        )}
                        {currentQuestionData?.question_type === "IMAGE" && (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img
                            src={hadoopURL + currentQuestionData?.file_path}
                            alt={currentQuestionData?.title}
                            style={{ width: "100%" }}
                          />
                        )}
                        <br />
                        <br />
                        <h1>Pilih salah satu jawaban:</h1>
                        <br />

                        <Radio.Group
                          name="answer"
                          value={selectedAnswers[currentQuestionData.id]}
                          onChange={(e) =>
                            this.saveSelectedAnswer(
                              currentQuestionData?.id,
                              e.target.value
                            )
                          }
                        >
                          {currentAnswers.map((answer) => (
                            <div
                              key={answer.id}
                              style={{
                                display: "grid",
                                gridTemplateRows: "auto 1fr",
                                paddingBottom: "20px",
                              }}
                            >
                              <Radio value={answer.id}>{answer.title}</Radio>
                              {/* {answer.type === "NORMAL" && <p>{answer.title}</p>} */}
                              {answer.type === "VIDEO" && (
                                <>
                                  <video
                                    src={hadoopURL + answer.file_path}
                                    controls
                                    style={{ width: "200px" }}
                                  />
                                </>
                              )}
                              {answer.type === "AUDIO" && (
                                <audio
                                  src={hadoopURL + answer.file_path}
                                  controls
                                />
                              )}
                              {answer.type === "IMAGE" && (
                                <img
                                  src={hadoopURL + answer.file_path}
                                  alt={answer.title}
                                  style={{ width: "200px" }}
                                />
                              )}
                            </div>
                          ))}
                        </Radio.Group>
                      </>
                    ) : (
                      <p>Tidak ada pertanyaan yang tersedia.</p>
                    )}
                  </Col>
                </Row>
                <Row justify="space-between">
                  <Col span={12} align="start">
                    <Button
                      type="secondary"
                      onClick={this.handlePreviousQuestion}
                      disabled={isFirstQuestion}
                    >
                      Sebelumnya
                    </Button>
                  </Col>
                  <Col span={12} align="end">
                    <Button
                      type="primary"
                      onClick={
                        isLastQuestion
                          ? this.handleSubmit
                          : this.handleNextQuestion
                      }
                    >
                      {isLastQuestion ? "Simpan" : "Selanjutnya"}
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={6}>
              <Card title={"Nomor"}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {questions.map((question) => (
                    <div
                      key={question.number}
                      className={`question-number ${
                        question.number === currentQuestion ? "active" : ""
                      }`}
                      onClick={() => this.handleQuestionClick(question.number)}
                      style={{
                        margin: "5px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {question.number}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
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
  connect(mapStateToProps, mapDispatchToProps)(DoStudentQuiz)
);
