export type Product = {
    id: string;
    name: string;
    description: string;
    note: string;
    product_code: string;
    product_code: string;
    variation: Variation[];
}

export type Variation = {
    id: any
    retail_price: number
    image: string;
    amount: number
    barcode: string
    variation_code: string
    price_at_counter: number
    last_imported_price: number
    updatedAt: Date
    createdAt: Date
    product: Product
    orderAmount
}

export type Order = {
    total_price: number;
    orderitems: OrderItems[];
}

export type OrderItems = {
    quantity: number;
    advance_promotion: number;
    variation_info: Variation;
    variation_id: any;
}

export type Customer = {
    id: any;
    name: string;
    phone_number: string;
    email: string;
    address?: string;
    date_of_birth?: string;
    total_order?: number;
    tota: number;
    lastOrder: string;
    last_purchase: string;
    gender: "MALE" | "FEMALE";
    total_purchase?: number;
}

export type DisplayChart = "year" | "month"

export interface Supplier {
    id?: any;
    supplier_code?: string;
    name: string;
    phone_number?: string;
    address?: string;
    description?: string;
    is_active?: boolean;
}
export interface Debt {
    id?: number,
    name: string,
    purchase_date?: string,
    deal_date?: string,
    money_must_pay: number,
    status: 0 | 1 | -1,
    supplier_id?: number,
    purchase_id?: number,
    description?: string,
    created_at?: string,
    updated_at?: string,
    supplier?: Supplier,
    shop_id?: number
}

export interface Purchase {
    id?: number,
    creator: string,
    supplier: Supplier,
    total_price_product: number,
    shipping_fee: number,
    discount: number,
    total_price: number,
    created_at: string,
    description: string,
    items: PurchaseItem[]
}

export interface PurchaseItem {
    id?: number,
    variation: Variation,
    quantity: number,
    imported_price: number,
}