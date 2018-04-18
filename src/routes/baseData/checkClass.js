import React from 'react';
import { connect } from 'dva';
import {Form,Input,Select,Spin} from 'antd';
const {Item} = Form,{Option} = Select;
import {defaultLayout,leaveFormTip} from '../../utils/common';
import {HeadTitle} from '../../components/components';
import FormBtn from '../../components/FormBtn';
import queryString from 'query-string';
import {routerRedux} from 'dva/router';

class checkClass extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    const { getFieldDecorator,validateFields,resetFields,isFieldsTouched} = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.isFieldsTouched = isFieldsTouched;
    this.id = queryString.parse(props.location.search).id;
  }

  submit = ()=>{
    this.validateFields((err,val)=>{
      if(!err){
        val.id = this.id ? this.id : null;
        this.dispatch({
          type:"baseData/checkClass",
          payload:val
        })
      }
    })
  }

  cancel = ()=>{
    const goBack = ()=>{
      this.resetFields();
      this.dispatch({type:"baseData/update",payload:{info:{}}})
      this.dispatch(routerRedux.push('/class'))
    }

    if(this.isFieldsTouched()){
      leaveFormTip(goBack)
      return
    }

    goBack();
  }

  render(){
    const {
      loading:{
        effects:{
          "baseData/checkClass":saveLoading = false,
          "baseData/classDetail":initLoading = false,
          "baseData/config":configLoading = false,
        }
      },
      baseData:{
        config:{
          schoolZoneList = [], //校区
          academicYearList = [] //学届
        },
        info = {}
      }
    } = this.props;
    return (
      <Spin spinning={initLoading || configLoading}>
        <HeadTitle name={"班级维护"}/>
        <Form>
          <Item label={"所属校区"} {...defaultLayout}>
            {
              this.getFieldDecorator('schoolZoneId',{
                rules:[{required:true,message:"请选择校区"}],
                initialValue:info.schoolZoneId ? info.schoolZoneId.toString() : null
              })(
                <Select placeholder={"请选择"}>
                  {
                    schoolZoneList.map((item,key)=>(
                      <Option value={`${item.value}`} key={key}>{item.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Item>
          <Item label={"学届"} {...defaultLayout}>
            {
              this.getFieldDecorator('academicYearId',{
                rules:[{required:true,message:"请选择学届"}],
                initialValue:info.academicYearId ? info.academicYearId.toString() : null
              })(
                <Select placeholder={"请选择"}>
                  {
                    academicYearList.map((item,key)=>(
                      <Option value={`${item.value}`} key={key}>{item.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Item>
          <Item label={"班级名称"} {...defaultLayout}>
            {
              this.getFieldDecorator('className',{
                rules:[{required:true,message:"请填写班级名称"}],
                initialValue:info.className
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"描述"} {...defaultLayout}>
            {
              this.getFieldDecorator('note',{
                rules:[{required:true,message:"请填写班级描述"}],
                initialValue:info.className
              })(
                <Input.TextArea placeholder={"请输入"} rows={4}/>
              )
            }
          </Item>
        </Form>
        <FormBtn onOk={this.submit} onCancel={this.cancel} loading={saveLoading}/>
      </Spin>
    )
  }
}

export default connect(({baseData,loading})=>({baseData,loading}))(Form.create()(checkClass));
