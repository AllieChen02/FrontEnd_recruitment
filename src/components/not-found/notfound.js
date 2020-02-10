/*
* 找不到界面的ui 路由组件
* */
import React,{Component} from 'react'
import {Button} from "antd-mobile";

class NotFound extends Component{
    render() {
        return (
            <div>
                <div>
                    <h2>Sorry, we cannot load the page. Please wait...</h2>
                    <Button type='primary' onClick={()=> this.props.history.replace('/')}>Go Back</Button>
                </div>
            </div>
        )
    }
}
export default NotFound