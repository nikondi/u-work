import {useEffect, useRef, useState} from "react";
import SocketApi from "../API/SocketApi.js";
import toast from "react-hot-toast";

export const useSocket = (URL = 'http://127.0.0.1:8000', options = {}) => {
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const loadingToast = useRef('0');

    const default_options = {
        showLoading: false,
        onConnect() {
            toast.success(`Вебсокет "${this.options.name}" подключен`, {
                duration: 3000
            });
        },
        onDisconnect() {
            toast.error(`Вебсокет "${this.options.name}" отключился`, {
                duration: 3000
            });
        },
        onMessage(message) {}
    };

    options = {...default_options, ...options};

    useEffect(() => {
        if(loading)
            loadingToast.current = toast.loading(`Подключение к вебсокету "${options.name?options.name:URL}"`);
        else
            toast.dismiss(loadingToast.current);
    }, [loading]);

    const connectSocket = () => {
        setSocket(new SocketApi(URL, options).init());
    }

    useEffect(() => {
        connectSocket();
        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if(!socket)
            return;

        socket.onMessage = options.onMessage;
        socket.onDisconnect = options.onDisconnect;
        socket.onConnect = function(...args) { setLoading(false); options.onConnect.apply(this, [...args])};
    }, [socket]);

    return socket;
}
