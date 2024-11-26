import toast from "react-hot-toast";

const withReAuth =
    (fn: (...args) => Promise<Response>) =>
        async (...args) => {
            try {
                const res = await fn(...args);
                if (res.status == 200) {
                    return res.json().then((data) => {
                        if (data.code == 200) {
                            if (data.token) {
                                localStorage.setItem("token", data.token);
                            }
                            return data;
                        } else {
                            localStorage.removeItem("token");
                            throw new Error(data.msg);
                        }
                    });
                } else {
                    throw new Error("网络请求失败");
                }
            } catch (error) {
                toast.error(error.message);
                if (localStorage.getItem("token")) {
                    localStorage.removeItem("token");
                }
            }
        };

function getCaptchaImage() {
    return fetch("https://zycdsj.com/prod-api/captchaImage", {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            istoken: "false",
            "sec-ch-ua": '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            usertype: "sysUser",
        },
        referrer: "https://zycdsj.com/symanage/login?redirect=%2Findex",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
    });
}

function updateArticleContent(token: string | null, article: any) {
    return fetch("https://zycdsj.com/prod-api/cms/article", {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            authorization: token!,
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            pragma: "no-cache",
            "sec-ch-ua": '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            usertype: "sysUser",
        },
        referrer: "https://zycdsj.com/symanage/cms/article",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(article),
        method: "PUT",
        mode: "cors",
        credentials: "include",
    });
}

function getArticleList(token: string) {
    return fetch(
        "https://zycdsj.com/prod-api/cms/article/list?pageNum=1&pageSize=1000&TimeFrame=",
        {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                authorization: token,
                "cache-control": "no-cache",
                pragma: "no-cache",
                "sec-ch-ua":
                    '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                usertype: "sysUser",
            },
            referrer: "https://zycdsj.com/symanage/cms/article",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include",
        }
    )
}

function login(
    username: string,
    password: string,
    uuid: string,
    captcha: string
) {
    return fetch("https://zycdsj.com/prod-api/login", {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
            istoken: "false",
            "sec-ch-ua":
                '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            usertype: "sysUser",
        },
        referrer: "https://zycdsj.com/symanage/login?redirect=%2Findex",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `{\"username\":\"${username}\",\"password\":\"${password}\",\"code\":\"${captcha}\",\"uuid\":\"${uuid}\"}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
    })
        .then((res) => {
            if (res.status == 200) {
                return new Promise((resolve, reject) => {
                    res.json().then((data) => {
                        console.log(data);
                        if (data.code == 200) {
                            localStorage.setItem("token", data.token);
                            toast.success("登录成功");
                            resolve(data.token);
                        } else {
                            reject(data.msg);
                        }
                    });
                });
            } else {
                throw new Error("网络请求失败");
            }
        })
        .catch((e) => {
            toast.error(e.message);
        });
}
export const HerbalApiService = {
    getCaptchaImage,
    updateArticleContent,
    getArticleList: withReAuth(getArticleList),
    login
}


