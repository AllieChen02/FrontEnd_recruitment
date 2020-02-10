/*
Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer
所以说reducer 只是一个接收 state 和 action，并返回新的 state 的函数。 对于大的应用来说，不大可能仅仅只写一个这样的函数，
            所以我们编写很多小函数来分别管理 state 的一部分

包含n个reducer函数: 根据老的state和指定的action 返回一个新的state
* */
import {combineReducers} from "redux";
import {AUTH_SUCCESS,ERROR_MSG, RECEIVER_USER, RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG,RECEIVE_MSG_LIST,MSG_READ} from './actions-types'
import {getRedirectTo} from '../utils'

const initUser = {
    username: '', //用户名
    type: '', //用户类型 student/faculty
    msg: '',  //用来存储错误的提示信息
    redirectTo :'' //需要自动重定向的路由路径
}
//产生user状态的reducer
function user(state=initUser, action){
    switch (action.type) {
        case AUTH_SUCCESS:  //data是user
            const {type, header} = action.data
            return {...action.data, redirectTo: getRedirectTo(type, header)}
        case ERROR_MSG:     //data是msg, 去覆盖掉
            return {...state, msg : action.data}
        case RECEIVER_USER:
            return action.data
        case RESET_USER:
            //这里不写...state是因为当需要reset用户的时候，我们需要清楚cookie中当_id， 没有了以后自动就会回到登陆界面
            return {...initUser, msg : action.data}
        default:
            return state
    }
}

const initUserList = []
// 产生userlist状态的reducer
function userList(state=initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:  // data为userList
            return action.data
        default:
            return state
    }
}


const initChat = {
    users : {},     //所有用户的信息的对象  属性名: userid, 属性值： {username, header}
    chatMsgs:[],    //当前用户相关的message数组
    unReadCount:0   //总的未读数量
}
//定义一个新的reducer
function chat(state = initChat,action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:     // data:{users, chatMsgs}
            const {users, chatMsgs,userid} = action.data
            return {
                users: users,
                chatMsgs: chatMsgs,
                //TODO
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0),0)
            }
        case RECEIVE_MSG:    //data : {chatMsg,userid}
            const {chatMsg} = action.data
            return {
                users : state.users,
                chatMsgs : [...state.chatMsgs,chatMsg],
                unReadCount:state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
            }
        case MSG_READ:
            const {count,from ,to} = action.data
            return {
                users: state.users,
                chatMsgs:  state.chatMsgs.map( msg => {
                    if(msg.from === from && msg.to === to && !msg.read){//需要更新
                        //使用纯函数来处理对象，可以不改变原来里面的结构
                        return {...msg,read:true}
                    }else{
                        //不需要更新的
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}




export default combineReducers({
    user,
    userList,
    chat
})
//向外暴露对象结构 {user:{}}