export type Role = 'admin' | 'manager' | 'tomoru' | 'worker';

export type user = {
    id: number | null,
    login: string,
    name: string,
    email: string,
    roles: Role[],
    roleLabels: string[],
}

export type LoginedUser = user & { hasRole: (...roles:Role[]) => boolean, } | false;
