import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getMapel,
  deleteMapel,
  editMapel,
  addMapel,
} from "@/api/mapel";
import TypingCard from "@/components/TypingCard";
import EditMapelForm from "./forms/edit-mapel-form";
import AddMapelForm from "./forms/add-mapel-form";
import { read, utils } from "xlsx";

const { Column } = Table;
class Mapel extends Component {
  state = {
    mapels: [],
    editMapelModalVisible: false,
    editMapelModalLoading: false,
    currentRowData: {},
    addMapelModalVisible: false,
    addMapelModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };

  getMapel = async () => {
    const result = await getMapel();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        mapels: content,
      });
    }
  };

  handleEditMapel = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editMapelModalVisible: true,
    });
  };

  handleDeleteMapel = (row) => {
    const { id } = row;
  
    // Dialog alert hapus data
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteMapel({ id }).then((res) => {
          message.success("Berhasil dihapus");
          this.getMapel();
        });
      },
    });
  };

  handleEditMapelOk = (_) => {
    const { form } = this.editMapelFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editMapel(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editMapelModalVisible: false,
            editMapelModalLoading: false,
          });
          message.success("berhasi;!");
          this.getMapel();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editMapelModalVisible: false,
      addMapelModalVisible: false,
    });
  };

  handleAddMapel = (row) => {
    this.setState({
      addMapelModalVisible: true,
    });
  };

  handleAddMapelOk = (_) => {
    const { form } = this.addMapelFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addMapelModalLoading: true });
      addMapel(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addMapelModalVisible: false,
            addMapelModalLoading: false,
          });
          message.success("Berhasil!");
          this.getMapel();
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
    const { importedData, mapels } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Bidang"]],
          bidang: row[columnMapping["Nama Bidang Keahlian"]],
          school_id: row[columnMapping["ID Sekolah"]],
        };
  
        // Check if data already exists
        const existingMapelIndex = mapels.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingMapelIndex > -1) {
            // Update existing data
            await editMapel(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedMapel = [...prevState.mapels];
              updatedMapel[existingMapelIndex] = dataToSave;
              return { mapels: updatedMapel };
            });
          } else {
            // Add new data
            await addMapel(dataToSave);
            this.setState((prevState) => ({
              mapels: [...prevState.mapels, dataToSave],
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
    this.getMapel();
  }

  render() {
    const { importModalVisible, mapels } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddMapel}>
            Tambahkan Mapel
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola bidang keahlian di sistem, seperti menambahkan bidang keahlian baru, atau mengubah bidang keahlian yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Mapel" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={mapels}
            pagination={{ pageSize: 10 }}
          >
            <Column title="ID Mapel" dataIndex="idMapel" key="idMapel" align="center" />
            <Column title="Nama Mapel" dataIndex="name" key="name" align="center" />
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
                    onClick={this.handleEditMapel.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteMapel.bind(row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditMapelForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editMapelFormRef = formRef)
          }
          visible={this.state.editMapelModalVisible}
          confirmLoading={this.state.editMapelModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditMapelOk}
        />
        <AddMapelForm
          wrappedComponentRef={(formRef) =>
            (this.addMapelFormRef = formRef)
          }
          visible={this.state.addMapelModalVisible}
          confirmLoading={this.state.addMapelModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddMapelOk}
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

export default Mapel;
