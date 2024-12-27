import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getACP,
  deleteACP,
  editACP,
  addACP,
} from "@/api/acp";
import TypingCard from "@/components/TypingCard";
import EditACPForm from "./forms/edit-acp-form";
import AddACPForm from "./forms/add-acp-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class ACP extends Component {
  state = {
    jadwalPelajaran: [],
    editACPModalVisible: false,
    editACPModalLoading: false,
    currentRowData: {},
    addACPModalVisible: false,
    addACPModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getACP = async () => {
    const result = await getACP();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        jadwalPelajaran: content,
      });
    }
  };
  handleEditACP = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editACPModalVisible: true,
    });
  };

  handleDeleteACP = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteACP({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getACP();
    });
  };

  handleEditACPOk = (_) => {
    const { form } = this.editACPFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editACP(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editACPModalVisible: false,
            editACPModalLoading: false,
          });
          message.success("berhasi;!");
          this.getACP();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editACPModalVisible: false,
      addACPModalVisible: false,
    });
  };

  handleAddACP = (row) => {
    this.setState({
      addACPModalVisible: true,
    });
  };

  handleAddACPOk = (_) => {
    const { form } = this.addACPFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addACPModalLoading: true });
      addACP(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addACPModalVisible: false,
            addACPModalLoading: false,
          });
          message.success("Berhasil!");
          this.getACP();
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
    const { importedData, jadwalPelajaran } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Konsentrasi"]],
          konsentrasi: row[columnMapping["Nama Konsentrasi Keahlian"]],
          programKeahlian_id: row[columnMapping["ID Program"]],
        };
  
        // Check if data already exists
        const existingACPIndex = jadwalPelajaran.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingACPIndex > -1) {
            // Update existing data
            await editACP(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedACP = [...prevState.jadwalPelajaran];
              updatedACP[existingACPIndex] = dataToSave;
              return { jadwalPelajaran: updatedACP };
            });
          } else {
            // Add new data
            await addACP(dataToSave);
            this.setState((prevState) => ({
              jadwalPelajaran: [...prevState.jadwalPelajaran, dataToSave],
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
    this.getACP();
  }
  render() {
    const { jadwalPelajaran, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddACP}>
            Tambahkan Analisa Capaian Pembelajaran
          </Button>
        </Col>
        <Col xs={30} sm={20} md={20} lg={20} xl={20}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola Analisa Capaian Pembelajaran di sistem, seperti menambahkan Analisa Capaian Pembelajaran baru, atau mengubah Analisa Capaian Pembelajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Analisa Capaian Pembelajaran" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={jadwalPelajaran}
            pagination={{ pageSize: 10 }}
          >
            
            <Column title="Kode" dataIndex="lecture.name" key="lecture.name" align="center" />
            <Column title="Tahun Ajaran" dataIndex="jabatan" key="jabatan" align="center" />
            <Column title="Jurusan" dataIndex="mapel.name" key="mapel.name" align="center" />
            <Column title="Kelas" dataIndex="jmlJam" key="jmlJam" align="center" />
            <Column title="Semester" dataIndex="jmlJam" key="jmlJam" align="center" />
            <Column title="Mapel" dataIndex="jmlJam" key="jmlJam" align="center" />
            <Column title="Capaian Pembelajaran" dataIndex="jmlJam" key="jmlJam" align="center" />
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
                    onClick={this.handleEditACP.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteACP.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditACPForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editACPFormRef = formRef)
          }
          visible={this.state.editACPModalVisible}
          confirmLoading={this.state.editACPModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditACPOk}
        />
        <AddACPForm
          wrappedComponentRef={(formRef) =>
            (this.addACPFormRef = formRef)
          }
          visible={this.state.addACPModalVisible}
          confirmLoading={this.state.addACPModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddACPOk}
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

export default ACP;
