rem Kaanh Server
@echo off
echo ���� nginx.exe ���Ժ�...
echo ������
echo ��ʼ����
cd /d %~dp0
start /min  nginx.exe 
echo 
Pause
taskkill /f /im 