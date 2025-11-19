# 🚀 Rikas N8N 集成 - 快速索引

## 📁 目录结构

```
n8n/
├── README.md                    # 项目概述
├── DEPLOYMENT-CHECKLIST.md     # 📋 部署检查清单（⭐ 从这里开始）
├── QUICKSTART.md                # ⚡ N8N 快速启动指南
├── integration-guide.md         # 📖 详细集成步骤
├── feishu-webhook-config.md     # 🔧 飞书配置指南
├── feishu-card-preview.md       # 🎨 飞书卡片效果预览
├── .env.example                 # 🔐 环境变量模板
├── docker-compose.yml           # 🐳 Docker 编排配置
├── test-webhook.ps1             # 🧪 测试脚本
└── trial-workflow.json          # 📊 N8N 工作流配置
```

---

## 🎯 快速开始（5分钟部署）

### 1️⃣ 启动 N8N（1分钟）
```powershell
cd e:\webflow\n8n
docker-compose up -d
```

### 2️⃣ 配置飞书机器人（2分钟）
1. 在飞书群组中添加自定义机器人
2. 复制 Webhook URL
3. 参考 `feishu-webhook-config.md`

### 3️⃣ 导入工作流（1分钟）
1. 访问 http://localhost:5678
2. 导入 `trial-workflow.json`
3. 配置飞书 Webhook URL
4. 激活工作流

### 4️⃣ 测试（1分钟）
```powershell
.\test-webhook.ps1
```

---

## 📚 文档使用指南

### 🆕 首次部署
**按顺序阅读：**
1. ✅ **DEPLOYMENT-CHECKLIST.md** - 完整的部署清单
2. ✅ **QUICKSTART.md** - N8N 启动步骤
3. ✅ **feishu-webhook-config.md** - 飞书配置
4. ✅ **integration-guide.md** - 集成详细步骤

### 🔍 查找问题
**根据问题类型查看：**
- ❓ N8N 启动问题 → `QUICKSTART.md`
- ❓ 飞书配置问题 → `feishu-webhook-config.md`
- ❓ 集成流程问题 → `integration-guide.md`
- ❓ 卡片样式问题 → `feishu-card-preview.md`

### 🛠️ 日常运维
**常用操作：**
- 🔄 重启服务 → `QUICKSTART.md`
- 🧪 测试功能 → 运行 `test-webhook.ps1`
- 📊 查看日志 → `docker logs -f rikas-n8n`
- 📋 健康检查 → `DEPLOYMENT-CHECKLIST.md` 验收部分

---

## 🔑 关键文件说明

### trial-workflow.json
**用途：** N8N 工作流配置文件
**包含：** 
- Webhook 接收节点
- 数据格式化节点
- 飞书发送节点
- 响应处理节点

**如何使用：**
1. 在 N8N 中导入此文件
2. 配置环境变量
3. 激活工作流

---

### docker-compose.yml
**用途：** Docker 服务编排配置
**配置项：**
- 端口映射：5678:5678
- 数据持久化：n8n_data
- 环境变量：时区、认证等

**如何使用：**
```powershell
# 启动
docker-compose up -d

# 停止
docker-compose down

# 重启
docker-compose restart

# 查看日志
docker-compose logs -f
```

---

### test-webhook.ps1
**用途：** 自动化测试脚本
**功能：**
- ✅ 检查 N8N 服务状态
- ✅ 发送测试数据
- ✅ 显示响应结果
- ✅ 错误诊断提示

**如何使用：**
```powershell
cd e:\webflow\n8n
.\test-webhook.ps1
```

---

### .env.example
**用途：** 环境变量模板
**包含：**
- FEISHU_WEBHOOK_URL
- N8N_WEBHOOK_URL
- 认证配置
- CORS 设置

**如何使用：**
```powershell
# 复制模板
copy .env.example .env

# 编辑配置
notepad .env

# 重启服务使配置生效
docker-compose restart
```

---

## ⚙️ 核心配置项

### 必须配置
| 配置项 | 位置 | 说明 |
|--------|------|------|
| 飞书 Webhook URL | N8N 工作流 或 环境变量 | 接收通知的飞书群组机器人地址 |
| N8N Webhook Path | trial-workflow.json | 固定为 `trial-application` |
| 前端 API 地址 | apply-trial.html | N8N Webhook 完整 URL |

### 可选配置
| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| N8N 管理员密码 | changeme123 | 建议修改为强密码 |
| CORS 来源 | * | 生产环境应限制为具体域名 |
| 时区 | Asia/Shanghai | 影响时间戳显示 |

---

## 🎨 飞书卡片自定义

### 修改颜色主题
在 `trial-workflow.json` 中找到：
```json
"header": {
  "template": "blue"  // 可选: blue, green, red, orange, purple
}
```

### 添加更多字段
在 Code 节点中添加：
```javascript
{
  is_short: true,
  text: {
    tag: "lark_md",
    content: `**行业:**\n${formData.industry || '未填写'}`
  }
}
```

### 自定义按钮
```javascript
{
  tag: "button",
  text: {
    tag: "plain_text",
    content: "拨打电话"
  },
  type: "danger",
  url: `tel:${formData.phone}`
}
```

---

## 🔧 常用命令速查

### Docker 操作
```powershell
# 查看运行状态
docker ps

# 查看日志（实时）
docker logs -f rikas-n8n

# 重启容器
docker restart rikas-n8n

# 进入容器
docker exec -it rikas-n8n /bin/sh

# 查看资源占用
docker stats rikas-n8n

# 清理资源
docker system prune
```

### N8N 操作
```powershell
# 访问管理界面
start http://localhost:5678

# 查看执行历史
start http://localhost:5678/executions

# 备份工作流
# 在 N8N UI 中导出为 JSON

# 重置密码
# 进入容器后执行相关命令
```

### 测试操作
```powershell
# 运行完整测试
.\test-webhook.ps1

# 测试端口连通性
Test-NetConnection localhost -Port 5678

# 手动发送请求
Invoke-RestMethod -Uri "http://localhost:5678/webhook/trial-application" -Method Post -Body '{"test":"data"}' -ContentType "application/json"
```

---

## 📊 数据流程图

```
用户填写表单 (apply-trial.html)
        ↓
    点击提交
        ↓
JavaScript 发送 POST 请求
        ↓
N8N Webhook 节点接收 (trial-application)
        ↓
Code 节点格式化数据为飞书卡片
        ↓
HTTP Request 节点发送到飞书
        ↓
Respond 节点返回成功/失败
        ↓
前端显示成功消息 / 错误提示
```

---

## 🎯 成功指标

### 功能正常
- ✅ 用户提交表单后看到成功消息
- ✅ 飞书群组在 5 秒内收到卡片通知
- ✅ 卡片信息完整准确
- ✅ 按钮可以正常点击跳转

### 性能达标
- ✅ 响应时间 < 3 秒
- ✅ 成功率 > 99%
- ✅ N8N 内存占用 < 512MB
- ✅ CPU 使用率 < 50%

### 可维护性
- ✅ 有完整的文档
- ✅ 有测试脚本
- ✅ 有监控机制
- ✅ 有错误处理

---

## 🆘 紧急故障处理

### 问题：服务完全无响应
```powershell
# 1. 重启 Docker
Restart-Service docker

# 2. 重启容器
docker restart rikas-n8n

# 3. 查看日志
docker logs rikas-n8n --tail 100

# 4. 如果仍然失败，重新部署
docker-compose down
docker-compose up -d
```

### 问题：飞书无法收到消息
```powershell
# 1. 测试飞书 Webhook
$webhook = "你的Webhook地址"
Invoke-RestMethod -Uri $webhook -Method Post -Body '{"msg_type":"text","content":{"text":"test"}}' -ContentType "application/json"

# 2. 检查 N8N 执行历史
start http://localhost:5678/executions

# 3. 查看具体错误信息
# 在 N8N UI 中点击失败的执行记录
```

---

## 📞 获取帮助

### 查看文档
- N8N 文档: https://docs.n8n.io/
- 飞书开放平台: https://open.feishu.cn/

### 查看日志
```powershell
# N8N 日志
docker logs rikas-n8n

# Docker 系统日志
Get-EventLog -LogName Application -Source Docker -Newest 50
```

### 调试模式
在 docker-compose.yml 中添加：
```yaml
environment:
  - N8N_LOG_LEVEL=debug
```

---

## 🎓 进阶学习

### 扩展功能
- [ ] 集成 CRM 系统（Salesforce/HubSpot）
- [ ] 添加邮件自动回复
- [ ] 接入数据分析平台
- [ ] 实现多语言支持

### 性能优化
- [ ] 使用 PostgreSQL 替代 SQLite
- [ ] 配置 Redis 缓存
- [ ] 实现请求限流
- [ ] 添加 CDN 加速

### 安全加固
- [ ] 启用 HTTPS
- [ ] 配置飞书签名验证
- [ ] 实现 IP 白名单
- [ ] 添加请求日志审计

---

**🎉 恭喜！你已经掌握了 Rikas N8N 集成的所有资料！**

**下一步：**
1. 按照 `DEPLOYMENT-CHECKLIST.md` 完成部署
2. 使用 `test-webhook.ps1` 验证功能
3. 在生产环境上线前进行充分测试

**记住：** 所有文档都在 `e:\webflow\n8n\` 目录中，随时可以查阅！
