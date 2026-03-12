# V-Fetch

高性能跨平台视频获取工具，支持多清晰度选择、元数据管理和并发下载。

## 技术栈

- **前端**: React 18 + Vite + TypeScript + Tailwind CSS + Zustand
- **后端**: Koa2 + TypeScript + SQLite (better-sqlite3)
- **视频引擎**: yt-dlp

## 功能特性

- 🎬 跨平台视频解析（YouTube、B站、抖音、Vimeo 等）
- 🎯 多清晰度选择（4K / 1080P / 720P / 360P / 仅音频）
- 📚 历史记录资源库（磁贴式布局，含封面预览）
- 🏷️ 标签管理（自动抓取 + 手动自定义）
- ⚡ 并发下载控制（1-5 个同时任务）
- 🔄 断点续传
- 📋 剪贴板监听（自动检测视频链接）
- 🌐 代理配置（HTTP / HTTPS / SOCKS5）
- 📊 实时进度推送（SSE）

## 安装与启动

### 前置要求

- Node.js >= 18
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) 已安装并在 PATH 中

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

前端运行在 http://localhost:5173，后端运行在 http://localhost:3001

### 构建

```bash
npm run build
```

## API 接口概览

| 方法 | 路径 | 功能 |
|------|------|------|
| POST | /api/parse | 解析视频 URL |
| POST | /api/download/start | 开始下载 |
| DELETE | /api/download/cancel/:id | 取消下载 |
| GET | /api/download/progress/:id | SSE 实时进度 |
| GET | /api/library | 历史记录列表 |
| PATCH | /api/library/:id | 更新标题/标签 |
| DELETE | /api/library/:id | 删除记录 |
| GET | /api/settings | 读取配置 |
| PUT | /api/settings | 保存配置 |
| POST | /api/settings/proxy/test | 测试代理 |
| POST | /api/open-folder | 打开文件夹 |

## 项目结构

```
v-fetch/
├── client/          # React 前端
└── server/          # Koa2 后端
```