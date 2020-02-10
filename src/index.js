import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'
//引入store 组件
import {Provider} from 'react-redux'
import store from "./redux/store";

//引入路由组件
import Register from "./containers/register/register";
import Login from "./containers/login/login";
import Main from "./containers/main/main";
import './assets/css/index.css'

import './test/socketio_test'

ReactDOM.render((
    <Provider store={store }>
        <HashRouter>
            {/*路径只能访问一个，所以switch别忘记写*/}
            <Switch>
                {/*没有给main指定路径， 只要特定path指定路，才会走register和login，否则都会经过main 以下三个可以看成是一极路由*/}
                <Route path='/register' component={Register}></Route>
                <Route path='/login' component={Login}></Route>
                <Route  component={Main}></Route> {/*默认主件 */}

            </Switch>

        </HashRouter>
    </Provider>
    ),document.getElementById('root')
)