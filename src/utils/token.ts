//utils/token.ts

const TOKEN_KEY = 'Apick_Token';
const ISLOGIN_KEY = 'Apick_IsLogin';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const setIsLogin = (need: boolean) => {
    localStorage.setItem(ISLOGIN_KEY, need.toString());
};

export const getIsLogin = () => {
    return localStorage.getItem(ISLOGIN_KEY) === 'true';
};
    