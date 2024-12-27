import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getJadwalPelajaran,
  deleteJadwalPelajaran,
  editJadwalPelajaran,
  addJadwalPelajaran,
} from "@/api/jadwalPelajaran";
import TypingCard from "@/components/TypingCard";
import EditJadwalPelajaranForm from "./forms/edit-jadwal-pelajaran";
import AddJadwalPelajaranForm from "./forms/add-jadwal-pelajaran";
import { read, utils } from "xlsx";
const { Column } = Table;
class JadwalPelajaran extends Component {
  state = {
    jadwalPelajaran: [],
    editJadwalPelajaranModalVisible: false,
    editJadwalPelajaranModalLoading: false,
    currentRowData: {},
    addJadwalPelajaranModalVisible: false,
    addJadwalPelajaranModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getJadwalPelajaran = async () => {
    const result = await getJadwalPelajaran();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        jadwalPelajaran: content,
      });
    }
  };
  handleEditJadwalPelajaran = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editJadwalPelajaranModalVisible: true,
    });
  };

  handleDeleteJadwalPelajaran = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteJadwalPelajaran({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getJadwalPelajaran();
    });
  };

  handleEditJadwalPelajaranOk = (_) => {
    const { form } = this.editJadwalPelajaranFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editJadwalPelajaran(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editJadwalPelajaranModalVisible: false,
            editJadwalPelajaranModalLoading: false,
          });
          message.success("berhasi;!");
          this.getJadwalPelajaran();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editJadwalPelajaranModalVisible: false,
      addJadwalPelajaranModalVisible: false,
    });
  };

  handleAddJadwalPelajaran = (row) => {
    this.setState({
      addJadwalPelajaranModalVisible: true,
    });
  };

  handleAddJadwalPelajaranOk = (_) => {
    const { form } = this.addJadwalPelajaranFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addJadwalPelajaranModalLoading: true });
      addJadwalPelajaran(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addJadwalPelajaranModalVisible: false,
            addJadwalPelajaranModalLoading: false,
          });
          message.success("Berhasil!");
          this.getJadwalPelajaran();
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
        const existingJadwalPelajaranIndex = jadwalPelajaran.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingJadwalPelajaranIndex > -1) {
            // Update existing data
            await editJadwalPelajaran(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedJadwalPelajaran = [...prevState.jadwalPelajaran];
              updatedJadwalPelajaran[existingJadwalPelajaranIndex] = dataToSave;
              return { jadwalPelajaran: updatedJadwalPelajaran };
            });
          } else {
            // Add new data
            await addJadwalPelajaran(dataToSave);
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
    this.getJadwalPelajaran();
  }
  render() {
    const { jadwalPelajaran, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddJadwalPelajaran}>
            Tambahkan Jadwal Pelajaran
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola jadwal pelajaran di sistem, seperti menambahkan jadwal pelajaran baru, atau mengubah jadwal pelajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Jadwal Pelajaran" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={jadwalPelajaran}
            pagination={{ pageSize: 10 }}
          >
            
            <Column title="Guru Pengajar" dataIndex="lecture.name" key="lecture.name" align="center" />
            <Column title="Jabatan" dataIndex="jabatan" key="jabatan" align="center" />
            <Column title="Mata Pelajaran" dataIndex="mapel.name" key="mapel.name" align="center" />
            <Column title="Jam Pelajaran" dataIndex="jmlJam" key="jmlJam" align="center" />
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
                    onClick={this.handleEditJadwalPelajaran.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteJadwalPelajaran.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditJadwalPelajaranForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editJadwalPelajaranFormRef = formRef)
          }
          visible={this.state.editJadwalPelajaranModalVisible}
          confirmLoading={this.state.editJadwalPelajaranModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditJadwalPelajaranOk}
        />
        <AddJadwalPelajaranForm
          wrappedComponentRef={(formRef) =>
            (this.addJadwalPelajaranFormRef = formRef)
          }
          visible={this.state.addJadwalPelajaranModalVisible}
          confirmLoading={this.state.addJadwalPelajaranModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddJadwalPelajaranOk}
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

export default JadwalPelajaran;
