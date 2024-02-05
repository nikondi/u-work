import {Address} from "@/features/addresses";

export type Client = {
    id: number,
    name: string,
    address: Address,
    floor: number | string,
    apartment: number | string,
    comment: string,
    phone?: string,
    email?: string,
    status: string,
    phones?: string[],
}
