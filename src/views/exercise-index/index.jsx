import React, { Component } from "react";
import { Card, Button, Table, message, Divider,Checkbox } from "antd";
import {
    getRPSDetail,

  } from "@/api/rpsDetail";

import TypingCard from "@/components/TypingCard";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { getRPS } from "@/api/rps";
import AddExerciseForm from "./forms/add-exercise-index-form";
import {
    getExerciseByID,
    getExercise,
    addExercise,
  } from "@/api/exercise";
import { getQuestionsByRPS } from "../../api/question";


const { Column } = Table;

class exerciseIndex extends Component{
    state ={
        criteriaValue:[],
        rpsDetail: [],
        rps: [],
        exercise: [],
        allQuestions: [],
        questions:[],
        weekDetails: [],
        editCriteriaValueModalVisible: false,
        editCriteriaValueModalLoading: false,
        currentRowData: {},
        addExerciseModalVisible: false,
        addExerciseModalLoading: false,
        ExerciseID: "",
        rpsID:"",

           
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
    getExercise = async () => {
      const result = await getExercise();
      const { content, statusCode } = result.data;
      console.log(result.data);
      if (statusCode === 200) {
        this.setState({
          exercise: content,
        });
      }
    };

    getQuestionsByRPS =async (id) => {
      const result = await getQuestionsByRPS(id);
      const { content, statusCode } = result.data;
  
      if (statusCode === 200) {
        const filteredQuestions = content.filter(question => question.examType2 === 'QUIZ');
        this.setState({
          questions: filteredQuestions,
        });
      }
    };

      getExerciseByID = async (ExerciseID) => {
        const result = await getExerciseByID(ExerciseID);
        const { content, statusCode } = result.data;
        console.log(result.data);
        if (statusCode === 200) {
          this.setState({
            exercise: content,
            rpsID: content.rps.id,
          }, () => {
            // Call getQuestionsByRPS after the state has been updated
            this.getQuestionsByRPS(content.rps.id, this.props.match.params.exerciseID);
          });
        }
      }
      
      handleAddExercise = (row) => {
        this.setState({
          addExerciseModalVisible: true,
          currentRowData: Object.assign({}, row),

        });
      };
    
      handleAddExerciseOk = (_) => {
        const { form } = this.addExerciseFormRef.props;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          this.setState({ addExerciseModalLoading: true });
          addExercise(values)
            .then((response) => {
              form.resetFields();
              this.setState({
                addExerciseModalVisible: false,
                addExerciseModalLoading: false,
              });
              message.success("Berhasil!");
              this.getExercise();
            })
            .catch((e) => {
              message.success("Gagal menambahkan, coba lagi!");
            });
        });
      };

      handleCancel = (_) => {
        this.setState({
          editExerciseModalVisible: false,
          addExerciseModalVisible: false,
        });
      };

      // In AddExerciseForm component
      handleSelectChange = (value) => {
        this.setState({ selectedOption: value }, () => {
          this.props.onOptionChange(this.state.selectedOption);
          this.generateRandomQuestions();
        });
      };

      // In exerciseIndex component
      handleOptionChange = (selectedOption) => {
        // Filter the questions based on the selected option
        const filteredQuestions = this.state.allQuestions.filter(question => question.option === selectedOption);
        this.setState({ questions: filteredQuestions });
      };
      componentDidMount() {
        const { exerciseID, rpsID } = this.props.match.params;
      
        this.setState({
          exerciseID: exerciseID,
          rpsID: exerciseID.rpsID,
        }, () => {
          // Call getExerciseByID after the state has been updated
          this.getExerciseByID(exerciseID);
      
          // Call getQuestionsByRPS after the state has been updated
          this.getQuestionsByRPS("RPS-PBO-001");
          this.getRps();
        });
      }
        render(){
            const { questions,rpsID ,rps} = this.state;
            const title = (
              <span>
                <Button type="primary" onClick={this.handleAddExercise}>
                  Pilih Soal Untuk Latihan
                </Button>
              </span>
            );
            const data = questions.map((question, index) => ({
              questionId: question.id,
              questionTitle: question.title,
              rpsId: rps[index] ? rps[index].id : null,
              rpsTitle: rps[index] ? rps[index].title : null,
              devLecturers: rps[index] && rps[index].dev_lecturers ? rps[index].dev_lecturers.map(lecturer => `${lecturer.name} (${lecturer.id})`).join(', ') : null,
            }));
            const devLecturerData = rps.map((rp) => ({
              devLecturers: rp.dev_lecturers ? rp.dev_lecturers.map(lecturer => ({name: lecturer.name, id: lecturer.id})) : [],
            }));
            
            return (
            <div>
                <Card title={title}>
                <Table dataSource={devLecturerData} rowKey={(record, index) => index}>
    <Column
      title="Dev Lecturers"
      key="devLecturers"
      render={(text, record) => (
        <table>
          <thead>
            <tr>
              <th>Lecturer Name</th>
              <th>Lecturer ID</th>
            </tr>
          </thead>
          <tbody>
            {record.devLecturers.map((lecturer, index) => (
              <tr key={index}>
                <td>{lecturer.name}</td>
                <td>{lecturer.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    />
  </Table>
                <Table dataSource={data} rowKey="questionId">
                
                  <Column title="ID Pertanyaan" dataIndex="questionId" key="questionId" align="center" />
                  <Column title="Pertanyaan" dataIndex="questionTitle" key="questionTitle" align="center" />
                  <Column title="ID RPS" dataIndex="rpsId" key="rpsId" align="center" />
                  <Column title="RPS" dataIndex="rpsTitle" key="rpsTitle" align="center" />
                  <Column title="Lecturers" dataIndex="devLecturers" key="devLecturers" align="center" />

                </Table>
                </Card>
                
                <AddExerciseForm
                  exercise={this.state.exercise}
                wrappedComponentRef={(formRef) => (this.addExerciseFormRef = formRef)}
                visible={this.state.addExerciseModalVisible}
                currentRowData={this.state.currentRowData}
                onOptionChange={this.handleOptionChange}
                confirmLoading={this.state.addExerciseModalLoading}
                onCancel={this.handleCancel}
                onOk={this.handleAddExerciseOk}
                questions={questions}   
                rps={rps}
              />
            </div>
            );
        }
}
export default withRouter(exerciseIndex);