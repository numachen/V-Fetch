import Router from '@koa/router'
import { db } from '../db'
import { enqueueDownload, cancelDownload, subscribeProgress } from '../services/downloader'

const router = new Router()

router.post('/api/download/start', async (ctx) => {
  const body = ctx.request.body as {
    url: string
    formatId: string
    format: string
    quality: string
    title: string
    thumbnail: string
  }

  const result = db
    .prepare(
      `INSERT INTO downloads (url, title, thumbnail, format, quality, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`
    )
    .run(body.url, body.title, body.thumbnail, body.format, body.quality)

  const id = Number(result.lastInsertRowid)

  enqueueDownload({
    id,
    url: body.url,
    formatId: body.formatId,
    format: body.format,
    quality: body.quality,
  })

  ctx.body = { id }
})

router.delete('/api/download/cancel/:id', async (ctx) => {
  cancelDownload(Number(ctx.params.id))
  ctx.body = { ok: true }
})

router.get('/api/download/progress/:id', async (ctx) => {
  const id = Number(ctx.params.id)

  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })
  ctx.res.flushHeaders()

  const send = (data: object) => {
    ctx.res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  const unsubscribe = subscribeProgress(id, send)

  ctx.req.on('close', () => {
    unsubscribe()
  })

  await new Promise<void>((resolve) => {
    ctx.req.on('close', resolve)
  })
})

export default router
