const { Controller } = require('egg')
const fs = require('fs')

class JsonDB extends Controller {
    getData(username, date) {
        const res = fs.readFileSync('jsonDB.json')
        const obj = JSON.parse(res.toString())
        const data = obj[username] || {}
        return data[date] || []
    }
    async setData(username, date, data, isDel) {
        const res = fs.readFileSync('jsonDB.json')
        const obj = JSON.parse(res.toString())
        const _data = obj[username] || {}
        if (isDel) {
            const list = _data[date] || []
            let index
            list.find((i, _index) => {
                if (i.id === data.id) {
                    index = _index
                    return true
                }
            })
            if (index !== undefined) {
                list.splice(index, 1)
            }
            _data[date] = list
        } else {
            _data[date] = data
        }
        obj[username] = _data
        return await new Promise((resolve, reject) =>{
            fs.writeFile('jsonDB.json', JSON.stringify({ ...obj, [username]: _data }), (err) => err ? reject() : resolve())
        }).then(() => true, () => false)
    }
    async list(ctx) {
        const { query: { date, username } } = ctx
        if (!username) return ctx.back(null, 'miss username', 500)
        if (!date) return ctx.back(null, 'miss date', 500)
        const data = this.getData(username, date)
        ctx.back(data)
    }
    async add(ctx) {
        const { body: { date, username, log, income, other, formKey } } = ctx.request
        if (!username) return ctx.back(null, 'miss username', 500)
        if (!formKey) return ctx.back(null, 'miss date', 500)
        const data = this.getData(username, formKey)
        data.push({ date, log, income, other, id: +new Date() })
        const isOk = await this.setData(username, formKey, data)
        isOk ? ctx.back() : ctx.back(null, '失败', 500)
    }
    async del(ctx) {
        const { body: { id, username, formKey } } = ctx.request
        if (!username) return ctx.back(null, 'miss username', 500)
        if (!formKey) return ctx.back(null, 'miss date', 500)
        const res = await this.setData(username, formKey, { id }, true)
        res ? ctx.back() : ctx.back(null, '失败', 500)
    }
}

module.exports = JsonDB