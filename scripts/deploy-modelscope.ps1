param(
  [Parameter(Mandatory = $true)]
  [string]$Token
)

$remote = "https://oauth2:$Token@www.modelscope.cn/studios/Cacinie/LifeSim.git"

git remote remove modelscope 2>$null
git remote add modelscope $remote
git push modelscope HEAD:master --force

Write-Host "已推送到 ModelScope 创空间。"
Write-Host "请打开 https://www.modelscope.cn/studios/Cacinie/LifeSim/summary"
Write-Host "1. 确认设置中 SDK 类型为 Static（与 README 一致）"
Write-Host "2. 点击「部署」或「重启空间展示」"
Write-Host "3. 在构建日志中确认 npm run build 成功后再访问"
