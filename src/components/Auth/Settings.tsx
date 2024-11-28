"use client";

import { default as Img, default as Logo } from '@/assets/favicon.png'; // Ensure this path is correct
import apiClient from '@/service/auth';
import { FacebookLogo, LinkSimple } from '@phosphor-icons/react';
import { Avatar, Button, DatePicker, Divider, GetProp, Input, Layout, message, Select, Spin, Upload, UploadFile, UploadProps } from "antd"; // Optional: You can also use Ant Design's Image if needed
import Image from 'next/image'; // Next.js Image for optimized image loading
import Link from "next/link";
import { useEffect, useState } from "react";
import TitleA from "../Custom/TitleA";
import TitleH from "../Custom/TitleH";
import TitleLabel from '../Custom/TitleLabel';
import HeaderAction from "../HeaderAction/HeaderAction";
import PassModel from './components/ModelPass';
import { RcFile } from 'antd/es/upload';

const { Content, Sider } = Layout;
interface Profile {
    access_token: string
    date_of_birth: string
    avatar: string
    email: string;
    fb_id: string
    id: number;
    name: string;
    phone_number: string
    role: string;

}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

function Settings() {
    const [collapsed, setCollapsed] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [dataProfile, setDataProfile] = useState<Profile>();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [avatarUrl, setAvatarUrl] = useState(); // Thêm trạng thái để lưu URL avatar

    const handleOpenModel = () => {
        setOpenModal(true)
    }
    const handleOk = () => {
        setOpenModal(false);
    };

    const handleCancel = () => {
        setOpenModal(false);
    };
    const options = [
        {
            value: 'Tiếng việt',
            label: 'Tiếng việt',
        },
        {
            value: 'Anh',
            label: 'Anh',
        },
    ];
    // const optionsTime = [
    //     {
    //         value: '(GMT +7:00) Bangkok, Hanoi, Jakarta',
    //         label: '(GMT +7:00) Bangkok, Hanoi, Jakarta',
    //     },

    // ];



    async function fetchProfile() {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const res = await apiClient.get("/user/profile", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setDataProfile(res.data);

            if (res.data.avatar) {
                setFileList(res.data.avatar);
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin hồ sơ:", error);
        }
    }
    useEffect(() => {
        fetchProfile()
    }, [])
    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);

        // console.log("FormData preview:");
        // formData.forEach((value, key) => {
        //     console.log(key, value);
        // });

        try {
            const response = await apiClient.post("/user/profile-update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setAvatarUrl(response.data.avatar)
            message.success("Cập nhật ảnh đại diện thành công");
        } catch (error) {
            message.error("Upload failed");
            console.log(error)
        } finally {
            // message.loading("Đang cập nhật")
            setLoading(false)
        }
    };
    const beforeUpload = (file: any) => {
        // console.log("File structure:", file);

        // if (file.originFileObj) {
        //     console.log("Using originFileObj:", file.originFileObj);
        // } else {
        //     console.log("Using file directly:", file);
        // }

        handleUpload(file.originFileObj || file);
        return false;
    };

    return (
        <Layout className="bg-[#f2f4f7] min-h-screen">
            <Sider
                collapsible
                collapsedWidth={50}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="bg-[#f2f4f7] hidden md:block"
            >
                {/* Logo container */}
                <div
                    className="flex items-center justify-center ml-2 mt-2"
                    style={{ padding: collapsed ? "0 0" : "0 20px" }}>
                    <Link href={'/'} className="flex items-center justify-center">
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="items-center mr-2"
                        />
                        {collapsed ? '' : <div className="text-base font-semibold text-black hover:text-black">Goshop GOS</div>}


                    </Link>
                </div>

                {/* <Menu className="bg-[#eaecf0]" defaultSelectedKeys={['1']} mode="inline" /> */}
            </Sider>
            
                <Content className="bg-[#f2f4f7] min-h-screen">
                    <div className='px-4'>
                        <HeaderAction
                            title="Thiết lập tài khoản"
                            isShowSearch={false}

                        />
                    </div>


                    <div className="rounded-xl bg-[#eaecf0]">
                        <div className="flex items-center mx-5" />

                        <div className="items-start lg:grid grid-cols-3 gap-4 mx-5 mt-4">

                            <div className="col-span-1 rounded-lg p-5 mb-2 sm:grid-cols-1 lg:grid-cols-3 bg-white">
                                <div className="flex">
                                    <Avatar size={80} src={avatarUrl || dataProfile?.avatar} /> {/* Hiển thị avatar mới */}
                                    <div className='ml-2'>
                                        <div className='text-base font-medium'>{dataProfile?.name}</div>
                                        <TitleLabel title={dataProfile?.email} />
                                        <Upload
                                            accept="image/*"
                                            beforeUpload={beforeUpload}
                                            showUploadList={false}
                                        // onChange={handleChange}
                                        >
                                            <Button loading={loading}>Thay đổi ảnh đại diện</Button>
                                        </Upload>
                                    </div>
                                </div>
                                <Divider className='mb-4 mt-4' />
                                <div>
                                    <TitleH className='mb-4' title='Ngôn ngữ & Múi giờ' />
                                    <TitleLabel title='Ngôn ngữ:' />
                                    <Select className='w-full mb-4' defaultValue="Tiếng việt" options={options} />
                                    {/* <TitleLabel title='Múi giờ:' />
                                <Select className='w-full' defaultValue="(GMT +7:00) Bangkok, Hanoi, Jakarta" options={optionsTime} /> */}
                                    <Button className='w-full mt-4' type="primary" danger>Đăng xuất</Button>

                                </div>
                            </div>
                            <div className="col-span-2 rounded-lg p-5 bg-white">
                                <div className='grid grid-cols-10 gap-4 '>
                                    <div className='col-span-full lg:col-span-4'>
                                        <TitleH title='Thông tin cơ bản' />
                                        <TitleA title='Các thông tin sử dụng để đăng nhập vào Goshop GOS' />
                                    </div>
                                    <div className='col-span-full lg:col-span-6'>
                                        <div className='mb-4'>
                                            {/* <div className='col-span-5'> */}
                                            <TitleLabel title='Họ và tên:' />
                                            <Input placeholder="Nhập họ và tên đầy đủ" value={dataProfile?.name} />
                                            {/* </div> */}
                                            {/* <div className='col-span-5'>
                                            <TitleLabel title='Tên:' />
                                            <Input placeholder="Nhập tên" />
                                        </div> */}
                                        </div>
                                        <div className='mb-4'>
                                            <TitleLabel title='Đăng nhập bằng Email' />
                                            <Input placeholder="Nhập Email" value={dataProfile?.email} />
                                        </div>
                                        <div className='mb-4'>
                                            <TitleLabel title='Số điện thoại:' />
                                            <Input placeholder="Nhập SĐT" value={dataProfile?.phone_number} />
                                        </div>
                                        <div className='mb-4'>
                                            <TitleLabel title='Ngày sinh:' />
                                            <DatePicker placeholder='Chọn ngày' className='w-full' />
                                        </div>
                                        <div className='flex justify-end'>
                                            <Button type="primary">Lưu thay đổi</Button>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                                <div className='grid grid-cols-10 gap-4 '>
                                    <div className='col-span-full lg:col-span-4'>
                                        <TitleH title='Liên kết tài khoản' />
                                        <TitleA title='Liên kết tài khoản đến các mạng xã hội' />
                                    </div>
                                    <div className='col-span-full lg:col-span-6'>
                                        <div className='flex justify-between rounded-lg border-[1px] p-3 cursor-pointer'>
                                            <div className='flex items-center'>
                                                <Image className='w-7 ' src={Img} alt="logo" />
                                                <div className='text-sm font-normal'>Liên kết với Goshop ID</div>
                                            </div>

                                            <div className='flex items-center'>
                                                <div className='text-sm font-normal text-green-400'>Đã liên kết</div>
                                            </div>
                                        </div>
                                        {dataProfile?.fb_id && (
                                            <div className='flex justify-between rounded-lg border-[1px] p-3 mt-4 cursor-pointer'>
                                                <div className='flex items-center'>
                                                    <FacebookLogo size={26} color="#276bf1" weight="fill" />
                                                    <div className='p-1 text-sm font-normal'>Liên kết tài khoản Facebook</div>
                                                </div>
                                                <div className='flex items-center'>
                                                    <LinkSimple size={18} color="#51a9e9" />
                                                    <Button className='p-1' type="link">
                                                        {dataProfile?.fb_id == null ? 'Liên kết với tài khoản Facebook' : `${dataProfile?.fb_id}`}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Divider />
                                <div className='grid grid-cols-10 gap-4 '>
                                    <div className='col-span-full lg:col-span-4'>
                                        <TitleH title='Mật khẩu' />
                                        <TitleA title='Thiết lập lại mật khẩu của bạn' />
                                    </div>
                                    <div className='col-span-full lg:col-span-4'>
                                        <Button onClick={handleOpenModel} type="primary">Đổi mật khẩu</Button>
                                        <PassModel open={openModal} onOk={handleOk} onCancel={handleCancel} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex items-center mx-5 mt-4" />

                    </div>
                </Content>

            
        </Layout>
    );
}

export default Settings;
