import {
  DownloadOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";

interface ActionToolsProps {
  callBack: () => void
}

function ActionTools(props: ActionToolsProps) {
  const { callBack } = props
  return (
    <Space className="mb-5">
      <Button onClick={callBack} icon={<PlusOutlined />} type="primary" />
      <Button icon={<SyncOutlined />}>Tải lại</Button>
      <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
    </Space>
  );
}

export default ActionTools;
