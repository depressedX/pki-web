import React from "react";
import QRCode from "qrcode";
import {contract, getUserInfo} from "./API";

export function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}


const generateQR = async text => {
    try {
        return await QRCode.toDataURL(text, {errorCorrectionLevel: 'H'})
    } catch (err) {
        console.error(err)
        return null
    }
}


// 异步生成二维码图片
export function useQRCode(text) {

    const [src, setSrc] = React.useState(null)

    React.useEffect(() => {
        if (text === null) return
        setSrc(null)
        // 转化为二维码图片
        generateQR(text.toString()).then(dataUrl => {
            setSrc(dataUrl)
        })
    }, [text])

    return src

}



export function useContractList() {
    const contractReducer = contract => contract
    const [list, setList] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        refresh()
    }, [])

    function removeOne(index) {
        setList([...list.slice(0, index), ...list.slice(index + 1)])
    }
    async function refresh() {
        setLoading(true)
        try {
            const data = await contract.getList()
            setList(data.map(contractReducer))
        } finally {
            setLoading(false)
        }
    }

    const actions = {
        refresh, removeOne
    }

    return [list, loading, actions]
}


export function useUserInfo(uid) {
    const [userInfo, setUserInfo] = React.useState({})
    React.useEffect(() => {
        setUserInfo({})
        getUserInfo(uid).then(data => {
            setUserInfo(data)
        }, e => {
            setUserInfo('获取失败')
        })
    }, [uid])
    return userInfo
}
