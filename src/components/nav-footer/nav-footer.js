import '../../assets/css/index.css'
import React,{Component} from 'react'
import {TabBar} from "antd-mobile";
import PropsTypes from "prop-types";
import {withRouter} from 'react-router-dom'

const Item = TabBar.item
//希望在非路由组件中使用路由库的api？
//使用 withRoute()
class NavFooter extends Component{
    //接收参数
    static propTypes = {
        navList : PropsTypes.array.isRequired,
        unReadCount : PropsTypes.number.isRequired
    }
    render() {
        //读取数据
        let {navList, unReadCount} = this.props
        // 过滤掉hide为true的nav
        navList = navList.filter(nav => !nav.hide)
        //请求的路径
        const path = this.props.location.pathname

        return(
            <TabBar >
                {
                    navList.map((nav) =>(
                        <item key = {nav.path}
                              badge={nav.path === '/message' ? unReadCount : 0}
                              title = {nav.text}
                              icon = { {uri : require(`../../assets/images/nav/${nav.icon}.png`)}}
                              selectedIcon = {{uri:require(`../../assets/images/nav/${nav.icon}-selected.png`)}}
                              selected = {path === nav.path}
                              onPress = {() => this.props.history.replace(nav.path)}

                        />
                 ))
                }


            </TabBar>
        )
    }
}
//向外保留withRouter() 包装产生的组件。 内部会向组件中传入一些路由组件特有的属性: history/location/math
export default withRouter(NavFooter)