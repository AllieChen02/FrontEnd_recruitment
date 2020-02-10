/*
选择用户头像的UI组件
* */
import React, {Component} from 'react'
import {List,Grid} from "antd-mobile";
/*prop-types可以用来将properties 传给components*/
import PropsTypes from 'prop-types'
export default class HeaderSelector extends Component{

    static propTypes = {
        setHeader : PropsTypes.func.isRequired
    }

    constructor(props){
        super(props)
        /*Grid中data为对象数组，每个对象里面塞的是icon和text*/
        this.headerList = []
        for(let i= 0; i<20; i++ ){
            this.headerList.push({
                text : 'avatar'+(i+1),
                icon : require(`../../assets/images/avatar${i+1}.png`)
            })
        }
        this.state = {
            icon : null //图片对象,默认是没有值的
        }
        this.handleClick = this.handleClick.bind(this)
    }
    /*我们点击以后要传入的是 点击的对象，对象里面有text和icon，所以就直接写成{text, icon}*/
    handleClick = ({text,icon}) => {
        //更新当前组件的状态
        this.setState({
            icon : icon
        })
        //调用函数更新父组件的状态
        this.props.setHeader(text)
    }
    render() {
        const {icon} = this.state
        const listHeader = !icon ?  "Please choose your profile photo" : (
                                                <div>
                                                    "Chosen profile photo:" <img src={icon}/>
                                                </div>
                                                )
        return(
            <List renderHeader={ ()=> listHeader}>
                {/*传入的是一个组件对象*/}
                <Grid data = {this.headerList} columnNum = {5}  onClick = {this.handleClick}></Grid>
            </List>

        )
    }
}