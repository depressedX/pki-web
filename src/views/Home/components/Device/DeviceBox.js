import React from 'react'
import List from "antd/lib/list";
import {getDeviceList} from "../../../../API";
import {Button} from "antd";
import Avatar from "antd/lib/avatar";
import Text from "antd/lib/typography/Text";

function useDeviceList() {
    const deviceReducer = device => device
    const [list, setList] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        setLoading(true)
        try {
            const data = await getDeviceList()
            setList(data.map(deviceReducer))
        } finally {
            setLoading(false)
        }
    }

    return [list, loading, refresh]
}

export function DeviceBox() {

    const [list, loading, refresh] = useDeviceList()

    return (<>
        <Button type={"link"} onClick={refresh} disabled={loading}>刷新列表</Button>
        <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
                <List.Item actions={[<Button type={"danger"}>解除</Button>]}>
                    <List.Item.Meta
                        avatar={
                            <Avatar src={item.deviceType === 'mobile' ?
                                require('../../../../assets/mobile.png') :
                                require('../../../../assets/PC.png')}/>
                        }
                        title={<Text strong>{item.deviceName}</Text>}
                        description={item.deviceId}
                    />
                </List.Item>
            )}
        />
    </>)
}