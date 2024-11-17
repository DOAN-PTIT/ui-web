import {
  DownloadOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";

interface ActionToolsProps {
  callBack: () => void;
  reloadCallBack: () => Promise<any>;
}

function ActionTools(props: ActionToolsProps) {
  const { callBack, reloadCallBack } = props
  return (
    <Space className="mb-5">
      <Button onClick={callBack} icon={<PlusOutlined />} type="primary" />
      <Button icon={<SyncOutlined />} onClick={reloadCallBack}>Tải lại</Button>
      <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
    </Space>
  );
}

export default ActionTools;
