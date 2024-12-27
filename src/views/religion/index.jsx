import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getReligions,
  deleteReligion,
  editReligion,
  addReligion,
} from "@/api/religion";
import TypingCard from "@/components/TypingCard";
import EditReligionForm from "./forms/edit-religion-form";
import AddReligionForm from "./forms/add-religion-form";
const { Column } = Table;
class Religion extends Component {
  state = {
    religions: [],
    editReligionModalVisible: false,
    editReligionModalLoading: false,
    currentRowData: {},
    addReligionModalVisible: false,
    addReligionModalLoading: false,
  };
  getReligions = async () => {
    const result = await getReligions();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        religions: content,
      });
    }
  };
  handleEditReligion = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editReligionModalVisible: true,
    });
  };

  handleDeleteReligion = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteReligion({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getReligions();
    });
  };

  handleEditReligionOk = (_) => {
    const { form } = this.editReligionFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editReligion(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editReligionModalVisible: false,
            editReligionModalLoading: false,
          });
          message.success("berhasi;!");
          this.getReligions();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editReligionModalVisible: false,
      addReligionModalVisible: false,
    });
  };

  handleAddReligion = (row) => {
    this.setState({
      addReligionModalVisible: true,
    });
  };

  handleAddReligionOk = (_) => {
    const { form } = this.addReligionFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addReligionModalLoading: true });
      addReligion(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addReligionModalVisible: false,
            addReligionModalLoading: false,
          });
          message.success("Berhasil!");
          this.getReligions();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getReligions();
  }
  render() {
    const { religions } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddReligion}>
          Tambahkan agama
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola agama di sistem, seperti menambahkan agama baru, atau mengubah agama yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Agama" source={cardContent} />
        <br />
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={religions} pagination={false}>
            <Column title="ID Agama" dataIndex="id" key="id" align="center" />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Agama"
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
                    onClick={this.handleEditReligion.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteReligion.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditReligionForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editReligionFormRef = formRef)
          }
          visible={this.state.editReligionModalVisible}
          confirmLoading={this.state.editReligionModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditReligionOk}
        />
        <AddReligionForm
          wrappedComponentRef={(formRef) => (this.addReligionFormRef = formRef)}
          visible={this.state.addReligionModalVisible}
          confirmLoading={this.state.addReligionModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddReligionOk}
        />
      </div>
    );
  }
}

export default Religion;
