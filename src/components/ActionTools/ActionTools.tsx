import {
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";

interface ActionToolsProps {
  callBack: () => void;
  reloadCallBack: () => Promise<any>;
  hasSyncFBCatalog?: boolean;
  callBackSyncFBCatalog?: () => void;
  handleClickExportExcel?: () => void;
}

function ActionTools(props: ActionToolsProps) {
  const {
    callBack,
    reloadCallBack,
    callBackSyncFBCatalog,
    hasSyncFBCatalog,
    handleClickExportExcel,
  } = props;
  return (
    <Space className="mb-5">
      <Button onClick={callBack} icon={<PlusOutlined />} type="primary" />
      <Button icon={<ReloadOutlined />} onClick={reloadCallBack}>
        Tải lại
      </Button>
      <Button icon={<DownloadOutlined />} onClick={handleClickExportExcel}>
        Xuất Excel
      </Button>
      {hasSyncFBCatalog && (
        <Tooltip title="Đồng bộ sản phẩm từ Facebook Shop về Shop">
          <Button onClick={callBackSyncFBCatalog} icon={<SyncOutlined />}>
            Đồng bộ Facebook Catalog
          </Button>
        </Tooltip>
      )}
    </Space>
  );
}

export default ActionTools;
