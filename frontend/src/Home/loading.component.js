import React, { Component } from "react";

import { Loader } from 'semantic-ui-react'

class Loading extends Component {

	render() {
		return (<>
			<div className={this.props.active==true ? (this.props.local==true ? "loadingLocalShow" : "loadingShow" ): "loadingHidden"} >
				<Loader active>Please wait</Loader>
			</div>
		</>)
	}
}

export default Loading