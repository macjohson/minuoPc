import React from 'react';
import {connect} from 'dva';
import {Button,Table,Input,Row,Col} from 'antd';


class interimenroll extends React.PureComponent{
  constructor(props){
    super(props);
    this.columns = [
      {
        title:"家长姓名",
        dataIndex:"name"
      },
      {
        title:"家长性别",
        dataIndex:"genderText"
      },
      {
        title:"学生姓名",
        dataIndex:"studentName"
      },
      {
        title:"学生性别",
        dataIndex:"studentGenderText"
      },
      {
        title:"电话号码",
        dataIndex:"phoneNumber"
      },
      {
        title:"学生生日",
        dataIndex:"birthdayText"
      },
      {
        title:"现所在学校",
        dataIndex:"school"
      },
      {
        title:"报读",
        dataIndex:"classes"
      },
      {
        title:"入读时间",
        dataIndex:"inReadTime"
      },
      {
        title:"报名时间",
        dataIndex:"time"
      }
    ]
  }

  getList = (page,maxResultCount,filter)=>{
    this.props.dispatch({
      type:"interimenroll/list",
      opts:{
        page,
        maxResultCount,
        filter
      }
    })
  };
  render(){
    console.log(this.props);
    const {
      interimenroll:{
        page,
        maxResultCount,
        filter,
        items,
        totalCount,
        url
      },
      loading:{
        effects:{
          "interimenroll/list":initLoading = false,
          "interimenroll/export":exportLoading = false
        }
      }
    } = this.props;

    return (
      <div>
        <Row style={{marginBottom:30}}>
          <Col span={4}>
            <Button type={url ? "dashed" : "primary"} loading={exportLoading} onClick={url ? null : ()=>this.props.dispatch({
              type:"interimenroll/export"
            })}>{
              url ?
                <a href={url} download>下载Excel</a> :
                "生成Excel"
            }</Button>
          </Col>
          <Col span={8} offset={12}>
            <Input.Search placeholder={"输入关键词进行搜索"} onSearch={val => this.getList(1,10,val)}/>
          </Col>
        </Row>
        <Table columns={this.columns} rowKey={r => r.id} dataSource={items} loading={initLoading} pagination={{
          current:page,
          pageSize:maxResultCount,
          total:totalCount,
          onChange:(c)=>this.getList(c,maxResultCount,filter),
          showSizeChanger:true,
          onShowSizeChange:(c,s)=>this.getList(1,s,filter),
          showTotal:T => `共${T}条`
        }}/>
      </div>
    )
  }
}

export default connect(({interimenroll,loading})=>({interimenroll,loading}))(interimenroll)
