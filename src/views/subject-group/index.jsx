import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getSubjectGroups,
  deleteSubjectGroup,
  editSubjectGroup,
  addSubjectGroup,
} from "@/api/subjectGroup";
import TypingCard from "@/components/TypingCard";
import EditSubjectGroupForm from "./forms/edit-subject-group-form";
import AddSubjectGroupForm from "./forms/add-subject-group-form";
const { Column } = Table;
class SubjectGroup extends Component {
  state = {
    subjectGroups: [],
    editSubjectGroupModalVisible: false,
    editSubjectGroupModalLoading: false,
    currentRowData: {},
    addSubjectGroupModalVisible: false,
    addSubjectGroupModalLoading: false,
  };
  getSubjectGroups = async () => {
    const result = await getSubjectGroups();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        subjectGroups: content,
      });
    }
  };
  handleEditSubjectGroup = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editSubjectGroupModalVisible: true,
    });
  };

  handleDeleteSubjectGroup = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteSubjectGroup({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getSubjectGroups();
    });
  };

  handleEditSubjectGroupOk = (_) => {
    const { form } = this.editSubjectGroupFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editSubjectGroup(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editSubjectGroupModalVisible: false,
            editSubjectGroupModalLoading: false,
          });
          message.success("berhasi;!");
          this.getSubjectGroups();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editSubjectGroupModalVisible: false,
      addSubjectGroupModalVisible: false,
    });
  };

  handleAddSubjectGroup = (row) => {
    this.setState({
      addSubjectGroupModalVisible: true,
    });
  };

  handleAddSubjectGroupOk = (_) => {
    const { form } = this.addSubjectGroupFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addSubjectGroupModalLoading: true });
      addSubjectGroup(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addSubjectGroupModalVisible: false,
            addSubjectGroupModalLoading: false,
          });
          message.success("Berhasil!");
          this.getSubjectGroups();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getSubjectGroups();
  }
  render() {
    const { subjectGroups } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddSubjectGroup}>
          Tambahkan rumpun mata kuliah
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola rumpun mata kuliah di sistem, seperti menambahkan rumpun mata kuliah baru, atau mengubah rumpun mata kuliah yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Rumpun Mata Kuliah" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={subjectGroups}
            pagination={false}
          >
            <Column
              title="ID Rumpun Mata Kuliah"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Rumpun Mata Kuliah"
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
                    onClick={this.handleEditSubjectGroup.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteSubjectGroup.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditSubjectGroupForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editSubjectGroupFormRef = formRef)
          }
          visible={this.state.editSubjectGroupModalVisible}
          confirmLoading={this.state.editSubjectGroupModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditSubjectGroupOk}
        />
        <AddSubjectGroupForm
          wrappedComponentRef={(formRef) =>
            (this.addSubjectGroupFormRef = formRef)
          }
          visible={this.state.addSubjectGroupModalVisible}
          confirmLoading={this.state.addSubjectGroupModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddSubjectGroupOk}
        />
      </div>
    );
  }
}

export default SubjectGroup;
