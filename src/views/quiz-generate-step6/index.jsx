import React, { Component } from "react";
import { Row, Col, message,Button } from "antd";
import TypingCard from "@/components/TypingCard";
import { Card,  Table,Select } from "antd";
import{
    getQuestionsByRPSQuiz1,
  } from "@/api/quiz";
  import{
    getAllCriteriaValueByQuestion,
  } from "@/api/criteriaValue";
import { getQuiz ,addQuiz} from "@/api/quiz";
import { getRPS } from "@/api/rps";
import {reqUserInfo} from "@/api/user";
import AddQuizForm from "./forms/add-quiz-form";

const { Column } = Table;
class QuizGenerate extends Component {
    constructor(props) {
      super(props);
      this.state = {
          rps: [],
          quiz: [],
          userInfo: [],
          quizId:'',
          quizName: '',
          quizDuration:'',
          quizDesc:'',
          quizRpsId:'',
          quizMinGrade:'',
          quizType:'',
          content: [],
          questionsWithCriteria: [], // Ensure this is initialized
          devLecturerIds: [],
          devLecturers: [],
          isMounted: false,  
          list_questions: [],
          addQuizModalVisible: false,
          addQuizModalLoading: false,

          
      };
  }
    
  getRps = async () => {
    const result = await getRPS();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        rps: content,
      });
    }
  };
  getQuiz = async () => {
    const result = await getQuiz();
    const { content, statusCode } = result.data;
    console.log(result.data);
    if (statusCode === 200) {
      this.setState({
        quiz: content,
      });
    }
  };
  getQuestions = async (id) => {
    const result = await getQuestionsByRPSQuiz1(id);
    const { content, statusCode } = result.data;
  
    if (statusCode === 200) {

      // Process the results to calculate ranks
      const results =this.calculateResult(this.state.questionsWithCriteria);
  
      // Adjust chunking logic to handle cases where the number of questions is less than 9
      const chunkSize = Math.min(9, results.length);
      const chunks = results.reduce((acc, result, index) => {
        const chunkIndex = Math.floor(index / chunkSize);
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(result);
        return acc;
      }, []);
  
      const maxValues = chunks.map(chunk => Math.max(...chunk));
      const sumValues = chunks.map(chunk => chunk.reduce((sum, value) => sum + value, 0));
  
      const overallMax = Math.max(...maxValues);
      const overallMin = Math.min(...maxValues);
      const Smax = Math.max(...sumValues);
      const Smin = Math.min(...sumValues);
  
      const resultsWithRanks = chunks.map((chunk, chunkIndex) => {
        const maxResult = Math.max(...chunk);
        const sumResult = chunk.reduce((sum, value) => sum + value, 0);
        const questionTitle = content[chunkIndex]?.title || `Question ${chunkIndex + 1}`;
  
        const normalizedMax = overallMax !== overallMin ? (maxResult - overallMin) / (overallMax - overallMin) : 0;
        const normalizedSum = Smax !== Smin ? (sumResult - Smin) / (Smax - Smin) : 0;
  
        const result = (0.5 * normalizedSum + (1 - 0.5) * normalizedMax).toFixed(3);
  
        return { questionTitle, result: parseFloat(result), originalIndex: chunkIndex };
      });
  
      const sortedResults = [...resultsWithRanks].sort((a, b) => a.result - b.result);
  
      const rankedResults = sortedResults.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  
      const sortedQuestions = rankedResults.map(item => ({
        ...content[item.originalIndex],
        id: item.rank, // Update the id based on rank
        rank: item.rank, // Add rank to each question
      }));
  
      this.setState({
        list_questions: sortedQuestions,
      });
    }
  };
 
  async componentDidMount() {
    this.setState({ isMounted: true });
    await this.fetchData();
    const rpsResponse = await getRPS();
    const { content: rpsContent, statusCode: rpsStatusCode } = rpsResponse.data;
    const rpsID = rpsContent[0].id;
    this.getQuestions(rpsID);

    this.getRps();
  }
   handleCancel = (_) => {
    this.setState({
      editQuizModalVisible: false,
      addQuizModalVisible: false,
    });
  };

  handleAddQuiz = (row) => {
    this.setState({
      addQuizModalVisible: true,
    });
  };

  handleAddQuizOk = (_) => {
    const { form } = this.addQuizFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addQuizModalLoading: true });
      addQuiz(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addQuizModalVisible: false,
            addQuizModalLoading: false,
          });
          message.success("Berhasil!");
          this.getQuiz();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };

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
          }  this.setState({
            quizId: quiz.id,
            quizName : quiz.name,
            quizDuration : quiz.duration,
            quizDesc : quiz.description,
            quizRpsId : quiz.rps.id,
            quizMinGrade: quiz.min_grade,
            quizType: quiz.type_quiz

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
    calculateResult(questionsWithCriteria) {
      const calculateResultForArray = (array, index, minValue, maxValue) => {
        const q = array.slice(index, index + 1);
        const avgOfAvgValue = q.reduce((sum, avg) => sum + avg, 0) / q.length;
        return 0.11 * (maxValue - avgOfAvgValue) / (maxValue - minValue);
      };

      const minMaxValues = this.calculateMinMax(questionsWithCriteria);
      const results = Array.from({ length: questionsWithCriteria.length }, () => []);

      for (let i = 1; i <= 9; i++) {
        const averagesArray = questionsWithCriteria.map(question => question[`avgOfAvgValue${i}`]);
        for (let j = 0; j < questionsWithCriteria.length; j++) {
          const result = calculateResultForArray(averagesArray, j, minMaxValues[`minValue${i}`], minMaxValues[`maxValue${i}`]);
          results[j].push(result);
        }
      }
 
      const flattenedResults = [...results].flat();
      return flattenedResults;

    }
  
render() {
  const { questionsWithCriteria, list_questions, rps } = this.state;


const results =this.calculateResult(questionsWithCriteria);
const title = (
    <span>
      <Button type="primary" onClick={this.handleAddQuiz}>
        Tambahkan Soal dalam Kuis
      </Button>
    </span>
  );
  
  return (
    <div className="app-container">
            

      <TypingCard source="Hasil Akhir IVIHF-VIKOR dengan perankingan nya" />
      <br />
        <Card title={title}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Question</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Nilai Q</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Rank</th>
                </tr>
            </thead>
            <tbody>
                {results.length > 0 ? (
                    (() => {
                        const chunks = results.reduce((acc, result, index) => {
                            const chunkIndex = Math.floor(index / 9);
                            if (!acc[chunkIndex]) {
                                acc[chunkIndex] = [];
                            }
                            acc[chunkIndex].push(result);
                            return acc;
                        }, []);
                        
                        const maxValues = chunks.map(chunk => Math.max(...chunk));
                        const sumValues = chunks.map(chunk => chunk.reduce((sum, value) => sum + value, 0));
                        
                        const overallMax = Math.max(...maxValues);
                        const overallMin = Math.min(...maxValues);
                        const Smax = Math.max(...sumValues);
                        const Smin = Math.min(...sumValues);
                        
                        const resultsWithRanks = chunks.map((chunk, chunkIndex) => {
                            const maxResult = Math.max(...chunk);
                            const sumResult = chunk.reduce((sum, value) => sum + value, 0);
                            const questionTitle = questionsWithCriteria[chunkIndex]?.title || `Question ${chunkIndex + 1}`;
                        
                            const normalizedMax = overallMax !== overallMin ? (maxResult - overallMin) / (overallMax - overallMin) : 0;
                            const normalizedSum = Smax !== Smin ? (sumResult - Smin) / (Smax - Smin) : 0;
                        
                            const result = (0.5 * normalizedSum + (1 - 0.5) * normalizedMax).toFixed(3);
                        
                            return { questionTitle, result: parseFloat(result) };
                        });

                        // Step 1: Sort the results array by the 'result' property
                        const sortedResults = [...resultsWithRanks].sort((a, b) => a.result - b.result);

                        // Step 2: Map the sorted results to include their ranks
                        const rankedResults = sortedResults.map((item, index) => ({
                            ...item,
                            rank: index + 1,
                        }));

                        // Step 3: Render the results with their ranks in the table
                        const finalRows = rankedResults.map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.questionTitle}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.result}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.rank}</td>
                            </tr>
                        ));
                        
                        return (
                            <>
                                {finalRows}
                            </>
                        );
                    })()
                ) : (
                    <tr>
                        <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>No results available</td>
                    </tr>
                )}
            </tbody>
        </table>
    </Card>
    <AddQuizForm
          wrappedComponentRef={(formRef) => (this.addQuizFormRef = formRef)}
          visible={this.state.addQuizModalVisible}
          confirmLoading={this.state.addQuizModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddQuizOk}
          list_questions={this.state.list_questions} // Pass the ranked list_questions
          rps={rps}
          quizName={this.state.quizName}
          quizDuration={this.state.quizDuration}
          quizDesc={this.state.quizDesc}
          quizRpsId={this.state.quizRpsId}
          quizMinGrade={this.state.quizMinGrade}
          quizType={this.state.quizType}
        />
    </div>
  );
}

}

export default QuizGenerate;
