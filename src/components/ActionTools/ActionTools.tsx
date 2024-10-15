import {
  DownloadOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";

function ActionTools() {
  return (
    <Space className="mb-5">
      <Button icon={<PlusOutlined />} type="primary" />
      <Button icon={<SyncOutlined />}>Tải lại</Button>
      <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
    </Space>
  );
}

export default ActionTools;
