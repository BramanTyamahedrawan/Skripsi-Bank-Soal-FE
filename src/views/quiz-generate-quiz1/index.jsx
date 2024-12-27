import React, { Component } from "react";
import TypingCard from "@/components/TypingCard";
import { Button,  Table,Tabs } from "antd";
import{
    getQuestionsByRPSQuiz1,
  } from "@/api/quiz";
  import{
    getAllCriteriaValueByQuestion,
  } from "@/api/criteriaValue";
import { getQuiz } from "@/api/quiz";
import { getRPS } from "@/api/rps";
import {reqUserInfo} from "@/api/user";

const { Column } = Table;
const { TabPane } = Tabs;

class QuizGenerate extends Component {
    constructor(props) {
      super(props);
      this.state = {
          rps: [],
          quiz: [],
          userInfo: [],
          questionsWithCriteria: [], // Ensure this is initialized
          selectedLecturer: '',
          quizId:'',
          devLecturerIds: [],
          devLecturers: [],
          isMounted: false,   
          matchingRPS:''    // Initialize as an empty array
          
      };
  }
    

  handleNextPage = ( quizId) => {
  
    const { history } = this.props;
  
    history.push(`/setting-quiz/generate-quiz-step2/${quizId}`);
  };

  handlePreviousPage = () => {
    const { history } = this.props;
    const id = this.props.match.params.quizID; // Replace with your actual ID logic
  
    history.push(`/setting-quiz/`);
    
  };
    
  async componentDidMount() {
    this.setState({ isMounted: true });
    await this.fetchData();
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  fetchData = async () => {
    try {
      const quizResponse = await getQuiz();
      const { content: quizContent, statusCode: quizStatusCode } = quizResponse.data;

      const userInfoResponse = await reqUserInfo();
      const { content: userInfoContent, statusCode: userInfoStatusCode } = userInfoResponse.data;

      const rpsResponse = await getRPS();
      const { content: rpsContent, statusCode: rpsStatusCode } = rpsResponse.data;

      let devLecturers = [];
      let matchingRPS=[];

      if (quizStatusCode === 200 && rpsStatusCode === 200) {
        const processedRPSIds = new Set();
      
        quizContent.forEach(quiz => {
          const matchingRPS = rpsContent.find(rps => rps.id === quiz.rps.id);
          if (matchingRPS) {
            if (!processedRPSIds.has(matchingRPS.id)) {
              devLecturers.push(...matchingRPS.dev_lecturers);
              processedRPSIds.add(matchingRPS.id);
              console.log(`Dev Lecturers for quiz ${quiz.id}:`, matchingRPS.dev_lecturers);
            } else {
              console.log(`RPS ${matchingRPS.id} already processed for quiz ${quiz.id}`);
            }
          } else {
            console.log(`No matching RPS found for quiz ${quiz.id}`);
          }
          this.setState({
            quizId: quiz.id,
            matchingRPS: matchingRPS,
            // other state properties if any
          });
        });
      }
      if (quizStatusCode === 200 && rpsStatusCode === 200) {
        quizContent.forEach(async (quiz) => {
          const matchingRPS = rpsContent.find(rps => rps.id === quiz.rps.id);
          if (matchingRPS) {
            const rpsID = matchingRPS.id;
            
            const result = await getQuestionsByRPSQuiz1(rpsID);
            const { content, statusCode } = result.data;
      
            if (statusCode === 200) {
              const quizQuestions = content.filter(question => question.examType2 === 'QUIZ');
      
              const questionsWithCriteria = await Promise.all(quizQuestions.map(async (question) => {
                const criteriaResult = await getAllCriteriaValueByQuestion(question.id);
                if (criteriaResult.data.statusCode === 200 ) {
                  question.criteriaValues = criteriaResult.data.content;
                } else {
                  question.criteriaValues = [];
                }
                return question;
              }));
      
              if (this.state.isMounted) {
                this.setState({
                  rpsContent: rpsContent,
                  questionsWithCriteria: questionsWithCriteria,
                });
              }
            }
          }
        });
      }
      // quizId: quiz.id,

      if (this.state.isMounted) {
        this.setState({ devLecturers });
      }

      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  selectLecture = (lecturerName) => {
    this.setState({ selectedLecturer: lecturerName, isMounted: false }, this.fetchData);
  };

render() {
  const { questionsWithCriteria, selectedLecturer, devLecturers, quizId, matchingRPS } = this.state;

  // Filter the questionsWithCriteria array based on selectedLecturer and user
  const filteredData = questionsWithCriteria
  .filter(item => item.user === this.state.selectedLecturer)
  .map(item => ({
    id: item.id,
    title: item.question.title,
    user: item.user,
  }));
  const values = Array.from({ length: 9 }, (_, i) => i + 1);

  const criteriaNames = [
    "Evaluation",
    "Synthesis",
    "Comprehension",
    "Analysis",
    "Difficulty",
    "Reliability",
    "Discrimination",
    "Application",
    "Knowledge"
  ];
  
  const columns = values.map((value, index) => (
    <Column
      title={criteriaNames[index]}
      key={`value${value}Name`}
      render={(text, record) => (
        <span>
          {record.criteriaValues && record.criteriaValues[0] && record.criteriaValues[0].user === selectedLecturer
            ? record.criteriaValues[0][`value${value}`].name
            : record.criteriaValues && record.criteriaValues[1] && record.criteriaValues[1].user === selectedLecturer
            ? record.criteriaValues[1][`value${value}`].name
            : record.criteriaValues && record.criteriaValues[2] && record.criteriaValues[2].user === selectedLecturer
            ? record.criteriaValues[2][`value${value}`].name
            : 'N/A'}
        </span>
      )}
    />
  ));
  return (
    <div>
    {/* <h4>{selectedLecturer}</h4> */}
    

      <TypingCard source="Daftar Nilai Quiz Berdasarkan Dosen Yang Menilai" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
      <div>
        <Button type="primary" onClick={this.handlePreviousPage}>
          Previous Page
        </Button>
      </div>
      <div>
        <Button type="primary" onClick={() => this.handleNextPage(quizId)}>
          Next Page
        </Button>
      </div>
    </div>

      <br />
      <br />

    
      <Tabs onChange={this.selectLecture} style={{ marginBottom: 20 }}>
          {devLecturers.map((lecturer, index) => (
            <TabPane tab={lecturer.name} key={lecturer.id}>
              <Table dataSource={questionsWithCriteria} pagination={false} rowKey="id">
                {columns}
              </Table>
            </TabPane>
          ))}
        </Tabs>
      
    </div>
  );
}

}

export default QuizGenerate;
