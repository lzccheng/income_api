const { Controller  } = require('egg')

class Home extends Controller {
    async index(ctx) {
        ctx.body = 'hello world !!!'
    }
}
module.exports = Home