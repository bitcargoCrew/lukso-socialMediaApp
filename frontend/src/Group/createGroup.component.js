import React, { Component } from "react";
import { Button } from "react-bootstrap";

import { Redirect, Link } from "react-router-dom";
import { Form, Image } from 'semantic-ui-react'

import "./group.css";
import axios from "axios";

import {config} from "../Common/config";

import UploadImageButton from "../Common/uploadImageButton"

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {TagsInput} from "../Common/tagsInput";

import Loading from "../Home/loading.component.js";

import {fundraisingDb} from '../Database/fundraising.db';

const defaultSuggestedTags = ["Metaverse","Web3","NFT","Painting","Music","Social Media","Arts & Entertainment"];

export default class CreateGroup extends Component {
	
	constructor(props) {
		super();

		this.state = {
			step : 0,
			topic: "",
			name : "",
			description : "",
			restriction: "",
			imageLink : "",
			myProfile : JSON.parse(localStorage.getItem("MyProfile")),
			loadingActive : false
		}
	}

	handleChange(event) {
		event.preventDefault();
		const target = event.target;
		const value = target.value;
	
		const name = target.name;
		this.setState({
		  [name]: value
		});
	}

	changeDescription(value) {
		this.setState({
			"description": value
		});
	}

	async waitForLoad() {
		
	}

	chooseTopic() {
		return (
			<>
			<Form>
				<Form.Field>
					<label>Choose topics for your group</label>

					<TagsInput 
						defaultSuggestedTags={defaultSuggestedTags} 
						setTags={(tags) => {
							this.setState({topic : tags})
						}}
					></TagsInput>
				</Form.Field>
				<Form.Field>
					<label>Choose a name for your group</label>
					<input 
					placeholder='name' 
					name='name'
					value={this.state.name} 
					onChange={this.handleChange.bind(this)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Choose an image for your group</label>
					<UploadImageButton setImageLink={(imageLink) => {this.setState({imageLink})}}/>
				</Form.Field>
			</Form>
			<br></br>
			<Button className="btnDarkBlue buttonPositionCreation" onClick={this.nextStep.bind(this)}>Next</Button>
			</>
		)
	}

	chooseDescription() {
		return (
			<>
			<Form>
				<Form.Field>
					<label>Describe your group</label>
					<ReactQuill className="quillEditor"
					placeholder='description' 
					name='description'
					formats={config.ReactQuill.formats}
					modules={config.ReactQuill.modules}
					value={this.state.description} 
					onChange={this.changeDescription.bind(this)}
					/>
				</Form.Field>
			</Form>
			<br></br>
			<Button className="btnDarkBlue" onClick={this.nextStep.bind(this)}>Next</Button>
			</>
		)
	}

	chooseRestriction() {
		return (<>
			<Form>
				<Form.Field>
					<label>You can restrict your group so that only a person with a token or a NFT can enter your group. If you leave the field empty, your group will be public.</label>
					<br></br>
					<p>You can create tokens and collections via Universal Page: <a href="https://universalpage.dev/drop-editor/create">Create asset</a></p>
					<p>You can discover existing tokens and collections here: <a href="https://universalpage.dev/discover">Explore assets</a></p>
					<input 
					placeholder='asset address restriction' 
					name='restriction'
					value={this.state.restriction} 
					onChange={this.handleChange.bind(this)}
					/>
				</Form.Field>
			</Form>
			<br></br>
			<Button className="btnDarkBlue" onClick={this.nextStep.bind(this)}>Complete</Button>
			</>
		)
	}

 	makeStep() {
		if (this.state.step == 0) {
			return this.chooseTopic();
		} else if (this.state.step == 1) {
			return this.chooseDescription();
		} else if (this.state.step == 2) {
			return this.chooseRestriction();
		} else if (this.state.step == 3) {
			console.log("push and complete");
		}
	}

	async nextStep(e) {
		e.preventDefault();
		if (this.state.step == 2) {

			this.setState({
				loadingActive : true
			})

			var newGroup = {
				groupId: window.web3.utils.randomHex(20),
				imageLink: this.state.imageLink,
				name: this.state.name,
				description: this.state.description,
				owner: this.state.myProfile.myAddress, 
				createdTime: new Date().getTime()  ,
				restriction: this.state.restriction,
				topic: this.state.topic
			}

			await fundraisingDb.createGroup(newGroup);

			setTimeout(() => {
				window.location = "/group?groupType=1&groupId="+newGroup.groupId;
			}, 3000);
		} else {
			this.setState({
				step : this.state.step + 1
			})
		}
	}

	render() {

	     return (
			<>
				<Loading active={this.state.loadingActive}></Loading>
				<Image src="./createGroupTheme.png"></Image>
				<h2>Create your own group</h2>

				<div>
					{this.makeStep()}
				</div>
			</>
    	)
	}
}