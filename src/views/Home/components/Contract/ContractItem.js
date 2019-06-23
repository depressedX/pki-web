import React from "react";
import {contract, getUserInfo} from "../../../../API";
import {fileType, getExtension} from "../../../../util";
import {Avatar, Button, Icon, List, Popconfirm, Tooltip, message} from "antd";
import {usePrevious} from "../../../../customHooks";
import Upload from "antd/lib/upload";
import Text from "antd/lib/typography/Text";
import Types from "prop-types";
import './ContractItem.scss'

function useUserInfo(uid) {
    const [userInfo, setUserInfo] = React.useState({})
    React.useEffect(() => {
        getUserInfo(uid).then(data => {
            setUserInfo(data)
        })
    }, [uid])
    return userInfo
}

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

function AcceptButton(contrastId) {
    const [loading, setLoading] = React.useState(false)

    async function clickFunc() {
        setLoading(true)
        try {
            await contract.accept(contrastId)
        } finally {
            setLoading(false)
        }
    }

    return <Button type={"primary"} onClick={clickFunc} loading={loading}>接受</Button>
}

function ModifyButton({contrastId}) {
    const [fileList, setFileList] = React.useState([])
    const [uploading, setUploading] = React.useState(false)
    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'uploading') {
                setUploading(true)
            }
            if (info.file.status === 'done') {
                setUploading(false)
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

function DeclineButton({contrastId}) {
    function confirmFunc() {
        contract.decline(contrastId).then(() => {
            message.success('已回绝')
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
    STATUS_TO_BE_CONFIRMED: 0,
// 有修改且待对方确认
    STATUS_OTHER_TO_BE_CONFIRMED: 1,
// 已确认且对方也已确认
    STATUS_ALL_CONFIRMED: 2,
// 已签名且待对方签名
    STATUS_OTHER_TO_BE_SIGNED: 3,
// 已签名且对方也已签名
    STATUS_ALL_SIGNED: 4,
}

export function ContractItem(props) {

    const {type, id, title, lastModified, file: {filename, size, link}, partA, partB} = props

    const {username: partAName} = useUserInfo(partA)
    const {username: partBName} = useUserInfo(partB)
    // 下载原合同按钮
    const downloadButton = <Button href={link} type={"link"}>下载</Button>
    // 接受合同
    const acceptButton = <AcceptButton contrastId={id}/>
    // 等待对方确认
    const otherAcceptButton = <Button type={"primary"} disabled>等待对方确认</Button>
    // 拒绝合同
    const declineButton = <DeclineButton contrastId={id}/>
    // 修改合同
    const modifyButton = <ModifyButton contrastId={id}/>
    // 签名
    const signButton = <Button type={"primary"}>签名</Button>
    // 等待对方签名
    const othersSgnButton = <Button type={"primary"}>签名</Button>
    // 下载证书
    const downloadCredentialButton = <Button href={link} type={"link"}>下载签名版合同</Button>
    // 校验本地文件
    const verifyLocalCredential = <Button href={link} type={"link"}>校验本地文件</Button>

    let actionButtons = null
    switch (type) {
        case itemStatus.STATUS_TO_BE_CONFIRMED: {
            actionButtons = [downloadButton, acceptButton, modifyButton, declineButton]
            break
        }
        case itemStatus.STATUS_OTHER_TO_BE_CONFIRMED: {
            actionButtons = [downloadButton, otherAcceptButton, modifyButton]
            break
        }
        case itemStatus.STATUS_ALL_CONFIRMED: {
            actionButtons = [downloadButton, signButton]
            break
        }
        case itemStatus.STATUS_OTHER_TO_BE_SIGNED: {
            actionButtons = [downloadButton, othersSgnButton]
            break
        }
        case itemStatus.STATUS_ALL_SIGNED: {
            actionButtons = [downloadButton, downloadCredentialButton, verifyLocalCredential]
            break
        }
        default: {
            throw new Error(`unknown item type:${type} ${JSON.stringify(itemStatus)}`)
        }
    }


    let ItemIcon = type === itemStatus.STATUS_ALL_SIGNED ?
        <Avatar icon={"check"} style={{color: '#f6ffed', backgroundColor: '#52c41a'}}/> : genFileIcon(filename)

    const date = new Date(lastModified)

    return <List.Item actions={actionButtons} className={"contractItem"}>
        <List.Item.Meta
            avatar={ItemIcon}
            title={<a href={link} target={'_blank'}>{type === itemStatus.STATUS_ALL_SIGNED && '(已成功签订)'}{title}</a>}
            description={`${filename} | ${size}KB | 最后修改：${date.getFullYear()} ${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}
        />
        <Text style={{flex:"none",textAlign:"center",padding:'0 1em'}}>甲方：
            <Tooltip placement="bottom" title={<span>3705231998000021250</span>}>
                <Text strong>{partAName || <Icon type="loading" spin/>}</Text>
            </Tooltip>
        </Text>
        <Text style={{flex:"none",textAlign:"center",padding:'0 1em'}}>乙方：
            <Tooltip placement="bottom" title={<span>370523199800003355</span>}>
                <Text strong>{partBName || <Icon type="loading" spin/>}</Text>
            </Tooltip>
        </Text>
    </List.Item>
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
    partB: Types.number
}
