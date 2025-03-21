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
import classNames from "classnames";

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
    const { employeeShop, getEmployeeShop, shop } = props
    const dataRow = [
        {
            id: '1',
            name: 'Quản lý đơn hàng'
        },
        {
            id: '2',
            name: 'Quản lý khách hàng'
        },
        {
            id: '3',
            name: 'Quản lý khuyến mãi'
        },
        {
            id: '4',
            name: 'Quản lý nhập hàng'
        },
        {
            id: '5',
            name: 'Quản lý nhà cung cấp'
        }
    ]
    const dataRowAdmin = [
        {
            id: '1',
            name: 'Quản lý cửa hàng'
        },
        {
            id: '2',
            name: 'Quản lý sản phẩm'
        },
        {
            id: '3',
            name: 'Quản lý công nợ'
        },
        {
            id: '4',
            name: 'Quản lý nhân viên'
        },
        {
            id: '5',
            name: 'Quản lý đơn vị vận chuyển'
        },
        {
            id: '6',
            name: 'Xem báo cáo'
        }
    ]
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [openActor, setOpenActor] = useState(false)
    const [checkId, setCheckId] = useState()
    const [role, setRole] = useState()
    const [searchKey, setSearchKey] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const isDisabled = role === "employee";
    const handleOpenActor = (id: any) => {
        setOpenActor(true);
        setCheckId(id)
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        getEmployeeShop({ shopId })
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const shopId = shop.id
    const searchEmployee = async (shopId: number, value: string) => {
        const response = await apiClient.get(`/shop/${shopId}/employee/${value}`);
        return response.data;
    };
    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const data = await searchEmployee(shopId, value);
            setSearchResults(data);
        } catch (error) {
            message.error("Lỗi khi tìm kiếm nhân viên");
        } finally {
            setIsSearching(false);
        }
    };
    const handleRemove = async (id: any) => {
        try {
            await apiClient.post(`/shop/${shopId}/employee/${id}/remove`)
            message.success('Xóa nhân viên thành công')
            getEmployeeShop({ shopId })
        } catch (error) {
            console.log(error)
        }
    }
    const changeRoleUser = async (value: string) => {
        try {
            await apiClient.get(`shop/${shopId}/employee/${checkId}/role?role=${value}`)
            message.success('Thay đổi chức vụ thành công!')
            getEmployeeShop({ shopId })
        } catch (error) {
            message.error('Thay đổi chức vụ thất bại!')
        }
    }
    useEffect(() => {
        getEmployeeShop({ shopId })
    }, [])

    return (
        <Layout >
            <HeaderAction
                title="Cấu hình"
                isShowSearch={false}
                inputPlaholder="Tìm kiếm cấu hình"
            />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Nhân viên</Breadcrumb.Item>
                <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">Danh sách nhân viên</Breadcrumb.Item>
            </Breadcrumb>
            <LayoutStyled className="p-0">
                <div className="grid grid-cols-10 w-full gap-4 min-h-[calc(100vh-7.5rem)]">
                    <div className="col-span-3 rounded-lg bg-white ">
                        <div className="p-4 text-base font-semibold">Danh sách nhân viên</div>
                        <div className="flex px-4">
                            <Search
                                placeholder="Tìm kiếm nhân viên"
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                loading={isSearching}
                            />
                            <div className="pl-2">
                                <Button type="default" icon={<FilterOutlined />} />
                            </div>
                            <div className="pl-2">
                                <Button type="primary" onClick={showModal} icon={<PlusOutlined />} />
                                <ModalAddCustomer open={isModalOpen} onOk={handleOk} onCancel={handleCancel} />
                            </div>
                        </div>
                        <div className="p-4 ">
                            {(searchResults.length > 0 ? searchResults : employeeShop?.employees)?.map(i => (
                                <div aria-disabled key={i.id} >
                                    <div className={`${checkId == i.id && openActor && 'bg-cyan-100'} rounded-lg flex items-center justify-between text-sm px-2 py-1 mb-1 hover:bg-cyan-100 cursor-pointer`}>
                                        <div onClick={() => {
                                            handleOpenActor(i.id)
                                            setRole(i?.shopusers && i.shopusers[0]?.role)
                                        }} className="flex w-full">
                                            <Tooltip className={`flex items-center`} placement="topLeft" title={checkRole(i?.shopusers && i.shopusers[0]?.role)} >
                                                <Avatar src={i.avatar} icon={<UserOutlined />} alt="avt" className="mr-2 size-6" />
                                                <div>{i.name}</div>

                                            </Tooltip>
                                        </div>
                                        {i?.shopusers && i.shopusers[0]?.role !== 'owner' && (
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
                                    <Divider className="my-1" />
                                </div>

                            ))}

                        </div>
                    </div>
                    {openActor && (searchResults.length > 0 ? searchResults : employeeShop?.employees)?.find(i => i.id === checkId) ? (
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
                                                    {i?.shopusers && i.shopusers[0]?.role !== 'owner' && (
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
                                                    defaultValue={i?.shopusers && i.shopusers[0]?.role}
                                                    disabled={i?.shopusers && i.shopusers[0]?.role === 'owner' ? true : false}
                                                    onChange={(value) => setRole(value)}
                                                    options={
                                                        i?.shopusers && i.shopusers[0]?.role === 'owner' ? [{ value: 'owner', label: 'Chủ cửa hàng', disabled: true }]
                                                            : [
                                                                { value: 'admin', label: 'Quản lý' },
                                                                { value: 'employee', label: 'Nhân viên' }
                                                            ]}
                                                />
                                            </div>
                                            <div className="flex-1">

                                                <div className="text-sm font-medium mb-1">Bắt đầu làm việc</div>
                                                <DatePicker className="w-full" defaultValue={moment(i?.shopusers[0]?.createdAt, 'YYYY/MM/DD')} format={'YYYY/MM/DD'} disabled />
                                            </div>
                                        </div>
                                        <div>
                                            <TitleH title='Quyền trên cửa hàng' className="text-base mt-4" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2 ">
                                            <AuthCard title="Quyền chung" dataRow={dataRow}/>
                                            <AuthCard title="Quyền quản lý" dataRow={dataRowAdmin} role={isDisabled} />
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
        loading: state.shopReducer.isLoading
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        getEmployeeShop: (shopId: any) => dispatch(getListShopUser(shopId))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Personnel)
