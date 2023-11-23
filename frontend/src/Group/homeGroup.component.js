import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import {
  Tab
} from "semantic-ui-react";

import MyHeader from "../Common/header.component";
import MyFooter from "../Common/footer.component";

import GroupList from "./listGroup.component";

import GroupExplore from "./exploreGroup.component";

import CreateGroup from "./createGroup.component";

import "./group.css";

export default class HomeGroup extends Component {
  constructor(props) {
    super();

		const queryParameters = new URLSearchParams(window.location.search)
    const groupType = queryParameters.get("groupType")
    var activeIndex = 0;
    if (groupType) {
      activeIndex = parseInt(groupType) - 1 
    }
    const panes = [
      {
        menuItem: "My Groups",
        render: () => (
          <Tab.Pane>
            <GroupList />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Explore groups",
        render: () => (
          <Tab.Pane>
            <GroupExplore />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Create groups",
        render: () => (
          <Tab.Pane>
            <CreateGroup />
          </Tab.Pane>
        ),
      }
    ];

    this.state = {
      panes,
      activeIndex
    };
  }

  async waitForLoad() {

  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

  render() {
    return (
      <div>
        <MyHeader waitForLoad={this.waitForLoad.bind(this)}></MyHeader>

        <div
          text
          style={{ paddingTop: "80px", minHeight : "calc(100vh - 105px)" }}
        >
          <Tab
            className="homeGroupTab"
            menu={{ fluid: true, vertical: true, borderless: true }}
            menuPosition="left"
            activeIndex={this.state.activeIndex}
            panes={this.state.panes}
            onTabChange={this.handleTabChange}
          />
        </div>

        <MyFooter></MyFooter>
      </div>
    );
  }
}
