import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { List, message, Modal, Select, Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import api from '../../api'

const ShareStudyModal = ({ study, setModalStudy }) => {
  const [data, setData] = React.useState([])
  const [lastFetchId, setLastFetchId] = React.useState(0)
  const [fetching, setFetching] = React.useState(false)
  const [selected, setSelected] = React.useState([])

  const addValue = (key, value) => {
    setSelected((selected) => [...selected, value])
  }

  const removeValue = (toDelete) => {
    setSelected((selected) => selected.filter(({ value }) => value !== toDelete.value))
  }

  // Fetch data from provider according to current search
  const fetchData = React.useCallback(
    _.debounce((search) => {
      const fetchId = lastFetchId
      setLastFetchId((idx) => idx + 1)
      setData([])
      setFetching(true)

      api.get('user/', null, { search }).then(({ results }) => {
        if (fetchId !== lastFetchId || !results) return
        setData(results.map(({ id, email }) => ({ value: id, label: email })))
        setFetching(false)
      })
    }),
  )

  // eslint-disable-next-line
  React.useEffect(() => fetchData(''), [])

  const handleShare = () => {
    // Execute study sharing
    const emails = new Set()
    study.shared_with.forEach((i) => emails.add(i))
    selected.map(({ label }) => label).forEach((i) => emails.add(i))

    api
      .patch(`study/${study.id}/`, {
        shared_with: [...emails].sort(),
      })
      .then((resp) => {
        if (+resp.status === 400) {
          throw new Error("There isn't an user with that email")
        } else if (+resp.status > 400) {
          throw new Error('Bad response from server')
        } else {
          message.success('Study successfully shared')
        }
        setModalStudy({})
      })
      .catch((err) => message.error(err.message))
  }

  const handleDelete = (e) => {
    const shared_with = _.without(study.shared_with, e)
    api
      .patch(`study/${study.id}/`, { shared_with })
      .then(() => message.success('Study unshared successfully'))
      .catch(() => message.error('There was an error unsharing the study'))
  }

  const renderEmail = (email) => {
    return (
      <List.Item
        actions={[
          <DeleteOutlined
            onClick={() => handleDelete(email)}
            key={`share-list-delete-${email}`}
          />,
        ]}
      >
        {email}
      </List.Item>
    )
  }

  return (
    <Modal
      visible={!_.isEmpty(study)}
      onCancel={() => setModalStudy({})}
      destroyOnClose={true}
      title="Share study"
      okText="Share"
      onOk={handleShare}
    >
      <List
        dataSource={study.shared_with}
        renderItem={renderEmail}
        header={null}
        locale={{ emptyText: 'Study is not shared with any user' }}
      />
      <Select
        labelInValue
        value={selected}
        onSelect={addValue}
        onDeselect={removeValue}
        placeholder="User email"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        options={data}
        showSearch
        onSearch={fetchData}
        style={{ width: '100%' }}
        mode="multiple"
      />
    </Modal>
  )
}

ShareStudyModal.propTypes = {
  study: PropTypes.object.isRequired,
  setModalStudy: PropTypes.func.isRequired,
}

export default ShareStudyModal
