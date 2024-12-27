import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getExercise,
  deleteExercise,
  editExercise,
  addExercise,
  getQuestionsByRPS
} from "@/api/exercise";
import { getQuestions } from "@/api/question";
import { getRPS } from "@/api/rps";

import { Link } from "react-router-dom";
import TypingCard from "@/components/TypingCard";
import EditExerciseForm from "./forms/edit-exercise-form";
import AddExerciseForm from "./forms/add-exercise-form";
// import { getQuestionsByRPS } from "../../api/question";
import {
  getRPSDetail,
} from "@/api/rpsDetail";
import moment from "moment";
const { Column } = Table;

class Exercise extends Component {
  state = {
    rps_id: null,
    type_exercise: null,
    exercise: [],
    questions: [],
    rps: [],
    rpsDetail: [],
    editExerciseModalVisible: false,
    editExerciseModalLoading: false,
    currentRowData: {},
    addExerciseModalVisible: false,
    addExerciseModalLoading: false,
  };
 
  handleRPSChange = (value) => {
    this.setState({ rps_id: value }, this.updateQuestion);
  };

  handleExerciseTypeChange = (value) => {
    this.setState({ type_exercise: value }, this.updateQuestion);
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
  getQuestions = async () => {
    const result = await getQuestions();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        questions: content,
      });
    }
  };
  handleUpdateQuestion = (value, type) => {
    // Update the value of the field that changed
    this.props.form.setFieldsValue({ [type]: value }, () => {
      // Get updated values of rps_id and type_exercise from the form
      const { rps_id, type_exercise } = this.props.form.getFieldsValue(['rps_id', 'type_exercise']);
  
      // Call updateQuestion with the updated values of rps_id and type_exercise
      this.updateQuestion(rps_id, type_exercise);
    });
  };
  updateQuestion = async () => {
    const { rps_id, type_exercise } = this.state;

    if (rps_id && type_exercise) {
      console.log('updateQuestion', { rps_id, type_exercise });

      const result = await getQuestionsByRPS(rps_id, type_exercise);
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredQuestions = content.filter(question => question.examType === "EXERCISE");
        this.setState({
          questions: filteredQuestions,
        });
      }
    }
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
  getRPSDetail = async (id) => {
    const { rpsId } = this.state; // Get the rps id from the state
    const result = await getRPSDetail(rpsId);
  
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        rpsDetail: content,
      });
    }
  };
  handleEditExercise = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editExerciseModalVisible: true,
    });
  };

  handleDeleteExercise = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    deleteExercise({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getExercise();
    });
  };

  handleEditExerciseOk = (_) => {
    const { form } = this.editExerciseFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editExercise(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editExerciseModalVisible: false,
            editExerciseModalLoading: false,
          });
          message.success("berhasi;!");
          this.getExercise();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editExerciseModalVisible: false,
      addExerciseModalVisible: false,
    });
  };

  handleAddExercise = (row) => {
    this.setState({
      addExerciseModalVisible: true,
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
  componentDidMount() {
    this.getExercise();
    this.getQuestions();
    this.getRPSDetail();
    this.getRps();
  }
  render() {
    const { exercise, rpsDetail,questions, rps } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddExercise}>
          Tambahkan Latihan
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola Exercise sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list Exercise yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Latihan" source={cardContent} />
        <br />
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={exercise} pagination={false}>
            <Column
              title="ID Exercise"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column
              title="RPS"
              dataIndex="rps.name"
              key="rps.name"
              align="center"
            />
            <Column
              title="Nilai Minimal"
              dataIndex="min_grade"
              key="min_grade"
              align="center"
            />
            <Column
            title="Pilihan ujian"
            dataIndex="type_exercise"
            key="type_exercise"
            align="center"
            
          />
            <Column
              title="Tanggal Mulai"
              dataIndex="date_start"
              key="date_start"
              align="center"
              render={(text) => moment(text).format("DD MMMM YYYY, HH:mm:ss")}
            />
            <Column
              title="Tanggal Selesai"
              dataIndex="date_end"
              key="date_end"
              align="center"
              render={(text) => moment(text).format("DD MMMM YYYY, HH:mm:ss")}
            />
            <Column
              title="Durasi"
              dataIndex="duration"
              key="duration"
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
                    title="Edit Latihan"
                    onClick={this.handleEditExercise.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Link to={`/setting-exercise/result/${row.id}`}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon="diff"
                      title="Detail Hasil"
                    />
                  </Link>
                  {/* <Divider type="vertical" />
                    <Link to={`/index/exercise/${row.id}`}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon="diff"
                        title="Detail Latihan"
                    />
                    </Link>
                    <Divider type="vertical" /> */}
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="Hapus Data"
                    onClick={this.handleDeleteExercise.bind(null, row)}
                  />

                </span>
              )}
            />
          </Table>
        </Card>
        <EditExerciseForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editExerciseFormRef = formRef)
          }
          visible={this.state.editExerciseModalVisible}
          confirmLoading={this.state.editExerciseModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditExerciseOk}
          handleUpdateQuestion={this.updateQuestion}
          questions={questions}
          rpsAll={rps}
        />
        <AddExerciseForm
          wrappedComponentRef={(formRef) => (this.addExerciseFormRef = formRef)}
          visible={this.state.addExerciseModalVisible}
          handleRPSChange={this.handleRPSChange}
          handleExerciseTypeChange={this.handleExerciseTypeChange}
          confirmLoading={this.state.addExerciseModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddExerciseOk}
          handleUpdateQuestion={this.updateQuestion}
          handleGetRPS = {this.handleGetRPS}
          questions={questions}
          rps={rps}
        />
      </div>
    );
  }
}

export default Exercise;
