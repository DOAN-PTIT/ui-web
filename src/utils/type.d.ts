export type Product = {
    id: string;
    name: string;
    description: string;
    note: string;
    product_code: string;
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