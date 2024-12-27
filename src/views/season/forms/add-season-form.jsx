import React, { Component } from "react";
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
import { getBidangKeahlian } from "@/api/bidangKeahlian";
import { getProgramByBidang } from "@/api/programKeahlian";
import { getKonsentrasiByProgram } from "@/api/konsentrasiKeahlian";
const { TextArea } = Input;
const { Option } = Select;
const { Column } = Table;
const { TabPane } = Tabs;
registerAllModules();
class AddSeasonForm extends Component {
  state = {
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
    siswaData: [{ nisn: "", nama: "", alamat: "", jurusan: "" }],
    jadwalPelajaranData: [{ guru: "", jabatan: "", mapel: "", jmlJam: ""}],
    activeTab: "siswa",
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
        guruList, activeTab,  siswaData, jadwalPelajaranData } = this.state;
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
          <Form.Item label="Wali Kelas:">
            {getFieldDecorator("lecture_id", {
              rules: [
                { required: true, message: "Silahkan isi kelas" },
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
          <Tabs defaultActiveKey="siswa" onChange={this.handleTabChange}>
      <TabPane tab="Siswa" key="siswa">
          {getFieldDecorator("student_id", {
            initialValue: siswaData
            .slice(0, -1)
            .filter((siswa) => siswa.id !== null)
            .map((siswa) => siswa.id) 
          })(
            <HotTable
              data={siswaData}
              colHeaders={["NISN", "Nama", "Alamat", "Jurusan"]}
              columns={[
                {
                  data: "nisn",
                  type: "dropdown",
                  source: siswaList.map((siswa) => siswa.nisn),
                  allowInvalid: false,
                },
                { data: "nama", readOnly: true },
                { data: "alamat", readOnly: true },
                { data: "konsentrasi", readOnly: true },
              ]}
              afterChange={(changes) => {
                if (!changes) return;

                changes.forEach(([row, prop, oldValue, newValue]) => {
                  if (prop === "nisn" && oldValue !== newValue) {
                    const selectedSiswa = siswaList.find(
                      (siswa) => siswa.nisn === newValue
                    );
                    if (selectedSiswa) {
                      this.setState((prevState) => {
                        const updatedTableData = [...prevState.siswaData];
                        updatedTableData[row] = {
                          ...updatedTableData[row],
                          id: selectedSiswa.id,
                          nisn: selectedSiswa.nisn,
                          nama: selectedSiswa.name,
                          alamat: selectedSiswa.address,
                          konsentrasi: selectedSiswa.konsentrasi,
                        };
                        if (row === updatedTableData.length - 1) {
                          updatedTableData.push({
                            nisn: "",
                            nama: "",
                            alamat: "",
                            konsentrasi: "",
                          });
                        }
                        // Update form field value for siswaData
                        this.props.form.setFieldsValue({
                          siswaData: updatedTableData,
                        });
                        return { siswaData: updatedTableData };
                      });
                    }
                  }
                });
              }}
              stretchH="all"
              rowHeaders={true}
              manualColumnResize={true}
              height="300"
              licenseKey="non-commercial-and-evaluation"
            />
          )}
        </TabPane>

        <TabPane tab="Jadwal Pelajaran" key="jadwalPelajaran">
          {getFieldDecorator("jadwalPelajaran_id", {
            initialValue: jadwalPelajaranData
            .slice(0, -1)
            .filter((jadwal) => jadwal.idJadwal !== null) // Hanya ambil yang tidak null
            .map((jadwal) => jadwal.idJadwal) // Menyertakan data jadwal pelajaran dalam form
          })(
            <HotTable
              data={jadwalPelajaranData}
              colHeaders={["Guru Pengajar", "Jabatan", "Mata Pelajaran", "Jumlah Jam"]}
              columns={[
                {
                  data: "guru",
                  type: "dropdown",
                  source: jadwalPelajaranList.map((jadwal) => jadwal.guru),
                  allowInvalid: false,
                },
                { data: "jabatan", readOnly: true },
                { data: "mapel", readOnly: true },
                { data: "jmlJam", readOnly: true },
              ]}
              afterChange={(changes) => {
                if (!changes) return;

                changes.forEach(([row, prop, oldValue, newValue]) => {
                  if (prop === "guru" && oldValue !== newValue) {
                    const selectedJadwal = jadwalPelajaranList.find(
                      (jadwal) => jadwal.guru === newValue
                    );
                    if (selectedJadwal) {
                      this.setState((prevState) => {
                        const updatedTableData = [...prevState.jadwalPelajaranData];
                        updatedTableData[row] = {
                          ...updatedTableData[row],
                          idJadwal: selectedJadwal.idJadwal,
                          guru: selectedJadwal.guru,
                          jabatan: selectedJadwal.jabatan,
                          mapel: selectedJadwal.mapel,
                          jmlJam: selectedJadwal.jmlJam,
                        };
                        if (row === updatedTableData.length - 1) {
                          updatedTableData.push({
                            guru: "",
                            jabatan: "",
                            mapel: "",
                            jmlJam: "",
                          });
                        }
                        // Update form field value for jadwalPelajaranData
                        this.props.form.setFieldsValue({
                          jadwalPelajaranData: updatedTableData,
                        });
                        return { jadwalPelajaranData: updatedTableData };
                      });
                    }
                  }
                });
              }}
              stretchH="all"
              rowHeaders={true}
              manualColumnResize={true}
              height="300"
              licenseKey="non-commercial-and-evaluation"
            />
          )}
        </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddSeasonForm" })(AddSeasonForm);
