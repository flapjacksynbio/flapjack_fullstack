import React from 'react'
import { Tabs } from 'antd'
import Login from './Login'
import Signup from './Signup'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

const Authentication = ({ isLoggedIn }) => {
  const params = new URLSearchParams(window.location.search)
  const queryTab = params.get('initialTab')
  const initialTab = ['login', 'signup'].includes(queryTab) ? queryTab : 'login'
  const [activeKey, setActiveKey] = React.useState(initialTab)

  if (isLoggedIn) {
    return <Redirect to="/" />
  }

  return (
    <Tabs
      defaultActiveKey={initialTab}
      activeKey={activeKey}
      onTabClick={(key) => setActiveKey(key)}
    >
      <Tabs.TabPane tab="Log In" key="login">
        <Login goToSignUp={() => setActiveKey('signup')} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Sign Up" key="signup">
        <Signup goToLogin={() => setActiveKey('login')} />
      </Tabs.TabPane>
    </Tabs>
  )
}

Authentication.propTypes = {
  isLoggedIn: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.session.access,
})

export default connect(mapStateToProps)(Authentication)
