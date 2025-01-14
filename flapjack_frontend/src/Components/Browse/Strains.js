import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Space } from 'antd'
import BrowseTable from './BrowseTable'

const Strains = () => {
  const history = useHistory()

  const renderActions = (text, record) => {
    const handleViewClick = () => {
      // Redirect to View screen with selected parameters
      history.push({
        pathname: '/view',
        state: {
          strain: { id: record.id, name: record.name },
        },
      })
    }

    return (
      <Space>
        <Button onClick={handleViewClick}>Data Viewer</Button>
      </Space>
    )
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Description',
      key: 'desc',
      dataIndex: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: renderActions,
    },
  ]

  return <BrowseTable dataUrl="strain/" columns={columns} />
}

Strains.propTypes = {}

export default Strains
