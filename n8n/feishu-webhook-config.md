# 飞书 Webhook 配置指南

## 1. 创建飞书自定义机器人

### 步骤 1: 进入飞书群组
1. 打开需要接收通知的飞书群组
2. 点击右上角的设置图标
3. 选择"群设置" → "群机器人"

### 步骤 2: 添加自定义机器人
1. 点击"添加机器人"
2. 选择"自定义机器人"
3. 设置机器人名称：`Rikas 试用申请通知`
4. 设置机器人描述：`接收网站试用申请的通知`
5. （可选）上传机器人头像

### 步骤 3: 配置安全设置
**重要：** 建议启用签名验证以提高安全性

**选项 1: 签名验证（推荐）**
- 启用"签名校验"
- 记录生成的密钥（Secret）
- 在 N8N 工作流中添加签名生成逻辑

**选项 2: IP 白名单**
- 添加你的服务器 IP 地址
- 如果使用 Docker，添加容器的出口 IP

**选项 3: 自定义关键词**
- 设置关键词：`试用申请` 或 `Rikas`
- 消息必须包含关键词才能发送成功

### 步骤 4: 获取 Webhook URL
1. 完成配置后，复制生成的 Webhook 地址
2. 格式类似：`https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. 保存此地址，在 N8N 中使用

## 2. 在 N8N 中配置环境变量

### Docker 环境变量方式
编辑 docker-compose.yml 或在 Docker Desktop 中设置：
```yaml
environment:
  - FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-token
```

### N8N 环境变量界面
1. 登录 N8N 管理界面
2. 进入 Settings → Environment Variables
3. 添加变量：
   - Name: `FEISHU_WEBHOOK_URL`
   - Value: `你的飞书 Webhook 地址`

## 3. 飞书卡片消息格式示例

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "🎉 新的试用申请"
      },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "**姓名:** 张三\n**邮箱:** zhangsan@company.com"
        }
      }
    ]
  }
}
```

## 4. 测试 Webhook

### 使用 PowerShell 测试
```powershell
$webhook = "你的飞书Webhook地址"
$body = @{
    msg_type = "text"
    content = @{
        text = "测试消息 - Rikas 试用申请通知系统"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri $webhook -Method Post -Body $body -ContentType "application/json"
```

### 使用 curl 测试（如果安装了）
```bash
curl -X POST "你的飞书Webhook地址" \
  -H "Content-Type: application/json" \
  -d '{"msg_type":"text","content":{"text":"测试消息"}}'
```

## 5. 常见问题

### Q: 消息发送失败
**A:** 检查：
1. Webhook URL 是否正确
2. 是否满足安全设置要求（关键词、IP 白名单等）
3. N8N 服务器网络是否能访问飞书 API
4. JSON 格式是否正确

### Q: 卡片样式不显示
**A:** 确保：
1. `msg_type` 设置为 `interactive`
2. JSON 结构符合飞书卡片消息规范
3. 查看飞书开放平台文档获取最新格式

### Q: 如何添加签名验证
**A:** 在 N8N 的 Code 节点中添加签名生成逻辑：
```javascript
const crypto = require('crypto');
const timestamp = Math.floor(Date.now() / 1000);
const secret = process.env.FEISHU_SECRET;
const stringToSign = `${timestamp}\n${secret}`;
const sign = crypto.createHmac('sha256', stringToSign)
  .update('')
  .digest('base64');

// 在请求头中添加
headers['X-Lark-Request-Timestamp'] = timestamp;
headers['X-Lark-Request-Nonce'] = 'random-nonce';
headers['X-Lark-Signature'] = sign;
```

## 6. 相关链接
- [飞书开放平台 - 自定义机器人](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)
- [飞书消息卡片搭建工具](https://open.feishu.cn/tool/cardbuilder)
- [N8N 官方文档](https://docs.n8n.io/)
