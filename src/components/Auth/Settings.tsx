"use client";

import { default as Img, default as Logo } from '@/assets/favicon.png'; // Ensure this path is correct
import { FacebookLogo, LinkSimple } from '@phosphor-icons/react';
import { Avatar, Button, Divider, Input, Layout, Select } from "antd"; // Optional: You can also use Ant Design's Image if needed
import Image from 'next/image'; // Next.js Image for optimized image loading
import Link from "next/link";
import { useState } from "react";
import TitleA from "../Custom/TitleA";
import TitleH from "../Custom/TitleH";
import TitleLabel from '../Custom/TitleLabel';
import HeaderAction from "../HeaderAction/HeaderAction";
import PassModel from './components/ModelPass';
const { Content, Sider } = Layout;


function Settings() {
    const [collapsed, setCollapsed] = useState(true);
    const [openModal, setOpenModal] = useState(false);
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
    return (
        <Layout className="bg-[#f2f4f7] min-h-screen">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="bg-[#f2f4f7] hidden md:block"
            >
                {/* Logo container */}
                <div
                    className="flex items-center justify-center m-1"
                    style={{ padding: collapsed ? "0 10px" : "0 20px" }}>
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

            <Content className="bg-[#f2f4f7]">
                <HeaderAction
                    title="Thiết lập tài khoản"
                    isShowSearch={false}

                />

                <div className="rounded-xl bg-[#eaecf0]">
                    <div className="flex items-center mx-5 mt-4" />
                    
                    <div className="items-start lg:grid grid-cols-3 gap-4 mx-5 mt-4">

                        <div className="col-span-1 rounded-lg p-5 mb-2 sm:grid-cols-1 lg:grid-cols-3 bg-white">
                            <div className="flex">
                                <Avatar className='w-[80px] h-[80px] mr-4' src='' alt='Ảnh đại diện' />
                                <div>
                                    <div className='text-base font-medium'>Truong Napan</div>
                                    <TitleLabel title='truongnapan@gmail.com' />
                                    <Button className='p-1' value="small">Thay đổi ảnh đại diện</Button>

                                </div>
                            </div>
                            <Divider className='mb-4 mt-4' />
                            <div>
                                <TitleH className='mb-4' title='Ngôn ngữ & Múi giờ' />
                                <TitleLabel title='Ngôn ngữ:' />
                                <Select className='w-full mb-4' defaultValue="Tiếng việt" options={options} />
                                <TitleLabel title='Múi giờ:' />
                                <Select className='w-full' defaultValue="Tiếng việt" options={options} />
                                <Button className='w-full mt-4' type="primary" danger>Đăng xuất khỏi các thiết bị khác</Button>

                            </div>
                        </div>
                        <div className="col-span-2 rounded-lg p-5 bg-white">
                            <div className='grid grid-cols-10 gap-4 '>
                                <div className='col-span-full lg:col-span-4'>
                                    <TitleH title='Thông tin cơ bản' />
                                    <TitleA title='Các thông tin sử dụng để đăng nhập vào Goshop GOS' />
                                </div>
                                <div className='col-span-full lg:col-span-6'>
                                    <div className='grid grid-cols-10 gap-4 mb-4'>
                                        <div className='col-span-5'>
                                            <TitleLabel title='Họ:' />
                                            <Input placeholder="Nhập họ" />
                                        </div>
                                        <div className='col-span-5'>
                                            <TitleLabel title='Tên:' />
                                            <Input placeholder="Nhập tên" />
                                        </div>
                                    </div>
                                    <div className='mb-4'>
                                        <TitleLabel title='Tên đăng nhập' />
                                        <Input placeholder="Nhập tên đăng nhập" />
                                    </div>
                                    <div className='mb-4'>
                                        <TitleLabel title='Số điện thoại:' />
                                        <Input placeholder="Nhập họ" />
                                    </div>
                                    <div className='mb-4'>
                                        <TitleLabel title='Email:' />
                                        <Input placeholder="Nhập email" />
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
                                    <div className='flex justify-between rounded-lg border-[1px] p-3 mt-4 cursor-pointer'>
                                        <div className='flex items-center'>
                                            <FacebookLogo size={26} color="#276bf1" weight="fill" />
                                            <div className='p-1 text-sm font-normal'>Liên kết tài khoản Facebook</div>
                                        </div>
                                        <div className='flex items-center'>
                                            <LinkSimple size={18} color="#51a9e9" />
                                            <Button className='p-1' type="link">Liên kết với tài khoản Facebook</Button>
                                        </div>
                                    </div>
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
