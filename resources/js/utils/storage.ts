const storage = {
    getToken: () => {
        return window.localStorage.getItem('ACCESS_TOKEN') as string;
    },
    setToken: (token: string) => {
        window.localStorage.setItem('ACCESS_TOKEN', token);
    },
    clearToken: () => {
        window.localStorage.removeItem('ACCESS_TOKEN');
    },
};

export default storage;
