import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import {
  Form
} from "semantic-ui-react";

import UploadImageButton from "../Common/uploadImageButton";

import { config } from "../Common/config";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function NewFundraising(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [goalAmount, setGoalAmount] = useState("0");
  const [deadline, setDeadline] = useState("");

  function hanldeNewCampaign(e) {
    e.preventDefault();
    var deadlineFormat = new Date(deadline).getTime() / 1000;
    props.hanldeNewCampaign({
      campaignId: window.web3.utils.randomHex(20),
      name,
      description,
      goalAmount : window.web3.utils.toWei(goalAmount),
      imageLink,
      deadline: deadlineFormat,
    });
    setShow(false);
  }

  function triggerShow(e) {
    e.preventDefault();
    setCampaignName("");
    setDescription("");
    setImageLink("");
    setGoalAmount(0);
    setDeadline("");
    handleShow();
  }

  return (
    <div style={{ paddingRight: "5px" }}>
      <Button className="btnDarkBlue" labelPosition="right" onClick={triggerShow}>
        Add a fundraising campaign
      </Button>
      <hr></hr>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Lets make a new campaign </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Field>
              <label>Campaign Name</label>
              <input
                placeholder="Name of Campaign"
                name="name"
                value={name}
                onChange={(e) => {
                  setCampaignName(e.target.value);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <ReactQuill
                className="quillEditor"
                placeholder="description"
                name="description"
                formats={config.ReactQuill.formats}
                modules={config.ReactQuill.modules}
                value={description}
                onChange={setDescription}
              />
            </Form.Field>
            <Form.Field>
              <label>Image Link</label>
              <UploadImageButton setImageLink={setImageLink} />
            </Form.Field>

            <Form.Field>
              <label>Goal Amount (in LYX)</label>
              <input
                placeholder="LYXe"
                name="goalAmount"
                value={goalAmount}
                onChange={(e) => {
                  setGoalAmount(e.target.value);
                }}
              />
            </Form.Field>

            <Form.Field>
              <label>Deadline</label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm"
              />
            </Form.Field>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btnDarkBlue" variant="primary" onClick={hanldeNewCampaign}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
