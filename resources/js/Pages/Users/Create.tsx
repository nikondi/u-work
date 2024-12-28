import {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {FormHandler} from "@/Components/Form";
import toast from "react-hot-toast";
import {UserForm} from "@/Features/Users/partials";

const Create = () => {
  const onSubmit: FormHandler = (form) => {
    form.post(route('users.store'), {
      onSuccess: () => toast.success('Пользователь добавлен')
    })
  };

  return <UserForm onSubmit={onSubmit}/>

}

Create.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default Create;
