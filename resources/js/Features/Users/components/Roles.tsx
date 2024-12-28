import {Row, useFormContext} from "@/Components/Form";
import React from "react";
import {Role, RoleLabel} from "@/types/auth";
import {IUserForm} from "@/Features/Users/types";

const userRoles: Record<Role, RoleLabel> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  worker: 'Рабочий',
  tomoru: 'Tomoru',
}

export default function Roles() {
  const {data, setData} = useFormContext<IUserForm>();

  const toggleRole = (role: Role) => {
      setData('roles', data.roles.includes(role)
        ? data.roles.filter((r) => r !== role)
        : [...data.roles, role]);
  }

  return <Row className="mb-6">
    {Object.entries(userRoles).map(([key, role]) =>
      <label className="block mb-1 py-1 cursor-pointer" key={key}>
        <input type="checkbox" name="role" value={role} onChange={() => toggleRole(key as Role)}
               checked={data.roles.includes(key as Role)} required={data.roles.length === 0}/> {role}
      </label>
    )}
  </Row>
}
