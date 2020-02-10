//显示指定用户列表的 UI 组件
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank, WhiteSpace, Card} from "antd-mobile";
import {withRouter} from 'react-router-dom'

const Header = Card.Header
const Body = Card.Body
class UserList extends Component{
    //接收上层组件传递来的参数
    static propTypes = {
        userList : PropTypes.array.isRequired
    }

    render() {

        const {userList} = this.props
        //console.log(userList.length);
        return(
            <WingBlank style={{marginBottom:50, marginTop:10}}>

                {
                    userList.map(user => (
                        <div key={user._id}>
                            <WhiteSpace/>
                            <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                                <Header
                                    thumb={require(`../../assets/images/${user.header}.png`)}
                                    extra={user.username}
                                />
                                <Body>
                                    <div>Position: {user.position}</div>
                                    {user.company ? <div>Company: {user.company}</div> : null}
                                    {user.salary ? <div>Salary: {user.salary}</div> : null}
                                    <div>Info: {user.info}</div>
                                </Body>
                            </Card>
                        </div>
                    ))
                }

            </WingBlank>
        )
    }
}
export default withRouter(UserList)