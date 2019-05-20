rem Kaanh Server
@echo off
echo 启动 nginx.exe 请稍后...
echo 清理缓存
echo 开始操作
cd /d %~dp0
start /min  nginx.exe 
echo 
Pause
taskkill /f /im 