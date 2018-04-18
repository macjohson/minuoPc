import React from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Row, Col,Divider,Modal } from 'antd';
import QueueAnim from 'rc-queue-anim';

class parentsIndex extends React.PureComponent {
    action = (text,record,index)=>{
        return (
            <span>
            <a onClick={()=>this.props.history.push(`/guardian/check?id=${record.id}`)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={()=>this.del(record.id)}>删除</a>
            </span>
        )
    }
    columns = [
        { title: "监护人姓名", dataIndex: "name", key: "name" },
        { title: "工作单位", dataIndex: "workUnit", key: "workUnit" },
        { title: "职务", dataIndex: "post", key: "post" },
        { title: "文化程度", dataIndex: "education", key: "education" },
        { title: "手机号码", dataIndex: "mobile", key: "mobile" },
        { title: "创建时间", dataIndex: "creationTimeText", key: "creationTimeText" },
        { title: "操作", render:this.action, key: "action" },
    ]

    del  = (Id)=>{
        Modal.confirm({
            title:"操作提示",
            content:"确定要删除该监护人？",
            onOk:()=>this.props.dispatch({
                type:"parents/del",
                payload:{
                    Id
                }
            })
        })
    }

    getList = (page,maxResultCount,filter)=>{
        this.props.dispatch({
            type:"parents/list",
            payload:{
                page,
                maxResultCount,
                filter
            }
        })
    }

    render() {
        const {
            parents:{
                items,
                totalCount,
                page,
                maxResultCount,
                filter
            },
            loading:{
                effects:{
                    "parents/list":initLoading = false
                }
            }
        } = this.props;

        const pagination = {
            current:page,
            pageSize:maxResultCount,
            total:totalCount,
            onChange:(current)=>this.getList(current,maxResultCount,filter),
            showSizeChanger:true,
            onShowSizeChange:(current,size)=>this.getList(1,size,filter),
            showTotal:total => `共${total}条`
        }
        
        return (
            <div>
                <Row style={{marginBottom:30}}>
                    <Col span={4}>
                        <Button type="primary" onClick={()=>this.props.history.push("/guardian/check")}>新增</Button>
                    </Col>
                    <Col span={8} offset={12}>
                        <Input.Search placeholder={"姓名/手机号码/工作单位/文化程度/职务"} onSearch={val => this.getList(1,10,val)}/>
                    </Col>
                </Row>
                <Table columns={this.columns} dataSource={items} rowKey={record=>record.id} loading={initLoading} pagination={pagination}/>
            </div>
        )
    }
}

export default connect(({ parents, loading }) => ({ parents, loading }))(parentsIndex);