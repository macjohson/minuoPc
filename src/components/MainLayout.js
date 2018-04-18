import React from 'react';
import { connect } from 'dva';
import { Layout, Menu, Dropdown, Icon, Modal, Form, Row, Col,Input,Button } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
const { Item, SubMenu } = Menu;
import "../assets/style.less";
import { routerRedux, withRouter } from 'dva/router';
import {UserHead} from '../assets/svg';
import QueueAnim from 'rc-queue-anim';

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const { getFieldDecorator, validateFields, resetFields, getFieldValue } = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.getFieldValue = getFieldValue;
  }

  menuChange = ({ key }) => {
    this.dispatch(routerRedux.push(key))
  };

  drop = ({ key }) => {
    if (key === "layout") {
      this.dispatch({
        type:"user/logout"
      })
    }else if(key === "changePwd"){
      this.dispatch({
        type:"App/modalAction"
      })
    }
  }

  layout = {
    labelCol:{
      span:8
    },
    wrapperCol:{
      span:16
    }
  }

  confirmPwd = (rule,value,callback)=>{
    const pwd2 = this.getFieldValue('pwd2');
    if(value && value !== pwd2){
      callback("两次输入的密码不一致")
    }
    callback();
  }

  validateNew = (rule,value,callback) =>{
    const pwd1 = this.getFieldValue('pwd1');
    if(value && value === pwd1){
      callback("原始密码与新密码一致")
    }
    callback()
  }

  closeModal = ()=>{
    this.resetFields();
    this.dispatch({type:"App/modalAction"})
  }


  submit = ()=>{
    this.validateFields((err,val)=>{
      if(!err){
        const payload = {pwd1:val.pwd1,pwd2:val.pwd2}

        this.dispatch({
          type:"App/changePwd",
          payload
        })
      }
    })
  }

  render() {
    const {
      App: {
        selectedKeys = [],
      visible
      }
    } = this.props;

    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    const menu = localStorage.getItem('menu');
    const _menu = menu ? JSON.parse(menu) : [];

    return (
      <Layout className="mainLayout">
          <QueueAnim type="top">
          <Header className="header" key="a">
          <span className="textLogo"><Icon type="cloud" /> 米诺云</span>
          <div style={{ float: "right" }}>
            <Dropdown trigger={["click", "hover"]} overlay={
              <Menu onClick={this.drop}>
                <Item key="changePwd">修改密码</Item>
                <Item key="layout">注销登陆</Item>
              </Menu>
            }>
              <span style={{ cursor: "pointer",color:"white" }}>{user.name} <Icon type="appstore-o" /></span>
            </Dropdown>
          </div>
        </Header>
          </QueueAnim>
        <Layout>
          <QueueAnim type="left">
          <Sider className="sider" key="a" style={{height:"calc(100vh - 64px)",overflow:"auto"}}>
            <div className="userInfo">
              {/** 
              <UserHead size={"50px"}/>
              **/}
            </div>
            <Menu onClick={this.menuChange} mode={"inline"} onSelected={this.menuChange} selectedKeys={selectedKeys}>
              {
                _menu.map((item,key)=>(
                  item.items.length !== 0 ?
                    <SubMenu key={key} title={<span>{item.displayName}</span>}>
                      {
                        item.items.map((_item)=>(
                          <Item key={_item.url}>{_item.displayName}</Item>
                        ))
                      }
                    </SubMenu> :
                    <Item key={item.url}>{item.displayName}</Item>
                ))
              }
            </Menu>
          </Sider>
          </QueueAnim>
          <Layout>
            <QueueAnim>
            <Content className="content" key="a">
              {this.props.children}
            </Content>
            </QueueAnim>
          </Layout>
        </Layout>
        <Modal title="修改密码" visible={visible} onCancel={this.closeModal} footer={[
          <Button key="cancel" onClick={this.closeModal}>取消</Button>,
          <Button key="save" onClick={this.submit} loading={this.props.loading.effects["App/changePwd"]} type="primary">提交修改</Button>
        ]}>
          <Form>
            <Row>
              <Col span={14} offset={5}>
                <Form.Item label="原始密码" {...this.layout}>
                  {
                    this.getFieldDecorator('pwd1',{
                      rules:[{required:true,message:"请输入原始密码"}]
                    })(
                      <Input placeholder="请输入" type="password"/>
                    )
                  }
                </Form.Item>
                <Form.Item label="新密码" {...this.layout}>
                  {
                    this.getFieldDecorator('pwd2',{
                      rules:[{required:true,message:"请输入新密码"},{validator:this.validateNew}]
                    })(
                      <Input placeholder="请输入" type="password"/>
                    )
                  }
                </Form.Item>
                <Form.Item label="重复新密码" {...this.layout}>
                  {
                    this.getFieldDecorator('pwd3',{
                      rules:[{required:true,message:"请重复新密码"},{validator:this.confirmPwd}]
                    })(
                      <Input placeholder="请输入" type="password"/>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout>
    )
  }
}

export default withRouter(connect(({ App,loading }) => ({ App,loading }))(Form.create()(MainLayout)));
