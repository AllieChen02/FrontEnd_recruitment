//显示图片 因为不需要交互，其实用函数组件去写就可以了
import React from 'react'
import logo from './logo.png'
import './logo.css'

export default function Logo() {
    return (
        <div className="logo-container">
            <img src={logo} alt = "logo" className="logo-img"></img>
        </div>
    )
}

