import React, { Component } from "react";
import {
  Button,
  Card,
  Collapse,
  Form,
  Icon,
  Input,
  Radio,
  Select,
  Table,
  message,
} from "antd";
import { getAttemptExamByExamID } from "@/api/attemptExam";

import TypingCard from "@/components/TypingCard";
const { Column } = Table;
const { Panel } = Collapse;
class ResultExam extends Component {
  state = {
    exam: [],
    filename: "file-nilai",
    bookType: "xlsx",
    editResultExamModalVisible: false,
    editResultExamModalLoading: false,
    currentRowData: {},
    addResultExamModalVisible: false,
    addResultExamModalLoading: false,
    selectedRows: [],
    selectedRowKeys: [],
  };
  getResultExam = async (id) => {
    const result = await getAttemptExamByExamID(id);
    const { content, statusCode } = result.data;
    console.log(result);
    console.log(result.data);
    if (statusCode === 200) {
      this.setState({
        exam: content,
      });
    }
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
  };

  handleDownload = (type) => {
    if (type === "selected" && this.state.selectedRowKeys.length === 0) {
      message.error("Error");
      return;
    }
    this.setState({
      downloadLoading: true,
    });
    import("@/lib/Export2Excel").then((excel) => {
      const tHeader = [
        "Id",
        "Nama Mahasiswa",
        "Nilai Minimum",
        "Nilai",
        "Status",
      ];
      const filterVal = [
        "id",
        "student.name",
        "exam.min_grade",
        "grade",
        "state",
      ];
      const list = type === "all" ? this.state.exam : this.state.selectedRows;
      const data = this.formatJson(filterVal, list);
      excel.export_json_to_excel({
        header: tHeader,
        data,
        filename: this.state.filename,
        autoWidth: this.state.autoWidth,
        bookType: this.state.bookType,
      });
      this.setState({
        selectedRowKeys: [],
        downloadLoading: false,
      });
    });
  };

  formatJson(filterVal, jsonData) {
    return jsonData.map((obj) =>
      filterVal.map((property) => {
        const nestedProperties = property.split(".");
        let value = obj;
        for (const nestedProperty of nestedProperties) {
          if (value && typeof value === "object" && nestedProperty in value) {
            value = value[nestedProperty];
          } else {
            value = undefined;
            break;
          }
        }
        return value;
      })
    );
  }

  autoWidthChange = (e) => {
    this.setState({
      autoWidth: e.target.value,
    });
  };
  filenameChange = (e) => {
    this.setState({
      filename: e.target.value,
    });
  };
  bookTypeChange = (value) => {
    this.setState({
      bookType: value,
    });
  };

  componentDidMount() {
    this.getResultExam(this.props.match.params.id);
  }
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { exam } = this.state;
    const title = <span></span>;
    const cardContent = `Di sini, Anda dapat mengelola ResultExam sesuai dengan mata kuliah yang diampu. Di bawah ini dapat menampilkan list ResultExam yang ada.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Hasil Ujian" source={cardContent} />
        <br />
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Opsi ekspor" key="1">
            <Form layout="inline">
              <Form.Item label="Nama File:">
                <Input
                  style={{ width: "250px" }}
                  prefix={
                    <Icon type="file" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Silakan masukkan nama file (file-nilai default)"
                  onChange={this.filenameChange}
                />
              </Form.Item>
              <Form.Item label="Apakah lebar sel adaptif:">
                <Radio.Group
                  onChange={this.autoWidthChange}
                  value={this.state.autoWidth}
                >
                  <Radio value={true}>Ya</Radio>
                  <Radio value={false}>Tidak</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Jenis Berkas:">
                <Select
                  defaultValue="xlsx"
                  style={{ width: 120 }}
                  onChange={this.bookTypeChange}
                >
                  <Select.Option value="xlsx">xlsx</Select.Option>
                  <Select.Option value="csv">csv</Select.Option>
                  <Select.Option value="txt">txt</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon="file-excel"
                  onClick={this.handleDownload.bind(null, "all")}
                >
                  Ekspor Semua
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon="file-excel"
                  onClick={this.handleDownload.bind(null, "selected")}
                >
                  Ekspor item yang dipilih
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <br />
        <Card title={title}>
          <Table
            bordered
            rowKey={(record) => record.id}
            dataSource={exam}
            pagination={false}
            rowSelection={rowSelection}
            loading={this.state.downloadLoading}
          >
            <Column
              title="Nama Siswa"
              dataIndex="student.name"
              key="student.name"
              align="center"
            />
            <Column
              title="Nilai Minimal"
              dataIndex="exam.min_grade"
              key="exam.min_grade"
              align="center"
            />
            <Column
              title="Nilai"
              dataIndex="grade"
              key="grade"
              align="center"
            />
            <Column
              title="Status"
              dataIndex="state"
              key="state"
              align="center"
            />
          </Table>
        </Card>
      </div>
    );
  }
}

export default ResultExam;
