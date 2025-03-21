"use client";

import moment from "moment";
import Avatar from "react-avatar";
import {
  Layout,
  Modal,
  Table,
  Input,
  Divider,
  DatePicker,
  Space,
  Button,
  message,
  notification,
  Spin,
} from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import {
  CalendarOutlined,
  ContainerOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";
import apiClient from "@/service/auth";
import "../../styles/global.css";
import CustomerDetail from "./CustomerDetailModal";
import { debounce } from "lodash";
import { autoAddZero, formatNumber } from "@/utils/tools";
import CustomerExportExcel from "../CustomerExportExcel";

interface CustomerType {
  id: string;
  customerName: string;
  dateOfBirth: string;
  totalOrder: number;
  total_spent: number;
  insertedAt: string;
  email: string;
  address: string;
  referralCode: string;
  phoneNumber: string;
}

interface CustomerProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const defaultParams = {
  page: 1,
  page_size: 30,
  sortBy: "CREATED_AT_DESC",
};

const defaultCreateCustomerParams = {
  name: "",
  phone_number: "",
  email: "",
  gender: "MALE",
}

function Customer(props: CustomerProps) {
  const { currentShop } = props;
  const [modalVisiable, setModalVisiable] = useState(false);
  const [openCustomerDetail, setOpenCustomerDetail] = useState(false);
  const [idCustomerDetaild, setIdCustomerDetail] = useState<number>();
  const [listCustomer, setListCustomer] = useState<[]>([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataCustomer, setDataCustomer] = useState();
  const [createCustomerParams, setCreateCustomerParams] = useState(defaultCreateCustomerParams);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportExcel, setIsExportExcel] = useState(false);

  useEffect(() => {
    getListCustomer(defaultParams);
  }, [currentPage]);

  const columns: TableProps<CustomerType>["columns"] = [
    {
      key: "STT",
      dataIndex: "stt",
      title: "STT",
      fixed: "left",
      width: 180,
      render: (_: any, __: any, index: number) => autoAddZero(index + 1, 0),
    },
    {
      key: "CUSTOMER NAME",
      dataIndex: "customerName",
      title: "Khách hàng",
      fixed: "left",
      width: 320,
      render: (text: string, record: any) => {
        return (
          <div>
            <Avatar name={text} size="30" round className="mr-5" />
            {text}
          </div>
        );
      },
    },
    {
      key: "DATE OF BIRTH",
      dataIndex: "dateOfBirth",
      title: "Ngày sinh",
      render: (text: string, record: any) => {
        return <div>{text ? moment(text).format("DD/MM/YYYY") : <span className="text-red-500">Chưa có thông tin</span>}</div>
      }
    },
    {
      key: "ADDRESS",
      dataIndex: "address",
      title: "Địa chỉ",
    },
    {
      key: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      title: "Số điện thoại",
    },
    {
      key: "EMAIL",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "REFERRAL CODE",
      dataIndex: "referralCode",
      title: "Mã giới thiệu",
      render: (text: string, record: any) => {
        return (
          <div>
            {text ? text : <span className="text-red-400">Chưa có</span>}
          </div>
        );
      },
    },
    {
      key: "TOTAL ORDER",
      dataIndex: "totalOrder",
      title: "Đơn đã giao",
      render: (text: string, record: any) => {
        return <div>{text || 0}</div>;
      },
    },
    {
      key: "TOTAL PURCHASE PRICE",
      dataIndex: "totalPurchasePrice",
      title: "Tổng tiền mua",
      render: (text: string, record: any) => {
        return <div>{text || 0}</div>;
      },
    },
    {
      key: "INSERTED AT",
      dataIndex: "insertedAt",
      title: "Ngày tạo",
    },
  ];

  const callBack = () => {
    setModalVisiable(true);
  };

  const getData: () => TableProps<any>["dataSource"] = () => {
    return listCustomer.length > 0
      ? listCustomer.map((customer: any) => ({
          id: customer.id,
          customerName: customer.name,
          dateOfBirth: customer.date_of_birth,
          totalOrder: customer.order_count,
          totalPurchasePrice: `${formatNumber(customer.total_spent)} đ`,
          insertedAt: moment(customer.createdAt).format("DD/MM/YYYY"),
          email: customer.email,
          address: customer.address,
          referralCode: customer.referral_code,
          phoneNumber: customer.phone_number,
        }))
      : [];
  };

  const getListCustomer = async (params: any) => {
    setIsLoading(true);
    const { page_size, sortBy, search } = params;
    const url = `shop/${
      currentShop.id
    }/customer/all?page=${currentPage}&&sortBy=${sortBy}${
      search ? `&&search=${search}` : ""
    }`;
    return await apiClient
      .get(url)
      .then((res) => {
        setIsLoading(false);
        setListCustomer(res.data.customers);
        setTotalCustomer(res.data.totalCount);
        return res.data;
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleSearch = (value: string) => {
    const params = { ...defaultParams, search: value };
    setSearchTerm(value);
    getListCustomer(params);
  };

  const deboundSearch = debounce(handleSearch, 300);

  const handleCreateShopCustomer = async () => {
    setIsLoading(true);
    const url = `shop/${currentShop.id}/customer/add`;
    return await apiClient
      .post(url, createCustomerParams)
      .then((res) => {
        setIsLoading(false);
        setModalVisiable(false);
        setCreateCustomerParams(defaultCreateCustomerParams);
        getListCustomer(defaultParams);
        // return res.data;
        notification.success({
          message: "Tạo khách hàng thành công",
          description: "Tạo khách hàng thành công",
          duration: 5,
        });
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Tạo khách hàng thất bại",
          description: Array.isArray(error.response?.data?.message)
            ? error.response.data.message.join("; ")
            : error.response?.data?.message || "Đã xảy ra lỗi không xác định.",
          duration: 5,
        });
      });
  };

  const onInputChange = (which: string, value: string = "") => {
    setCreateCustomerParams({
      ...createCustomerParams,
      [which]: value,
    });
  };

  const renderFooterCreateModal = () => {
    return (
      <Space>
        <Button onClick={() => setModalVisiable(false)}>Huỷ bỏ</Button>
        <Button type="primary" onClick={handleCreateShopCustomer}>
          Tạo khách hàng
        </Button>
      </Space>
    );
  };
  const handleOpen = (id: number) => {
    setOpenCustomerDetail(true);
    setIdCustomerDetail(id);
    fetchCustomerDetail(id);
    console.log(id);
  };
  const fetchCustomerDetail = async (id: any) => {
    setIsLoadingCustomer(true);
    try {
      const res = await apiClient.get(
        `/shop/${currentShop.id}/customer/${id}/detail`
      );
      setDataCustomer(res.data);
      setIsLoadingCustomer(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout className="h-full">
      <HeaderAction
        title="Khách hàng"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm khách hàng"
        handleSearch={deboundSearch}
      />
      <Layout.Content className="p-5 h-screen bg-gray-200 rounded-tl-xl order__table__container">
        <ActionTools
          callBack={callBack}
          reloadCallBack={() =>
            getListCustomer({ ...defaultParams, search: searchTerm })
          }
          handleClickExportExcel={() => setIsExportExcel(true)}
        />
        <Table
          columns={columns}
          onRow={(record: any) => ({
            onClick: () => handleOpen(record.id),
            style: { cursor: "pointer" },
          })}
          dataSource={getData()}
          virtual
          scroll={{ x: 2880 }}
          pagination={{
            pageSize: 30,
            defaultPageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
            total: totalCustomer,
            size: "small",
          }}
          size="small"
          loading={isLoading}
        />
      </Layout.Content>
      {/* <Spin spinning={isLoadingCustomer}> */}
      <CustomerDetail
        loading={isLoadingCustomer}
        data={dataCustomer}
        open={openCustomerDetail}
        onCancel={() => setOpenCustomerDetail(false)}
      />
      {/* </Spin> */}
      <Modal
        title={
          <div>
            <h1 className="text-2xl">Tạo khách hàng</h1>
            <Divider />
          </div>
        }
        open={modalVisiable}
        onCancel={() => {
          setModalVisiable(false);
          setCreateCustomerParams({} as any);
        }}
        footer={renderFooterCreateModal}
      >
        <div className="mt-5">
          <div className="flex">
            <UserOutlined className="mr-5" />
            <Input
              required
              name="name"
              placeholder="Tên khách hàng"
              onChange={(e) => onInputChange("name", e.target.value)}
            />
          </div>
          <Divider />
          <div className="flex">
            <MailOutlined className="mr-5" />
            <Input
              name="email"
              placeholder="Email"
              onChange={(e) => onInputChange("email", e.target.value)}
            />
          </div>
          <Divider />
          <div className="flex">
            <PhoneOutlined className="mr-5" />
            <Input
              name="phone_number"
              placeholder="Số điện thoại"
              onChange={(e) => onInputChange("phone_number", e.target.value)}
            />
          </div>
          <Divider />
          <div className="flex">
            <CalendarOutlined className="mr-5" />
            <DatePicker
              name="date_of_birth"
              className="w-full"
              placeholder="Ngày sinh"
              onChange={(date, dateString) =>
                onInputChange("date_of_birth", dateString as string)
              }
            />
          </div>
          <Divider />
          <div className="flex">
            <ContainerOutlined className="mr-5" />
            <Input
              name="address"
              placeholder="Địa chỉ"
              onChange={(e) => onInputChange("address", e.target.value)}
            />
          </div>
          <Divider />
        </div>
      </Modal>
      {isExportExcel && (
        <CustomerExportExcel
          open={isExportExcel}
          onCancel={() => setIsExportExcel(false)}
        />
      )}
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
