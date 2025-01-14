import { Card, Col, Row, Typography } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import logo from '~/src/assets/images/logo.png'
import './Home.scss'
import LoggedInCards from './LoggedInCards'
import NotLoggedInCards from './NotLoggedInCards'

const { Title } = Typography

const Home = ({ loggedIn }) => {
  return (
    <div className="container">
      <Card className="home-header">
        <Row align="middle" className="home-content" gutter={16}>
          <Col sm={24} md={8}>
            <img alt="Flapjack Logo" src={logo} />
          </Col>
          <Col sm={24} md={16}>
            <Title className={'home-title'}>Flapjack</Title>
          </Col>
        </Row>
      </Card>
      {loggedIn ? <LoggedInCards /> : <NotLoggedInCards />}
    </div>
  )
}

Home.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  loggedIn: !!state.session.access,
})

export default connect(mapStateToProps)(Home)
