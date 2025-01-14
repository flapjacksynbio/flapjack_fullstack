import React from 'react'
import { Row, Col, Card } from 'antd'
import { UserAddOutlined, LoginOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const NotLoggedInCards = () => {
  return (
    <Row style={{ width: '100%' }} justify="center" className="home-row-cards">
      <Col xs={20} md={8} style={{ padding: 5 }}>
        <Link to="/authentication?initialTab=signup">
          <Card hoverable className="home-cards">
            <UserAddOutlined style={{ fontSize: '6em', color: '#1890ff', padding: 10 }} />
            <div className="home-card-title">Ready to get started?</div>
            <div className="home-card-content">Sign Up!</div>
          </Card>
        </Link>
      </Col>
      <Col xs={20} md={8} style={{ padding: 5 }}>
        <Link to="/authentication">
          <Card hoverable className="home-cards">
            <LoginOutlined style={{ fontSize: '6em', color: '#1890ff', padding: 10 }} />
            <div className="home-card-title">Already have an account?</div>
            <div className="home-card-content">Log In!</div>
          </Card>
        </Link>
      </Col>
    </Row>
  )
}

export default NotLoggedInCards
