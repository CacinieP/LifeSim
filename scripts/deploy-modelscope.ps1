param(
  [Parameter(Mandatory = $true)]
  [string]$Token,
  [string]$Owner = "Cacinie",
  [string]$Repo = "LifeSim"
)

$ErrorActionPreference = "Stop"
$remote = "https://oauth2:$Token@www.modelscope.cn/studios/$Owner/$Repo.git"

git remote remove modelscope 2>$null
git remote add modelscope $remote
git fetch modelscope master 2>$null
git merge modelscope/master --allow-unrelated-histories -m "Merge ModelScope remote" 2>$null

git add README.md Dockerfile docker.yaml app.py start.sh vite.config.ts .dockerignore
git update-index --chmod=+x start.sh 2>$null
git diff --staged --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "chore: sync Docker studio deployment config"
}

git push -u modelscope HEAD:master
if ($LASTEXITCODE -ne 0) {
  throw "git push 失败"
}

Write-Host "[LifeSim] 触发 Docker 创空间部署..."
$deploy = curl.exe -s -X POST `
  "https://modelscope.cn/openapi/v1/studios/$Owner/$Repo/deploy" `
  -H "Authorization: Bearer $Token" `
  -H "Content-Type: application/json"
Write-Host $deploy

Write-Host ""
Write-Host "已推送到 https://www.modelscope.cn/studios/$Owner/$Repo/summary"
Write-Host "请到「构建日志」等待 docker build 完成（约 3-5 分钟），再访问体验页。"
