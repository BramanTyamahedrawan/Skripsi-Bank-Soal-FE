import React,{Component} from "react";
import { Card, Button, Table, message, Divider } from "antd";
import {
  getLinguisticValues,
  deleteLinguisticValue,
  editLinguisticValue,
  addLinguisticValue,
} from "@/api/linguisticValue";
import image1 from '../../assets/imagesCriteria/image1.png';

import TypingCard from "@/components/TypingCard";
import EditLinguisticValueForm from "./forms/edit-linguistic-value-form";
import AddLinguisticValueForm from "./forms/add-linguistic-value-form";
const { Column } = Table;


class LinguisticValue extends Component {
    state = {
        linguisticValues: [],
        editLinguisticValueModalVisible: false,
        editLinguisticValueModalLoading: false,
        currentRowData: {},
        addLinguisticValueModalVisible: false,
        addLinguisticValueModalLoading: false,
    };
    getLinguisticValues = async () => {
        const result = await getLinguisticValues();
        const { content, statusCode } = result.data;
        if (statusCode === 200) {
        this.setState({
            linguisticValues: content,
        });
        }
    };
    handleEditLinguisticValue = (row) => {
        this.setState({
        currentRowData: Object.assign({}, row),
        editLinguisticValueModalVisible: true,
        });
    }

    handleDeleteLinguisticValue = (row) => {
        const { id } = row;
        if (id === "admin") {
        message.error("hapus eror");
        return;
        }
        deleteLinguisticValue({ id }).then((res) => {
        message.success("berhasil dihapus");
        this.getLinguisticValues();
        });
    };
    handleCancel = () => {
        this.setState({
        addLinguisticValueModalVisible: false,
        editLinguisticValueModalVisible: false,
        });
    };
    handleAddLinguisticValue = () => {
        this.setState({
        addLinguisticValueModalVisible: true,
        });
    };
    handleAddLinguisticValueOk = (_) => {
        const { form } = this.addLinguisticValueFormRef.props;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
        this.setState({ addLinguisticValueModalLoading: true });
        const { file, ...otherValues } = values;
      
        const formData = new FormData();
        if (file && file.fileList.length > 0) {
            formData.append("file", file.fileList[0].originFileObj);
        } 
        formData.append("name", otherValues.name);  
        formData.append("value1", otherValues.value1);
        formData.append("value2", otherValues.value2);
        formData.append("value3", otherValues.value3);
        formData.append("value4", otherValues.value4);
        

        addLinguisticValue(formData)
            .then((response) => {
            form.resetFields();
            this.setState({
                addLinguisticValueModalVisible: false,
                addLinguisticValueModalLoading: false,
            });
            message.success("Berhasil!");
            this.getLinguisticValues();
            })
            .catch((error) => {
            this.setState({ addLinguisticValueModalLoading: false });
            });
        });
    };

    handleEditLinguisticValueOk = (_) => {
        const { form } = this.editLinguisticValueFormRef.props;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
        this.setState({ editLinguisticValueModalLoading: true });
        editLinguisticValue(values, this.state.currentRowData.id).then((res) => {
            message.success("berhasi;");
            this.setState({
                editLinguisticValueModalVisible: false,
                editLinguisticValueModalLoading: false,
            });
            message.success("berhasi;!");
            this.getLinguisticValues();
            
        });
        });
    };
    componentDidMount() {
        this.getLinguisticValues();
    }

    render() {
        const { linguisticValues } = this.state;
        const sortedLinguisticValues = [...linguisticValues].sort((a, b) => a.avg - b.avg);
        const BASE_URL = 'http://hadoop-primary:9870/';

        
        const title = (
        <span>    
            <Button type="primary" onClick={this.handleAddLinguisticValue}>
                Tambah Nilai Dari Tabel Linguistic Untuk IVIHV
            </Button>
        </span>
        );
        return (
        <div className="app-container">
            <TypingCard source="Disini anda dapat menambahkan linguistic value beserta gambar yang anda iginkan" />
            <Card title = {title} >
            <Table dataSource={sortedLinguisticValues}  rowKey="id">
                <Column
                title="ID"
                key="id"
                align="center"
                render={(value, record, index) => index + 1}
                />                
                <Column
                title="Name"
                dataIndex="name"
                key="name"
                render={(text, record) => {
                    if (record.file_path) {
                        return (
                          <>
                            {text}
                            <img src={`${BASE_URL}${record.file_path}`} alt={text} style={{width: '200px', height: '200px', marginLeft: '10px'}}/>                    </>
                        );
                      }
                      else {
                        return text;
                      }
                }}
                />
                <Column title="Value 1" dataIndex="value1" key="value1" />
                <Column title="Value 2" dataIndex="value2" key="value2" />
                <Column title="Value 3" dataIndex="value3" key="value3" />
                <Column title="Value 4" dataIndex="value4" key="value4" />
                {/* <Column title="Average" dataIndex="avg" key="avg" /> */}
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
                                onClick={() => this.handleEditLinguisticValue(row)}
                            />
                            <Divider type="vertical" />
                            <Button
                                type="primary"
                                shape="circle"
                                icon="delete"
                                title="menghapus"
                                onClick={() => this.handleDeleteLinguisticValue(row)}
                            />
                        </span>
                    )}
                />
            </Table>
            </Card>
            <EditLinguisticValueForm
            wrappedComponentRef={(form) => (this.editLinguisticValueFormRef = form)}
            visible={this.state.editLinguisticValueModalVisible}
            confirmLoading={this.state.editLinguisticValueModalLoading}
            onCancel={this.handleCancel}
            onOk={this.handleEditLinguisticValueOk}
            currentRowData={this.state.currentRowData}
            file_path={this.state.currentRowData.file_path} // Add this line

            />
            <AddLinguisticValueForm
            wrappedComponentRef={(form) => (this.addLinguisticValueFormRef = form)}
            visible={this.state.addLinguisticValueModalVisible}
            confirmLoading={this.state.addLinguisticValueModalLoading}
            onCancel={this.handleCancel}
            onOk={this.handleAddLinguisticValueOk}
            />
        </div>
        );
    }
}
export default LinguisticValue;