import React from 'react';
import {Button,Row,Col} from 'antd';
import {defaultLayout} from '../utils/common';

/**
 * form底部按钮
 * @param loading
 * @param onOk
 * @param onCancel
 * @returns {*}
 * @constructor
 */
const FormBtn = ({loading,onOk,onCancel})=>{
  return (
    <Row>
      <Col span={defaultLayout.wrapperCol.span} offset={defaultLayout.labelCol.span}>
        <Button type={"primary"} style={{marginRight:20}} loading={loading} onClick={onOk}>提交</Button>
        <Button onClick={onCancel}>取消</Button>
      </Col>
    </Row>
  )
}

export default FormBtn;
