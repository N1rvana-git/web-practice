# N8N Webhook 测试脚本
# 用于测试 N8N 工作流是否正常工作

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Rikas N8N Webhook 测试工具" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 配置
$N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/trial-application"

# 测试数据
$testData = @{
    firstName = "张"
    lastName = "三"
    workEmail = "zhangsan@example.com"
    company = "测试科技有限公司"
    jobTitle = "产品经理"
    phone = "13800138000"
    teamSize = "11-50"
    agree = $true
    subscribe = $true
    timestamp = (Get-Date -Format "o")
    source = "test-script"
    page = "apply-trial"
} | ConvertTo-Json -Depth 10

Write-Host "测试配置:" -ForegroundColor Yellow
Write-Host "  Webhook URL: $N8N_WEBHOOK_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "测试数据:" -ForegroundColor Yellow
Write-Host $testData -ForegroundColor Gray
Write-Host ""

# 检查 N8N 是否运行
Write-Host "正在检查 N8N 服务状态..." -ForegroundColor Yellow
try {
    $n8nCheck = Invoke-WebRequest -Uri "http://localhost:5678" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ N8N 服务正在运行" -ForegroundColor Green
} catch {
    Write-Host "❌ 无法连接到 N8N 服务" -ForegroundColor Red
    Write-Host "   请确保：" -ForegroundColor Yellow
    Write-Host "   1. Docker Desktop 正在运行" -ForegroundColor Gray
    Write-Host "   2. N8N 容器已启动" -ForegroundColor Gray
    Write-Host "   3. N8N 运行在 http://localhost:5678" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "正在发送测试请求到 N8N Webhook..." -ForegroundColor Yellow

try {
    # 发送 POST 请求
    $response = Invoke-RestMethod -Uri $N8N_WEBHOOK_URL `
        -Method Post `
        -Body $testData `
        -ContentType "application/json" `
        -TimeoutSec 30
    
    Write-Host ""
    Write-Host "✅ 请求成功!" -ForegroundColor Green
    Write-Host ""
    Write-Host "N8N 响应:" -ForegroundColor Yellow
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
    Write-Host ""
    Write-Host "请检查:" -ForegroundColor Cyan
    Write-Host "  1. 飞书群组是否收到通知卡片" -ForegroundColor Gray
    Write-Host "  2. N8N 执行历史 (http://localhost:5678/executions)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ 请求失败!" -ForegroundColor Red
    Write-Host ""
    Write-Host "错误信息:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        Write-Host "HTTP 状态码: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
        Write-Host "状态描述: $($_.Exception.Response.StatusDescription)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "排查建议:" -ForegroundColor Cyan
    Write-Host "  1. 检查 N8N 工作流是否已激活 (Active)" -ForegroundColor Gray
    Write-Host "  2. 确认 Webhook 路径是否为 'trial-application'" -ForegroundColor Gray
    Write-Host "  3. 查看 N8N 执行历史中的错误信息" -ForegroundColor Gray
    Write-Host "  4. 检查飞书 Webhook URL 是否配置正确" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
