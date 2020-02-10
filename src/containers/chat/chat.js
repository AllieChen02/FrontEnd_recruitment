/*
* 聊天消息的路由容器组件
* */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {sendMsg,readMsg} from '../../redux/actions'
import '../../assets/css/index.css'
import {NavBar,List,InputItem,Icon,Grid} from "antd-mobile";
import '../../assets/css/index.css'

const Item = List.Item
class Chat extends Component{
    constructor(props){
        super(props)
        this.state = {
            content:'',
            isShow:false
        }
        this.handleSend = this.handleSend.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleshowExpression =  this.handleshowExpression.bind(this)
    }
    //在第一次render执行之前就回掉，初始化表情列表数据
    componentWillMount() {
        const emojis = ['😉','😁','🤣','😂','🙃','😊','🥰','🤩','🤫','🤨','😘','😔','😋','😛','🤭','🤐','😶','🙄','😬',
                        '😷','🤕','😡','🤬','😠','👋','👌','🤙','👎','👊','👏','🙏','💪','👀','🙋']
        this.emojis= emojis.map(emoji => ({text : emoji}))


    }
    componentDidMount() {
        //进入页面的时候自动滑动到底部
        window.scrollTo(0,document.body.scrollHeight)

    }

    componentDidUpdate() {
        window.scrollTo(0,document.body.scrollHeight)
    }

    componentWillUnmount() {
        //发请求更新消息的未读状态
        const from  = this.props.match.params.userid
        const to = this.props.user_id
        this.props.readMsg(from,to)
    }

    //获取发送内容
    handleOnChange = (name,val) => {
        this.setState({
            /*这里状态更新的是它的值，例如: username,password,password2,type，而不是本身这个name*/
            [name] : val
        })
    }
    //显示表情列表
    handleshowExpression = ()=> {
        const isShow = !this.state.isShow
        this.setState({
            isShow : isShow
        })
        if(isShow){
            //异步手动派发resize事件，解决表情列表的显示问题
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            },0)
        }
    }

    handleSend = ()=>{
        const from = this.props.user._id
        //请求路径中的user id. 可以利用浏览器下载的插件工具来查看
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        //console.log(from+" " + to+" " + content)

        //与后台进行交互
        if(content){
            this.props.sendMsg({from,to,content})
        }

        //清除输入数据
        this.setState({
            content :'',
            //将表情收起来
            isShow: false
        })

    }



    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat
        //计算当前聊天对chat_id
        const meId = user._id
        //console.log(users)
        if(!users[meId]) { // 如果还没有获取数据, 直接不做任何显示
            return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId,targetId].sort().join('_')
        //console.log(users)
        //对chatMsgs 进行过滤,根据chat_id来,把符合条件的拉出来
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)

        //得到目标用户的头像
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null
        return(
            <div id='chat-page'>
                    <NavBar className='sticky-header' icon={<Icon type='left'/>}
                                onLeftClick={()=> this.props.history.goBack()}
                    >
                        {users[targetId].username}
                    </NavBar>
                    <List style={{marginBottom:50, marginTop:50}}>
                        {
                            msgs.map(msg => {
                                if(targetId===msg.from){ //对方发给我的
                                    return(
                                        <Item key={msg._id} thumb = {targetIcon}>
                                            {
                                                msg.content
                                            }
                                        </Item>
                                    )

                                }else{ //我发给对方的
                                    return(
                                        <Item key={msg._id} className = 'chat-me' extra='me'>
                                            {
                                                msg.content
                                            }
                                        </Item>
                                    )
                                }
                            })
                        }

                    </List>
                    <div className='bottomBar'>
                        <InputItem name="content" value = {this.state.content} onFocus = {()=> this.setState({isShow: false})} onChange={val=>this.handleOnChange('content',val)} placeholder="Please text here"
                                   extra={
                                       <span>
                                           <span onClick={this.handleshowExpression} style={{marginRight:5}}>😋</span>
                                            <span onClick={this.handleSend}>Send</span>

                                       </span>

                        }/>
                        {this.state.isShow ? (
                            <Grid data = {this.emojis} columnNum={8} carouselMaxRow = {4} isCarousel = {true} onClick = {(item) => {
                            this.setState({
                                content : this.state.content + item.text
                            })
                        }}>

                        </Grid>) : null}

                    </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg, readMsg}
)(Chat)
