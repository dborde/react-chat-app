import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
const socket = io(ENDPOINT);

const initialState = {
  users: [],
  messages: [],
  newMsg: '',
  fetchingLocation: false,
  isSideBarActive: false
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    }
}

  componentDidMount() {
    socket.on('message', (message) => {
      console.log(message)
    })
    const params = {
      username: this.props.match.params.username,
      room: this.props.match.params.room
    }
    socket.emit('join', params, (err) => {
      if (err) {
        this.props.history.push('/');
      }
    });
  }

  join = () => {
    const { username, room } = this.state;
    if (username && room) {
      this.props.history.push(`/chat/${username}/${room}`)
    }
  }

  toggleSideBar = () => {
    this.setState({isSideBarActive: !this.state.isSideBarActive})
  }

  handleSubmit = async e => {
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
  };

  render() {
    const { isSideBarActive } = this.state;
    return (
      <React.Fragment>
      <div className="chat">
        <i onClick={this.toggleSideBar} className={`mobile-menu fas fa-bars ${isSideBarActive ? "active" : ""}`}></i>
        <div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`}>
          <div id="sidebar-users"></div>
          <div id="sidebar-rooms"></div>
        </div>

        <div className={`chat__main ${isSideBarActive ? "active" : ""}`}>
          <div id="messages" className="chat__messages"></div>

          <div className="compose">
            <form id="message-form">
              <input name="message" placeholder="Type your message..." autoComplete="off" />
              <div className="btnWrap">
                <button className="btn">
                  <i className="tooltip fab fa-telegram-plane" alt="send message" title="send message">
                    <span className="tooltiptext">Send Message</span>
                  </i>
                </button>
                <button id="send-location" className="btn">
                  <i className="tooltip far fa-compass" alt="send location" title="send location">
                    <span className="tooltiptext">Send Location</span>
                  </i>         
                </button>
              </div>    
            </form>
          </div>
        </div>
      </div>
      
      {/*<div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`}>
        <div id="sidebar-users"></div>
        <div id="sidebar-rooms"></div>
        <button onClick={this.toggleSideBar} className="btn">Toggle</button>
      </div>
      <div className="chat">
        <div className="chat__main">
          <div id="messages" className="chat__messages"></div>

          <div className="compose">
            <form id="message-form">
              <input name="message" placeholder="Message" required autoComplete="off" />
              <button>Send</button>
            </form>
            <button id="send-location">Send location</button>       
          </div>
        </div>
    </div>*/}
      </React.Fragment>
    );
  }
}

export default withRouter(Chat);

// <form onSubmit={this.handleSubmit}>
//   <p>
//     <strong>Post to Server:</strong>
//   </p>
//   <input name="message" placeholder="Message" />
//   <button type="submit">Submit</button>
// </form>

// import React, { Component } from 'react';
// import socketIOClient from "socket.io-client";
// import './App.css';

// const ENDPOINT = "http://127.0.0.1:5000";
// const socket = socketIOClient(ENDPOINT);

// class App extends Component {
//   state = {
//     response: '',
//     post: '',
//     responseToPost: '',
//   };
  
//   componentDidMount() {
//     socket.on('message', (message) => {
//       console.log(message)
//     })
//   }

//   handleSubmit = async e => {
//     e.preventDefault();
//     const message = e.target.elements.message.value
//     socket.emit('sendMessage', message)
//   };
  
//   render() {
//     return (
//       <div className="App">
//         <form onSubmit={this.handleSubmit}>
//           <p>
//             <strong>Post to Server:</strong>
//           </p>
//           <input name="message" placeholder="Message" />
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     );
//   }
// }

// export default App;

// maxWidth: 1280 + "px", 

// <div>
//           <div className="row" style={{maxWidth: 1280 + "px", margin: "0 auto"}}>
//             <input className="col-xs-9" name="message" placeholder="Message" required autoComplete="off"/>
//             <button className="col-xs-3">Send</button>
//           </div>
//         </div>



// <div style={{display: "flex"}}>
// <div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`}>
//   <div id="sidebar-users"></div>
//   <div id="sidebar-rooms"></div>
//   <button onClick={this.toggleSideBar} className="btn">Toggle</button>
// </div>
// <div style={{backgroundColor: "#ccc", margin: "1rem auto", display: "flex", flexGrow: 1, flexDirection: "column", maxHeight: "100vh"}}>
//   <div id="messages" className="col-xs-12" style={{backgroundColor: "#aaa", height: 100 + "vh"}}></div>
// </div>

// <div className="row" style={{margin: "0 0 0 255px", width: "calc(100% - 255px)", position: "fixed", bottom: 0, right: 0}}>
//   <input className="col-xs-9" name="message" placeholder="Message" required autoComplete="off"/>
//   <button className="col-xs-3">Send</button>
// </div>
// </div>


// <div className="row between-xs">
// <div className="col-xs-2">
//     <div className="box">
//         between
//     </div>
// </div>
// <div className="col-xs-8" style={{backgroundColor: "#ccc", height: "100vh"}}>
//     <div className="box">
//         between
//     </div>
// </div>
// <div className="col-xs-2">
//     <div className="box">
//         between
//     </div>
// </div>


// <div className="row start-xs">
// <div className="col-xs-12" style={{backgroundColor: "#bbb", paddingLeft: 0}}>
//   <button onClick={this.toggleSideBar} className="btn">Toggle</button>
// </div>
// </div>
// <div className="col" style={{backgroundColor: "#ddd", height: "100vh", display: "flex", width: "100%"}}>
// <div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`}></div>
// <div className="row">
//   <div className="col-xs-1 col-sm-3 col-md-2 col-lg-1" style={{backgroundColor: "#ccc", height: "100vh"}}>
//     <div className="box-row"></div>
//   </div>
//   <div className="col-xs-11 col-sm-9 col-md-10 col-lg-11" style={{backgroundColor: "#aaa", height: "100vh"}}>
//     <div className="box-row"></div>
//   </div>
// </div>
// </div>


// <div className="row start-xs" style={{padding: 0, margin: 0, position: "fixed", top: 0, width: "100%"}}>
// <div className="col-xs-12" style={{backgroundColor: "#bbb", padding: 0, margin: 0}}>
//   <button onClick={this.toggleSideBar} className="btn">Toggle</button>
// </div>
// </div>
// <div style={{height: "100vh", display: "flex", width: "100%", padding: 0, margin: "3rem 0 0 0"}}>
// <div id="sidebar" className={`chat__sidebar ${isSideBarActive ? "active" : ""}`}></div>
// <div className="row start-xs" style={{width: "100%", padding: 0, margin: 0}}>
//   <div className="col-xs-12" style={{backgroundColor: "#aaa", height: "100vh", padding: "0", margin: "0"}}>
//     <div className="box-row">
//       <input name="message" placeholder="Message" required autoComplete="off" style={{width: "100%"}}/>
//     </div>
//   </div>

//   <div className="col-xs-12" style={{backgroundColor: "#bbb", padding: 0, margin: 0, position: "fixed", bottom: 0, width: "100%"}}>
//     <input name="message" placeholder="Message" required autoComplete="off"/>
//     <button onClick={this.toggleSideBar} className="btn">Toggle</button>
//   </div>
// </div>