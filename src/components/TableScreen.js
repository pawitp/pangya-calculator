import React, { Component } from 'react'
import { Button, Modal, Table } from 'semantic-ui-react'
import bindModel from '../lib/bindModel'
import { generateTable } from '../lib/pangyaCalculator'

export default class TableScreen extends Component {
  state = {
    modalOpen: false
  }

  model = bindModel(this)

  handleOpen = e => {
    e.preventDefault()
    this.setState({
      modalOpen: true
    })
  }

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    const values = generateTable(this.props.params).map(row => {
      return (
        <Table.Row key={row.percent}>
          <Table.Cell>{row.percent}</Table.Cell>
          <Table.Cell>{row.caliperDist}</Table.Cell>
          <Table.Cell>{row.pinDist}</Table.Cell>
          <Table.Cell>{row.hwi}</Table.Cell>
          <Table.Cell>{row.hPos}</Table.Cell>
          <Table.Cell>{row.hNeg}</Table.Cell>
          <Table.Cell>{row.vwiNeg}</Table.Cell>
          <Table.Cell>{row.vwiPos}</Table.Cell>
        </Table.Row>
      )
    })

    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>View Table</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}>
        <Modal.Content scrolling>
          <h3>Table</h3>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>%</Table.HeaderCell>
                <Table.HeaderCell>Caliper</Table.HeaderCell>
                <Table.HeaderCell>Pin</Table.HeaderCell>
                <Table.HeaderCell>HWI</Table.HeaderCell>
                <Table.HeaderCell>H+</Table.HeaderCell>
                <Table.HeaderCell>H-</Table.HeaderCell>
                <Table.HeaderCell>VWIB</Table.HeaderCell>
                <Table.HeaderCell>VWIF</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>{values}</Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
