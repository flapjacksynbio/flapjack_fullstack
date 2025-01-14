import React from 'react'
import PropTypes from 'prop-types'
import {
  Input,
  Empty,
  Tag,
  Checkbox,
  Row,
  Col,
  Spin,
  Button,
  Typography,
  message,
} from 'antd'
import debounce from 'lodash/debounce'
import api from '../../api'
import './View.scss'

/**
 * Renders a custom multiselect with options provided by API
 * @param {object} props
 * @param {string} props.url API Url to obtain options via GET. Should support pagination
 * @param {sting} props.label Label for the field
 * @param {object[]} props.selected Array containing selected items
 * @param {number} props.selected.id Value id provided by API
 * @param {string} props.selected.name Name to be desplayed for value
 * @param {function(value, checked)} props.setSelected Function for selecting/deselecting (depending on checked) a value
 */
const ProviderSelect = ({ url, label, selected, setSelected }) => {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [limit, setLimit] = React.useState(10)
  const [totalResults, setTotalResults] = React.useState(0)
  const [search, setSearch] = React.useState('')

  const [lastFetchId, setLastFetchId] = React.useState(0)

  // Obtain options from provider
  const onSearch = React.useCallback(
    debounce(() => {
      const fetchId = lastFetchId
      setLastFetchId((idx) => idx + 1)

      setLoading(true)
      setData([])

      api
        .get(url, null, { search, limit })
        .then(({ results, count }) => {
          if (fetchId !== lastFetchId) return
          setData(
            results.map(({ id, name, names }) => ({
              id,
              name: name || names.join(', '),
            })),
          )
          setTotalResults(count)
          setLoading(false)
        })
        .catch(() => message.error('There was an error communicating with the server.'))
    }),
  )

  const onClickMore = () => setLimit((lim) => lim + 10)

  const renderOptions = () => (
    <Row className="provider-select-options">
      {data.length > 0 &&
        data.map((value) => (
          <Col span={24} key={value.id}>
            <Checkbox
              checked={checked.has(value.id)}
              onChange={(e) => setSelected(value, e.target.checked)}
            >
              {value.name}
            </Checkbox>
          </Col>
        ))}
      {renderMore()}
    </Row>
  )

  const renderMore = () => {
    if (!loading && !data.length) {
      return <Empty description={`No ${label || 'results'} were found`} />
    } else if (loading) {
      return <Spin size="small" />
    }
    return limit < totalResults ? (
      <Button type="link" onClick={onClickMore}>
        More...
      </Button>
    ) : null
  }

  // eslint-disable-next-line
  React.useEffect(() => { onSearch(search) }, [search])

  // Obtain options when more options are requested
  React.useEffect(() => {
    const fetchId = lastFetchId
    setLastFetchId((idx) => idx + 1)

    setLoading(true)

    api
      .get(url, null, { search, limit, offset: data.length })
      .then(({ results, count }) => {
        if (fetchId !== lastFetchId) return
        setData((data) => [
          ...data.filter(({ id }) => !results.some(({ id: otherId }) => id === otherId)),
          ...results.map(({ id, name, names, ...metadata }) => ({
            id,
            name: name || names.join(', '),
            metadata,
          })),
        ])
        setTotalResults(count)
        setLoading(false)
      })
      .catch(() => message.error('There was an error communicating with the server.'))
    // eslint-disable-next-line
  }, [limit])

  const checked = new Set(selected.map(({ id }) => id))

  return (
    <div>
      {selected.map((value) => (
        <Tag
          onClose={() => setSelected(value, false)}
          closable
          key={value.id}
          style={{ maxWidth: '100%' }}
        >
          <Typography.Text ellipsis style={{ maxWidth: '80%' }}>
            {value.name}
          </Typography.Text>
        </Tag>
      ))}
      <Input.Search
        placeholder="Search"
        loading={loading}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={onSearch}
        style={{ marginTop: 10, marginBottom: 10 }}
      />
      {renderOptions()}
    </div>
  )
}

ProviderSelect.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string,
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  setSelected: PropTypes.func.isRequired,
}

export default ProviderSelect
