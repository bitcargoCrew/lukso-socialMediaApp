import React, { Component } from "react";

import {
  Grid,
  Image,
  Card,
  Button,
  Tab,
  Breadcrumb,
} from "semantic-ui-react";

import "./group.css";

import Post from "./post.component";
import { getNameAndAvatar } from "../Common/readProfileFn.js";
import { NewPost } from "./newPost";
import { NewFundraising } from "./newFundraising";
import { Donation } from "./donation";

import Loading from "../Home/loading.component.js";
import { config } from "../Common/config";
import { fundraisingDb } from "../Database/fundraising.db";

export default class GroupDetail extends Component {
  constructor(props) {
    super();

    const queryParameters = new URLSearchParams(window.location.search);
    const postType = queryParameters.get("postType");
    const postId = queryParameters.get("postId");
    const groupId = queryParameters.get("groupId");

    const tabs = [
      {
        menuItem: "Description",
        render: () => (
          <Tab.Pane attached={false}>{this.tabDescription()}</Tab.Pane>
        ),
      },
      {
        menuItem: "The content posts of the group",
        render: () => (
          <Tab.Pane attached={false}>{this.tabListOfPost()}</Tab.Pane>
        ),
      },
      {
        menuItem: "Fundraising within your group",
        render: () => (
          <Tab.Pane attached={false}>{this.tabFundraising()}</Tab.Pane>
        ),
      },
    ];

    this.state = {
      userAddress: localStorage.getItem("MyAddress"),
      type: 0,
      myProfile: JSON.parse(localStorage.getItem("MyProfile")),
      groupId: props.selectedGroup.groupId,
      queryParams: {
        postType,
        postId,
        groupId,
      },
      tabs,
      loadingActive: false,
    };
  }

  async componentDidMount() {
    var self = this;

    this.setState({
      loadingActive : true
    })

    var posts = await fundraisingDb.getPosts(self.props.selectedGroup.groupId);

    for (var e in posts) {
      posts[e].ownerprofile = await getNameAndAvatar(posts[e].owner);
    }

    if (self.state.queryParams.postType && self.state.queryParams.postId) {
      for (var e in posts) {
        if (posts[e].postId == self.state.queryParams.postId) {
          self.setState({
            type: 1,
            posts,
            selectedPost: posts[e]
          });
          break;
        }
      }
    } else {
      self.setState({
        posts
      });
    }

    //Pull campaign from blockchain
    var lsCampaigns = [];

    var lsCampaigns = await fundraisingDb.getCampaigns(self.props.selectedGroup.groupId);

    this.setState({ 
      lsCampaigns,
      loadingActive : false
    });
  }

  getFundraisingCardList() {
    var cards = [];
    var lsCampaigns = this.state.lsCampaigns;
    for (var e in lsCampaigns) {
      cards.push(
        <Card>
          <Card.Content>
            <Image
              floated="right"
              size="medium"
              src={lsCampaigns[e].imageLink}
            />
            <Card.Header>{lsCampaigns[e].name}</Card.Header>

          </Card.Content>
          <Card.Content extra>
            <div className="ui two buttons">
              <Donation
                myCampain={lsCampaigns[e]}
                setLoadingActive={this.setLoadingActive.bind(this)}
              ></Donation>
            </div>
          </Card.Content>
        </Card>
      );
    }
    return cards;
  }

  goToPost(event) {
    event.preventDefault();

    var postIndex = event.target.name;

    window.location =
      "/group?groupType=1&groupId=" +
      this.state.queryParams.groupId +
      "&postType=1&postId=" +
      this.state.posts[postIndex].postId;
  }

  getPostList() {
    var postGrid = [];
    var posts = this.state.posts;
    for (var e in posts) {
      postGrid.push(
        <Grid.Row
          style={{ margin: "5px", background: "#eadfdf", borderRadius: "14px", background: "rgba(0,0,0,.05)" }}
        >
          <Grid.Column width={14}>
            <h2>{posts[e].title}</h2>
            <div>
              Created by:
              <img
                src={posts[e].ownerprofile.myAvatar}
                className="ui avatar image"
                style={{marginLeft: "5px"}}
              />
              {posts[e].ownerprofile.myName}
            </div>
          </Grid.Column>
          <Grid.Column width={1}>
            <Button className="btnDarkBlue" name={e} onClick={(event) => this.goToPost(event)}>
              Enter
            </Button>
          </Grid.Column>
        </Grid.Row>
      );
    }
    return postGrid;
  }

  async hanldeNewPost(newPost) {
    newPost.owner = this.state.myProfile.myAddress;
    newPost.groupId = this.state.groupId;

    await fundraisingDb.newPost(newPost);

    newPost.ownerprofile = this.state.myProfile;
    var posts = this.state.posts;
    posts.push(newPost);
    this.setState({ posts });
  }

  async hanldeNewCampaign(newCampaign) {
    newCampaign.groupId = this.state.groupId;

    // Put into blockchain

    if (window.fundraisingContract) {
      this.setState({
        loadingActive: true,
      });

      try {
        await window.fundraisingContract.methods
          .createCampaign(
            newCampaign.campaignId,
            newCampaign.groupId,
            newCampaign.goalAmount,
            newCampaign.deadline
          )
          .send({
            from: localStorage.getItem("MyAddress"),
          });
      } catch (e) {
        console.log(e);
        return;
      }

      await fundraisingDb.newCampaign(newCampaign);

      var lsCampaigns = this.state.lsCampaigns;
      lsCampaigns.push(newCampaign);
      this.setState({
        lsCampaigns,
        loadingActive: false,
      });
    }
  }

  createFundraisingCampaign(e) {
    e.preventDefault();
    window.location = "./fundraising/new?groupId=" + this.state.groupId;
  }

  tabListOfPost() {
    return (
      <>
        <div style={{ display: "flex" }}>
          <NewPost hanldeNewPost={this.hanldeNewPost.bind(this)}></NewPost>
        </div>
        <Grid>{this.getPostList()}</Grid>
      </>
    );
  }

  tabFundraising() {
    return (
      <>
        <div style={{ display: "flex" }}>
          <NewFundraising
            hanldeNewCampaign={this.hanldeNewCampaign.bind(this)}
          ></NewFundraising>
        </div>
        <Card.Group>{this.getFundraisingCardList()}</Card.Group>
      </>
    );
  }

  tabDescription() {
    return (
      <div
        className="innerHTMLContent"
        dangerouslySetInnerHTML={{
          __html: this.props.selectedGroup.description,
        }}
      ></div>
    );
  }

  setLoadingActive(loadingActive) {
    this.setState({ loadingActive });
  }

  render() {
    return (
      <>
        {this.state.type == 0 ? (
          <div className="detailGroup"
            style={{backgroundImage:"url('')"}}
            >
            <Loading active={this.state.loadingActive}></Loading>

            <Breadcrumb>
              <a href="/group">
                <Breadcrumb.Section link>Groups</Breadcrumb.Section>
              </a>
              <Breadcrumb.Divider />
              <Breadcrumb.Section active>Group</Breadcrumb.Section>
            </Breadcrumb>

            <div style={{padding: "5px"}}>
              <h1>
                <Image src={this.props.selectedGroup.imageLink} size='medium' spaced='right' style={{"border": "5px solid #e9ecef", "borderRadius": "5px" }} />  
                {this.props.selectedGroup.name}
              </h1>
            </div>

            <div>
              <a href={"https://wallet.universalprofile.cloud/"+this.props.selectedGroup.ownerprofile.myAddress}>
                Created by:
                <img style={{marginLeft: "5px", marginBottom: "5px"}} src={this.props.selectedGroup.ownerprofile.myAvatar} className="ui avatar image" />
                {this.props.selectedGroup.ownerprofile.myName}
              </a>
              &nbsp;at {new Date(parseInt(this.props.selectedGroup.createdTime)).toLocaleString()}
            </div>

            <div>
              <i>Topic : {this.props.selectedGroup.topic}</i>
            </div>

            <hr />

            <Tab
              menu={{ pointing: true }}
              panes={this.state.tabs}
              className="DetailGroupTab"
            />
          </div>
        ) : this.state.type == 1 ? (
          <>
            <Post selectedPost={this.state.selectedPost}></Post>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}
