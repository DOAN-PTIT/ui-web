"use client";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Divider,
  GetProp,
  Image,
  Input,
  message,
  Modal,
  Upload,
  UploadProps,
} from "antd";
import { RcFile } from 'antd/es/upload/interface';
import { useState } from "react";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface AddModelProps {
  open: boolean;
  onOk: (param: { name: string; avatar: any }) => Promise<void>;
  onCancel: () => void;
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
function AddModel({ open, onOk, onCancel }: AddModelProps) {
  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState<{
    name: string;
    avatar: RcFile | null;
  }>({
    name: "",
    avatar: null,
  });

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      setLoading(false);
      // Lưu file gốc (originFileObj) vào avatar
      // NOTE: K cần gửi base64, chỉ gửi file ảnh gốc
      setParam((prevState) => ({
        ...prevState,
        avatar: info.file.originFileObj as RcFile, // Lưu file thay vì base64
      }));
    }
  };

  // set avatarUrl
  const avatarUrl = param.avatar ? URL.createObjectURL(param.avatar) : "";

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Modal
        className="p-0"
        title="Thêm của hàng mới"
        open={open}
        onOk={() => onOk(param)}
        onCancel={onCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Divider className="p-0 m-0 px-10" />
        <div className="py-[16px]">
          <div>Tên cửa hàng:</div>
          <Input
            className="mt-1"
            placeholder="Tên cửa hàng"
            onChange={(e) =>
              setParam((prevState) => ({ ...prevState, name: e.target.value }))
            }
            value={param?.name}
          />
          <div className="mt-3">Hình đại diện cửa hàng:</div>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader mt-1"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess?.("ok");
              }, 1000);
            }}
          >
            {param.avatar ? (
              <Image src={avatarUrl} alt="avatar" style={{
                width: "100%",        
                height: "90px",       
                objectFit: "cover",   
                maxWidth: "100%",     
                maxHeight: "100%",    
              }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
      </Modal>
    </>
  );
}

export default AddModel;
