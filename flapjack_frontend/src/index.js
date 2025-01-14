import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { BrowserRouter as Router } from 'react-router-dom'
import store, { persistor } from './redux/store'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import Loading from './Components/Loading/Index'
import { ConfigProvider } from 'antd'

const validateMessages = {
  // eslint-disable-next-line
  required: '${name} is required',
  default: 'Invalid value in field',
  // eslint-disable-next-line
  whitespace: '${name} cannot be empty',
}

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <Router>
        <ConfigProvider form={{ validateMessages }}>
          <App />
        </ConfigProvider>
      </Router>
    </PersistGate>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
