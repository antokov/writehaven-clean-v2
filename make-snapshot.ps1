param(
  [string]$OutFile = "code-snapshot.md",
  [int]$MaxKB = 150
)

$root = Get-Location
$project = Split-Path -Leaf $root

function WriteLine($text="") {
  $text | Out-File -FilePath $OutFile -Append -Encoding utf8
}

function IsExcludedFile($path) {
  $name = [System.IO.Path]::GetFileName($path)
  $ext  = [System.IO.Path]::GetExtension($path).ToLowerInvariant()

  $excludeDirs  = @('node_modules','.git','dist','build','.venv','venv','__pycache__','.idea','.vscode','coverage','.cache','.next','.turbo')
  $excludeFiles = @('package-lock.json','yarn.lock','pnpm-lock.yaml','app.db','*.sqlite','*.sqlite3','.env*','*.png','*.jpg','*.jpeg','*.gif','*.webp','*.ico','*.pdf','*.ttf','*.otf','*.woff','*.woff2','*.zip')

  foreach($d in $excludeDirs)  { if ($path -like "*\$d\*") { return $true } }
  foreach($f in $excludeFiles) { if ($name -like $f)      { return $true } }

  $whitelistExt = @('.js','.jsx','.ts','.tsx','.json','.css','.scss','.md','.yml','.yaml','.html','.py','.txt','.sql','.ini','.toml','.cfg','.conf','.bat','.ps1')
  if ($whitelistExt -notcontains $ext) { return $true }

  return $false
}

$map = @{
  '.js'='javascript'; '.jsx'='jsx'; '.ts'='ts'; '.tsx'='tsx'; '.json'='json';
  '.css'='css'; '.scss'='scss'; '.md'='markdown'; '.yml'='yaml'; '.yaml'='yaml';
  '.html'='html'; '.py'='python'; '.txt'='text'; '.sql'='sql'; '.ini'='ini';
  '.bat'='bat'; '.ps1'='powershell'; '.toml'='toml'; '.cfg'='ini'; '.conf'='ini'
}

# Header
$header = "<!-- Generated " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + " -->`n# " + $project + " - Code Snapshot`n"
Set-Content -Path $OutFile -Value $header -Encoding utf8

WriteLine "## Projektstruktur"
WriteLine '```'
$tree = & cmd /c "tree /F /A"
WriteLine $tree
WriteLine '```'
WriteLine ""

WriteLine "## Dateien"
WriteLine ""

Get-ChildItem -Recurse -File | Sort-Object FullName | ForEach-Object {
  $full = $_.FullName
  if (IsExcludedFile $full) { return }

  $rel   = $full.Substring($root.Path.Length + 1)
  $ext   = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
  $lang  = $map[$ext]; if (-not $lang) { $lang = "" }
  $sizeKB = [int][math]::Ceiling($_.Length / 1KB)

  # Inline-Code: zwei Backticks schreiben einen echten Backtick
  WriteLine ("### ``" + $rel + "``")

  if ($sizeKB -gt $MaxKB) {
    WriteLine ("_Datei groesser als " + $MaxKB + " KB, ausgelassen._")
    WriteLine ""
  } else {
    WriteLine ('```' + $lang)
    Get-Content -Raw -Encoding utf8 $full | Out-File -FilePath $OutFile -Append -Encoding utf8
    WriteLine '```'
    WriteLine ""
  }
}

Write-Host ("Fertig: " + $OutFile)
