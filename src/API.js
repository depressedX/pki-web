import axios from 'axios'
import {ContractItem} from "./views/Home/components/Contract/ContractItem";

export const WS_AUTH_URL = `ws://47.95.214.69:1002/auth_code_status/`
export const WS_CONTRACT_SIGN_URL = 'ws://47.95.214.69:1002/api/signCodeStatus'
const http = axios.create({
    baseURL: '/api',
    timeout: 5000
})
// todo 一会删  后台没改前缀
const anotherHttp = axios.create({
    baseURL: '/hi',
    timeout: 5000
})

http.interceptors.request.use(config => {
    if (!token) return config
    config.params = config.params || {}
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
anotherHttp.interceptors.request.use(config => {
    if (!token) return config
    config.params = config.params || {}
    config.params.token = token
    return config
})
// 添加响应拦截器
anotherHttp.interceptors.response.use(function (response) {

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

const token = 'eyJ0eXBlIjoiIiwiYWxnIjoiSFM1MTIifQ.eyJpZCI6IjEwMDA1IiwidGltZVN0YW1wIjoxNTYyNjYxOTExMTU5LCJ0aW1lT3V0IjoxNTYyNzQ4MzExMTU5fQ.RIburQTRtDW9UNJ5qusNJrzui-um96fsrS496vbdzAKGdpacFNWSqdAi3QgOmB0p1YK3FeYQzGTugo2HxA0dwg'

export const authorization = {
    async getAuthorizationCode() {

        return (await anotherHttp.get('auth_code')).str

    }
}

export const contract = {
    async getList() {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })

        return http.get('contracts')
        return [
            {
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/test.pdf',
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
                    link: process.env.PUBLIC_URL + '/test.pdf',
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
                    link: process.env.PUBLIC_URL + '/test.pdf',
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
                    link: process.env.PUBLIC_URL + '/test.pdf',
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
                    link: process.env.PUBLIC_URL + '/test.pdf',
                    size: 128
                },
                lastModified: Date.now()
            },
        ]
    },

    async getById(contractId) {

        return http.get(`contracts/${contractId}`)

        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })

        return {
            type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
            title: '二手房买卖合同2018',
            file: {
                filename: 'test.pdf',
                link: process.env.PUBLIC_URL + '/test.pdf',
                size: 128
            },
            lastModified: Date.now()
        }
    },

    async accept(id) {
        return http.post(`contracts/${id}/accept`)
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })
        return true
    },
    async create(form) {
        return http.post(`contracts/create`,form)
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })
        return true
    },


    async decline(id) {
        return http.post(`contracts/${id}/decline`)
        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })
        return true
    },


    // 获取签名授权码
    async getSignCode(id) {
        return http.post(`contracts/${id}/signCode`)

        await new Promise(resolve => {
            setTimeout(() => resolve(), 1000)
        })

        // return http.get('auth_code')
        return Math.floor(Math.random()*1000000)

    },


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
    return http.get('/logs')

    await new Promise(resolve => {
        setTimeout(() => resolve(), Math.random() * 1000)
    })
    // return []
    return [
        {
            timestamp: Date.now(),
            deviceId: 'SDFSDXV-345',
            deviceModel: 'iPhoneX',
            deviceType: 'mobile'
        },
        {
            timestamp: Date.now(),
            deviceId: 'KNIDFD-345',
            deviceModel: 'Lenovo T7',
            deviceType: 'desktop'
        },
        {
            timestamp: Date.now(),
            deviceId: 'SDFSDXV-345',
            deviceModel: 'iPhoneX',
            deviceType: 'mobile'
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
            deviceId: 'SDFSDXV-345',
            deviceModel: 'iPhoneX',
            deviceType: 'mobile'
        },
        {
            deviceId: 'KNIDFD-345',
            deviceModel: 'Lenovo T7',
            deviceType: 'desktop'
        },
        {
            deviceId: 'SDFSDXV-345',
            deviceModel: 'iPhoneX',
            deviceType: 'mobile'
        },
    ]
}

