# Rikas Landing (Static Demo)

本仓库包含两个纯静态示例页面：

- `index.html`：带可访问模态框的深色落地页
- `rikas.html`：参照 Intercom 风格的扩展示例（含 Features/CTA/FAQ）

## 本地预览

直接在浏览器打开任意 HTML 文件，或使用 VS Code Live Server 插件。

## 使用 Docker Desktop 运行

1. 在仓库根目录执行构建：

	```powershell
	docker build -t rikas-landing .
	```

2. 启动容器：

	```powershell
	docker run --rm -p 8080:80 rikas-landing
	```

3. 浏览器访问 `http://localhost:8080/` 查看 `index.html`，访问 `http://localhost:8080/rikas.html` 查看扩展页面。

容器基于 `nginx:alpine`，仅打包静态资源，无需额外依赖。
