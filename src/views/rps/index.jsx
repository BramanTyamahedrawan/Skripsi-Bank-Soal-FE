import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import { getRPS, deleteRPS, editRPS, addRPS,importRPS } from "@/api/rps";
import {importRPSDetail } from "@/api/rpsDetail";

import { getSubjects } from "@/api/subject";
import { getStudyPrograms } from "@/api/studyProgram";
import { getLectures } from "@/api/lecture";
import { Link } from "react-router-dom";
import {
  getLearningMediasSoftware,
  getLearningMediasHardware,
} from "@/api/learningMedia";
import * as XLSX from 'xlsx';

import TypingCard from "@/components/TypingCard";
import EditRPSForm from "./forms/edit-rps-form";
import AddRPSForm from "./forms/add-rps-form";
const { Column } = Table;
class RPS extends Component {
  state = {
    rps: [],
    learningMediaSoftwares: [],
    learningMediaHardwares: [],
    subjects: [],
    studyPrograms: [],
    lectures: [],
    editRPSModalVisible: false,
    editRPSModalLoading: false,
    currentRowData: {},
    addRPSModalVisible: false,
    addRPSModalLoading: false,
  };
  getRPS = async () => {
    const result = await getRPS();
    const { content, statusCode } = result.data;
    console.log(result.data);
    if (statusCode === 200) {
      this.setState({
        rps: content,
      });
    }
  };
  getLearningMediasSoftware = async () => {
    const result = await getLearningMediasSoftware();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        learningMediaSoftwares: content,
      });
    }
  };
  getLearningMediasHardware = async () => {
    const result = await getLearningMediasHardware();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        learningMediaHardwares: content,
      });
    }
  };
  getSubjects = async () => {
    const result = await getSubjects();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        subjects: content,
      });
    }
  };
  getStudyProgram = async () => {
    const result = await getStudyPrograms();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        studyPrograms: content,
      });
    }
  };
  getLectures = async () => {
    const result = await getLectures();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        lectures: content,
      });
    }
  };
  handleEditRPS = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editRPSModalVisible: true,
    });
  };

  handleDeleteRPS = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("Berhasil Dibuat");
      return;
    }
    deleteRPS({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getRPS();
    });
  };

  handleEditRPSOk = (_) => {
    const { form } = this.editRPSFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editRPS(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            editRPSModalVisible: false,
            editRPSModalLoading: false,
          });
          message.success("berhasi;!");
          this.getRPS();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editRPSModalVisible: false,
      addRPSModalVisible: false,
    });
  };

  handleAddRPS = (row) => {
    this.setState({
      addRPSModalVisible: true,
    });
  };

  handleAddRPSOk = (_) => {
    const { form } = this.addRPSFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addRPSModalLoading: true });
      addRPS(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addRPSModalVisible: false,
            addRPSModalLoading: false,
          });
          message.success("Berhasil!");
          this.getRPS();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
 
  handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        console.log('File reading started');
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        this.setState({ rps: jsonData });
        console.log('File reading completed and state updated');
  
        // Call both importRPS and importRPSDetail
        const [responseRPS, responseRPSDetail] = await Promise.all([
          importRPS(file),
          importRPSDetail(file)
        ]);
  
        console.log('File import responses:', responseRPS, responseRPSDetail);
  
        if (responseRPS.status === 200 && responseRPSDetail.status === 200) {
          console.log('File imported successfully:', responseRPS.data, responseRPSDetail.data);
          // Reload the page
          window.location.reload();
        } else {
          console.error('Failed to import file:', responseRPS.data, responseRPSDetail.data);
        }
      } catch (error) {
        console.error('Error during file upload process:', error);
      }
    };
  
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  
    reader.readAsArrayBuffer(file);
  };
  componentDidMount() {
    this.getRPS();
    this.getSubjects();
    this.getLearningMediasHardware();
    this.getLearningMediasSoftware();
    this.getStudyProgram();
    this.getLectures();
  }
  render() {
    const {
      rps,
      learningMediaHardwares,
      learningMediaSoftwares,
      studyPrograms,
      subjects,
      lectures,
    } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddRPS}>
          Tambahkan RPS
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola RPS sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list RPS yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen RPS" source={cardContent} />
        <div className="file-upload-container">
          <label htmlFor="fileUpload" className="file-upload-label">Upload File RPS:</label>
          <input type="file" id="fileUpload" className="file-upload-input" onChange={this.handleFileUpload} />
        </div>
        <br />
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={rps} pagination={false}>
            <Column title="ID RPS" dataIndex="id" key="id" align="center" />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Semester"
              dataIndex="semester"
              key="semester"
              align="center"
            />
            <Column title="SKS" dataIndex="sks" key="sks" align="center" />
            <Column
              title="Mata Kuliah"
              dataIndex="subject.name"
              key="subject.name"
              align="center"
            />
            <Column
            title="Dosen Pengembang"
            dataIndex="dev_lecturers"
            key="dev_lecturers"
            align="center"
            render={dev_lecturers => (dev_lecturers ? dev_lecturers.map(lecturer => lecturer.name).join(', ') : '')}
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
                    onClick={this.handleEditRPS.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Link to={`/rps/${row.id}`}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon="diff"
                      title="menghapus"
                    />
                  </Link>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteRPS.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditRPSForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editRPSFormRef = formRef)}
          visible={this.state.editRPSModalVisible}
          confirmLoading={this.state.editRPSModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditRPSOk}
          learningMediaSoftwares={learningMediaSoftwares}
          learningMediaHardwares={learningMediaHardwares}
          studyPrograms={studyPrograms}
          subjects={subjects}
          lectures={lectures}
        />
        <AddRPSForm
          wrappedComponentRef={(formRef) => (this.addRPSFormRef = formRef)}
          visible={this.state.addRPSModalVisible}
          confirmLoading={this.state.addRPSModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddRPSOk}
          learningMediaSoftwares={learningMediaSoftwares}
          learningMediaHardwares={learningMediaHardwares}
          studyPrograms={studyPrograms}
          subjects={subjects}
          lectures={lectures}
        />
      </div>
    );
  }
}

export default RPS;
