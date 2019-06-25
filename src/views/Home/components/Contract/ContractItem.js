import React from "react";
import {contract} from "../../../../API";
import {fileType, getExtension} from "../../../../util";
import {Avatar, Button, Icon, List, Popconfirm, Tooltip, message, Skeleton, Modal} from "antd";
import {usePrevious, useUserInfo} from "../../../../customHooks";
import Upload from "antd/lib/upload";
import Text from "antd/lib/typography/Text";
import Types from "prop-types";
import './ContractItem.scss'
import formatDate from 'dateformat'
import {AuthBox} from "../PKIAuth/AuthBox";


function genFileIcon(filename) {
    const ext = getExtension(filename)
    if (fileType.isImg(ext)) return <Avatar icon={"file-image"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isExcel(ext)) return <Avatar icon={"file-excel"}
                                              style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isMarkdown(ext)) return <Avatar icon={"file-markdown"}
                                                 style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isPdf(ext)) return <Avatar icon={"file-pdf"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isPpt(ext)) return <Avatar icon={"file-ppt"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isTxt(ext)) return <Avatar icon={"file-text"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isWord(ext)) return <Avatar icon={"file-word"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    if (fileType.isZip(ext)) return <Avatar icon={"file-zip"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>
    return <Avatar icon={"file-unknown"} style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>

}

function AcceptButton({contrastId, onRefresh}) {
    const [loading, setLoading] = React.useState(false)

    async function clickFunc() {
        setLoading(true)
        try {
            await contract.accept(contrastId)
            onRefresh()
        } finally {
            setLoading(false)
        }
    }

    return <Button type={"primary"} onClick={clickFunc} loading={loading}>接受</Button>
}

function ModifyButton({contrastId, onRefresh}) {
    const [fileList, setFileList] = React.useState([])
    const [uploading, setUploading] = React.useState(false)
    const props = {
        name: 'file',
        action: `https://www.mocky.io/v2/5cc8019d300000980a055e76?id=${contrastId}`,
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'uploading') {
                setUploading(true)
            }
            if (info.file.status === 'done') {
                setUploading(false)
                onRefresh()
            } else if (info.file.status === 'error') {
                setUploading(false)
            }
            setFileList([info.file])
        },
        fileList,
        showUploadList: false,
        multiple: false,
    }


    const prev = usePrevious(uploading)

    let [buttonText, setButtonText] = React.useState('修改')
    // ButtonText会在完成上传后先置位成功 然后在改为修改
    React.useEffect(() => {
        if (prev === null) {
            // 初始化
            setButtonText('修改')
        } else if (prev && !uploading) {
            // 刚刚完成上传
            setButtonText('完成上传')
            setTimeout(() => {
                setButtonText('修改')
            }, 2000)
        } else if (uploading) {
            setButtonText('上传中')
        }
    }, [uploading])

    React.useEffect(() => {

    }, [uploading])


    return <Upload {...props}>
        <Button type={"upload"} loading={uploading}>{buttonText}</Button>
    </Upload>
}

function DeclineButton({contrastId, onDecline}) {
    function confirmFunc() {
        contract.decline(contrastId).then(() => {
            message.success('已回绝')
            onDecline()
        })
    }

    return <Popconfirm
        title="拒绝后将永久删除该合同，是否继续？"
        onConfirm={confirmFunc}
        okText="继续"
        cancelText="返回">
        <Button type={"danger"}>拒绝</Button>
    </Popconfirm>
}

const itemStatus = {
// 待确认
    STATUS_TO_BE_CONFIRMED: 1,
// 有修改且待对方确认
    STATUS_OTHER_TO_BE_CONFIRMED: 2,
// 已确认且对方也已确认
    STATUS_ALL_CONFIRMED: 3,
// 已签名且待对方签名
    STATUS_OTHER_TO_BE_SIGNED: 4,
// 已签名且对方也已签名
    STATUS_ALL_SIGNED: 5,
}

export function ContractItem(props) {

    let {type, id, title, lastModified, file: {filename, size, link}, partA, partB} = props
    const {onRemove} = props

    const [loading, setLoading] = React.useState(false)

    async function onRefresh() {
        setLoading(true)
        try {
            ({type, id, title, lastModified, file: {filename, size, link}, partA, partB} =
                await contract.getById(id))

        } catch (e) {
            message.error(`获取失败，code${e.status}:${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    const {username: partAName} = useUserInfo(partA)
    const {username: partBName} = useUserInfo(partB)
    // 下载原合同按钮
    const downloadButton = <Button href={link} type={"link"}>下载</Button>
    // 接受合同
    const acceptButton = <AcceptButton contrastId={id} onRefresh={onRefresh}/>
    // 等待对方确认
    const otherAcceptButton = <Button type={"primary"} disabled>等待对方确认</Button>
    // 拒绝合同
    const declineButton = <DeclineButton onDecline={onRemove} contrastId={id}/>
    // 修改合同
    const modifyButton = <ModifyButton contrastId={id} onRefresh={onRefresh}/>
    // 签名
    const signButton = <Button type={"primary"} onClick={() => setSignCodeModalVisible(true)}>签名</Button>
    // 等待对方签名
    const othersSgnButton = <Button type={"primary"} disabled>等待对方签名</Button>
    // 下载证书
    const downloadCredentialButton = <Button href={link} type={"link"}>下载签名版合同</Button>
    // 校验本地文件
    const verifyLocalCredential = <Button href={link} type={"link"}>校验本地文件</Button>

    // 将组件状态映射为actionButtons
    let mapItemStatusToActionButtons = status => {
        switch (status) {
            case itemStatus.STATUS_TO_BE_CONFIRMED: {
                return [downloadButton, acceptButton, modifyButton, declineButton]
            }
            case itemStatus.STATUS_OTHER_TO_BE_CONFIRMED: {
                return [downloadButton, otherAcceptButton, modifyButton]
            }
            case itemStatus.STATUS_ALL_CONFIRMED: {
                return [downloadButton, signButton]
            }
            case itemStatus.STATUS_OTHER_TO_BE_SIGNED: {
                return [downloadButton, othersSgnButton]
            }
            case itemStatus.STATUS_ALL_SIGNED: {
                return [downloadButton, downloadCredentialButton, verifyLocalCredential]
            }
            default: {
                throw new Error(`unknown item type:${type} ${JSON.stringify(itemStatus)}`)
            }
        }
    }

    let actionButtons = mapItemStatusToActionButtons(type)


    let ItemIcon = type === itemStatus.STATUS_ALL_SIGNED ?
        <Avatar icon={"check"} style={{color: '#f6ffed', backgroundColor: '#52c41a'}}/> : genFileIcon(filename)

    const lastModifiedFormatted = formatDate(new Date(lastModified), 'yyyy mm-dd-HH:MM')

    const [signCodeModalVisible, setSignCodeModalVisible] = React.useState(false)

    function onFinishSigning(){
        setSignCodeModalVisible(false)
        onRefresh()
    }

    return (
        <>
            <List.Item actions={actionButtons} className={"contractItem"}>
                <Skeleton avatar={{size: 32}} title={false} paragraph={{width: [120, 290]}} loading={loading} active>
                    <List.Item.Meta
                        avatar={ItemIcon}
                        title={<a href={link}
                                  target={'_blank'}>{type === itemStatus.STATUS_ALL_SIGNED && '(已成功签订)'}{title}</a>}
                        description={`${filename} | ${size}KB | 最后修改：${lastModifiedFormatted}`}
                    />
                    <div style={{flex:'auto'}}><Text style={{textAlign: "center", padding: '0 1em'}}>甲方：
                        <Tooltip placement="bottom" title={<span>3705231998000021250</span>}>
                            <Text strong>{partAName || <Icon type="loading" spin/>}</Text>
                        </Tooltip>
                    </Text>
                        <Text style={{textAlign: "center", padding: '0 1em'}}>乙方：
                            <Tooltip placement="bottom" title={<span>370523199800003355</span>}>
                                <Text strong>{partBName || <Icon type="loading" spin/>}</Text>
                            </Tooltip>
                        </Text></div>
                </Skeleton>
            </List.Item>
            {signCodeModalVisible && <Modal
                width={360}
                visible={true}
                title="请使用手机密钥完成签名"
                onCancel={() => setSignCodeModalVisible(false)}
                footer={null}
            >
                <AuthBox onAuthOK={onFinishSigning}/>
            </Modal>}
        </>
    )
}

ContractItem.status = itemStatus
ContractItem.propTypes = {
    type: Types.number,
    id: Types.string,
    title: Types.string,
    lastModified: Types.number,
    file: Types.shape({
        filename: Types.string,
        size: Types.number,
        link: Types.string
    }),
    partA: Types.number,
    partB: Types.number,
    onRemove: Types.func
}
