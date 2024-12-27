import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getAppraisalForms,
  deleteAppraisalForm,
  editAppraisalForm,
  addAppraisalForm,
} from "@/api/appraisalForm";
import TypingCard from "@/components/TypingCard";
import EditAppraisalForm from "./forms/edit-appraisal-form";
import AddAppraisalForm from "./forms/add-appraisal-form";
const { Column } = Table;
class AppraisalForm extends Component {
  state = {
    appraisalForms: [],
    editAppraisalFormModalVisible: false,
    editAppraisalFormModalLoading: false,
    currentRowData: {},
    addAppraisalFormModalVisible: false,
    addAppraisalFormModalLoading: false,
  };
  getAppraisalForms = async () => {
    const result = await getAppraisalForms();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        appraisalForms: content,
      });
    }
  };
  handleEditAppraisalForm = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editAppraisalFormModalVisible: true,
    });
  };

  handleDeleteAppraisalForm = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteAppraisalForm({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getAppraisalForms();
    });
  };

  handleEditAppraisalFormOk = (_) => {
    const { form } = this.editAppraisalFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editAppraisalForm(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editAppraisalFormModalVisible: false,
            editAppraisalFormModalLoading: false,
          });
          message.success("berhasi;!");
          this.getAppraisalForms();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editAppraisalFormModalVisible: false,
      addAppraisalFormModalVisible: false,
    });
  };

  handleAddAppraisalForm = (row) => {
    this.setState({
      addAppraisalFormModalVisible: true,
    });
  };

  handleAddAppraisalFormOk = (_) => {
    const { form } = this.addAppraisalFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addAppraisalFormModalLoading: true });
      addAppraisalForm(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addAppraisalFormModalVisible: false,
            addAppraisalFormModalLoading: false,
          });
          message.success("Berhasil!");
          this.getAppraisalForms();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  componentDidMount() {
    this.getAppraisalForms();
  }
  render() {
    const { appraisalForms } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddAppraisalForm}>
          Tambahkan formulir penilaian
        </Button>
      </span>
    );
    const cardContent = `Di sini, Anda dapat mengelola formulir penilaian di sistem, seperti menambahkan formulir penilaian baru, atau mengubah formulir penilaian yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Formulir Penilaian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={appraisalForms}
            pagination={false}
          >
            <Column
              title="ID Formulir Penilaian"
              dataIndex="id"
              key="id"
              align="center"
            />
            <Column title="Nama" dataIndex="name" key="name" align="center" />
            <Column
              title="Deskripsi Formulir Penilaian"
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
                    onClick={this.handleEditAppraisalForm.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteAppraisalForm.bind(null, row)}
                  />
                </span>
              )}
            />
          </Table>
        </Card>
        <EditAppraisalForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editAppraisalFormRef = formRef)
          }
          visible={this.state.editAppraisalFormModalVisible}
          confirmLoading={this.state.editAppraisalFormModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditAppraisalFormOk}
        />
        <AddAppraisalForm
          wrappedComponentRef={(formRef) =>
            (this.addAppraisalFormRef = formRef)
          }
          visible={this.state.addAppraisalFormModalVisible}
          confirmLoading={this.state.addAppraisalFormModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddAppraisalFormOk}
        />
      </div>
    );
  }
}

export default AppraisalForm;
