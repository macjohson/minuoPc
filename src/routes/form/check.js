import React from 'react';
import {connect} from 'dva';
import {Form,Input,Select,DatePicker,Spin} from 'antd'
import {routerRedux} from 'dva/router';
const {Item} = Form,{Option} = Select;
import {defaultLayout,leaveFormTip} from '../../utils/common';
import FormBtn from '../../components/FormBtn';
import moment from 'moment';
import queryString from 'query-string';
import {HeadTitle} from "../../components/components";

class formCheck extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    const {getFieldDecorator,validateFields,resetFields,isFieldsTouched} = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.isFieldsTouched = isFieldsTouched;
    this.id = queryString.parse(props.location.search).id;
  }


  submit = ()=>{
    this.validateFields((err,val)=>{
      if(!err){
        val.startTime = moment(val.startTime).format("YYYY-MM-DD");
        val.endTime = moment(val.endTime).format("YYYY-MM-DD");
        val.id = this.id ? this.id : null;

        this.dispatch({
          type:"form/check",
          payload:val
        })
      }
    })
  }

  cancel = ()=>{
    const goBack = ()=>{
      this.resetFields();
      this.dispatch({
        type:"form/update",
        payload:{
          info:{}
        }
      })
      this.dispatch(routerRedux.push('/form'))
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
          "form/check":checkLoading = false,
          "form/detail":initLoading = false
        }
      },
      formModel:{
        info
      }
    } = this.props;
    return (
      <Spin spinning={initLoading}>
        <HeadTitle name={this.id ? "编辑活动" : "新建活动"}/>
        <Form>
          <Item label={"活动主题"} {...defaultLayout}>
            {
              this.getFieldDecorator('title',{
                rules:[
                  {required:true,message:"请填写活动主题"}
                ],
                initialValue:info.title
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"报名开始时间"} {...defaultLayout}>
            {
              this.getFieldDecorator('startTime',{
                rules:[
                  {required:true,message:"请选择报名开始时间"}
                ],
                initialValue:info.startTime ? moment(info.startTime) : null
              })(
                <DatePicker/>
              )
            }
          </Item>
          <Item label={"报名结束时间"} {...defaultLayout}>
            {
              this.getFieldDecorator('endTime',{
                rules:[
                  {required:true,message:"请选择报名结束时间"}
                ],
                initialValue:info.endTime ? moment(info.endTime) : null
              })(
                <DatePicker/>
              )
            }
          </Item>
          <Item label={"活动约定人数"} {...defaultLayout}>
            {
              this.getFieldDecorator('personalCount',{
                rules:[
                  {required:true,message:"请填写活动约定人数"}
                ],
                initialValue:info.personalCount
              })(
                <Input placeholder={"请输入"} type={"number"}/>
              )
            }
          </Item>
          <Item label={"是否允许超员报名"} {...defaultLayout}>
            {
              this.getFieldDecorator('isOverman',{
                rules:[
                  {required:true,message:"请选择"}
                ],
                initialValue:info.isOverman ? "true" : "false"
              })(
                <Select placeholder={"请选择"}>
                  <Option value={"true"}>允许</Option>
                  <Option value={"false"}>不允许</Option>
                </Select>
              )
            }
          </Item>
          <Item label={"活动性质"} {...defaultLayout}>
            {
              this.getFieldDecorator('schemaKind',{
                rules:[
                  {required:true,message:"请选择活动性质"}
                ],
                initialValue:info.schemaKind ? `${info.schemaKind}` : null
              })(
                <Select placeholder={"请选择"}>
                  <Option value={"1"}>公益</Option>
                  <Option value={"2"}>收费</Option>
                </Select>
              )
            }
          </Item>
        </Form>
        <FormBtn loading={checkLoading} onOk={this.submit} onCancel={this.cancel}/>
      </Spin>
    )
  }
}

export default connect(({form:formModel,loading})=>({formModel,loading}))(Form.create()(formCheck));
