import React from 'react'
import {Button, Icon} from "antd";
import Title from "antd/lib/typography/Title";
import style from './Home.module.scss'

export function Home() {

    // 为body添加class 修改标题
    React.useEffect(()=>{
        document.body.classList.add('homeBody')
        document.title = '用户中心'
        return ( )=>{
            document.body.classList.remove('homeBody')
        }
    },[])

    return (
        <div className={style.Home}>

            <div>
                <Icon type="smile" theme="twoTone" style={{fontSize: '48px'}}/>
            </div>
            <Title>欢迎回来：{'XXX'}</Title>
            <div>
                <Button type="danger">注销</Button>
            </div>
        </div>
    )
}