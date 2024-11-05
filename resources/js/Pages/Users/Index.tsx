import React, {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {IndexPageProps} from "./types";
import {Link} from "@inertiajs/react";

const Index = ({users}: IndexPageProps) => {
  return <>
    <Link href={route('users.create')} className="btn btn-primary px-3 py-2">Добавить</Link>

    <table className="w-full text-left mt-5">
      <thead>
      <tr className="text-gray-400">
        <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">ID</th>
        <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Имя</th>
        {/*<th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">Description</th>*/}
        <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Логин</th>
        <th
          className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400 text-white">Почта
        </th>
        <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400 text-white">Роли</th>
        <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400 text-white"></th>
      </tr>
      </thead>
      <tbody className="text-gray-600 dark:text-gray-100">
      {users.data.map(user => (
        <tr key={user.id} className="tbl-row">
          <td className="tbl-column">{user.id}</td>
          <td className="tbl-column">{user.name}</td>
          <td className="tbl-column">{user.login}</td>
          <td className="tbl-column">{user.email}</td>
          <td className="tbl-column">{user.roleLabels.join(', ')}</td>
          <td className="tbl-column">
            <div className="flex gap-x-4 justify-end">
              <Link href={route('users.edit', [user.id])}>
                <svg height="20" viewBox="0 0 401.523 401"><path d="M370.59 250.973c-5.524 0-10 4.476-10 10v88.789c-.02 16.562-13.438 29.984-30 30H50c-16.563-.016-29.98-13.438-30-30V89.172c.02-16.559 13.438-29.98 30-30h88.79c5.523 0 10-4.477 10-10 0-5.52-4.477-10-10-10H50c-27.602.031-49.969 22.398-50 50v260.594c.031 27.601 22.398 49.968 50 50h280.59c27.601-.032 49.969-22.399 50-50v-88.793c0-5.524-4.477-10-10-10zm0 0" fill="currentColor"></path><path d="M376.629 13.441c-17.574-17.574-46.067-17.574-63.64 0L134.581 191.848a9.997 9.997 0 0 0-2.566 4.402l-23.461 84.7a9.997 9.997 0 0 0 12.304 12.308l84.7-23.465a9.997 9.997 0 0 0 4.402-2.566l178.402-178.41c17.547-17.587 17.547-46.055 0-63.641zM156.37 198.348 302.383 52.332l47.09 47.09-146.016 146.016zm-9.406 18.875 37.62 37.625-52.038 14.418zM374.223 74.676 363.617 85.28l-47.094-47.094 10.61-10.605c9.762-9.762 25.59-9.762 35.351 0l11.739 11.734c9.746 9.774 9.746 25.59 0 35.36zm0 0" fill="currentColor"></path></svg>
              </Link>
              <Link href={route('users.destroy', [user.id])} method="delete" onClick={(e) => !confirm('Точно удалить?') && e.preventDefault()}>
                <svg height="20" viewBox="0 0 512 512"><path d="M288.2,256.4l137.1-137.1c8.9-8.9,8.9-23.3,0-32.2c-8.9-8.9-23.3-8.9-32.2,0L256,224.2L118.9,87.1c-8.9-8.9-23.3-8.9-32.2,0c-8.9,8.9-8.9,23.3,0,32.2l137.1,137.1L86.7,393.5c-8.9,8.9-8.9,23.3,0,32.2c4.3,4.3,10.1,6.7,16.1,6.7c5.8,0,11.7-2.2,16.1-6.7L256,288.7l137.1,137.1c4.3,4.3,10.1,6.7,16.1,6.7c5.8,0,11.7-2.2,16.1-6.7c8.9-8.9,8.9-23.3,0-32.2L288.2,256.4z" fill="currentColor"/></svg>
              </Link>
            </div>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  </>
}

Index.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default Index;
