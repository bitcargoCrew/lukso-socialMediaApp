import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import {
  Container,
  Button,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";

import Web3 from "web3";
import { abi } from "./fundraising-abi";

import { getNameAndAvatar } from "./readProfileFn.js";

import { config } from "./config.js";

// const CONTRACT_ADDRESS = "0xad83db5868D9AFF339254478f12bB44a9a0B6B3C";

import { Buffer } from "buffer";

// @ts-ignore
window.Buffer = Buffer;

export default class MyHeader extends Component {
  constructor(props) {
    super();

    this.state = {
      myAvatar: "",
      myName: "",
    };

    try {
      var web3 = new Web3(window.lukso);
      web3.eth.handleRevert = true;
      // console.log(web3);

      window.web3 = web3;

      window.fundraisingContract = new web3.eth.Contract(
        abi,
        config.FUNDRAISING_CONTRACT_ADDRESS
      );

      if (props.waitForLoad) {
        props.waitForLoad();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async componentWillMount() {
    var myAddress = localStorage.getItem("MyAddress");

    if (myAddress) {
      this.setState(await getNameAndAvatar(myAddress));
    }
  }

  async login() {
    try {
      var web3 = new Web3(window.lukso);
      web3.eth.handleRevert = true;

      window.web3 = web3;

      let address = await web3.eth.getAccounts();

      address = await web3.eth.requestAccounts();

      address = address[0];

      localStorage.setItem("MyAddress", address);

      let myProfile = await getNameAndAvatar(address);

      localStorage.setItem("MyProfile", JSON.stringify(myProfile));

      this.setState(myProfile);

      if (this.props.onChangeAddress) {
        this.props.onChangeAddress(address);
      }
    } catch(e) {
      
    }
  }

  logout() {
    localStorage.removeItem("MyAddress");
    localStorage.removeItem("MyProfile");

    if (this.props.onChangeAddress) {
      this.props.onChangeAddress(undefined);
    }

    this.setState({
      myAvatar: "",
      myName: "",
    });
    window.location = "/";
  }

  render() {
    return (
      <Menu fixed="top" style={{ backgroundColor: "#001856" }}>
        <Container style={{ fontSize: "1.2rem"}}>
          <Link to="/">
            <Image src="/bitvia.png" width={170} height={50} alt="Bitvia" />
          </Link>
          <Menu.Item as="a">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item as="a">
            <Link to="/group">Groups</Link>
          </Menu.Item>
          <Menu.Item as="a">
            <Link to="/chat">Messenger</Link>
          </Menu.Item>

          {/* <Link to={{ pathname: "/register",  state: data_you_need_to_pass  }}> */}
          {/* <Dropdown item simple text='Dropdown'>
                    <Dropdown.Menu>
                        <Dropdown.Item>List Item</Dropdown.Item>
                        <Dropdown.Item>List Item</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Header>Header Item</Dropdown.Header>
                        <Dropdown.Item>
                        <i className='dropdown icon' />
                        <span className='text'>Submenu</span>
                        <Dropdown.Menu>
                            <Dropdown.Item>List Item</Dropdown.Item>
                            <Dropdown.Item>List Item</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown.Item>
                        <Dropdown.Item>List Item</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown> */}
          {this.state.myName ? (
            // <Menu.Item as='a' position='right'>
            <Menu.Menu position="right">
              <Menu.Item>
                <img src={this.state.myAvatar} className="ui avatar image" />
              </Menu.Item>
              <Dropdown style={{ color: "#4183c4" }} item simple text={"Hi " + this.state.myName + "!"}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    href={
                      "https://wallet.universalprofile.cloud/" +
                      this.state.myAddress
                    }
                  >
                    Your Universal Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.logout.bind(this)}>
                    Log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          ) : (
            <Menu.Item as="a" position="right" onClick={this.login.bind(this)}>
              <Button>Login With UP</Button>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    );
  }
}
