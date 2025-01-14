import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Drawer, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import logo from '~/src/assets/images/logo.png'
import PropTypes from 'prop-types'
import NavMenu from './NavMenu'
import './Header.scss'

/** Responsive header */
const FlapHeader = ({ routes = [] }) => {
  const [smallScreen, setSmallScreen] = React.useState(false)
  const [drawerVisible, setDrawerVisible] = React.useState(false)

  // Observe screen size
  React.useEffect(() => {
    updateSmallScreen()
    window.addEventListener('resize', updateSmallScreen)
    return () => {
      window.removeEventListener('resize', updateSmallScreen)
    }
  })

  // Determine if screen size is small enough for menu change
  const updateSmallScreen = () => {
    const windowWidth = window.innerWidth
    setSmallScreen(windowWidth < 720)
  }

  // Open small screen's drawer
  const onToggleDrawer = () => {
    setDrawerVisible((visible) => !visible)
  }

  const menuButtons = routes.filter(({ navbarRenderer }) => navbarRenderer)

  return (
    <Layout.Header id="flapjack-header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Flapjack Logo" />
          <span className="logo-title">Flapjack</span>
        </Link>
      </div>
      {smallScreen && (
        <>
          <Button className="drawer-button" onClick={onToggleDrawer}>
            <MenuOutlined className="drawer-button-icon" />
          </Button>
          <Drawer
            placement="right"
            onClose={onToggleDrawer}
            visible={drawerVisible}
            theme="dark"
            bodyStyle={{ padding: 0, backgroundColor: '#001529' }}
          >
            <NavMenu menuButtons={menuButtons} mode="vertical" />
          </Drawer>
        </>
      )}
      {!smallScreen && <NavMenu menuButtons={menuButtons} mode="horizontal" />}
    </Layout.Header>
  )
}

FlapHeader.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      navbarRenderer: PropTypes.func,
    }),
  ).isRequired,
}

export default FlapHeader
