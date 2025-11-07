#!/bin/bash

# JSON翻译工具内网服务器启动脚本
echo "🚀 启动JSON翻译工具内网服务器..."

# 检查是否已构建
if [ ! -d "dist" ]; then
    echo "📦 正在构建项目..."
    npm run build
fi

# 进入dist目录
cd dist

# 获取本机IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | head -1 | awk '{print $2}')

# 启动HTTP服务器
echo "✅ 服务器启动成功！"
echo ""
echo "📋 访问地址："
echo "   本机访问: http://localhost:8080"
echo "   内网访问: http://$LOCAL_IP:8080"
echo ""
echo "💡 提示："
echo "   - 确保防火墙允许8080端口"
echo "   - 同事可以通过 http://$LOCAL_IP:8080 访问"
echo "   - 按 Ctrl+C 停止服务器"
echo ""

# 启动Python HTTP服务器
python3 -m http.server 8080