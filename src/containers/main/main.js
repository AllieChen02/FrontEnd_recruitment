/*
* 主界面路由组件
*  下面写的都是一级主页面下面的路由
* */
import React,{Component} from 'react'
import {Switch, Route,Redirect} from 'react-router-dom'
//引入状态
import {connect} from 'react-redux'
import Cookies from 'js-cookie' //可以操作前端cookie的对象
//引入路由组件
import StudentInfo from '../student-info/student-info'
import CompanyInfo from '../company-info/company-info'
import Student from '../student/student'
import Company from '../company/company'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
import NotFound from "../../components/not-found/notfound";
import NavFooter from "../../components/nav-footer/nav-footer";
import {getRedirectTo} from '../../utils/index'
import {getUser} from "../../redux/actions";
import {NavBar} from "antd-mobile";
import '../../assets/css/index.css'
class Main extends Component{
    //给组件对象添加数据，添加navList，数组形式，数组中存储的是对象
    navList = [ //包含所有导航组件的相关信息数据
        {
            path :'/company',           //路由路径
            component: 'Company',
            title : 'student list',     //对于公司来说，要显示的是学生的列表
            icon : 'student',
            text: 'student',
        },
        {
            path :'/student',
            component: 'Student',
            title : 'company list',
            icon : 'company',
            text: 'company'
        },
        {
            path :'/message',
            component: 'Message',
            title : 'message',
            icon : 'message',
            text: 'message'
        },
        {
            path :'/personal',
            component: 'Personal',
            title : 'personal',
            icon : 'personal',
            text: 'personal'
        },
    ]


    //在render之后执行。如果执行重新获取user以后，那么user状态更新，又会走一遍render
    componentDidMount () {
        //登陆过(cookie中有userid), 但没有有登陆(redux管理的user中没有_id) 发请求获取对应的user
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if(userid && !_id) {
            // 发送异步请求, 获取user
            //console.log('发送ajax请求获取user')
            this.props.getUser()
        }
    }

    render(){
        //读取cookie中的user_id
        const userid = Cookies.get('userid')
        if(!userid){
            //如果不存在，则自动重定向到登陆页面
            return <Redirect to = '/login'/>
        }else{
            //如果有，读取一下redux中user状态
            const {user} = this.props
            //如果user中的没有_id，那么不做任何显示
            if(!user._id){
                return null;
            }else{
                //如果有_id，则显示对应的路径
                //如果请求的是根路径，那么利用type和header来计算出一个重定向的路由路径，并自动重定向
                let path = this.props.location.pathname
                if(path === '/'){
                    //得到一个重定向
                    path = getRedirectTo(user.type, user.header)
                    return <Redirect to={path}/>
                }
            }
        }
        const {user} = this.props
        const {navList} = this
        const path = this.props.location.pathname //请求的路径
        //利用当前path在数组中找，看它匹配的是哪一项
        const currentNav = navList.find(nav => nav.path === path) //得到当前的path, 可能没有
        if(currentNav){
            //决定哪个路由需要隐藏
            if(user.type === 'company'){
                navList[1].hide = true
            }else{
                navList[0].hide = true
            }
        }

        return (
            <div>
                    {currentNav ? <NavBar>{currentNav.title}</NavBar>: null}
                <Switch>
                    <Route path = '/company' component = {Company}/>
                    <Route path = '/student' component = {Student}/>
                    <Route path = '/message' component = {Message}/>
                    <Route path = '/personal' component = {Personal}/>
                    <Route path='/chat/:userid' component = {Chat}/>

                    <Route path='/companyinfo' component = {CompanyInfo}></Route>
                    <Route path='/studentinfo' component = {StudentInfo}></Route>
                    <Route component={NotFound}/>
                </Switch>
                <div className='bottomBar'>
                    {currentNav ? <NavFooter  navList={navList} unReadCount={this.props.unReadCount}/> : null}
                </div>

            </div>
        )
    }
}
export default connect(
    state => ({user : state.user,unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main)
/*
1. 实现自动登陆:
  1. componentDidMount()
    登陆过(cookie中有userid), 但没有有登陆(redux管理的user中没有_id) 发请求获取对应的user:
  2. render()
    1). 如果cookie中没有userid, 直接重定向到login
    2). 判断redux管理的user中是否有_id, 如果没有, 暂时不做任何显示
    3). 如果有, 说明当前已经登陆, 显示对应的界面
    4). 如果请求根路径: 根据user的type和header来看其信息完善了没，相当于来计算出一个重定向的路由路径, 并自动重定向
 */