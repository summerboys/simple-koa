let exampleKoa = require('./app');

let app = new exampleKoa();

let responseData = {}
// app.use((req, res) => {
//     res.writeHead(200)
//     res.end('hello world')
// })

// app.use(async ctx => {
//     ctx.body = "hello word" + ctx.query.name
// })

// 验证中间件
// app.use(async (ctx, next) => {
//     responseData.name = 'wanglongx'
//     await next()
//     ctx.body = responseData
// })

// app.use(async (ctx, next) => {
//     responseData.age = 16
//     await next()
// })

// app.use(async (ctx, next) => {
//     responseData.sex = 'mela'
// })

// 验证 error 

app.use(async ctx => {
    throw new Error('this is a error')
})
app.on('error', err => {
    console.log(err.stack)
})


app.listen(3000, () => {
    console.log(' listen port 3000')
})