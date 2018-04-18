import React from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Row, Col, Form, Select, Spin, Divider,Modal,Card } from 'antd';
const { Item } = Form, { Option } = Select;
import { routerRedux } from 'dva/router';
import { HeadTitle } from '../../components/components';
import QueueAnim from 'rc-queue-anim';

class studentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const { getFieldDecorator, validateFields, resetFields, isFieldsTouched, getFieldValue } = props.form;
    this.getFieldDecorator = getFieldDecorator;
    this.validateFields = validateFields;
    this.resetFields = resetFields;
    this.isFieldsTouched = isFieldsTouched;
    this.getFieldValue = getFieldValue;
  }

  state = {
    schoolZoneId: null,
    academicYearId: null
  }

  displayName = {
    studentNumber:"学号",
    classesName:"班级",
    name:"姓名",
    genderText:"性别",
    birthday:"生日",
    nativePlace:"籍贯",
    censusRegisterNatureText:"户籍性质",
    creationTime:"创建时间",
    guardianCount:"监护人数量",
    nationalityName:"国籍",
    schoolZoneName:"校区",
    placeOfDomicile:"户籍所在地",
    familyAddress:"家庭住址"
  }

  action = (text, record, index) => {
    return (
      <span>
        <a>编辑</a>
        <Divider type="vertial" />
        <a>删除</a>
        <Divider type="vertial" />
        <a>查看监护人</a>
        <Divider type="vertial" />
        <a>添加监护人</a>
      </span>
    )
  }

  columns = [
    { title: "学号", dataIndex: "studentNumber", key: "studentNumber" },
    { title: "班级", dataIndex: "classesName", key: "classesName" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "性别", dataIndex: "genderText", key: "genderText" },
    { title: "操作", render: this.action, key: "action" },
  ]

  layout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }

  schoolChange = (schoolZoneId) => {
    this.resetFields(["classesId"])
    const academicYearId = this.state.academicYearId
    this.setState({ schoolZoneId })
    this.dispatch({
      type: "student/classConfig",
      payload: {
        schoolZoneId,
        academicYearId
      }
    })
  }

  scheduleChange = (academicYearId) => {
    this.resetFields(["classesId"])
    const schoolZoneId = this.state.schoolZoneId;
    this.setState({ academicYearId })
    this.dispatch({
      type: "student/classConfig",
      payload: {
        schoolZoneId,
        academicYearId
      }
    })
  }

  getList = (page, maxResultCount, search) => {
    this.dispatch({
      type: "student/studentList",
      payload: {
        page,
        maxResultCount,
        ...search
      }
    })
  }

  reset = () => {
    this.resetFields();
    this.getList(1, 10, {})
  }

  search = () => {
    this.validateFields((err, val) => {
      if (!err) {
        this.getList(1, 10, val)
      }
    })
  }

  expand = (record)=>{
    const keys = Object.keys(this.displayName);
    const parentsColumns = [
      {title:"姓名",dataIndex:"name",key:"name"},
      {title:"电话",dataIndex:"mobile",key:"mobile"},
      {title:"关系",dataIndex:"relationShip",key:"relationShip"}
    ]
    return (
      <Row gutter={32}>
      <Col span={12}>
      <Card title="详情" hoverable={true}>
      {
        keys.map((item,key)=>(
          <Row key={key}>
          <Col span={8} style={{textAlign:"right",color:"#999"}}>{this.displayName[item]}：</Col>
          <Col span={16}>{record[item]}</Col>
          </Row>
        ))
      }
      </Card>
      </Col>
      <Col span={12}>
      <Card title="监护人信息" hoverable={true}>
      <Table columns={parentsColumns} dataSource={record.guardianChildOutputes} rowKey={record => record.id} pagination={false} size="small"/>
      </Card>
      </Col>
      </Row>
    )
  }

  render() {
    const {
      student: {
        config: {
          schoolZoneList = [],
      academicYearList = []
        },
      classConfig = [],
      items = [],
      page,
      maxResultCount,
      totalCount,
      schoolZoneId,
      classesId,
      academicYearId,
      filter
      },
      loading: {
        effects: {
          "student/classConfig": classLoading = false,
        "student/studentList": initLoading = false
        }
      }
    } = this.props;
    return (
      <div>
        <HeadTitle name={"学生列表"} />
        <Row>
          <Col span={8}>
            <Item label={"校区"} {...this.layout}>
              {
                this.getFieldDecorator('schoolZoneId')(
                  <Select placeholder={"请选择"} style={{ width: "100%" }} onChange={this.schoolChange} allowClear={true}>
                    {
                      schoolZoneList.map((item, key) => (
                        <Option value={`${item.value}`} key={key}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Item>
          </Col>
          <Col span={8}>
            <Item label={"学届"} {...this.layout}>
              {
                this.getFieldDecorator('academicYearId')(
                  <Select placeholder={"请选择"} style={{ width: "100%" }} onChange={this.scheduleChange} allowClear={true}>
                    {
                      academicYearList.map((item, key) => (
                        <Option value={`${item.value}`} key={key}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Item>
          </Col>
          <Col span={8}>
            <Spin spinning={classLoading} size={"small"}>
              <Item label={"班级"} {...this.layout}>
                {
                  this.getFieldDecorator('classesId')(
                    <Select placeholder={classConfig.length === 0 ? "请先选择校区或学届" : "请选择"} style={{ width: "100%" }}>
                      {
                        classConfig.map((item, key) => (
                          <Option value={`${item.value}`} key={key}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
            </Spin>
          </Col>
          <Col span={8}>
            <Item label={"关键词"} {...this.layout}>
              {
                this.getFieldDecorator('filter')(
                  <Input placeholder={"请输入"} />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row style={{ marginBottom: 30 }}>
          <Col span={12} offset={2}>
            <Button type={"primary"} style={{ marginRight: 10 }} onClick={() => this.dispatch(routerRedux.push('/student/check'))}>录入学生</Button>
            <Button type={"primary"} style={{ marginRight: 10 }} onClick={this.search}>查询</Button>
            <Button style={{ marginRight: 10 }} onClick={this.reset}>重置查询</Button>
          </Col>
        </Row>
        <Table columns={this.columns} size={"middle"} rowKey={record => record.id} dataSource={items} loading={initLoading} pagination={{
          current: page,
          pageSize: maxResultCount,
          total: totalCount,
          onChange: (current) => this.getList(current, maxResultCount, { filter, schoolZoneId, classesId, academicYearId }),
          showSizeChanger: true,
          onShowSizeChange: (current, size) => this.getList(1, size, { filter, schoolZoneId, classesId, academicYearId }),
          showTotal: total => `共${total}条`
        }} expandedRowRender={this.expand} />
      </div>
    )
  }
}

export default connect(({ student, loading }) => ({ student, loading }))(Form.create()(studentList));
