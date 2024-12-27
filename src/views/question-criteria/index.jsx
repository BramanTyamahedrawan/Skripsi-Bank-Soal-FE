import React,{Component} from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getQuestionCriterias,
  deleteQuestionCriteria,
  editQuestionCriteria,
  addQuestionCriteria,

} from "@/api/questionCriteria";

import TypingCard from "@/components/TypingCard";
import EditQuestionCriteriaForm from "./forms/edit-question-criteria-form";
import AddQuestionCriteriaForm from "./forms/add-question-criteria-form";
const { Column } = Table;
class QuestionCriteria extends Component {
    state = {
        questionCriterias: [],
        editQuestionCriteriaModalVisible: false,
        editQuestionCriteriaModalLoading: false,
        currentRowData: {},
        addQuestionCriteriaModalVisible: false,
        addQuestionCriteriaModalLoading: false,
    };
    getQuestionCriterias = async () => {
        const result = await getQuestionCriterias();
        const { content, statusCode } = result.data;
        if (statusCode === 200) {
        this.setState({
            questionCriterias: content,
        });
        }
    };

    handleEditQuestionCriteria = (row) => {
        this.setState({
        currentRowData: Object.assign({}, row),
        editQuestionCriteriaModalVisible: true,
        });
    };
    
    handleDeleteQuestionCriteria = (row) => {
        const { id } = row;
        if (id === "admin") {
        message.error("不能menghapusoleh  Admin！");
        return;
        }
        deleteQuestionCriteria({ id }).then((res) => {
        message.success("berhasil dihapus");
        this.getQuestionCriterias();
        });
    };
    handleCancel = () => {
        this.setState({
        addQuestionCriteriaModalVisible: false,
        editQuestionCriteriaModalVisible: false,
        });
    };
    handleAddQuestionCriteria = () => {
        this.setState({
        addQuestionCriteriaModalVisible: true,
        });
    };
    handleAddQuestionCriteriaOk = (_) => {
        const { form } = this.addQuestionCriteriaForm.props;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
        this.setState({ addQuestionCriteriaModalLoading: true });
        addQuestionCriteria(values).then((res) => {
            message.success("Berhasil");
            this.setState({
            addQuestionCriteriaModalLoading: false,
            addQuestionCriteriaModalVisible: false,
            });
            this.getQuestionCriterias();
        });
        });
    }
    handleEditQuestionCriteriaOk = (_) => {
        const { form } = this.editQuestionCriteriaForm.props;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
        this.setState({ editQuestionCriteriaModalLoading: true });
        editQuestionCriteria(values, this.state.currentRowData.id).then((res) => {
            message.success("berhasi;");
            this.setState({
            editQuestionCriteriaModalLoading: false,
            editQuestionCriteriaModalVisible: false,
            });
            this.getQuestionCriterias();

        });
        });
    };
    componentDidMount() {
        this.getQuestionCriterias();
    }
    render() {
        const { questionCriterias, } = this.state;

        const title = (
            <span>
                <Button type="primary" onClick={this.handleAddQuestionCriteria}>
                    Tambah Kriteria Pertanyaan
                </Button>
            </span>
        );
        return (
            <div className="app-container">
            <TypingCard title="Kriteria Pertanyaan" source="Kriteria Pertanyaan" />
            <br />
            <Card title={title}>
            <Table 
                bordered rowKey="id"
                dataSource={questionCriterias}
                pagination={false}>
                <Column
                title="ID"
                key="id"
                align="center"
                render={(value, record, index) => index + 1}
                />                
                <Column title="Nama" dataIndex="name" key="name" align="center" />
                <Column 
                    title="Deskripsi Kriteria Pertanyaan" 
                    dataIndex="description" 
                    key="description"
                    align="center"
                />
                <Column
                    title="Kategori"
                    dataIndex="category"
                    key="category"
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
                            onClick={this.handleEditQuestionCriteria.bind(null, row)}
                        />
                        <Divider type="vertical" />
                        <Button
                            type="primary"
                            shape="circle"
                            icon="delete"
                            title="menghapus"
                            onClick={this.handleDeleteQuestionCriteria.bind(null, row)}
                        />
                        </span>
                    )}
                    />
                {/* ... */}
            </Table>   
            </Card>
            <EditQuestionCriteriaForm
                wrappedComponentRef={(form) => (this.editQuestionCriteriaForm = form)}
                visible={this.state.editQuestionCriteriaModalVisible}
                confirmLoading={this.state.editQuestionCriteriaModalLoading}
                onCancel={this.handleCancel}
                onOk={this.handleEditQuestionCriteriaOk}
                currentRowData={this.state.currentRowData}
            />
            <AddQuestionCriteriaForm
                wrappedComponentRef={(form) => (this.addQuestionCriteriaForm = form)}
                visible={this.state.addQuestionCriteriaModalVisible}
                confirmLoading={this.state.addQuestionCriteriaModalLoading}
                onCancel={this.handleCancel}
                onOk={this.handleAddQuestionCriteriaOk}
            />
            </div>
        );
    }
}
export default QuestionCriteria;