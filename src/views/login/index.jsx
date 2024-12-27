import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, message, Spin } from "antd";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import "./index.less";
import { login, getUserInfo } from "@/store/actions";

const Login = (props) => {
  const { form, token, login, getUserInfo } = props;
  const { getFieldDecorator } = form;

  const [loading, setLoading] = useState(false);

  const handleLogin = (username, password) => {
    setLoading(true);
    login(username, password)
      .then((data) => {
        message.success("Selamat Datang di Website Kampus");
        handleUserInfo(data.accessToken);
      })
      .catch((error) => {
        setLoading(false);
        message.error(
          "Gagal Login, mohon di cek kembali username dan password nya"
        );
      });
  };

  const handleUserInfo = (token) => {
    getUserInfo(token)
      .then((data) => {})
      .catch((error) => {
        message.error(error);
      });
  };

  const handleSubmit = (event) => {
    // 阻止事件的默认行为
    event.preventDefault();

    // 对所有表单字段进行检验
    form.validateFields((err, values) => {
      // 检验成功
      if (!err) {
        const { username, password } = values;
        handleLogin(username, password);
      } else {
        console.log("检验失败!");
      }
    });
  };

  if (token) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <DocumentTitle title={"Login Pengguna"}>
      <div className="login-container">
        <Form onSubmit={handleSubmit} className="content">
          <div className="title">
            <h2>Login Pengguna</h2>
          </div>
          <Spin spinning={loading} tip="Mohon tunggu...">
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Username wajib diisi!",
                  },
                ],
                initialValue: "", // 初始值
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Kata sandi wajib diisi!",
                  },
                ],
                initialValue: "", // 初始值
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Kata sandi"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Masuk
              </Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    </DocumentTitle>
  );
};

const WrapLogin = Form.create()(Login);

export default connect((state) => state.user, { login, getUserInfo })(
  WrapLogin
);
