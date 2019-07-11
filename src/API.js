import axios from 'axios'
import {ContractItem} from "./views/Home/components/Contract/ContractItem";

export const WS_AUTH_URL = `ws://47.95.214.69:1002/auth/codeStatus`
export const WS_CONTRACT_SIGN_URL = 'ws://47.95.214.69:1002/api/signCodeStatus'
const http = axios.create({
    baseURL: '/api',
    timeout: 5000
})
http.interceptors.request.use(config => {
    if (!getToken()) return config
    config.params = config.params || {}
    config.params.token = getToken()
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
export let getToken = ()=>sessionStorage.getItem('token')
// export let token = 'eyJ0eXBlIjoiIiwiYWxnIjoiSFM1MTIifQ.eyJpZCI6IjEwMDAwIiwidGltZVN0YW1wIjoxNTYyNzU4NTM4NTkwLCJ0aW1lT3V0IjoxNTYyODQ0OTM4NTkwfQ.Xa4wgATA9UajD7nmmtgmMTk6ZlaW-4KhEfm1zbwm3lsNlNsjcrNcQbZTe8Vcr93pq-hQBEV_thDCqTXFQrGOSw'
// if (window.location.search==='?another'){
//     token='eyJ0eXBlIjoiIiwiYWxnIjoiSFM1MTIifQ.eyJpZCI6IjEwMDAxIiwidGltZVN0YW1wIjoxNTYyNzU4NjI1MzcyLCJ0aW1lT3V0IjoxNTYyODQ1MDI1MzcyfQ.4m0_jGXvhWMyeDoXGyWcODYTnmmG9nnavibIVZ56-Rbbny5zMNpjDHcpY9YQzTi9JOXNcz65eBtLfi3dbl3HHA'
// }
// export const setToken = v=>{token=v}
export const setToken = v=>{
    sessionStorage.setItem('token',v)
}

export const authorization = {
    async getAuthorizationCode() {

        return await http.get('auth/code')

    }
}

const contractReducer = contract => {
    contract.file = contract.data
    if (contract.type === 0) contract.type = 1
    delete contract.data
    return contract
}
export const contract = {
    async getList() {
        return http.get('contracts').then(data=>data.map(contractReducer))
    },

    async getById(contractId) {

        return http.get(`contracts/${contractId}`).then(data=>contractReducer(data))

    },

    async accept(id) {
        return http.post(`contracts/${id}/accept`)
    },
    async create(form) {
        return http.post(`contracts/create`,form)
    },


    async decline(id) {
        return http.post(`contracts/${id}/decline`)
    },


    // 获取签名授权码
    async getSignCode(id) {
        return http.get(`contracts/${id}/signCode`)
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

