import React from "react";
import QRCode from "qrcode";

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
