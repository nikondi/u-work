import toast from "react-hot-toast";

export function mergeClass(...args: (string | string[] | {[k: string]: boolean|null})[]) {
  const className: string[] = [];
  args.forEach((cl) => {
    if(!cl)
      return true;
    if(Array.isArray(cl))
      className.push(...cl);
    else if(typeof cl == 'object')
      Object.entries(cl).forEach(([key, expression]) => expression && className.push(key))
    else if(typeof cl == 'string')
      className.push(cl);
  });

  return className.join(' ');
}

export function untranslit(str: string) {
  const converter = {
    'o': 'щ',
    '``': 'ё', ';': 'ж', 'x': 'ч', 'i': 'ш', '.': 'ю', 'z': 'я',
    'f': 'а', ',': 'б', 'd': 'в', 'u': 'l', 'l': 'д',
    't': 'е', 'p': 'з', 'b': 'и', 'q': 'й', 'r': 'к',
    'k': 'л', 'v': 'м', 'y': 'н', 'j': 'о', 'g': 'п',
    'h': 'р', 'c': 'с', 'n': 'т', 'e': 'у', 'a': 'ф',
    '[': 'х', 'w': 'ц', ']': 'ъ'
  };

  for (const [key, value] of Object.entries(converter))
    str = str.replaceAll(key, value);

  return str;
}

export function formatDate(date: Date) {
  const day = ('0' + date.getDay()).slice(-2);
  const month = ('0' + date.getMonth()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return day + '.' + month + '.' + date.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds
}

export function err(text: any = 'Произошла ошибка', duration = 1000) {
  let show = true;
  if(text.code == 'ERR_CANCELED') {
    if(text.config?.signal?.reason != '_abort')
      text = `Запрос ${text.config.url} отменён причина: ${text.config.signal.reason}`;
    else
      show = false;
  }
  else if(text.response?.data?.message)
    text = text.response.data.message;
  else if(text.message)
    text = text.message;

  if(show)
    toast.error(text, {duration});
}

export function uniqName(len = 8) {
  let password = "";
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < len; i++)
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  return password;
}

export function getInputInt(input: string) {
  return parseInt(input.replace(/\D/, '')) || null;
}


export function Base64(file: File) : Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // @ts-ignore
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
