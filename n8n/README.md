# N8N 集成配置

## 概述
本目录包含 Rikas 网站与 N8N 工作流的集成配置文件。

## 功能
- 申请试用表单提交 → 飞书卡片通知

## 文件说明
- `trial-workflow.json` - N8N 工作流配置（可导入到 N8N）
- `feishu-webhook-config.md` - 飞书 Webhook 配置指南
- `integration-guide.md` - 集成步骤说明

## 快速开始

### 1. 配置 N8N Webhook
1. 在 N8N 中导入 `trial-workflow.json`
2. 启动工作流，获取 Webhook URL
3. 将 Webhook URL 配置到前端代码中

### 2. 配置飞书机器人
1. 在飞书群组中添加自定义机器人
2. 获取 Webhook 地址
3. 在 N8N 工作流中配置飞书 Webhook URL

### 3. 测试
1. 访问申请试用页面
2. 填写表单并提交
3. 检查飞书群组是否收到通知

## 环境变量
```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/trial-application
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-token
```

## 注意事项
- 确保 N8N 服务正在运行
- 网络环境需要能访问飞书 API
- 生产环境建议使用 HTTPS
