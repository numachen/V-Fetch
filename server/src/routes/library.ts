import Router from '@koa/router'
import { db } from '../db'

const router = new Router()

router.get('/api/library', async (ctx) => {
  const { status, sortBy = 'created_at', order = 'desc' } = ctx.query as Record<string, string>
  const col = ['created_at', 'updated_at', 'title'].includes(sortBy) ? sortBy : 'created_at'
  const ord = order === 'asc' ? 'ASC' : 'DESC'

  let sql = `SELECT * FROM downloads`
  const params: string[] = []
  if (status) {
    sql += ` WHERE status = ?`
    params.push(status)
  }
  sql += ` ORDER BY ${col} ${ord}`

  const rows = db.prepare(sql).all(...params) as any[]
  const records = rows.map((r) => ({
    ...r,
    tags: (() => { try { return JSON.parse(r.tags) } catch { return [] } })(),
  }))
  ctx.body = records
})

router.patch('/api/library/:id', async (ctx) => {
  const id = Number(ctx.params.id)
  const { title, tags } = ctx.request.body as { title?: string; tags?: string[] }
  if (title !== undefined) {
    db.prepare('UPDATE downloads SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, id)
  }
  if (tags !== undefined) {
    db.prepare('UPDATE downloads SET tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(JSON.stringify(tags), id)
  }
  const row = db.prepare('SELECT * FROM downloads WHERE id = ?').get(id) as any
  ctx.body = { ...row, tags: (() => { try { return JSON.parse(row.tags) } catch { return [] } })() }
})

router.delete('/api/library/:id', async (ctx) => {
  db.prepare('DELETE FROM downloads WHERE id = ?').run(Number(ctx.params.id))
  ctx.status = 204
})

export default router
