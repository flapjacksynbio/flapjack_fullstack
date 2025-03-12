import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Space, List, Row, Col } from 'antd'
import BrowseTable from './BrowseTable'

const Medias = () => {
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
      history.push({
        pathname: '/view',
        state: {
          media: { id: record.id, name: record.name },
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
      title: 'SBOL URI',
      dataIndex: 'sboluri',
      key: 'sboluri',
      render: renderUris,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: renderActions,
    },
  ]

  return <BrowseTable dataUrl="media/" columns={columns} />
}

Medias.propTypes = {}

export default Medias