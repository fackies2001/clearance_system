@echo off
start "Caddy" cmd /k "cd /d D:\clearance_system && caddy.exe run"
timeout /t 2
start "Laravel" cmd /k "cd /d D:\clearance_system && php artisan serve --host=127.0.0.1 --port=8001"
timeout /t 2
start "Vite" cmd /k "cd /d D:\clearance_system && npm run dev"