import {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {UserForm} from "@/Pages/Users/partials";
import {FormHandler} from "@/Components/Form";
import {usePage} from "@inertiajs/react";
import {FormPageProps} from "./types";
import toast from "react-hot-toast";

const Edit = () => {
  const {user} = usePage<FormPageProps>().props;
  const onSubmit: FormHandler = (_e, form) => {
    form.put(route('users.update', [user.id]), {
      onSuccess: () => toast.success('Пользователь сохранён')
    })
  };

  return <UserForm onSubmit={onSubmit}/>
}

Edit.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default Edit;
