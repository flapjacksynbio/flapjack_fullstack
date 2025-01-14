import store from '../redux/store'
import {
  receiveAccessTokens,
  logoutCurrentUser,
  loggingIn,
  setUserInfo,
} from '../redux/actions/session'
import ee from 'events'
import jwt from 'jsonwebtoken'

const READY_EVENT = 'READY_EVENT'

// TODO: Handle errors in this class, and return error messages

class Api {
  /* Mediates the interaction with the API through HTTP requests */
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.baseHeaders = {
      'content-type': 'application/json',
    }

    this.emitter = new ee.EventEmitter()

    // Promise that is resolved after access token is initialized
    this.isInitialized = new Promise((resolve) => {
      this.emitter.once('READY_EVENT', () => resolve())
    })
  }

  /** Obtains the access token from the store. If it's expired, tries to refresh. */
  async getAccessToken() {
    // Await for access token initialization
    await this.isInitialized
    const accessToken = store.getState().session.access
    if (!accessToken) return null

    // Verify expiration
    const decoded = jwt.decode(accessToken)
    const expDate = new Date(decoded.exp * 1000)
    if (expDate < Date.now()) {
      // Need to refresh token
      try {
        const refreshResponse = await this.refresh()
        return refreshResponse.access
      } catch (e) {
        return null
      }
    }
    return accessToken
  }

  /**
   * Returns required headers based on user authentications
   * @returns {object} Headers for HTTP request with access token if user is authenticated
   */
  async authedHeaders() {
    const accessToken = await this.getAccessToken()
    if (!accessToken) return this.baseHeaders
    return {
      ...this.baseHeaders,
      Authorization: `Bearer ${accessToken}`,
    }
  }

  /**
   * Get's the full HTTP URL from the API path
   * @param {string} path API path. (For http://localhost:8000/api/registry/plot, path='registry/plot')
   * @param {object=} query Optional. Query object to be included as a query string in the url.
   * @returns {string} url
   */
  url(path, query = {}) {
    const url = new URL(`${this.baseUrl}${path}`)
    Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, v))
    return url
  }

  /**
   * Executes an authenticated get/post/patch/delete request
   * @param {string} path API path. (For http://localhost:8000/api/registry/plot, path='registry/plot')
   * @param {Object} body Body object for HTTP request. Only on post/patch.
   * @param {Object} headers Extra headers to add to request.
   * @param {Object} query Query parameters for HTTP request.
   * @param {'GET'|'POST'|'PATCH'|'DELETE'} method HTTP request method.
   */
  async authFetch(path, body, headers, query, method) {
    if (path[path.length - 1] !== '/') {
      path = `${path}/`
    }
    const authedHeaders = await this.authedHeaders()
    return fetch(this.url(path, query), {
      method,
      headers: { ...authedHeaders, ...headers },
      ...(body && { body: JSON.stringify(body) }),
    })
  }

  /**
   * Execute a get request
   * @param {string} path API path.
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  async get(path, headers, query) {
    return this.authFetch(path, null, headers, query, 'GET').then((resp) => resp.json())
  }

  /**
   * Execute a post request
   * @param {string} path API path. Must end with '/' (E.g.: 'registry/plot/')
   * @param {Object} body Request body
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  post(path, body, headers, query) {
    return this.authFetch(path, body, headers, query, 'POST')
  }

  /**
   * Execute a patch request
   * @param {string} path API path. Must end with '/' (E.g.: 'registry/plot/')
   * @param {Object} body Request body
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  patch(path, body, headers, query) {
    return this.authFetch(path, body, headers, query, 'PATCH')
  }

  /**
   * Execute a delete request
   * @param {string} path API path.
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  delete(path, headers, query) {
    return this.authFetch(path, null, headers, query, 'DELETE')
  }

  /**
   * Method for registering a new user
   * @param {{username: string, email: string, password: string, password2: string}} body Object containing the registration parameters
   */
  async register(body) {
    const response = await fetch(this.url('auth/register/'), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify(body),
    }).then((resp) => resp.json())

    if (!response || !response.access || !response.refresh) {
      return { errors: response }
    }

    return this.logIn({ username: body.username, password: body.password })
  }

  /**
   * Method for loggingIn a new user
   * @param {{username, password}} body Object containing username and password
   * @returns {{access: string, refresh: string, username: string, email: string}}
   */
  async logIn(body) {
    const response = await fetch(this.url('auth/log_in/'), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify(body),
    }).then((resp) => resp.json())

    if (!response || !response.access || !response.refresh) {
      throw new Error('API error')
    }

    store.dispatch(receiveAccessTokens(response))
    store.dispatch(setUserInfo(response))
    return response
  }

  /**
   * Method for obtaining a new refresh and access token
   * @param {string} refresh Refresh token
   */
  async refresh(refresh) {
    refresh = refresh || store.getState().session.refresh
    if (!refresh) {
      this.emitter.emit(READY_EVENT, true)
      throw new Error('No refresh token stored')
    }

    store.dispatch(loggingIn(true))

    // Get new access token
    const response = await fetch(this.url('auth/refresh/'), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify({ refresh }),
    })
      .then((resp) => resp.json())
      .catch(() => {
        store.dispatch(logoutCurrentUser())
        this.emitter.emit(READY_EVENT, true)
        return null
      })
      .finally((resp) => {
        store.dispatch(loggingIn(false))
        return resp
      })

    if (!response || !response.access) {
      store.dispatch(logoutCurrentUser())
      this.emitter.emit(READY_EVENT, true)
      throw new Error('API error')
    }

    store.dispatch(receiveAccessTokens({ refresh, access: response.access }))
    this.emitter.emit(READY_EVENT, true)
    return response
  }

  /**
   * Logs out the current user.
   */
  async logOut() {
    return store.dispatch(logoutCurrentUser())
  }
}

// eslint-disable-next-line no-undef
const HTTP_API_URL = process.env.REACT_APP_HTTP_API
export default new Api(HTTP_API_URL)
