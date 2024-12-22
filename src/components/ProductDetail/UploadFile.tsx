import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Image, message, Upload } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import { useState } from "react";

type FileType = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

interface UploadFileProps {
    onChange: (file: RcFile | null) => void; // Callback gửi file (RcFile)
}

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Hình ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

function UploadFile({ onChange }: UploadFileProps) {
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<RcFile | null>(null);

    const handleChange: UploadProps["onChange"] = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }

        if (info.file.status === "done") {
            setLoading(false);

            // Lấy file gốc
            const file = info.file.originFileObj as RcFile;

            // Lưu file vào state
            setAvatar(file);

            // Gửi file gốc ra component cha thông qua `onChange`
            onChange(file);
        }
    };

    // Tạo URL xem trước từ file (nếu có)
    const avatarUrl = avatar ? URL.createObjectURL(avatar) : "";

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Upload
            accept="image/png,image/jpeg"
            listType="picture-card"
            className="avatar-uploader mt-1"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={({ file, onSuccess }) => {
                
                setTimeout(() => onSuccess?.("ok"), 0);
            }}
        >
            {avatar ? (
                <Image
                    preview={false}
                    src={avatarUrl}
                    alt="avatar"
                    style={{
                        width: "100%",
                        height: "90px",
                        objectFit: "cover",
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
}

export default UploadFile;
