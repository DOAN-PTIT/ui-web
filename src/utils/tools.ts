import moment from "moment";
import { Order, OrderItems } from "./type";

export const intCurrencyList = [
  "VND",
  "TWD",
  "LAK",
  "PHP",
  "MMK",
  "JPY",
  "INR",
  "COP",
  "IDR",
  "CLP",
  "PYG",
];
export const currencyPrefixList = ["TWD", "USD", "JPY", "PHP", "IDR", "COP"];
export const dotList = ["USD", "TWD", "JPY", "PHP", "THB", "MYR", "IDR", "INR"];
export const xctCurrencyList = [
  "IDR",
  "KRW",
  "THB",
  "KHR",
  "BDT",
  "KPW",
  "MNT",
]; // Danh sách không hiển thị phần thập phân nếu là 00
export const getFloatChar = (currency: string) =>
  dotList.includes(currency) ? "." : ",";

export const formatInputNumber = (value: any, currency: string) => {
  const floatChar = getFloatChar(currency);
  value = (value || "0").toString();
  if (value.includes(floatChar) && value.indexOf(floatChar) > value.length - 2)
    return value;
  let formatValue = value.replace(/(\.|\,)/g, "");
  if (value.includes(floatChar) && value.indexOf(floatChar) == value.length - 2)
    formatValue += "0";
  if (
    typeof currency !== "undefined" &&
    currency &&
    !intCurrencyList.includes(currency) &&
    !value.includes(floatChar)
  )
    formatValue += "00";
  if (formatValue === "") formatValue = 0;
  formatValue = parseInt(formatValue);
  return formatValue;
};

export const formatNumber = (
  value: any,
  currency: string = "VND",
  prefix = true
) => {
  const floatChar = getFloatChar(currency);
  value = value ? value.toString() : "0";
  if (
    value.includes(floatChar) &&
    !intCurrencyList.includes(currency) &&
    value.indexOf(floatChar) > value.length - 3
  )
    return value;
  const minusChar = parseInt(value) < 0 ? "-" : "";
  let amount: string | number =
    Math.abs(
      parseInt(intCurrencyList.includes(currency) ? Math.round(value) : value)
    ) || 0;
  amount = amount
    ? !intCurrencyList.includes(currency) &&
      typeof currency != "undefined" &&
      currency
      ? `${Math.floor(amount / 100)
          .toString()
          .replace(
            /(\d)(?=(\d{3})+(?!\d))/g,
            `$1${floatChar == "." ? "," : "."}`
          )}${
          Math.abs(amount) % 100
            ? prefix
              ? floatChar +
                (Math.abs(amount) % 100 > 9
                  ? Math.abs(amount) % 100
                  : "0" + (Math.abs(amount) % 100))
              : floatChar +
                ((Math.abs(amount) % 100) % 10
                  ? Math.abs(amount) % 100 > 9
                    ? Math.abs(amount) % 100
                    : "0" + (Math.abs(amount) % 100)
                  : Math.floor((Math.abs(amount) % 100) / 10))
            : prefix && !xctCurrencyList.includes(currency)
            ? `${floatChar}00`
            : ""
        }`
      : amount
          .toString()
          .replace(
            /(\d)(?=(\d{3})+(?!\d))/g,
            `$1${floatChar == "." ? "," : "."}`
          )
    : amount;
  return minusChar + amount;
};

export const convertVN = (
  str: string,
  withoutSpecChar = false,
  ignoreTrim = false
) => {
  str = (str || "").toString().toLowerCase();
  if (!ignoreTrim) str = str.trim();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  if (withoutSpecChar) {
    return str;
  } else {
    return str.replace(/[^a-zA-Z0-9/, ]/g, "");
  }
};

export const getHostName = () => {
  return "http://localhost:8000";
};

export const orderStatus = [
  {
    key: 1,
    value: "Mới",
    color: "blue",
  },
  {
    key: 2,
    value: "Đã xác nhận",
    color: "green",
  },
  {
    key: 3,
    value: "Đang giao hàng",
    color: "orange",
  },
  {
    key: 4,
    value: "Đã giao hàng",
    color: "purple",
  },
  {
    key: 5,
    value: "Đã hủy",
    color: "red",
  },
];

export const calculateTotalPriceProduct = (order: Order) => {
  let totalPrice = 0;
  if (order?.orderitems) {
    order?.orderitems.forEach((item: any) => {
      const variation_info = item.variation_info || item.variation;
      totalPrice += item.quantity * variation_info?.retail_price;
    });
  }

  return totalPrice || 0;
};

export const calcTotalPriceProductAfterDiscount = (order: Order) => {
  let totalPrice = 0;
  if (order?.orderitems) {
    order?.orderitems.forEach((item: any) => {
      const variation_info = item.variation_info || item.variation;
      const discount = calcPromotionProduct(variation_info, item.quantity);
      totalPrice += item.quantity * variation_info?.retail_price - discount;
    });
  }

  return totalPrice || 0;
};

export const calcOrderDebt = (order: any) => {
  let totalPriceOrder = calcTotalOrderPrice(order);
  return totalPriceOrder - (order.total_discount || 0);
};

export const calcTotalDiscountProduct = (order: Order) => {
  let totalDiscount = 0;
  if (order?.orderitems) {
    order?.orderitems.forEach((item: any) => {
      const variation_info = item.variation_info || item.variation;
      totalDiscount += calcPromotionProduct(variation_info, item.quantity);
    });
  }

  return totalDiscount || 0;
};

export const calcTotalDiscountOrder = (orderParams: any) => {
  const promotion = orderParams?.promotion;

  let discountValueWithMax = 0;
  const promotionOrderRange = promotion?.order_range;
  if (promotionOrderRange) {
    const discount = promotionOrderRange?.discount;
    const isDiscountPercent = promotionOrderRange?.is_discount_percent;
    const maxDiscount = promotionOrderRange?.max_discount;
    const totalOrder = calcTotalOrderPrice(orderParams);
    const discountValue = isDiscountPercent
      ? (totalOrder * discount) / 100
      : discount;
    discountValueWithMax = Math.min(discountValue, maxDiscount);
  }

  return discountValueWithMax + calcTotalDiscountProduct(orderParams);
};

export const calcPromotionProduct = (variation: any, quantity = 1) => {
  const promotionItem = variation?.promotion_item;
  let discountPromotion = 0;

  if (promotionItem) {
    const isDiscountPercent = promotionItem?.is_discount_percent;
    const discount = promotionItem?.discount;
    const maxDiscount = promotionItem?.max_discount;
    const totalOrder = variation?.retail_price * (variation?.orderAmount || 1);
    const discountValue = isDiscountPercent
      ? (totalOrder * discount) / 100
      : discount;
    discountPromotion = Math.min(discountValue, maxDiscount);
  }

  return discountPromotion * quantity;
};

export const calcTotalOrderPrice = (order: any) => {
  let total_price = 0;
  if (order) {
    total_price =
      calculateTotalPriceProduct(order) +
      (order.delivery_cost_shop || 0) +
      (order.surcharge || 0) -
      (order.paid || 0);
  }
  console.log(total_price);
  return total_price;
};

export const fuzzySearch = (pattern: string, string: string) =>
  fuzzyMatch(pattern, string) !== null;

export const fuzzyMatch = (
  pattern: string,
  string: string,
  options = {} as any
) => {
  const notConvert = options.notConvert;
  pattern = pattern || "";
  string = string || "";
  if (!notConvert) {
    pattern = convertVN(pattern);
    string = convertVN(string);
  }
  const opts: any = {};
  let patternIdx = 0,
    result = [],
    len = string.length,
    totalScore = 0,
    currScore = 0,
    // prefix
    pre = opts.pre || "",
    // suffix
    post = opts.post || "",
    // String to compare against. This might be a lowercase version of the
    // raw string
    compareString = (opts.caseSensitive && string) || string.toLowerCase(),
    ch;

  pattern = (opts.caseSensitive && pattern) || pattern.toLowerCase();

  // For each character in the string, either add it to the result
  // or wrap in template if it's the next string in the pattern
  for (let idx = 0; idx < len; idx++) {
    ch = string[idx];
    if (compareString[idx] === pattern[patternIdx]) {
      ch = pre + ch + post;
      patternIdx += 1;

      // consecutive characters should increase the score more than linearly
      currScore += 1 + currScore;
    } else {
      currScore = 0;
    }
    totalScore += currScore;
    result[result.length] = ch;
  }

  // return rendered string if we have a match for every char
  if (patternIdx === pattern.length) {
    // if the string is an exact match with pattern, totalScore should be maxed
    totalScore = compareString === pattern ? Infinity : totalScore;
    return { rendered: result.join(""), score: totalScore };
  }

  return null;
};

export const checkRole = (role: string) => {
  if (role === "owner") {
    return "Chủ";
  }
  if (role === "admin") {
    return "Quản lý";
  }
  if (role === "employee") {
    return "Nhân viên";
  }
};
export const getPromotionType = {
  1: {
    label: "Khuyến mãi chung",
    color: "orange",
  },
  2: {
    label: "Khuyến mãi theo mã đơn hàng",
    color: "blue",
  },
};

export const getPromotionStatus = {
  1: {
    label: "Đang diễn ra",
    color: "green",
  },
  0: {
    label: "Đã kết thúc",
    color: "red",
  },
};
