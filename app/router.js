module.exports = app => {
    const { controller, router } = app
    router.get('/', controller.home.index)
    router.get('/api/list', controller.jsonDB.list)
    router.post('/api/add_income', controller.jsonDB.add)
    router.post('/api/del_income', controller.jsonDB.del)
}