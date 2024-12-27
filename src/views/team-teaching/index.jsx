import React, {Component} from "react";
import {Card, Button, Table, message, Divider} from "antd";
import {
  getTeamTeachings,
  deleteTeamTeaching,
  editTeamTeaching,
  addTeamTeaching,
} from "@/api/teamTeaching";
import {getLectures} from "@/api/lecture";

import TypingCard from "@/components/TypingCard";
import EditTeamTeachingForm from "./forms/edit-team-teaching-form";
import AddTeamTeachingForm from "./forms/add-team-teaching-form";

const {Column} = Table;
class TeamTeaching extends Component {
    state={
        teamTeachings: [],
        Lectures: [],
        editTeamTeachingModalVisible: false,
        editTeamTeachingModalLoading: false,
        currentRowData: {},
        addTeamTeachingModalVisible: false,
        addTeamTeachingModalLoading: false,
    };

    getTeamTeachings = async () => {
        const result = await getTeamTeachings();
        const {content, statusCode} = result.data;
        if (statusCode === 200) {
            this.setState({
                teamTeachings: content,
            });
        }
    };

    getLectures = async () => {
        const result = await getLectures();
        const {content, statusCode} = result.data;
        if (statusCode === 200) {
            this.setState({
                lectures: content,
            });
        }
    };

    handleEditTeamTeaching = (row) => {
        this.setState({
            currentRowData: Object.assign({}, row),
            editTeamTeachingModalVisible: true,
        });
    };

    handleDeleteTeamTeaching = (row) => {
        const {id} = row;
        if (id === "admin") {
            message.error("不能menghapusoleh  Admin！");
            return;
        }
        deleteTeamTeaching({id}).then((res) => {
            message.success("berhasil dihapus");
            this.getTeamTeachings();
        });
    };

    handleEditTeamTeachingOk = () => {
        const {form} = this.editTeamTeachingFormRef.props;
        this.editTeamTeachingForm.validateFields((err, values) => {
            if (err) return;
            this.setState({editTeamTeachingModalLoading: true});
            editTeamTeaching(values).then((res) => {
                this.setState({
                    editTeamTeachingModalVisible: false,
                    editTeamTeachingModalLoading: false,
                });
                message.success("Berhasil mengedit Team Teaching!");
                this.getTeamTeachings();
            });
        });
    };

    handleCancel = () => {
        this.setState({
            editTeamTeachingModalVisible: false,
            addTeamTeachingModalVisible: false,
        });
    }

    handleAddTeamTeaching = () => {
        this.setState({
            addTeamTeachingModalVisible: true,
        });
    };

    handleAddTeamTeachingOk = () => {
        const {form} =  this.addTeamTeachingFormRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({addTeamTeachingModalLoading: true});
            addTeamTeaching(values).then((response) => {
                form.resetFields();
                this.setState({
                    addTeamTeachingModalVisible: false,
                    addTeamTeachingModalLoading: false,
                });
                message.success("Berhasil menambahkan Team Teaching!");
                this.getTeamTeachings();
            })
            .catch((e) => {
                console.error(e.response.data);
                message.error("Gagal menambahkan Team Teaching!");
            });
        });
    };
    componentDidMount() {
        this.getTeamTeachings();
        this.getLectures();
    }

    render(){
        const {
            teamTeachings,
            lectures,
        } = this.state;
        const title = (
            <span>
                <Button type="primary" onClick={this.handleAddTeamTeaching}>
                    Tambahkan Team Teaching
                </Button>
            </span>
        );
        const cardContent = "Di sini, Anda dapat mengelola Team teachhing untuk menilai soal , Di bawah ini daftar team teaching yang ada.  "
        return(
            <div className="app-container">
                <TypingCard title="Team Teaching" source={cardContent} />
                <Card title={title}>
                    <Table bordered rowKey="id" dataSource={teamTeachings} pagination={false}>
                        <Column title="Nama Team Teaaching" dataIndex="name" key="name" align="center" />
                        <Column title="Deskripsi tim teaching" dataIndex="description" key="description" align="center" />
                        <Column
                        title="Nama Dosen 1"
                        dataIndex="lecture.name"
                        key="lecture.name"
                        align="center"
                        />
                        <Column
                        title="Nama Dosen 2"
                        dataIndex="lecture2.name"
                        key="lecture2.name"
                        align="center"
                        />
                        <Column
                        title="Nama Dosen 3"
                        dataIndex="lecture3.name"
                        key="lecture3.name"
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
                                onClick={this.handleEditTeamTeaching.bind(null, row)}
                            />
                            <Divider type="vertical" />
                            <Button
                                type="primary"
                                shape="circle"
                                icon="delete"
                                title="menghapus"
                                onClick={this.handleDeleteTeamTeaching.bind(null, row)}
                            />
                            </span>
                        )}
                        />
                    </Table>
                </Card>
                <EditTeamTeachingForm
                currentRowData={this.state.currentRowData}
                wrappedComponentRef={(formRef) => (this.editTeamTeachingFormRef = formRef)}
                visible={this.state.editTeamTeachingModalVisible}
                confirmLoading={this.state.editTeamTeachingModalLoading}
                onCancel={this.handleCancel}
                onOk={this.handleEditTeamTeachingOk}
                />
                <AddTeamTeachingForm
                wrappedComponentRef={(formRef) => (this.addTeamTeachingFormRef = formRef)}
                visible={this.state.addTeamTeachingModalVisible}
                confirmLoading={this.state.addTeamTeachingModalLoading}
                onCancel={this.handleCancel}
                onOk={this.handleAddTeamTeachingOk}
                lecture={lectures}
                />
            </div>
        );
    }
}
export default TeamTeaching;