rem Kaanh Server
@echo off
echo ���� server ���Ժ�...
cd /d %~dp0
start /min  nginx-.exe 
Pause
taskkill /f /im 