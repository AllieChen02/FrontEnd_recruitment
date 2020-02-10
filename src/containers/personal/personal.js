/*
* 个人中心界面路由容器组件
* */
import React,{Component} from 'react'
//引入antd-mobile中写好对component
import {Result, List, WhiteSpace,Button, Modal} from "antd-mobile";
//包装生成容器组件
import {connect} from 'react-redux'
import {resetUser} from '../../redux/actions'
import Cookies from 'js-cookie' //可以操作前端cookie的对象
const Item = List.Item
const Brief = Item.Brief

class Personal extends Component{
    constructor(props){
        super(props)

        //绑定退出登录的方法
        this.handleLogOut = this.handleLogOut.bind(this)
    }
    handleLogOut = ()=>{
        Modal.alert('Log Out','Are you sure? ',[
            {text: 'Cancel', onPress: () => console.log('cancel'), style:'default'},
            {text: 'OK', onPress: () => {
                    //清除cookie中的id
                    Cookies.remove('userid')
                    //重启redux中的user状态
                    this.props.resetUser()
                }}
        ])
    }


    render() {
        const {user} = this.props
        return (
            <div>
                <Result
                    img = {<img src = {require(`../../assets/images/${user.header}.png`)} style={{width: 50} } alt='header' />}
                    title = {user.username}
                    message = {user.company}
                />
                <List renderHeader = {() => 'Related Information'}>
                    <Item multipleLine>
                        <Brief>Position: {user.position}</Brief>
                        <Brief>Personal: {user.info}</Brief>
                        {user.salary ?  <Brief>Salary: {user.salary}</Brief> : null}

                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type = 'warning' onClick = {this.handleLogOut}>Log Out</Button>
                </List>
            </div>
        )
    }
}
export default connect (
    state => ({user : state.user}),
    {resetUser}
)(Personal)