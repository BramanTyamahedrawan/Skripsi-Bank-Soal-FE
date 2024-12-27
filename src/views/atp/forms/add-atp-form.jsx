import React, { Component, useRef } from "react";
import { Form, Input, Modal, Select, Table, Tabs  } from "antd";
import ReactSelect from "react-select";
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import {getTahunAjaran} from '@/api/tahun-ajaran'
import {getKelas} from '@/api/kelas'
import {getStudents} from '@/api/student'
import {getJadwalPelajaran} from '@/api/jadwalPelajaran'
import {getLectures} from '@/api/lecture'
import {getMapel} from '@/api/mapel'
import { getBidangKeahlian } from "@/api/bidangKeahlian";
import { getProgramByBidang } from "@/api/programKeahlian";
import { getKonsentrasiByProgram } from "@/api/konsentrasiKeahlian";
const { TextArea } = Input;
const { Option } = Select;
const { Column } = Table;
const { TabPane } = Tabs;
registerAllModules();

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: 'Elemen',
    dataIndex: 'elemen',
    key: 'elemen',
  },
  {
    title: 'Capaian Pembelajaran',
    dataIndex: 'capaian',
    key: 'age',
    width: '50%',
  },
];
const data = [
  {
    key: 1,
    no: '1',
    elemen: 'Berpikir Komputasional (BK)',
    capaian: 'Pada akhir fase E, peserta didik mampu' + 
              ' menerapkan strategi algoritmik standar untuk' + 
              ' menghasilkan beberapa solusi persoalan dengan' +
              ' data diskrit bervolume tidak kecil pada'+
              ' kehidupan sehari-hari maupun'+
              ' implementasinya dalam program komputer.',
    children: [
      {
        key: 11,
        elemen: 'Tujuan Pembelajaran',
      },
      {
        key: 12,
        elemen: 'Peserta didik memahami algoritma pengambilan keputusan untuk pemecahan sebuah masalah.',
      },
      {
        key: 13,
        elemen: 'Peserta didik mampu menerapkan strategi algoritmik untuk menemukan cara yang paling efisien dalam pemecahan sebuah masalah.',
      },
      {
        key: 14,
        elemen: 'Siswa memahami beberapa algoritma proses sorting.',
      },
      {
        key: 15,
        elemen: 'Siswa mampu menerapkan strategi algoritmik untuk menemukan cara yang paling efisien dalam proses sorting',
      },
      {
        key: 16,
        elemen: 'Siswa memahami konsep struktur data stack dan queue serta operasi-operasi yang dapat dikenakan pada struktur data tersebut.',
      },
    ],
  },
  {
    key: 2,
    no: '2',
    elemen: 'Teknologi Informasi dan Komunikasi (TIK)',
    capaian: 'Pada akhir fase E, peserta didik mampu memanfaatkan berbagai aplikasi secara bersamaan dan' +
' optimal untuk berkomunikasi, mencari sumber data yang akan diolah menjadi informasi, baik di dunia nyata maupun' +
' di internet, serta mahir menggunakan fitur lanjut aplikasi perkantoran (pengolah kata, angka, dan presentasi) beserta otomasinya untuk mengintegrasikan dan menyajikan konten' +
' aplikasi dalam berbagai representasi yang memudahkan analisis dan interpretasi konten tersebut',
    children: [
      {
        key: 21,
        elemen: 'Tujuan Pembelajaran',
      },
      {
        key: 22,
        elemen: 'Peserta didik mampu memahami serta menjelaskan tentang Teknologi Informasi dan Komunikasi serta pemanfaatannya',
      },
      {
        key: 23,
        elemen: 'Peserta didik mampu memahami Aplikasi Video Conference (Google Meet)',
      },
      {
        key: 24,
        elemen: 'Peserta didik mampu memahami konsep aplikasi peyimpanan Awan/Cloud (Google Drive)',
      },
      {
        key: 25,
        elemen: 'Peserta didik mampu menggunakan Aplikasi Video Conference (Google Meet)',
      },
      {
        key: 26,
        elemen: 'SPeserta didik mampu menggunakan Aplikasi Penyimpanan Awan (Google Drive)',
      },
    ],
  },
];

class AddSeasonForm extends Component {
  
  state = {
    mapelList: [],
    tahunList: [],
    bidangList: [],
    filteredProgramList: [],
    filteredKonsentrasiList: [],
    kelasList: [],
    siswaList: [],
    jadwalPelajaranList: [],
    guruList: [],
    selectedStudents: [],
    selectedJadwalPelajarans: [],
    mdlData: [{kode: '', modul:''}],
    modulData: [
      { kode: 'DSI1', modul: 'Modul I-Berpikir Komputasional.pdf' },
      { kode: 'DSI2', modul: 'Modul II-Berpikir Komputasional.pdf' },
      { kode: 'DSI3', modul: 'Modul III-Berpikir Komputasional.pdf' },
      { kode: 'TKI1', modul: 'Modul I-Teknologi Informasi dan Komunikasi.pdf' },
      { kode: 'TKI2', modul: 'Modul II-Teknologi Informasi dan Komunikasi.pdf' },
      { kode: 'TKI3', modul: 'Modul III-Teknologi Informasi dan Komunikasi.pdf' },
      { kode: 'TKI4', modul: 'Modul IV-Teknologi Informasi dan Komunikasi.pdf' },
      { kode: 'TKI5', modul: 'Modul V-Teknologi Informasi dan Komunikasi.pdf' },
      { kode: 'TKI6', modul: 'Modul VI-Teknologi Informasi dan Komunikasi.pdf' },
    ],
    siswaData: [{ nisn: "", nama: "", alamat: "", jurusan: "" }],
    jadwalPelajaranData: [{ guru: "", jabatan: "", mapel: "", jmlJam: ""}],
    activeTab: "acp",
  };

  handleTableChange = (changes, source) => {
    if (source === "edit") {
      const newData = [...this.state.mdlData];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (prop === "kode" && newValue) {
          const modulEntry = this.state.modulData.find((item) => item.kode === newValue);
          if (modulEntry) {
            newData[row].modul = modulEntry.modul; // Update the `modul` column
          } else {
            newData[row].modul = ""; // Clear if no match found
          }
        }
      });
      if (newData.length === this.state.mdlData.length) {
        newData.push({
          kode: "", 
          modul: "", 
          // Tambahkan kolom lainnya sesuai dengan struktur data
        });
      }
      this.setState({ mdlData: newData });
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


  handleTabChange = (activeKey) => {
    this.setState({ activeTab: activeKey });
  };

  fetchTahunAjaranList = async () => {
    try {
    const result = await getTahunAjaran(); 
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
    const tahunList = content.map((tahun) => ({
        idTahun: tahun.idTahun,
        tahunAjaran: tahun.tahunAjaran
    }));
    this.setState({ tahunList });
    }
    } catch (error) {
    // Handle error if any
    console.error("Error fetching tahun data: ", error);
    }
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

  fetchKelasList = async () => {
    try {
    const result = await getKelas(); 
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
    const kelasList = content.map((kelas) => ({
        idKelas: kelas.idKelas,
        namaKelas: kelas.namaKelas
    }));
    this.setState({ kelasList });
    }
    } catch (error) {
    // Handle error if any
    console.error("Error fetching kelas data: ", error);
    }
  };

  fetchSiswaList = async () => {
    try {
      const result = await getStudents();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const siswaList = content.map((student) => ({
          id: student.id,
          name: student.name,
          nisn: student.nisn,
          address: student.address,
          konsentrasi: student.konsentrasiKeahlian.konsentrasi
        }));
        this.setState({ siswaList });
      }
    } catch (error) {
      console.error("Error fetching siswa data: ", error);
    }
  };

  fetchJadwalPelajaranList = async () => {
    try {
    const result = await getJadwalPelajaran(); 
    const { content, statusCode } = result.data;
    if (statusCode === 200) {
    const jadwalPelajaranList = content.map((jadwalPelajaran) => ({
        idJadwal: jadwalPelajaran.idJadwal,
        guru: jadwalPelajaran.lecture.name,
        jabatan: jadwalPelajaran.jabatan,
        mapel: jadwalPelajaran.mapel.name,
        jmlJam: jadwalPelajaran.jmlJam
    }));
    this.setState({ jadwalPelajaranList });
    }
    } catch (error) {
    // Handle error if any
    console.error("Error fetching jadwalPelajaran data: ", error);
    }
  };

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
    console.error("Error fetching kelas data: ", error);
    }
  };

  componentDidMount (){
    this.fetchTahunAjaranList();
    this.fetchBidangKeahlianList();
    this.fetchKelasList();
    this.fetchSiswaList();
    this.fetchJadwalPelajaranList();
    this.fetchGuruList();
    this.fetchMapelList();
  }

  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { 
        tahunList, 
        bidangList,
        filteredProgramList,
        filteredKonsentrasiList,
        kelasList,
        siswaList,
        jadwalPelajaranList,
        mapelList,
        guruList, activeTab,  modulData, mdlData} = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const mapToSelectOptions = (list) => list.map(item => ({
      value: item.id || item.idKelas || item.idJadwalPelajaran || item.id, // Use unique ids from the objects
      label: item.name || item.namaKelas || item.bidang || item.program || item.konsentrasi
    }));
    return (
      <Modal
        title="Tambah Kelas Ajaran"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={900}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Kode:">
              {getFieldDecorator("id", {
              })(<Input disabled placeholder="ACP001" />)}
          </Form.Item>
          <Form.Item label="Tahun Ajaran:">
            {getFieldDecorator("tahunAjaran_id", {
              rules: [
                { required: true, message: "Silahkan isi tahun ajaran" },
              ],
            })(
              <Select placeholder="Pilih Tahun Ajaran">
                {tahunList.map((tahun) => (
                  <Option key={tahun.idTahun} value={tahun.idTahun}>
                    {tahun.tahunAjaran}
                  </Option>
                ))}
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
          <Form.Item label="Kelas:">
            {getFieldDecorator("kelas_id", {
              rules: [
                { required: true, message: "Silahkan isi kelas" },
              ],
            })(
              <Select placeholder="Pilih Kelas">
                {kelasList.map((kelas) => (
                  <Option key={kelas.idKelas} value={kelas.idKelas}>
                    {kelas.namaKelas}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Fase:">
              {getFieldDecorator("fase", {
              })(<Input  placeholder="Masukkan fase" />)}
          </Form.Item>
          <Form.Item label="Semester:">
            {getFieldDecorator("semester", {
              rules: [{ required: true, message: "Semester wajib diisi" }],
            })(
              <Select style={{ width: 120 }} placeholder="Semester">
                <Select.Option value="Ganjil">Ganjil</Select.Option>
                <Select.Option value="Genap">Genap</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Alokasi Waktu:">
              {getFieldDecorator("waktu", {
              })(<Input  placeholder="Masukkan alokasi waktu" />)}
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
          <Tabs defaultActiveKey="acp" onChange={this.handleTabChange}>
            <TabPane tab="Capaian Pembelajaran" key="acp">
              <Table
                columns={columns}
                dataSource={data}
              />
            </TabPane>
            <TabPane tab="Modul" key="modul">
            <HotTable
              data={mdlData}
              colHeaders={["Kode", "Modul"]}
              rowHeaders={true}
              columns={[
                {
                  data: "kode",
                  type: "dropdown",
                  source: this.state.modulData.map((item) => item.kode),
                },
                { data: "modul", readOnly: true },
              ]}
              afterChange={this.handleTableChange}
              width="600"
              height="300"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
            />
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddSeasonForm" })(AddSeasonForm);
