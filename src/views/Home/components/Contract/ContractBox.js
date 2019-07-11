import React from 'react'
import style from './ContractBox.module.scss'
import {Button, List} from "antd";
import {ContractItem} from "./ContractItem";
import Empty from "antd/lib/empty";
import {NewContractDrawer} from "./NewContractDrawer";


export function ContractBox({contractListHook}) {

    const [list, loading, {refresh, removeOne}] = contractListHook


    const [showContractCreateDrawer,setShowContractCreateDrawer] =React.useState(false)

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
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={list}
                    renderItem={(props, index) => (<ContractItem {...props} onRemove={() => removeOne(index)}/>)}
                />
            }
            <NewContractDrawer onCreate={refresh} onClose={()=>setShowContractCreateDrawer(false)} visible={showContractCreateDrawer}/>

        </section>
    )
}