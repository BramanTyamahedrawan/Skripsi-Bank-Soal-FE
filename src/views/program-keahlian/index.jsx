import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getProgramKeahlian,
  deleteProgramKeahlian,
  editProgramKeahlian,
  addProgramKeahlian,
} from "@/api/programKeahlian";
import TypingCard from "@/components/TypingCard";
import EditProgramKeahlianForm from "./forms/edit-program-keahlian-form";
import AddProgramKeahlianForm from "./forms/add-program-keahlian-form";
import { read, utils } from "xlsx";
const { Column } = Table;
class ProgramKeahlian extends Component {
  state = {
    programKeahlians: [],
    editProgramKeahlianModalVisible: false,
    editProgramKeahlianModalLoading: false,
    currentRowData: {},
    addProgramKeahlianModalVisible: false,
    addProgramKeahlianModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getProgramKeahlian = async () => {
    const result = await getProgramKeahlian();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        programKeahlians: content,
      });
    }
  };
  handleEditProgramKeahlian = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editProgramKeahlianModalVisible: true,
    });
  };

  handleDeleteProgramKeahlian = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能menghapusoleh  Admin！");
      return;
    }
    console.log(id);
    deleteProgramKeahlian({ id }).then((res) => {
      message.success("berhasil dihapus");
      this.getProgramKeahlian();
    });
  };

  handleEditProgramKeahlianOk = (_) => {
    const { form } = this.editProgramKeahlianFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editProgramKeahlian(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editProgramKeahlianModalVisible: false,
            editProgramKeahlianModalLoading: false,
          });
          message.success("berhasi;!");
          this.getProgramKeahlian();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editProgramKeahlianModalVisible: false,
      addProgramKeahlianModalVisible: false,
    });
  };

  handleAddProgramKeahlian = (row) => {
    this.setState({
      addProgramKeahlianModalVisible: true,
    });
  };

  handleAddProgramKeahlianOk = (_) => {
    const { form } = this.addProgramKeahlianFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addProgramKeahlianModalLoading: true });
      addProgramKeahlian(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addProgramKeahlianModalVisible: false,
            addProgramKeahlianModalLoading: false,
          });
          message.success("Berhasil!");
          this.getProgramKeahlian();
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
    const { importedData, programKeahlians } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Program"]],
          program: row[columnMapping["Nama Program Keahlian"]],
          bidangKeahlian_id: row[columnMapping["ID Bidang"]],
        };
  
        // Check if data already exists
        const existingProgramKeahlianIndex = programKeahlians.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingProgramKeahlianIndex > -1) {
            // Update existing data
            await editProgramKeahlian(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedProgramKeahlian = [...prevState.programKeahlians];
              updatedProgramKeahlian[existingProgramKeahlianIndex] = dataToSave;
              return { programKeahlians: updatedProgramKeahlian };
            });
          } else {
            // Add new data
            await addProgramKeahlian(dataToSave);
            this.setState((prevState) => ({
              programKeahlians: [...prevState.programKeahlians, dataToSave],
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
    this.getProgramKeahlian();
  }
  render() {
    const { programKeahlians, importModalVisible } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddProgramKeahlian}>
            Tambahkan Program Keahlian
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button  onClick={this.handleImportModalOpen}>
            Import File
          </Button>
        </Col>
      </Row>
    );
    const cardContent = `Di sini, Anda dapat mengelola program keahlian di sistem, seperti menambahkan program keahlian baru, atau mengubah program keahlian yang sudah ada di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Program Keahlian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={programKeahlians}
            pagination={{ pageSize: 10 }}
          >
            <Column title="Bidang Keahlian" dataIndex="bidangKeahlian.bidang" key="bidangKeahlian.bidang" align="center" />
            <Column title="ID Program Keahlian" dataIndex="id" key="id" align="center" />
            <Column title="Program Keahlian" dataIndex="program" key="program" align="center" />
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
                    onClick={this.handleEditProgramKeahlian.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteProgramKeahlian.bind(null, row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditProgramKeahlianForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editProgramKeahlianFormRef = formRef)
          }
          visible={this.state.editProgramKeahlianModalVisible}
          confirmLoading={this.state.editProgramKeahlianModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditProgramKeahlianOk}
        />
        <AddProgramKeahlianForm
          wrappedComponentRef={(formRef) =>
            (this.addProgramKeahlianFormRef = formRef)
          }
          visible={this.state.addProgramKeahlianModalVisible}
          confirmLoading={this.state.addProgramKeahlianModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddProgramKeahlianOk}
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

export default ProgramKeahlian;
