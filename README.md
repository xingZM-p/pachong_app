# 1、爬虫结果的图表化数据分析
- 利用百度 echarts.js
![image](https://github.com/xingZM-p/pachong_app/blob/master/template.PNG)

# 2、爬包app代码如下（以中国中央气象台天气预报数据为例）
- 需要用到request、cheerio库
```
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
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(li, options)
    a.name = e('.cname > a').text().trim()
    a.value = e('.temp').text().trim()
    return a
}

const weatherFromDiv = function(div){
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(div, options)
    const weather = []
    // log('div', div)
    const liNum = e('li')
    // log('divs',divs.length)
    for(let i = 0; i < liNum.length; i++){
        let element = liNum[i]
        const li = e(element).html()
        const m = weatherFromLi(li)
        weather.push(m)
    }
    log('weather', weather.length)
    return weather
}

const weatherFromBody = function(body){
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(body, options)
    const weathers = []

    const element = e('.content > .area')
    const div = e(element).html()
    const n = weatherFromDiv(div)
    weathers.push(n)
    return weathers
}


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

```


