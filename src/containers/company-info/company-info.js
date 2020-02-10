/*
老板信息完善的路由 容器 组件
* */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem, Button} from "antd-mobile";
import HeaderSelector from "../../components/header-selector/header-selector";
//与后台进行交互，必然要引入一个异步action
import {updateUser} from '../../redux/actions'
import  {Redirect} from 'react-router-dom'
class CompanyInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            header : '',   //头像名称
            position: '', // 职位
            info: '', // 个人或职位简介
            company: '', // 公司名称
            salary:''
        }
        /*绑定函数*/
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.setHeader = this.setHeader.bind(this);
    }
    handleOnchange = (name,val)=>{
        this.setState({
            [name] : val
        })
    }
    handleSave = () => {
        //TODO 与后端进行交互
        // console.log(this.state)
        this.props.updateUser(this.state)
    }
    /*设置头像. 状态是在父组件，但是信息在子组件，所以要把传给子组件*/
    setHeader = (header) => {
        this.setState({
            header : header
        })
    }
    render() {
        const {header, type } = this.props.user
        if(header){ //如果header有值，说明信息完善完毕，那么就重定向到特定到路径
            const path = type==='student'? '/student' : '/company'
            return <Redirect to = {path}/>
        }
        return(
            <div>
                <NavBar>Faculty Information Update</NavBar>
                <HeaderSelector setHeader = {this.setHeader}></HeaderSelector>
                <InputItem name = 'position' placeholder = "Job Position" onChange = {val => this.handleOnchange('position',val)}>Position:</InputItem>
                <InputItem name = 'company' placeholder = "Company" onChange = {val => this.handleOnchange('company',val)}>Company:</InputItem>
                <InputItem name = 'salary' placeholder = "Job Salary" onChange = {val => this.handleOnchange('salary',val)}>Salary:</InputItem>
                <TextareaItem name = 'info' title='Info:' row ={3} onChange = {val => this.handleOnchange('info',val)}/>
                <Button type = 'primary' onClick = {this.handleSave}>Save</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user : state.user}),
    {updateUser}
)(CompanyInfo)