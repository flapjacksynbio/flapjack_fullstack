import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, message, Select, Spin, Form, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import FormFactory from './Form'
import debounce from 'lodash/debounce'
import './Form.scss'
import api from '../../api'

/**
 * Allows the user to select from existing value provided by the API or create a new one
 * @param {object} props
 * @param {string} props.url API Url that provides the options via GET and allows creation via POST. Must end with '/'
 * @param {object[]} props.createFields Array of fields for value creation, passed to FormFactory. See Forms/Form.js
 * @param {string} props.label Label for the field
 * @param {string} props.buttonCreateLabel Label to use in submit button text
 * @param {object} props.extraCreationValues Values to pass to POST body in addition to the form
 * @param {object} props.extraQueryParams Values to pass to GET query to provider
 * @param {string[]=} props.dependencies Ant Design dependency array
 * @param {*} props.formInstance Ant Design form instance.
 *  Other props are the same for any other field. See Forms/Field.js
 */
const SelectOrCreate = ({
  url,
  createFields,
  label,
  buttonCreateLabel = null,
  extraCreationValues = {},
  extraQueryParams = {},
  formInstance = null,
  dependencies = [],
  selectionOnly = false,
  ...props
}) => {
  const [data, setData] = React.useState([])
  const [lastFetchId, setLastFetchId] = React.useState(0)
  const [fetching, setFetching] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [selected, setSelected] = React.useState(null)

  const updateSelected = (newValue) => {
    setSelected(newValue)
    if (formInstance) {
      formInstance.setFieldsValue({ [props.name]: newValue })
    }
  }

  // Fetch data from provider according to current search
  const fetchData = React.useCallback(
    debounce((search) => {
      const fetchId = lastFetchId
      setLastFetchId((idx) => idx + 1)
      setData([])
      setFetching(true)

      api.get(url, null, { search, ...extraQueryParams }).then(({ results }) => {
        if (fetchId !== lastFetchId || !results) return
        setData(
          results.map(({ id, name, names }) => ({ value: id, label: name || names })),
        )
        setFetching(false)
      })
    }),
  )

  // eslint-disable-next-line
  React.useEffect(() => fetchData(''), [])

  // Submit new value creation
  const onSubmit = async (form) => {
    setLoading(true)
    const success = await api
      .post(url, { ...form, ...extraCreationValues })
      .then(async (response) => {
        const resp = await response.json()
        return resp
      })
      .catch(() => false)
    setLoading(false)

    if (success) {
      fetchData(form.name || form.names)
      updateSelected({ value: success.id, label: success.name || success.names })
      setVisible(false)
    } else {
      message.error(
        `There was an error creating the ${buttonCreateLabel || label}. Please try again`,
      )
    }
  }

  return (
    <>
      <Form.Item
        hasFeedback
        name={props.name}
        rules={props.rules}
        label={props.showLabel ? label : null}
        dependencies={dependencies}
      >
        <Select
          labelInValue
          value={selected}
          onSelect={updateSelected}
          placeholder={`Select ${label}`}
          notFoundContent={fetching ? <Spin size="small" /> : null}
          filterOption={false}
          options={data}
          showSearch
          onSearch={fetchData}
          style={{ width: '100%' }}
        />
      </Form.Item>
      {!selectionOnly && (
        <>
          <div className="select-or-create-field">
            <Button onClick={() => setVisible(true)}>
              <Typography.Text ellipsis style={{ maxWidth: '90%' }}>
                <PlusOutlined /> Create new {label}
              </Typography.Text>
            </Button>
          </div>
          <Modal
            title={`Create new ${buttonCreateLabel || label}`}
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            <FormFactory
              name={`New${label}`}
              onSubmit={onSubmit}
              fields={createFields}
              submitText={`Create ${buttonCreateLabel || label}`}
              initialValues={{ public: false }} // 'public' default value isn't set on component mount
              loading={loading}
            />
          </Modal>
        </>
      )}
    </>
  )
}

SelectOrCreate.propTypes = {
  url: PropTypes.string.isRequired,
  createFields: PropTypes.array,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  rules: PropTypes.array,
  extraCreationValues: PropTypes.object,
  extraQueryParams: PropTypes.object,
  buttonCreateLabel: PropTypes.string,
  formInstance: PropTypes.any,
  dependencies: PropTypes.arrayOf(PropTypes.string),
  selectionOnly: PropTypes.bool,
}

export default SelectOrCreate
