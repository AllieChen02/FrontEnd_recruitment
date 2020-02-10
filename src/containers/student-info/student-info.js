/*
学生信息完善的路由 容器 组件
* */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem, Button} from "antd-mobile";
import HeaderSelector from "../../components/header-selector/header-selector";
import {updateUser} from '../../redux/actions'
import  {Redirect} from 'react-router-dom'
class StudentInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            'position' : '',
            'info' :'',
            'header' :'' //头像
        }
        this.handleOnchange = this.handleOnchange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.setHeader = this.setHeader.bind(this)
    }
    handleOnchange = (name,val)=>{
        this.setState({
            [name] : val
        })
    }
    handleSave = () => {
        //TODO 与后端进行交互
        //console.log(this.state)
        this.props.updateUser(this.state)
    }
    //设置头像状态，由于是在子组件中进行更改，那么把参数传到子组件去
    setHeader = (header) => {
        this.setState({
            header : header
        })
    }
    render() {
        //如果信息已经完善，自动跳转到主界面
        const {header, type } = this.props.user
        if(header){ //如果header有值，说明信息完善完毕，那么就重定向到特定到路径
            const path = type==='student'? '/student' : '/company'
            return <Redirect to = {path}/>
        }
        return(
            <div>
                <NavBar>Student Information Update</NavBar>
                <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
                <InputItem name='position' placeholder = "Job Position" onChange={val => this.handleOnchange('position',val)}>Position:</InputItem>
                <TextareaItem name = 'info'title="Info:" placeholder = "Personal description" row={3} onChange={val => this.handleOnchange('info',val)}/><TextareaItem/>
                <Button type = 'primary' onClick = {this.handleSave}>Save</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user : state.user}),
    {updateUser}
)(StudentInfo)