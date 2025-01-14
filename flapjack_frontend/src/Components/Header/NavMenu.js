import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserMenu from './UserMenu'
import NavButton from './NavButton'
import { logoutCurrentUser } from '../../redux/actions/session'

const pathToKey = {
  '/': 'menu-Home',
  '/browse': 'menu-Browse',
  '/view': 'menu-View',
}

const NavMenu = ({ menuButtons, mode = 'horizontal', session, onLogout }) => {
  const location = useLocation()

  const isHorizontal = mode === 'horizontal'
  let SubMenu = null

  if (session.isLoggingIn) {
    SubMenu = (
      <Menu.Item>
        <LoadingOutlined spin />
      </Menu.Item>
    )
  } else if (session.access) {
    const user = session.user
    SubMenu = UserMenu(isHorizontal, user ? user.username : '', onLogout)
  } else {
    SubMenu = (
      <Menu.Item key="menu-login">
        <NavButton route="/authentication" label="Log In" />
      </Menu.Item>
    )
  }

  return (
    <Menu
      theme="dark"
      className={isHorizontal ? 'navbar' : ''}
      style={isHorizontal ? {} : { width: '100%' }}
      mode={mode}
      selectedKeys={[pathToKey[location.pathname]]}
    >
      {menuButtons.map((route) => (
        <Menu.Item key={`menu-${route.label}`}>{route.navbarRenderer(route)}</Menu.Item>
      ))}
      {SubMenu}
    </Menu>
  )
}

NavMenu.propTypes = {
  menuButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      navbarRenderer: PropTypes.func,
    }),
  ).isRequired,
  mode: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  session: PropTypes.object,
  onLogout: PropTypes.func,
}

const mapStateToProps = (state) => ({
  session: state.session,
})

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logoutCurrentUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu)
