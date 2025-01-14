import React from 'react'
import { Row, Col, Empty, Typography, Progress, message } from 'antd'
import Selection from './Selection'
import PropTypes from 'prop-types'
import Plot from './Plot'
import { addPlotToTab } from '../../redux/actions/viewTabs'
import { connect } from 'react-redux'
import apiWebSocket from '../../api/apiWebSocket'

/**
 * Renderer for new View tab
 * @param {object} props
 * @param {string} props.title Tab title
 * @param {function(string)} props.onRename Function to change tab title
 * @param {object} props.plotData Contains data for showing a plotly plot
 * @param {function(plotId, plotData)} props.addPlot Function for creating a new plot and storing it in Redux store
 */
const DataView = ({ title, onRename, plotData, plotId, addPlot }) => {
  const [loadingData, setLoadingData] = React.useState(null)

  const onPlot = (values) => {
    console.log(values)
    createWebsocket(values)
  }

  // Request plot data to backend via websocjets
  const createWebsocket = (values) => {
    apiWebSocket.connect('plot/plot', {
      onConnect(event, socket) {
        // Initialize progress bar
        setLoadingData(0)
        // Send plot parameters to backend
        socket.send(JSON.stringify({ type: 'plot', parameters: values }))
      },
      onReceiveHandlers: {
        // Update progress bar
        progress_update: (message) => setLoadingData(message.data.progress),
        // Create a plot with received data
        plot_data: ({ data }, event, socket) => {
          if (!data.figure) {
            addPlot(plotId, {})
            setLoadingData(null)
          } else {
            const figure = JSON.parse(data.figure)
            setLoadingData(null)
            if (figure && figure.data) {
              addPlot(plotId, figure)
            } else {
              addPlot(plotId, {})
            }
          }
          socket.close()
        },
      },
      onError(event, socket) {
        message.error('There was an error processing the data. Please try again')
        setLoadingData(null)
        socket.close()
      },
    })
  }

  const renderPlot = () => {
    if (loadingData !== null) {
      // Progress bar
      return <Progress type="circle" percent={loadingData} />
    }

    if (plotData) {
      if (!plotData.data) {
        return <Empty description="No data available for your query." />
      }
      return <Plot data={plotData} title={title} />
    }

    return <Empty description="Select data to plot" />
  }

  return (
    <>
      <Row gutter={20}>
        <Col span={6}>
          <Typography.Title
            editable={{ onChange: onRename }}
            style={{ marginLeft: 15, fontSize: 20 }}
          >
            {title}
          </Typography.Title>
          <Selection onSubmit={onPlot} />
        </Col>
        <Col span={18} style={{ padding: 20 }}>
          <Row justify="center">{renderPlot()}</Row>
        </Col>
      </Row>
    </>
  )
}

DataView.propTypes = {
  title: PropTypes.string.isRequired,
  onRename: PropTypes.func.isRequired,
  plotData: PropTypes.object,
  addPlot: PropTypes.func.isRequired,
  plotId: PropTypes.string.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  addPlot: (tabId, plotData) => dispatch(addPlotToTab(tabId, plotData)),
})

export default connect(null, mapDispatchToProps)(DataView)
