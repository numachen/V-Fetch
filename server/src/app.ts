import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import parseRouter from './routes/parse'
import downloadRouter from './routes/download'
import libraryRouter from './routes/library'
import settingsRouter from './routes/settings'
import folderRouter from './routes/folder'

const app = new Koa()

app.use(cors({ origin: '*' }))
app.use(bodyParser())

app.use(parseRouter.routes()).use(parseRouter.allowedMethods())
app.use(downloadRouter.routes()).use(downloadRouter.allowedMethods())
app.use(libraryRouter.routes()).use(libraryRouter.allowedMethods())
app.use(settingsRouter.routes()).use(settingsRouter.allowedMethods())
app.use(folderRouter.routes()).use(folderRouter.allowedMethods())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ V-Fetch server running on http://localhost:${PORT}`)
})
