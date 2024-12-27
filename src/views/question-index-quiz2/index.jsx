import React, { Component } from "react";
import { Card, Button, Table, message, Divider,Checkbox } from "antd";
import{
  getQuestionsByRPSQuiz2,
} from "@/api/quiz";
import {
    getRPSDetail,
  } from "@/api/rpsDetail";
import TypingCard from "@/components/TypingCard";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const { Column } = Table;

class QuestionIndexQuiz2 extends Component {

    state ={
      criteriaValue:[],
      rpsDetail: [],
      questions:[],
      currentRowData: {},
      rpsID: "",
    };  

    getQuestionsQuiz = async (rpsID) => {
      const result = await getQuestionsByRPSQuiz2(rpsID);
      const { content, statusCode } = result.data;
    
      if (statusCode === 200) {
        return content.filter(question => 
          question.examType2 === 'QUIZ'
        );
      }
    
      return [];
    }

    componentDidMount() {
      const rpsID = this.props.match.params.rpsID;
        this.setState({ rpsID });
      this.getQuestionsQuiz(rpsID).then(questions => {
        this.setState({ questions });
      });
    }

    handleLinkClick = (id) => {
        this.setState({
          selectedQuestionID: id,
        });
    };

    render() {
      const { questions } = this.state;
      return (
        <div>
          <TypingCard source="Daftar Pertanyaan Quiz" />
          <Card title="Daftar Pertanyaan Quiz">
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
      );
    }

    
};
export default withRouter(QuestionIndexQuiz2);