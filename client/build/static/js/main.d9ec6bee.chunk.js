(this["webpackJsonpreact-chat-app"]=this["webpackJsonpreact-chat-app"]||[]).push([[0],{50:function(e,t,a){e.exports=a(87)},55:function(e,t,a){},78:function(e,t){},86:function(e,t,a){},87:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(46),s=a.n(r),c=(a(55),a(6)),i=a(7),l=a(9),m=a(10),u=a(16),d=a(1),h=a(47),p=a.n(h),f=a(17),g=a(8),v=a(18),E=a.n(v),b=function(e){return o.a.createElement(o.a.Fragment,null,e.rooms.map((function(e,t){return"undefined"!==typeof e?o.a.createElement("option",{key:t},e):null})))},y=function(e){return o.a.createElement(o.a.Fragment,null,o.a.createElement("h3",{className:"list-title"},"Active Rooms"),o.a.createElement("ul",{className:"rooms"},e.rooms.map((function(t,a){return"undefined"!==typeof t?o.a.createElement("li",{className:"switch-room ".concat(e.currentRoom===t?"disabled":""),key:a},o.a.createElement("button",{disabled:e.currentRoom===t,onClick:function(){return e.switchRoom(t)}},t)):null}))))},S=E()("https://borde-react-chat-app.herokuapp.com/"),w={room:"",rooms:[],username:""},N=function(e){Object(m.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).onInputUpdate=function(e){var t=e.target.name,a=e.target.value;n.setState(Object(g.a)({},t,a))},n.join=function(){var e=n.state,t=e.username,a=e.room;t&&a&&n.props.history.push("/chat/".concat(t,"/").concat(a))},n.state=Object(f.a)({},w),n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=this;S.on("roomsList",(function(t){var a=t.rooms;e.setState({rooms:a})}))}},{key:"componentWillUnmount",value:function(){S.off("roomsList")}},{key:"render",value:function(){var e=this.state,t=e.room,a=e.rooms,n=e.username;return o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-xs"},o.a.createElement("form",{className:"centered-form__box"},o.a.createElement("h2",null,"Join"),o.a.createElement("input",{name:"username",placeholder:"Display name",autoComplete:"off",value:n,onChange:this.onInputUpdate}),o.a.createElement("input",{type:"text",list:"rooms",name:"room",placeholder:"Room",autoComplete:"off",value:t,onChange:this.onInputUpdate}),o.a.createElement("datalist",{id:"rooms"},o.a.createElement(b,{rooms:a})),o.a.createElement("button",{onClick:this.join},"Join"))))}}]),a}(n.Component),j=Object(d.f)(N),k=a(31),O=a(49),_=a.n(O),C=function(e){var t=e.count,a=void 0===t?1:t,n=e.height,r=void 0===n?"3rem":n;return o.a.createElement(_.a,{borderRadius:0,width:"100%",widthRandomness:0,color:"#d8d8d8",height:r,count:a})},R=a(30),x=a.n(R),A=function(e){return o.a.createElement("div",null,e.data.map((function(e,t){return"undefined"!==typeof e.username?o.a.createElement("div",{key:t,className:"message"},o.a.createElement("p",null,o.a.createElement("span",{className:"message__name"},e.username),o.a.createElement("span",{className:"message__meta"},e.createdAt)),e.url?o.a.createElement("p",null,o.a.createElement("a",{href:e.url,target:"_blank",rel:"noopener noreferrer"},"My current location")):o.a.createElement("p",null,e.message)):null})))},I=function(e){return o.a.createElement(o.a.Fragment,null,o.a.createElement("h2",{className:"room-title"},e.room),o.a.createElement("h3",{className:"list-title"},"Users"),o.a.createElement("ul",{className:"users"},e.users.map((function(e,t){return o.a.createElement("li",{key:t},e.username)}))))},L=E()("https://borde-react-chat-app.herokuapp.com/"),B={disabled:!1,fetchingLocation:!1,isSideBarActive:!1,message:"",messages:[],room:"",rooms:[],users:[]},H=function(e){Object(m.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).autoscroll=function(){var e=document.querySelector("#messages"),t=document.querySelector("#messages div"),a=t.lastElementChild;if(null!==a){var n=getComputedStyle(a),o=parseInt(n.marginBottom),r=a.offsetHeight+o,s=e.offsetHeight;t.scrollHeight-r<=e.scrollTop+s&&(e.scrollTop=e.scrollHeight)}},n.join=function(){var e=n.state,t=e.username,a=e.room;t&&a&&n.props.history.push("/chat/".concat(t,"/").concat(a))},n.toggleSideBar=function(){n.setState({isSideBarActive:!n.state.isSideBarActive})},n.onInputUpdate=function(e){var t=e.target.name,a=e.target.value;n.setState(Object(g.a)({},t,a))},n.handleSubmit=function(e){e.preventDefault();var t=n.state.message;n.setState({disabled:!0}),L.emit("sendMessage",t,(function(e){if(n.setState({disabled:!1}),n.clearForm(),e)return console.log(e)}))},n.switchRoom=function(e){var t=n.props.match.params.username;L.emit("switchRoom",t,e),window.location.href="/chat/".concat(t,"/").concat(e)},n.sendLocation=function(e){if(e.preventDefault(),!navigator.geolocation)return alert("Geolocation is not supported by your browser.");n.setState({disabled:!0,fetchingLocation:!0}),navigator.geolocation.getCurrentPosition((function(e){L.emit("sendLocation",{lat:e.coords.latitude,long:e.coords.longitude},(function(){n.setState({disabled:!1,fetchingLocation:!1})}))}))},n.textInput=o.a.createRef(),n.state=Object(f.a)({},B),n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=this,t={username:this.props.match.params.username,room:this.props.match.params.room};L.emit("join",t,(function(e){e&&(alert(e),window.location.href="/")})),L.on("message",(function(t){var a,n={username:t.username,message:t.text,createdAt:x()(t.createdAt).format("h:mm a")};(null===(a=e.textInput)||void 0===a?void 0:a.current)&&e.textInput.current.focus(),e.setState({messages:[].concat(Object(k.a)(e.state.messages),[n])},(function(){return e.autoscroll()}))})),L.on("locationMessage",(function(t){var a={username:t.username,url:t.url,createdAt:x()(t.createdAt).format("h:mm a")};e.setState({messages:[].concat(Object(k.a)(e.state.messages),[a])},(function(){return e.autoscroll()}))})),L.on("roomData",(function(t){var a=t.room,n=t.users;e.setState({users:n,room:a})})),L.on("roomsList",(function(t){var a=t.rooms;e.setState({rooms:a})}))}},{key:"clearForm",value:function(){this.setState({message:""})}},{key:"render",value:function(){var e=this,t=this.state,a=t.disabled,n=t.fetchingLocation,r=t.isSideBarActive,s=t.message,c=t.messages,i=t.room,l=t.rooms,m=t.users;return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"chat",style:{height:window.innerHeight}},o.a.createElement("i",{onClick:this.toggleSideBar,className:"mobile-menu fas fa-bars ".concat(r?"active":"")}),o.a.createElement("div",{id:"sidebar",className:"chat__sidebar ".concat(r?"active":""),style:{height:window.innerHeight}},o.a.createElement("div",{id:"sidebar-users"},o.a.createElement(I,{users:m,room:i})),o.a.createElement("div",{id:"sidebar-rooms"},o.a.createElement(y,{rooms:l,currentRoom:i,switchRoom:this.switchRoom}))),o.a.createElement("div",{className:"chat__main ".concat(r?"active":""),style:{height:document.documentElement.clientHeight}},n&&o.a.createElement(C,{height:"".concat(window.innerHeight,"px")}),o.a.createElement("div",{id:"messages",className:"chat__messages"},o.a.createElement(A,{data:c})),o.a.createElement("div",{className:"compose",onSubmit:function(t){return e.handleSubmit(t)}},o.a.createElement("form",{id:"message-form"},o.a.createElement("input",{name:"message",placeholder:"Type your message...",autoComplete:"off",value:s,onChange:this.onInputUpdate,ref:this.textInput}),o.a.createElement("div",{className:"btnWrap"},o.a.createElement("button",{disabled:a,type:"submit",className:"btn"},o.a.createElement("i",{className:"tooltip fab fa-telegram-plane",alt:"send message",title:"send message"},o.a.createElement("span",{className:"tooltiptext"},"Send Message"))),o.a.createElement("button",{disabled:a,id:"send-location",className:"btn",onClick:function(t){return e.sendLocation(t)}},o.a.createElement("i",{className:"tooltip far fa-compass",alt:"send location",title:"send location"},o.a.createElement("span",{className:"tooltiptext"},"Send Location")))))))))}}]),a}(n.Component),M=Object(d.f)(H),D=(a(86),function(e){Object(m.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={site_loaded:!1},n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){this.setState({site_loaded:!0})}},{key:"render",value:function(){return o.a.createElement("div",{className:p()({App:!0,site_loaded:this.state.site_loaded})},o.a.createElement(u.a,null,o.a.createElement(d.c,null,o.a.createElement(d.a,{path:"/chat/:username/:room",component:M}),o.a.createElement(d.a,{path:"/",component:j}))))}}]),a}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(D,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[50,1,2]]]);
//# sourceMappingURL=main.d9ec6bee.chunk.js.map