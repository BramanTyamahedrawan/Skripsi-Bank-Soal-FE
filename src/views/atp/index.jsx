import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getATP,
  deleteATP,
  editATP,
  addATP,
} from "@/api/atp";
import TypingCard from "@/components/TypingCard";
import EditATPForm from "./forms/edit-atp-form";
import AddATPForm from "./forms/add-atp-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class ATP extends Component {
  state = {
    jadwalPelajaran: [],
    editATPModalVisible: false,
    editATPModalLoading: false,
    currentRowData: {},
    addATPModalVisible: false,
    addATPModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getATP = async () => {
    const result = await getATP();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        jadwalPelajaran: content,
      });
    }
  };
  handleEditATP = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editATPModalVisible: true,
    });
  };

  handleDeleteATP = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteATP({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getATP();
    });
  };

  handleEditATPOk = (_) => {
    const { form } = this.editATPFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editATP(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editATPModalVisible: false,
            editATPModalLoading: false,
          });
          message.success("berhasi;!");
          this.getATP();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editATPModalVisible: false,
      addATPModalVisible: false,
    });
  };

  handleAddATP = (row) => {
    this.setState({
      addATPModalVisible: true,
    });
  };

  handleAddATPOk = (_) => {
    const { form } = this.addATPFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addATPModalLoading: true });
      addATP(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addATPModalVisible: false,
            addATPModalLoading: false,
          });
          message.success("Berhasil!");
          this.getATP();
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
        const existingATPIndex = jadwalPelajaran.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingATPIndex > -1) {
            // Update existing data
            await editATP(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedATP = [...prevState.jadwalPelajaran];
              updatedATP[existingATPIndex] = dataToSave;
              return { jadwalPelajaran: updatedATP };
            });
          } else {
            // Add new data
            await addATP(dataToSave);
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
    this.getATP();
  }
  render() {
    const { jadwalPelajaran, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddATP}>
            Tambahkan Alur Tujuan Pembelajaran
          </Button>
        </Col>
        <Col xs={30} sm={20} md={20} lg={20} xl={20}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola Alur Tujuan Pembelajaran di sistem, seperti menambahkan Alur Tujuan Pembelajaran baru, atau mengubah Alur Tujuan Pembelajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Alur Tujuan Pembelajaran" source={cardContent} />
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
                    onClick={this.handleEditATP.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteATP.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditATPForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editATPFormRef = formRef)
          }
          visible={this.state.editATPModalVisible}
          confirmLoading={this.state.editATPModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditATPOk}
        />
        <AddATPForm
          wrappedComponentRef={(formRef) =>
            (this.addATPFormRef = formRef)
          }
          visible={this.state.addATPModalVisible}
          confirmLoading={this.state.addATPModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddATPOk}
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

export default ATP;
