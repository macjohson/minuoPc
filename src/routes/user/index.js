import React from 'react';
import {connect} from 'dva';
import {Button,Table,Input,Row,Col,Divider,Modal} from 'antd';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';

class userList extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
  }


  getList = (page,maxResultCount,filter)=>{
    this.dispatch({
      type:"user/getList",
      payload:{
        page,
        maxResultCount,
        filter
      }
    })
  }

  setStatus = (Id)=>{
    this.dispatch({
      type:"user/setStatus",
      payload:{
        Id
      }
    })
  }

  delete = (Id)=>{
    Modal.confirm({
      title:"操作提示",
      content:"确定要删除该用户？",
      onOk:()=>this.dispatch({type:"user/delete",payload:{Id}})
    })
  }

  action = (text,record)=>{
    return (
      <span>
        {
          record.isActive ?
            <a onClick={()=>this.setStatus(record.id)}>禁用</a> :
            <a onClick={()=>this.setStatus(record.id)}>启用</a>
        }
        <Divider type={"vertical"}/>
        <a onClick={()=>this.editBtn(record.id)}>编辑</a>
        <Divider type={"vertical"}/>
        <a onClick={()=>this.delete(record.id)}>删除</a>
      </span>
    )
  }

  search = (value)=>{
    this.getList(1,10,value)
  }

  editBtn = (id)=>{
    this.dispatch(routerRedux.push(`/user/check?${queryString.stringify({id})}`))
  }

  columns = [
    {title:"用户名",dataIndex:"userName",key:"userName"},
    {title:"姓名",dataIndex:"name",key:"name"},
    {title:"电话",dataIndex:"phoneNumber",key:"phoneNumber"},
    {title:"是否启用",dataIndex:"isActiveText",key:"isActiveText"},
    {title:"创建时间",dataIndex:"creationTimeText",key:"creationTimeText"},
    {title:"操作",render:this.action,key:"action"}
  ]

  render(){
    const {
      user:{
        items,
        totalCount,
        maxResultCount,
        filter,
        page
      },
      loading:{
        effects:{
          "user/getList":initLoading = false
        }
      }
    } = this.props;

    return (
      <div>
        <Row style={{marginBottom:30}}>
          <Col span={4}>
            <Button type={"primary"} onClick={()=>this.dispatch(routerRedux.push('/user/check'))}>新增用户</Button>
          </Col>
          <Col span={8} offset={12}>
            <Input.Search placeholder={"用户名/姓名/电话"} onSearch={this.search}/>
          </Col>
        </Row>
        <Table columns={this.columns} dataSource={items} loading={initLoading} rowKey={record => record.id} pagination={{
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

export default connect(({user,loading})=>({user,loading}))(userList);
