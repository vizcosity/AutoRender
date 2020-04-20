(window.webpackJsonpfrontend=window.webpackJsonpfrontend||[]).push([[0],{100:function(e,t,a){e.exports=a(150)},105:function(e,t,a){},150:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(26),l=a.n(o),c=(a(105),a(170)),i=a(97),s=a(19),u=a(172),m=a(173),p=a(161),d=a(162),b=a(38),f=(a(80),function(){var e;return r.a.createElement(i.a,(e={margin:{vertical:"small"},direction:"row",justify:"center"},Object(s.a)(e,"margin",{left:"auto",right:"auto",vertical:"medium"}),Object(s.a)(e,"style",{padding:"50px",borderRadius:"20px"}),e),r.a.createElement(u.a,{to:"/newRenderJob",margin:"10px",color:"dark-1",primary:!0,hoverIndicator:!0,icon:r.a.createElement(p.a,null),label:"New Render Job",as:b.b}),r.a.createElement(u.a,{to:"/manageJobs",margin:"10px",color:"dark-2",hoverIndicator:!0,icon:r.a.createElement(d.a,null),label:"Manage Jobs",as:b.b}))}),g=function(){return r.a.createElement(i.a,{flex:!0,justify:"center",align:"center",fill:"vertical"},r.a.createElement(m.a,{level:"1",margin:"0",color:"gray"},"AutoRender"),r.a.createElement(f,null))},h=a(20),y=a(21),j=a(23),E=a(22),O=a(32),v=a(24),w=a(163),k=a(171),P=a(174),S=a(47),x=a(70),D=a(76),A=a.n(D),F=a(93),C=function(e){return e?"?"+Object.entries(e).map(function(e){return e.map(encodeURIComponent).join("=")}).join("&"):""},J=function(e){return new Promise(function(t,a){fetch("/api/v1/jobs"+C(e),{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(e){try{return e.json()}catch(t){a(t)}}).then(function(e){return t(e)})})},R=function(){var e=Object(F.a)(A.a.mark(function e(t){var a,n;return A.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("/api/v1/logs?lines="+t,{method:"GET",headers:{"Content-Type":"application/json"}});case 3:return a=e.sent,e.next=6,a.json();case 6:return n=e.sent,console.log("Fetched logs:",n),e.abrupt("return",n.log);case 11:return e.prev=11,e.t0=e.catch(0),e.abrupt("return","Could not load logs. AutoRender API is probably down.");case 14:case"end":return e.stop()}},e,null,[[0,11]])}));return function(t){return e.apply(this,arguments)}}(),N=a(166);function z(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function I(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?z(a,!0).forEach(function(t){Object(s.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):z(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var L=function(){return r.a.createElement(i.a,{style:{maxWidth:"500px"},margin:{vertical:"medium"},fill:"horizontal",justify:"center"},r.a.createElement(m.a,{style:{display:"flex",alignItems:"center"},color:"dark-2",level:"3"},r.a.createElement(p.a,{style:{marginRight:"10px",opacity:"0.6"}}),"Add a new Render Job"),r.a.createElement(m.a,{color:"dark-3",margin:"none",level:"4"},"Make sure everything is correct or else you'll waste a few hours yo"))},q=function(e){function t(e,a){var n;return Object(h.a)(this,t),(n=Object(j.a)(this,Object(E.a)(t).call(this,e,a))).state={submitting:!1,postSubmission:null},n.onSubmitHandler=n.onSubmitHandler.bind(Object(O.a)(n)),n}return Object(v.a)(t,e),Object(y.a)(t,[{key:"onSubmitHandler",value:function(e){var t=this;this.setState(I({},this.state,{submitting:!0}),function(){var a,n=I({},e.value);console.log(e.target);for(var r=0;r<e.target.length;r++){var o=e.target[r];o.files&&(console.log(o,o.files),n[o.name]=o.files[0])}(a=I({},n,{truncateBuffers:!0}),new Promise(function(t,n){var r=new FormData;Object.keys(a).forEach(function(e){r.append(e,a[e])}),fetch("/api/v1/queueJob",{method:"POST",body:r}).then(function(t){try{return t.json()}catch(e){n(e)}}).then(function(e){return t(e)})})).then(function(e){e.success&&t.setState(I({},t.state,{postSubmission:e.job.id}))})})}},{key:"render",value:function(){return r.a.createElement(i.a,{flex:!0,margin:{vertical:"medium"},align:"center",justify:"center"},r.a.createElement(L,null),r.a.createElement(i.a,{fill:"horizontal",margin:{vertical:"large"},style:{maxWidth:"500px"}},this.state.submitting?r.a.createElement(S.Fade,null,r.a.createElement(i.a,{align:"center",direction:"column"},this.state.postSubmission?r.a.createElement(r.a.Fragment,null,r.a.createElement(N.a,{color:"status-ok"}),r.a.createElement(P.a,{margin:{vertical:"small"},color:"status-ok"},"Queued ",this.state.postSubmission),r.a.createElement(u.a,{margin:{vertical:"large"},label:"View Jobs",color:"dark-1",as:"a",href:"/manageJobs",primary:!0})):r.a.createElement(r.a.Fragment,null,r.a.createElement(x.ScaleLoader,{size:"large",color:"#555555"}),r.a.createElement(P.a,{color:"dark-2"},"Queuing up...")))):r.a.createElement(w.a,{onSubmit:this.onSubmitHandler},r.a.createElement(m.a,{level:"3"},"Song Details"),r.a.createElement(k.a,{required:!0,name:"artistName",label:"Artist Name",placeholder:"Porter Robinson"}),r.a.createElement(k.a,{required:!0,name:"songName",label:"Song Name",placeholder:"Sad Machine"}),r.a.createElement(k.a,{required:!0,name:"genre",label:"Genre",placeholder:"Electronic",value:"Electronic"}),r.a.createElement(k.a,{required:!0,name:"visualizerColour",label:"Visualizer Colour",help:"Must be a valid hex value e.g. #FFEA32",htmlFor:"test"}),r.a.createElement(m.a,{level:"3"},"Files"),r.a.createElement(k.a,{required:!0,name:"backgroundFile",label:"Background Image",type:"file"}),r.a.createElement(k.a,{name:"songFile",label:"Song File",type:"file"}),r.a.createElement(k.a,{name:"artworkFile",label:"Artwork Image",type:"file"}),r.a.createElement(u.a,{type:"submit",primary:!0,color:"dark-1",label:"Submit"}))))}}]),t}(n.Component),T=a(167),W=a(168);function B(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function H(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?B(a,!0).forEach(function(t){Object(s.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):B(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var M={completed:"status-ok",rendering:"status-warning",failed:"status-error",pending:"status-unknown"},V=[{property:"key",header:"#",render:function(e){return r.a.createElement(P.a,null,e.key)}},{property:"artistName",header:"Artist",render:function(e){return r.a.createElement(P.a,{weight:"bold"},e.artistName)}},{property:"songName",header:"Song"},{property:"status",header:"Status",render:function(e){return r.a.createElement(P.a,{color:M[e.status]},e.status)}},{property:"download",header:"Download",align:"center",render:function(e){return r.a.createElement(u.a,{style:{padding:"5px",borderRadius:"5px"},hoverIndicator:!0,as:"a",href:"completed"===e.status?"/api/v1/jobResult?id=".concat(e.id):null,disabled:"completed"!==e.status},r.a.createElement(T.a,null))}}],G=function(e){function t(){return Object(h.a)(this,t),Object(j.a)(this,Object(E.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(y.a)(t,[{key:"render",value:function(){return r.a.createElement(i.a,{align:"center",pad:"large"},r.a.createElement(W.a,{columns:this.props.columns,data:this.props.data}))}}]),t}(n.Component),Q=function(e){function t(e,a){var n;return Object(h.a)(this,t),(n=Object(j.a)(this,Object(E.a)(t).call(this,e,a))).state={jobs:null},J({truncateBuffers:!0}).then(function(e){return n.setState(H({},n.state,{jobs:e.jobs}))}),n}return Object(v.a)(t,e),Object(y.a)(t,[{key:"render",value:function(){return console.log(this.state.jobs),r.a.createElement(i.a,{pad:"large",align:"center"},r.a.createElement(i.a,{margin:{vertical:"large"}},r.a.createElement(m.a,{margin:"none",color:"dark-1",level:"1",size:"small"},"What's cooking, b0ss?"),r.a.createElement(m.a,{color:"dark-2",margin:"none",level:"2",size:"xsmall"},"View all the jobs below. Cooked, pending, or spoilt.")),this.state.jobs?r.a.createElement(S.Fade,null,r.a.createElement(G,{data:this.state.jobs.map(function(e,t){return Object(H({},e,{},e.details,{key:t}))}),columns:V})):r.a.createElement(P.a,null,"Loading..."))}}]),t}(n.Component),U=a(175),$=function(e){function t(){return Object(h.a)(this,t),Object(j.a)(this,Object(E.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(y.a)(t,[{key:"render",value:function(){return r.a.createElement(i.a,{style:{padding:"25px",marginTop:"auto"},margin:{top:"auto"},color:"dark-1",background:"dark-1",fill:"horizontal",align:"center",as:"footer"},r.a.createElement(m.a,{center:!0,level:"3",size:"xsmall"},"Video rendering automation made with \u2615\ufe0f & \u2764\ufe0f by ",r.a.createElement(U.a,{href:"http://aaronbaw.com/",label:"Aaron"})))}}]),t}(n.Component),K=a(176);function X(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}var Y=function(e){var t=e.logs;return r.a.createElement("div",{className:"log-container"},t.map(function(e){return r.a.createElement(K.a,{style:{maxWidth:"unset"},color:"dark-2",size:"small"},e)}))},Z=function(e){function t(e,a){var n;return Object(h.a)(this,t),(n=Object(j.a)(this,Object(E.a)(t).call(this,e,a))).state={logs:"Loading..."},n.fetchAndDisplayLogs=n.fetchAndDisplayLogs.bind(Object(O.a)(n)),n.fetchAndDisplayLogs(),setInterval(n.fetchAndDisplayLogs,2e3),n}return Object(v.a)(t,e),Object(y.a)(t,[{key:"fetchAndDisplayLogs",value:function(){var e=this;R().then(function(t){e.setState(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?X(a,!0).forEach(function(t){Object(s.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):X(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}({},e.state,{logs:t.replace(/info: /g,"")}))})}},{key:"render",value:function(){return r.a.createElement("div",{className:"log-and-text-container"},r.a.createElement(m.a,{color:"dark-3"},"Logs"),r.a.createElement(Y,{logs:this.state.logs.split("\n").reverse()}))}}]),t}(n.Component),_=a(28),ee=a(95);var te=function(){return r.a.createElement(c.a,{theme:ee.grommet,plain:!0,full:!0},r.a.createElement(i.a,{className:"app-container",style:{minHeight:"100%"}},r.a.createElement(b.a,null,r.a.createElement(_.a,{exact:!0,path:"/",component:function(){return r.a.createElement(g,null)}}),r.a.createElement(_.a,{exact:!0,path:"/newRenderJob",component:function(){return r.a.createElement(q,null)}}),r.a.createElement(_.a,{exact:!0,path:"/manageJobs",component:function(){return r.a.createElement(Q,null)}})),r.a.createElement(Z,null),r.a.createElement($,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(te,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},80:function(e,t,a){}},[[100,1,2]]]);
//# sourceMappingURL=main.3d9dad5e.chunk.js.map