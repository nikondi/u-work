import toast from "react-hot-toast";

export function mergeClasses(/**/) {
    const args = arguments;
    const classes = [];
    for(let i = 0; i < args.length; i++) {
        if(typeof args[i] == 'undefined')
            continue;
        let classNames = [];
        if(typeof args[i] == 'string')
            classNames = args[i].split(' ');
        else
            classNames = args[i].split(' ');

        classes.push(...classNames);
    }


    classes.forEach(function(_class, i) {
        if(!_class) {
            classes.slice(i, 1);
            return true;
        }
        for(let j = i; j < classes.length; j++) {
            if(classes[j] === _class) {
                classes.slice(i, 1);
                break;
            }
        }
    });

    return classes.join(' ');
}

export function untranslit(str) {
    const converter = {
        'o': 'щ',
        '``': 'ё', ';': 'ж', 'x': 'ч', 'i': 'ш', '.': 'ю', 'z': 'я',
        'f': 'а', ',': 'б', 'd': 'в', 'u': 'l', 'l': 'д',
        't': 'е', 'p': 'з', 'b': 'и', 'q': 'й', 'r': 'к',
        'k': 'л', 'v': 'м', 'y': 'н', 'j': 'о', 'g': 'п',
        'h': 'р', 'c': 'с', 'n': 'т', 'e': 'у', 'a': 'ф',
        '[': 'х', 'w': 'ц', ']': 'ъ'
    };

    for(const [key, value] of Object.entries(converter))
        str = str.replaceAll(key, value);

    return str;
}

export function formatDate(date) {
    const day = ('0'+date.getDay()).slice(-2);
    const month = ('0'+date.getMonth()).slice(-2);
    const hours = ('0'+date.getHours()).slice(-2);
    const minutes = ('0'+date.getMinutes()).slice(-2);
    const seconds = ('0'+date.getSeconds()).slice(-2);
    return day+'.'+month+'.'+date.getFullYear()+' '+hours+':'+minutes+':'+seconds
}

export const mysqlDateRegEx = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})/;

export function isMysqlDate(date_str) {
    return mysqlDateRegEx.test(date_str);
}

export function formatMysqlDate(date_str) {
    const date = mysqlDateRegEx.exec(date_str).groups;
    return date.day+'.'+date.month+'.'+date.year+' '+date.hours+':'+date.minutes+':'+date.seconds;
}

export function err(text = 'Произошла ошибка') {
    toast.error(text);
}

export function uniqName(len = 8) {
    let password = "";
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(let i = 0; i < len; i++)
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    return password;
}
