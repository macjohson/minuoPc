import { PureComponent } from 'react';
import { connect } from 'dva';
import "../assets/style.less";
import { Button, Form, Input,Divider } from 'antd';

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
        const { getFieldDecorator, validateFields, resetFields } = props.form;
        this.getFieldDecorator = getFieldDecorator;
        this.validateFields = validateFields;
        this.resetFields = resetFields;
    }


    login = ()=>{
        this.validateFields((err,val)=>{
            if(!err){
                this.dispatch({
                    type:"user/login",
                    payload:val
                })
            }
        })
    }

    render() {
        return (
            <div>
                <div className="topPart">
                    <div className="loginBox">
                        <h1 className="textLogo">米诺云</h1>
                        <Divider />
                        <div className="copy">
                        <span>獾哥科技强力驱动</span>
                        </div>
                        <Form style={{marginTop:60}}>
                            <Form.Item>
                                {
                                    this.getFieldDecorator('username', {
                                        rules: [{ required: true, message: "请输入用户名" }]
                                    })(<Input placeholder="用户名" />)
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    this.getFieldDecorator('password', {
                                        rules: [{ required: true, message: "请输入密码" }]
                                    })(<Input placeholder="密码" type="password" />)
                                }
                            </Form.Item>
                            <Button type={"primary"} onClick={this.login} loading={this.props.loading.effects["user/login"]}>登陆</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({loading})=>({loading}))(Form.create()(Login));
