import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import {getLectures} from '@/api/lecture'
import {getMapel} from '@/api/mapel'
const { Option } = Select;

class AddJadwalPelajaranForm extends Component {
  state = {
    guruList: [],
    mapelList: [],
  }

  fetchGuruList = async () => {
    try {
    const result = await getLectures(); 
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
    const guruList = content.map((guru) => ({
        id: guru.id,
        name: guru.name,
        nidn: guru.nidn
    }));
    this.setState({ guruList });
    }
    } catch (error) {
    // Handle error if any
    console.error("Error fetching guru data: ", error);
    }
  };

  fetchMapelList = async () => {
    try {
    const result = await getMapel(); 
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
    const mapelList = content.map((mapel) => ({
        idMapel: mapel.idMapel,
        name: mapel.name,
    }));
    this.setState({ mapelList });
    }
    } catch (error) {
    // Handle error if any
    console.error("Error fetching mapel data: ", error);
    }
  };

  componentDidMount(){
    this.fetchGuruList();
    this.fetchMapelList();
  }
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { guruList, mapelList} = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    };

    return (
      <Modal
        title="Tambah Jadwal Pelajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID Jadwal:">
            {getFieldDecorator("idJadwal", {
              rules: [
                { required: true, message: "Silahkan isikan id jadwal pelajaran" },
              ],
            })(<Input placeholder="ID Jadwal" />)}
          </Form.Item>
          <Form.Item label="Guru Pengajar:">
            {getFieldDecorator("lecture_id", {
              rules: [
                { required: true, message: "Silahkan isi guru" },
              ],
            })(
              <Select placeholder="Pilih Kelas">
                {guruList.map((guru) => (
                  <Option key={guru.id} value={guru.id}>
                    {guru.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Jabatan:">
            {getFieldDecorator("jabatan", {
              rules: [
                { required: true, message: "Silahkan isikan jabatan" },
              ],
            })(<Input placeholder="Jabatan" />)}
          </Form.Item>
          <Form.Item label="Mata Pelajaran:">
            {getFieldDecorator("mapel_id", {
              rules: [
                { required: true, message: "Silahkan isi mapel" },
              ],
            })(
              <Select placeholder="Pilih Mata Pelajaran">
                {mapelList.map((mapel) => (
                  <Option key={mapel.idMapel} value={mapel.idMapel}>
                    {mapel.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Jam Pelajaran:">
            {getFieldDecorator("jmlJam", {
              rules: [
                { required: true, message: "Silahkan isikan jam pelajaran" },
              ],
            })(<Input placeholder="Jumlah Jam Pelajaran" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddJadwalPelajaranForm" })(AddJadwalPelajaranForm);
