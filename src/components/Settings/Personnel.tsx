"use client"

import { getListShopUser } from "@/action/shop.action";
import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { LayoutStyled } from "@/styles/layoutStyle";
import { checkRole } from "@/utils/tools";
import { DeleteOutlined, FilterOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, DatePicker, Divider, Input, Layout, message, Popconfirm, Select, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import TitleH from "../Custom/TitleH";
import HeaderAction from "../HeaderAction/HeaderAction";
import AuthCard from "./components/Card";
import ModalAddCustomer from "./components/ModalAddCustomer";

const { Content } = Layout
const { Search } = Input;
interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    phone_number: string | null;
    date_of_birth: string | null;
    createdAt: string;
}
interface PesonnelProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> { }
 function Personnel(props: PesonnelProps) {
    const {employeeShop,getEmployeeShop,shop} = props
    // console.log(props)
    const dataRow = [
        {
            id: '1',
            name: 'Xem báo cáo'
        },
        {
            id: '2',
            name: 'Gộp shop'
        },
        {
            id: '3',
            name: 'Gộp shop'
        }
    ]
    
    // console.log(employeeShop)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [openActor, setOpenActor] = useState(false)
    const [checkId, setCheckId] = useState()
    const [role, setRole] = useState()
    // const [dataPersonnel, setDataPersonnel] = useState<User[]>()
    const handleOpenActor = (id: any) => {
        setOpenActor(true);
        // localStorage.setItem('personId', id)
        setCheckId(id)
        // changeRoleUser()
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        getEmployeeShop({shopId})
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const shopId = shop.id

    const handleRemove = async (id: any) => {
        // console.log(id)
        // console.log(`/shop/${shopId}/employee/${id}/remove`)

        try {
            await apiClient.post(`/shop/${shopId}/employee/${id}/remove`)
            message.success('Xóa nhân viên thành công')
            getEmployeeShop({shopId})
        } catch (error) {
            console.log(error)
        }
    }
    const changeRoleUser = async (value:string)=> {
        try {
            await apiClient.get(`shop/${shopId}/employee/${checkId}/role?role=${value}`)
            message.success('Thay đổi chức vụ thành công!')
            getEmployeeShop({ shopId })
        } catch (error) {
            message.error('Thay đổi chức vụ thất bại!')
        }
    }
    useEffect(() => {
        // fetchListPersonnel()
        getEmployeeShop({shopId})
        
    }, [])

    return (
        <Layout >
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Nhân viên</Breadcrumb.Item>
                <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">Danh sách nhân viên</Breadcrumb.Item>
            </Breadcrumb>
            <LayoutStyled className="p-0">
                <div className="grid grid-cols-10 w-full gap-4">
                    <div className="col-span-3 rounded-lg bg-white min-h-screen">
                        <div className="p-4 text-base font-semibold">Danh sách nhân viên</div>
                        <div className="flex px-4">
                            <Search placeholder="Tìm kiếm nhân viên" />
                            <div className="pl-2">
                                <Button type="default" icon={<FilterOutlined />} />
                            </div>
                            <div className="pl-2">
                                <Button type="primary" onClick={showModal} icon={<PlusOutlined />} />
                                <ModalAddCustomer open={isModalOpen} onOk={handleOk} onCancel={handleCancel} />
                            </div>
                        </div>
                        <div className="p-4 ">
                            {employeeShop?.employees?.map(i => (
                                <div aria-disabled key={i.id} >
                                    <div className={`${checkId == i.id && openActor && 'bg-cyan-100'} rounded-lg flex items-center justify-between text-sm px-2 py-1 mb-1 hover:bg-cyan-100 cursor-pointer`}>
                                        <div onClick={() => handleOpenActor(i.id)} className="flex w-full">
                                            <Tooltip className={`flex items-center`} placement="topLeft" title={checkRole(i?.shopusers[0].role)} >
                                                <Avatar src={i.avatar} icon={<UserOutlined />} alt="avt" className="mr-2 size-6" />
                                                <div>{i.name}</div>

                                            </Tooltip>
                                        </div>
                                        {i?.shopusers[0].role !== 'owner' && (
                                            <Popconfirm
                                                title="Xóa nhân viên"
                                                description="Bạn chắc chắn muốn xóa nhân viên shop?"
                                                onConfirm={() => handleRemove(i.id)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <div><DeleteOutlined /></div>
                                            </Popconfirm>
                                        )}


                                    </div>
                                    <Divider className="my-1"/>
                                </div>
                                // <div key={i?.id || null}>

                                //     {i.id}
                                // </div>
                            ))}

                        </div>
                    </div>
                    {openActor && employeeShop?.employees?.find(i => i.id === checkId) ? (
                        <div className="col-span-7 rounded-lg py-4 px-6 bg-white">
                            {employeeShop?.employees
                                .filter(i => i.id === checkId)
                                .map(i => (
                                    <div key={i.id} >
                                        <div className="flex items-center gap-4">
                                            <Avatar src={i.avatar} icon={<UserOutlined />} alt="avt" size={48} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-base font-semibold">{i.name}</div>
                                                    {i?.shopusers[0].role !== 'owner' && (
                                                        <Popconfirm
                                                        title="Lưu chức vụ"
                                                        placement="bottomLeft"
                                                        description="Bạn chắc chắn muốn lưu chức vụ nhân viên shop?"
                                                        onConfirm={() => role && changeRoleUser(role)}
                                                        okText="Lưu"
                                                        cancelText="Hủy"
                                                    >
                                                        <Button type="primary">Lưu</Button>
                                                    </Popconfirm>
                                                    )}
                                                    
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex">
                                                        <div className="text-sm font-medium">Email: </div>
                                                        <div className="mx-2 text-sm italic text-blue-700">{i.email}</div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="text-sm font-medium">SĐT: </div>
                                                        <div className="mx-2 text-sm italic text-blue-700">{i.phone_number}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-4">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium mb-1">Chức vụ</div>
                                                <Select
                                                    className="w-full text-black"
                                                    defaultValue={i?.shopusers[0].role}
                                                    disabled={i?.shopusers[0].role === 'owner' ? true : false}
                                                    onChange={(value) => setRole(value)}
                                                    options={
                                                        i?.shopusers[0].role === 'owner' ? [{ value: 'owner', label: 'Chủ cửa hàng', disabled: true }] 
                                                        :[
                                                        { value: 'admin', label: 'Quản lý' },
                                                        { value: 'employee', label: 'Nhân viên' }  
                                                    ]}
                                                />
                                            </div>
                                            {/* <div className="flex-1">
                                                <div className="text-sm font-medium mb-1">Kho hàng</div>
                                                <Select
                                                    className="w-full"
                                                    defaultValue="lucy"
                                                    options={[
                                                        { value: 'jack', label: 'Jack' },
                                                        { value: 'lucy', label: 'Lucy' },
                                                        { value: 'Yiminghe', label: 'yiminghe' },
                                                        { value: 'disabled', label: 'Disabled', disabled: true },
                                                    ]}
                                                />
                                            </div> */}
                                            <div className="flex-1">

                                                <div className="text-sm font-medium mb-1">Bắt đầu làm việc</div>
                                                <DatePicker className="w-full" defaultValue={moment(i?.shopusers[0].createdAt, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}  disabled/>
                                            </div>
                                        </div>
                                        <div>
                                            <TitleH title='Quyền trên cửa hàng' className="text-base mt-4" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2 ">
                                            <AuthCard title="Cấu hình" dataRow={dataRow} />
                                            <AuthCard title="Sản phẩm" dataRow={dataRow} />
                                            <AuthCard title="Bán hàng" dataRow={dataRow} />
                                            <AuthCard title="Ứng dụng" dataRow={dataRow} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : null}

                </div>
            </LayoutStyled>
        </Layout>
    )
}
const mapStateToProps = (state: RootState) => {
    return {
        employeeShop: state.shopReducer.user,
        shop: state.shopReducer.shop,
        loading:state.shopReducer.isLoading
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        getEmployeeShop: (shopId:any) => dispatch(getListShopUser(shopId))
        
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Personnel)