export type Role = 'admin' | 'manager' | 'tomoru' | 'worker';
export type RoleLabel = 'Администратор' | 'Менеджер' | 'Tomoru' | 'Рабочий';

export type IUser = {
  id: number
  login: string
  name: string
  email: string
  roles: Role[]
  roleLabels: RoleLabel[]
}
