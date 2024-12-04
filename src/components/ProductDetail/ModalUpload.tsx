import { PlusOutlined } from "@ant-design/icons";
import { GetProp, Image, Modal, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const ModalUpLoad = ({
    open,
    onCancel,
}: {
    open: boolean;
    onCancel: () => void;
}) => {
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handlePreview = async (file: UploadFile) => {
        setPreviewImage(file.thumbUrl || file.url!);
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <>
            <Modal open={open} onCancel={onCancel} title="Upload Images">
                <Upload
                    action="https://jsonplaceholder.typicode.com/posts"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>


            </Modal>



        </>
    );
};
