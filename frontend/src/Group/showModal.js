import React, { Component } from "react";

import { Button, Modal, Image, Form } from "react-bootstrap";

// This Modal help Add a new friend
export default class ShowModal extends Component {
  render() {
    return (
      <div style={{paddingRight: "5px"}} >
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> {this.props.title} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <div dangerouslySetInnerHTML={{__html:this.props.description}}></div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}