import Router from '@koa/router'
import { parseVideo } from '../services/ytdlp'
import { getProxyUrl } from '../services/proxy'

const router = new Router()

router.post('/api/parse', async (ctx) => {
  const { url } = ctx.request.body as { url?: string }
  if (!url) {
    ctx.status = 400
    ctx.body = { error: 'url is required' }
    return
  }
  try {
    const proxy = getProxyUrl()
    const meta = await parseVideo(url, proxy)
    ctx.body = meta
  } catch (e: any) {
    ctx.status = 400
    ctx.body = { error: e.message || 'Parse failed' }
  }
})

export default router
