import _ from 'lodash'
import api from '.'

/**
 * @callback listener
 * @param event event that fired the listener
 * @param socket the socket that the listener is bound to
 */

/**
 * @callback messageListener
 * @param message the message that was received by the socket
 * @param event event that fired the listener
 * @param socket the socket that the listener is bound to
 */

class ApiWebsocket {
  /* Mediates the interaction with API through WebSockets */
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  /**
   * Get's the full WebSocket URL from the API path
   * @param {string} path API path. (For ws://localhost:8000/ws/registry/plot, path='registry/plot')
   * @returns {string} url
   */
  async url(path) {
    const token = await api.getAccessToken()
    const url = new URL(`${this.baseUrl}${path}?token=${token}`)
    return url
  }

  /**
   * Executes the connection to the API through WebSockets and sets its listeners
   * @param {string} path API path (E.g.: 'registry/plot').
   * @param {object} listeners Object containing the event listeners for the connection.
   * @param {listener} listeners.onConnect Socket onopen listener.
   * @param {messageListener|object} listeners.onReceiveHandlers socket onmessage listener. If it's an object, it will
   * call onReceiveHandlers[message.type] when the event fires.
   * @param {listener} listeners.onError Socket onerror listener.
   */
  async connect(path, { onConnect, onReceiveHandlers, onError }) {
    // Create WebSocket
    const url = await this.url(path)
    const socket = new WebSocket(url)

    // onConnect
    socket.onopen = (event) => onConnect(event, socket)

    // Message received handlers
    if (typeof onReceiveHandlers === 'function') {
      socket.onmessage = (event) => onReceiveHandlers(event, socket)
    } else if (_.isPlainObject(onReceiveHandlers)) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (typeof onReceiveHandlers[message.type] === 'function') {
          onReceiveHandlers[message.type](message, event, socket)
        }
      }
    } else {
      socket.close()
      throw new Error(
        `Unhandled type "${typeof onReceiveHandlers}" for onReceiveHandlers`,
      )
    }

    socket.onerror = (event) => onError(event, socket)

    return socket
  }
}

// eslint-disable-next-line no-undef
const HTTP_WS_URL = process.env.REACT_APP_WS_API
export default new ApiWebsocket(HTTP_WS_URL)
