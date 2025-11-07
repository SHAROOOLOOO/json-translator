# JSON翻译工具

一个功能强大的Web应用，专门用于翻译JSON数据中的文本字段。集成Monaco编辑器、多语言支持和智能翻译服务。

## ✨ 核心特性

- 🚀 **专业编辑器**：集成Monaco编辑器，提供VS Code级别的编辑体验
- 🔄 **实时解析**：输入JSON自动解析字段，300ms防抖优化，无需手动点击
- 🎯 **智能字段选择**：可视化选择要翻译的JSON字段，支持全选/清除操作
- 🌍 **多语言翻译**：四层翻译fallback策略，确保高成功率
- 📝 **实时编辑**：翻译结果可编辑，支持格式化、压缩等操作
- 📋 **智能复制**：多层fallback复制机制，确保各种环境下都能正常工作
- 📱 **响应式布局**：1:1.2黄金比例布局，完美适配不同屏幕尺寸
- ⚡ **高性能**：防抖机制、超时保护、智能缓存优化

## 🌐 翻译服务

### 四层Fallback策略
1. **MyMemory API** - 优先使用，稳定可靠，每天10000次免费额度
2. **Google Translate** - 高质量翻译，5秒超时保护
3. **LibreTranslate** - 开源翻译服务，备用方案
4. **本地词典** - 20+常用词汇，最后备用

### 支持语言
- 🇺🇸 英语 (en)
- 🇨🇳 中文 (zh)
- 🇯🇵 日语 (ja)
- 🇰🇷 韩语 (ko)
- 🇫🇷 法语 (fr)
- 🇩🇪 德语 (de)
- 🇪🇸 西班牙语 (es)
- 🇷🇺 俄语 (ru)
- 🇸🇦 阿拉伯语 (ar)

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

## 📖 使用指南

### 1. 输入JSON数据
在左侧Monaco编辑器中输入JSON数据，支持：
- 手动输入JSON
- 语法高亮和自动格式化
- 实时错误检测

### 2. 自动解析字段
- 系统自动解析JSON结构
- 提取所有字符串字段
- 显示字段路径和预览

### 3. 选择翻译目标
- 勾选需要翻译的字段
- 选择目标语言
- 点击"开始翻译"

### 4. 编辑和导出
- 查看翻译结果
- 实时编辑修正
- 复制最终结果

## 🛠️ 技术栈

```json
{
  "前端": "React 19.1.1 + TypeScript",
  "构建工具": "Vite 7.1.7",
  "样式框架": "Tailwind CSS 4.1.16",
  "编辑器": "Monaco Editor 4.7.0",
  "翻译服务": "MyMemory + Google + LibreTranslate + 本地词典",
  "状态管理": "React Hooks"
}
```

## 🏢 部署方案

### 内网部署
```bash
./start-server.sh
# 访问: http://192.168.90.116:8080
```

### 互联网部署

#### Gitee Pages (推荐国内用户)
```bash
# 优势: 免费、国内访问快
# 地址: https://username.gitee.io/json-translator
```

#### Netlify (最快速)
```bash
# 拖拽dist文件夹即可部署
# 地址: https://xxx.netlify.app
```

#### Vercel (功能强大)
```bash
# Git集成，自动部署
# 地址: https://json-translator.vercel.app
```

## 📊 项目状态

- ✅ **功能完整** - 核心功能全部实现并测试通过
- ✅ **构建成功** - TypeScript编译无错误，生产就绪
- ✅ **翻译验证** - 所有翻译API正常工作
- ✅ **性能优化** - 防抖、缓存、超时保护完善
- ✅ **用户体验** - 智能提示、视觉反馈、错误处理完备

## 📝 示例

### 输入JSON
```json
{
  "user": {
    "name": "张三",
    "bio": "这是一位软件工程师的简介",
    "city": "北京"
  },
  "app": {
    "title": "电商平台",
    "description": "一个在线购物网站",
    "version": "1.0.0"
  }
}
```

### 翻译结果 (英文)
```json
{
  "user": {
    "name": "Zhang San",
    "bio": "This is a profile of a software engineer",
    "city": "Beijing"
  },
  "app": {
    "title": "E-commerce Platform",
    "description": "An online shopping site",
    "version": "1.0.0"
  }
}
```

## ⚠️ 注意事项

1. **翻译限制**：免费翻译服务有每日使用限制
2. **网络要求**：需要网络连接才能使用翻译功能
3. **数据隐私**：翻译数据会发送到第三方翻译服务
4. **JSON格式**：请确保输入有效的JSON格式数据

## 🔧 开发命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 代码检查
npm run lint         # ESLint检查

# 内网部署
./start-server.sh    # 启动内网服务器
```

## 📈 性能数据

- **构建时间**: 741ms
- **包大小**: 225KB (gzip: 72KB)
- **支持并发**: 多字段同时翻译
- **响应时间**: <300ms (防抖优化)

## 🤝 贡献

欢迎提交Issues和Pull Requests来改进项目！

## 📄 许可证

MIT License

---

**最后更新**: 2025-11-07 - TypeScript构建错误修复 + 互联网部署支持 + 阿拉伯语支持 + GitHub部署进展