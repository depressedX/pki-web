import axios from 'axios'
import {ContractItem} from "./views/Home/components/Contract/ContractItem";

export const WS_AUTH_URL = 'ws://192.168.137.1:8082/hi/auth'
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
    } else {
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
    async getAuthorizationCodeStatus(code) {
        return {
            success: false
        }
    },
    logout() {
        return http.post('/logout')
    }
}

export const contract = {
    async getList() {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })

        // return http.get('auth_code')
        // return []
        return [
            {
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                },
                lastModified: Date.now()
            },
            {
                type: ContractItem.status.STATUS_OTHER_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.txt',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                },
                lastModified: Date.now()
            },
            {
                type: ContractItem.status.STATUS_ALL_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                },
                lastModified: Date.now()
            },
            {
                type: ContractItem.status.STATUS_OTHER_TO_BE_SIGNED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.doc',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                },
                lastModified: Date.now()
            },
            {
                type: ContractItem.status.STATUS_ALL_SIGNED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                },
                lastModified: Date.now()
            },
        ]
    },

    async accept(id) {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })
        return true
    },
    async create(form) {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })
        return true
    },


    async decline(id) {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })
        return true
    }


}

export async function getUserInfo(uid) {
    // return http.get('/userInfo')

    await new Promise(resolve => {
        setTimeout(() => resolve(), Math.random() * 1000)
    })
    return {
        username: Math.random() < .5 ? '李铁蛋' : '刘德华'
    }
}


export async function getLogList() {
    // return http.get('/userInfo')

    await new Promise(resolve => {
        setTimeout(() => resolve(), Math.random() * 1000)
    })
    // return []
    return [
        {
            timestamp:Date.now(),
            deviceId:'SDFSDXV-345',
            deviceName:'iPhoneX',
            deviceType:'mobile'
        },
        {
            timestamp:Date.now(),
            deviceId:'KNIDFD-345',
            deviceName:'Lenovo T7',
            deviceType:'desktop'
        },
        {
            timestamp:Date.now(),
            deviceId:'SDFSDXV-345',
            deviceName:'iPhoneX',
            deviceType:'mobile'
        },
    ]
}


export async function getDeviceList() {
    // return http.get('/userInfo')

    await new Promise(resolve => {
        setTimeout(() => resolve(), Math.random() * 1000)
    })
    // return []
    return [
        {
            deviceId:'SDFSDXV-345',
            deviceName:'iPhoneX',
            deviceType:'mobile'
        },
        {
            deviceId:'KNIDFD-345',
            deviceName:'Lenovo T7',
            deviceType:'desktop'
        },
        {
            deviceId:'SDFSDXV-345',
            deviceName:'iPhoneX',
            deviceType:'mobile'
        },
    ]
}

