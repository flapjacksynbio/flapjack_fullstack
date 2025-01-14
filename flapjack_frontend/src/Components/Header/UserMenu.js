import React from 'react'
import { Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const UserMenu = (isHorizontal, username, onLogOut) => {
  if (isHorizontal) {
    return [
      <Menu.SubMenu
        title={
          <span>
            <UserOutlined />
            {username}
          </span>
        }
        key="navbar-sub-menu"
      >
        <Menu.Item key="upload">
          <Link to="/upload">Upload</Link>
        </Menu.Item>
        <Menu.Item key="sign-out">
          <Link to="/" onClick={onLogOut}>
            Sign Out
          </Link>
        </Menu.Item>
      </Menu.SubMenu>,
    ]
  }

  return [
    <Menu.Item key="upload">
      <Link to="/upload">Upload</Link>
    </Menu.Item>,
    <Menu.Item key="sign-out">
      <Link to="/" onClick={onLogOut}>
        Sign Out
      </Link>
    </Menu.Item>,
  ]
}

UserMenu.propTypes = {
  isHorizontal: PropTypes.bool.isRequired,
}

export default UserMenu
