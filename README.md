# ZSXの小站 - Nuxt 3 个人博客

> 造化钟神秀，阴阳割昏晓。

一个基于 [Nuxt 3](https://nuxt.com/) 构建的现代化个人博客系统，魔改自 [纸鹿大佬的开源项目](https://github.com/L33Z22L11/blog-v3)。

## ✨ 特性

- 🚀 **现代化技术栈**: Nuxt 3 + Vue 3 + TypeScript + SCSS
- 🎨 **精美主题**: 支持深色/浅色模式，响应式设计
- 📝 **内容管理**: 基于 Markdown 的文章管理系统
- 🔍 **搜索功能**: 内置全文搜索支持
- 🎵 **音乐播放器**: 集成网易云音乐播放器
- 💬 **评论系统**: 集成 Twikoo 评论系统
- 📊 **统计分析**: 集成 Umami 和 Cloudflare Insights
- 🌐 **SEO 优化**: 完整的 SEO 元数据和站点地图
- 🔗 **友链管理**: 完善的友链页面和管理系统
- 📱 **移动端适配**: 完美支持移动端浏览

## 🏗️ 技术架构

### 核心框架
- **Nuxt 3** - Vue.js 全栈框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Pinia** - Vue 状态管理库
- **@nuxt/content** - 内容管理系统

### UI & 样式
- **SCSS** - CSS 预处理器
- **@nuxt/icon** - 图标系统
- **@nuxt/image** - 图片优化
- **Vue Tippy** - 工具提示组件

### 第三方服务
- **Twikoo** - 评论系统
- **Umami** - 网站分析
- **网易云音乐** - 音乐播放器
- **今日诗词** - 古诗词显示

## 🚀 快速开始

### 环境要求

- Node.js >= 22.15 < 25
- pnpm >= 10

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/Nuxt-blog-v3.git
cd Nuxt-blog-v3

# 安装依赖
pnpm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 或启动开发服务器并开放局域网访问
pnpm dev:host
```

访问 http://localhost:3000 查看博客

### 生产构建

```bash
# 构建生产版本
pnpm build

# 生成静态文件
pnpm generate

# 预览生产构建
pnpm preview

# 构建并预览
pnpm start
```

## ⚙️ 配置说明

### 基础配置

主要配置文件位于 `blog.config.ts`：

```typescript
const basicConfig = {
  title: 'ZSXの小站',           // 网站标题
  subtitle: '造化钟神秀，阴阳割昏晓。', // 网站副标题
  description: '钟神秀的个人博客...',   // 网站描述
  url: 'https://blog.zsxcoder.top/',    // 网站地址
  author: {
    name: '钟神秀',                   // 作者名称
    email: 'me@mcyzsx.top',          // 作者邮箱
    avatar: 'https://...',            // 头像地址
  },
  // ... 其他配置
}
```

### 文章分类配置

```typescript
article: {
  categories: {
    经验分享: { icon: 'ph:mouse-bold', color: '#3af' },
    杂谈: { icon: 'ph:chat-bold', color: '#3ba' },
    生活: { icon: 'ph:shooting-star-bold', color: '#f77' },
    资源分享: { icon: 'mdi:web', color: '#24d' },
    技术分享: { icon: 'ph:code-bold', color: '#77f' },
  },
  // ... 其他配置
}
```

### 评论系统配置

```typescript
twikoo: {
  envId: 'https://twikoo-ryu.mcyzsx.top/', // Twikoo 服务地址
  preload: 'https://twikoo-ryu.mcyzsx.top/',
}
```

## 📱 页面功能

### 核心页面
- **首页** (`/`) - 博客首页，展示最新文章
- **文章页** (`/posts/[slug]`) - 文章详情页面
- **归档** (`/archive`) - 文章归档页面
- **标签** (`/tags`) - 标签页面
- **分类** (`/categories`) - 分类页面

### 特色页面
- **关于** (`/about`) - 个人介绍页面
- **友链** (`/link`) - 友链页面，支持轮播展示
- **朋友圈** (`/fcircle`) - 友链朋友圈动态
- **留言板** (`/message`) - 访客留言功能
- **追番** (`/banguim`) - 番剧追番记录
- **说说** (`/moments`) - 即时动态发布
- **游戏** (`/steam`) - Steam 游戏展示
- **B站** (`/bilibili`) - B站视频展示

## 🎨 主题定制

### 颜色变量

在 `assets/css/_variable.scss` 中定义主题变量：

```scss
// 主题色
--c-primary: #409eff;
--c-success: #67c23a;
--c-warning: #e6a23c;
--c-danger: #f56c6c;

// 背景色
--c-bg-1: #ffffff;
--c-bg-soft: #f5f7fa;
--c-bg-mute: #f0f2f5;
```

### 暗色主题

项目支持自动切换暗色主题，会根据系统设置自动适配。

## 📦 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com/) 导入项目
3. 配置环境变量（如需要）
4. 自动部署完成

### Netlify 部署

```bash
# 构建命令
pnpm generate

# 发布目录
dist
```

### 腾讯云 EdgeOne 部署

使用 `edgeone.json` 配置文件，支持：
- 自定义头部配置
- 路由重定向
- API 路由处理

### 自托管部署

```bash
# 构建项目
pnpm build

# 启动生产服务器
node .output/server/index.mjs
```

## 📝 内容管理

### 创建新文章

```bash
# 创建新文章
pnpm new

# 文章位于 content/posts/ 目录下
```

### 文章格式

```markdown
---
title: 文章标题
date: 2024-01-01
tags: [标签1, 标签2]
categories: 分类
description: 文章描述
---

# 文章内容

这里是文章的 Markdown 内容...
```

## 🔧 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm dev:host         # 启动开发服务器（局域网）

# 构建
pnpm build            # 构建生产版本
pnpm generate         # 生成静态文件
pnpm preview          # 预览构建结果
pnpm start            # 构建并预览

# 工具
pnpm new              # 创建新文章
pnpm lint             # 代码检查
pnpm lint:fix         # 修复代码问题
pnpm bump             # 更新依赖

# 清理
pnpm clean            # 清理缓存
pnpm prepare          # 准备构建环境
```

## 🎯 魔改记录

### 魔改页面

| 魔改页面 | 魔改来源 | 来源仓库 |
|---|---|---|
| 标签页/文章页 | ATao-blog | [ataoyan/blog-v3](https://github.com/ataoyan/blog-v3) |
| 友链页及卡片 | ATao-blog | [ataoyan/blog-v3](https://github.com/ataoyan/blog-v3) |
| 友链页顶部轮播图 | 歆鸢阁 | [661111/Myxz_Blog_Nuxt](https://github.com/661111/Myxz_Blog_Nuxt) |
| 追番页 | 歆鸢阁 | [661111/Myxz_Blog_Nuxt](https://github.com/661111/Myxz_Blog_Nuxt) |
| 我的装备 | 歆鸢阁 | [661111/Myxz_Blog_Nuxt](https://github.com/661111/Myxz_Blog_Nuxt) |
| 关于页面 | 歆鸢阁 | [661111/Myxz_Blog_Nuxt](https://github.com/661111/Myxz_Blog_Nuxt) |
| 友链朋友圈 | 歆鸢阁 | [661111/Myxz_Blog_Nuxt](https://github.com/661111/Myxz_Blog_Nuxt) |
| 留言板 | 硅基漫游指南 | [HeLongy](https://github.com/HeLongy) |
| 侧边诗词 | 喵洛阁 | [Kemeow815/blog-v3](https://github.com/Kemeow815/blog-v3) |
| 侧边栏(上下班) | 喵洛阁 | [Kemeow815/blog-v3](https://github.com/Kemeow815/blog-v3) |
| 底部随机友链 | 液泡部落格 | [Kemeow815/blog-v3](https://github.com/Kemeow815/blog-v3) |
| 底部一言 | 液泡部落格 | [VacuolePaoo/vacuoleblog](https://github.com/VacuolePaoo/vacuoleblog) |
| 侧边栏天气 | 落尘UP | [Kemeow815/blog-v3](https://github.com/Kemeow815/blog-v3) |
| 60S看世界、天气预报、侧边栏历史今天 | 60s | [vikiboss/60s](https://github.com/vikiboss/60s) |
| B站热门 | API | - |
| 侧边栏最新评论 | 梦爱吃鱼 | [Kemeow815/blog-v3](https://github.com/Kemeow815/blog-v3) |

### 魔改基础部分

| 魔改来源 | 来源仓库 |
|---|---|
| ATao-Blog | [ataoyan](https://github.com/ataoyan) |

## 📄 许可证

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 许可证。

## 🙏 致谢

- 感谢 [纸鹿大佬](https://github.com/L33Z22L11/blog-v3) 提供的开源项目
- 感谢所有为这个项目贡献代码和建议的开发者
- 感谢 [Nuxt.js](https://nuxt.com/) 团队提供优秀的框架

---

> 如果这个项目对你有帮助，不妨给个 ⭐ Star 支持一下！