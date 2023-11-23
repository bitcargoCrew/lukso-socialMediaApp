import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { Form, Grid} from 'semantic-ui-react'
import {getNameAndAvatar} from "../Common/readProfileFn.js";

// This Modal help Add a new friend
export function Donation(props) {
  const [show, setShow] = useState(false);

  const [totalDonations, setTotalDonation] = useState("");
  const [donationsCount, setDonationsCount] = useState("");
  const [withdrawedAmount, setWithdrawedAmount] = useState("");
  const [goalAmount, setGoalAmount] = useState("0");

  const [deadline, setDeadline] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [donationAmount, setDonationAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState({});

  async function donate(e){
    e.preventDefault();

    if (window.fundraisingContract) {
      props.setLoadingActive(true);
      try{
        await window.fundraisingContract.methods.donate(props.myCampain.campaignId).send({
          from : localStorage.getItem("MyAddress"),
          value : parseFloat(donationAmount) * (10 ** 18)
        });
      } catch(e) {
        console.log(e);
      }
      await pullCampaignFromBlockchain();

      props.setLoadingActive(false);
    }
  }

  async function widthraw(e){
    e.preventDefault();

    if (window.fundraisingContract) {
      props.setLoadingActive(true);

      try{
        await window.fundraisingContract.methods.withdraw(props.myCampain.campaignId).send({
          from : localStorage.getItem("MyAddress")
        });
        // window.location = "/fundraising"
      } catch(e) {
        console.log(e);
      }

      await pullCampaignFromBlockchain();

      props.setLoadingActive(false);
    }
  }

  async function terminate(e){
    e.preventDefault();

    if (window.fundraisingContract) {
      props.setLoadingActive(true);

      try{
        await window.fundraisingContract.methods.withdrawAllandStop(props.myCampain.campaignId).send({
          from : localStorage.getItem("MyAddress")
        });
      } catch(e) {
        console.log(e);
      }

      await pullCampaignFromBlockchain();

      props.setLoadingActive(false);
    }
  }

  async function pullCampaignFromBlockchain() {
		var data = await window.fundraisingContract.methods.viewCampaign(props.myCampain.campaignId).call();
    setDonationAmount("");
    setTotalDonation(window.web3.utils.fromWei(data.totalDonations));
    setDonationsCount(data.donationsCount);
    setWithdrawedAmount(window.web3.utils.fromWei(data.withdrawedAmount));
    setDeadline(data.deadline);
    setGoalAmount(window.web3.utils.fromWei(data.goalAmount));
    setBeneficiary(await getNameAndAvatar(data.beneficiary));
  }

  function btnControl() {
    var currUser = localStorage.getItem("MyAddress");

    var donationForm = (
      <div>
        <Form.Field>
          <label>Donate Amount</label>
          <input 
            placeholder='Donation Amount' 
            name='donationAmount'
            value={donationAmount} 
            onChange={(e) => {
              setDonationAmount(e.target.value);
            }}
          />
        </Form.Field>
        <hr/>
      </div>
      );
    var btnListForWithoutUser = (<div>
          <Button className="btnDarkBlue" onClick={donate}>Donate</Button>
    </div>)

    var btnListForOwnerFull = (<div>
      <Button className="btnDarkBlue" onClick={donate}>Donate</Button>
      <span> </span>
      <Button className="btnDarkBlue" onClick={widthraw}>Withdraw</Button>
      <span> </span>
      <Button className="btnDarkBlue" onClick={terminate}>Terminate</Button>
    </div>)

    var btnListForOwnerNoDonation = (<div>
      <Button className="btnDarkBlue" onClick={widthraw}>Withdraw</Button>
      <span> </span>
      <Button className="btnDarkBlue" onClick={terminate}>Terminate</Button>
    </div>)

    var finishedNote = (<div style={{
      "border": "1px solid rgb(0, 24, 86)",
      "padding": "5px",
      "border-radius": "5px",
      "font-style": "italic",
      "color": "rgb(0, 24, 86)",
      "margin" : "5px"
    }}>The Campaign has finished</div>)

    var condtionOfGoalNotReach = (parseFloat(goalAmount) > 0 ? parseFloat(goalAmount) > parseFloat(totalDonations) : true);
    var conditionNotReached = (deadline*1000 > new Date().getTime()) && condtionOfGoalNotReach;

    if (currUser == beneficiary.myAddress) {
      if (conditionNotReached) {
        return [donationForm, btnListForOwnerFull]
      } else {
        return [finishedNote, btnListForOwnerNoDonation];
      }
    } else {
      if (conditionNotReached) {
        return [donationForm, btnListForWithoutUser];
      } else {
        return finishedNote;
      }
    }
  }

  return (
    <div style={{paddingRight: "5px"}} >
      <Button className="btnDarkBlue" onClick={async (e)=> {
        await pullCampaignFromBlockchain();
        handleShow(e);
      }}>Discover</Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title> Discover </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Grid >
          <Grid.Row columns={2}>
            <Grid.Column>
              <div style={{"padding": "10px"}} >
                <h3>Description</h3>
                <div>
                  Created by:
                  <img style={{marginLeft: "5px"}} src={beneficiary.myAvatar} className="ui avatar image" />
                  {beneficiary.myName}
                </div>
                <hr></hr>
                <div className="innerHTMLContent"  dangerouslySetInnerHTML={{__html: props.myCampain.description}}></div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>{"Campaign Id : "+ props.myCampain.campaignId}</label>
                </Form.Field>

                <Form.Field>
                  <label>{"Total Donation : "+ totalDonations + " LYX"}</label>
                </Form.Field>


                <Form.Field>
                  <label>{"Donation Count: "+ donationsCount}</label>
                </Form.Field>

                <Form.Field>
                  <label>{"Goal Amount: "+ goalAmount + " LYX"}</label>
                </Form.Field>


                <Form.Field>
                  <label>{"Already Withdrawn: "+ withdrawedAmount + " LYX"}</label>
                </Form.Field>

                <Form.Field>
                  <label>{"Deadline: "+ new Date(deadline*1000).toLocaleString()}</label>
                </Form.Field>
                
                {btnControl()}
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}