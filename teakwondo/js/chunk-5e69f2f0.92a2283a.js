(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5e69f2f0"],{"5c9c":function(e,s,n){"use strict";n.r(s);var t=function(){var e=this,s=e.$createElement,n=e._self._c||s;return n("div",{staticClass:"sign"},[n("div",{staticClass:"sign-container"},[n("div",{staticClass:"sign-up"},[n("el-card",{staticClass:"sign-card"},[n("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[n("span",[e._v("注册")]),n("router-link",{staticClass:"sign-card-header--button",attrs:{to:{name:"login"}}},[e._v(" 前往登录 ")])],1),n("el-form",{ref:"signupForm",attrs:{model:e.signup,rules:e.signupRules}},[n("el-form-item",{attrs:{label:"姓名",prop:"name"}},[n("el-input",{attrs:{placeholder:"请输入姓名"},model:{value:e.signup.name,callback:function(s){e.$set(e.signup,"name",s)},expression:"signup.name"}})],1),n("el-form-item",{attrs:{label:"联系方式",prop:"phone"}},[n("el-input",{attrs:{placeholder:"请输入手机号",maxlength:"11"},model:{value:e.signup.phone,callback:function(s){e.$set(e.signup,"phone",e._n(s))},expression:"signup.phone"}})],1),n("el-form-item",{attrs:{label:"登录密码",prop:"password"}},[n("el-input",{attrs:{placeholder:"请输入密码","show-password":""},model:{value:e.signup.password,callback:function(s){e.$set(e.signup,"password",s)},expression:"signup.password"}})],1),n("el-form-item",[n("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary"},on:{click:e.onsignupSubmit}},[e._v(" 注册 ")])],1)],1)],1)],1)])])},a=[],i=n("07a4"),r={name:"SignUp",components:{},data:function(){return{signup:{name:"",phone:"",password:""},signupRules:{name:[{required:!0,trigger:"blur",message:"用户名不能为空"}],phone:[{required:!0,trigger:"blur",message:"手机号不能为空"},{type:"number",message:"请输入合法的手机号（中国大陆）"}],password:[{required:!0,trigger:"blur",message:"密码不能为空"},{min:8,trigger:"blur",message:"密码长度至少为 8 位"}]}}},methods:{onsignupSubmit:function(){var e=this;this.$refs.signupForm.validate((function(s){s&&(e.loading=!0,i["a"].signup(e.signup).then((function(s){e.$message({message:"注册成功，请登录",type:"success"}),e.$router.push({name:"login",query:{phone:s.phone}}),e.loading=!1})).catch((function(){e.loading=!1})))}))}}},o=r,l=(n("e2cb"),n("2877")),u=Object(l["a"])(o,t,a,!1,null,"5bace0b9",null);s["default"]=u.exports},"9d00":function(e,s,n){},e2cb:function(e,s,n){"use strict";n("9d00")}}]);
//# sourceMappingURL=chunk-5e69f2f0.92a2283a.js.map