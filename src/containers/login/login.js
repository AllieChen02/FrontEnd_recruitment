/*
* 登陆路由组件
* */
import React,{Component} from 'react'
import {Button, InputItem, List, NavBar, Radio, WhiteSpace, WingBlank} from "antd-mobile";
import Logo from "../../components/logo/logo";
import ListItem from "antd-mobile/es/list/ListItem";
//将ui组件包装成一个容器组件
import {connect} from 'react-redux'
import {login} from "../../redux/actions";
import {Redirect} from 'react-router-dom'
import '../../assets/css/index.css'
class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : "",
            password : "",
        }
        /*绑定登陆查询函数*/
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }
    handleOnchange = (name,val)=>{
        this.setState({
            /*这里状态更新的是它的值，例如: username,password,password2,type，而不是本身这个name*/
            [name] : val
        })
    }
    handleLogin = ()=>{
        //console.log(this.state)
        this.props.login(this.state)
    }

    handleRegister = ()=>{
        //跳转到注册界面
        this.props.history.replace('/register')
    }
    render(){
        const {msg, redirectTo} = this.props.user
        //如果redirectTo 有值，就需要重定向到指定的路由路径
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar> Rice University </NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {msg ? <div className='error_msg'>{msg}</div> : null}
                        <WhiteSpace/>
                        <InputItem name="username" placeholder='USERNAME' onChange={val => this.handleOnchange('username',val)}>Username: </InputItem>
                        <WhiteSpace/>
                        <InputItem type = "password" name="password" placeholder='PASSWORD' onChange = {val => this.handleOnchange('password',val)}>Password: </InputItem>
                        <WhiteSpace/>
                        <Button type = "primary" onClick={this.handleLogin}>Login</Button>
                        <Button onClick = {this.handleRegister}>Register</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user : state.user}),
    {login}
)(Login);