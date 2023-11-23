import React from "react";
import { Row, Card } from "react-bootstrap";
import { Image } from 'semantic-ui-react'

// This is a functional component which renders the individual messages
export function Message(props) {

  function gmtToLocalTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString(); 
  }

  return (
    <Row style={{ marginRight: "0px" }}>
      <Card
        style={{
          width: "60%",
          alignSelf: "center",
          margin: "0 0 5px " + props.marginLeft,
          float: "right",
          right: "0px",
          border: "1px solid #001856",
        }}
      >
        <Card.Body style={{paddingTop:"10px", paddingBottom: "10px"}}>
          <h6 style={{ float: "right" }}>{(props.timeStamp)}</h6>
          <Card.Subtitle>
            <b>{props.sender}</b>
          </Card.Subtitle>
          <Card.Text dangerouslySetInnerHTML={{__html:props.data}}></Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
}