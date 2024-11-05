type Props = {
  text?: string
  success: boolean
}

export default function FormSuccess({text = 'Форма успешно отправлена', success}: Props) {
  return success && <div className="contacts-form__column w-full">
    <div className="mt-4 px-4 py-2 rounded-md bg-green-600 w-full text-white">
      {text}
    </div>
  </div>
}
