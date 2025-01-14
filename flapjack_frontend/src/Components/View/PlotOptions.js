import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Typography, Select } from 'antd'

/** Renders plot options form */
const PlotOptions = ({ fields }) => {
  return (
    <>
      {fields.map((field) => (
        <Row key={field.name} style={{ marginBottom: 10 }}>
          <Col span={10}>
            <Typography.Text>{field.name}</Typography.Text>
          </Col>
          <Col span={14}>
            <Select
              value={field.selected}
              onChange={field.setSelected}
              style={{ width: '100%' }}
            >
              {field.options.map((value, i) => (
                <Select.Option key={i} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      ))}
    </>
  )
}

PlotOptions.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      selected: PropTypes.string.isRequired,
      setSelected: PropTypes.func.isRequired,
    }),
  ),
}

export default PlotOptions
