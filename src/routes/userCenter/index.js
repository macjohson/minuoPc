import React from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Row, Col, Form, Modal, Divider, Spin } from 'antd';
import { modalFormLayout } from '../../config/default';

class userIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.getFieldDecorator = props.form.getFieldDecorator;
    this.validateFields = props.form.validateFields;
    this.resetFields = props.form.resetFields;
    this.columns = [
      { title: "姓名", dataIndex: "name", key: "name" },
      { title: "性别", render: (text, record) => parseInt(record.sex) === 1 ? "男" : "女", key: "" },
      { title: "电话号码", dataIndex: "phone", key: "phone" },
      { title: "首次加入时间", dataIndex: "createTime", key: "createTime" },
      { title: "报名次数", dataIndex: "subCount", key: "subCount" },
      { title: "孩子姓名", dataIndex: "student", key: "student" },
      { title: "孩子生日", dataIndex: "birthday", key: "birthday" },
      { title: "孩子学校", dataIndex: "school", key: "school" },
      {
        title: "操作", render: (text, record) => (
          <span>
            <a onClick={() => this.viewWx(record.openid)}>查看微信信息</a>
          </span>
        ), key: "action"
      }
    ]
  }

  viewWx(openid) {
    this.dispatch({
      type: "userCenter/modalAction"
    })
    this.dispatch({
      type: "userCenter/viewWx",
      payload: {
        openid
      }
    })
  }

  closeModal = () => {
    this.dispatch({
      type: "userCenter/modalAction"
    })
  };

  getList = (pageIndex, pageSize, keyWord) => {
    this.dispatch({
      type: "userCenter/getList",
      payload: {
        pageIndex,
        pageSize,
        keyWord
      }
    })
  }

  render() {
    const {
      userCenter: {
        visible,
      list,
      total,
      pageIndex,
      pageSize,
      keyWord,
      wxInfo
      },
      loading: {
        effects: {
          "userCenter/getList": initLoading = false,
        "userCenter/viewWx": wxLoading = false,
        }
      }
    } = this.props;
    return (
      <div>
        <Row>
          <Col span={8} offset={16}>
            <Input.Search placeholder="请输入姓名或电话号码进行查询" onSearch={(val) => this.getList(1, 10, val)} />
          </Col>
        </Row>
        <Table columns={this.columns} style={{ marginTop: 30 }} dataSource={list} rowKey={record => record._id} loading={initLoading} pagination={{
          current:pageIndex,
          pageSize,
          total,
          onChange:(current)=>this.getList(current,pageSize,keyWord),
          showSizeChanger:true,
          onShowSizeChange:(current,size)=>this.getList(1,size,keyWord),
          showTotal:total => `共${total}条`
      }}/>
        <Modal title="查看微信信息" visible={visible} footer={false} onCancel={this.closeModal} maskClosable={false}>
          <Spin spinning={wxLoading}>
            <Row gutter={32}>
              <Col span={12}>
                <img src={wxInfo.headimgurl} style={{ width: "100%" }} />
              </Col>
              <Col span={12}>
                <span>昵称：{wxInfo.nickname}</span>
                <Divider />
                <span>国家：{wxInfo.country}</span>
                <Divider />
                <span>省份：{wxInfo.province}</span>
                <Divider />
                <span>城市：{wxInfo.city}</span>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </div>
    )
  }
}

export default connect(({ userCenter, loading }) => ({ userCenter, loading }))(Form.create()(userIndex));
