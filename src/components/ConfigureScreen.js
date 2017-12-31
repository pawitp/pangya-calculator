import React, { Component } from 'react'
import { Form, Button, TextArea, Modal } from 'semantic-ui-react'
import { database, auth } from '../lib/firebase'

export default class ConfigureScreen extends Component {
  state = {
    modalOpen: false,
    jsonSettings: null
  }

  handleOpen = e => {
    e.preventDefault()
    this.setState({
      modalOpen: true,
      jsonSettings: JSON.stringify(this.props.params, false, 4)
    })
  }

  handleDiscard = () => this.setState({ modalOpen: false })

  handleSave = () => {
    const newParams = JSON.parse(this.state.jsonSettings)
    database
      .ref('/users/' + auth.currentUser.uid + '/default')
      .update(newParams)
    this.setState({ modalOpen: false })
  }

  onChange = e => {
    this.setState({
      jsonSettings: e.target.value
    })
  }

  render() {
    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>Configure</Button>}
        open={this.state.modalOpen}
        onClose={this.handleDiscard}
        size="small">
        <Modal.Content>
          <h3>Under construction. Please edit JSON manually for now.</h3>
          <Form>
            <TextArea
              rows={20}
              value={this.state.jsonSettings}
              onChange={this.onChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.handleDiscard} inverted>
            Discard
          </Button>
          <Button positive onClick={this.handleSave} inverted>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
