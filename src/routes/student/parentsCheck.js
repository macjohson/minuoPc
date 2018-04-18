import React from 'react';
import { connect } from 'dva';
import { Input, Form,Spin } from 'antd';
import { HeadTitle } from '../../components/components';
import FormBtn from '../../components/FormBtn';
import queryString from 'query-string';
import { defaultLayout,leaveFormTip } from '../../utils/common';

class parentsCheck extends React.PureComponent {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
        const { getFieldDecorator, validateFields, resetFields, isFieldsTouched } = props.form;
        this.getFieldDecorator = getFieldDecorator;
        this.validateFields = validateFields;
        this.resetFields = resetFields;
        this.isFieldsTouched = isFieldsTouched;
        this.id = queryString.parse(window.location.search).id;
    }

    fields = [
        { label: "监护人姓名", value: "name" },
        { label: "工作单位", value: "workUnit" },
        { label: "职务", value: "post" },
        { label: "文化程度", value: "education" },
        { label: "手机号码", value: "mobile" }
    ]

    submit = ()=>{
      this.validateFields((err,val)=>{
          if(!err){
              val.id = this.id ? this.id : null;
              this.dispatch({
                  type:"parents/check",
                  payload:val
              })
          }
      })
    }

    cancel = ()=>{
       const goBack = ()=>{
            this.dispatch({type:"parents/update",payload:{info:{}}})
            this.props.history.goBack();
        }

        if(this.isFieldsTouched()){
            leaveFormTip(goBack)
            return 
        }

        goBack();
    }

    render() {
        return (
            <Spin spinning={this.props.loading.effects["parents/detail"]}>
                <HeadTitle name={this.id ? "编辑监护人" : "新增监护人"} />
                {
                    this.fields.map((item, key) => (
                        <Form.Item label={item.label} {...defaultLayout} key={key}>
                            {
                                this.getFieldDecorator(item.value,{
                                    rules:[{required:true,message:`请填写${item.label}`}],
                                    initialValue:this.props.parents.info[item.value]
                                })(
                                    <Input placeholder="请输入" type={item.value === "mobile" ? "number" : ""}/>
                                )
                            }
                        </Form.Item>
                    ))
                }
                <FormBtn loading={this.props.loading.effects["parents/check"]} onOk={this.submit} onCancel={this.cancel}/>
            </Spin>
        )
    }
}

export default connect(({ parents, loading }) => ({ parents, loading }))(Form.create()(parentsCheck));