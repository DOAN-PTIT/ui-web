import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";

export const ModalUpLoad = ({
    open,
    onCancel,
}: {
    open: boolean;
    onCancel: () => void;
   
}) => {
    const [previewImage, setPreviewImage] = useState<string>(""); 
    const [previewTitle, setPreviewTitle] = useState<string>(""); 
    const [previewOpen, setPreviewOpen] = useState<boolean>(false); 
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    
    const handlePreview = async (file: UploadFile) => {
        setPreviewImage(file.thumbUrl || file.url || ""); 
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)); //
        setPreviewOpen(true); 
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList); 
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <>
            <Modal
                open={open}
                onCancel={onCancel}
                title="Thêm ảnh sản phẩm"
                footer={null}
            >
                <Upload
                name="Tải lên"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    onPreview={handlePreview} // Xử lý xem trước
                    beforeUpload={() => false} // Không tải lên ngay
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
            </Modal>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)} // Đóng modal xem trước
            >
                <img
                    alt="preview"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};
