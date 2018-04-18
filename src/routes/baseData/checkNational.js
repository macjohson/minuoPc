import React from 'react';
import { connect } from 'dva';
import {Form,Input,Button,Row,Col} from 'antd';
import {HeadTitle} from '../../components/components';
const {Item} = Form;
import {defaultLayout,leaveFormTip} from '../../utils/common';
import FormBtn from '../../components/FormBtn';
import queryString from 'query-string';
import {routerRedux} from 'dva/router';

class checkNational extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    const { getFieldDecorator,validateFields,resetFields,isFieldsTouched} = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.isFieldsTouched = isFieldsTouched;
    this.id = queryString.parse(props.location.search).id;
    if(this.id){
      this.info = JSON.parse(localStorage.getItem('checkNational'))
    }else{
      this.info = {}
    }
  }

  submit = ()=>{
    this.validateFields((err,val)=>{
      if(!err){
        val.id = this.id ? this.id : null
        this.dispatch({
          type:"baseData/checkNational",
          payload:val
        })
      }
    })
  }

  cancel = ()=>{
    const goBack = ()=>{
      localStorage.removeItem("checkNational");
      this.resetFields()
      this.dispatch(routerRedux.push('/national'))
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
          "baseData/checkNational":saveLoading = false
        }
      }
    } = this.props;

    return (
      <div>
        <HeadTitle name={"国籍维护"}/>
        <Form>
          <Item label={"国籍名称"} {...defaultLayout}>
            {
              this.getFieldDecorator('name',{
                rules:[
                  {required:true,message:"请填写国籍名称"}
                ],
                initialValue:this.info.name
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
        </Form>
        <FormBtn onOk={this.submit} onCancel={this.cancel} loading={saveLoading}/>
      </div>
    )
  }
}

export default connect(({baseData,loading})=>({baseData,loading}))(Form.create()(checkNational))
