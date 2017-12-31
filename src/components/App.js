import React, { Component } from 'react'
import './App.css'
import { auth, database } from '../lib/firebase'
import LoginScreen from './LoginScreen'
import CalculateScreen from './CalculateScreen'
import { Dimmer, Loader } from 'semantic-ui-react'
import { defaultParams } from '../lib/pangyaCalculator'

class App extends Component {
  state = {
    user: null,
    params: null,
    userLoaded: false
  }

  logout = e => {
    // Async - will trigger onAuthStateChanged
    e.preventDefault()
    auth.signOut()
  }

  componentDidMount() {
    // Don't show page before we get authentication result
    auth
      .getRedirectResult()
      .then(result => {
        this.setState({ userLoaded: true })
      })
      .catch(error => {
        this.setState({ userLoaded: true })
      })

    auth.onAuthStateChanged(user => {
      this.setState({ user })

      if (user) {
        const userId = user.uid
        const dbRef = database.ref('/users/' + userId + '/default')
        return dbRef.on('value', snapshot => {
          const params = snapshot.val()
          if (params) {
            this.setState({ params })
          } else {
            // Set initial parameter
            dbRef.update(defaultParams)
            this.setState({ params: defaultParams })
          }
        })
      }
    })
  }

  render() {
    if (this.state.userLoaded && !this.state.user) {
      return <LoginScreen />
    } else if (this.state.params) {
      return (
        <CalculateScreen
          user={this.state.user}
          onLogout={this.logout}
          params={this.state.params}
        />
      )
    } else {
      return (
        <Dimmer active inverted>
          <Loader>Loading...</Loader>
        </Dimmer>
      )
    }
  }
}

export default App
