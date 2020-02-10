/*
State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。
所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了
包含n个action creator
异步action
同步action

用户（操作View）发出Action，发出方式就用到了dispatch方法；
然后，Store自动调用Reducer，并且传入两个参数(当前State和收到的Action)，Reducer会返回新的State，如果有Middleware，Store会将当前State和收到的Action传递给Middleware，Middleware会调用Reducer 然后返回新的State；
State一旦有变化，Store就会调用监听函数，来更新View；
* */

import {AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER_LIST, RECEIVER_USER, RESET_USER, RECEIVE_MSG,RECEIVE_MSG_LIST,MSG_READ} from './actions-types'
import {reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList,reqChatMsgList,reqReadMsg} from "../api";
//引入客户端io
import io from 'socket.io-client'


//有一个type就必然有一个同步action
//授权成功的同步action
const authSuccess  = (user) => ({
        type: AUTH_SUCCESS,
        data: user
    }
)
//错误提示信息的同步action
const errorMsg = (msg) => ({
        type : ERROR_MSG,
        data : msg
})
//接受用户的同步action
const receiverUser = (user) => ({
    type : RECEIVER_USER,
    data : user
})
//重置用户的同步action
export const resetUser = (msg) => ({
    type : RESET_USER,
    data : msg
})
//接收用户列表的同步action
export const receiveUserList = (userList) => ({
    type : RECEIVE_USER_LIST,
    data : userList
})

//接收用户信息列表的同步action
export const receiveMsgList = ({users, chatMsgs,userid}) => ({
    type: RECEIVE_MSG_LIST,
    data : {users, chatMsgs,userid}
})

//接收一个消息当同步action
export const receiveMsg = (chatMsg,userid) => ({
    type: RECEIVE_MSG,
    data : {chatMsg,userid}
})

//读取一个消息当同步action
export const msgRead = ({count, from ,to }) => ({
    type : MSG_READ,
    data : {count,from,to}
})






//注册异步action
export const register = (user) => {
    const {username, password, password2, type} = user
    //做表单的前台检查，如果不通过，分发一个errorMsg的同步action
    if(!username){
        return errorMsg('username should not be empty')
    }else if(password !== password2){
        return errorMsg('Two input password should be same')
    }
    //表单数据合法，返回一个发ajax请求的异步action函数
    return async dispatch =>{
        //发送 注册的异步ajax请求
        /* const promise = reqRegister(user) //返回的是一个promise对象
        promise.then(response => {
            const data = response.data //返回的数据就是后端写的 例如{code:0/1, data: user, msg:''}
        })*/

        //用await来处理异步请求， 等promise里面对象执行完
        const response = await reqRegister({username, password, type})
        const result = response.data
        if(result.code === 0){    //注册成功
            //注册成功时调用消息列表
            getMsgList(dispatch,result.data._id)
            //分发授权成功的同步action
            dispatch(authSuccess(result.data))

        }else{                  //注册失败
            //分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}

//登陆异步action
export const login = (user) => {
    const {username, password} = user
    //做表单的前台检查，如果不通过，分发一个errorMsg的同步action
    if(!username){
        return errorMsg('username should not be empty')
    }else if(!password ){
        return errorMsg('password should not be empty')
    }
    return async dispatch => {
        const response = await reqLogin({username, password})
        const result = response.data
        if(result.code === 0){    //注册成功
            getMsgList(dispatch,result.data._id)
            //分发授权成功的同步action
            dispatch(authSuccess(result.data))
        }else{                  //注册失败
            //分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}
//更新用户信息的异步action
export const updateUser = (user) => {
    return async dispatch => {
        const response =  await reqUpdateUser(user)
        const result = response.data
        if(result.code === 0){  //更新成功: data: user
            console.log(result.data)
            dispatch(receiverUser(result.data))
        }else{                  //更新失败: msg: 提示文本
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户异步action
export const getUser =() => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if(result.code === 0) {
            getMsgList(dispatch,result.data._id)
            dispatch(receiverUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}


// 获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        // 执行异步ajax请求
        const response = await reqUserList(type)
        const result = response.data
        // 得到结果后, 分发一个同步action
        if(result.code===0) {
            dispatch(receiveUserList(result.data))
        }
    }
}


//即使调用多次，内存中只需要一个socket对象。--所以这里引入单例对象的概念
/*
* 单例对象
* 1. 创建对象之前，要判断对象是否已经存在，只有不存在，才去创建
* 2. 创建对象之后，保存对象
* */
function initIO(dispatch, userid) {
    //如果socket对象不存在，那么创建
    if(!io.socket){
        //1.创建对象 连接服务器, 得到与服务器的连接对象. 2. 保存对象
        io.socket = io('ws://localhost:4000')
        // 绑定监听, 接收服务器发送的消息
        io.socket.on('receiveMsg', function (chatMsg) {
            console.log('Client is receiving messages from server', chatMsg)
            //只有当chatMsg是与当前用户相关当消息，才去分发同步action保存
            if(chatMsg.from === userid || chatMsg.to === userid){
                dispatch(receiveMsg(chatMsg,userid))
            }
        })
    }
}



//异步获取消息列表数据
async function getMsgList(dispatch,userid){
    initIO(dispatch,userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code === 0){
        const {users, chatMsgs} = result.data
        //分发同步action
        dispatch(receiveMsgList({users,chatMsgs,userid}))
    }
}

//异步发消息的action
export const sendMsg = ({from,to,content})=>{
    return dispatch => {
        console.log('client is sending messages to server',{from,to,content})
        //发送消息
        io.socket.emit("sendMsg",{from,to,content})
        //io.socket.emit()
    }
}

//读取消息的异步action
export const readMsg = ((from,to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code === 0){
            //准备数据
            const count = result.data
            //console.log(count)
            dispatch(msgRead({count,from,to}))
        }
    }
})


