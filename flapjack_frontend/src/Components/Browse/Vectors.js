import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Space, List, Row, Col } from 'antd'
import BrowseTable from './BrowseTable'

const DNAs = () => {
  const history = useHistory()

  const renderUris = (dnas) => {
    // eslint-disable-next-line react/prop-types
    const renderUri = ({ name, sboluri }) => {
      let uri = 'No Sbol Uri'
      if (sboluri)
        uri = (
          <Button type="link" href={sboluri} size="small">
            Go to SynBioHub
          </Button>
        )
      return (
        <Row gutter={10} style={{ width: '100%' }}>
          <Col span={10}>{name}:</Col>
          <Col span={14}>{uri}</Col>
        </Row>
      )
    }

    return (
      <List size="small">
        {dnas.map((dna, i) => (
          <List.Item key={i}>{renderUri(dna)}</List.Item>
        ))}
      </List>
    )
  }

  const renderActions = (text, record) => {
    const handleViewClick = () => {
      // Redirect to View screen with selected parameters
      history.push({
        pathname: '/view',
        state: { vector: { id: record.id, name: record.name } },
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
      dataIndex: 'name',
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Sbol Uris',
      dataIndex: 'dnas',
      render: renderUris,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: renderActions,
    },
  ]

  return <BrowseTable dataUrl="vectorall/" columns={columns} />
}

DNAs.propTypes = {}

export default DNAs
