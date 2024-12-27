import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getSeason,
  deleteSeason,
  editSeason,
  addSeason,
} from "@/api/season";
import TypingCard from "@/components/TypingCard";
import EditSeasonForm from "./forms/edit-season-form";
import AddSeasonForm from "./forms/add-season-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class Season extends Component {
  state = {
    season: [],
    editSeasonModalVisible: false,
    editSeasonModalLoading: false,
    currentRowData: {},
    addSeasonModalVisible: false,
    addSeasonModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getSeason = async () => {
    const result = await getSeason();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        season: content,
      });
    }
  };
  handleEditSeason = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editSeasonModalVisible: true,
    });
  };

  handleDeleteSeason = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteSeason({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getSeason();
    });
  };

  handleEditSeasonOk = (_) => {
    const { form } = this.editSeasonFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editSeason(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editSeasonModalVisible: false,
            editSeasonModalLoading: false,
          });
          message.success("berhasi;!");
          this.getSeason();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editSeasonModalVisible: false,
      addSeasonModalVisible: false,
    });
  };

  handleAddSeason = (row) => {
    this.setState({
      addSeasonModalVisible: true,
    });
  };

  handleAddSeasonOk = (_) => {
    const { form } = this.addSeasonFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addSeasonModalLoading: true });
      const payload = {
        ...values,
        student_id: Array.isArray(values.student_id)
          ? values.student_id.filter((id) => id !== null)
          : [],
        jadwalPelajaran_id: Array.isArray(values.jadwalPelajaran_id)
          ? values.jadwalPelajaran_id.filter((idJadwal) => idJadwal !== null)
          : [],
      };
      addSeason(payload)
        .then((response) => {
          form.resetFields();
          this.setState({
            addSeasonModalVisible: false,
            addSeasonModalLoading: false,
          });
          message.success("Berhasil!");
          this.getSeason();
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
    const { importedData, season } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Konsentrasi"]],
          konsentrasi: row[columnMapping["Nama Konsentrasi Keahlian"]],
          programKeahlian_id: row[columnMapping["ID Program"]],
        };
  
        // Check if data already exists
        const existingSeasonIndex = season.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingSeasonIndex > -1) {
            // Update existing data
            await editSeason(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedSeason = [...prevState.season];
              updatedSeason[existingSeasonIndex] = dataToSave;
              return { season: updatedSeason };
            });
          } else {
            // Add new data
            await addSeason(dataToSave);
            this.setState((prevState) => ({
              season: [...prevState.season, dataToSave],
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
    this.getSeason();
  }
  render() {
    const { season, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddSeason}>
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
        <TypingCard title="Manajemen Kelas Ajaran" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={season}
            pagination={{ pageSize: 10 }}
          >
            
            <Column title="Tahun Ajaran" dataIndex="tahunAjaran.tahunAjaran" key="tahunAjaran.tahunAjaran" align="center" />
            <Column title="Bidang Keahlian" dataIndex="bidangKeahlian.bidang" key="bidangKeahlian.bidang" align="center" />
            <Column title="Program Keahlian" dataIndex="programKeahlian.program" key="programKeahlian.program" align="center" />
            <Column title="Konsentrasi Keahlian" dataIndex="konsentrasiKeahlian.konsentrasi" key="konsentrasiKeahlian.konsentrasi" align="center" />
            <Column title="Kelas" dataIndex="kelas.namaKelas" key="kelas.namaKelas" align="center" />
            <Column title="Wali Kelas" dataIndex="lecture.name" key="lecture.name" align="center" />
            <Column title="Siswa" dataIndex="student" key="student" align="center" />
            <Column title="Mata Pelajaran" dataIndex="jadwalPelajaran" key="jadwalPelajaran" align="center" />
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
                    onClick={this.handleEditSeason.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteSeason.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditSeasonForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editSeasonFormRef = formRef)
          }
          visible={this.state.editSeasonModalVisible}
          confirmLoading={this.state.editSeasonModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditSeasonOk}
        />
        <AddSeasonForm
          wrappedComponentRef={(formRef) =>
            (this.addSeasonFormRef = formRef)
          }
          visible={this.state.addSeasonModalVisible}
          confirmLoading={this.state.addSeasonModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddSeasonOk}
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

export default Season;
