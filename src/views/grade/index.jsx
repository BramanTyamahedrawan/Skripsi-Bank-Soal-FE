import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import { getUsers, deleteUser, editUser, addUser } from "@/api/user";
import TypingCard from '@/components/TypingCard'
import EditUserForm from "./forms/edit-grade-form"
import AddUserForm from "./forms/add-grade-form"
const { Column } = Table;
class Grade extends Component {
  state = {
    users: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    addUserModalVisible: false,
    addUserModalLoading: false,
  };
  getUsers = async () => {
    const result = await getUsers()
    const { users, status } = result.data
    if (status === 0) {
      this.setState({
        users
      })
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData:Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteUser = (row) => {
    const { id } = row
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！")
      return
    }
    deleteUser({id}).then(res => {
      message.success("berhasil dihapus")
      this.getUsers();
    })
  }
  
  handleEditUserOk = _ => {
    const { form } = this.editUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true, });
      editUser(values).then((response) => {
        form.resetFields();
        this.setState({ editUserModalVisible: false, editUserModalLoading: false });
        message.success("berhasi;!")
        this.getUsers()
      }).catch(e => {
        message.success("gagal")
      })
      
    });
  };

  handleCancel = _ => {
    this.setState({
      editUserModalVisible: false,
      addUserModalVisible: false,
    });
  };

  handleAddUser = (row) => {
    this.setState({
      addUserModalVisible: true,
    });
  };

  handleAddUserOk = _ => {
    const { form } = this.addUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addUserModalLoading: true, });
      addUser(values).then((response) => {
        form.resetFields();
        this.setState({ addUserModalVisible: false, addUserModalLoading: false });
        message.success("Berhasil!")
        this.getUsers()
      }).catch(e => {
        message.success("Gagal menambahkan, coba lagi!")
      })
    });
  };
  componentDidMount() {
    this.getUsers()
  }
  render() {
    const { users } = this.state
    const title = (
      <span>
        <Button type='primary' onClick={this.handleAddUser}>Tambahkan pengguna</Button>
      </span>
    )
    const cardContent = `Di sini, Anda dapat mengelola pengguna di sistem, seperti menambahkan pengguna baru, atau mengubah pengguna yang sudah ada di sistem.。`
    return (
      <div className="app-container">
        <TypingCard title='Manajemen Pengguna' source={cardContent} />
        <br/>
        <Card title={title}>
          <Table bordered rowKey="id" dataSource={users} pagination={false}>
            <Column title="ID Pengguna" dataIndex="id" key="id" align="center"/>
            <Column title="Nama" dataIndex="name" key="name" align="center"/>
            <Column title="Peran" dataIndex="role" key="role" align="center"/>
            <Column title="Deskripsi Pengguna" dataIndex="description" key="description" align="center" />
            <Column title="Operasi" key="action" width={195} align="center"render={(text, row) => (
              <span>
                <Button type="primary" shape="circle" icon="edit" title="mengedit" onClick={this.handleEditUser.bind(null,row)}/>
                <Divider type="vertical" />
                <Button type="primary" shape="circle" icon="delete" title="menghapus" onClick={this.handleDeleteUser.bind(null,row)}/>
              </span>
            )}/>
          </Table>
        </Card>
        <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editUserFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        />  
        <AddUserForm
          wrappedComponentRef={formRef => this.addUserFormRef = formRef}
          visible={this.state.addUserModalVisible}
          confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddUserOk}
        />  
      </div>
    );
  }
}

export default Grade;
