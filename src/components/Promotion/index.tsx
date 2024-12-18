import { Layout, notification, Table, Tag } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import "../../styles/global.css";
import { useEffect, useState } from "react";
import PromotionDetail from "../PromotionDetail";
import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";
import apiClient from "@/service/auth";
import moment from "moment";
import { getPromotionStatus, getPromotionType } from "@/utils/tools";

const { Content } = Layout;
const defaultParams = {
  page: 1,
  page_size: 30,
};

interface PromitionProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Promition(props: PromitionProps) {
  const { currentShop } = props;

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotionList, setPromotionList] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number>(0);

  useEffect(() => {
    getListPromotions();
  }, [currentShop.id]);

  const getListPromotions = async () => {
    setIsLoading(true);
    try {
      const url = `/shop/${currentShop.id}/promotions`;
      return await apiClient
        .get(url, { params: defaultParams })
        .then((res) => {
          setIsLoading(false);
          setPromotionList(res.data.data);
          setTotalPage(res.data.totalEntries);
        })
        .catch((error) => {
          setIsLoading(false);
          const message = error?.response?.data?.message || "Lỗi không xác định";
          notification.error({
            message: "Lỗi",
            description: message,
          });
        });
    } catch (error) {}
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_: any, __: any, index: number) => {
        return <span className="text-blue-500 font-medium">{index + 1}</span>;
      }
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kiểu khuyến mãi",
      dataIndex: "type_promotion",
      key: "type_promotion",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  const getData = () => {
    return promotionList.length > 0 ? promotionList.map((item) => {
      const promotionType = getPromotionType[item.type as keyof typeof getPromotionType];
      let checkStatus = item.status;
      //check status with due_date(with hour and minutes). if promotion is expired, status will be 0
      if (moment().isAfter(item.due_date)) {
        checkStatus = 0;
      }
      const promotionStatus = getPromotionStatus[checkStatus as keyof typeof getPromotionStatus];
      return {
        key: item.id,
        id: item.id,
        name: item.name,
        type_promotion: <Tag color={promotionType?.color} className={`text-${promotionType.color}-500`}>{promotionType.label}</Tag>,
        start_date: moment(item.start_date).format("HH:mm DD/MM/YYYY"),
        end_date: moment(item.due_date).format("HH:mm DD/MM/YYYY"),
        status: <Tag color={promotionStatus?.color} className={`text-${promotionStatus.color}-500`}>{promotionStatus.label}</Tag>,
      };
    }) : [];
  }

  const handleRowClick = (record: any) => {
    setOpen(true);
    setSelectedRowKeys(record.id)
  }

  return (
    <Layout className="h-screen">
      <HeaderAction
        title="Khuyến Mãi"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm khuyễn mãi theo id, tên"
      />
      <Content className="content bg-gray-200 rounded-tl-xl p-5 order__table__container">
        <ActionTools
          callBack={() => setOpen(true)}
          reloadCallBack={getListPromotions}
        />
        <Table
          dataSource={getData()}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 30,
            total: totalPage,
            current: defaultParams.page,
            defaultCurrent: 1,
            size: "small",
          }}
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            };
          }}
        />
        {open && <PromotionDetail open={open} setOpen={setOpen} selectedRowKey={selectedRowKeys} />}
      </Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(Promition);
