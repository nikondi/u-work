import {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {FormHandler} from "@/Components/Form";
import {usePage} from "@inertiajs/react";
import toast from "react-hot-toast";
import {FormPageProps} from "@/Features/Users/types";
import {UserForm} from "@/Features/Users/partials";

const Edit = () => {
  const {user} = usePage<FormPageProps>().props;
  const onSubmit: FormHandler = (form) => {
    form.put(route('users.update', [user.id]), {
      onSuccess: () => toast.success('Пользователь сохранён')
    })
  };

  return <UserForm onSubmit={onSubmit}/>
}

Edit.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default Edit;
