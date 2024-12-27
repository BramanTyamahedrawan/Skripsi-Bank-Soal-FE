import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
import { reqUserInfo } from "../../../api/user";

class AddUserForm extends Component {
  state = {
    userSummary: null,
    loading: true,
  };

  componentDidMount() {
    // Panggil API reqUserInfo untuk mendapatkan informasi user yang sedang login
    reqUserInfo()
      .then((response) => {
        this.setState({
          userSummary: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        this.setState({ loading: false });
      });
  }
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { userSummary } = this.state;
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

    const isAdministrator = userSummary && userSummary.roles === "ROLE_ADMINISTRATOR";
    const roleOptions = isAdministrator
      ? [
          { value: "1", label: "Administrator" },
          { value: "2", label: "Operator" },
        ]
      : [
          { value: "3", label: "Guru" },
          { value: "4", label: "Du/Di" },
          { value: "5", label: "Siswa" }
        ];
    const initialRoleValue = isAdministrator ? "1" : "3";
    return (
      <Modal
        title="Tambah Pengguna"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Nama:">
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "Silahkan isi nama pengguna!" },
              ],
            })(<Input placeholder="Nama Pengguna" />)}
          </Form.Item>
          <Form.Item label="Username:">
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Silahkan isi username pengguna!" },
              ],
            })(<Input placeholder="Username Pengguna" />)}
          </Form.Item>
          <Form.Item label="Email:">
            {getFieldDecorator("email", {
              rules: [
                {
                  required: true,
                  type: "email",
                  message: "Silahkan isi email pengguna!",
                },
              ],
            })(<Input placeholder="Email Pengguna" />)}
          </Form.Item>
          <Form.Item label="Kata sandi:">
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "Silahkan isi kata sandi pengguna!",
                },
              ],
            })(<Input type="password" placeholder="Kata sandi" />)}
          </Form.Item>
          <Form.Item label="Peran:">
              {getFieldDecorator("roles", {
                initialValue: initialRoleValue,
              })(
                <Select style={{ width: 120 }}>
                  {roleOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Sekolah:">
            {getFieldDecorator("schoolId", {
              initialValue: "RWK001",
            })(
              <Select style={{ width: 240 }}>
                <Select.Option value="RWK001">SMK Negeri Rowokangkung</Select.Option>
                <Select.Option value="TMP001">SMK Negeri Tempeh</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
