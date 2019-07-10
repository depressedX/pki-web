import React from 'react'
import style from './AuthBox.module.scss'
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";
import {authorization, contract, WS_AUTH_URL, WS_CONTRACT_SIGN_URL} from "../../../../API";
import {useQRCode} from "../../../../customHooks";

function useAuthorizationCode(id) {

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


    function refresh() {
        dispatch({type: 'fetch'})

        contract.getSignCode(id)
            .then(async code => {

                // 修改状态
                dispatch({type: 'finishFetching'})
                setCode(code)

                // TODO:建立websocket通道查找状态
                let socket = new WebSocket(`${WS_CONTRACT_SIGN_URL}?code=${code}`)

                socket.onopen = function () {
                    console.log('通道已连接')
                }

                socket.onmessage = function (evt) {
                    let msg = evt.data
                    alert(`收到数据: ${msg}`)
                    dispatch({type: 'resolve'})
                    setAuthInfo('auth_OK')
                    socket.close()
                }

                socket.onclose = function (e) {
                    if (e.code === 1) {
                        console.log('连接已关闭，原因：授权成功')
                    } else {
                        console.log('连接已关闭，原因：超时或其他意外')
                        dispatch({type: 'expireIt'})
                    }
                }

            }, e => {
                dispatch({type: 'finishFetching'})
            })
    }

    React.useEffect(() => {

        refresh()

    }, [])


    return [code, curCodeState, refresh, authInfo]
}

// 用于对合同进行签名
export function AuthBox({onAuthOK,contractId}) {

    const [code, curCodeState, refresh, authInfo] = useAuthorizationCode(contractId)
    const codeSrc = useQRCode(code)

    // 检测auth信息
    React.useEffect(() => {
        if (!authInfo) return
        onAuthOK(authInfo)

    }, [authInfo, onAuthOK])

    return (
        <div className={style.authBox}>
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
                      <p className={style.refreshTips}>二维码失效，点击刷新</p>
            </div>
            }
        </div>
    )
}