import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getLearningMedias,
  deleteLearningMedia,
  editLearningMedia,
  addLearningMedia,
} from "@/api/learningMedia";
import TypingCard from "@/components/TypingCard";
import EditLearningMediaForm from "./forms/edit-learningMedia-form";
import AddLearningMediaForm from "./forms/add-learningMedia-form";
const { Column } = Table;
class LearningMedia extends Component {
  state = {
    learningMedias: [],
    editLearningMediaModalVisible: false,
    editLearningMediaModalLoading: false,
    currentRowData: {},
    addLearningMediaModalVisible: false,
    addLearningMediaModalLoading: false,
  };
  getLearningMedias = async () => {
    const result = await getLearningMedias();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        learningMedias: content,
      });
    }
  };
  handleEditLearningMedia = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editLearningMediaModalVisible: true,
    });
  };

  handleDeleteLearningMedia = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteLearningMedia({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getLearningMedias();
    });
  };

  handleEditLearningMediaOk = (_) => {
    const { form } = this.editLearningMediaFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editLearningMedia(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editLearningMediaModalVisible: false,
            editLearningMediaModalLoading: false,
          });
          message.success("berhasi;!");
          this.getLearningMedias();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editLearningMediaModalVisible: false,
      addLearningMediaModalVisible: false,
    });
  };

  handleAddLearningMedia = (row) => {
    this.setState({
      addLearningMediaModalVisible: true,
    });
  };

  handleAddLearningMediaOk = (_) => {
    const { form } = this.addLearningMediaFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addLearningMediaModalLoading: true });
      addLearningMedia(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addLearningMediaModalVisible: false,
            addLearningMediaModalLoading: false,
          });
          message.success("Berhasil!");
          this.getLearningMedias();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getLearningMedias();
  }
  render() {
    const { learningMedias } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddLearningMedia}>
          Tambahkan media pembelajaran
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola media pembelajaran di sistem, seperti menambahkan media pembelajaran baru, atau mengubah media pembelajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Media Pembelajaran" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={learningMedias}
            pagination={false}
          >
            <Column
              title="ID Media Pembelajaran"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Media Pembelajaran"
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
                    onClick={this.handleEditLearningMedia.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteLearningMedia.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditLearningMediaForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editLearningMediaFormRef = formRef)
          }
          visible={this.state.editLearningMediaModalVisible}
          confirmLoading={this.state.editLearningMediaModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditLearningMediaOk}
        />
        <AddLearningMediaForm
          wrappedComponentRef={(formRef) =>
            (this.addLearningMediaFormRef = formRef)
          }
          visible={this.state.addLearningMediaModalVisible}
          confirmLoading={this.state.addLearningMediaModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddLearningMediaOk}
        />
      </div>
    );
  }
}

export default LearningMedia;
