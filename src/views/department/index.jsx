import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getDepartments,
  deleteDepartment,
  editDepartment,
  addDepartment,
} from "@/api/department";
import TypingCard from "@/components/TypingCard";
import EditDepartmentForm from "./forms/edit-department-form";
import AddDepartmentForm from "./forms/add-department-form";
const { Column } = Table;
class Department extends Component {
  state = {
    departments: [],
    editDepartmentModalVisible: false,
    editDepartmentModalLoading: false,
    currentRowData: {},
    addDepartmentModalVisible: false,
    addDepartmentModalLoading: false,
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
  handleEditDepartment = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editDepartmentModalVisible: true,
    });
  };

  handleDeleteDepartment = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteDepartment({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getDepartments();
    });
  };

  handleEditDepartmentOk = (_) => {
    const { form } = this.editDepartmentFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editDepartment(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editDepartmentModalVisible: false,
            editDepartmentModalLoading: false,
          });
          message.success("berhasi;!");
          this.getDepartments();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editDepartmentModalVisible: false,
      addDepartmentModalVisible: false,
    });
  };

  handleAddDepartment = (row) => {
    this.setState({
      addDepartmentModalVisible: true,
    });
  };

  handleAddDepartmentOk = (_) => {
    const { form } = this.addDepartmentFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addDepartmentModalLoading: true });
      addDepartment(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addDepartmentModalVisible: false,
            addDepartmentModalLoading: false,
          });
          message.success("Berhasil!");
          this.getDepartments();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getDepartments();
  }
  render() {
    const { departments } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddDepartment}>
          Tambahkan jurusan
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola jurusan di sistem, seperti menambahkan jurusan baru, atau mengubah jurusan yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Jurusan" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={departments}
            pagination={false}
          >
            <Column title="ID Jurusan" dataIndex="id" key="id" align="center" />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Jurusan"
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
                    onClick={this.handleEditDepartment.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteDepartment.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditDepartmentForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editDepartmentFormRef = formRef)
          }
          visible={this.state.editDepartmentModalVisible}
          confirmLoading={this.state.editDepartmentModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditDepartmentOk}
        />
        <AddDepartmentForm
          wrappedComponentRef={(formRef) =>
            (this.addDepartmentFormRef = formRef)
          }
          visible={this.state.addDepartmentModalVisible}
          confirmLoading={this.state.addDepartmentModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddDepartmentOk}
        />
      </div>
    );
  }
}

export default Department;
