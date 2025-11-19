# N8N 集成步骤指南

## 前置条件
- ✅ Docker Desktop 已安装并运行
- ✅ N8N 已在 Docker 中部署
- ✅ 飞书机器人已创建并获取 Webhook URL

## 步骤 1: 导入工作流到 N8N

### 1.1 访问 N8N 管理界面
```
http://localhost:5678
```

### 1.2 导入工作流
1. 点击左侧菜单 "Workflows"
2. 点击右上角 "Import from File" 或 "Import from URL"
3. 选择 `trial-workflow.json` 文件
4. 点击 "Import"

### 1.3 配置环境变量
在工作流中找到 "发送到飞书" 节点：
1. 点击该节点
2. 在 URL 字段中，确认使用了环境变量：`{{ $env.FEISHU_WEBHOOK_URL }}`
3. 如果没有设置环境变量，可以直接粘贴飞书 Webhook URL

### 1.4 激活工作流
1. 检查所有节点配置无误
2. 点击右上角的 "Active" 切换开关
3. 工作流状态变为绿色 ✅

### 1.5 获取 Webhook URL
1. 点击 "Webhook 接收试用申请" 节点
2. 点击 "Test URL" 或 "Production URL"
3. 复制显示的 URL，格式类似：
   ```
   http://localhost:5678/webhook/trial-application
   ```

## 步骤 2: 配置前端页面

### 2.1 测试 Webhook 连通性
在 PowerShell 中运行：
```powershell
$body = @{
    firstName = "测试"
    lastName = "用户"
    workEmail = "test@example.com"
    company = "测试公司"
    jobTitle = "测试职位"
    phone = "13800138000"
    teamSize = "1-10"
    agree = $true
    subscribe = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/trial-application" -Method Post -Body $body -ContentType "application/json"
```

### 2.2 更新前端代码
已为你准备好更新后的 `apply-trial.html`（见下方文件更新）

关键改动：
```javascript
// 配置 N8N Webhook URL
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/trial-application';

// 表单提交时发送到 N8N
const response = await fetch(N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});
```

## 步骤 3: 测试完整流程

### 3.1 测试清单
- [ ] N8N 工作流已激活
- [ ] 飞书机器人 Webhook 已配置
- [ ] 前端页面已更新
- [ ] 网络连接正常

### 3.2 执行测试
1. 在浏览器中打开 `apply-trial.html`
2. 填写试用申请表单：
   - 姓：测试
   - 名：用户
   - 工作邮箱：test@example.com
   - 公司名称：测试公司
   - 职位：产品经理
   - 电话：13800138000
   - 团队规模：1-10
   - ✅ 勾选同意条款
3. 点击"开始 7 天免费试用"
4. 观察：
   - 页面是否显示成功消息
   - 飞书群组是否收到卡片通知
   - N8N 执行历史是否有记录

### 3.3 检查 N8N 执行历史
1. 在 N8N 界面点击左侧 "Executions"
2. 查看最新的执行记录
3. 检查每个节点的输入输出数据
4. 如有错误，查看错误信息

## 步骤 4: 生产环境部署

### 4.1 CORS 配置
如果前端和 N8N 不在同一域名，需要配置 CORS：

在 Docker 启动 N8N 时添加环境变量：
```yaml
environment:
  - N8N_WEBHOOK_CORS_ALLOWED_ORIGINS=https://your-domain.com
```

### 4.2 HTTPS 配置
生产环境建议使用 HTTPS：
1. 为 N8N 配置反向代理（Nginx/Caddy）
2. 申请 SSL 证书
3. 更新前端 Webhook URL 为 HTTPS 地址

### 4.3 错误处理优化
建议在生产环境添加：
- 失败重试机制
- 错误日志记录
- 备用通知渠道（邮件/短信）

## 步骤 5: 监控和维护

### 5.1 监控项目
- N8N 服务运行状态
- Webhook 调用成功率
- 飞书消息发送成功率
- 响应时间

### 5.2 日志查看
Docker 日志：
```powershell
docker logs n8n-container-name
```

N8N 执行历史：
- 访问 N8N 管理界面
- 查看 Executions 列表
- 分析失败的执行

### 5.3 故障排查
| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 表单提交无响应 | N8N 未运行 | 检查 Docker 容器状态 |
| 飞书未收到消息 | Webhook URL 错误 | 验证飞书 Webhook 配置 |
| CORS 错误 | 跨域配置问题 | 添加 CORS 环境变量 |
| 数据格式错误 | JSON 序列化问题 | 检查前端数据格式 |

## 高级配置

### 数据持久化
添加数据库存储（可选）：
1. 在 N8N 工作流中添加数据库节点
2. 配置 PostgreSQL/MySQL 连接
3. 保存申请记录到数据库

### 多渠道通知
除了飞书，还可以添加：
- 企业微信通知
- 钉钉通知
- 邮件通知
- Slack 通知

### 自动回复
在工作流中添加节点：
1. 发送欢迎邮件给申请者
2. 创建 CRM 记录
3. 触发自动化营销流程

## 相关资源
- [N8N Docker 部署文档](https://docs.n8n.io/hosting/installation/docker/)
- [N8N Webhook 节点文档](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [飞书机器人开发文档](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)
