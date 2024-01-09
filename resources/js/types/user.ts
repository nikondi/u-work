type user = | {
    id: number,
    login: string,
    name: string,
    email: string,
    roles: string[],
    roleLabels: string[],
} | {
    id: null,
    login: string,
    name: string,
    email: string,
    roles: string[],
    roleLabels: string[],
}
