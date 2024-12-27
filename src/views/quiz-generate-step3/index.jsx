import React, { Component } from "react";
import { Row, Col, Icon } from "antd";
import TypingCard from "@/components/TypingCard";
import { Button,  Table,Select } from "antd";
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
class QuizGenerate extends Component {
    constructor(props) {
      super(props);
      this.state = {
          rps: [],
          quiz: [],
          userInfo: [],
          quizId:'',
          questionsWithCriteria: [], // Ensure this is initialized
          selectedLecturer: '',
          devLecturerIds: [],
          devLecturers: [],
          isMounted: false,        // Initialize as an empty array
          
      };
  }
    
  handleNextPage = ( quizId) => {
  
    const { history } = this.props;
  
    history.push(`/setting-quiz/generate-quiz-step4/${quizId}`);
  };

  handlePreviousPage = ( quizId) => {
    const { history } = this.props;
  
    history.push(`/setting-quiz/generate-quiz-step2/${quizId}`);
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

      if (quizStatusCode === 200 && rpsStatusCode === 200) {
        quizContent.forEach(quiz => {
          const matchingRPS = rpsContent.find(rps => rps.id === quiz.rps.id);
          if (matchingRPS) {
            devLecturers.push(...matchingRPS.dev_lecturers);
            console.log(`Dev Lecturers for quiz ${quiz.id}:`, matchingRPS.dev_lecturers);
          } else {
            console.log(`No matching RPS found for quiz ${quiz.id}`);
          }
          this.setState({
            quizId: quiz.id,
            // other state properties if any
          });
        });
      }

      if (this.state.isMounted) {
        this.setState({ devLecturers });
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  selectLecture = (lecturerName) => {
    this.setState({ selectedLecturer: lecturerName, isMounted: false }, this.fetchData);
  };
  calculateAverage(values) {
    let sum = 0;
    let count = 0;

    for (let i = 0; i < values.length; i++) {
      if (values[i] && values[i].value1 && values[i].value1.average !== undefined) {
        sum += parseFloat(values[i].value1.average);
        count++;
      }
    }

    return count > 0 ? (sum / count).toFixed(2) : 'N/A';
  }

render() {
  const { questionsWithCriteria, quizId, devLecturers, devLecturerIds, matchingRPS } = this.state;

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
  
  function calculateAverageOfAverages(criteriaValues) {
  const averages = criteriaValues.reduce((acc, curr) => {
    criteriaNames.forEach((name, index) => {
      const key = `value${index + 1}`;
      if (curr[key] && 'average' in curr[key]) {
        if (!acc[name]) {
          acc[name] = {
            sum: 0,
            count: 0,
          };
        }
        acc[name].sum += parseFloat(curr[key].average);
        acc[name].count += 1;
      }
    });
    return acc;
  }, {});

  // Calculate the average for each value
  criteriaNames.forEach((name) => {
    if (averages[name]) {
      averages[name] = (averages[name].sum / averages[name].count).toFixed(4);
    }
  });

  return averages;
}

const columns = [
  {
    title: 'Pertanyaan',
    dataIndex: 'title',
    key: 'title',
  },
  ...criteriaNames.map((name, index) => ({
    title: name,
    key: `value${index + 1}Name`,
    render: (text, record) => {
      const averages = calculateAverageOfAverages(record.criteriaValues);
      return <span>{averages[name]}</span>;
    }
  }))
];
  
  return (
    <div>
    {/* <h4>{selectedLecturer}</h4> */}
    

      <TypingCard source="Tahap 3 yaitu mengubah numerik menjadi matrix fuzzy" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <div>
          <Button type="primary" onClick={() => this.handlePreviousPage(quizId)}>
            Tahap 2
          </Button>
        </div>
        <div>
        <Button type="primary" onClick={() => this.handleNextPage(quizId)}>
          Tahap 4
        </Button>
        </div>
      </div>
    <br />
    <br />
      <Table dataSource={questionsWithCriteria}  columns={columns}  pagination={false} rowKey="id"></Table>

      
    </div>
  );
}

}

export default QuizGenerate;
