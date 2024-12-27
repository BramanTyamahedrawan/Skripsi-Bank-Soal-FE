import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getAssessmentCriterias,
  deleteAssessmentCriteria,
  editAssessmentCriteria,
  addAssessmentCriteria,
} from "@/api/assessmentCriteria";
import TypingCard from "@/components/TypingCard";
import EditAssessmentCriteriaForm from "./forms/edit-assessmentCriteria-form";
import AddAssessmentCriteriaForm from "./forms/add-assessmentCriteria-form";
const { Column } = Table;
class AssessmentCriteria extends Component {
  state = {
    assessmentCriterias: [],
    editAssessmentCriteriaModalVisible: false,
    editAssessmentCriteriaModalLoading: false,
    currentRowData: {},
    addAssessmentCriteriaModalVisible: false,
    addAssessmentCriteriaModalLoading: false,
  };
  getAssessmentCriterias = async () => {
    const result = await getAssessmentCriterias();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        assessmentCriterias: content,
      });
    }
  };
  handleEditAssessmentCriteria = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editAssessmentCriteriaModalVisible: true,
    });
  };

  handleDeleteAssessmentCriteria = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteAssessmentCriteria({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getAssessmentCriterias();
    });
  };

  handleEditAssessmentCriteriaOk = (_) => {
    const { form } = this.editAssessmentCriteriaFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editAssessmentCriteria(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editAssessmentCriteriaModalVisible: false,
            editAssessmentCriteriaModalLoading: false,
          });
          message.success("berhasi;!");
          this.getAssessmentCriterias();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editAssessmentCriteriaModalVisible: false,
      addAssessmentCriteriaModalVisible: false,
    });
  };

  handleAddAssessmentCriteria = (row) => {
    this.setState({
      addAssessmentCriteriaModalVisible: true,
    });
  };

  handleAddAssessmentCriteriaOk = (_) => {
    const { form } = this.addAssessmentCriteriaFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addAssessmentCriteriaModalLoading: true });
      addAssessmentCriteria(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addAssessmentCriteriaModalVisible: false,
            addAssessmentCriteriaModalLoading: false,
          });
          message.success("Berhasil!");
          this.getAssessmentCriterias();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getAssessmentCriterias();
  }
  render() {
    const { assessmentCriterias } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddAssessmentCriteria}>
          Tambahkan penilaian
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola penilaian di sistem, seperti menambahkan penilaian baru, atau mengubah penilaian yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Penilaian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={assessmentCriterias}
            pagination={false}
          >
            <Column
              title="ID Penilaian"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Penilaian"
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
                    onClick={this.handleEditAssessmentCriteria.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteAssessmentCriteria.bind(
                      null,
                      row
                    )}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditAssessmentCriteriaForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editAssessmentCriteriaFormRef = formRef)
          }
          visible={this.state.editAssessmentCriteriaModalVisible}
          confirmLoading={this.state.editAssessmentCriteriaModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditAssessmentCriteriaOk}
        />
        <AddAssessmentCriteriaForm
          wrappedComponentRef={(formRef) =>
            (this.addAssessmentCriteriaFormRef = formRef)
          }
          visible={this.state.addAssessmentCriteriaModalVisible}
          confirmLoading={this.state.addAssessmentCriteriaModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddAssessmentCriteriaOk}
        />
      </div>
    );
  }
}

export default AssessmentCriteria;
