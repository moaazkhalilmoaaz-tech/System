# Quick Deployment Script for Onyx System / aLhaitham-system
param (
    [string]$CommitMessage = "Update project"
)

Write-Host "[1/3] Adding changes to Git..." -ForegroundColor Cyan
& "C:\Program Files\Git\cmd\git.exe" add .

Write-Host "[2/3] Committing and pushing to GitHub..." -ForegroundColor Cyan
& "C:\Program Files\Git\cmd\git.exe" commit -m "$CommitMessage"
& "C:\Program Files\Git\cmd\git.exe" push origin main

Write-Host "[3/3] Pulling changes on VPS server and restarting PM2 process..." -ForegroundColor Cyan
ssh root@204.10.162.176 "cd /root/System && git pull origin main && pm2 restart onyx-system"

Write-Host "Deployment completed successfully!" -ForegroundColor Green
