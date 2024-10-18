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
<<<<<<< HEAD
      <Button icon={<PlusOutlined />} type="primary" />
      <Button icon={<SyncOutlined />}>Tải lại</Button>
      <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
=======
      <Button onClick={callBack} icon={<PlusOutlined />} type="primary" />
      <Button icon={<SyncOutlined />}>Tai lai</Button>
      <Button icon={<DownloadOutlined />}>Xuat Excel</Button>
>>>>>>> 53291f2333e9daf91218c0681043cd924869557e
    </Space>
  );
}

export default ActionTools;
