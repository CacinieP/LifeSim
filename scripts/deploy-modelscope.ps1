param(
  [Parameter(Mandatory = $true)]
  [string]$Token,
  [string]$Owner = "Cacinie",
  [string]$Repo = "LifeSim"
)

$ErrorActionPreference = "Stop"
$remote = "https://oauth2:$Token@www.modelscope.cn/studios/$Owner/$Repo.git"

Write-Host "[LifeSim] 使用 MODELSCOPE=true 构建前端..."
$env:MODELSCOPE = "true"
npm run build
if (-not (Test-Path "dist/index.html")) {
  throw "dist/index.html 不存在，构建失败"
}

git remote remove modelscope 2>$null
git remote add modelscope $remote
git fetch modelscope master 2>$null
git merge modelscope/master --allow-unrelated-histories -m "Merge ModelScope remote" 2>$null

git add -f dist README.md vite.config.ts
git diff --staged --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "chore: update dist for ModelScope static deploy"
}

git push -u modelscope HEAD:master
if ($LASTEXITCODE -ne 0) {
  throw "git push 失败"
}

Write-Host "[LifeSim] 触发创空间部署 API..."
$deploy = curl.exe -s -X POST `
  "https://modelscope.cn/openapi/v1/studios/$Owner/$Repo/deploy" `
  -H "Authorization: Bearer $Token" `
  -H "Content-Type: application/json"
Write-Host $deploy

Write-Host ""
Write-Host "已推送到 https://www.modelscope.cn/studios/$Owner/$Repo/summary"
Write-Host "Static 模式无构建日志属正常。等待 1-2 分钟后访问体验页。"
