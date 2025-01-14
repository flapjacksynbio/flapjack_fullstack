import React from 'react'
import { Select, Spin } from 'antd'
import api from '../../api'
import debounce from 'lodash/debounce'

/**
 * Select component that lists Chemicals provided by the API
 */
const ChemicalForm = (props) => {
  const [chemicals, setChemicals] = React.useState([])
  const [lastFetchId, setLastFetchId] = React.useState(0)
  const [fetching, setFetching] = React.useState(false)

  const fetchChemicals = React.useCallback(
    debounce((search) => {
      const fetchId = lastFetchId
      setLastFetchId((idx) => idx + 1)
      setChemicals([])
      setFetching(true)

      api.get('chemical/', null, { search }).then(({ results }) => {
        if (fetchId !== lastFetchId) return
        setChemicals(results.map(({ id, name }) => ({ value: id, label: name })))
        setFetching(false)
      })
    }),
  )

  // eslint-disable-next-line
  React.useEffect(() => fetchChemicals(''), [])

  return (
    <Select
      labelInValue
      placeholder="Select Chemical"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchChemicals}
      options={chemicals}
      showSearch
      style={{ width: '100%' }}
      {...props}
    />
  )
}

ChemicalForm.propTypes = {}

export default ChemicalForm
