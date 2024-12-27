import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import { getSchoolProfiles, deleteSchoolProfile, editSchoolProfile, addSchoolProfile } from "@/api/schoolProfile";
import TypingCard from "@/components/TypingCard";
import EditSchoolProfileForm from "./forms/edit-schoolProfile-form";
import AddSchoolProfileForm from "./forms/add-schoolProfile-form";
const { Column } = Table;
class SchoolProfile extends Component {
  state = {
    schoolProfiles: [],
    editSchoolProfileModalVisible: false,
    editSchoolProfileModalLoading: false,
    currentRowData: {},
    addSchoolProfileModalVisible: false,
    addSchoolProfileModalLoading: false,
  };

  getSchoolProfiles = async () => {
    const result = await getSchoolProfiles();
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
      this.setState({
        schoolProfiles: content,
      });
    }
  };
  handleEditSchoolProfile = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editSchoolProfileModalVisible: true,
    });
  };

  handleDeleteSchoolProfile = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    deleteSchoolProfile({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getSchoolProfiles();
    });
  };

  handleEditSchoolProfileOk = (_) => {
    const { form } = this.EditSchoolProfileFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editSchoolProfile(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editSchoolProfileModalVisible: false,
            editSchoolProfileModalLoading: false,
          });
          message.success("Berhasil memperbarui pengguna!");
          this.getSchoolProfiles();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editSchoolProfileModalVisible: false,
      addSchoolProfileModalVisible: false,
    });
  };

  handleAddSchoolProfile = (row) => {
    this.setState({
      addSchoolProfileModalVisible: true,
    });
  };

  handleAddSchoolProfileOk = (_) => {
    const { form } = this.AddSchoolProfileFormRef.props;
    form.validateFields((err, values) => {
        if (err) {
            return;
        }
        this.setState({ addSchoolProfileModalLoading: true });
        addSchoolProfile(values)
            .then((response) => {
                form.resetFields();
                this.setState({
                    addSchoolProfileModalVisible: false,
                    addSchoolProfileModalLoading: false,
                });
                message.success("SchoolProfile added successfully!");
                this.getSchoolProfiles();
            })
            .catch((e) => {
                console.error(e.response.data); // Log the error message from the server
                console.log(values); // Log the values object
                this.setState({ addSchoolProfileModalLoading: false });
                message.error("Failed to add schoolProfile, please try again!");
            });
    });
};
  componentDidMount() {
    this.getSchoolProfiles();
  }
  render() {
    const { schoolProfiles } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddSchoolProfile}>
          Tambahkan Profil Sekolah
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola sekolah di sistem, seperti menambahkan sekolah baru, atau mengubah sekolah yang sudah ada di sistem.。`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Sekolah" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
          <Table bordered rowKey="id" dataSource={schoolProfiles} pagination={false}>
            <Column title="NPSN" dataIndex="npsn" key="npsn" align="center" />
            <Column title="Sekolah" dataIndex="school.name" key="school.name" align="center" />
            <Column title="Status" dataIndex="status" key="status" align="center"/>
            <Column title="Bentuk Kependidikan" dataIndex="bentukKependidikan" key="bentukKependidikan" align="center"/>
            <Column title="Status Kepemilikan" dataIndex="kepemilikan" key="kepemilikan" align="center"/>
            <Column title="SK Pendirian Sekolah" dataIndex="skpendirianSekolah" key="skpendirianSekolah" align="center"/>
            <Column title="Tanggal SK Pendirian" dataIndex="tglSKPendirian" key="tglSKPendirian" align="center"/>
            <Column title="SK Izin Operasional" dataIndex="skizinOperasional" key="skizinOperasional" align="center"/>
            <Column title="Tanggal SK Izin Operasional" dataIndex="tglSKOperasional" key="tglSKOperasional" align="center"/>
            {/* <Column
              title="Foto Profil Sekolah"
              dataIndex="file_path"
              key="file_path"
              align="center"
              render={(text, row) => (
                <img
                  src={`${'webhdfs/v1/profiles/' + row.file_path}`}
                  width={200}
                  height={150}
                />
              )}
            /> */}
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
                    onClick={this.handleEditSchoolProfile.bind(row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteSchoolProfile.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditSchoolProfileForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.EditSchoolProfileFormRef = formRef)}
          visible={this.state.editSchoolProfileModalVisible}
          confirmLoading={this.state.editSchoolProfileModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditSchoolProfileOk}
        />
        <AddSchoolProfileForm
          wrappedComponentRef={(formRef) => (this.AddSchoolProfileFormRef = formRef)}
          visible={this.state.addSchoolProfileModalVisible}
          confirmLoading={this.state.addSchoolProfileModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddSchoolProfileOk}
        />
      </div>
    );
  }
}

export default SchoolProfile;
