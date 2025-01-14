import React from 'react'
import { Tabs, BackTop } from 'antd'
import Studies from './Studies'
import Assays from './Assays'
import Vectors from './Vectors'
import Medias from './Medias'
import Strains from './Strains'
import Signals from './Signals'

const Browse = () => {
  return (
    <>
      <BackTop />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Studies" key="1">
          <Studies />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Assays" key="2">
          <Assays />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Vectors" key="3">
          <Vectors />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Medias" key="4">
          <Medias />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Strains" key="5">
          <Strains />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Signals" key="6">
          <Signals />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

Browse.propTypes = {}

export default Browse
