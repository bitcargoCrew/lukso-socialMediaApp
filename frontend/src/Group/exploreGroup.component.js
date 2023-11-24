import React, { Component } from "react";

// import { Redirect, Link, Breadcrumb } from "react-router-dom";
import {
  Grid,
  Image,
  Input
} from "semantic-ui-react";

import { Button } from "react-bootstrap";


import "./group.css";

import ShowModal from "./showModal";

import { config } from "../Common/config";

import { checkBalance, trimContent } from "../Common/readProfileFn.js";

import { getNameAndAvatar } from "../Common/readProfileFn.js";

import {fundraisingDb} from '../Database/fundraising.db';
import Loading from "../Home/loading.component.js";

export default class ExploreGroup extends Component {
  constructor(props) {
    super();

    this.state = {
      userAddress: localStorage.getItem("MyAddress"),
      groups: [],
      modal: {
        show: false,
      },
      search: "",
    };
  }

  async componentDidMount() {
    var self = this;
    self.setState({
      loadingActive : true
    })
    var groups = await fundraisingDb.filterGroup(this.state.userAddress, "")
    for (var e in groups) {
      groups[e].ownerprofile = await getNameAndAvatar(groups[e].owner);
    }
    self.setState({
      groups,
      loadingActive : false
    });
  }

  async goToGroup(event) {
    if (event) {
      event.preventDefault();
    }

    var groupIndex = event.target.name;

    var selectedGroup = this.state.groups[groupIndex];
    var userAddress = localStorage.getItem("MyAddress");

    if (selectedGroup.restriction) {
      var checkProfileHasToken = await checkBalance(
        selectedGroup.restriction,
        userAddress
      );
      
      if (checkProfileHasToken > 0) {
        await this.checkJoinedGroup(selectedGroup, userAddress);

        window.location = "/group?groupType=1&groupId=" + selectedGroup.groupId;
      } else {
        this.setState({
          modal: {
            show: true,
            title: "You have no right to access the group",
            description:
              "The group is restricted by NFT access, you need to own <a href='https://explorer.execution.testnet.lukso.network/address/" +
              selectedGroup.restriction +
              "'>the NFT </a>",
          },
        });
      }
    } else {
      await this.checkJoinedGroup(selectedGroup, userAddress);

      window.location = "/group?groupType=1&groupId=" + selectedGroup.groupId;
    }
  }

  async checkJoinedGroup(selectedGroup, userAddress) {
    if (!selectedGroup.user) {
      try {

        await fundraisingDb.joinGroup(selectedGroup.groupId, userAddress);
      } catch (e) {
        console.log(e);
      }
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

              {groups[e].user 
            ?  <Button className="btnDarkBlue" style={{"width": "70%"}} name={e} onClick={(event) => this.goToGroup(event)}>Enter (already joined)</Button>
            :	groups[e].restriction 
            ? <Button  className="btnDarkBlue" style={{"width": "70%"}} name={e} onClick={(event) => this.goToGroup(event)}>Join (with restriction)</Button>
            : <Button  className="btnDarkBlue" style={{"width": "70%"}} name={e} onClick={(event) => this.goToGroup(event)}>Join</Button>
            }
          </Grid.Column>
        </Grid.Row>
      );
    }
    return groupGrid;
  }

  async handleSearch(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;

    var groups = await fundraisingDb.filterGroup(this.state.userAddress, value)

    for (var e in groups) {
      groups[e].ownerprofile = await getNameAndAvatar(groups[e].owner);
    }

    this.setState({
      search: value,
      groups,
    });
  }

  render() {
    return (
      <>
        <Loading active={this.state.loadingActive}></Loading>
        <ShowModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          description={this.state.modal.description}
          handleClose={(e) => {
            this.setState({ modal: { show: false } });
          }}
        />
        <Image src="./exploreGroupTheme.jpg"></Image>
        <h2>Explore groups</h2>

        <div>
          <Input
            type="text"
            placeholder="Search groups.."
            name="search"
            onChange={this.handleSearch.bind(this)}
          />
        </div>

		<h3>You can join the following groups:</h3>

        <Grid style={{padding : "10px"}}>
          {this.getGroupList()}
        </Grid>
      </>
    );
  }
}
