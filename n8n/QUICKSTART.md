# N8N 快速启动指南

## 方法 1: 使用 Docker Compose（推荐）

### 1. 启动 N8N
```powershell
cd e:\webflow\n8n
docker-compose up -d
```

### 2. 检查运行状态
```powershell
docker-compose ps
```

### 3. 查看日志
```powershell
docker-compose logs -f n8n
```

### 4. 停止服务
```powershell
docker-compose down
```

## 方法 2: 使用 Docker 命令

### 启动 N8N
```powershell
docker run -d `
  --name rikas-n8n `
  -p 5678:5678 `
  -e N8N_BASIC_AUTH_ACTIVE=true `
  -e N8N_BASIC_AUTH_USER=admin `
  -e N8N_BASIC_AUTH_PASSWORD=changeme123 `
  -e GENERIC_TIMEZONE=Asia/Shanghai `
  -e TZ=Asia/Shanghai `
  -e WEBHOOK_URL=http://localhost:5678/ `
  -v n8n_data:/home/node/.n8n `
  n8nio/n8n:latest
```

### 检查状态
```powershell
docker ps | Select-String "rikas-n8n"
```

### 查看日志
```powershell
docker logs -f rikas-n8n
```

### 停止容器
```powershell
docker stop rikas-n8n
docker rm rikas-n8n
```

## 访问 N8N

1. 打开浏览器访问: http://localhost:5678
2. 首次访问会要求设置账号密码（如果没启用基础认证）
3. 或使用基础认证：
   - 用户名: admin
   - 密码: changeme123

## 导入工作流

### 方式 1: 通过 UI 导入
1. 登录 N8N
2. 点击左上角菜单
3. 选择 "Import from File"
4. 选择 `trial-workflow.json`
5. 点击 "Import"

### 方式 2: 使用 API 导入（高级）
```powershell
$workflow = Get-Content "trial-workflow.json" -Raw
Invoke-RestMethod -Uri "http://localhost:5678/api/v1/workflows" `
  -Method Post `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:changeme123"))
  } `
  -Body $workflow
```

## 配置环境变量

### 在 Docker Compose 中配置
编辑 `docker-compose.yml`:
```yaml
environment:
  - FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-token
```

然后重启：
```powershell
docker-compose down
docker-compose up -d
```

### 在运行的容器中配置
```powershell
docker exec -it rikas-n8n /bin/sh
export FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/your-token"
exit
```

## 测试工作流

### 1. 激活工作流
在 N8N UI 中点击工作流右上角的 "Active" 开关

### 2. 运行测试脚本
```powershell
cd e:\webflow\n8n
.\test-webhook.ps1
```

### 3. 检查执行历史
访问: http://localhost:5678/executions

## 常见问题

### Q: 容器启动失败
```powershell
# 检查端口占用
netstat -ano | findstr :5678

# 查看详细错误
docker logs rikas-n8n
```

### Q: 无法访问 5678 端口
- 检查防火墙设置
- 确认 Docker Desktop 正在运行
- 尝试重启 Docker Desktop

### Q: 工作流执行失败
1. 检查 N8N 执行历史
2. 查看具体节点的错误信息
3. 确认飞书 Webhook URL 正确
4. 测试网络连接：
```powershell
Test-NetConnection localhost -Port 5678
```

## 生产环境建议

### 1. 使用持久化存储
确保挂载数据卷，避免数据丢失

### 2. 配置 HTTPS
使用 Nginx/Caddy 反向代理

### 3. 备份工作流
定期导出工作流配置

### 4. 监控告警
配置 N8N 的错误通知

## 相关命令

```powershell
# 进入容器
docker exec -it rikas-n8n /bin/sh

# 重启容器
docker restart rikas-n8n

# 查看资源使用
docker stats rikas-n8n

# 清理未使用的资源
docker system prune -a
```
