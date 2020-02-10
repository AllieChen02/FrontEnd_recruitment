/*
* 公司主界面路由容器组件
* */
import React,{Component} from 'react'
//包装生成容器组件
import {connect} from 'react-redux'
import UserList from '../../components/user-list/user-list'
import {getUserList} from "../../redux/actions";
class Company extends Component{

    //初始化就显示
    componentDidMount(){
        //获取userList
        this.props.getUserList('student')
    }
    render() {
        return (
            <UserList userList={this.props.userList}/>
        )
    }
}
export default connect (
    state => ({userList : state.userList}),
    {getUserList}
)(Company)
