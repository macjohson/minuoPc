import React from 'react';
import {connect} from 'dva';
import {Form,Row,Col,Button,Select,Input,DatePicker,Cascader,Radio,Spin,Table} from 'antd'
const {Item} = Form,{Option} = Select,{Group} = Radio;
import {HeadTitle} from '../../components/components';
import {fetch} from '../../utils/common';
import apis from '../../services/student';
import FormBtn from '../../components/FormBtn';

class studentCheck extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    const {getFieldDecorator,validateFields,resetFields,isFieldsTouched} = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.isFieldsTouched = isFieldsTouched;
  }

  state = {
    visible:false
  }

  layout = {
    labelCol:{
      span:4
    },
    wrapperCol:{
      span:8
    }
  }

  columns = [
    {title:"序号",render:(text,record,index)=>index+1,key:"serial"},
    {title:"姓名",dataIndex:"name",key:"name"},
    {title:"电话",dataIndex:"phone",key:"phone"},
    {title:"关系",render:(text,record,index)=><Input placeholder={"请输入监护人与学生的关系"} onChange={(e)=>this.relationShipChange(e,record)}/>},
  ]

  relationShipChange = (e,record)=>{
    this.dispatch({
      type:"student/setRelationShip",
      value:e.target.value,
      record
    })
  }

  classChange = (value,options)=>{
    if(options.length === 3){
      this.setState({visible:false})
    }

    if(options.length > 1){
      const schoolZoneId = options[0].value;
      const academicYearId = options[1].value;

      const school = options[0];

      const target = options[1];

      this.dispatch({
        type:"student/classConfig",
        payload:{schoolZoneId,academicYearId},
        target,
        school
      })
    }
  }

  submit = ()=>{
    this.validateFields((err,val)=>{
      if(!err){
        console.log(val)
      }
    })
  }

  cancel = ()=>{

  }

  parentChange = (value)=>{
    this.dispatch({
      type:"student/setParent",
      value
    })
  }

  search = (value)=>{
    let _val = value;
    if(value === ""){
      _val = null
    }
    this.dispatch({
      type:"student/parentConfig",
      filter:_val
    })
  }

  render(){
    const {
      student:{
        config:{
          nationLityList = [], //国籍
          schoolZoneList = [], //校区
          academicYearList = [], //学届
          genderList = [], //性别
          censusRegisterNatureList = [], //户籍类型
        },
        options = [],
        parentConfig = [],
        dataSource
      },
      loading:{
        effects:{
          "student/check":saveLoading = false,
          "student/parentConfig":searchLoading = false
        }
      }
    } = this.props;
    
    return (
      <div>
        <HeadTitle name={"录入学生"}/>
        <Form>
          <Item label={"国籍"} {...this.layout}>
            {
              this.getFieldDecorator('1',{
                rules:[
                  {required:true,message:"请选择学生国籍"}
                ]
              })(
                <Select placeholder={"请选择"}>
                  {
                    nationLityList.map((item,key)=>(
                      <Option key={key} value={`${item.value}`}>{item.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Item>
          <Item label={"班级"} {...this.layout}>
            {
              this.getFieldDecorator('2',{
                rules:[
                  {required:true,message:"请选择学生班级"}
                ]
              })(
                <Cascader placeholder={"请选择"} options={options} notFoundContent={"暂无数据"} changeOnSelect onChange={this.classChange} onClick={()=>this.setState({visible:true})} popupVisible={this.state.visible}/>
              )
            }
          </Item>
          <Item label={"姓名"} {...this.layout}>
            {
              this.getFieldDecorator('3',{
                rules:[
                  {required:true,message:"请填写学生姓名"}
                ]
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"性别"} {...this.layout}>
            {
              this.getFieldDecorator('4',{
                rules:[
                  {required:true,message:"请选择学生性别"}
                ]
              })(
                <Group>
                  {
                    genderList.map((item,key)=>(
                      <Radio key={key} value={item.value}>{item.name}</Radio>
                    ))
                  }
                </Group>
              )
            }
          </Item>
          <Item label={"出生年月"} {...this.layout}>
            {
              this.getFieldDecorator('5',{
                rules:[
                  {required:true,message:"请选择学生出生年月"}
                ]
              })(
                <DatePicker/>
              )
            }
          </Item>
          <Item label={"身份证号码"} {...this.layout}>
            {
              this.getFieldDecorator('studentIDCard',{
                rules:[
                  {required:true,message:"请输入学生身份证号码"}
                ]
              })(
                <Input placeholder={"请输入"} type={"number"}/>
              )
            }
          </Item>
          <Item label={"户籍类型"} {...this.layout}>
            {
              this.getFieldDecorator("censusRegisterNature",{
                rules:[{required:true,message:"请选择户籍类型"}]
              })(
                <Group>
                  {
                    censusRegisterNatureList.map((item,key)=>(
                      <Radio key={key} value={item.value}>{item.name}</Radio>
                    ))
                  }
                </Group>
              )
            }
          </Item>
          <Item label={"籍贯"} {...this.layout}>
            {
              this.getFieldDecorator('6',{
                rules:[
                  {required:true,message:"请填写学生籍贯"}
                ]
              })(
                <Input placeholder={"请输入"}/>
              )
            }
          </Item>
          <Item label={"户籍所在地"} {...this.layout}>
            {
              this.getFieldDecorator('placeOfDomicile',{
                rules:[{required:true,message:"请输入户籍所在地"}]
              })(
                <Input placeholder={"请输入"} />
              )
            }
          </Item>
          <Item label={"家庭住址"} {...this.layout}>
            {
              this.getFieldDecorator('familyAddress',{
                rules:[{required:true,message:"请输入家庭住址"}]
              })(
                <Input placeholder={"请输入"} />
              )
            }
          </Item>
          <Item label={"监护人"} {...this.layout} required={true}>
            <Select placeholder={"请输入监护人姓名/手机号/工作单位/职位进行搜索"} labelInValue mode="multiple" notFoundContent={<Spin size={"small"} spinning={searchLoading}/>} onSearch={this.search} filterOption={false} onChange={this.parentChange}>
              {
                parentConfig.map((item,key)=>(
                  <Option key={item.value} value={`${item.value}`}>{item.name}</Option>
                ))
              }
            </Select>
          </Item>
          <Row style={{marginBottom:20}}>
            <Col span={20} offset={4}>
              <Table columns={this.columns} size={"small"} dataSource={dataSource} rowKey={record => record.id} pagination={false}/>
            </Col>
          </Row>
        </Form>
        <FormBtn onOk={this.submit} onCancel={this.cancel} loading={saveLoading}/>
      </div>
    )
  }
}

export default connect(({student,loading})=>({student,loading}))(Form.create()(studentCheck))
