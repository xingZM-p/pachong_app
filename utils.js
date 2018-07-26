const _saveJSON = function(path, weathers){
    const fs = require('fs')
    const s = JSON.stringify(weathers, null, 2)
    fs.writeFile(path, s, function(err){
        if (err !== null){
            console.log('*** 写入文件错误', error)
        } else {
            console.log('--- 保存成功')
        }
    })
}

exports.saveJSON = _saveJSON
