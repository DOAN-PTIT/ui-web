export type Product = {
    id: string;
    name: string;
    description: string;
    note: string;
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