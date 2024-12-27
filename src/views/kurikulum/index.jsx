import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getKurikulum,
  deleteKurikulum,
  editKurikulum,
  addKurikulum,
} from "@/api/kurikulum";
import TypingCard from "@/components/TypingCard";
import EditKurikulumForm from "./forms/edit-kurikulum-form";
import AddKurikulumForm from "./forms/add-kurikulum-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class Kurikulum extends Component {
  state = {
    jadwalPelajaran: [],
    editKurikulumModalVisible: false,
    editKurikulumModalLoading: false,
    currentRowData: {},
    addKurikulumModalVisible: false,
    addKurikulumModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getKurikulum = async () => {
    const result = await getKurikulum();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        jadwalPelajaran: content,
      });
    }
  };
  handleEditKurikulum = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editKurikulumModalVisible: true,
    });
  };

  handleDeleteKurikulum = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteKurikulum({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getKurikulum();
    });
  };

  handleEditKurikulumOk = (_) => {
    const { form } = this.editKurikulumFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editKurikulum(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editKurikulumModalVisible: false,
            editKurikulumModalLoading: false,
          });
          message.success("berhasi;!");
          this.getKurikulum();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editKurikulumModalVisible: false,
      addKurikulumModalVisible: false,
    });
  };

  handleAddKurikulum = (row) => {
    this.setState({
      addKurikulumModalVisible: true,
    });
  };

  handleAddKurikulumOk = (_) => {
    const { form } = this.addKurikulumFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addKurikulumModalLoading: true });
      addKurikulum(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addKurikulumModalVisible: false,
            addKurikulumModalLoading: false,
          });
          message.success("Berhasil!");
          this.getKurikulum();
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
        const existingKurikulumIndex = jadwalPelajaran.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingKurikulumIndex > -1) {
            // Update existing data
            await editKurikulum(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedKurikulum = [...prevState.jadwalPelajaran];
              updatedKurikulum[existingKurikulumIndex] = dataToSave;
              return { jadwalPelajaran: updatedKurikulum };
            });
          } else {
            // Add new data
            await addKurikulum(dataToSave);
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
    this.getKurikulum();
  }
  render() {
    const { jadwalPelajaran, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddKurikulum}>
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
                    onClick={this.handleEditKurikulum.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteKurikulum.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditKurikulumForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editKurikulumFormRef = formRef)
          }
          visible={this.state.editKurikulumModalVisible}
          confirmLoading={this.state.editKurikulumModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditKurikulumOk}
        />
        <AddKurikulumForm
          wrappedComponentRef={(formRef) =>
            (this.addKurikulumFormRef = formRef)
          }
          visible={this.state.addKurikulumModalVisible}
          confirmLoading={this.state.addKurikulumModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddKurikulumOk}
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

export default Kurikulum;
