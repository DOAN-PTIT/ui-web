import apiClient from "@/service/auth";
import { RootState, AppDispatch } from "@/store";
import { formatNumber } from "@/utils/tools";
import { Table, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { connect } from "react-redux";

interface ChartProductProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const ChartProduct = (props: ChartProductProps) => {
  const { currentShop } = props;

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
        title: "STT",
        dataIndex: "STT",
        key: "stt",
      render: (_: any, __: any, index: number) => {
        return <span className="text-blue-500 font-medium">{index + 1}</span>;
      }

    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "15%",
      render: (text: string) => {
        return <Tooltip title={text}>
          <div className="truncate w-[150px]">{text}</div>
        </Tooltip>
      }
    },
    {
      title: "Doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
    },
    {
      title: "Đơn chốt",
      dataIndex: "total_orders",
      key: "total_orders",
    },
  ];

  const getData = async () => {
    setLoading(true);
    try {
      const url = `shop/${currentShop.id}/product-stats`;
      return await apiClient
        .get(url)
        .then((res) => {
          setDataSource(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getDataSource = () => {
    return dataSource.length > 0
      ? dataSource.map((product: any) => {
          return {
            key: product.product_id,
            product: product.product_name,
            total_revenue: `${formatNumber(product.total_revenue)} đ`,
            total_orders: product.total_orders,
          };
        })
      : [];
  };

  return (
    <div className="w-1/2">
      <Table
        columns={columns}
        dataSource={getDataSource()}
        loading={loading}
        pagination={false}
        title={() => <div className="font-bold text-[18px]">Sản Phẩm</div>}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartProduct);
