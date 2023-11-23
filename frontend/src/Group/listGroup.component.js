import React, { Component } from "react";

import {
	Grid,
	Image,
	Button } from 'semantic-ui-react'

import "./group.css";

import axios from "axios";

import GroupDetail from "./detailGroup.component";

import ShowModal from "./showModal";

import {config} from "../Common/config"

import {checkBalance, trimContent} from "../Common/readProfileFn.js";
import { getNameAndAvatar } from "../Common/readProfileFn.js";


export default class GroupList extends Component {
	
	constructor(props) {
		super();

		const queryParameters = new URLSearchParams(window.location.search)
  		const groupType = queryParameters.get("groupType")
  		const groupId = queryParameters.get("groupId")

		this.state = {
			userAddress: localStorage.getItem("MyAddress"),
			groups : [],
			type : 0,
			selectedGroup : {},
			queryParams : {
				groupType,
				groupId
			},
			modal : {
				show: false
			}
		}
	}

	async componentDidMount() {
		var self = this;

		var response  = {data : []}
    
		try {
			response =  await axios.post(config.DATABASE+'/mygroups', {
				userAddress: this.state.userAddress
			})
		}catch(e) {
		}

		var groups = response.data;

		for (var e in groups) {
			groups[e].ownerprofile = await getNameAndAvatar(groups[e].owner);
		}

		if (self.state.queryParams.groupType=="1" && self.state.queryParams.groupId) {
			for (var e in groups) {
				if (groups[e].groupId == self.state.queryParams.groupId) {
					self.setState({
						type : 1,
						groups : groups,
						selectedGroup : groups[e]
					});
					return;
				}
			}
		} else {
			self.setState({
				groups : groups
			})
		}

	}

	async goToGroup(event) {
		event.preventDefault();

		var groupIndex = event.target.name;

		var selectedGroup = this.state.groups[groupIndex];
		var userAddress =  localStorage.getItem("MyAddress");

		if (selectedGroup.restriction) {
			var checkProfileHasToken = await checkBalance(selectedGroup.restriction, userAddress);

			if (checkProfileHasToken > 0) {
				window.location = "/group?groupType=1&groupId="+selectedGroup.groupId
			} else {
				this.setState({
					modal: {
						show: true,
						title: "You have no right to access the group",
						description: "The group is restricted by NFT access, you need to own <a href='https://explorer.execution.testnet.lukso.network/address/"+selectedGroup.restriction+"'>the NFT </a>"
					}
				})
			}
		} else {
			window.location = "/group?groupType=1&groupId="+selectedGroup.groupId
		}
	}

	getGroupList() {
		var groupGrid = [];
		var groups = this.state.groups;
		
		for (var e in groups) {
			var newTextHTML = trimContent(groups[e].description, 500, "/group?groupType=1&groupId="+groups[e].groupId, "...see more in group")
			groupGrid.push(
			<Grid.Row className="groupItem">
				<Grid.Column width={3}>
					<Image src={groups[e].imageLink} />
				</Grid.Column>
				<Grid.Column width={10}>
					<h3>{groups[e].name}</h3>
					<div>
						<a href={"https://wallet.universalprofile.cloud/"+groups[e].ownerprofile.myAddress}>
							Created by:
							<img style={{marginLeft: "5px", marginBottom: "5px"}} src={groups[e].ownerprofile.myAvatar} className="ui avatar image" />
							{groups[e].ownerprofile.myName}
						</a>
					</div>
					<div dangerouslySetInnerHTML={{__html: newTextHTML}}></div>	
				</Grid.Column>
				<Grid.Column width={3}>
				<Button name={e} floated='right' className="btnDarkBlue" onClick={(event) => this.goToGroup(event)}>Enter</Button>
				</Grid.Column>
			</Grid.Row>)
		}
		return groupGrid;
	}

	render() {
	     return (<>
		 	<ShowModal show={this.state.modal.show} title={this.state.modal.title} description={this.state.modal.description} handleClose={(e)=> {this.setState({modal: {show: false}})}}/>

			{this.state.type == 0 
				? (<>
					{
					this.state.groups.length > 0 
					? (<>
						<Image fluid src="./listGroupTheme.jpeg"></Image>
						<h2>Enter your groups</h2>
						<Grid style={{padding : "10px"}}>
							{this.getGroupList()}
						</Grid>
						</>)
					: (<><h2>No groups available, you can explore the groups <a href="/group?groupType=2">here</a></h2></>)
					}
					</>
				)
				: this.state.type == 1 ? <>
					<GroupDetail selectedGroup={this.state.selectedGroup}></GroupDetail>
				</>  : <></> }
			</>
    	)
	}
}