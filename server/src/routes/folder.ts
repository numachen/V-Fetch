import Router from '@koa/router'
import { spawn } from 'child_process'
import path from 'path'

const router = new Router()

router.post('/api/open-folder', async (ctx) => {
  const { filePath } = ctx.request.body as { filePath?: string }
  if (!filePath) {
    ctx.status = 400
    ctx.body = { error: 'filePath is required' }
    return
  }

  const dir = path.dirname(filePath)
  const platform = process.platform

  if (platform === 'darwin') {
    spawn('open', ['-R', filePath])
  } else if (platform === 'win32') {
    spawn('explorer', [`/select,${filePath}`])
  } else {
    spawn('xdg-open', [dir])
  }

  ctx.body = { ok: true }
})

export default router
