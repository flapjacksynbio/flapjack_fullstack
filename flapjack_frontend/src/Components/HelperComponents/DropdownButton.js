import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'

/**
 * Renders a dropdown with an arbitrary amount of buttons
 * @param {object} props
 * @param {string} props.label String shown on the dropdown.
 * @param {object} props.options Object containing metadata to render buttons within the dropdown.
 * @param {string} props.options.label String shown on the dropdown button
 * @param {function(event)} props.options.onClick Function called when button is clicked.
 */
const DropdownButton = ({ label, options }) => {
  const handleMenuClick = (e) => {
    return options[e.key].onClick(e)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {Object.entries(options).map(([k, o]) => (
        <Menu.Item key={k}>{o.label}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <Button>
        {label} <DownOutlined />
      </Button>
    </Dropdown>
  )
}

DropdownButton.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
}

export default DropdownButton
