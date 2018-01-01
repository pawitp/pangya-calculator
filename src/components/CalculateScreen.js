import React, { Component } from 'react'
import {
  Container,
  Button,
  Form,
  Segment,
  Label,
  List
} from 'semantic-ui-react'
import ConfigureScreen from './ConfigureScreen'
import TableScreen from './TableScreen'
import calculateAll from '../lib/pangyaCalculator'
import bindModel from '../lib/bindModel'
import firebase, { database, auth } from '../lib/firebase'

class CalculateScreen extends Component {
  state = {
    distance: '',
    height: '',
    wind: '',
    angle: '',
    result: null,
    recordCaliperDistance: '',
    recordHorizontalDistance: '',
    recordType: '',
    saving: 0 // 0 = not saved, 1 = saving, 2 = saved
  }

  model = bindModel(this)

  handleChange = (key, value) => {
    if (
      key === 'distance' ||
      key === 'height' ||
      key === 'wind' ||
      key === 'angle'
    ) {
      if (this.state.result != null) {
        this.setState({ result: null })
      }
    }
  }

  onCalculate = e => {
    e.preventDefault()

    const result = calculateAll(
      this.props.params,
      this.state.distance,
      this.state.height,
      this.state.wind,
      this.state.angle
    )

    this.setState({
      result,
      recordCaliperDistance: result.caliperDist,
      recordHorizontalDistance: result.hDistScaled,
      recordType: 'beam',
      saving: 0
    })

    // Remove on screen keyboard
    document.activeElement.blur()
  }

  onReset = e => {
    this.setState(
      {
        distance: '',
        height: '',
        wind: '',
        angle: '',
        result: null
      },
      () => {
        // Trigger on screen keyboard
        this.distanceInput.focus()
      }
    )
  }

  onRecord = e => {
    e.preventDefault()

    const recordKey = database
      .ref('/records/' + auth.currentUser.uid + '/default')
      .push().key

    const record = {
      distance: parseFloat(this.state.distance),
      height: parseFloat(this.state.height),
      wind: parseFloat(this.state.wind),
      angle: parseFloat(this.state.angle),
      actualCaliperDistance: parseFloat(this.state.recordCaliperDistance),
      // Convert back to yards
      actualHorizontalDistance:
        parseFloat(this.state.recordHorizontalDistance) /
        this.props.params.yardToCm,
      type: this.state.recordType,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }

    this.setState({ saving: 1 })

    database
      .ref('/records/' + auth.currentUser.uid + '/default/' + recordKey)
      .set(record)
      .then(result => {
        console.log('Save succeed')
        this.setState({ saving: 2 })
      })
      .catch(error => {
        console.log('Save failed', error)
        alert('Failed to save record')
      })
  }

  render() {
    const result = this.state.result ? (
      <Segment raised>
        <h4>Result</h4>
        <List divided>
          <List.Item>
            <Label horizontal>Pin</Label>
            {this.state.result.pinDist} y
          </List.Item>
          <List.Item>
            <Label horizontal>Caliper</Label>
            {this.state.result.caliperDist} y{' '}
            <Label horizontal>Distance at Caliper</Label>
            {this.state.result.caliperPinDist} y
          </List.Item>
          <List.Item>
            <Label horizontal>Ruler</Label>
            {this.state.result.hDistScaled} cm <Label horizontal>Green</Label>
            {this.state.result.hDist} y
          </List.Item>
        </List>
        <h5>Record Success</h5>
        <Form onSubmit={this.onRecord}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Actual Caliper Distance</label>
              <input
                required
                step="0.1"
                tabIndex="11"
                type="number"
                min="0"
                max="400"
                {...this.model('recordCaliperDistance')}
              />
            </Form.Field>
            <Form.Field>
              <label>Actual Horizontal Distance (cm)</label>
              <input
                required
                step="0.01"
                tabIndex="12"
                type="number"
                min="0"
                max="400"
                {...this.model('recordHorizontalDistance')}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group inline>
            <label>Type</label>
            <Form.Radio
              label="Beam"
              value="beam"
              {...this.model('recordType', 'beam')}
            />
            <Form.Radio
              label="Backspin"
              value="backspin"
              {...this.model('recordType', 'backspin')}
            />
          </Form.Group>
          <Button type="submit" positive disabled={this.state.saving > 0}>
            {this.state.saving === 0
              ? 'Save'
              : this.state.saving === 1 ? 'Saving' : 'Saved'}
          </Button>
        </Form>
      </Segment>
    ) : (
      ''
    )

    return (
      <div>
        <Container>
          <h1>
            Pangya Calculator{' '}
            <Button
              icon
              color="blue"
              size="mini"
              href={'/degrees.png'}
              target="_blank">
              Angle
            </Button>
            <Button
              icon
              color="blue"
              size="mini"
              href="https://i.imgur.com/X5LQMkr.png"
              target="_blank">
              Terrain
            </Button>
          </h1>
        </Container>
        <Container>
          <Form onSubmit={this.onCalculate}>
            <Form.Group widths="equal">
              <Form.Field>
                <label>Distance</label>
                <input
                  placeholder="221y"
                  required
                  step="0.01"
                  tabIndex="1"
                  type="number"
                  min="0"
                  max="400"
                  {...this.model('distance')}
                  ref={input => (this.distanceInput = input)}
                />
              </Form.Field>
              <Form.Field>
                <label>Height</label>
                <input
                  placeholder="1.23m"
                  required
                  step="0.01"
                  tabIndex="2"
                  type="number"
                  min="-50"
                  max="50"
                  {...this.model('height')}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <label>Wind</label>
                <input
                  placeholder="-5m"
                  required
                  step="1"
                  tabIndex="3"
                  type="number"
                  min="-9"
                  max="9"
                  {...this.model('wind')}
                />
              </Form.Field>
              <Form.Field>
                <label>Angle</label>
                <input
                  placeholder="42&deg;"
                  required
                  step="1"
                  tabIndex="4"
                  type="number"
                  min="0"
                  max="90"
                  {...this.model('angle')}
                />
              </Form.Field>
            </Form.Group>
            <Button type="submit" positive>
              Calculate
            </Button>
            <Button type="reset" onClick={this.onReset} negative>
              Reset
            </Button>
            <ConfigureScreen params={this.props.params} />
            <TableScreen params={this.props.params} />
          </Form>
          {result}
        </Container>
        <Container>
          <p>
            <br />
            <br />
            Logged in as {this.props.user.email}.{' '}
            <a href="#logout" onClick={this.props.onLogout}>
              Logout
            </a>.<br />
            Based on{' '}
            <a href="http://pangyacelebrity.boards.net/thread/166/nyas-non-excel-calculation-guide">
              nya&apos;s guide.
            </a>
          </p>
        </Container>
      </div>
    )
  }
}

export default CalculateScreen
