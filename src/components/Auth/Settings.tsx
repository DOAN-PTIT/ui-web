"use client";

import { default as Img, default as Logo } from '@/assets/favicon.png'; // Ensure this path is correct
import apiClient from '@/service/auth';
import { FacebookLogo, LinkSimple } from '@phosphor-icons/react';
import { Menu as AntdMenu, Avatar, Button, DatePicker, Divider, Form, Input, Layout, message, Select, Upload, UploadFile } from "antd"; // Optional: You can also use Ant Design's Image if needed
import Image from 'next/image'; // Next.js Image for optimized image loading
import Link from "next/link";
import { useEffect, useState } from "react";
import TitleA from "../Custom/TitleA";
import TitleH from "../Custom/TitleH";
import TitleLabel from '../Custom/TitleLabel';
import HeaderAction from "../HeaderAction/HeaderAction";
import PassModel from './Modal/ModelPass';
import dayjs from 'dayjs';
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Content, Sider } = Layout;
const backItem = {
    key: "home",
    label: "Bảng điểu khiển",
    icon: <AppstoreOutlined />
}
interface Profile {
    access_token: string
    date_of_birth: string
    avatar: string
    email: string;
    fb_id: string
    id: string;
    name: string;
    phone_number: string
    role: string;

}


function Settings() {
    const route = useRouter();
    const [collapsed, setCollapsed] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [dataProfile, setDataProfile] = useState<Profile>();
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [avatarUrl, setAvatarUrl] = useState(); // Thêm trạng thái để lưu URL avatar
    const [data, setData] = useState()
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


    const [form] = Form.useForm();
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
            form.setFieldsValue({
                name: res.data.name,
                email: res.data.email,
                phone_number: res.data.phone_number,
                date_of_birth: res.data.date_of_birth ? dayjs(res.data.date_of_birth) : null,
            });
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

        
        setLoading(true)
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
        handleUpload(file.originFileObj || file);
        return false;
    };
    const onFinish = (values: any) => {
        const formattedValues = {
            ...values,
            date_of_birth: values.date_of_birth
                ? dayjs(values.date_of_birth).format("YYYY-MM-DD")
                : null,
        };
        handleUpdate(formattedValues)
    };
    const handleUpdate = async (data: any) => {
        setLoadingUpdate(true)
        try {
            await apiClient.post('/user/profile-update', data)
            message.success('Cập nhật thành công')
        } catch (error) {
            console.log(error)
            message.error('Cập nhật thất bại')
        } finally {
            setLoadingUpdate(false)
        }
    }
    return (
        <Layout className="bg-[#f2f4f7] min-h-screen">
            <Sider
                collapsible
                collapsedWidth={60}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="custom-sider bg-[#f2f4f7] bottom-0 top-0 h-screen "
            >
                {/* Logo container */}
                <div className='flex flex-col justify-between h-full'>

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
                <div>
                    <AntdMenu
                        className="bg-[#f2f4f7] text-[#101828] !border-none "
                        defaultOpenKeys={["dashbroad"]}
                        defaultSelectedKeys={["dashbroad"]}
                        selectedKeys={["settings"]}
                        items={[backItem]}
                        onClick={() => route.push("/shop/overview")}
                        theme="light"
                        mode="inline"
                    />
                </div>
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
                                <Avatar size={80} src={avatarUrl || dataProfile?.avatar} icon={<UserOutlined />} /> {/* Hiển thị avatar mới */}
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
                            <Form className='grid grid-cols-10 gap-4 ' onFinish={onFinish} form={form} >
                                <div className='col-span-full lg:col-span-4'>
                                    <TitleH title='Thông tin cơ bản' />

                                    <TitleA title='Các thông tin sử dụng để đăng nhập vào Goshop GOS' />
                                </div>
                                <div className='col-span-full lg:col-span-6'>
                                    <div className='mb-4'>
                                        {/* <div className='col-span-5'> */}
                                        <TitleLabel title='Họ và tên:' />
                                        <Form.Item name={'name'}>
                                            <Input placeholder="Nhập họ và tên đầy đủ" value={dataProfile?.name} />
                                        </Form.Item>

                                    </div>
                                    <div className='mb-4'>
                                        <TitleLabel title='Đăng nhập bằng Email' />
                                        <Form.Item >
                                            <Input placeholder="Nhập Email" value={dataProfile?.email} />
                                        </Form.Item>
                                    </div>
                                    <div className='mb-4'>
                                        <TitleLabel title='Số điện thoại:' />
                                        <Form.Item name={'phone_number'}>
                                            <Input placeholder="Nhập SĐT" value={dataProfile?.phone_number} />
                                        </Form.Item>
                                    </div>
                                    <div className='mb-4'>
                                        <TitleLabel title='Ngày sinh:' />
                                        <Form.Item name={'date_of_birth'}>
                                            <DatePicker format="YYYY-MM-DD" placeholder='Chọn ngày' className='w-full' value={dataProfile?.date_of_birth || null} />
                                        </Form.Item>
                                    </div>
                                    <div className='flex justify-end'>
                                        <Form.Item>
                                            <Button loading={loadingUpdate} type="primary" htmlType="submit">Lưu thay đổi</Button>

                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
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
