import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getTahunAjaran,
  deleteTahunAjaran,
  editTahunAjaran,
  addTahunAjaran,
} from "@/api/tahun-ajaran";
import TypingCard from "@/components/TypingCard";
import EditTahunAjaranForm from "./forms/edit-tahun-ajaran-form";
import AddTahunAjaranForm from "./forms/add-tahun-ajaran-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class TahunAjaran extends Component {
  state = {
    tahunAjaran: [],
    editTahunAjaranModalVisible: false,
    editTahunAjaranModalLoading: false,
    currentRowData: {},
    addTahunAjaranModalVisible: false,
    addTahunAjaranModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getTahunAjaran = async () => {
    const result = await getTahunAjaran();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        tahunAjaran: content,
      });
    }
  };
  handleEditTahunAjaran = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editTahunAjaranModalVisible: true,
    });
  };

  handleDeleteTahunAjaran = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteTahunAjaran({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getTahunAjaran();
    });
  };

  handleEditTahunAjaranOk = (_) => {
    const { form } = this.editTahunAjaranFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editTahunAjaran(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editTahunAjaranModalVisible: false,
            editTahunAjaranModalLoading: false,
          });
          message.success("berhasi;!");
          this.getTahunAjaran();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editTahunAjaranModalVisible: false,
      addTahunAjaranModalVisible: false,
    });
  };

  handleAddTahunAjaran = (row) => {
    this.setState({
      addTahunAjaranModalVisible: true,
    });
  };

  handleAddTahunAjaranOk = (_) => {
    const { form } = this.addTahunAjaranFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addTahunAjaranModalLoading: true });
      addTahunAjaran(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addTahunAjaranModalVisible: false,
            addTahunAjaranModalLoading: false,
          });
          message.success("Berhasil!");
          this.getTahunAjaran();
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
    const { importedData, tahunAjaran } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Konsentrasi"]],
          konsentrasi: row[columnMapping["Nama Konsentrasi Keahlian"]],
          programKeahlian_id: row[columnMapping["ID Program"]],
        };
  
        // Check if data already exists
        const existingTahunAjaranIndex = tahunAjaran.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingTahunAjaranIndex > -1) {
            // Update existing data
            await editTahunAjaran(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedTahunAjaran = [...prevState.tahunAjaran];
              updatedTahunAjaran[existingTahunAjaranIndex] = dataToSave;
              return { tahunAjaran: updatedTahunAjaran };
            });
          } else {
            // Add new data
            await addTahunAjaran(dataToSave);
            this.setState((prevState) => ({
              tahunAjaran: [...prevState.tahunAjaran, dataToSave],
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
    this.getTahunAjaran();
  }
  render() {
    const { tahunAjaran, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddTahunAjaran}>
            Tambahkan Tahun Ajaran
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola tahun ajaran di sistem, seperti menambahkan tahun ajaran baru, atau mengubah tahun ajaran yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Tahun Ajaran" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={tahunAjaran}
            pagination={{ pageSize: 10 }}
          >
            
            <Column title="ID Tahun Ajaran" dataIndex="idTahun" key="idTahun" align="center" />
            <Column title="Tahun Ajaran" dataIndex="tahunAjaran" key="tahunAjaran" align="center" />
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
                    onClick={this.handleEditTahunAjaran.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteTahunAjaran.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditTahunAjaranForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editTahunAjaranFormRef = formRef)
          }
          visible={this.state.editTahunAjaranModalVisible}
          confirmLoading={this.state.editTahunAjaranModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditTahunAjaranOk}
        />
        <AddTahunAjaranForm
          wrappedComponentRef={(formRef) =>
            (this.addTahunAjaranFormRef = formRef)
          }
          visible={this.state.addTahunAjaranModalVisible}
          confirmLoading={this.state.addTahunAjaranModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddTahunAjaranOk}
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

export default TahunAjaran;
