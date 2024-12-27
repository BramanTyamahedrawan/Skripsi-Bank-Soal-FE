import React, { Component } from "react";
import { Card, Button, Table, message, Upload, Row, Col, Divider, Modal, Input } from "antd";
import {
  getBidangKeahlian,
  deleteBidangKeahlian,
  editBidangKeahlian,
  addBidangKeahlian,
} from "@/api/bidangKeahlian";
import TypingCard from "@/components/TypingCard";
import EditBidangKeahlianForm from "./forms/edit-bidang-keahlian-form";
import AddBidangKeahlianForm from "./forms/add-bidang-keahlian-form";
import { read, utils } from "xlsx";

const { Column } = Table;
class BidangKeahlian extends Component {
  state = {
    bidangKeahlians: [],
    editBidangKeahlianModalVisible: false,
    editBidangKeahlianModalLoading: false,
    currentRowData: {},
    addBidangKeahlianModalVisible: false,
    addBidangKeahlianModalLoading: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    importModalVisible: false,
    columnMapping: {},
    searchKeyword: "",
  };
  getBidangKeahlian = async () => {
    const result = await getBidangKeahlian();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        bidangKeahlians: content,
      });
    }
  };
  handleEditBidangKeahlian = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editBidangKeahlianModalVisible: true,
    });
  };

  handleDeleteBidangKeahlian = (row) => {
    const { id } = row;
  
    // Dialog alert hapus data
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteBidangKeahlian({ id }).then((res) => {
          message.success("Berhasil dihapus");
          this.getBidangKeahlian();
        });
      },
    });
  };

  handleEditBidangKeahlianOk = (_) => {
    const { form } = this.editBidangKeahlianFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editBidangKeahlian(values, values.id)
        .then((response) => {
          form.resetFields();
          this.setState({
            editBidangKeahlianModalVisible: false,
            editBidangKeahlianModalLoading: false,
          });
          message.success("berhasi;!");
          this.getBidangKeahlian();
        })
        .catch((e) => {
          message.success("gagal");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editBidangKeahlianModalVisible: false,
      addBidangKeahlianModalVisible: false,
    });
  };

  handleAddBidangKeahlian = (row) => {
    this.setState({
      addBidangKeahlianModalVisible: true,
    });
  };

  handleAddBidangKeahlianOk = (_) => {
    const { form } = this.addBidangKeahlianFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addBidangKeahlianModalLoading: true });
      addBidangKeahlian(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addBidangKeahlianModalVisible: false,
            addBidangKeahlianModalLoading: false,
          });
          message.success("Berhasil!");
          this.getBidangKeahlian();
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
    const { importedData, bidangKeahlians } = this.state;
    let errorCount = 0;
    
    try {
      for (const row of importedData) {
        const dataToSave = {
          id: row[columnMapping["ID Bidang"]],
          bidang: row[columnMapping["Nama Bidang Keahlian"]],
          school_id: row[columnMapping["ID Sekolah"]],
        };
  
        // Check if data already exists
        const existingBidangKeahlianIndex = bidangKeahlians.findIndex(p => p.id === dataToSave.id);
  
        try {
          if (existingBidangKeahlianIndex > -1) {
            // Update existing data
            await editBidangKeahlian(dataToSave, dataToSave.id);
            this.setState((prevState) => {
              const updatedBidangKeahlian = [...prevState.bidangKeahlians];
              updatedBidangKeahlian[existingBidangKeahlianIndex] = dataToSave;
              return { bidangKeahlians: updatedBidangKeahlian };
            });
          } else {
            // Add new data
            await addBidangKeahlian(dataToSave);
            this.setState((prevState) => ({
              bidangKeahlians: [...prevState.bidangKeahlians, dataToSave],
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
    this.getBidangKeahlian();
  }

  render() {
    const { importModalVisible, bidangKeahlians } = this.state;
    const title = (
      <Row gutter={[16, 16]} justify="start" style={{paddingLeft: 9}}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Button type="primary" onClick={this.handleAddBidangKeahlian}>
            Tambahkan Bidang Keahlian
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
        <TypingCard title="Manajemen Bidang Keahlian" source={cardContent} />
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey="id"
            dataSource={bidangKeahlians}
            pagination={{ pageSize: 10 }}
          >
            <Column title="Sekolah" dataIndex="school.name" key="school.name" align="center" />
            <Column title="ID Bidang Keahlian" dataIndex="id" key="id" align="center" />
            <Column title="Nama Bidang Keahlian" dataIndex="bidang" key="bidang" align="center" />
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
                    onClick={this.handleEditBidangKeahlian.bind(null, row)}
                  />
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    shape="circle"
                    icon="delete"
                    title="menghapus"
                    onClick={this.handleDeleteBidangKeahlian.bind(row)}
                  />
                </span>
              )}
            /> */}
          </Table>
        </Card>
        <EditBidangKeahlianForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editBidangKeahlianFormRef = formRef)
          }
          visible={this.state.editBidangKeahlianModalVisible}
          confirmLoading={this.state.editBidangKeahlianModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditBidangKeahlianOk}
        />
        <AddBidangKeahlianForm
          wrappedComponentRef={(formRef) =>
            (this.addBidangKeahlianFormRef = formRef)
          }
          visible={this.state.addBidangKeahlianModalVisible}
          confirmLoading={this.state.addBidangKeahlianModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddBidangKeahlianOk}
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

export default BidangKeahlian;
