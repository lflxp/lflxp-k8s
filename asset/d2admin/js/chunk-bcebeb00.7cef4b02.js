(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bcebeb00"],{"4ec9":function(e,t,a){"use strict";var n=a("6d61"),s=a("6566");e.exports=n("Map",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),s)},"4fad":function(e,t,a){var n=a("23e7"),s=a("6f53").entries;n({target:"Object",stat:!0},{entries:function(e){return s(e)}})},6566:function(e,t,a){"use strict";var n=a("9bf2").f,s=a("7c73"),l=a("e2cc"),o=a("0366"),i=a("19aa"),r=a("2266"),c=a("7dd0"),u=a("2626"),d=a("83ab"),f=a("f183").fastKey,h=a("69f3"),b=h.set,m=h.getterFor;e.exports={getConstructor:function(e,t,a,c){var u=e((function(e,n){i(e,u,t),b(e,{type:t,index:s(null),first:void 0,last:void 0,size:0}),d||(e.size=0),void 0!=n&&r(n,e[c],{that:e,AS_ENTRIES:a})})),h=m(t),p=function(e,t,a){var n,s,l=h(e),o=v(e,t);return o?o.value=a:(l.last=o={index:s=f(t,!0),key:t,value:a,previous:n=l.last,next:void 0,removed:!1},l.first||(l.first=o),n&&(n.next=o),d?l.size++:e.size++,"F"!==s&&(l.index[s]=o)),e},v=function(e,t){var a,n=h(e),s=f(t);if("F"!==s)return n.index[s];for(a=n.first;a;a=a.next)if(a.key==t)return a};return l(u.prototype,{clear:function(){var e=this,t=h(e),a=t.index,n=t.first;while(n)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete a[n.index],n=n.next;t.first=t.last=void 0,d?t.size=0:e.size=0},delete:function(e){var t=this,a=h(t),n=v(t,e);if(n){var s=n.next,l=n.previous;delete a.index[n.index],n.removed=!0,l&&(l.next=s),s&&(s.previous=l),a.first==n&&(a.first=s),a.last==n&&(a.last=l),d?a.size--:t.size--}return!!n},forEach:function(e){var t,a=h(this),n=o(e,arguments.length>1?arguments[1]:void 0,3);while(t=t?t.next:a.first){n(t.value,t.key,this);while(t&&t.removed)t=t.previous}},has:function(e){return!!v(this,e)}}),l(u.prototype,a?{get:function(e){var t=v(this,e);return t&&t.value},set:function(e,t){return p(this,0===e?0:e,t)}}:{add:function(e){return p(this,e=0===e?0:e,e)}}),d&&n(u.prototype,"size",{get:function(){return h(this).size}}),u},setStrong:function(e,t,a){var n=t+" Iterator",s=m(t),l=m(n);c(e,t,(function(e,t){b(this,{type:n,target:e,state:s(e),kind:t,last:void 0})}),(function(){var e=l(this),t=e.kind,a=e.last;while(a&&a.removed)a=a.previous;return e.target&&(e.last=a=a?a.next:e.state.first)?"keys"==t?{value:a.key,done:!1}:"values"==t?{value:a.value,done:!1}:{value:[a.key,a.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),a?"entries":"values",!a,!0),u(t)}}},"6d61":function(e,t,a){"use strict";var n=a("23e7"),s=a("da84"),l=a("94ca"),o=a("6eeb"),i=a("f183"),r=a("2266"),c=a("19aa"),u=a("861d"),d=a("d039"),f=a("1c7e"),h=a("d44e"),b=a("7156");e.exports=function(e,t,a){var m=-1!==e.indexOf("Map"),p=-1!==e.indexOf("Weak"),v=m?"set":"add",g=s[e],y=g&&g.prototype,_=g,w={},k=function(e){var t=y[e];o(y,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(p&&!u(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return p&&!u(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(p&&!u(e))&&t.call(this,0===e?0:e)}:function(e,a){return t.call(this,0===e?0:e,a),this})},S=l(e,"function"!=typeof g||!(p||y.forEach&&!d((function(){(new g).entries().next()}))));if(S)_=a.getConstructor(t,e,m,v),i.REQUIRED=!0;else if(l(e,!0)){var j=new _,L=j[v](p?{}:-0,1)!=j,x=d((function(){j.has(1)})),O=f((function(e){new g(e)})),V=!p&&d((function(){var e=new g,t=5;while(t--)e[v](t,t);return!e.has(-0)}));O||(_=t((function(t,a){c(t,_,e);var n=b(new g,t,_);return void 0!=a&&r(a,n[v],{that:n,AS_ENTRIES:m}),n})),_.prototype=y,y.constructor=_),(x||V)&&(k("delete"),k("has"),m&&k("get")),(V||L)&&k(v),p&&y.clear&&delete y.clear}return w[e]=_,n({global:!0,forced:_!=g},w),h(_,e),p||a.setStrong(_,e,m),_}},"6f53":function(e,t,a){var n=a("83ab"),s=a("df75"),l=a("fc6a"),o=a("d1e7").f,i=function(e){return function(t){var a,i=l(t),r=s(i),c=r.length,u=0,d=[];while(c>u)a=r[u++],n&&!o.call(i,a)||d.push(e?[a,i[a]]:i[a]);return d}};e.exports={entries:i(!0),values:i(!1)}},"9bee":function(e,t,a){"use strict";a.r(t);var n,s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("d2-container",[a("el-dialog",{attrs:{title:"添加/修改Labels",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",[a("el-form-item",{attrs:{label:"Key","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.currentLabelKey,callback:function(t){e.currentLabelKey=t},expression:"currentLabelKey"}})],1),a("el-form-item",{attrs:{label:"Value","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.currentLabelValue,callback:function(t){e.currentLabelValue=t},expression:"currentLabelValue"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.patchLabels(e.currentLabelName)}}},[e._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:"添加/修改Annotations",visible:e.dialogFormVisibleAnnotations},on:{"update:visible":function(t){e.dialogFormVisibleAnnotations=t}}},[a("el-form",[a("el-form-item",{attrs:{label:"Key","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.currentATKey,callback:function(t){e.currentATKey=t},expression:"currentATKey"}})],1),a("el-form-item",{attrs:{label:"Value","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.currentATValue,callback:function(t){e.currentATValue=t},expression:"currentATValue"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisibleAnnotations=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.patchAnnotations(e.currentLabelName)}}},[e._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:e.kinds,center:"true",visible:e.dialogVisible,width:"90%"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("d2-highlight",{staticStyle:{"margin-bottom":"10px"},attrs:{code:e.jsonDataStr}}),a("el-tabs",{attrs:{type:"card"},on:{"tab-click":e.handleClick},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:e.containertitle,name:"first"}},[a("el-table",{attrs:{data:e.containers,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{align:"center",sortable:"",label:"Status"},scopedSlots:e._u([{key:"default",fn:function(t){return[void 0!==t.row.state.running?a("el-tag",{attrs:{size:"mini",type:"success"}},[e._v("Running")]):void 0!==t.row.state.terminated?a("el-tag",{attrs:{size:"mini",type:"warning"}},[e._v("Terminated")]):a("el-tag",{attrs:{size:"mini",type:"danger"}},[e._v(e._s(t.row.state))])]}}])}),a("el-table-column",{attrs:{label:"Ready",align:"center"},scopedSlots:e._u([{key:"default",fn:function(e){return[e.row.ready?a("div",[a("i",{staticClass:"el-icon-check"})]):a("div",[a("i",{staticClass:"el-icon-close"})])]}}])}),a("el-table-column",{attrs:{label:"Name"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.name)+" ")]}}])}),a("el-table-column",{attrs:{label:"Image",width:"400"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.image))])]}}])}),a("el-table-column",{attrs:{label:"InitContainer",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.init?a("div",[a("i",{staticClass:"el-icon-check",attrs:{type:"success"}})]):a("div",[e._v(" - ")])]}}])}),a("el-table-column",{attrs:{label:"Restart",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.restartCount)+" ")]}}])}),a("el-table-column",{attrs:{label:"Started",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.started?a("div",[a("i",{staticClass:"el-icon-check"})]):a("div",[e._v(" - ")])]}}])}),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(a){return e.showLogsstatus(t.row.name)}}},[e._v("日志")]),a("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(a){return e.showsshstatus(t.row.name)}}},[e._v("SSH")])]}}])})],1)],1),a("el-tab-pane",{attrs:{label:e.labelTitle,name:"labels"}},[a("el-table",{attrs:{data:e.labels,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"Key",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.key)+" ")]}}])}),a("el-table-column",{attrs:{label:"Value",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.value)+" ")]}}])}),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return e.editlabels(t.row)}}},[e._v("修改")]),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return e.deletelabels(t.row)}}},[e._v("删除")])]}}])})],1),a("div",{staticStyle:{"margin-top":"20px"}},[a("el-button",{attrs:{type:"success"},on:{click:e.addlabel}},[e._v("添加")])],1)],1),a("el-tab-pane",{attrs:{label:e.annotationsTitle,name:"annotations"}},[a("el-table",{attrs:{data:e.annotations,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"Key",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.key)+" ")]}}])}),a("el-table-column",{attrs:{label:"Value",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.value)+" ")]}}])}),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return e.editAnnotations(t.row)}}},[e._v("修改")]),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return e.deleteAnnotations(t.row)}}},[e._v("删除")])]}}])})],1),a("div",{staticStyle:{"margin-top":"20px"}},[a("el-button",{attrs:{type:"success"},on:{click:e.addAnnotations}},[e._v("添加")])],1)],1),a("el-tab-pane",{attrs:{label:"状态",name:"状态"}},[a("el-table",{attrs:{data:void 0===e.jsonData.status?[]:e.jsonData.status.conditions,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"Condition",width:"200",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.type)+" ")]}}])}),a("el-table-column",{attrs:{label:"Status",width:"200",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.status)+" ")]}}])}),a("el-table-column",{attrs:{label:"Updated",width:"200",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.lastTransitionTime)+" ")]}}])}),a("el-table-column",{attrs:{label:"Message",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.message)+" ")]}}])})],1)],1),0!==e.selectEvents.length?a("el-tab-pane",{attrs:{label:e.eventtitle,name:"事件"}},[a("el-table",{attrs:{data:e.selectEvents,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"Reason",width:"200",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.reason)+" ")]}}],null,!1,2694853209)}),a("el-table-column",{attrs:{label:"Updated",width:"200",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.metadata.creationTimestamp)+" ")]}}],null,!1,2030677305)}),a("el-table-column",{attrs:{label:"Message",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.message)+" ")]}}],null,!1,3002100278)})],1)],1):e._e(),a("el-tab-pane",{attrs:{label:"相关资源 "+(e.ownerresources.length+e.resources.length),name:"相关资源"}},[a("el-card",{staticClass:"box-card",staticStyle:{"margin-bottom":"10px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[e._v("关联References "+e._s(e.ownerresources.length))])]),a("el-table",{attrs:{data:e.ownerresources,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"Name",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.name)+" ")]}}])}),a("el-table-column",{attrs:{label:"Kind",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.kind)+" ")]}}])}),a("el-table-column",{attrs:{label:"Controller",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.controller)+" ")]}}])}),a("el-table-column",{attrs:{label:"是否集联删除",align:"center"},scopedSlots:e._u([{key:"default",fn:function(e){return[e.row.blockOwnerDeletion?a("div",[a("i",{staticClass:"el-icon-check"})]):a("div",[a("i",{staticClass:"el-icon-close"})])]}}])}),a("el-table-column",{attrs:{label:"Namespace",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(e.namespace)+" ")]}}])})],1)],1),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[e._v("引用资源 "+e._s(e.resources.length))])]),a("el-table",{attrs:{data:e.resources,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"Name",align:"left"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.name)+" ")]}}])}),a("el-table-column",{attrs:{label:"Kind",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.kind)+" ")]}}])}),a("el-table-column",{attrs:{label:"Type",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.type)+" ")]}}])}),a("el-table-column",{attrs:{label:"Namespace",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.namespace)+" ")]}}])})],1)],1)],1),a("el-tab-pane",{attrs:{label:"YAML",name:"second"}},[a("vue-json-editor",{attrs:{showBtns:!0,mode:"tree",lang:"zh",expandedOnStart:!0},on:{"json-change":e.onJsonChange,"json-save":e.onJsonSave},model:{value:e.jsonData,callback:function(t){e.jsonData=t},expression:"jsonData"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogVisible=!1}}},[e._v("确 定")])],1)],1),a("el-select",{attrs:{filterable:"",clearable:"",placeholder:"请选择Pods进行精确查询"},on:{change:e.changepods,clear:e.clears},model:{value:e.podValue,callback:function(t){e.podValue=t},expression:"podValue"}},e._l(e.list,(function(e){return a("el-option",{key:e.metadata.name,attrs:{label:e.metadata.name,value:e.metadata.name}})})),1),a("el-button",{on:{click:e.fetchData}},[e._v("刷新")]),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],attrs:{data:e.list.slice((e.currentPage-1)*e.pageSize,e.currentPage*e.pageSize),"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{align:"center",sortable:"",label:"Status",prop:"status.phase",width:"95"},scopedSlots:e._u([{key:"default",fn:function(t){return["Running"===t.row.status.phase?a("el-tag",{attrs:{size:"mini",type:"success"}},[e._v(e._s(t.row.status.phase))]):"Succeeded"===t.row.status.phase?a("el-tag",{attrs:{size:"mini",type:"warning"}},[e._v(e._s(t.row.status.phase))]):a("el-tag",{attrs:{size:"mini",type:"danger"}},[e._v(e._s(t.row.status.phase))])]}}])}),a("el-table-column",{attrs:{label:"Name"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.openit(t.row)}}},[e._v(e._s(t.row.metadata.name))])]}}])}),a("el-table-column",{attrs:{label:"Image",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.spec.containers[0].image)+" "),t.row.spec.containers.length>1?a("div",[a("br"),a("el-button",{attrs:{type:"text"}},[e._v("+"+e._s(t.row.spec.containers.length)+" more")])],1):e._e()]}}])}),a("el-table-column",{attrs:{label:"Namespace",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.metadata.namespace))])]}}])}),a("el-table-column",{attrs:{label:"Ready",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(void 0===t.row.status.containerStatuses?"-":t.row.status.containerStatuses.map((function(e){return!0===e.ready?1:0})).reduce((function(e,t,a,n){return e+t})))+"/"+e._s(t.row.spec.containers.length))])]}}])}),a("el-table-column",{attrs:{label:"Restart",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(void 0===t.row.status.containerStatuses?"-":t.row.status.containerStatuses[0].restartCount)+" ")]}}])}),a("el-table-column",{attrs:{"class-name":"status-col",label:"IP",width:"110",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tag",{attrs:{type:"primary",size:"mini"}},[e._v(e._s(t.row.status.podIP))])]}}])}),a("el-table-column",{attrs:{label:"Node",width:"110",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.status.hostIP)+" ")]}}])}),a("el-table-column",{attrs:{align:"center",prop:"metadata.creationTimestamp",sortable:"",label:"Age",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.timeFn(t.row.metadata.creationTimestamp)))])]}}])}),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-select",{attrs:{clearable:"",placeholder:"容器日志"},on:{focus:function(a){return e.getC(t.row)},change:function(a){return e.showLogs2(t.row,e.podValue)}},model:{value:e.podValue,callback:function(t){e.podValue=t},expression:"podValue"}},e._l(e.currentNameList,(function(e){return a("el-option",{key:e.name,attrs:{label:e.name,value:e.name}})})),1),a("el-select",{attrs:{clearable:"",placeholder:"SSH容器"},on:{change:function(a){return e.showssh(t.row,e.sshValue)}},model:{value:e.sshValue,callback:function(t){e.sshValue=t},expression:"sshValue"}},e._l(t.row.spec.containers,(function(e){return a("el-option",{key:e.name,attrs:{label:e.name,value:e.name}})})),1),a("el-button",{attrs:{size:"mini"},on:{click:function(a){return e.deletepod(t.row)}}},[e._v("删除")])]}}])})],1),a("div",{staticClass:"block",staticStyle:{"margin-top":"15px"}},[a("el-pagination",{attrs:{align:"center","current-page":e.currentPage,"page-sizes":[1,5,10,20],"page-size":e.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.list.length},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)},l=[],o=a("b85c"),i=a("ade3"),r=(a("4ec9"),a("d3b7"),a("3ca3"),a("ddb0"),a("4fad"),a("159b"),a("a434"),a("b0c0"),a("b64b"),a("ad8f")),c=a("45a3"),u=a("c276"),d={components:{vueJsonEditor:c["a"]},filters:{statusFilter:function(e){var t={published:"success",draft:"gray",deleted:"danger"};return t[e]}},data:function(){var e;return e={activeName:"first",list:null,listLoading:!0,kinds:"",dialogVisible:!1,jsonData:"",jsonDataStr:"",value:"",namespaces:"",podValue:"",currentList:"",currentPage:1,total:20,pageSize:10,namespace:""},Object(i["a"])(e,"podValue",""),Object(i["a"])(e,"sshValue",""),Object(i["a"])(e,"currentNameList",[]),Object(i["a"])(e,"containers",[]),Object(i["a"])(e,"selecetNs",""),Object(i["a"])(e,"selectName",""),Object(i["a"])(e,"selectCon",[]),Object(i["a"])(e,"events",[]),Object(i["a"])(e,"selectEvents",[]),Object(i["a"])(e,"eventtitle",""),Object(i["a"])(e,"containertitle",""),Object(i["a"])(e,"resources",[]),Object(i["a"])(e,"ownerresources",[]),Object(i["a"])(e,"timer",null),Object(i["a"])(e,"labelTitle",""),Object(i["a"])(e,"dialogFormVisible",!1),Object(i["a"])(e,"dialogFormVisibleAnnotations",!1),Object(i["a"])(e,"formLabelWidth","120px"),Object(i["a"])(e,"currentLabelKey",""),Object(i["a"])(e,"currentLabelValue",""),Object(i["a"])(e,"currentLabelName",""),Object(i["a"])(e,"currentATKey",""),Object(i["a"])(e,"currentATValue",""),Object(i["a"])(e,"labels",[]),Object(i["a"])(e,"annotations",[]),Object(i["a"])(e,"annotationsTitle",""),e},created:function(){this.fetchData(),this.timer?clearInterval(this.timer):this.timer=setInterval(this.fetchData,3e3)},methods:(n={editlabels:function(e){this.dialogFormVisible=!0,console.log("editlabels",e),this.currentLabelKey=e["key"],this.currentLabelValue=e["value"]},editAnnotations:function(e){this.dialogFormVisibleAnnotations=!0,console.log("editlabels",e),this.currentATKey=e["key"],this.currentATValue=e["value"]},addlabel:function(){this.currentLabelKey="",this.currentLabelValue="",this.dialogFormVisible=!0},addAnnotations:function(){this.currentATKey="",this.currentATValue="",this.dialogFormVisibleAnnotations=!0},parseLabels:function(e){if(console.log("parseLabels",e),void 0!==e.labels){var t=new Map(Object.entries(e.labels));this.labels=[];var a,n=Object(o["a"])(t.keys());try{for(n.s();!(a=n.n()).done;){var s=a.value,l={key:s,value:t.get(s)};this.labels.push(l)}}catch(d){n.e(d)}finally{n.f()}}if(void 0!==e.annotations){var i=new Map(Object.entries(e.annotations));this.annotations=[];var r,c=Object(o["a"])(i.keys());try{for(c.s();!(r=c.n()).done;){var u=r.value;l={key:u,value:i.get(u)};this.annotations.push(l)}}catch(d){c.e(d)}finally{c.f()}}console.log("labels",this.labels,this.annotations)},deletelabels:function(e){var t=this;console.log(this.currentLabelName,e),this.listLoading=!0;var a=this.jsonData;delete a["metadata"]["labels"][e["key"]];var n={group:"",version:"v1",resource:"pods",namespace:this.selecetNs,name:this.currentLabelName,data:a};Object(r["d"])(n).then((function(a){console.log("delete labels",a),t.listLoading=!1,t.dialogFormVisible=!1,t.labels.forEach((function(a,n){a["key"]==e["key"]&&t.labels.splice(n,1)})),t.fetchData()}))},deleteAnnotations:function(e){var t=this;console.log(this.currentLabelName,e),this.listLoading=!0;var a=this.jsonData;delete a["metadata"]["annotations"][e["key"]];var n={group:"",version:"v1",resource:"pods",namespace:this.selecetNs,name:this.currentLabelName,data:a};Object(r["d"])(n).then((function(a){console.log("delete labels",a),t.listLoading=!1,t.dialogFormVisibleAnnotations=!1,t.labels.forEach((function(a,n){a["key"]==e["key"]&&t.labels.splice(n,1)})),t.fetchData()}))},patchLabels:function(e){var t=this;console.log(e),this.listLoading=!0;var a={};a[this.currentLabelKey]=this.currentLabelValue;var n={group:"",version:"v1",resource:"pods",namespace:this.selecetNs,name:e,patchdatastrate:{metadata:{labels:a}}};Object(r["c"])(n).then((function(e){console.log("patch resp",e),t.listLoading=!1,t.dialogFormVisible=!1,t.labels.forEach((function(e,a){e["key"]==t.currentLabelKey&&t.labels.splice(a,1)})),t.fetchData()}))},patchAnnotations:function(e){var t=this;console.log(e),this.listLoading=!0;var a={};a[this.currentATKey]=this.currentATValue;var n={group:"",version:"v1",resource:"pods",namespace:this.selecetNs,name:e,patchdatastrate:{metadata:{annotations:a}}};Object(r["c"])(n).then((function(e){console.log("patch resp",e),t.listLoading=!1,t.dialogFormVisibleAnnotations=!1,t.labels.forEach((function(e,a){e["key"]==t.currentATKey&&t.labels.splice(a,1)})),t.fetchData()}))},handleClick:function(e,t){console.log(e,t)},showLogs2:function(e,t){var a="/ws/logs/html/"+e.metadata.namespace+"/"+e.metadata.name+"/"+t;window.open(a,e.metadata.namespace+"-"+e.metadata.name,"height=600,width=1200,top=0,left=200,fullscreen=yes,scrollbars=0,location=no"),this.podValue=""},showLogsstatus:function(e){var t="/ws/logs/html/"+this.selecetNs+"/"+this.selectName+"/"+e;window.open(t,this.selecetNs+"-"+this.selectName,"height=600,width=1200,top=0,left=200,fullscreen=no,scrollbars=0,location=no")},showssh:function(e,t){var a="/ws/ssh/html/"+e.metadata.namespace+"/"+e.metadata.name+"/"+t;window.open(a,e.metadata.namespace+"-"+e.metadata.name,"height=600,width=1000,top=0,left=200,fullscreen=no,scrollbars=0,location=no"),this.sshValue=""},showsshstatus:function(e){var t="/ws/ssh/html/"+this.selecetNs+"/"+this.selectName+"/"+e;window.open(t,this.selecetNs+"-"+this.selectName,"height=600,width=1000,top=0,left=200,fullscreen=no,scrollbars=0,location=no"),this.sshValue=""},getC:function(e){var t=this;this.currentNameList=[],e.spec.containers.length>0&&e.spec.containers.forEach((function(e){t.currentNameList.push(e)})),e.spec.initContainers.length>0&&e.spec.initContainers.forEach((function(e){t.currentNameList.push(e)})),console.log(this.currentNameList)},handleSizeChange:function(e){console.log("每页 ".concat(e," 条")),this.currentPage=1,this.pageSize=e},handleCurrentChange:function(e){console.log("当前页: ".concat(e)),this.currentPage=e},getNs:function(){this.namespace=u["a"].cookies.get("namespace")},clears:function(){this.dialogVisible=!1,this.jsonData=""},fetchData:function(){var e=this;this.listLoading=!0,this.getNs();var t={group:"",version:"v1",resource:"pods",namespace:this.namespace};Object(r["f"])(t).then((function(t){console.log("apiserver",t),e.list=t.data.items,e.total=e.list.length,e.listLoading=!1,e.list.forEach((function(t,a){""!==e.jsonData&&t.metadata.name===e.jsonData.metadata.name&&(e.jsonData=t,e.parseLabels(t.metadata))}))}));var a={group:"",version:"v1",resource:"events",namespace:this.namespace};Object(r["f"])(a).then((function(t){console.log("events",t),e.events=t.data.items}))},changens:function(e){var t=this;this.listLoading=!0;var a={group:"",version:"v1",resource:"pods",namespace:e};Object(r["f"])(a).then((function(e){console.log("apiserver",e),t.list=e.data.items,t.total=t.list.length,t.listLoading=!1,t.list.forEach((function(e,a){""!==t.jsonData&&e.metadata.name===t.jsonData.metadata.name&&(t.jsonData=e,t.parseLabels(e.metadata))}))}))},deletepod:function(e){var t=this;this.listLoading=!0;var a={group:"",version:"v1",resource:"pods",namespace:e.metadata.namespace,name:e.metadata.name};Object(r["a"])(a).then((function(e){console.log("apidelete",e),t.listLoading=!1})),this.fetchData()},changepods:function(e){var t=this;this.podValue=e;var a=JSON.parse(JSON.stringify(this.list));this.currentList=a,this.list=[],this.currentList.forEach((function(a){a.metadata.name===e&&t.list.push(a)})),this.total=this.list.length}},Object(i["a"])(n,"clears",(function(){this.changens(this.value)})),Object(i["a"])(n,"openit",(function(e){var t=this;console.log(e),this.selecetNs=e.metadata.namespace,this.selectName=e.metadata.name,this.jsonData=e,this.currentLabelName=e.metadata.name,this.parseLabels(e.metadata),this.jsonDataStr={"命名空间":e.metadata.namespace,"开始时间":e.metadata.creationTimestamp,"容器IP":e.status.podIP,"节点IP":e.status.hostIP,"标签":e.metadata.labels,"注释":e.metadata.annotations},this.jsonDataStr=JSON.stringify(this.jsonDataStr,null,2),this.containers=[],void 0!==e.status.containerStatuses&&e.status.containerStatuses.length>0&&e.status.containerStatuses.forEach((function(e){t.containers.push(e)})),void 0!==e.status.initContainerStatuses&&e.status.initContainerStatuses.length>0&&e.status.initContainerStatuses.forEach((function(e){e["init"]=!0,t.containers.push(e)})),this.containertitle="容器 "+this.containers.length,this.selectEvents=[],this.events.forEach((function(a){a.involvedObject.name===e.metadata.name&&t.selectEvents.push(a)})),this.eventtitle="事件 "+this.selectEvents.length,this.kinds="["+e.kind+"] "+e.metadata.name,this.resources=[{type:"spec",kind:"ServiceAccount",name:e.spec.serviceAccount,namespace:e.metadata.namespace}],this.ownerresources=[],void 0!=e.metadata.ownerReferences&&e.metadata.ownerReferences.forEach((function(e){t.ownerresources.push(e)})),void 0!=e.spec.containers&&e.spec.containers.forEach((function(a){void 0!=a.env&&a.env.forEach((function(a){if(void 0!=a.valueFrom)if(void 0!=a.valueFrom.secretKeyRef){var n={type:"env",kind:"secret",name:a.valueFrom.secretKeyRef.name,namespace:e.metadata.namespace};t.resources.push(n)}else if(void 0!=a.valueFrom.configMapKeyRef){n={type:"env",kind:"secret",name:a.valueFrom.configMapKeyRef.name,namespace:e.metadata.namespace};t.resources.push(n)}}))})),void 0!=e.spec.volumes&&e.spec.volumes.forEach((function(a){if(void 0!=a.secret){var n={type:"volume",kind:"secret",name:a.secret.secretName,namespace:e.metadata.namespace};t.resources.push(n)}else if(void 0!=a.configMap){n={type:"volume",kind:"configMap",name:a.configMap.name,namespace:e.metadata.namespace};t.resources.push(n)}})),this.dialogVisible=!0,void 0!==e.metadata.labels?this.labelTitle="标签 "+Object.keys(e.metadata.labels).length:this.labelTitle="标签 0",void 0!==e.metadata.annotations?this.annotationsTitle="注释 "+Object.keys(e.metadata.annotations).length:this.annotationsTitle="注释 0"})),Object(i["a"])(n,"timeFn",(function(e){var t=new Date,a=(e=new Date(e),t.getTime()-e),n=Math.floor(a/864e5),s=a%864e5,l=Math.floor(s/36e5),o=s%36e5,i=Math.floor(o/6e4),r=o%6e4,c=Math.round(r/1e3),u="";return 0!==n&&(u+=n+" 天 "),0!==l&&(u+=l+" 小时 "),0!==i&&(u+=i+" 分钟 "),0!==c&&(u+=c+" 秒"),u})),Object(i["a"])(n,"onJsonChange",(function(e){console.log("value: change",e)})),Object(i["a"])(n,"onJsonSave",(function(e){var t=this;console.log("value save:",e);var a={group:"",version:"v1",resource:"pods",namespace:e.metadata.namespace,name:e.metadata.name,data:e};Object(r["d"])(a).then((function(e){console.log("resp",e),t.fetchData(),t.dialogVisible=!1}))})),n)},f=d,h=a("2877"),b=Object(h["a"])(f,s,l,!1,null,null,null);t["default"]=b.exports},bb2f:function(e,t,a){var n=a("d039");e.exports=!n((function(){return Object.isExtensible(Object.preventExtensions({}))}))},f183:function(e,t,a){var n=a("d012"),s=a("861d"),l=a("5135"),o=a("9bf2").f,i=a("90e3"),r=a("bb2f"),c=i("meta"),u=0,d=Object.isExtensible||function(){return!0},f=function(e){o(e,c,{value:{objectID:"O"+u++,weakData:{}}})},h=function(e,t){if(!s(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!l(e,c)){if(!d(e))return"F";if(!t)return"E";f(e)}return e[c].objectID},b=function(e,t){if(!l(e,c)){if(!d(e))return!0;if(!t)return!1;f(e)}return e[c].weakData},m=function(e){return r&&p.REQUIRED&&d(e)&&!l(e,c)&&f(e),e},p=e.exports={REQUIRED:!1,fastKey:h,getWeakData:b,onFreeze:m};n[c]=!0}}]);