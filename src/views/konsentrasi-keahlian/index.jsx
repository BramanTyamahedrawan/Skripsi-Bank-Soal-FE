import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getKonsentrasiKeahlian,
  deleteKonsentrasiKeahlian,
  editKonsentrasiKeahlian,
  addKonsentrasiKeahlian,
} from "@/api/konsentrasiKeahlian";
import TypingCard from "@/components/TypingCard";
import EditKonsentrasiKeahlianForm from "./forms/edit-konsentrasi-keahlian-form";
import AddKonsentrasiKeahlianForm from "./forms/add-konsentrasi-keahlian-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class KonsentrasiKeahlian extends Component {
  state = {
    konsentrasiKeahlians: [],
    editKonsentrasiKeahlianModalVisible: false,
    editKonsentrasiKeahlianModalLoading: false,
    currentRowData: {},
    addKonsentrasiKeahlianModalVisible: false,
    addKonsentrasiKeahlianModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getKonsentrasiKeahlian = async () => {
    const result = await getKonsentrasiKeahlian();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        konsentrasiKeahlians: content,
      });
    }
  };
  handleEditKonsentrasiKeahlian = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editKonsentrasiKeahlianModalVisible: true,
    });
  };

  handleDeleteKonsentrasiKeahlian = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteKonsentrasiKeahlian({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getKonsentrasiKeahlian();
    });
  };

  handleEditKonsentrasiKeahlianOk = (_) => {
    const { form } = this.editKonsentrasiKeahlianFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editKonsentrasiKeahlian(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editKonsentrasiKeahlianModalVisible: false,
            editKonsentrasiKeahlianModalLoading: false,
          });
          message.success("berhasi;!");
          this.getKonsentrasiKeahlian();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editKonsentrasiKeahlianModalVisible: false,
      addKonsentrasiKeahlianModalVisible: false,
    });
  };

  handleAddKonsentrasiKeahlian = (row) => {
    this.setState({
      addKonsentrasiKeahlianModalVisible: true,
    });
  };

  handleAddKonsentrasiKeahlianOk = (_) => {
    const { form } = this.addKonsentrasiKeahlianFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addKonsentrasiKeahlianModalLoading: true });
      addKonsentrasiKeahlian(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addKonsentrasiKeahlianModalVisible: false,
            addKonsentrasiKeahlianModalLoading: false,
          });
          message.success("Berhasil!");
          this.getKonsentrasiKeahlian();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, coba lagi!");
        });
    });
  };
  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true });
  };

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false });
  };

  handleFileImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitles = jsonData[0]; // Assume the first row contains column titles
      const fileName = file.name.toLowerCase();

      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index;
      });

      this.setState({
        importedData,
        columnTitles,
        fileName,
        columnMapping,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  handleUpload = () => {
    const { importedData, columnMapping } = this.state;
  
    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }
  
    this.setState({ uploading: true });
  
    this.saveImportedData(columnMapping)
      .then(() => {
        this.setState({
          uploading: false,
          importModalVisible: false,
        });
      })
      .catch((error) => {
        console.error("Gagal mengunggah data:", error);
        this.setState({ uploading: false });
        message.error("Gagal mengunggah data, harap coba lagi.");
      });
  };

  saveImportedData = async (columnMapping) => {
    const { importedData, konsentrasiKeahlians } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Konsentrasi"]],
          konsentrasi: row[columnMapping["Nama Konsentrasi Keahlian"]],
          programKeahlian_id: row[columnMapping["ID Program"]],
        };
  
        // Check if data already exists
        const existingKonsentrasiKeahlianIndex = konsentrasiKeahlians.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingKonsentrasiKeahlianIndex > -1) {
            // Update existing data
            await editKonsentrasiKeahlian(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedKonsentrasiKeahlian = [...prevState.konsentrasiKeahlians];
              updatedKonsentrasiKeahlian[existingKonsentrasiKeahlianIndex] = dataToSave;
              return { konsentrasiKeahlians: updatedKonsentrasiKeahlian };
            });
          } else {
            // Add new data
            await addKonsentrasiKeahlian(dataToSave);
            this.setState((prevState) => ({
              konsentrasiKeahlians: [...prevState.konsentrasiKeahlians, dataToSave],
            }));
          }
        } catch (error) {
          errorCount++;
          console.error("Gagal menyimpan data:", error);
        }
      }
  
      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(`${errorCount} data gagal disimpan, harap coba lagi!`);
      }
  
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      this.setState({
        importedData: [],
        columnTitles: [],
        columnMapping: {},
      });
    }
  };
  componentDidMount() {
    this.getKonsentrasiKeahlian();
  }
  render() {
    const { konsentrasiKeahlians, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddKonsentrasiKeahlian}>
            Tambahkan Konsentrasi Keahlian
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola konsentrasi keahlian di sistem, seperti menambahkan konsentrasi keahlian baru, atau mengubah konsentrasi keahlian yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Konsentrasi Keahlian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={konsentrasiKeahlians}
            pagination={{ pageSize: 10 }}
          >
            <Column title="Program Keahlian" dataIndex="programKeahlian.program" key="program" align="center" />
            <Column title="ID Konsentrasi Keahlian" dataIndex="id" key="id" align="center" />
            <Column title="Konsentrasi Keahlian" dataIndex="konsentrasi" key="konsentrasi" align="center" />
            {/* <Column
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
                    onClick={this.handleEditKonsentrasiKeahlian.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteKonsentrasiKeahlian.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditKonsentrasiKeahlianForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editKonsentrasiKeahlianFormRef = formRef)
          }
          visible={this.state.editKonsentrasiKeahlianModalVisible}
          confirmLoading={this.state.editKonsentrasiKeahlianModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditKonsentrasiKeahlianOk}
        />
        <AddKonsentrasiKeahlianForm
          wrappedComponentRef={(formRef) =>
            (this.addKonsentrasiKeahlianFormRef = formRef)
          }
          visible={this.state.addKonsentrasiKeahlianModalVisible}
          confirmLoading={this.state.addKonsentrasiKeahlianModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddKonsentrasiKeahlianOk}
        />
        <Modal
          title="Import File"
          visible={importModalVisible}
          onCancel={this.handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={this.handleImportModalClose}>
              Cancel
            </Button>,
            <Button
              key="upload"
              type="primary"
              loading={this.state.uploading}
              onClick={this.handleUpload}
            >
              Upload
            </Button>,
          ]}
        >
          <Upload beforeUpload={this.handleFileImport}>
            <Button>Pilih File</Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default KonsentrasiKeahlian;
