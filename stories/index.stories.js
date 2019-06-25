import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import 'antd/dist/antd.css'
import {Button} from '@storybook/react/demo';
import {
    ContractBox
} from "../src/views/Home/components/Contract/ContractBox";
import {usePrevious} from "../src/customHooks";
import {ContractItem} from "../src/views/Home/components/Contract/ContractItem";
import {LogBox} from "../src/views/Home/components/Log/LogBox";
import {DeviceBox} from "../src/views/Home/components/Device/DeviceBox";
import {Home} from "../src/views/Home/Home";
import {AuthBox} from "../src/views/Home/components/PKIAuth/AuthBox";

function Test(props) {

    const [v, setV] = React.useState([1,3,5,7,9])

    return (
        <>
            <button onClick={() => {

                setV([...v.slice(0,2),...v.slice(3)])
                console.log(Object.getOwnPropertyDescriptor(props,'propA'))
                props.propA = 333
                console.log(Object.getOwnPropertyDescriptor(props,'propA'))
            }}>click</button>
            <div>{v}{props.propA}</div>
        </>
    )
}

storiesOf('Test', module)
    .add('with text', () => <Test propA={23}/>)

storiesOf('首页', module)
    .add('with text', () => <Home/>)

storiesOf('登录日志', module)
    .add('default', () => <LogBox/>)

storiesOf('设备信息', module)
    .add('default', () => <DeviceBox/>)

storiesOf('验证模块（多为弹窗）', module)
    .add('default', () => <AuthBox/>)

storiesOf('合同列表', module)
    .add('default', () => <ContractBox/>)

storiesOf('合同Item', module)
    .add('文件图标', () => (
        <>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.png',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.xls',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.md',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.txt',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.doc',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.rar',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.ppt',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.aaa',
                    link: process.env.PUBLIC_URL + '/tes.pdf',
                    size: 128
                }
            }}/>
        </>
    ))
    .add('待确认', () => (
        <>
            <ContractItem {...{
                type: ContractItem.status.STATUS_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/test.pdf',
                    size: 128
                },
                lastModified: Date.now()
            }}/>
        </>
    ))
    .add('已修改并待对方确认', () => (
        <>
            <ContractItem {...{
                type: ContractItem.status.STATUS_OTHER_TO_BE_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/test.pdf',
                    size: 128
                },
                lastModified: Date.now()
            }}/>
        </>
    ))
    .add('已确认且对方也已确认', () => (
        <>
            <ContractItem {...{
                type: ContractItem.status.STATUS_ALL_CONFIRMED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/test.pdf',
                    size: 128
                },
                lastModified: Date.now()
            }}/>
        </>
    ))
    .add('已签名且待对方签名', () => (
        <>
            <ContractItem {...{
                type: ContractItem.status.STATUS_OTHER_TO_BE_SIGNED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/test.pdf',
                    size: 128
                },
                lastModified: Date.now()
            }}/>
        </>
    ))
    .add('已签名且对方也已签名', () => (
        <>
            <ContractItem {...{
                type: ContractItem.status.STATUS_ALL_SIGNED,
                loading: false,
                title: '二手房买卖合同2018',
                file: {
                    filename: 'test.pdf',
                    link: process.env.PUBLIC_URL + '/test.pdf',
                    size: 128
                },
                lastModified: Date.now()
            }}/>
        </>
    ))