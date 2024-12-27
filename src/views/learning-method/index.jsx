import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getLearningMethods,
  deleteLearningMethod,
  editLearningMethod,
  addLearningMethod,
} from "@/api/learningMethod";
import TypingCard from "@/components/TypingCard";
import EditLearningMethodForm from "./forms/edit-learningMethod-form";
import AddLearningMethodForm from "./forms/add-learningMethod-form";
const { Column } = Table;
class LearningMethod extends Component {
  state = {
    learningMethods: [],
    editLearningMethodModalVisible: false,
    editLearningMethodModalLoading: false,
    currentRowData: {},
    addLearningMethodModalVisible: false,
    addLearningMethodModalLoading: false,
  };
  getLearningMethods = async () => {
    const result = await getLearningMethods();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        learningMethods: content,
      });
    }
  };
  handleEditLearningMethod = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editLearningMethodModalVisible: true,
    });
  };

  handleDeleteLearningMethod = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteLearningMethod({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getLearningMethods();
    });
  };

  handleEditLearningMethodOk = (_) => {
    const { form } = this.editLearningMethodFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editLearningMethod(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editLearningMethodModalVisible: false,
            editLearningMethodModalLoading: false,
          });
          message.success("berhasi;!");
          this.getLearningMethods();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editLearningMethodModalVisible: false,
      addLearningMethodModalVisible: false,
    });
  };

  handleAddLearningMethod = (row) => {
    this.setState({
      addLearningMethodModalVisible: true,
    });
  };

  handleAddLearningMethodOk = (_) => {
    const { form } = this.addLearningMethodFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addLearningMethodModalLoading: true });
      addLearningMethod(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addLearningMethodModalVisible: false,
            addLearningMethodModalLoading: false,
          });
          message.success("Berhasil!");
          this.getLearningMethods();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getLearningMethods();
  }
  render() {
    const { learningMethods } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddLearningMethod}>
          Tambahkan metode pembelajaran
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola metode pembelajaran di sistem, seperti menambahkan metode pembelajaran baru, atau mengubah metode pembelajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard
          title="Manajemen Metode Pembelajaran"
          source={cardContent}
        />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={learningMethods}
            pagination={false}
          >
            <Column
              title="ID Metode Pembelajaran"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Metode Pembelajaran"
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
                    onClick={this.handleEditLearningMethod.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteLearningMethod.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditLearningMethodForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editLearningMethodFormRef = formRef)
          }
          visible={this.state.editLearningMethodModalVisible}
          confirmLoading={this.state.editLearningMethodModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditLearningMethodOk}
        />
        <AddLearningMethodForm
          wrappedComponentRef={(formRef) =>
            (this.addLearningMethodFormRef = formRef)
          }
          visible={this.state.addLearningMethodModalVisible}
          confirmLoading={this.state.addLearningMethodModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddLearningMethodOk}
        />
      </div>
    );
  }
}

export default LearningMethod;
