import React from 'react'
import QRCode from 'qrcode'
import style from './Login.module.scss'
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";
import {authorization, setToken, WS_AUTH_URL} from "../../API";
import {useRouter} from "../../CustomBrowserRouter";
import {message} from 'antd'
import {useQRCode} from "../../customHooks";


// 从服务器获取认证码并通过websocket监控其状态
// 结果是认证信息
export function useAuthorizationCode() {

    const FETCH = 'fetch',
        FINISH_FETCHING = 'finishFetching',
        EXPIRE_IT = 'expireIt',
        RESOLVE = 'resolve'

    // null->loading->pending（未被验证）->expired(超时)->fulfilled(已获得结果）
    const codeStateReducer = (state, action) => {
        switch (action.type) {
            case FETCH: {
                if (!state.expired && !state.null) {
                    console.log(state)
                    throw new Error(`invalid action:${action.type} when state is ${JSON.stringify(state)}`)
                }
                return {
                    loading: true
                }
            }
            case FINISH_FETCHING: {
                if (!state.loading) {
                    throw new Error(`invalid action:${action.type} when state is ${JSON.stringify(state)}`)
                }
                return {
                    pending: true
                }
            }
            case EXPIRE_IT: {
                if (!state.pending) {
                    throw new Error(`invalid action:${action.type} when state is ${JSON.stringify(state)}`)
                }
                return {
                    expired: true
                }
            }
            case RESOLVE: {
                if (!state.pending) {
                    throw new Error(`invalid action:${action.type} when state is ${JSON.stringify(state)}`)
                }
                return {
                    fulfilled: true
                }
            }
            default: {
                console.log(action)
                throw new Error(`unknown action:${action.type}`)
            }
        }
    }


    const [curCodeState, dispatch] = React.useReducer(codeStateReducer, {null: true});
    const [authInfo, setAuthInfo] = React.useState(null)
    const [code, setCode] = React.useState(null)


    // 每次update组件都会重新生成一个闭包，所以这里timeoutId是全新的
    // 即使这次更新可能会调用refresh方法，那也没关系，因为一个时刻只会有一个timeoutFunc
    let expiredTimeoutFuncId = null

    function refresh() {
        dispatch({type: 'fetch'})

        authorization.getAuthorizationCode()
            .then(async code => {
console.log(code)
                // 修改状态
                dispatch({type: 'finishFetching'})
                setCode(code)

                // TODO:建立websocket通道查找状态
                let socket = new WebSocket(`${WS_AUTH_URL}?code=${code}`)

                socket.onopen = function()
                {
                    console.log('通道已连接')
                }

                socket.onmessage = function (evt)
                {
                    let msg = JSON.parse(evt.data)
                    if (msg.status !== 200) return
                    dispatch({type: 'resolve'})
                    setAuthInfo(msg.data)
                    clearTimeout(expiredTimeoutFuncId)
                    socket.close()
                }

                socket.onclose = function()
                {
                    console.log("连接已关闭...");
                }

                // 设置自然过期 2分钟
                clearTimeout(expiredTimeoutFuncId)
                expiredTimeoutFuncId = setTimeout(() => {
                    dispatch({type: 'expireIt'})
                }, 1000*60*2)
            })
    }

    React.useEffect(() => {

        refresh()

        return () => {
            clearTimeout(expiredTimeoutFuncId)
        }

    }, [])


    return [code, curCodeState, refresh, authInfo]
}

function LoginBox() {


    // 1.为body添加class 2.修改标题
    React.useEffect(() => {
        document.body.classList.add('loginBody')
        document.title = '登录'
        return () => {
            document.body.classList.remove('loginBody')
        }
    }, [])

    const [code, curCodeState, refresh, authInfo] = useAuthorizationCode()
    const codeSrc = useQRCode(code)

    const router = useRouter()

    // 检测auth信息
    React.useEffect(() => {
        if (!authInfo) return
        setToken(authInfo)
        message.success('登陆成功！正在跳转')
        setTimeout(() => {

            router.history.replace('/home')
        }, 1000)
    }, [authInfo])

    return (
        <div className={style.loginBox}>
            <div className={style.qrCodeContainer}>
                {/*加载中图标*/}
                {(curCodeState.loading || curCodeState.null) &&
                <Spin className={style.qrCodeLoading}
                      indicator={<Icon type="loading" style={{fontSize: 36}} spin/>}/>}
                {/*二维码*/}
                {((curCodeState.pending || curCodeState.expired) && codeSrc) &&
                <img className={style.qrCode} src={codeSrc} alt={'二维码,若未能显示，联系管理员'}/>}
                {/*过期状态*/}
                {curCodeState.expired &&
                <div className={style.refreshIconMask}>
                    <Icon onClick={refresh} className={style.refreshIcon} type="redo"
                          style={{fontSize: 36, color: '#1890ff'}}/>
                </div>
                }
            </div>
            <div className={style.loginHint}>
                {!curCodeState.expired && <>
                    <p className={style.subTitle}>使用手机APP扫码登录</p>
                    <p className={style.subDesc}>网页版应用需要配合手机使用</p>
                </>}
                {curCodeState.expired && <p className={style.refreshTips}>二维码失效，点击刷新</p>}
            </div>
        </div>
    )
}

export function Login() {
    return (
        <>
            <LoginBox/>
        </>
    )
}