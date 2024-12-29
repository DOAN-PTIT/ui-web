import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { Button, Divider, Input, Modal } from "antd";
import { cloneDeep, uniq } from "lodash";
import ExcelJS from "exceljs";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import moment from "moment";

interface OrderExportExcelProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  onCancel: () => void;
}

const defaultParams = {
  page: 1,
  page_size: 100,
};

const fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF5F5F5" },
  bgColor: { argb: "FFF5F5F5" },
};

function OrderExportExcel(props: OrderExportExcelProps) {
  const { open, currentShop, onCancel } = props;
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("Đơn hàng");

  let arrRows: any = [];
  let transformedExports: any = [];

  useEffect(() => {
    if (orders.length > 0) {
        handleDownload();
    }
  }, [orders])

  const columns = [
    {
      title: "STT",
      label: "STT",
      disable: false,
      key: "stt",
    },
    {
      title: "Mã đơn hàng",
      label: "Mã đơn hàng",
      disable: false,
      key: "id",
    },
    {
      title: "Sản phẩm",
      label: "Sản phẩm",
      disable: false,
      key: "product",
    },
    {
      title: "Mã sản phẩm",
      label: "Mã sản phẩm",
      disable: false,
      key: "product_id",
    },
    {
      title: "Mã mẫu mã",
      label: "Mã mẫu mã",
      disable: false,
      key: "varation_id",
    },
    {
      title: "Tên khách hàng",
      label: "Tên khách hàng",
      disable: false,
      key: "customer",
    },
    {
      title: "Số điện thoại",
      label: "Số điện thoại",
      disable: false,
      key: "phone",
    },
    {
      title: "Địa chỉ",
      label: "Địa chỉ",
      disable: false,
      key: "address",
    },
    {
      title: "Trạng thái",
      label: "Trạng thái",
      disable: false,
      key: "status",
    },
    {
      title: "Tổng tiền",
      label: "Tổng tiền",
      disable: false,
      key: "totalPrice",
    },
    {
      title: "Ngày tạo",
      label: "Ngày tạo",
      disable: false,
      key: "insertedAt",
    },
    {
      title: "Ngày cập nhật",
      label: "Ngày cập nhật",
      disable: false,
      key: "updatedAt",
    },
    {
      title: "Tổng giảm giá",
      label: "Tổng giảm giá",
      disable: false,
      key: "total_discount",
    },
    {
      title: "Ghi chú",
      label: "Ghi chú",
      disable: false,
      key: "note",
    },
  ];

  const fetchListOrder = async () => {
    const url = `shop/${currentShop.id}/orders`;
    let cloneParams = {
      page_size: 100,
      page: 1,
    };

    let ordersData: any = [];

    const sendRequest: any = async (params: any) => {
      return await apiClient.get(url, { params }).then((res) => {
        if (res.data) {
          let data = res.data.data;
          ordersData = ordersData.concat(data);
          if (data.length == 0 || ordersData.length >= res.data.totalEntries) {
            return ordersData;
          } else {
            params.page += 1;
            return sendRequest(params);
          }
        } else {
          return ordersData;
        }
      });
    };

    setIsLoading(true);
    return await sendRequest(cloneParams)
      .then((res: any) => {
        if (res.length > 0) {
          setOrders(res);
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const handleDownload = () => {
    if (orders.length == 0) {
      fetchListOrder();
    } else {
      let startLine: any;
      setTimeout(async () => {
        transformedExports = [];
        arrRows = [];
        transformExports(orders, 0);

        let writeExcel = async (
          fileName: string,
          header: any,
          content: any
        ) => {
          let wb = new ExcelJS.Workbook();
          let date = new Date();
          wb.modified = date;
          let ws = wb.addWorksheet("Sheet 1");
          ws.columns = header;

          if (Array.isArray(arrRows) && arrRows.length != content.length) {
            arrRows = uniq(arrRows);
          }

          for (let [index, item] of content.entries()) {
            ws.addRow(item);
          }

          const listStartLine = [];
          if (startLine) {
            for (let i = 0; i < startLine; i++) {
              listStartLine.push(2);
            }
          }

          arrRows = listStartLine.concat(arrRows);
          ws.eachRow((row, rowNumber) => {
            const cond = startLine ? rowNumber > startLine : rowNumber > 1;
            if (cond && arrRows[rowNumber - 2] % 2 != 0) {
              ws.getRow(rowNumber).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF5F5F5" },
                bgColor: { argb: "FFF5F5F5" },
              };
            }
          });

          return wb.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
            type: 'application/octet-stream',
            });
            saveAs(blob, `${fileName}.xlsx`);
          });
        };

        let headers = columns.map((field) => {
          const value =
            transformedExports[0] && transformedExports[0][field.label];
          const px = value ? value.toString().length * 1.33 : 20;

          let getWidth = () => {
            if (px > 60) return 60;
            return px >= 30 ? px : 30;
          };

          return {
            header: field.label,
            key: field.key,
            width: field.label == "STT" ? 15 : getWidth(),
          };
        });

        writeExcel(fileName, headers, transformedExports);
      });
    }
  };

  const transformExports = (orders: any, currentIndex: number) => {
    const itemCondition = ["product", "product_id", "varation", "varation_id"];
    const transformedExportArr: any = [];
    const formFields = columns;

    const takeRow = (order: any, exportIndex: number, itemIndex: number) => {
      let transformedExport = {};
      formFields.forEach(({ key, label }) => {
        transformedExport = {
          ...transformedExport,
          [key]: takeValue(key, order, exportIndex, itemIndex),
        };
      });
      if (!itemIndex) order.orderIndex = transformedExportArr.length;
      transformedExportArr.push(transformedExport);
    };

    let arrRow: any = [];
    orders.forEach((order: any, exportIndex: number) => {
      if (order.orderitems.length == 0 || !itemCondition) {
        arrRow.push(exportIndex + currentIndex + 1);
      } else {
        order.orderitems.forEach((o: any) => {
          arrRow.push(exportIndex + currentIndex + 1);
        });
      }

      if (order.orderitems.length && itemCondition) {
        order.orderitems.forEach((item: any, itemIndex: number) => {
          takeRow(order, exportIndex + currentIndex, itemIndex);
        });
      } else takeRow(order, exportIndex + currentIndex, 0);
    });

    transformedExports = transformedExports.concat(transformedExportArr);
    arrRows = arrRows.concat(arrRow);
  };

  const takeValue = (
    key: string,
    order: any,
    exportIndex: number,
    itemIndex: number
  ) => {
    const item = order.orderitems[itemIndex];

    switch (key) {
      case "product":
        return item?.variation.product.name || "";
      case "product_id":
        return item?.variation.product.product_code || "";
      case "varation_id":
        return item?.variation.variation_code || "";
    }

    if (itemIndex == 0) {
      switch (key) {
        case "stt":
          return exportIndex + 1;
        case "id":
          return order.id;
        case "customer":
          return order.customer.name;
        case "phone":
          return order.customer.phone_number || "";
        case "address":
          return order.customer.address || "";
        case "status":
          return order.status;
        case "totalPrice":
          return order.total_cost;
        case "insertedAt":
          return moment(order.createdAt).format("DD/MM/YYYY HH:mm");
        case "updatedAt":
          return moment(order.updatedAt).format("DD/MM/YYYY HH:mm");
        case "total_discount":
          return order.total_discount;
        case "note":
          return order.note;
        default:
          return "";
      }
    }

    return "";
  };

  const renderContent = () => {
    return (
      <div className="mt-4">
        <Divider />
        <div className="flex justify-between items-center">
          <p className="font-[600] w-1/2">Nhập tên file</p>
          <Input
            placeholder="Nhập tên file"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="mt-4 text-right">
          <Button type="primary" onClick={handleDownload}>
            Tải xuống
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={"Xuất Excel đơn hàng"}
      open={open}
      footer={null}
      onCancel={onCancel}
    >
      {renderContent()}
    </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderExportExcel);
