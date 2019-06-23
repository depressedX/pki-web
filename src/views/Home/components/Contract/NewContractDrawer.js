import React from 'react'
import {Button, Col, Drawer, Form, Icon, Input, Row, Upload, message} from "antd";
import {contract} from "../../../../API";

const ContractCreateFrom = Form.create({name: 'form_in_modal'})(
    class extends React.Component {
        constructor(props) {
            super(props)


        }

        render() {
            const {form} = this.props
            const {getFieldDecorator} = form;
            return (
                <Form layout="vertical" hideRequiredMark>
                    <Form.Item label="标题">
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                        })(<Input placeholder="输入合同的标题"/>)}
                    </Form.Item>
                    <Form.Item label="甲方">
                        <Input value={'我'} disabled/>
                    </Form.Item>
                    <Form.Item label="乙方姓名">
                        {getFieldDecorator('partBName', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item label="乙方证件号码">
                        {getFieldDecorator('partBIDCard', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                        })(<Input placeholder={'对方身份证'}/>)}
                    </Form.Item>
                    <Form.Item label="合同文件">
                        <Upload name={'file'}
                                action={'https://www.mocky.io/v2/5cc8019d300000980a055e76'}
                                multiple={false}>
                            <Button>
                                <Icon type="upload"/>点击上传
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>)
        }
    })

export function NewContractDrawer({onClose, visible}) {

    let formRef = React.useRef(null)

    let saveFormRef = v => {
        formRef.current = v
    }

    const [submitting, setSubmitting] = React.useState(false)

    function handleCreate() {
        const {form} = formRef.current.props;
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            setSubmitting(true)
            try {

                let formData = new FormData()
                Object.keys(values).forEach(key => {
                    formData.append(key, values[key])
                })
                await contract.create(formData)
                form.resetFields();
                message.success('创建成功')
                setTimeout(() => {
                    onClose()
                }, 1000)

            } finally {
                setSubmitting(false)
            }
        });
    }


    return (<Drawer
            title="新建合同"
            width={360}
            onClose={onClose}
            visible={visible}
        >
            <ContractCreateFrom
                wrappedComponentRef={saveFormRef}/>
            <Row>
                <Col span={12}>
                    <Button type={'danger'} onClick={onClose}>取消</Button>
                </Col>
                <Col span={12}>
                    <Button type={'primary'} onClick={handleCreate} loading={submitting}>提交</Button>
                </Col>
            </Row>
        </Drawer>
    )
}