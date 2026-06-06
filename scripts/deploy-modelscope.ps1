param(
  [Parameter(Mandatory = $true)]
  [string]$Token
)

$remote = "https://oauth2:$Token@www.modelscope.cn/studios/Cacinie/LifeSim.git"

git remote remove modelscope 2>$null
git remote add modelscope $remote
git push modelscope HEAD:master --force

Write-Host "已推送到 ModelScope 创空间，请在 https://www.modelscope.cn/studios/Cacinie/LifeSim/summary 重启空间。"
