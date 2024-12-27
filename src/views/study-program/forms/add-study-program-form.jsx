import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
import { reqValidatUserID } from "@/api/user";
const { TextArea } = Input;
class AddStudyProgramForm extends Component {
  validatUserID = async (rule, value, callback) => {
    if (value) {
      if (!/^[a-zA-Z0-9]{1,6}$/.test(value)) {
        callback("ID Pengguna必须为1-6位数字或字母组合");
      }
      let res = await reqValidatUserID(value);
      const { status } = res.data;
      if (status) {
        callback("该ID Pengguna已存在");
      }
    } else {
      callback("请输入ID Pengguna");
    }
    callback();
  };
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, departments } =
      this.props;
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
        title="Tambah Program Studi"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Jurusan:">
            {getFieldDecorator("department_id", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi jurusan program studi",
                },
              ],
            })(
              <Select style={{ width: 300 }} placeholder="Pilih Jurusan">
                {departments.map((arr, key) => {
                  return (
                    <Select.Option value={arr.id} key={key}>
                      {arr.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Nama Prodi:">
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "Silahkan isi nama program studi" },
              ],
            })(<Input placeholder="Nama program studi" />)}
          </Form.Item>
          <Form.Item label="Deskripsi Prodi:">
            {getFieldDecorator(
              "description",
              {}
            )(
              <TextArea
                rows={4}
                placeholder="Silahkan isi deskripsi program studi"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddStudyProgramForm" })(
  AddStudyProgramForm
);
