import React, { Component } from "react";

import YouTube from "react-youtube";


import { IoIosCheckmarkCircle } from 'react-icons/io';

import {
  Button,
  Container,
  Grid,
  Header,
  Image,
} from "semantic-ui-react";

import MyHeader from "../Common/header.component";
import MyFooter from "../Common/footer.component";

import "./home.css";

import backgroundImage_woman from "./background_image_woman.jpg";
import screenshot_one from "./sceenshot_one.jpg";
import img1 from './partner-1-1.png';
import featureImage1 from './feature-1.svg'
import featureImage2 from './feature-2.svg'
import featureImage3 from './feature-3.svg'
import img2 from './partner-2-2.png';
import work1 from './member-1.png';
import work2 from './member-2.png';
import work3 from './member-3.png';

export default class MainTab extends Component {
  constructor(props) {
    super();
    this.state = {
    };
  }

  render() {
    const options = {
      height: "390",
      width: "640",
      playerVars: {
        autoplay: 1,
        controls: 1,
      },
    };

    return (
      <div>
        <MyHeader></MyHeader>
          <Image src={backgroundImage_woman} fluid />
        
        <Container style={{ marginTop: "210px" }}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header className="headerTitle">
                  One DApp to Build and Grow powerful Web3 Communities
                </Header>
                  <p className="bodyText">On Bitvia you will find everything you need to connect to your fans, interact with them and let them support you. Powered by the possibilites of Web3, you have all the tools at your disposal to expand your fan base and distribute your ideas. No matter where you are on your creative journey, there should be no boundaries.</p>
                  <Grid style={{ marginTop: "10px"}} >
                    <p>Powered by</p> 
                    <Image src={img1}  
                    width={190}
                    height={36}/>
                    <Button style={{marginLeft: "20px"}} href={"https://my.universalprofile.cloud/"}>Create Your Universal Profile</Button>       
                  </Grid>
              </Grid.Column>
              <Grid.Column>
                <Image fluid src={screenshot_one} />
              </Grid.Column>
            </Grid.Row> 
          </Grid>
        </Container>

        <Container style={{ marginTop: "200px" }}>
          <Grid textAlign="center">
            <Grid.Row columns={1}>
              <Grid.Column>
                <h1 className="headerTitle">Access the new creative economy with Bitvia</h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Container style={{ marginTop: "50px" }}>
          <Grid textAlign="center">
            <Grid.Row columns={3}>
              <Grid.Column>
                <Image src={featureImage1} centered/> 
                <h1>Create <br />communities to share content & ideas</h1>
                <p className="bodyText">Seamlessly connect your Universal Profile (UP) as your digital identity, create your personal groups and share exclusive NFTs.</p>
              </Grid.Column>
              <Grid.Column>
               <Image src={featureImage2} centered/> 
               <h1>Connect<br /> to supporters to accept donations & sales</h1>
               <p className="bodyText">Invite and grow your audience, let your supporters directly interact with your content and enable peer-to-peer token transfers.</p>
              </Grid.Column>
              <Grid.Column>
                <Image src={featureImage3} centered />
                <h1>Collaborate <br />on projects to get funded from your fans</h1>
                <p className="bodyText">Collaborate with you fans on your next project and utilize blockchain technology to facilitate fundraising without intermediaries.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <Container style={{ marginTop: "200px" }}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header className="headerTitle" style={{ marginBottom: "30px" }}>
                  Community building powered by the Lukso Blockchain
                </Header>
                  <p className="bodyText" > <IoIosCheckmarkCircle /> Use your Lukso Universal Profile as your identity </p>
                  <p className="bodyText" > <IoIosCheckmarkCircle /> Create communities to easily share your NFTs </p>
                  <p className="bodyText" > <IoIosCheckmarkCircle /> Transfer cryptocurrencies without borders peer-to-peer</p>
                  <p className="bodyText" > <IoIosCheckmarkCircle /> Get funded faster without relying on intermediaries</p>
                  <p className="bodyText" > <IoIosCheckmarkCircle /> Establish transparency and trust with your supporters</p>
              </Grid.Column>
              <Grid.Column>
                <Image src={img2} />
              </Grid.Column>
            </Grid.Row> 
          </Grid>
        </Container>


        <Container style={{ marginTop: "190px" }}>
          <Grid centered >
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header textAlign="center" className="headerTitle">
                  Create, connect & collaborate 
                </Header>
                <Header textAlign="center" style={{ marginBottom: "50px" }} className="bodyText">Bitvia provides a platform where people come together to succeed in the new creative economy</Header>
                <Grid centered marginTop ="50px">
                  <YouTube 
                   align-items="center"
                    videoId="Oflbho9ZG2U"
                    options={options}
                    onReady={this._onReady}
                    id="video"
                  />
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <Container style={{ marginTop: "190px" }}>
          <Grid textAlign="center">
            <Grid.Row columns={1}>
              <Grid.Column>
                <h1 className="headerTitle">Meet the Team</h1>
                <Header textAlign="center" className="bodyText">We are three founders with a passion for decentralized applications</Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Container style={{ marginTop: "50px" }}>
          <Grid textAlign="center">
            <Grid.Row columns={3}>
              <Grid.Column>
                <Image src={work1} centered/> 
                <h1>Sandro</h1>
                <p className="bodyText">Business</p>
              </Grid.Column>
              <Grid.Column>
               <Image src={work2} centered/> 
               <h1>Thanh</h1>
               <p className="bodyText">Engineering</p>
              </Grid.Column>
              <Grid.Column>
                <Image src={work3} centered />
                <h1>Roger</h1>
                <p className="bodyText">Product</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <Container style={{ marginTop: "120px" }}></Container>


        <MyFooter ></MyFooter>
      </div>
    );
  }
  _onReady(event) {
    event.target.pauseVideo();
  }
}
