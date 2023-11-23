import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { Form, Image} from 'semantic-ui-react'

import {config} from "../Common/config";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function NewPost(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleNewPost(e) {
    e.preventDefault();
    props.hanldeNewPost(
      {
        postId: window.web3.utils.randomHex(20),    
        title,
        description,
        owner: '',     
        createdTime:  new Date().getTime(),
        groupId: ''    
      }
    )
    setShow(false);
  }

  function triggerShow(e) {
    e.preventDefault();
    setTitle("");
    setDescription("");
    handleShow();
  }

  return (
    <div  >
      <Button className="btnDarkBlue" labelPosition="right" onClick={triggerShow}>
        Create a new post
      </Button>
      <hr></hr>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Lets make a new post </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Field>
              <label>Title</label>
              <input 
                placeholder='Title' 
                name='title'
                value={title} 
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <ReactQuill className="quillEditor"
                placeholder='description' 
                name='description'
                formats={config.ReactQuill.formats}
                modules={config.ReactQuill.modules}
                value={description} 
                onChange={setDescription}
                />
            </Form.Field>

              
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btnDarkBlue" variant="primary" onClick={handleNewPost}>
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