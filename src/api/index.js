/*
* 包含了n个接口请求的函数的接口
* 函数返回promise
* */

import ajax from './ajax'
//注册接口的请求函数
//注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
//登陆接口
export const reqLogin = ({username, password})=> ajax('/login', {username, password}, 'POST')
//更新用户接口
export const reqUpdateUser = (user) => ajax('/update',user,'POST')
//获取用户信息
export const reqUser = () => ajax('/user')
//获取用户列表的信息
export const reqUserList = (type) => ajax('/userList',{type})
//获取当前用户聊天的信息列表
export const reqChatMsgList = () => ajax('/msgList')
//修改指定消息为已读
export const reqReadMsg= (from) => ajax('/readMsg',{from},'POST')