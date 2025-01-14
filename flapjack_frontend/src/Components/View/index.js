import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tabs, Empty, Button } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import DataView from './DataView'
import { createTab, editTab, deleteTab } from '../../redux/actions/viewTabs'
import { connect } from 'react-redux'
//import uuid from 'uuid'
import { v1 as uuid } from 'uuid'
import PropTypes from 'prop-types'

const View = ({ tabs, createTab, editTab, deleteTab }) => {
  const location = useLocation()
  const [activeKey, setActiveKey] = React.useState(null)

  const onRenameTab = (title, tabId) => {
    const tab = tabs.find(({ id }) => id === tabId)
    if (!tab) return

    editTab({ ...tab, title })
  }

  // Select newest tab in list when a new tab is added
  React.useEffect(() => {
    const validTab = tabs.find(({ key }) => key === activeKey)
    if (!tabs.length) {
      setActiveKey(null)
    } else if (activeKey === null || !validTab) {
      setActiveKey(tabs[tabs.length - 1].key)
    }
  }, [tabs, activeKey])

  // Create new tab with query parameters
  React.useEffect(() => {
    if (location.state || window.location.search) {
      onAddTab()
    }
    // eslint-disable-next-line
  }, [])

  // Create new tab
  const onAddTab = () => {
    const tabsCount = tabs.length
    const title = `Analysis ${tabsCount + 1}`
    const tabId = uuid()

    createTab({
      title,
      id: tabId,
      key: tabId,
      closable: true,
      plotData: null,
    })
    setActiveKey(tabId)
  }

  const onTabEdit = (targetKey, action) => {
    if (action === 'add') {
      onAddTab()
    } else {
      deleteTab(targetKey)
    }
  }

  const renderAddTab = (
    <Button onClick={onAddTab}>
      Add Tab <PlusOutlined />
    </Button>
  )

  return (
    <>
      <Tabs
        onChange={setActiveKey}
        activeKey={activeKey}
        type="editable-card"
        hideAdd
        onEdit={onTabEdit}
        tabBarExtraContent={renderAddTab}
      >
        {tabs.map((tab) => (
          <Tabs.TabPane
            tab={tab.title}
            key={tab.key}
            closable={tab.closable}
            closeIcon={<CloseOutlined />}
          >
            <DataView
              title={tab.title}
              plotId={tab.id}
              plotData={tab.plotData}
              onRename={(name) => onRenameTab(name, tab.key)}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      {activeKey === null && (
        <Empty description="No plots have been created.">{renderAddTab}</Empty>
      )}
    </>
  )
}

View.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      closable: PropTypes.bool,
    }),
  ).isRequired,
  createTab: PropTypes.func.isRequired,
  editTab: PropTypes.func.isRequired,
  deleteTab: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  createTab: (tab) => dispatch(createTab(tab)),
  editTab: (tab) => dispatch(editTab(tab)),
  deleteTab: (tab) => dispatch(deleteTab(tab)),
})

const mapStateToProps = (state) => ({
  tabs: [...Object.values(state.viewTabs)],
})

export default connect(mapStateToProps, mapDispatchToProps)(View)
