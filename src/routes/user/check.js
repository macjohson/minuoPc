import React from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Row, Col, Modal, Spin} from 'antd';
import {HeadTitle} from "../../components/components";
import queryString from 'query-string';

const {Item} = Form;
import {routerRedux} from 'dva/router';

class userCheck extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const {getFieldDecorator, validateFields, resetFields, isFieldsTouched, getFieldValue} = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.isFieldsTouched = isFieldsTouched;
    this.getFieldValue = getFieldValue;
    this.id = queryString.parse(this.props.location.search).id;
  }

  layout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 8
    }
  };

  submit = () => {
    this.validateFields((err, val) => {
      if (!err) {
        val.id = this.id ? this.id : null;

        this.dispatch({
          type: "user/check",
          payload: val,
          resetFields: this.resetFields
        })
      }
    })
  }

  cancel = () => {
    const goBack = () => {
      this.resetFields();
      this.dispatch({type:"user/update",payload:{info:{}}})
      this.dispatch(routerRedux.push('/user'))
    }
    if (this.isFieldsTouched()) {
      Modal.confirm({
        title: "操作提示",
        content: "您有未保存的信息，是否取消？",
        onOk: goBack
      })
      return
    }

    goBack();
  }

  render() {
    const {
      loading: {
        effects: {
          "user/check": checkLoading = false,
          "user/detail": detailLoading = false
        }
      },
      user: {
        info
      }
    } = this.props;
    return (
      <Spin spinning={detailLoading}>
        <HeadTitle name={this.id ? "编辑用户" : "新增用户"}/>
        <Form>
          <Item label={"用户名"} {...this.layout}>
            {
              this.getFieldDecorator('userName', {
                rules: [
                  {required: true, message: "请填写用户名"}
                ],
                initialValue: info.userName
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"姓名"} {...this.layout}>
            {
              this.getFieldDecorator('name', {
                rules: [
                  {required: true, message: "请填写姓名"}
                ],
                initialValue: info.name
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"电话号码"} {...this.layout}>
            {
              this.getFieldDecorator('phoneNumber', {
                rules: [
                  {required: true, message: "请填写电话号码"}
                ],
                initialValue: info.phoneNumber
              })(
                <Input placeholder={"请输入"} type={"number"}/>
              )
            }
          </Item>
        </Form>
        <Row>
          <Col span={8} offset={4}>
            <Button type={"primary"} style={{marginRight: 20}} loading={checkLoading} onClick={this.submit}>提交</Button>
            <Button onClick={this.cancel}>取消</Button>
          </Col>
        </Row>
      </Spin>
    )
  }
}

export default connect(({user, loading}) => ({user, loading}))(Form.create()(userCheck))
