import React from 'react';
import {connect} from 'dva';
import {Button,Table,Row,Col,Input,Divider,Modal,Popover} from 'antd';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';
import QRCode from 'qrcode.react';
import {mobileConfig} from '../../utils/common';
import QueueAnim from 'rc-queue-anim';


class formIndex extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
  }

  editBtn = (id)=>{
    this.dispatch(routerRedux.push(`/form/check?${queryString.stringify({id})}`));
  }

  subList = (id)=>{
    this.dispatch(routerRedux.push(`/form/subList?id=${id}`));
  }

  action = (text,record)=>{
    return (
      <span>
        <a onClick={()=>this.editBtn(record.id)}>编辑</a>
        <Divider type={"vertical"}/>
        <a onClick={()=>this.del(record.id)}>删除</a>
        <Divider type={"vertical"}/>
        <a onClick={()=>this.subList(record.id)}>报名表</a>
        <Divider type={"vertical"}/>
        <Popover content={<QRCode value={`${mobileConfig.mobileUrl}/form?id=${record.id}`}/>} trigger={"click"}>
          <a>报名二维码</a>
        </Popover>
      </span>
    )
  }

  del = (Id)=>{
    Modal.confirm({
      title:"操作提示",
      content:"确定要删除该活动？",
      onOk:()=>{
        this.dispatch({
          type:"form/del",
          payload:{
            Id
          }
        })
      }
    })
  }

  getList = (page,maxResultCount,filter)=>{
    this.dispatch({
      type:"form/list",
      payload:{
        page,
        maxResultCount,
        filter
      }
    })
  }

  columns = [
    {title:"活动主题",dataIndex:"title",key:"title"},
    {title:"报名时间",dataIndex:"time",key:"time"},
    {title:"活动约定人数",dataIndex:"personalCount",key:"personalCount"},
    {title:"活动性质",dataIndex:"schemaKindText",key:"schemaKindText"},
    {title:"操作",render:this.action,key:"action"},
  ]

  search = (value)=>{
    this.getList(1,10,value)
  }

  render(){
    const {
      form:{
        items,
        totalCount,
        page,
        maxResultCount,
        filter
      },
      loading:{
        effects:{
          "form/list":initLoading = false
        }
      }
    } = this.props;
    return (
      <div>
        <Row style={{marginBottom:30}} key="a">
          <Col span={4}>
            <Button type={"primary"} onClick={()=>this.dispatch(routerRedux.push("/form/check"))}>新增活动</Button>
          </Col>
          <Col span={8} offset={12}>
            <Input.Search placeholder={"活动主题"} onSearch={this.search}/>
          </Col>
        </Row>
        <Table key="b" columns={this.columns} rowKey={record => record.id} loading={initLoading} dataSource={items} size={"middle"} pagination={{
          current:page,
          pageSize:maxResultCount,
          total:totalCount,
          onChange:(current)=>this.getList(current,maxResultCount,filter),
          showSizeChanger:true,
          onShowSizeChange:(current,size)=>this.getList(1,size,filter),
          showTotal:total => `共${total}条`
        }}/>
      </div>
    )
  }
}

export default connect(({form,loading})=>({form,loading}))(formIndex)
