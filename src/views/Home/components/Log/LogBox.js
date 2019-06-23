import React from 'react'
import style from "../Contract/ContractBox.module.scss";
import Empty from "antd/lib/empty";
import {Button, List} from "antd";
import {getLogList} from "../../../../API";
import Timeline from "antd/lib/timeline";
import Text from "antd/lib/typography/Text";
import Card from "antd/lib/card";
import Meta from "antd/lib/card/Meta";
import Avatar from "antd/lib/avatar";
import dateFormat from 'dateformat'

function useLogList() {
    const logReducer = log => log
    const [list, setList] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        setLoading(true)
        try {
            const data = await getLogList()
            setList(data.map(logReducer))
            console.log(data)
        } finally {
            setLoading(false)
        }
    }

    return [list, loading, refresh]
}

function LogItem() {
    return (
        <div></div>
    )
}

export function LogBox() {

    const [list, loading, refresh] = useLogList()

    const loadMore = !loading ? (
        <div
            style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
            }}
        >
            <Button>加载更多</Button>
        </div>
    ) : null

    return (
        <section className={style.contractBox}>
            <Timeline pending={loading}>
                {list.length === 0  &&
                <Timeline.Item color={'gray'}><Text disabled>当前登录记录为空</Text></Timeline.Item>}
                {list.map((logItem, i) =>
                    <Timeline.Item key={i}>
                        <Card bodyStyle={{marginBottom: '10px', padding: 0}} bordered={false}>
                            <Meta
                                avatar={
                                    <Avatar src={logItem.deviceType === 'desktop' ?
                                        require('../../../../assets/PC.png') :
                                        require('../../../../assets/mobile.png')}
                                            shape={"square"}/>
                                }
                                title={logItem.deviceName}
                                description={`${dateFormat(new Date(logItem.timestamp), 'mm-dd HH:MM')} 
                                ${logItem.deviceId}`}
                            />
                        </Card>
                    </Timeline.Item>)}
            </Timeline>
            <Button type={"link"} onClick={refresh}>加载更多</Button>
        </section>
    )
}