import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import { Container,
	Divider,
	Dropdown,
	Grid,
	Header,
	Image,
	List,
	Menu,
	Segment } from 'semantic-ui-react'

export default class MyFooter extends Component {
	
	constructor(props) {
		super();

		this.state = {

		}
	}

	render() {
	     return (
            <Segment vertical style={{ position: 'relative' ,bottom: '0', width: '100%', margin: '2em 0em 0em', padding: '2em 0em', backgroundColor: "#001856" }}>
				<Container>
					<List horizontal inverted divided link size='small'>
					<List.Item as='a' href='https://drive.google.com/file/d/1mDNAOEZhSEOoSBhL94HNUy_U5Pq8S3aE/view?usp=drive_link'>
						Imprint
					</List.Item>
					<List.Item as='a' href='https://drive.google.com/file/d/1sm7nZPah4UNG-FZgBPvSDXPHo6cs16Uw/view?usp=drive_link'>
						Privacy Policy
					</List.Item>
					</List>
				</Container>
            </Segment>
       	)
	}
}