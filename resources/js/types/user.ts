type Role = 'admin' | 'manager' | 'tomoru' | 'worker';

type user = {
    id: number | null,
    login: string,
    name: string,
    email: string,
    roles: Role[],
    roleLabels: string[],
}
