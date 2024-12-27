import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getStudyPrograms,
  deleteStudyProgram,
  editStudyProgram,
  addStudyProgram,
} from "@/api/studyProgram";
import { getDepartments } from "@/api/department";
import TypingCard from "@/components/TypingCard";
import EditStudyProgramForm from "./forms/edit-study-program-form";
import AddStudyProgramForm from "./forms/add-study-program-form";
const { Column } = Table;
class StudyProgram extends Component {
  state = {
    studyPrograms: [],
    departments: [],
    editStudyProgramModalVisible: false,
    editStudyProgramModalLoading: false,
    currentRowData: {},
    addStudyProgramModalVisible: false,
    addStudyProgramModalLoading: false,
  };
  getStudyPrograms = async () => {
    const result = await getStudyPrograms();
    console.log(result);
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
      this.setState({
        studyPrograms: content,
      });
    }
  };
  getDepartments = async () => {
    const result = await getDepartments();
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
      this.setState({
        departments: content,
      });
    }
  };
  handleEditStudyProgram = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editStudyProgramModalVisible: true,
    });
  };

  handleDeleteStudyProgram = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    deleteStudyProgram({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getStudyPrograms();
    });
  };

  handleEditStudyProgramOk = (_) => {
    const { form } = this.editStudyProgramFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editStudyProgram(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            editStudyProgramModalVisible: false,
            editStudyProgramModalLoading: false,
          });
          message.success("berhasi;!");
          this.getStudyPrograms();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editStudyProgramModalVisible: false,
      addStudyProgramModalVisible: false,
    });
  };

  handleAddStudyProgram = (row) => {
    this.setState({
      addStudyProgramModalVisible: true,
    });
  };

  handleAddStudyProgramOk = (_) => {
    const { form } = this.addStudyProgramFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addStudyProgramModalLoading: true });
      addStudyProgram(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addStudyProgramModalVisible: false,
            addStudyProgramModalLoading: false,
          });
          message.success("Berhasil!");
          this.getStudyPrograms();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getStudyPrograms();
    this.getDepartments();
  }
  render() {
    const { studyPrograms, departments } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddStudyProgram}>
          Tambahkan program studi
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola program studi di sistem, seperti menambahkan program studi baru, atau mengubah program studi yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Program Studi" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={studyPrograms}
            pagination={false}
          >
            <Column
              title="ID Program Studi"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column
              title="Jurusan"
              dataIndex="department.name"
              key="department.name"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Program Studi"
              dataIndex="description"
              key="description"
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
                    title="mengedit"
                    onClick={this.handleEditStudyProgram.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteStudyProgram.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditStudyProgramForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editStudyProgramFormRef = formRef)
          }
          visible={this.state.editStudyProgramModalVisible}
          confirmLoading={this.state.editStudyProgramModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditStudyProgramOk}
        />
        <AddStudyProgramForm
          wrappedComponentRef={(formRef) =>
            (this.addStudyProgramFormRef = formRef)
          }
          visible={this.state.addStudyProgramModalVisible}
          confirmLoading={this.state.addStudyProgramModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddStudyProgramOk}
          departments={departments}
        />
      </div>
    );
  }
}

export default StudyProgram;
