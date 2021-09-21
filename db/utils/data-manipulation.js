exports.formatData = (data, keys) => {
    const formattedData = data.map((item) => {
        const x = [];
        keys.forEach((key) => {
            x.push(item[key])
        })
        return x
    })
    return formattedData
}

exports.addKeys = (objArr, key, keyValues) => {
    for (let i = 0; i < objArr.length; i++) {
        objArr[i][key] = (keyValues[i][key] -1)
    }
    return objArr
}