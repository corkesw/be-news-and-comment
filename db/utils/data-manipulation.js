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