import React from 'react'
import { message, Modal } from 'antd'
import SteppedFormFactory from '../Forms/SteppedForm'
import { useHistory } from 'react-router-dom'
import apiWebSocket from '../../api/apiWebSocket'
import ExtraInfo from './ExtraInfo'
import uploadSteps from './uploadForm'

const Upload = () => {
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(null)
  const [assayId, setAssayId] = React.useState(null)

  const [extraDataVisible, setExtraDataVisible] = React.useState(false)
  const [extraDataFields, setExtraDataFields] = React.useState(null)
  const [extraDataLoading, setExtraDataLoading] = React.useState(false)

  const [connectionSocket, setConnectionSocket] = React.useState(null)

  const history = useHistory()

  // Initiates the submission process via websockets
  const onSubmit = async (data) => {
    window.data = data
    const { name, machine, description, temperature, study } = data
    setLoading(true)

    const form = {
      name,
      machine,
      description,
      temperature,
      study: study.value,
    }

    // For reading the uploaded file
    const fr = new FileReader()

    fr.addEventListener('loadend', () => {
      apiWebSocket.connect('registry/upload', {
        onConnect(event, socket) {
          setConnectionSocket(socket)
          // Send information to create assay in backend
          socket.send(JSON.stringify({ type: 'init_upload', data: form }))
        },
        onReceiveHandlers: {
          ready_for_file(msg, e, socket) {
            if (!msg.data || !msg.data.assay_id) {
              message.error('There was an error while creating the assay.')
              socket.close()
              return
            }
            setAssayId(msg.data.assay_id)
            // Backend asks for file. This is sent in binary form
            socket.send(fr.result)
          },
          input_requests(msg) {
            // Backend asks for specific metadata for sample
            setExtraDataFields(msg.data)
            setExtraDataVisible(true)
          },
          progress(msg) {
            setProgress(+msg.data)
          },
          creation_done() {
            setLoading(false)
            setExtraDataLoading(false)
            message.success('Data uploaded successfully!')
            history.push('browse')
          },
        },
        onError(e, socket) {
          console.log(e)
          message.error('There was an error uploading the data.')
          socket.close()
          setConnectionSocket(null)
        },
      })
    })

    fr.readAsArrayBuffer(data.data_file.file.originFileObj)
  }

  const onSubmitExtraInfo = (data) => {
    // Submit sample metadata required by backend
    setExtraDataLoading(true)
    const dataToSend = Object.entries(data).reduce((acc, [key, { value }]) => {
      const reg = key.match(/^(\w+)-\d+$/)[1]
      if (!acc[reg]) {
        acc[reg] = []
      }

      acc[reg].push(value)
      return acc
    }, {})

    console.log(dataToSend)
    connectionSocket.send(JSON.stringify({ type: 'metadata', data: dataToSend }))
  }

  const cancelSend = () => {
    connectionSocket.close()
    setLoading(false)
    setExtraDataVisible(false)
    setConnectionSocket(null)
  }

  return (
    <>
      <SteppedFormFactory
        name="UpladForm"
        steps={uploadSteps}
        onSubmit={onSubmit}
        submitText="Submit"
        loading={loading}
      />
      {!!extraDataFields && (
        <Modal
          title="Metadata"
          visible={extraDataVisible}
          onCancel={cancelSend}
          footer={null}
          width="80%"
        >
          <ExtraInfo
            loading={extraDataLoading}
            onSubmit={onSubmitExtraInfo}
            extraInfoFields={extraDataFields}
            assayId={assayId}
            progress={progress}
          />
        </Modal>
      )}
    </>
  )
}

Upload.propTypes = {}

export default Upload
