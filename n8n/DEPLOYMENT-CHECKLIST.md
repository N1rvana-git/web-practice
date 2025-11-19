# Rikas 试用申请 - N8N 集成部署清单

## 📋 部署前准备

### 环境要求
- [ ] Docker Desktop 已安装并运行
- [ ] PowerShell 5.1 或更高版本
- [ ] 网络可以访问飞书 API
- [ ] 浏览器（Chrome/Edge/Firefox）

### 飞书配置
- [ ] 已创建飞书群组
- [ ] 已在群组中添加自定义机器人
- [ ] 已获取飞书 Webhook URL
- [ ] 已配置安全设置（签名/IP/关键词）

---

## 🚀 部署步骤

### 第一步：启动 N8N 服务

#### 选项 A: 使用 Docker Compose（推荐）
```powershell
cd e:\webflow\n8n
docker-compose up -d
```

**验证点:**
- [ ] 容器状态为 `Up`
- [ ] 可以访问 http://localhost:5678
- [ ] 日志无错误信息

#### 选项 B: 使用 Docker 命令
```powershell
docker run -d --name rikas-n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n:latest
```

**验证点:**
- [ ] 容器正在运行: `docker ps`
- [ ] 可以访问 http://localhost:5678

---

### 第二步：配置 N8N

1. **首次登录**
   - [ ] 访问 http://localhost:5678
   - [ ] 创建管理员账号（或使用基础认证）
   - [ ] 完成初始设置

2. **导入工作流**
   - [ ] 点击左上角菜单
   - [ ] 选择 "Import from File"
   - [ ] 选择 `trial-workflow.json`
   - [ ] 确认导入成功

3. **配置环境变量**
   
   **方法 1: 在 docker-compose.yml 中配置**
   ```yaml
   environment:
     - FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-token
   ```
   然后重启: `docker-compose restart`
   
   **方法 2: 直接在工作流中配置**
   - [ ] 点击 "发送到飞书" 节点
   - [ ] 在 URL 字段中直接粘贴飞书 Webhook URL
   - [ ] 保存修改

4. **激活工作流**
   - [ ] 点击工作流右上角的 "Inactive" 开关
   - [ ] 状态变为 "Active" (绿色)
   - [ ] 确认 Webhook 节点显示 Production URL

5. **获取 Webhook URL**
   - [ ] 点击 "Webhook 接收试用申请" 节点
   - [ ] 复制 Production URL
   - [ ] 格式应为: `http://localhost:5678/webhook/trial-application`

---

### 第三步：更新前端代码

**apply-trial.html 已自动更新**
- [ ] 确认文件中的 `N8N_WEBHOOK_URL` 配置正确
- [ ] 开发环境: `http://localhost:5678/webhook/trial-application`
- [ ] 生产环境: `https://n8n.yourdomain.com/webhook/trial-application`

**如需修改 Webhook URL:**
```javascript
// 在 apply-trial.html 的 <script> 标签中找到这一行
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/trial-application';
```

---

### 第四步：测试集成

#### 测试 1: 使用测试脚本
```powershell
cd e:\webflow\n8n
.\test-webhook.ps1
```

**期望结果:**
- [ ] 脚本显示 "✅ 请求成功!"
- [ ] 飞书群组收到测试卡片
- [ ] N8N 执行历史显示成功记录

**故障排查:**
如果失败，检查：
- [ ] N8N 服务是否运行
- [ ] 工作流是否已激活
- [ ] 飞书 Webhook URL 是否正确
- [ ] 网络连接是否正常

#### 测试 2: 使用网页表单
1. **打开试用页面**
   - [ ] 在浏览器中打开 `e:\webflow\apply-trial.html`
   - [ ] 或访问部署后的网站

2. **填写测试数据**
   ```
   姓: 测试
   名: 用户
   工作邮箱: test@example.com
   公司名称: 测试科技有限公司
   职位: 产品经理
   电话: 13800138000
   团队规模: 11-50
   ✅ 同意服务条款
   ```

3. **提交表单**
   - [ ] 点击 "开始 7 天免费试用"
   - [ ] 页面显示成功消息
   - [ ] 控制台无错误信息

4. **验证结果**
   - [ ] 飞书群组收到通知卡片
   - [ ] 卡片信息与提交内容一致
   - [ ] N8N 执行历史显示成功

#### 测试 3: 检查 N8N 执行历史
1. **访问执行历史**
   - [ ] 打开 http://localhost:5678/executions
   - [ ] 查看最新的执行记录

2. **检查每个节点**
   - [ ] Webhook 接收试用申请: 数据正确接收
   - [ ] 格式化为飞书卡片: JSON 格式正确
   - [ ] 发送到飞书: HTTP 200 响应
   - [ ] 返回成功响应: 返回 success: true

---

## ✅ 验收标准

### 功能验收
- [ ] 表单提交后页面显示成功消息
- [ ] 飞书群组在 5 秒内收到通知
- [ ] 卡片格式美观，信息完整
- [ ] 按钮链接可以正常点击
- [ ] 错误情况有友好提示

### 数据完整性
- [ ] 姓名正确显示
- [ ] 邮箱正确显示
- [ ] 公司名称正确显示
- [ ] 职位正确显示
- [ ] 电话号码正确显示
- [ ] 团队规模正确转换
- [ ] 时间戳使用北京时间
- [ ] 订阅状态正确显示

### 性能要求
- [ ] 表单提交响应时间 < 3 秒
- [ ] 飞书通知延迟 < 5 秒
- [ ] N8N CPU 使用率 < 50%
- [ ] 内存占用 < 512MB

### 安全性
- [ ] 飞书 Webhook 已启用安全验证
- [ ] N8N 管理界面有密码保护
- [ ] 敏感数据不在日志中明文显示
- [ ] CORS 配置合理（生产环境）

---

## 🔧 故障排查清单

### 问题 1: 表单提交无响应
**症状:** 点击提交按钮后无任何反应

**检查项:**
- [ ] 打开浏览器控制台查看错误信息
- [ ] 确认 N8N_WEBHOOK_URL 配置正确
- [ ] 检查 N8N 服务是否运行: `docker ps`
- [ ] 尝试直接访问: http://localhost:5678

**解决方案:**
```powershell
# 重启 N8N 服务
docker restart rikas-n8n

# 查看 N8N 日志
docker logs -f rikas-n8n
```

---

### 问题 2: 飞书未收到通知
**症状:** 表单提交成功，但飞书群组无消息

**检查项:**
- [ ] 飞书 Webhook URL 是否正确
- [ ] 飞书机器人是否启用
- [ ] 消息是否满足安全设置（关键词/IP）
- [ ] N8N 执行历史是否有错误

**测试方法:**
```powershell
# 直接测试飞书 Webhook
$webhook = "你的飞书Webhook地址"
$body = @{
    msg_type = "text"
    content = @{
        text = "测试消息"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri $webhook -Method Post -Body $body -ContentType "application/json"
```

---

### 问题 3: CORS 错误
**症状:** 浏览器控制台显示 "CORS policy" 错误

**解决方案:**
在 docker-compose.yml 中添加：
```yaml
environment:
  - N8N_WEBHOOK_CORS_ALLOWED_ORIGINS=*
```

然后重启: `docker-compose restart`

---

### 问题 4: N8N 执行失败
**症状:** N8N 执行历史显示红色错误

**检查步骤:**
1. [ ] 点击失败的执行记录
2. [ ] 查看具体哪个节点失败
3. [ ] 阅读错误信息
4. [ ] 根据错误类型处理

**常见错误:**
- **网络超时**: 检查网络连接
- **JSON 解析错误**: 检查数据格式
- **401/403 错误**: 检查飞书 Webhook 配置
- **500 错误**: 查看 N8N 日志

---

## 📊 监控建议

### 日常监控
- [ ] 每日检查 N8N 执行历史
- [ ] 每周查看成功率统计
- [ ] 每月检查 Docker 容器资源占用

### 告警设置
在 N8N 中可以设置：
- [ ] 执行失败时发送邮件通知
- [ ] 发送另一个飞书通知到运维群
- [ ] 记录到日志文件

### 数据备份
- [ ] 定期导出工作流配置
- [ ] 备份 Docker 数据卷
- [ ] 保存重要的执行记录

---

## 🎯 优化建议

### 短期优化（1-2周）
- [ ] 添加数据验证逻辑
- [ ] 优化飞书卡片样式
- [ ] 增加错误重试机制
- [ ] 实现表单数据持久化

### 中期优化（1-2月）
- [ ] 集成 CRM 系统
- [ ] 自动发送欢迎邮件
- [ ] 添加数据分析报表
- [ ] 实现多渠道通知（邮件+飞书）

### 长期优化（3-6月）
- [ ] 使用 PostgreSQL 数据库
- [ ] 部署到生产服务器
- [ ] 配置 HTTPS 和 CDN
- [ ] 实现 A/B 测试

---

## 📞 支持资源

### 文档链接
- N8N 官方文档: https://docs.n8n.io/
- 飞书开放平台: https://open.feishu.cn/
- Docker 文档: https://docs.docker.com/

### 常用命令
```powershell
# N8N 管理
docker ps                           # 查看容器状态
docker logs -f rikas-n8n            # 查看实时日志
docker restart rikas-n8n            # 重启服务
docker exec -it rikas-n8n /bin/sh   # 进入容器

# 测试命令
.\test-webhook.ps1                  # 运行测试脚本
Test-NetConnection localhost -Port 5678  # 测试端口

# 清理命令
docker-compose down                 # 停止所有服务
docker system prune                 # 清理未使用资源
```

---

## ✨ 完成检查

部署完成后，确认以下所有项都已完成：

### 基础功能
- [ ] N8N 服务正常运行
- [ ] 工作流已导入并激活
- [ ] 飞书机器人配置正确
- [ ] 前端代码已更新
- [ ] 测试脚本运行成功
- [ ] 网页表单测试通过

### 文档资料
- [ ] 已阅读所有配置文档
- [ ] 已保存重要的 URL 和密钥
- [ ] 已记录部署步骤和配置
- [ ] 已建立故障排查流程

### 团队交接
- [ ] 相关人员已培训
- [ ] 飞书群组已添加相关成员
- [ ] 监控和告警已设置
- [ ] 备份策略已确定

---

**恭喜！🎉 Rikas 试用申请 N8N 集成部署完成！**

如有任何问题，请参考：
1. `integration-guide.md` - 详细集成指南
2. `feishu-webhook-config.md` - 飞书配置说明
3. `QUICKSTART.md` - N8N 快速启动
4. `feishu-card-preview.md` - 卡片消息预览
