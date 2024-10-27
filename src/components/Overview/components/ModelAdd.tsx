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
import { useState } from "react";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
interface AddModelProps {
  open: boolean;
  onOk: (param: { name: string; avatar: any }) => Promise<void>;
  onCancel: () => void;
}

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

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
    avatar: any;
  }>({
    name: "",
    avatar: "",
  });

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setParam((preState) => ({ ...preState, avatar: url }));
      });
    }
  };

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
          >
            {param.avatar ? (
              <Image
                src={param.avatar}
                alt="avatar"
                style={{ width: "100%" }}
              />
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
