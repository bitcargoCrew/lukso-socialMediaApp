import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";

import { Row, Col, Card, Form } from "react-bootstrap";

import { Container,
	Breadcrumb,
	Item } from 'semantic-ui-react'

import {getNameAndAvatar} from "../Common/readProfileFn.js";

import { AttachAsset } from "../Common/attachAsset";

import InputEmoji from 'react-input-emoji'
	import Loading from "../Home/loading.component.js";

import "./group.css";
import {config} from "../Common/config";


import axios from "axios";


export default class Post extends Component {
	
	constructor(props) {
		super();

		var selectedPost = props.selectedPost;
		selectedPost.ownerprofile =  {};

		this.state = {
			userAddress: localStorage.getItem("MyAddress"),
			commentText : "",
			selectedPost,
			myProfile : JSON.parse(localStorage.getItem("MyProfile")),
			loadingActive : false
		}
	}

	async componentDidMount () {
		var self = this;
		var selectedPost = self.props.selectedPost;
		selectedPost.ownerprofile =  await getNameAndAvatar(selectedPost.owner);

		var comments = [];

		try {
			var response = await axios.post(config.DATABASE+'/comments', {
				userAddress: this.state.userAddress,
				postId : self.props.selectedPost.postId
			});

			comments = response.data;
		}catch(err) {
			console.log(err);
		}

		for (var e in comments) {
			comments[e].ownerprofile = await getNameAndAvatar(comments[e].owner);
		}

		self.setState({
			comments,
			selectedPost
		})
	}


	getCommentList() {
		var commentGrid = [];
		var comments = this.state.comments;
		for (var e in comments) {
			commentGrid.push(
			<Item>
				<Item.Image size='tiny' src={comments[e].ownerprofile.myAvatar} />

				<Item.Content>
					<Item.Header as='a'>{comments[e].ownerprofile.myName}</Item.Header>
					<Item.Meta dangerouslySetInnerHTML={{__html:comments[e].description}}></Item.Meta>
				</Item.Content>
			</Item>

			)
		}
		return commentGrid;
	}

	handleChange(event) {
		event.preventDefault();
		const target = event.target;
		const value = target.value;
	
		const name = target.name;
		// focus(target);
		this.setState({
		  [name]: value
		});
	}

	async onSendComment(text) {
		var newComment = {
			commentId: window.web3.utils.randomHex(20),
			postId: this.state.selectedPost.postId,
			owner: this.state.myProfile.myAddress,
			description: text,
			createdTime: new Date().getTime()       
		}

		//send to db
		var cmtToDb = Object.values(newComment);

		var response = await axios.post(config.DATABASE+'/newcomment', {
			comment : cmtToDb
		  });

		newComment.ownerprofile = this.state.myProfile;

		var comments = this.state.comments;
		comments.push(newComment);
		this.setState({
			comments,
			commentText : ""
		})
	}

	setLoadingActive(loadingActive) {
		// e.preventDefault();
		this.setState({loadingActive})
	}

	render() {
	     return (<>
					<Loading active={this.state.loadingActive}></Loading>

					<Breadcrumb>
						<a href="/group"><Breadcrumb.Section link>Groups</Breadcrumb.Section></a>
						<Breadcrumb.Divider />
						<a href={"/group?groupType=1&groupId="+this.state.selectedPost.groupId}><Breadcrumb.Section link>Group</Breadcrumb.Section></a>
						<Breadcrumb.Divider />
						<Breadcrumb.Section active>Post</Breadcrumb.Section>
					</Breadcrumb>

					<h1>{this.state.selectedPost.title}</h1>

					<div>
						<a href={"https://wallet.universalprofile.cloud/"+this.state.selectedPost.ownerprofile.myAddress}>
							Created by:
							<img style={{marginLeft: "5px", marginBottom: "5px"}} src={this.state.selectedPost.ownerprofile.myAvatar} className="ui avatar image" />
							{this.state.selectedPost.ownerprofile.myName}
						</a>
					</div>
					<div className="innerHTMLContent" dangerouslySetInnerHTML={{__html: this.props.selectedPost.description}}></div>

					<hr/>
					<Form>
						<Form.Row className="align-items-center">
						<Col xs={11}>
							<InputEmoji
								placeholder={"Type your message.."}
								value={this.state.commentText}
								onChange={(commentText) => {
									this.setState({
										commentText
									})
								}}
								onEnter={this.onSendComment.bind(this)}
								/>
						</Col>
						<Col xs={1}>
							<AttachAsset
								name={this.state.myProfile.myName}
								address={localStorage.getItem("MyAddress")}
								currActivFriend={{
									publicKey : this.state.selectedPost.owner,
									userType: 1,
									friendname : this.state.selectedPost.ownerprofile.myName
								}}
								sendNoti={this.onSendComment.bind(this)}
								setLoadingActive={this.setLoadingActive.bind(this)}
								/>
						</Col>
						</Form.Row>
					</Form>
					<hr/>
					<h2>List of comments</h2>
					<Item.Group>
						{this.getCommentList()}
					</Item.Group>
			</>
    	)
	}
}