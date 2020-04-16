import React from 'react';
import User from './Components/Users/';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends React.Component {
	render(){
		return (
			<React.Fragment>
				<User/>
				<ToastContainer />
			</React.Fragment>
		);
	}
}

export default App;
