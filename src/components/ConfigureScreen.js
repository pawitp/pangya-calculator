import React, { Component } from 'react'
import { Form, Button, Modal, Table, Popup, Icon } from 'semantic-ui-react'
import { database, auth } from '../lib/firebase'
import bindModel from '../lib/bindModel'

export default class ConfigureScreen extends Component {
  state = {
    modalOpen: false
  }

  model = bindModel(this)

  handleOpen = e => {
    e.preventDefault()
    this.setState({
      modalOpen: true,
      pin_80: this.props.params.pin['80'],
      pin_90: this.props.params.pin['90'],
      pin_100: this.props.params.pin['100'],
      hwi_80: this.props.params.hwi['80'],
      hwi_90: this.props.params.hwi['90'],
      hwi_100: this.props.params.hwi['100'],
      heightPos_80: this.props.params.heightPos['80'],
      heightPos_90: this.props.params.heightPos['90'],
      heightPos_100: this.props.params.heightPos['100'],
      heightNeg_80: this.props.params.heightNeg['80'],
      heightNeg_90: this.props.params.heightNeg['90'],
      heightNeg_100: this.props.params.heightNeg['100'],
      heightModPos: this.props.params.heightModPos,
      heightModNeg: this.props.params.heightModNeg,
      yardToCm: this.props.params.yardToCm,
      totalDist: this.props.params.totalDist
    })
  }

  handleDiscard = () => this.setState({ modalOpen: false })

  handleSave = () => {
    const newParams = {
      pin: {
        '80': parseFloat(this.state.pin_80),
        '90': parseFloat(this.state.pin_90),
        '100': parseFloat(this.state.pin_100)
      },
      hwi: {
        '80': parseFloat(this.state.hwi_80),
        '90': parseFloat(this.state.hwi_90),
        '100': parseFloat(this.state.hwi_100)
      },
      heightPos: {
        '80': parseFloat(this.state.heightPos_80),
        '90': parseFloat(this.state.heightPos_90),
        '100': parseFloat(this.state.heightPos_100)
      },
      heightNeg: {
        '80': parseFloat(this.state.heightNeg_80),
        '90': parseFloat(this.state.heightNeg_90),
        '100': parseFloat(this.state.heightNeg_100)
      },
      heightModPos: parseFloat(this.state.heightModPos),
      heightModNeg: parseFloat(this.state.heightModNeg),
      yardToCm: parseFloat(this.state.yardToCm),
      totalDist: parseFloat(this.state.totalDist)
    }

    database
      .ref('/users/' + auth.currentUser.uid + '/default')
      .update(newParams)
      .then(result => {
        console.log('Save succeed')
      })
      .catch(error => {
        console.log('Save failed', error)
        alert('Failed to save profile')
      })
    this.setState({ modalOpen: false })
  }

  render() {
    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>Configure</Button>}
        open={this.state.modalOpen}
        onClose={this.handleDiscard}>
        <Modal.Content scrolling>
          <h3>Configuration</h3>
          <Form>
            <Table celled striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Parameter</Table.HeaderCell>
                  <Table.HeaderCell>80%</Table.HeaderCell>
                  <Table.HeaderCell>90%</Table.HeaderCell>
                  <Table.HeaderCell>100%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    Max Caliper Distance{' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="Maximum distance after using power gauge"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell colSpan="3">
                    <input
                      required
                      step="1"
                      type="number"
                      {...this.model('totalDist')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Pin Distance{' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="Actual distance at each power level without wind and height influence"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('pin_80')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('pin_90')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('pin_100')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Wind Influence{' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="How much wind influences vertical and horizontal distance"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('hwi_80')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('hwi_90')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('hwi_100')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Height Distance Influence (+){' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="How much positive height influence vertical distance"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightPos_80')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightPos_90')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightPos_100')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Height Distance Influence (-){' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="How much negative height influence vertical distance"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightNeg_80')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightNeg_90')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightNeg_100')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Height Horizontal Influence (+){' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="How much positive height influence horizontal distance"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell colSpan="3">
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightModPos')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Height Horizontal Influence (-){' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="How much negative height influence horizontal distance"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell colSpan="3">
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('heightModNeg')}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Yard to CM{' '}
                    <Popup
                      trigger={<Icon circular name="info" />}
                      content="Multiplier to convert yard to CM when using physical ruler"
                      inverted
                    />
                  </Table.Cell>
                  <Table.Cell colSpan="3">
                    <input
                      required
                      step="0.001"
                      type="number"
                      {...this.model('yardToCm')}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
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
