/*
对话消息列表组件
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief

function getLastMsgs (chatMsgs,userid){
    //1.
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        //对msg进行个体的统计
        if(msg.to === userid && !msg.read){
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }
        //得到msg的聊天id
        const chatId = msg.chat_id
        //获取已保存的当前组件的lastmsg
        const lastMsg = lastMsgObjs[chatId]
        if(!lastMsg){
            //没有，说明当前message就是所在组的lastmessage
            lastMsgObjs[chatId] = msg
        }else{
            //保存  已经统计的未读数量 + 当前message的未读数量
            const urc = lastMsg.unReadCount + msg.unReadCount
            //有。 如果msg比lastmsg晚，那么就将msg保存为lastmsg
            if(msg.create_time > lastMsg.create_time){
                lastMsgObjs[chatId] = msg
            }
            lastMsgObjs[chatId].unReadCount = urc
        }
    })
    //得到所有的lastMsg数组
    const lastMsgs = Object.values(lastMsgObjs)
    //对数组进行排序
    lastMsgs.sort(function (m1,m2) { //如果结果<0,将m1放在前面，如果结果为0，不变，如果结果大于0，m2放在前面
        return m2.create_time - m1.create_time
    })
    return lastMsgs
}

class Message extends Component {
    /*
    * 根据chat_id进行分组，并得到每个组的lastmsg组成的数组
    * 1. 找出每个聊天的lastmsg，并用一个对象容器来保存{chat_id, lastmsg}
    * 2. 得到所有lastmsg的数组
    * 3. 对数组进行排序(按create_time排序降序排列）
    * */
    constructor(props){
        super(props)
    }

    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat
        //下面要对chatmsgs 按照chat_id 分组，并得到每个组的lastMsg组成的数组，然后将其显示出来
        const lastMsgs = getLastMsgs(chatMsgs,user._id)
        return (
            <List style = {{ marginBottom:50}}>
                {
                    lastMsgs.map(msg => {
                        const targetUsrId = msg.to === user._id ? msg.from : msg.to
                        //确定target user
                        const targetUsr = users[targetUsrId]
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={targetUsr.header ? require(`../../assets/images/${targetUsr.header}.png`) : null}
                                arrow='horizontal'
                                onClick={()=> this.props.history.push(`/chat/${targetUsrId}`)}>
                                {msg.content}
                                <Brief>{targetUsr.username}</Brief>
                            </Item>
                        )
                    })
                }

    </List> )
    } }
export default connect(state=> ({
    user:state.user,
    chat : state.chat
}),{})
(Message)