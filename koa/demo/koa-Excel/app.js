const Koa = require('./node_modules/koa')
const bodyParser = require('./node_modules/koa-bodyparser')
const controller = require('./controller')
const rest = require('./rest')

const app = new Koa()

const isProduction = process.env.NODE_ENV == 'production'

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  var start = new Date().getTime(),
    execTime
  await next()
  execTime = new Date().getTime() - start
  ctx.response.set('X-Response-Time', `${execTime}ms`)
})

// static file support
let staticFiles = require('./static-files')
app.use(staticFiles('/static', __dirname + '/static'))

// 重定向
app.use(async (ctx, next) => {
  if (ctx.request.path == '/') {
    ctx.response.redirect('/static/index.html')
  } else {
    await next()
  }
})

// parse request body
app.use(bodyParser())

// bind rest() for ctx
app.use(rest.restify())

// add controllers
app.use(controller())

app.listen(3000)
console.log(`app started at port 3000...`)