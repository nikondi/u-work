import {IUser, Role} from "@/types/auth";

export type TAuthContext = {
  user: IUser
  logout: () => void
  hasRole: (roles: Role|Role[]) => boolean
}
