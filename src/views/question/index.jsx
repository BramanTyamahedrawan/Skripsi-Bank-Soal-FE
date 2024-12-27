import React, { Component } from "react";
import { Card, Button, Table, message, Divider,Checkbox } from "antd";
import {
  getQuestions,
  deleteQuestion,
  editQuestion,
  addQuestion,
  getImage,
} from "@/api/question";

import TypingCard from "@/components/TypingCard";
import EditQuestionForm from "./forms/edit-question-form";
import AddQuestionForm from "./forms/add-question-form";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
const { Column } = Table;


class Question extends  React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      editQuestionModalVisible: false,
      editQuestionModalLoading: false,
      currentRowData: {},
      addQuestionModalVisible: false,
      addQuestionModalLoading: false,
      rpsDetailID: "",
      rpsID: "",
      images: {},
      selectedExamTypes: {
        EXERCISE: false,
        QUIZ: false,
        EXAM: false,
      },
      filteredQuestions: [],
    };
  }
  getQuestions = async (rpsDetailID) => {
    const result = await getQuestions(rpsDetailID);
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
      this.setState({
        questions: content,
      });
    }
  };

  handleEditQuestion = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editQuestionModalVisible: true,
    });
  };

  handleDeleteQuestion = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    deleteQuestion({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getQuestions(this.state.rpsDetailID);
    });
  };

  handleEditQuestionOk = (_) => {
    const { form } = this.editQuestionFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editQuestion(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            editQuestionModalVisible: false,
            editQuestionModalLoading: false,
          });
          message.success("berhasi;!");
          this.getQuestions(this.state.rpsDetailID);
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editQuestionModalVisible: false,
      addQuestionModalVisible: false,
    });
  };

  handleAddQuestion = (row) => {
    this.setState({
      addQuestionModalVisible: true,
    });
  };

  

  handleAddQuestionOk = () => {
    const { form } = this.addQuestionFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addQuestionModalLoading: true });
      const { file, ...otherValues } = values;
      
      const formData = new FormData();
      if (file && file.fileList.length > 0) {
        formData.append("file", file.fileList[0].originFileObj);
      }
      formData.append("rps_detail_id", this.state.rpsDetailID);     
      formData.append("title", otherValues.title);
      formData.append("description", otherValues.description);
      formData.append("question_type", otherValues.question_type);
      formData.append("answer_type", otherValues.answer_type);
      formData.append("explanation", otherValues.explanation);
      if (otherValues.examType) {
        formData.append("examType", otherValues.examType);
      }
      if (otherValues.examType2) {
        formData.append("examType2", otherValues.examType2);
      }
      if (otherValues.examType3) {
        formData.append("examType3", otherValues.examType3);
      }
      

      addQuestion(formData)
        .then((response) => {
          form.resetFields();
          this.setState({
            addQuestionModalVisible: false,
            addQuestionModalLoading: false,
          });
          message.success("Berhasil!");
          this.getQuestions(this.state.rpsDetailID);
        })
        .catch((e) => {
          message.success("添加失败，请重试!");
        });
    });
  };
  handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    this.setState(prevState => ({
      selectedExamTypes: {
        ...prevState.selectedExamTypes,
        [name]: checked,
      },
    }), this.filterQuestions);
  }

  getFilteredData = () => {
    const { questions, selectedExamTypes } = this.state;
    
    // If no checkboxes are selected, return all questions
    if (!selectedExamTypes.EXERCISE && !selectedExamTypes.QUIZ && !selectedExamTypes.EXAM) {
      return questions;
    }
  
    // Otherwise, filter the questions based on the selected checkboxes
    return questions.filter(question =>
      (selectedExamTypes.EXERCISE && question.examType === 'EXERCISE') ||
      (selectedExamTypes.QUIZ && question.examType2 === 'QUIZ' && question.examType2 !== 'NOTHING') ||
      (selectedExamTypes.EXAM && question.examType3 === 'EXAM' && question.examType3 !== 'NOTHING')
    );
  }
  componentDidMount() {
    this.setState({
      
      rpsID: this.props.match.params.rpsID,
      rpsDetailID: this.props.match.params.rpsDetailID,
    });
    this.getQuestions(this.props.match.params.rpsDetailID);
    if (this.props.imageNames) {
      this.props.imageNames.forEach(imageName => {
        this.getImage(imageName);
      });
    }
  }
  handleCheckboxChange = (checkedValues) => {
    this.setState(prevState => ({
      selectedExamTypes: {
        EXERCISE: checkedValues.includes('EXERCISE'),
        QUIZ: checkedValues.includes('QUIZ'),
        EXAM: checkedValues.includes('EXAM'),
      },
    }), this.filterQuestions);
  }

  
  render() {
    const { questions, rpsID, rpsDetailID,images } = this.state;
    const options = ['EXERCISE', 'QUIZ', 'EXAM'];

    let imageElements = null;
    const BASE_URL = 'http://hadoop-primary:9870/';

  if (this.props.imageNames) {
    imageElements = this.props.imageNames.map(imageName => {
      const base64 = images[imageName];
      if (base64) {
        return <img src={`data:image/png;base64,${base64}`} alt={imageName} />;
      } else {
        return null;
      }
    });
  }

    

    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddQuestion}>
          Tambahkan pertanyaan
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola pertanyaan di sistem, seperti menambahkan pertanyaan baru, atau mengubah pertanyaan yang sudah ada di sistem.`;
    return (
      
      <div className="app-container">
        <TypingCard title="Manajemen Pertanyaan" source={cardContent} />
        <Checkbox.Group
          options={options}
          onChange={this.handleCheckboxChange}
          style={{ display: 'flex', justifyContent: 'flex-start' }}
        />
        <br />
        <Card title={title}>
        <Table bordered rowKey="id" dataSource={this.getFilteredData()} pagination={false}>           
            <Column
              title="ID"
              key="id"
              align="center"
              render={(value, record, index) => index + 1}
            />
            <Column
              title="Pertanyaan"
              dataIndex="title"
              key="title"
              align="center"
            />
            {/* <Column
              title="Pertanyaan"
              dataIndex="title"
              key="title"
              render={(text, record) => {
                if (record.file_path) {
                  return (
                    <>
                      {text}
                      <img src={`${BASE_URL}${record.file_path}`} alt={text} style={{width: '200px', height: '200px', marginLeft: '10px'}}/>                    </>
                  );
                } else {
                  return text;
                }
              }}
            /> */}
            <Column
              title="Deskripsi Pertanyaan"
              dataIndex="description"
              key="description"
              align="center"
            />
            
            <Column
              title="Tipe Jawaban"
              dataIndex="answerType"
              key="answerType"
              align="center"
            />
            
            <Column
              title="Tipe Soal"
              dataIndex="questionType"
              key="questionType"
              align="center"
            />
            <Column  
              title="Operasi"
              key="action"
              width={195}
              align="center"
              render={(text, row) => (
                <span>
                  <Button
                    type="primary"
                    shape="circle"
                    icon="edit"
                    title="edit soal"
                    onClick={this.handleEditQuestion.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Link to={`/rps/${rpsID}/${rpsDetailID}/${row.id}`}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon="diff"
                      title="Tambahkan Soal"
                    />
                  </Link>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="Hapus soal"
                    onClick={this.handleDeleteQuestion.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditQuestionForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editQuestionFormRef = formRef)
          }
          visible={this.state.editQuestionModalVisible}
          confirmLoading={this.state.editQuestionModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditQuestionOk}
        />
        <AddQuestionForm
          wrappedComponentRef={(formRef) => (this.addQuestionFormRef = formRef)}
          visible={this.state.addQuestionModalVisible}
          confirmLoading={this.state.addQuestionModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddQuestionOk}
        />
      </div>
    );
  }
}



export default withRouter(Question);
