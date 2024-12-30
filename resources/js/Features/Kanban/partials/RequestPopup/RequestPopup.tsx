import {CloseButton, PopupContent, SidePopup} from "@/Components/SidePopup";
import {router, usePage} from "@inertiajs/react";
import {Editable} from "@/Contexts/EditableContext";
import {TKanbanPageProps} from "../../types";
import RequestForm from "./RequestForm";
import {useEffect} from "react";

export default function RequestPopup() {
  const {request} = usePage<TKanbanPageProps>().props;
  const onClose = () => router.visit(route('kanban.index'), {preserveState: true});

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key == 'Escape' && onClose();
    window.addEventListener('keyup', onEscape);
    return () => window.removeEventListener('keyup', onEscape);
  }, []);

  return <SidePopup>
    <PopupContent>
      <CloseButton onClose={onClose}/>
      <Editable initial={request.id == 0}>
        <RequestForm/>
      </Editable>
    </PopupContent>
  </SidePopup>
}
