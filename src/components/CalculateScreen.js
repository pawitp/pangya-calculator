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

class CalculateScreen extends Component {
  state = {
    distance: '',
    height: '',
    wind: '',
    angle: '',
    result: null
  }

  model = bindModel(this)

  handleChange = () => {
    if (this.state.result != null) {
      this.setState({ result: null })
    }
  }

  onCalculate = e => {
    e.preventDefault()
    this.setState({
      result: calculateAll(
        this.props.params,
        this.state.distance,
        this.state.height,
        this.state.wind,
        this.state.angle
      )
    })

    // Remove on screen keyboard
    document.activeElement.blur()
  }

  onReset = e => {
    // Trigger on screen keyboard
    // (reset is done by normal event)
    this.distanceInput.focus()
    this.setState({ result: null })
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

            {result}
          </Form>
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
