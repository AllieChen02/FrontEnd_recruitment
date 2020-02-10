/*
* 能发送ajax请求的函数模块
* 函数的返回值是promise对象
* */
import axios from 'axios'

//暴露函数
export default function ajax(url, data={}, type='GET') {
    if(type === 'GET'){
        //拼接字符串，因为get请求数据都在url中
        //eg  paramStr: username=cst&password=123
        let paramStr = ''
        Object.keys(data).forEach(key => {
            paramStr += key + '='+ data[key] + '&'
        })
        if(paramStr){
            paramStr = paramStr.substring(0,paramStr.length - 1)
        }
        return axios.get(url + '?' + paramStr)
    }else {
        return axios.post(url,data)
    }
}