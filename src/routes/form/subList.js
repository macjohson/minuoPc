import React from 'react';
import { connect } from 'dva';
import {Input,Table,Button,Row,Col} from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

class subList extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    this.activityId = queryString.parse(props.location.search).id;
  }

  getList = (page,maxResultCount,filter) => {
    this.dispatch({
      type:"form/joinList",
      payload:{
        activityId:this.activityId,
        page,
        maxResultCount,
        filter
      }
    })
  }

  columns = [
    {title:"活动名称",dataIndex:"activityName",key:"activityName"},
    {title:"家长姓名",dataIndex:"name",key:"name"},
    {title:"家长性别",dataIndex:"genderText",key:"genderText"},
    {title:"电话号码",dataIndex:"phoneNumber",key:"phoneNumber"},
    {title:"学生姓名",dataIndex:"studentName",key:"studentName"},
    {title:"学生生日",dataIndex:"birthdayText",key:"birthdayText"},
    {title:"学校",dataIndex:"school",key:"school"},
    {title:"报名时间",dataIndex:"time",key:"time"}
  ]

  export = ()=>{
    const {id} = queryString.parse(window.location.search);
    this.dispatch({
      type:"form/export",
      opts:{
        Id:id
      }
    })
  }

  render(){
    const {
      form:{
        joinList:{
          items,
          page,
          maxResultCount,
          filter,
          totalCount,
        },
        downloadUrl
      },
      loading:{
        effects:{
          "form/joinList":initLoading = false,
          "form/export":exportLoading = false
        }
      }
    } = this.props;
    return (
      <div>
        <Row style={{marginBottom:30}}>
          <Col span={4}>
            <Button type={"dashed"} onClick={()=>this.dispatch(routerRedux.push('/form'))}>返回列表</Button>
          </Col>
          <Col span={4}>
            <Button onClick={this.export} loading={exportLoading}>{
              downloadUrl ?
                <a href={downloadUrl} download>下载</a> :
                "导出Excel"
            }</Button>
          </Col>
          <Col span={8} offset={12}>
            <Input.Search placeholder={"姓名/电话号码"} onSearch={(val)=>this.getList(1,10,val)}/>
          </Col>
        </Row>
        <Table columns={this.columns} rowKey={record=>record.id} loading={initLoading} dataSource={items} size={"middle"} pagination={{
          current:page,
          pageSize:maxResultCount,
          total:totalCount,
          onChange:(current)=>this.getList(current,maxResultCount,filter),
          showSizeChanger:true,
          onShowSizeChange:(current,size)=>this.getList(1,size,filter),
          showTotal:total=>`共${total}条`
        }}/>
      </div>
    )
  }
}

export default connect(({form,loading})=>({form,loading}))(subList)
