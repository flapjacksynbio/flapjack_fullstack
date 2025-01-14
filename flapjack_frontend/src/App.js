import { Layout } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'
import './App.scss'
import FlapHeader from './Components/Header'
import routes from './routes'

const { Content, Footer } = Layout

function App({ loggedIn }) {
  const history = useHistory()
  const availableRoutes = routes(loggedIn)

  const contentClass = history.location.pathname === '/view' ? 'full-width' : ''

  return (
    <Layout className="layout">
      <FlapHeader routes={availableRoutes} />
      <Content id="flapjack-content" className={contentClass}>
        <div className="site-layout-content">
          <Switch>
            {[...availableRoutes].reverse().map(({ route, viewRenderer: Renderer }) => (
              <Route path={route} key={`route-${route}`} component={Renderer} />
            ))}
          </Switch>
        </div>
      </Content>
      <Footer className="footer" theme="dark">
        <span>
          © 2022 Copyright: <a href="http://rudge-lab.org/">Rudge Lab</a> — Newcastle University
          <br />
          <br />
          Please reference our <a href="https://pubs.acs.org/doi/10.1021/acssynbio.0c00554">paper</a> as follows:
          <br />
          Guillermo Yáñez Feliú, Benjamín Earle Gómez, Verner Codoceo Berrocal, Macarena Muñoz Silva, Isaac N. Nuñez,<br />Tamara F. Matute, Anibal Arce Medina, Gonzalo Vidal, Carlos Vidal-Céspedes, Jonathan Dahlin, Fernán Federici,<br />and Timothy J. Rudge <i>ACS Synthetic Biology</i> <b>2021 10</b> (1), 183-191 DOI: 10.1021/acssynbio.0c00554
        </span>
      </Footer>
    </Layout>
  )
}

App.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  loggedIn: !!state.session.access,
})

export default connect(mapStateToProps)(App)
