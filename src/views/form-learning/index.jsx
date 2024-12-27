import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getFormLearnings,
  deleteFormLearning,
  editFormLearning,
  addFormLearning,
} from "@/api/formLearning";
import TypingCard from "@/components/TypingCard";
import EditFormLearningForm from "./forms/edit-formLearning-form";
import AddFormLearningForm from "./forms/add-formLearning-form";
const { Column } = Table;
class FormLearning extends Component {
  state = {
    formLearnings: [],
    editFormLearningModalVisible: false,
    editFormLearningModalLoading: false,
    currentRowData: {},
    addFormLearningModalVisible: false,
    addFormLearningModalLoading: false,
  };
  getFormLearnings = async () => {
    const result = await getFormLearnings();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        formLearnings: content,
      });
    }
  };
  handleEditFormLearning = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editFormLearningModalVisible: true,
    });
  };

  handleDeleteFormLearning = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteFormLearning({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getFormLearnings();
    });
  };

  handleEditFormLearningOk = (_) => {
    const { form } = this.editFormLearningFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editFormLearning(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editFormLearningModalVisible: false,
            editFormLearningModalLoading: false,
          });
          message.success("berhasi;!");
          this.getFormLearnings();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editFormLearningModalVisible: false,
      addFormLearningModalVisible: false,
    });
  };

  handleAddFormLearning = (row) => {
    this.setState({
      addFormLearningModalVisible: true,
    });
  };

  handleAddFormLearningOk = (_) => {
    const { form } = this.addFormLearningFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addFormLearningModalLoading: true });
      addFormLearning(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addFormLearningModalVisible: false,
            addFormLearningModalLoading: false,
          });
          message.success("Berhasil!");
          this.getFormLearnings();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getFormLearnings();
  }
  render() {
    const { formLearnings } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddFormLearning}>
          Tambahkan bentuk pembelajaran
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola bentuk pembelajaran di sistem, seperti menambahkan bentuk pembelajaran baru, atau mengubah bentuk pembelajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard
          title="Manajemen Bentuk Pembelajaran"
          source={cardContent}
        />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={formLearnings}
            pagination={false}
          >
            <Column
              title="ID Bentuk Pembelajaran"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Bentuk Pembelajaran"
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
                    onClick={this.handleEditFormLearning.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteFormLearning.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditFormLearningForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editFormLearningFormRef = formRef)
          }
          visible={this.state.editFormLearningModalVisible}
          confirmLoading={this.state.editFormLearningModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditFormLearningOk}
        />
        <AddFormLearningForm
          wrappedComponentRef={(formRef) =>
            (this.addFormLearningFormRef = formRef)
          }
          visible={this.state.addFormLearningModalVisible}
          confirmLoading={this.state.addFormLearningModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddFormLearningOk}
        />
      </div>
    );
  }
}

export default FormLearning;
