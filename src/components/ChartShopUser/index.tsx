import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { formatNumber } from "@/utils/tools";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

interface ChartShopUserProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const ChartShopUser = (props: ChartShopUserProps) => {
  const { currentShop } = props;

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "shopuser_name",
      key: "shopuser_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      const url = `shop/${currentShop.id}/employee-stats`;
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
    return dataSource.length > 0 ? dataSource.map((user: any) => {
        return {
            key: user.id,
            shopuser_name: user.name,
            email: user.email,
            total_revenue: `${formatNumber(user.total_revenue)} đ`,
            total_orders: user.total_orders,
        }
    }) : []
  }

  return (
    <div className="w-1/2">
      <Table
        columns={columns}
        dataSource={getDataSource()}
        loading={loading}
        pagination={false}
        title={() => <div className="font-bold text-[18px]">Nhân viên</div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartShopUser);
