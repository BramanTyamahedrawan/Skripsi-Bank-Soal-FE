import React, { Component } from "react";
import { Card, Button, Table, Modal,Typography } from "antd";
import { getExercise } from "@/api/exercise";
import { getQuestions,getQuestionByIdPaged } from "@/api/question";
import { getRPS } from "@/api/rps";

import TypingCard from "@/components/TypingCard";
import { getQuestionsByRPS } from "../../api/question";
import { withRouter } from "react-router-dom";
import { getExerciseAttemptById,getQuestionsFromStudentAnswers } from "../../api/attemptExercise";
import { getUserInfo } from "../../store/actions/user";
import { connect } from "react-redux";


import moment from "moment";

const { Column } = Table;
const { Text } = Typography; // Add this line

class StudentExerciseReview extends Component {
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
  getQuestionsFromStudentAnswers = async () => {
    const result = await getQuestionsFromStudentAnswers(this.props.match.params.id);
    const { content, statusCode } = result.data;
  
    if (result.status === 200) {
        this.setState({
          questions: content,
        });
      }
  };


  componentDidMount = async () => {
    // this.getAttemptExerciseByExerciseID(this.props.match.params.id);
    
    await this.getExerciseAttemptById(); 
  }
  getExerciseAttemptById = async () => {
    const result = await getExerciseAttemptById(this.props.match.params.id);
    const { content } = result.data;
  
    if (result.status === 200) {
      this.setState({
        exercise: content,
      });
  
      // Check that student_answers is defined and is an array
      if (Array.isArray(content.student_answers)) {
        // Fetch the questions for each student answer
        this.getQuestionsFromStudentAnswers(content.student_answers);
      } else {
        console.error('student_answers is not an array');
      }
    }
  };

  render() {
    const { exercise ,rps} = this.state;
    
    
    const title = <span></span>;
    const cardContent = `Di sini, Anda dapat melihat hasil ujian yang telah Anda kerjakan dan merviewnya dengan jawaban yang benar.`;
    return (
      <div className="app-container">
        <TypingCard title="Review Ujian" source={cardContent} />
        <br />
        <Card title={title}>
        <Table bordered rowKey="id" dataSource={exercise}  pagination={false} >   
        <Column
            title="Soal"
            dataIndex="student_answers"
            key="question"
            render={student_answers => (
                <>
                {student_answers.map((answer, index) => (
                    <div key={index} style={{ height: '150px', overflow: 'auto',  }}>
                    <Text>
                        {index + 1}. {answer.question.title}
                    </Text>
                    </div>
                ))}
                </>
            )}
            />
        <Column
            title="Jawaban Anda"
            dataIndex="student_answers"
            key="answer"
            render={student_answers => (
                <>
                {student_answers.map((answer, index) => (
                    answer.answer.title && (
                    <div key={index} style={{ height: '150px', overflow: 'auto', }}>
                        <Text>
                        {index + 1}. {answer.answer.title}
                        </Text>
                    </div>
                    )
                ))}
                </>
            )}
            />
            <Column
            title="Penjelasan"
            dataIndex="explanations"
            key="explanation"
            render={explanations => (
                <>
                {explanations.map((explanation, index) => (
                    <div key={index} style={{ height: '150px', overflow: 'auto' }}>
                    <Text>
                        {index + 1}. {explanation}
                    </Text>
                    </div>
                ))}
                </>
            )}
            />
        <Column
            title="Validasi jawaban anda"
            dataIndex="student_answers"
            key="score"
            render={student_answers => (
                <>
                {student_answers.map((answer, index) => (
                    <div key={index} style={{ height: '150px', overflow: 'auto'}}>
                  <Text>
                    {answer.score === 1 ? "benar" : "salah"}
                  </Text>
                    </div>
                ))}
                </>
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
  connect(mapStateToProps, mapDispatchToProps)(StudentExerciseReview)
);
