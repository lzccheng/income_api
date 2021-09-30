module.exports = {
    back(data, msg, code) {
        this.body = {
            code: code || 200,
            data: data || {},
            msg: msg || '成功'
        }
    }
}