import React from 'react';
import { connect } from 'dva';
import {Form,Input,Button,Row,Col} from 'antd';
import {HeadTitle} from '../../components/components';
const {Item} = Form;
import {defaultLayout,leaveFormTip} from '../../utils/common';
import FormBtn from '../../components/FormBtn';
import queryString from 'query-string';
import {routerRedux} from 'dva/router';
import QueueAnim from 'rc-queue-anim';

class checkSchool extends React.PureComponent{
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
      this.info = JSON.parse(localStorage.getItem('checkSchool'))
    }else{
      this.info = {}
    }
  }

  submit = ()=>{
    this.validateFields((err,val)=>{
      if(!err){
        val.id = this.id ? this.id : null
        this.dispatch({
          type:"baseData/checkSchool",
          payload:val
        })
      }
    })
  }

  cancel = ()=>{
    const goBack = ()=>{
      localStorage.removeItem("checkSchool");
      this.resetFields()
      this.dispatch(routerRedux.push('/school'))
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
          "baseData/checkSchool":saveLoading = false
        }
      }
    } = this.props;

    return (
      <QueueAnim type="left">
        <HeadTitle name={"校区维护"} key="a"/>
        <Form key="b">
          <Item label={"校区名称"} {...defaultLayout}>
            {
              this.getFieldDecorator('schoolZoneName',{
                rules:[
                  {required:true,message:"请填写校区名称"}
                ],
                initialValue:this.info.schoolZoneName
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"备注"} {...defaultLayout}>
            {
              this.getFieldDecorator('remark',{
                rules:[
                  {required:true,message:"请填写备注"}
                ],
                initialValue:this.info.remark
              })(
                <Input.TextArea rows={4} placeholder={"请输入"}/>
              )
            }
          </Item>
        </Form>
        <FormBtn key="c" onOk={this.submit} onCancel={this.cancel} loading={saveLoading}/>
      </QueueAnim>
    )
  }
}

export default connect(({baseData,loading})=>({baseData,loading}))(Form.create()(checkSchool))
