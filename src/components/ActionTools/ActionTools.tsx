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
      <Button icon={<SyncOutlined />}>Tai lai</Button>
      <Button icon={<DownloadOutlined />}>Xuat Excel</Button>
    </Space>
  );
}

export default ActionTools;
