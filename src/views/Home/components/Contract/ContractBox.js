import React from 'react'
import style from './ContractBox.module.scss'
import {Button, List} from "antd";
import {ContractItem} from "./ContractItem";
import {contract} from "../../../../API";
import Empty from "antd/lib/empty";

function useContractList() {
    const contractReducer = contract => contract
    const [list, setList] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        setLoading(true)
        try {
            const data = await contract.getList()
            setList(data.map(contractReducer))
        } finally {
            setLoading(false)
        }
    }

    return [list, loading, refresh]
}

export function ContractBox() {

    const [list, loading, refresh] = useContractList()

    const loadMore = !loading?(
        <div
            style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
            }}
        >
            <Button>loading more</Button>
        </div>
    ):null

    return (
        <section className={style.contractBox}>
            {(list.length === 0 && !loading) ?
                <Empty
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                    imageStyle={{
                        height: 60,
                    }}
                    description={
                        <span>
        当前合同列表为空 <Button type={"link"} onClick={refresh}>点击刷新</Button>
      </span>
                    }
                >
                    <Button type="primary">点击创建新合同</Button>
                </Empty> :
                <List
                    loadMore={loadMore}
                    className="demo-loadmore-list"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={list}
                    renderItem={props => (<ContractItem {...props}/>)}
                />}

        </section>
    )
}