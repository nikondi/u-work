import {PageProps, ResourceCollection} from "@/types";
import {IUser, Role} from "@/types/auth";

export type IndexPageProps = PageProps<{
  users: ResourceCollection<IUser>
}>
export type FormPageProps = PageProps<{
  user: IUser
}>

export type IUserForm = {
  name: string
  login: string
  email: string
  password: string
  password_confirmation: string
  roles: Role[]
}
