"use client"

import { UploadOutlined } from "@ant-design/icons"
import { Avatar, Breadcrumb, Button, Input, Layout, Select, Space, Upload } from "antd"
import { useEffect, useState } from "react"
import TitleH from "../Custom/TitleH"
import TitleLabel from "../Custom/TitleLabel"
import HeaderAction from "../HeaderAction/HeaderAction"
import apiClient from "@/service/auth"
import axios from "axios"
import { getHostName } from "@/utils/tools"
const { Content } = Layout

interface ShopSettings {
    id: number;
    date_format: string;
    location: string;
    language: string;
    time_zone: string;
    auto_product_code: boolean;
    source_order: string | null;
    updatedAt: string;
    createdAt: string;
    shop_id: number;
}

export default function Genaral() {
    const options = [
        {
            value: 'vi',
            label: 'Tiếng Việt',
        },
        {
            value: 'en',
            label: 'Tiếng Anh',
        },
    ];

    const [imageUrl, setImageUrl] = useState<string | undefined>("");
    const [formData, setFormData] = useState({
        date_format: '',
        location: '',
        language: '',
        time_zone: '',
        auto_product_code: false, 
        source_order: 'facebook',
    });

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => setImageUrl(reader.result as string);
        reader.readAsDataURL(file);
        return false;
    };

    const [data, setData] = useState<ShopSettings>();

    const shopId = localStorage.getItem('shopId');

    async function GetSetting() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await apiClient.get(`shop/setting/${shopId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log('Settings:', res.data);
            setData(res.data);
            setFormData({
                date_format: res.data.date_format,
                location: res.data.location,
                language: res.data.language,
                time_zone: res.data.time_zone,
                auto_product_code: res.data.auto_product_code,
                source_order: 'facebook',
            });
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    }

    async function handleUpdate() {
        try {
            const shopId = localStorage.getItem("shopId");
            const accessToken = localStorage.getItem("accessToken");

            // Log request URL and form data
            console.log("Request URL: ", `${getHostName()}/shop/setting/update/${shopId}`);
            console.log("Form data being sent:", formData);

            const res = await apiClient.post(`shop/setting/update/${shopId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Response data:", res.data);
            setData(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error response:", error.response?.data);
                console.error("Error status:", error.response?.status);
                console.error("Error headers:", error.response?.headers);
            } else {
                console.error("Error:", error);
            }
        }
    }

    useEffect(() => {
        GetSetting();
    }, []);

    return (
        <Layout className="px-4">
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cửa hàng </Breadcrumb.Item>
                <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">Cài đặt chung</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="bg-white rounded-lg overflow-auto overflow-x-hidden p-5 gap-5 h-screen">
                <div className="grid grid-cols-2 w-full">
                    <div className="col-span-1 p-5 mb-2 sm:grid-cols-1 lg:grid-cols-1 bg-white flex justify-center">
                        <div className="">
                            <Avatar
                                className="w-[280px] h-[280px] mr-4 rounded-full object-cover"
                                src={imageUrl || "https://huanluyencho119.vn/storage/9c/b8/9cb8sza53kwquhgx4wmgnll6g3wu_cach-huan-luyen-cho-phat-mot-chu-cho-khi-lam-sai-lieu-co-hieu-qua-nhu-mong-doi.jpg"} // Hiển thị ảnh hiện có hoặc ảnh mặc định
                                alt="Ảnh đại diện"
                            />
                            <div className="flex justify-center mt-2">
                                <Upload
                                    showUploadList={false}
                                    beforeUpload={handleUpload} // Hàm xử lý ảnh mới
                                    accept="image/*" // Chỉ chấp nhận file ảnh
                                >
                                    <Button icon={<UploadOutlined />} className="p-1">
                                        Thay đổi ảnh đại diện
                                    </Button>
                                </Upload>
                            </div>
                        </div>

                    </div>
                    <div className="col-span-1 rounded-lg p-5 mb-2 sm:grid-cols-1 lg:grid-cols-1 bg-white">
                        <div>
                            <TitleH className='mb-4' title='Thông tin cửa hàng' />
                            <TitleLabel title='Tên cửa hàng:' />
                            <Input
                                className='w-full mb-4'
                                defaultValue="Shop 1"
                                value={data?.id}
                                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                            />
                            <TitleLabel title='Ngôn ngữ:' />
                            <Select
                                className='w-full mb-4'
                                value={formData.language}
                                options={options}
                                onChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                            />
                            <TitleLabel title='Múi giờ:' />
                            <Input
                                className='w-full mb-4'
                                value={formData.time_zone}
                                onChange={(e) => setFormData(prev => ({ ...prev, time_zone: e.target.value }))}
                            />
                            <TitleLabel title='Địa chỉ:' />
                            <Input
                                className='w-full mb-4'
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button className='mt-4' type="primary" onClick={handleUpdate}>Lưu thay đổi</Button>
                        </div>
                    </div>

                </div>

            </Content>
        </Layout>
    )
}
