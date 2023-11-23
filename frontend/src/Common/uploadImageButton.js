import React, { Component } from "react";
import { Button } from "react-bootstrap";

import { Redirect, Link } from "react-router-dom";
import { Form } from 'semantic-ui-react'

import axios from "axios";

import {config} from "../Common/config";

import {pinFileToIPFS} from "../Common/pinFileToIPFS"


import Loading from "../Home/loading.component.js";

export default class UploadImageButton extends Component {
	
	constructor(props) {
		super();

		this.state = {
			imageLink : "",
			loadingActive : false,
			uploadImageButtonText : "Upload Image"
		}
	}

	async handleFileUpload(e){

		this.setState({
			loadingActive : true,
			uploadImageButtonText : "Uploading"
		})
		var rs = "";
		try {
			rs = await pinFileToIPFS(e.target.files[0]);
		}catch(e) {
			console.log(e);
		}
		this.setState({
			imageLink : "https://ipfs.io/ipfs/"+rs.IpfsHash,
			loadingActive : false,
			uploadImageButtonText : "Done! We have your image"
		})
		if (this.props.setImageLink) {
			this.props.setImageLink("https://ipfs.io/ipfs/"+rs.IpfsHash);
		}
	};

	render() {

	     return (
			<>
				<Loading active={this.state.loadingActive}></Loading>
				<input
					type="file"
					id="file"
					ref={input => this.imageUploadElement = input}
					onChange={this.handleFileUpload.bind(this)}
					style={{ display: "none" }}
					/>

				<Button
					className="btnDarkBlue"
					disabled={this.state.imageLink == "" ? false : true }
					onClick={() => this.imageUploadElement.click()}
				>
					{this.state.uploadImageButtonText}
				</Button>
			</>
    	)
	}
}