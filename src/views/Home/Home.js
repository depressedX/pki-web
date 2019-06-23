import React from 'react'
import {Button, Drawer, Icon} from "antd";
import Title from "antd/lib/typography/Title";
import style from './Home.module.scss'
import {ContractBox} from "./components/Contract/ContractBox";
import Divider from "antd/lib/divider";
import {DeviceBox} from "./components/Device/DeviceBox";
import {LogBox} from "./components/Log/LogBox";

export function Home() {

    // 为body添加class 修改标题
    React.useEffect(() => {
        document.body.classList.add('homeBody')
        document.title = '用户中心'
        return () => {
            document.body.classList.remove('homeBody')
        }
    }, [])

    const [showDeviceBox, setShowDeviceBox] = React.useState(false)
    const [showLogBox, setShowLogBox] = React.useState(false)

    return (
        <div className={style.Home}>

            <div>
                <Icon type="smile" theme="twoTone" style={{fontSize: '48px'}}/>
            </div>
            <Title>欢迎回来：{'XXX'}
                <Button style={{marginLeft: '50px'}} type="danger">注销</Button></Title>
            <Button type={"link"} onClick={() => setShowDeviceBox(true)}>设备信息</Button>
            <Button type={"link"} onClick={() => setShowLogBox(true)}>登录日志</Button>
            <Divider/>
            <Title level={2}>合同</Title>


            <Drawer
                title="设备信息"
                width={360}
                onClose={() => setShowDeviceBox(false)}
                visible={showDeviceBox}>
                <DeviceBox/>
            </Drawer>
            <Drawer
                title="登录日志"
                width={360}
                onClose={() => setShowLogBox(false)}
                visible={showLogBox}>
                <LogBox/>
            </Drawer>
            <ContractBox/>
        </div>
    )
}