"use client"

import apiClient from "@/service/auth"
import { Breadcrumb, Button, Input, Layout, message, Popconfirm, PopconfirmProps, Select } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import TitleH from "../Custom/TitleH"
import TitleLabel from "../Custom/TitleLabel"
import HeaderAction from "../HeaderAction/HeaderAction"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { LayoutStyled } from "@/styles/layoutStyle"
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

    const [formData, setFormData] = useState({
        date_format: '',
        location: '',
        language: '',
        time_zone: '',
        auto_product_code: false,
        source_order: 'facebook',
    });

    // const handleUpload = (file: File) => {
    //     const reader = new FileReader();
    //     reader.onload = () => setImageUrl(reader.result as string);
    //     reader.readAsDataURL(file);
    //     return false;
    // };

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
            // console.log("Form data being sent:", formData);

            const res = await apiClient.post(`shop/setting/update/${shopId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Response data:", res.data);
            message.success('Đã lưu thành công');

            setData(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                message.error('Lưu cài đặt thất bại');

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


    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('Chưa lưu');
    };
    return (
        <Layout className="">
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cửa hàng </Breadcrumb.Item>
                <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">Cài đặt chung</Breadcrumb.Item>
            </Breadcrumb>
            <LayoutStyled className="bg-white">
                <div className="grid grid-cols-4 w-full">
                    <div>
                        <TitleH className='mb-4' title='Thông tin cửa hàng' />
                    </div>
                    <div className="col-span-1 rounded-lg p-y mb-2 sm:col-span-1 lg:col-span-2 bg-white">

                        <TitleLabel title='Ngôn ngữ:' />
                        <Select
                            className='w-full mb-4'
                            value={formData.language}
                            options={options}
                            onChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                        />
                        <TitleLabel title='Múi giờ:' />
                        <Select
                            className='w-full mb-4'
                            value={formData.time_zone}
                            options={[{ value: `${formData.time_zone}`}]}
                            // onChange={(e) => setFormData(prev => ({ ...prev, time_zone: e.target.value }))}
                        />
                        <TitleLabel title='Địa chỉ:' />
                        <Input
                            className='w-full mb-4'
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        />

                    </div>
                    {/* <div className="flex justify-end">
                        <Button className='' type="primary" onClick={handleUpdate}>Lưu thay đổi</Button>
                    </div> */}
                    <div className="flex justify-end">
                        <Popconfirm
                            title="Lưu cài đặt"
                            description="Bạn có chắc chắn lưu cài đặt này?"
                            onConfirm={handleUpdate}
                            onCancel={cancel}
                            okText="Đồng ý"
                            cancelText="Không"
                            icon={<QuestionCircleOutlined style={{ color: '#9ecbf5' }} />}
                        >
                            <Button type="primary">Lưu cài đặt</Button>
                        </Popconfirm>
                    </div>

                </div>

            </LayoutStyled>
        </Layout>
    )
}
