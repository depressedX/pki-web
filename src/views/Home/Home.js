import React from 'react'
import {Button, Drawer, Icon} from "antd";
import Title from "antd/lib/typography/Title";
import style from './Home.module.scss'
import {ContractBox} from "./components/Contract/ContractBox";
import Divider from "antd/lib/divider";
import {DeviceBox} from "./components/Device/DeviceBox";
import {LogBox} from "./components/Log/LogBox";
import Card from "antd/lib/card";
import {NewContractDrawer} from "./components/Contract/NewContractDrawer";
import {useContractList} from "../../customHooks";
import {token} from "../../API";

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
    const [showNewContractDrawer, setShowNewContractDrawer] = React.useState(false)

    const contractListHook = useContractList()
    const [, , contractListHookActions] = contractListHook

    return (
        <div className={style.Home}>

            <div>
                <Icon type="smile" theme="twoTone" style={{fontSize: '48px'}}/>
            </div>
            <Title style={{fontWeight:"normal"}}>欢迎回来：{'XXX'}</Title>
            {/*<Button type={"link"} onClick={() => setShowDeviceBox(true)}>设备信息</Button>*/}
            <Button type={"link"} onClick={() => setShowLogBox(true)}>登录日志</Button>
            <Divider/>
            <Card title="合同" bordered={false}
                  extra={<Button type={"primary"} onClick={() => setShowNewContractDrawer(true)}>点击创建新合同</Button>}>
                <ContractBox contractListHook={contractListHook}/>
            </Card>

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
            <NewContractDrawer onCreate={() => contractListHookActions.refresh()}
                               onClose={() => setShowNewContractDrawer(false)}
                               visible={showNewContractDrawer}/>
        </div>
    )
}