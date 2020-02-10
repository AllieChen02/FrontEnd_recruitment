/*
* 注册路由组件
* */
import React,{Component} from 'react'
import {NavBar,WingBlank,List,InputItem, WhiteSpace, Radio, Button} from 'antd-mobile'
import Logo from "../../components/logo/logo";
import {Item} from "antd-mobile/es/tab-bar";
import ListItem from "antd-mobile/es/list/ListItem";
import {connect} from 'react-redux'
import {register} from "../../redux/actions";
import {Redirect} from 'react-router-dom'

class Register extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : "",
            password : "",
            password2 : "",
            /*type: student or faculty*/
            type : "student",
        }
        /*绑定登陆查询函数*/
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this)
    }
    handleOnchange = (name,val)=>{
        this.setState({
            /*这里状态更新的是它的值，例如: username,password,password2,type，而不是本身这个name*/
            [name] : val
        })
        //console.log(this.state)
    }
    handleRegister = ()=>{
        //TODO
/*        //先打印所有状态，有了后端以后需要传给后端
        console.log(this.state)*/
        //想要注册，那么视图曾会发出一个action，store会自动调用reducer,接受一个action和state，作出反应
        // actions注册方法需要的传入一个user，其实就是this.state

        this.props.register(this.state)

    }

    //has account，直接跳转到登陆界面
    handleLogin = () => {
        //跳转到登陆界面
        this.props.history.replace('/login')
    }

    render(){
        //获取type值
        const {type} = this.state
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
                        {msg ? <div className="error_msg"> {msg} </div> : null}
                        <WhiteSpace/>
                        <InputItem name="username" placeholder='USERNAME' onChange={val => this.handleOnchange('username',val)}>Username: </InputItem>

                        <WhiteSpace/>
                        <InputItem type = "password" name="password" placeholder='PASSWORD' onChange = {val => this.handleOnchange('password',val)}>Password: </InputItem>
                        <WhiteSpace/>
                        <InputItem type = "password" name="password2"  onChange = {val => this.handleOnchange('password2',val)}>Confirm: </InputItem>

                        <WhiteSpace/>
                        <ListItem>
                            <span>Type</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked = {type === "student"}  onChange = {() => this.handleOnchange('type',"student")}>Student</Radio>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked = {type === "company"}  onChange = {() => this.handleOnchange('type',"company")}>Company</Radio>
                        </ListItem>
                        <WhiteSpace/>
                        <Button type = "primary" onClick={this.handleRegister}>Register</Button>
                        <Button onClick = {this.handleLogin}>Has Account?</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {register}
)(Register);