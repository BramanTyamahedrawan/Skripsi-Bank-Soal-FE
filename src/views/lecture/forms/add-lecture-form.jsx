import React, { Component } from "react";
import { Form, Input, Modal, DatePicker, Select } from "antd";
import { getBidangKeahlian } from "@/api/bidangKeahlian";
import { getProgramByBidang } from "@/api/programKeahlian";
import { getKonsentrasiByProgram } from "@/api/konsentrasiKeahlian";
const { TextArea } = Input;
const { Option } = Select;
class AddLectureForm extends Component {
  state = {
    bidangList: [],
    filteredProgramList: [],
    filteredKonsentrasiList: []
  };
  fetchBidangKeahlianList = async () => {
    try {
      const result = await getBidangKeahlian();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const bidangList = content.map((bidang) => ({
          id: bidang.id,
          bidang: bidang.bidang,
        }));
        this.setState({ bidangList });
      }
    } catch (error) {
      console.error("Error fetching bidang data: ", error);
    }
  };

  handleBidangChange = async (value) => {
    try {
      // Ambil program yang sesuai dengan bidang yang dipilih
      const result = await getProgramByBidang(value);
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        this.setState({
          filteredProgramList: content,
          filteredKonsentrasiList: [], // Reset konsentrasi list ketika bidang berubah
        });
      } else {
        this.setState({
          filteredProgramList: [],
          filteredKonsentrasiList: [],
        });
      }

      // Reset dropdown nilai program dan konsentrasi
      this.props.form.setFieldsValue({
        programkeahlian_id: undefined,
        konsentrasikeahlian_id: undefined,
      });
    } catch (error) {
      console.error("Error fetching program data: ", error);
    }
  };

  handleProgramChange = async (value) => {
    try {
      // Ambil konsentrasi yang sesuai dengan program yang dipilih
      const result = await getKonsentrasiByProgram(value); // Memanggil API dengan program ID
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        this.setState({
          filteredKonsentrasiList: content,
        });
      } else {
        this.setState({
          filteredKonsentrasiList: [],
        });
      }

      // Reset dropdown nilai konsentrasi
      this.props.form.setFieldsValue({
        konsentrasikeahlian_id: undefined,
      });
    } catch (error) {
      console.error("Error fetching konsentrasi data: ", error);
    }
  };

  componentDidMount (){
    this.fetchBidangKeahlianList();
  }
  render() {
    const {
      bidangList,
      filteredProgramList,
      filteredKonsentrasiList,} = this.state
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      religion,
      user,
      studyProgram,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="Tambah Guru"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="NIP:">
            {getFieldDecorator("nip", {
              rules: [{ required: true, message: "NIDN wajib diisi" }],
            })(<Input placeholder="NIP" />)}
          </Form.Item>
          <Form.Item label="Nama:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Nama depan wajib diisi" }],
            })(<Input placeholder="Nama" />)}
          </Form.Item>
          <Form.Item label="Tempat Lahir:">
            {getFieldDecorator("place_born", {
              rules: [{ required: true, message: "Tempat Lahir wajib diisi" }],
            })(<Input placeholder="Tempat Lahir" />)}
          </Form.Item>
          <Form.Item label="Tanggal Lahir:">
            {getFieldDecorator("date_born", {
              rules: [{ required: true, message: "Tanggal Lahir wajib diisi" }],
            })(<DatePicker placeholder="Tanggal Lahir" />)}
          </Form.Item>
          <Form.Item label="Gender:">
            {getFieldDecorator("gender", {
              rules: [{ required: true, message: "Gender wajib diisi" }],
            })(
              <Select style={{ width: 120 }} placeholder="Gender">
                <Select.Option value="L">Laki-laki</Select.Option>
                <Select.Option value="P">Perempuan</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Nomor Telepon:">
            {getFieldDecorator("phone", {
              rules: [{ required: true, message: "Nomor telefon wajib diisi" }],
            })(<Input type={"number"} placeholder="Nomor Telefon (62)" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("status", {
              initialValue: "dosen",
              rules: [{ required: true, message: "status" }],
            })(<Input type={"number"} placeholder="Status" hidden />)}
          </Form.Item>
          <Form.Item label="Alamat:">
            {getFieldDecorator("address", {
              rules: [{ required: true, message: "Alamat wajib diisi" }],
            })(<TextArea placeholder="Alamat" />)}
          </Form.Item>
          <Form.Item label="Agama:">
            {getFieldDecorator("religion_id", {
              rules: [
                {
                  required: true,
                  message: "Silahkan pilih agama",
                },
              ],
            })(
              <Select style={{ width: 300 }} placeholder="Pilih Agama">
                {religion.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={"religion-" + key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Bidang Keahlian:" htmlFor="bidangkeahlian_id">
            {getFieldDecorator("bidangKeahlian_id", {
                rules: [
                    { required: true, message: "Silahkan isi konsentrasi keahlian" },
                ],
                })(
              <Select
                placeholder="Pilih Bidang Keahlian"
                onChange={this.handleBidangChange}
              >
                {this.state.bidangList.map((bidang) => (
                  <Option key={bidang.id} value={bidang.id}>
                    {bidang.bidang}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Program Keahlian:" htmlFor="programkeahlian_id">
            {getFieldDecorator("programKeahlian_id", {
                rules: [
                    { required: true, message: "Silahkan isi konsentrasi keahlian" },
                ],
                })(
              <Select
                placeholder="Pilih Program Keahlian"
                onChange={this.handleProgramChange}
              >
                {filteredProgramList.map((program) => (
                  <Option key={program.id} value={program.id}>
                    {program.program}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Konsentrasi Keahlian:" htmlFor="konsentrasikeahlian_id">
            {getFieldDecorator("konsentrasiKeahlian_id", {
              rules: [
                { required: true, message: "Silahkan isi konsentrasi keahlian" },
              ],
            })(
              <Select
                placeholder="Pilih Konsentrasi Keahlian"
              >
                {filteredKonsentrasiList.map((konsentrasi) => (
                  <Option key={konsentrasi.id} value={konsentrasi.id}>
                    {konsentrasi.konsentrasi}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddLectureForm" })(AddLectureForm);
