import axios from 'axios'

const http = axios.create({
    baseURL: '/hi/',
    timeout: 2000
})

http.interceptors.request.use(config => {
    let token = authorization.getToken()
    if (!token) return config
    config.params.token = token
    return config
})
// 添加响应拦截器
http.interceptors.response.use(function (response) {

    let body = response.data
    if (body.status === 200) {
        return body.data
    }else {
        let e = new Error(body.message)
        e.status = body.status
        return Promise.reject(e)
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export const authorization = {
    authorizationKey: 'authorizationKey',
    isAuthorized() {
        return Boolean(localStorage.getItem(this.authorizationKey))
    },
    getToken() {
        return localStorage.getItem(this.authorizationKey)
    },
    async getAuthorizationCode() {

        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })

        // return http.get('auth_code')
        return 43543543

    },
    async getAuthorizationCodeStatus(code){
        return {
            success:false
        }
    }
}

export function getUserInfo() {
    return http.get('/userInfo')
}

export function logout() {
    return http.post('/logout')
}
