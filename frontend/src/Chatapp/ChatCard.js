import React from "react";
import { Row, Card } from "react-bootstrap";

import { Image } from 'semantic-ui-react'

import {
  SeeProfile
} from "./Components.js";


export function ChatCard(props) {
  return (
    <Row style={{ marginRight: "0px" }}>
      <Card
        style={{width: "100%", alignSelf: "center", marginLeft: "20px", marginRight: "5px", padding : "0 10px", border: "1px solid #001856" }}
        onClick={() => {
          if (props.isFriend) {
            props.getMessages(props.publicKey);
          }
        }}
      >
        <Card.Body style={{padding: "0.60rem"}}>
          <Card.Title> 
            <Image src={props.avatar} avatar />
            {props.name} 
            <SeeProfile
              fullProfile={props.fullProfile}
            />
          </Card.Title>
          <Card.Subtitle>
            {" "}
            {props.publicKey}
            {!props.isFriend 
              ? (<span 
                    style={{"height": "20px", "float": "right", border : "1px solid #001856",   borderRadius: "5px" , padding : "1px" , cursor: "pointer" }}
                    onClick={(e)=>{props.addFriend()}}
                  >
                  {props.userType=="1" ? "+Friend" : "+Join Group" }
                </span>) 
              : (<></>)}
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Row>
  );
}