import Router from '@koa/router'
import { db, getAllSettings } from '../db'
import { testProxy } from '../services/proxy'

const router = new Router()

router.get('/api/settings', async (ctx) => {
  ctx.body = getAllSettings()
})

router.put('/api/settings', async (ctx) => {
  const body = ctx.request.body as Record<string, string>
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
  const updateMany = db.transaction((entries: [string, string][]) => {
    for (const [key, value] of entries) {
      upsert.run(key, String(value))
    }
  })
  updateMany(Object.entries(body))
  ctx.body = { ok: true }
})

router.post('/api/settings/proxy/test', async (ctx) => {
  try {
    const success = await testProxy()
    ctx.body = {
      success,
      message: success ? '代理连通正常' : '代理连接失败或超时',
    }
  } catch {
    ctx.body = { success: false, message: '测试过程发生异常' }
  }
})

export default router
