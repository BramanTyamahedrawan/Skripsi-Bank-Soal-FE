import React, { useState } from "react";
import { connect } from "react-redux";
import { Drawer, Switch, Row, Col, Divider, Alert, Icon, Button } from "antd";
import { toggleSettingPanel, changeSetting } from "@/store/actions";
import clip from "@/utils/clipboard";

const RightPanel = (props) => {
  const {
    settingPanelVisible,
    toggleSettingPanel,
    changeSetting,
    sidebarLogo: defaultSidebarLogo,
    fixedHeader: defaultFixedHeader,
    tagsView: defaultTagsView,
  } = props;

  const [sidebarLogo, setSidebarLogo] = useState(defaultSidebarLogo);
  const [fixedHeader, setFixedHeader] = useState(defaultFixedHeader);
  const [tagsView, setTagsView] = useState(defaultTagsView);

  const sidebarLogoChange = (checked) => {
    setSidebarLogo(checked);
    changeSetting({ key: "sidebarLogo", value: checked });
  };

  const fixedHeaderChange = (checked) => {
    setFixedHeader(checked);
    changeSetting({ key: "fixedHeader", value: checked });
  };

  const tagsViewChange = (checked) => {
    setTagsView(checked);
    changeSetting({ key: "tagsView", value: checked });
  };

  const handleCopy = (e) => {
    let config = `
    export default {
      showSettings: true,
      sidebarLogo: ${sidebarLogo},
      fixedHeader: ${fixedHeader},
      tagsView: ${tagsView},
    }
    `;
    clip(config, e);
  };

  return (
    <div className="rightSettings">
      <Drawer
        title="Pengaturan Sistem"
        placement="right"
        width={350}
        onClose={toggleSettingPanel}
        visible={settingPanelVisible}
      >
        <Row>
          <Col span={12}>
            <span>Logo Sidebar</span>
          </Col>
          <Col span={12}>
            <Switch
              checkedChildren="Iya"
              unCheckedChildren="Tidak"
              defaultChecked={sidebarLogo}
              onChange={sidebarLogoChange}
            />
          </Col>
        </Row>
        <Divider dashed />
        <Row>
          <Col span={12}>
            <span>Tampilkan Header</span>
          </Col>
          <Col span={12}>
            <Switch
              checkedChildren="Iya"
              unCheckedChildren="Tidak"
              defaultChecked={fixedHeader}
              onChange={fixedHeaderChange}
            />
          </Col>
        </Row>
        <Divider dashed />
        <Row>
          <Col span={12}>
            <span>Aktifkan Tags-View</span>
          </Col>
          <Col span={12}>
            <Switch
              checkedChildren="Iya"
              unCheckedChildren="Tidak"
              defaultChecked={tagsView}
              onChange={tagsViewChange}
            />
          </Col>
        </Row>
        <Divider dashed />
        {/* <Row>
          <Col span={24}>
            <Alert
              message="Catatan untuk pengembang:"
              description="配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改/src/defaultSettings.js配置文件"
              type="warning"
              showIcon
              icon={<Icon type="notification" />}
              style={{ marginBottom: "16px" }}
            />
            <Button style={{ width: "100%" }} icon="copy" onClick={handleCopy}>
              拷贝配置
            </Button>
          </Col>
        </Row> */}
      </Drawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.settings,
  };
};

export default connect(mapStateToProps, { toggleSettingPanel, changeSetting })(
  RightPanel
);
