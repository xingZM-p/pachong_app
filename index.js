//必须使用双引号
"use strict"

const request = require('request')
const cheerio = require('cheerio')

const log = function(){
    return console.log.apply(console, arguments);
}

function Weather(){
    this.name = ''
    this.value = ''
}

const weatherFromLi = function(li){
    var a = new Weather()
    // 使用 cheerio.load 函数来返回一个可以查询的特殊对象
    // 使用这个 options 才能使用 html() 函数来获取带回车的文本信息
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(li, options)
    // 然后就可以使用 querySelector 语法来获取信息了
    // .text() 获取文本信息
    a.name = e('.cname > a').text().trim()
    a.value = e('.temp').text().trim()
    return a
}

// 获取每个地区里不同城市的数据
const weatherFromDiv = function(div){
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(div, options)
    // 查询对象的查询语法和 DOM API 中的 querySelector 一样
    const weather = []
    // log('div', div)
    const liNum = e('li')
    // log('divs',divs.length)
    for(let i = 0; i < liNum.length; i++){
        let element = liNum[i]
        // 获取 div 的元素并且用 movieFromDiv 解析
        // 然后加入 movies 数组中
        const li = e(element).html()
        const m = weatherFromLi(li)
        weather.push(m)
    }
    log('weather', weather.length)
    return weather
}

//获取天气数据
//获取8个不同地区的数据
const weatherFromBody = function(body){
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(body, options)
    // 查询对象的查询语法和 DOM API 中的 querySelector 一样
    const weathers = []

    const element = e('.content > .area')
    const div = e(element).html()
    const n = weatherFromDiv(div)
    weathers.push(n)
    return weathers
}


//将下载的数据保存进文件
const writeToFile = function(path, data){
    const fs = require('fs')
    fs.writeFile(path, data, function(err){
        if (err == null){
            log('--写入成功', path)
        }else {
            log('--写入失败', path)
        }
    })
}

//保存下载好的文件
const cachedUrl = function(url, callback) {
    const fs = require('fs')
    const path = url.slice(0, -1).split('/').join('-').split(':').join('-')
    fs.readFile(path, function(err, data) {
        if(err != null){
            request(url, function(err, response, body){
                writeToFile(path, body)
                callback(err, response, body)
            })
        } else {
            log('读取到缓存的页面', path)
            // 读取到，说明已经下载过了，我们讲直接读取硬盘上的文件
            const response = {
                statusCode: 200,
            }
            callback(null, response, data)
        }
    })
}


//主代码
const _main = function(){
    const url = 'http://www.nmc.cn/publish/forecast/china.html#'
    cachedUrl(url, function(err, response, body){
        if (err ===null && response.statusCode == 200){
            const weathers = weatherFromBody(body)
            // 引入自己写的模块文件（自定义模块）
            // ./ 表示当前目录
            const utils = require('./utils')
            const path = 'chinese_weather.txt'
            utils.saveJSON(path, weathers)
        } else {
            log('*** ERROR 请求失败', error)
        }
    })
}

_main()
