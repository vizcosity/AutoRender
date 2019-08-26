(window.webpackJsonpfrontend=window.webpackJsonpfrontend||[]).push([[0],{101:function(e,t,a){e.exports=a(153)},106:function(e,t,a){},153:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(21),l=a.n(o),c=(a(106),a(173)),i=a(98),s=a(24),u=a(175),m=a(176),d=a(164),p=a(165),b=a(36),f=(a(79),function(){var e;return r.a.createElement(i.a,(e={margin:{vertical:"small"},direction:"row",justify:"center"},Object(s.a)(e,"margin",{left:"auto",right:"auto",vertical:"medium"}),Object(s.a)(e,"style",{padding:"50px",borderRadius:"20px"}),e),r.a.createElement(u.a,{to:"/newRenderJob",margin:"10px",color:"dark-1",primary:!0,hoverIndicator:!0,icon:r.a.createElement(d.a,null),label:"New Render Job",as:b.b}),r.a.createElement(u.a,{to:"/manageJobs",margin:"10px",color:"dark-2",hoverIndicator:!0,icon:r.a.createElement(p.a,null),label:"Manage Jobs",as:b.b}))}),g=function(){return r.a.createElement(i.a,{flex:!0,justify:"center",align:"center",fill:"vertical"},r.a.createElement(m.a,{level:"1",margin:"0",color:"gray"},"AutoRender"),r.a.createElement(f,null))},h=a(26),E=a(27),y=a(29),j=a(28),O=a(45),v=a(30),w=a(166),k=a(174),S=a(177),x=a(46),P=a(70),F=function(e){return e?"?"+Object.entries(e).map(function(e){return e.map(encodeURIComponent).join("=")}).join("&"):""},J=function(e){return new Promise(function(t,a){fetch("/api/v1/jobs"+F(e),{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(e){try{return e.json()}catch(t){a(t)}}).then(function(e){return t(e)})})},D=a(169);function R(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function z(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?R(a,!0).forEach(function(t){Object(s.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):R(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var C=function(){return r.a.createElement(i.a,{style:{maxWidth:"500px"},margin:{vertical:"medium"},fill:"horizontal",justify:"center"},r.a.createElement(m.a,{style:{display:"flex",alignItems:"center"},color:"dark-2",level:"3"},r.a.createElement(d.a,{style:{marginRight:"10px",opacity:"0.6"}}),"Add a new Render Job"),r.a.createElement(m.a,{color:"dark-3",margin:"none",level:"4"},"Make sure everything is correct or else you'll waste a few hours yo"))},N=function(e){function t(e,a){var n;return Object(h.a)(this,t),(n=Object(y.a)(this,Object(j.a)(t).call(this,e,a))).state={submitting:!1,postSubmission:null},n.onSubmitHandler=n.onSubmitHandler.bind(Object(O.a)(n)),n}return Object(v.a)(t,e),Object(E.a)(t,[{key:"onSubmitHandler",value:function(e){var t=this;this.setState(z({},this.state,{submitting:!0}),function(){var a,n=z({},e.value);console.log(e.target);for(var r=0;r<e.target.length;r++){var o=e.target[r];o.files&&(console.log(o,o.files),n[o.name]=o.files[0])}(a=z({},n,{truncateBuffers:!0}),new Promise(function(t,n){var r=new FormData;Object.keys(a).forEach(function(e){r.append(e,a[e])}),fetch("/api/v1/queueJob",{method:"POST",body:r}).then(function(t){try{return t.json()}catch(e){n(e)}}).then(function(e){return t(e)})})).then(function(e){e.success&&t.setState(z({},t.state,{postSubmission:e.job.id}))})})}},{key:"render",value:function(){return r.a.createElement(i.a,{flex:!0,margin:{vertical:"medium"},align:"center",justify:"center"},r.a.createElement(C,null),r.a.createElement(i.a,{fill:"horizontal",margin:{vertical:"large"},style:{maxWidth:"500px"}},this.state.submitting?r.a.createElement(x.Fade,null,r.a.createElement(i.a,{align:"center",direction:"column"},this.state.postSubmission?r.a.createElement(r.a.Fragment,null,r.a.createElement(D.a,{color:"status-ok"}),r.a.createElement(S.a,{margin:{vertical:"small"},color:"status-ok"},"Queued ",this.state.postSubmission),r.a.createElement(u.a,{margin:{vertical:"large"},label:"View Jobs",color:"dark-1",as:"a",href:"/manageJobs",primary:!0})):r.a.createElement(r.a.Fragment,null,r.a.createElement(P.ScaleLoader,{size:"large",color:"#555555"}),r.a.createElement(S.a,{color:"dark-2"},"Queuing up...")))):r.a.createElement(w.a,{onSubmit:this.onSubmitHandler},r.a.createElement(m.a,{level:"3"},"Song Details"),r.a.createElement(k.a,{required:!0,name:"artistName",label:"Artist Name",placeholder:"Porter Robinson"}),r.a.createElement(k.a,{required:!0,name:"songName",label:"Song Name",placeholder:"Sad Machine"}),r.a.createElement(k.a,{required:!0,name:"genre",label:"Genre",placeholder:"Electronic",value:"Electronic"}),r.a.createElement(k.a,{required:!0,name:"visualizerColour",label:"Visualizer Colour",help:"Must be a valid hex value e.g. #FFEA32",htmlFor:"test"}),r.a.createElement(m.a,{level:"3"},"Files"),r.a.createElement(k.a,{required:!0,name:"backgroundFile",label:"Background Image",type:"file"}),r.a.createElement(k.a,{name:"songFile",label:"Song File",type:"file"}),r.a.createElement(k.a,{name:"artworkFile",label:"Artwork Image",type:"file"}),r.a.createElement(u.a,{type:"submit",primary:!0,color:"dark-1",label:"Submit"}))))}}]),t}(n.Component),I=a(170),A=a(171);function q(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function B(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?q(a,!0).forEach(function(t){Object(s.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):q(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var H={completed:"status-ok",rendering:"status-warning",failed:"status-error",pending:"status-unknown"},W=[{property:"key",header:"#",render:function(e){return r.a.createElement(S.a,null,e.key)}},{property:"artistName",header:"Artist",render:function(e){return r.a.createElement(S.a,{weight:"bold"},e.artistName)}},{property:"songName",header:"Song"},{property:"status",header:"Status",render:function(e){return r.a.createElement(S.a,{color:H[e.status]},e.status)}},{property:"download",header:"Download",align:"center",render:function(e){return r.a.createElement(u.a,{style:{padding:"5px",borderRadius:"5px"},hoverIndicator:!0,as:"a",href:"completed"===e.status?"/api/v1/jobResult?id=".concat(e.id):null,disabled:"completed"!==e.status},r.a.createElement(I.a,null))}}],M=function(e){function t(){return Object(h.a)(this,t),Object(y.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(E.a)(t,[{key:"render",value:function(){return r.a.createElement(i.a,{align:"center",pad:"large"},r.a.createElement(A.a,{columns:this.props.columns,data:this.props.data}))}}]),t}(n.Component),T=function(e){function t(e,a){var n;return Object(h.a)(this,t),(n=Object(y.a)(this,Object(j.a)(t).call(this,e,a))).state={jobs:null},J({truncateBuffers:!0}).then(function(e){return n.setState(B({},n.state,{jobs:e.jobs}))}),n}return Object(v.a)(t,e),Object(E.a)(t,[{key:"render",value:function(){return console.log(this.state.jobs),r.a.createElement(i.a,{pad:"large",align:"center"},r.a.createElement(i.a,{margin:{vertical:"large"}},r.a.createElement(m.a,{margin:"none",color:"dark-1",level:"1",size:"small"},"What's cooking, b0ss?"),r.a.createElement(m.a,{color:"dark-2",margin:"none",level:"2",size:"xsmall"},"View all the jobs below. Cooked, pending, or spoilt.")),this.state.jobs?r.a.createElement(x.Fade,null,r.a.createElement(M,{data:this.state.jobs.map(function(e,t){return Object(B({},e,{},e.details,{key:t}))}),columns:W})):r.a.createElement(S.a,null,"Loading..."))}}]),t}(n.Component),V=a(178),G=function(e){function t(){return Object(h.a)(this,t),Object(y.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(E.a)(t,[{key:"render",value:function(){return r.a.createElement(i.a,{style:{padding:"25px",marginTop:"auto"},margin:{top:"auto"},color:"dark-1",background:"dark-1",fill:"horizontal",align:"center",as:"footer"},r.a.createElement(m.a,{center:!0,level:"3",size:"xsmall"},"Video rendering automation made with \u2615\ufe0f & \u2764\ufe0f by ",r.a.createElement(V.a,{href:"http://aaronbaw.com/",label:"Aaron"})))}}]),t}(n.Component),L=a(22),Q=a(95);var U=function(){return r.a.createElement(c.a,{theme:Q.grommet,plain:!0,full:!0},r.a.createElement(i.a,{className:"app-container",style:{minHeight:"100%"}},r.a.createElement(b.a,null,r.a.createElement(L.a,{exact:!0,path:"/",component:function(){return r.a.createElement(g,null)}}),r.a.createElement(L.a,{exact:!0,path:"/newRenderJob",component:function(){return r.a.createElement(N,null)}}),r.a.createElement(L.a,{exact:!0,path:"/manageJobs",component:function(){return r.a.createElement(T,null)}})),r.a.createElement(G,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(U,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},79:function(e,t,a){}},[[101,1,2]]]);
//# sourceMappingURL=main.6946294b.chunk.js.map