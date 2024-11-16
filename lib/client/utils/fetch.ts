import { toast } from "react-hot-toast";

export const fetchWithAuth: typeof fetch = (input, init) => {
    const authFromLocalStorage = localStorage.getItem("AUTH")
    if (authFromLocalStorage)
        init = Object.assign(init || {}, {
            headers: {
                ...(init?.headers || {}),
                Authorization: authFromLocalStorage,
            },
        });
    return fetch(input, init).then(async (e) => {
        if (e.status == 200 && init?.headers?.Authorization) {
            localStorage.setItem("AUTH", init.headers.Authorization);
            return e
        }
        if (e.status == 401) {
            localStorage.removeItem("AUTH");
            toast("请先登录", { icon: '🪪' });
            const username = prompt("请输入用户名");
            const password = prompt("请输入密码");
            if (!username || !password) {
                throw new Error("放弃登录");
            }
            const credentials = btoa(username + ":" + password);

            return fetchWithAuth(input, {
                ...(init || {}),
                headers: {
                    ...(init?.headers || {}),
                    Authorization: "Basic " + credentials,
                },
            });
        }
        return e;
    });
};
