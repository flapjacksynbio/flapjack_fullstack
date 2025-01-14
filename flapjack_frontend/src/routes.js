import Authentication from './Components/Authentication'
import Browse from './Components/Browse'
import NavButton from './Components/Header/NavButton'
import Home from './Components/Home'
import Upload from './Components/Upload'
import View from './Components/View'

const routes = [
  {
    label: 'Home',
    route: '/',
    navbarRenderer: NavButton,
    viewRenderer: Home,
    requiresAuth: false,
  },
  {
    label: 'Browse',
    route: '/browse',
    navbarRenderer: NavButton,
    viewRenderer: Browse,
    requiresAuth: false,
  },
  {
    label: 'View',
    route: '/view',
    navbarRenderer: NavButton,
    viewRenderer: View,
    requiresAuth: true,
  },
  { label: 'Upload', route: '/upload', viewRenderer: Upload, requiresAuth: true },
  {
    label: 'Authenticate',
    route: '/authentication',
    viewRenderer: Authentication,
    requiresAuth: false,
  },
]

export default (loggedIn) =>
  routes.filter(({ requiresAuth }) => loggedIn || !requiresAuth)
