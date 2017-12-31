import React, { Component } from 'react'
import { auth, googleAuthProvider } from '../lib/firebase'
import { Container, Button } from 'semantic-ui-react'

class LoginScreen extends Component {
  login = e => {
    auth.signInWithRedirect(googleAuthProvider)
  }

  render() {
    return (
      <Container textAlign="center">
        <h1>Pangya Calculator</h1>
        <p>Your account is used to store your custom parameters and records.</p>
        <Button color="google plus" onClick={this.login}>
          Login with Google
        </Button>
      </Container>
    )
  }
}

export default LoginScreen
