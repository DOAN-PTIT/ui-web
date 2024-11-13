"use client"

import { UploadOutlined } from "@ant-design/icons"
import { Avatar, Breadcrumb, Button, Input, Layout, Select, Space, Upload } from "antd"
import { useEffect, useState } from "react"
import TitleH from "../Custom/TitleH"
import TitleLabel from "../Custom/TitleLabel"
import HeaderAction from "../HeaderAction/HeaderAction"
import apiClient from "@/service/auth"
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
            label: 'Tiếng việt',
        },
        {
            value: 'en',
            label: 'Tiếng Anh',
        },
    ];


    const [imageUrl, setImageUrl] = useState<string | undefined>("");


    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => setImageUrl(reader.result as string);
        reader.readAsDataURL(file);
        return false;
    };
    const [data, setData] = useState<ShopSettings>()
    async function GetSetting() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await apiClient.get(`shop/setting/1`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log(res.data)
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const [formData, setFormData] = useState({
            date_format: '',
            location: '',
            language: '',
            time_zone: '',
        }
    )
    async function handleUpdate() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await apiClient.post(`shop/setting/${shopId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }, {
                date_format: '',
                location: '',
                language: '',
                time_zone: '',
            })
            console.log(res.data)
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        GetSetting()
    }, [])
    return (
        <Layout className="px-4">
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href="/shop/1/settings">Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href="/shop/1/settings">Cửa hàng </Breadcrumb.Item>
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
                            <Input className='w-full mb-4' defaultValue="Shop 1" value={data?.id} />
                            <TitleLabel title='Ngôn ngữ:' />
                            <Select className='w-full mb-4' defaultValue="Tiếng việt" value={data?.language === 'en' ? 'Tiếng Anh' : 'Tiếng Việt'} options={options} />
                            <TitleLabel title='Múi giờ:' />
                            <Input className='w-full mb-4' defaultValue="Tiếng việt" value={data?.time_zone} />
                            <TitleLabel title='Địa chỉ:' />
                            <Input className='w-full mb-4' defaultValue="Tiếng việt" value={data?.location} />

                            {/* <Space.Compact className="w-full">
                                <Select defaultValue="Nghệ An" options={optionsAdress} />
                                <Input defaultValue="Đồng Thành, Yên Thành" />
                            </Space.Compact> */}
                        </div>
                        <div className="flex justify-end">
                            <Button className='mt-4' type="primary">Lưu thay đổi</Button>
                        </div>
                    </div>

                </div>

            </Content>
        </Layout>
    )
}