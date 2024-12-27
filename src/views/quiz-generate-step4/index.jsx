import React, { Component } from "react";
import { Row, Col, Icon,Button } from "antd";
import TypingCard from "@/components/TypingCard";
import { Card,  Table,Select } from "antd";
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
          isMounted: false,  
          
      };
  }
    
  handleNextPage = ( quizId) => {
  
    const { history } = this.props;
  
    history.push(`/setting-quiz/generate-quiz-step5/${quizId}`);
  };

  handlePreviousPage = ( quizId) => {
    const { history } = this.props;
  
    history.push(`/setting-quiz/generate-quiz-step3/${quizId}`);
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
        const rpsID = matchingRPS.id;

        const result = await getQuestionsByRPSQuiz1(rpsID);
        const { content, statusCode } = result.data;

        if (statusCode === 200) {
          const quizQuestions = content.filter(question => question.examType2 === 'QUIZ');

          const questionsWithCriteria = await Promise.all(quizQuestions.map(async (question) => {
            const criteriaResult = await getAllCriteriaValueByQuestion(question.id);
            if (criteriaResult.data.statusCode === 200 ) {
              question.criteriaValues = criteriaResult.data.content;
             // Calculate the average of value1.avg for each question's responses
            const totalAvg1 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value1.average), 0);
            const avgOfAvgValue1 = totalAvg1 / question.criteriaValues.length;
            
            const totalAvg2 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value2.average), 0);
            const avgOfAvgValue2 = totalAvg2 / question.criteriaValues.length;

            const totalAvg3 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value3.average), 0);
            const avgOfAvgValue3 = totalAvg3 / question.criteriaValues.length;

            const totalAvg4 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value4.average), 0);
            const avgOfAvgValue4 = totalAvg4 / question.criteriaValues.length;

            const totalAvg5 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value5.average), 0);
            const avgOfAvgValue5 = totalAvg5 / question.criteriaValues.length;

            const totalAvg6 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value6.average), 0);
            const avgOfAvgValue6 = totalAvg6 / question.criteriaValues.length;

            const totalAvg7 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value7.average), 0);
            const avgOfAvgValue7 = totalAvg7 / question.criteriaValues.length;

            const totalAvg8 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value8.average), 0);
            const avgOfAvgValue8 = totalAvg8 / question.criteriaValues.length;

            const totalAvg9 = question.criteriaValues.reduce((sum, response) => sum + parseFloat(response.value9.average), 0);
            const avgOfAvgValue9 = totalAvg9 / question.criteriaValues.length;

            // Add the average to the question object
            question.avgOfAvgValue1 = avgOfAvgValue1;
            question.avgOfAvgValue2 = avgOfAvgValue2;
            question.avgOfAvgValue3 = avgOfAvgValue3;
            question.avgOfAvgValue4 = avgOfAvgValue4;
            question.avgOfAvgValue5 = avgOfAvgValue5;
            question.avgOfAvgValue6 = avgOfAvgValue6;
            question.avgOfAvgValue7 = avgOfAvgValue7;
            question.avgOfAvgValue8 = avgOfAvgValue8;
            question.avgOfAvgValue9 = avgOfAvgValue9;

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
      });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 
    calculateMinMax(questionsWithCriteria) {
      const calculateTop3MinMax = (array) => {
          const top3 = array.slice(0, 3);
          return {
              min: Math.min(...top3),
              max: Math.max(...top3)
          };
      };

      const averagesArray1 = questionsWithCriteria.map(question => question.avgOfAvgValue1);
      const { min: minValue1, max: maxValue1 } = calculateTop3MinMax(averagesArray1);

      const averagesArray2 = questionsWithCriteria.map(question => question.avgOfAvgValue2);
      const { min: minValue2, max: maxValue2 } = calculateTop3MinMax(averagesArray2);

      const averagesArray3 = questionsWithCriteria.map(question => question.avgOfAvgValue3);
      const { min: minValue3, max: maxValue3 } = calculateTop3MinMax(averagesArray3);

      const averagesArray4 = questionsWithCriteria.map(question => question.avgOfAvgValue4);
      const { min: minValue4, max: maxValue4 } = calculateTop3MinMax(averagesArray4);

      const averagesArray5 = questionsWithCriteria.map(question => question.avgOfAvgValue5);
      const { min: minValue5, max: maxValue5 } = calculateTop3MinMax(averagesArray5);

      const averagesArray6 = questionsWithCriteria.map(question => question.avgOfAvgValue6);
      const { min: minValue6, max: maxValue6 } = calculateTop3MinMax(averagesArray6);

      const averagesArray7 = questionsWithCriteria.map(question => question.avgOfAvgValue7);
      const { min: minValue7, max: maxValue7 } = calculateTop3MinMax(averagesArray7);

      const averagesArray8 = questionsWithCriteria.map(question => question.avgOfAvgValue8);
      const { min: minValue8, max: maxValue8 } = calculateTop3MinMax(averagesArray8);

      const averagesArray9 = questionsWithCriteria.map(question => question.avgOfAvgValue9);
      const { min: minValue9, max: maxValue9 } = calculateTop3MinMax(averagesArray9);

      return {
          minValue1, maxValue1,
          minValue2, maxValue2,
          minValue3, maxValue3,
          minValue4, maxValue4,
          minValue5, maxValue5,
          minValue6, maxValue6,
          minValue7, maxValue7,
          minValue8, maxValue8,
          minValue9, maxValue9
      };
    }
    
  
render() {
  const { questionsWithCriteria, quizId, devLecturerIds, matchingRPS } = this.state;


const columns2 = [
  {
    title: 'Pertanyaan',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Evaluation',
    key: 'avgOfAvgValue1',
    render: (text, record) => {

      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];

        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value1.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });

        // Calculate the total average
        const totalAvg1 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);

        // Calculate the average of averages
        const avgOfAvgValue1 = totalAvg1 / tempAveragesArray.length;

        const { minValue1, maxValue1 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue1 - avgOfAvgValue1) / (maxValue1 - minValue1);

        return (
          <div>

            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }

      return 'N/A';
    },
    
  },
  {
    title: 'Synthesis',
    key: 'avgOfAvgValue2',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value2.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg2 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue2 = totalAvg2 / tempAveragesArray.length;
    
        const { minValue2, maxValue2 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue2 - avgOfAvgValue2) / (maxValue2 - minValue2);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    } 
  },
  {
    title: 'Comprehension',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value3.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg3 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue3 = totalAvg3 / tempAveragesArray.length;
    
        const { minValue3, maxValue3 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue3 - avgOfAvgValue3) / (maxValue3 - minValue3);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
  },
  {
    title: 'Analysis',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value4.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg4 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue4 = totalAvg4 / tempAveragesArray.length;
    
        const { minValue4, maxValue4 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue4 - avgOfAvgValue4) / (maxValue4 - minValue4);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
  },
  {
    title: 'Difficulty',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value5.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg5 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue5 = totalAvg5 / tempAveragesArray.length;
    
        const { minValue5, maxValue5 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue5 - avgOfAvgValue5) / (maxValue5 - minValue5);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
    
  },
  {
    title: 'Reliability',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value6.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg6 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue6 = totalAvg6 / tempAveragesArray.length;
    
        const { minValue6, maxValue6 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue6 - avgOfAvgValue6) / (maxValue6 - minValue6);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
  },
  {
    title: 'Discrimination',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value7.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg7 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue7 = totalAvg7 / tempAveragesArray.length;
    
        const { minValue7, maxValue7 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue7 - avgOfAvgValue7) / (maxValue7 - minValue7);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
  },
  {
    title: 'Application',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value8.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg8 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue8 = totalAvg8 / tempAveragesArray.length;
    
        const { minValue8, maxValue8 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue8 - avgOfAvgValue8) / (maxValue8 - minValue8);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
  },
  {
    title: 'Knowledge',
    key: 'avgOfAvgValue1',
    render: (text, record) => {
      // Check if record.criteriaValues exists and is not empty
      if (record.criteriaValues && record.criteriaValues.length > 0) {
        // Temporary array to store individual averages
        const tempAveragesArray = [];
    
        // Use map to extract the averages and push them into the temporary array
        record.criteriaValues.map(response => {
          const avg = parseFloat(response.value9.average); // Parse value1.average directly
          tempAveragesArray.push(avg);
        });
    
        // Calculate the total average
        const totalAvg9 = tempAveragesArray.reduce((sum, avg) => sum + avg, 0);
    
        // Calculate the average of averages
        const avgOfAvgValue9 = totalAvg9 / tempAveragesArray.length;
    
        const { minValue9, maxValue9 } = this.calculateMinMax(questionsWithCriteria);
        const result = 0.11 * (maxValue9 - avgOfAvgValue9) / (maxValue9 - minValue9);
    
        return (
          <div>
            <div>Calculated Value: {result.toFixed(3)}</div>
          </div>
        );
      }
    
      return 'N/A';
    }
  },
];
  
  return (
    <div>
            

      <TypingCard source="Tahap 4 Menormalisasikan matrix fuzzy yang di dapat" />
     
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <div>
            <Button type="primary" onClick={() => this.handlePreviousPage(quizId)}>
              Tahap 3
            </Button>
          </div>
          <div>
            <Button type="primary" onClick={() => this.handleNextPage(quizId)}>
                Tahap 5
            </Button>
          </div>
      </div>

      <br />
      <br />
      <Table dataSource={questionsWithCriteria}  columns={columns2}  pagination={false} rowKey="id"></Table>
        
    </div>
  );
}

}

export default QuizGenerate;
