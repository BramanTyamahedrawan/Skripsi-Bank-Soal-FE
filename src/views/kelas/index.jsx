import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getKelas,
  deleteKelas,
  editKelas,
  addKelas,
} from "@/api/kelas";
import TypingCard from "@/components/TypingCard";
import EditKelasForm from "./forms/edit-kelas-form";
import AddKelasForm from "./forms/add-kelas-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class Kelas extends Component {
  state = {
    kelas: [],
    editKelasModalVisible: false,
    editKelasModalLoading: false,
    currentRowData: {},
    addKelasModalVisible: false,
    addKelasModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getKelas = async () => {
    const result = await getKelas();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        kelas: content,
      });
    }
  };
  handleEditKelas = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editKelasModalVisible: true,
    });
  };

  handleDeleteKelas = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteKelas({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getKelas();
    });
  };

  handleEditKelasOk = (_) => {
    const { form } = this.editKelasFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editKelas(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editKelasModalVisible: false,
            editKelasModalLoading: false,
          });
          message.success("berhasi;!");
          this.getKelas();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editKelasModalVisible: false,
      addKelasModalVisible: false,
    });
  };

  handleAddKelas = (row) => {
    this.setState({
      addKelasModalVisible: true,
    });
  };

  handleAddKelasOk = (_) => {
    const { form } = this.addKelasFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addKelasModalLoading: true });
      addKelas(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addKelasModalVisible: false,
            addKelasModalLoading: false,
          });
          message.success("Berhasil!");
          this.getKelas();
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
    const { importedData, kelas } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Konsentrasi"]],
          konsentrasi: row[columnMapping["Nama Konsentrasi Keahlian"]],
          programKeahlian_id: row[columnMapping["ID Program"]],
        };
  
        // Check if data already exists
        const existingKelasIndex = kelas.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingKelasIndex > -1) {
            // Update existing data
            await editKelas(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedKelas = [...prevState.kelas];
              updatedKelas[existingKelasIndex] = dataToSave;
              return { kelas: updatedKelas };
            });
          } else {
            // Add new data
            await addKelas(dataToSave);
            this.setState((prevState) => ({
              kelas: [...prevState.kelas, dataToSave],
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
    this.getKelas();
  }
  render() {
    const { kelas, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddKelas}>
            Tambahkan Kelas
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola kelas di sistem, seperti menambahkan kelas baru, atau mengubah kelas yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Kelas" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={kelas}
            pagination={{ pageSize: 10 }}
          >
            
            <Column title="ID Kelas" dataIndex="idKelas" key="idKelas" align="center" />
            <Column title="Nama Kelas" dataIndex="namaKelas" key="namaKelas" align="center" />
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
                    onClick={this.handleEditKelas.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteKelas.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditKelasForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editKelasFormRef = formRef)
          }
          visible={this.state.editKelasModalVisible}
          confirmLoading={this.state.editKelasModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditKelasOk}
        />
        <AddKelasForm
          wrappedComponentRef={(formRef) =>
            (this.addKelasFormRef = formRef)
          }
          visible={this.state.addKelasModalVisible}
          confirmLoading={this.state.addKelasModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddKelasOk}
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

export default Kelas;
