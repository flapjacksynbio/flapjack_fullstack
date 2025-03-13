import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Space, List, Row, Col } from 'antd'
import BrowseTable from './BrowseTable'

const Assays = () => {
  const history = useHistory()

  const renderUris = (sboluri, record) => {
    let uri = 'No Sbol Uri'
    if (sboluri) {
      uri = (
        <Button 
          type="link"
          href={sboluri}
          size="small">
          Go to SynBioHub
        </Button>
      )
    }
    
    return (
      <List size="small">
        <List.Item key={0}>
          <Row style={{ width: '100%' }}>
            <Col span={14}>{uri}</Col>
          </Row>
        </List.Item>
      </List>
    )
  }

  const renderActions = (text, record) => {
    const handleViewClick = () => {
      // Redirect to View screen with selected parameters
      history.push({
        pathname: '/view',
        state: {
          assay: { id: record.id, name: record.name },
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
      title: 'Study',
      key: 'study',
      dataIndex: 'study',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Temperature',
      key: 'temp',
      dataIndex: 'temperature',
      sorter: (a, b) => a - b,
      render: (temp) => `${temp} °C`,
    },
    {
      title: 'Machine',
      key: 'machine',
      dataIndex: 'machine',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'SBOL URI',
      key: 'sboluri',
      dataIndex: 'sboluri',
      render: renderUris,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: renderActions,
    },
  ]

  return <BrowseTable dataUrl="assay/" columns={columns} />
}

Assays.propTypes = {}

export default Assays
