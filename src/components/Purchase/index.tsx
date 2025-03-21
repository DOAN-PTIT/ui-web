import { AppDispatch, RootState } from "@/store";
import { ConfigProvider, Layout, notification, Select, Table } from "antd";
import type { TableProps } from "antd";
import { connect } from "react-redux";
import HeaderAction from "../HeaderAction/HeaderAction";
import { useEffect, useState } from "react";
import "../../styles/global.css";
import apiClient from "@/service/auth";
import ActionTools from "../ActionTools/ActionTools";
import DebtDetail from "../DebtDetail";
import PurchaseDetail from "../PurchaseDetail";
import moment from "moment";
import Avatar from "react-avatar";
import { autoAddZero, formatNumber, purchaseStatus } from "@/utils/tools";
import CustomSelect from "@/container/CustomSelect";
import { updatePurchase } from "@/action/purchase.action";

const { Content } = Layout;
const defaultParams = {
  page: 1,
  page_size: 30,
};

interface PurchaseProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Purchase(props: PurchaseProps) {
  const { updatePurchase } = props;
  const [modalVisiable, setModalVisiable] = useState(false);
  const [title, setTitle] = useState("Tạo phiếu nhập hàng");
  const [purchases, setPurchases] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getListPurchases();
  }, []);

  const columns: TableProps<any>["columns"] = [
    {
      title: "Mã phiếu nhập",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => {
        return <span className="font-medium">{autoAddZero(id, 0)}</span>;
      }
    },
    {
      title: "Người tạo",
      key: "creator",
      dataIndex: "creator",
      render: (shopUser) => {
        return (
          <div>
            <Avatar name={shopUser?.user?.name} size="30" round={true} />
            <span className="ml-2">{shopUser?.user?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Nhà cung cấp",
      key: "supplier",
      dataIndex: "supplier",
    },
    {
      title: "Tiền hàng",
      key: "total_price_product",
      dataIndex: "total_price_product",
      render: (total_price_product) => {
        return <span className="font-medium">{formatNumber(total_price_product)} đ</span>;
      }
    },
    {
      title: "Phí vận chuyển",
      key: "shipping_fee",
      dataIndex: "shipping_fee",
      render: (shipping_fee) => {
        return <span className="font-medium">{formatNumber(shipping_fee)} đ</span>;
      }
    },
    {
      title: "Chiết khấu",
      key: "discount",
      dataIndex: "discount",
      render: (discount) => {
        return <span className="font-medium">{formatNumber(discount)} đ</span>;
      }
    },
    {
      title: "Tổng tiền",
      key: "total_price",
      dataIndex: "total_price",
      render: (total_price) => {
        return <span className="font-medium">{formatNumber(total_price)} đ</span>;
      }
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
    },
  ];

  columns.push({
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
    fixed: "right",
    align: "center",
    render: (status: number, record: any) => {
      return (
        <CustomSelect
          data={Object.values(purchaseStatus)}
          currentStatus={status.toString()}
          handleSelect={handleUpdatePurchaseStatus}
          handleClick={(e) => {
            e.stopPropagation();
            setSelectedPurchase(record.key);
            setModalVisiable(false);
          }}
        />
      );
    },
  });

  const getListPurchases = async (params = {} as any) => {
    setLoading(true);
    try {
      const url = `/shop/${props.currentShop.id}/purchases`;
      return await apiClient
        .get(url, { params: { ...defaultParams, ...params } })
        .then((res) => {
          if (res.data) {
            setPurchases(res.data.data);
            setTotalPage(res.data.total_entries);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePurchaseStatus = async (status: number, prevStatus: any) => {
    if ((parseInt(prevStatus) == 1 && status == 0) || parseInt(prevStatus) == -1) {
      notification.warning({
        message: "Cập nhật trạng thái phiếu nhập thất bại",
        description: "Phiếu nhập đã được xử lý hoặc hủy",
      })

      return;
    }
    setLoading(true);
    await updatePurchase({
      id: selectedPurchase,
      data: {
        status: status,
      },
      shop_id: props.currentShop.id,
    })
      .then((res) => {
        if (res.payload) {
          setLoading(false);
          setSelectedPurchase(null);
          notification.success({
            message: "Thành công",
            description: "Cập nhật trạng thái thành công",
          });
          getListPurchases();
        }
      })
      .catch((err) => {
        setLoading(false);
        setSelectedPurchase(null);
        console.log(err);
        notification.error({
          message: "Thất bại",
          description: "Cập nhật trạng thái thất bại",
        });
      });
  };

  const getData = () => {
    return purchases.length > 0
      ? purchases.map((item: any) => {
          return {
            id: item.id,
            key: item.id,
            creator: item.shop_user,
            supplier: item?.supplier?.name,
            total_price_product: item.product_fee,
            shipping_fee: item.shipping_fee,
            discount: item.discount,
            total_price: item.total_price,
            created_at: moment(item.created_at).format("DD/MM/YYYY"),
            description: item.description,
            status: item.status,
          };
        })
      : [];
  };

  return (
    <Layout>
      <HeaderAction
        title="Nhập hàng"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm công nợ theo têh, loại công nợ, nhà cung cấp,.."
      />
      <Content className="p-5 h-screen bg-gray-200 rounded-tl-xl order__table__container">
        <ActionTools
          callBack={() => setModalVisiable(true)}
          reloadCallBack={getListPurchases}
        />
        <Table
          columns={columns}
          dataSource={getData()}
          pagination={{
            size: "small",
            current: currentPage,
            total: totalPage,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              getListPurchases({ page: page });
            },
          }}
          scroll={{ y: 500, x: 2000 }}
          loading={loading}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setModalVisiable(true);
                setTitle(`Chi tiết phiếu nhập hàng #${record.id}`);
                setSelectedPurchase(record.key);
              },
              style: { cursor: "pointer" },
            };
          }}
        />
        {modalVisiable && (
          <PurchaseDetail
            open={true}
            setOpen={setModalVisiable}
            title={title}
            purchaseId={selectedPurchase}
            setPurchaseId={setSelectedPurchase}
            fetchPurchases={getListPurchases}
          />
        )}
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
  return {
    updatePurchase: (data: any) => dispatch(updatePurchase(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
