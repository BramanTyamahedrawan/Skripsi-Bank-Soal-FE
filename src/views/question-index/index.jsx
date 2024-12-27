import React, { Component } from "react";
import { Card, Button, Table, message, Divider,Checkbox } from "antd";
import{
    getAllQuestionsByRPS,
} from "@/api/criteriaValue";
import {
    getRPSDetail,
  } from "@/api/rpsDetail";
import TypingCard from "@/components/TypingCard";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";


const { Column } = Table;

class questionIndex extends Component {
    state ={
        criteriaValue:[],
        rpsDetail: [],
        allQuestions: [],
        questions:[],
        editCriteriaValueModalVisible: false,
        editCriteriaValueModalLoading: false,
        currentRowData: {},
        addCriteriaValueModalVisible: false,
        addCriteriaValueModalLoading: false,
        rpsID: "",
        selectedExamTypes: {
            EXERCISE: false,
            QUIZ: false,
            EXAM: false,
        },
        
    };
    getQuestions = async (rpsDetailID) => {
        const result = await getAllQuestionsByRPS(rpsDetailID);
        const { content, statusCode } = result.data;
        if (statusCode === 200) {
          this.setState({
            questions: content,
          });
        }
      };
      getQuestionsQuiz = async (rpsID) => {
        const result = await getAllQuestionsByRPS(rpsID);
        const { content, statusCode } = result.data;
      
        if (statusCode === 200) {
          return content.filter(question => 
            question.examType2 === 'QUIZ'
          );
        }
      
        return [];
      }
      
      getQuestionsExam = async (rpsID) => {
        const result = await getAllQuestionsByRPS(rpsID);
        const { content, statusCode } = result.data;
      
        if (statusCode === 200) {
          return content.filter(question => 
            question.examType3 === 'EXAM'
          );
        }
      
        return [];
      }
      
      getQuestionsExercise = async (rpsID) => {
        const result = await getAllQuestionsByRPS(rpsID);
        const { content, statusCode } = result.data;
      
        if (statusCode === 200) {
          return content.filter(question => 
            question.examType === 'EXERCISE'
          );
        }
      
        return [];
      }
     

      componentDidMount() {
        const rpsID = this.props.match.params.rpsID;
        this.setState({ rpsID });
      
        if (this.state.selectedExamTypes.length === 0) {
          this.getQuestions(rpsID);
        } else {
          this.fetchAllQuestions();
        }
      }
    handleLinkClick = (id) => {
        this.setState({
          selectedQuestionID: id,
        });
    };
    fetchAllQuestions = async () => {
        const quizQuestions = await this.getQuestionsQuiz(this.state.rpsID);
        const examQuestions = await this.getQuestionsExam(this.state.rpsID);
        const exerciseQuestions = await this.getQuestionsExercise(this.state.rpsID);
      
        this.setState({
          allQuestions: [...quizQuestions, ...examQuestions, ...exerciseQuestions],
          questions: [...quizQuestions, ...examQuestions, ...exerciseQuestions],
        });
      };
      
      handleCheckboxChange = (checkedValues) => {
        const filteredQuestions = this.state.allQuestions.filter(question => 
          checkedValues.includes(question.examType) ||
          checkedValues.includes(question.examType2) ||
          checkedValues.includes(question.examType3)
        );
      
        this.setState({ questions: filteredQuestions });
      };
    render(){
        const { questions } = this.state;
        const options = ['EXERCISE', 'QUIZ 1', 'UTS', 'QUIZ 2','UAS'];

        const title =(
            <div> Pilih pertanyaan yang akan dinilai</div>
        );
        const cardContent = `Di sini, Anda dapat memilih pertanyaan di sistem, lalu memberinya nilai masing masing kriteria.`;
        return(
            <div>
                
                <TypingCard title={title} source={cardContent} />
                <Checkbox.Group
                options={options}
                onChange={this.handleCheckboxChange}
                style={{ display: 'flex', justifyContent: 'flex-start' }}
                />
                <br />
                <Card title="Pertanyaan" >
                    <Table dataSource={questions} rowKey="id">
                    <Column
                    title="ID Pertanyaan"
                    dataIndex="id"
                    key="id"
                    align="center"
                    />
                    <Column
                    title="Pertanyaan"
                    dataIndex="title"
                    key="title"
                    align="center"
                    />
                    <Column
                    title="Operasi"
                    key="action"
                    width={195}
                    align="center"
                    render={(text, row) => (
                        <span>
                        
                        <Divider type="vertical" />
                        <Link to={`/index/criteria/${row.id}`} onClick={() => {
                            
                            this.handleLinkClick(row.id);
                            }}>
                            <Button
                                type="primary"
                                shape="circle"
                                icon="diff"
                                title="menghapus"
                            />
                            </Link>
                            <Divider type="vertical" />
                        
                        </span>
                    )}
                    />
                    
                    </Table>
                </Card>
            </div>
            
        )
    }

}
export default withRouter(questionIndex);