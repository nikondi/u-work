export type Client = {
    id: number,
    name: string,
    address: Address,
    phone?: string,
    email?: string,
    status: string,
    phones?: string[],
}
