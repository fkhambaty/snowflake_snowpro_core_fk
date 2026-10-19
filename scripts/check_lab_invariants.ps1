#Requires -Version 5.1
<#
.SYNOPSIS
  Fail if SnowPro Core lab HTML invariants are broken (labs 00-19).

.DESCRIPTION
  - Every docs/lab-XX.html for 00-19 must exist
  - Each existing lab-*.html must contain #interview-drill
  - Each must have at least 4 <details class="drill"> blocks
#>
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$docsDir = Join-Path $repoRoot 'docs'

if (-not (Test-Path -LiteralPath $docsDir)) {
    Write-Error "docs/ not found at $docsDir"
    exit 1
}

$failures = New-Object System.Collections.Generic.List[string]

# --- Labs 00-19 must exist ---
$missing = @()
for ($i = 0; $i -le 19; $i++) {
    $num = '{0:D2}' -f $i
    $path = Join-Path $docsDir "lab-$num.html"
    if (-not (Test-Path -LiteralPath $path)) {
        $missing += "lab-$num.html"
    }
}
if ($missing.Count -gt 0) {
    $failures.Add("Missing lab HTML (expected labs 00-19): $($missing -join ', ')")
}

# --- Every lab-*.html: interview-drill + >=4 drill details ---
$labFiles = Get-ChildItem -LiteralPath $docsDir -Filter 'lab-*.html' -File | Sort-Object Name
if ($labFiles.Count -eq 0) {
    $failures.Add('No docs/lab-*.html files found.')
}

foreach ($file in $labFiles) {
    $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8

    if ($text -notmatch 'id\s*=\s*"interview-drill"|id\s*=\s*''interview-drill''') {
        $failures.Add("$($file.Name): missing #interview-drill")
    }

    # Prefer exact teaching-standard pattern: details class="drill"
    $simple = [regex]::Matches($text, 'details\s+class\s*=\s*"drill"', 'IgnoreCase')
    $count = $simple.Count

    if ($count -eq 0) {
        $drillMatches = [regex]::Matches(
            $text,
            '<details\b[^>]*\bclass\s*=\s*"(?:[^"]*\s)?drill(?:\s[^"]*)?"[^>]*>',
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
        $count = $drillMatches.Count
    }

    if ($count -lt 4) {
        $failures.Add("$($file.Name): fewer than 4 details class=`"drill`" (found $count)")
    }
}

# --- Report ---
Write-Host "Checked $($labFiles.Count) lab HTML file(s) under docs/"
Write-Host "Required range: lab-00.html ... lab-19.html"

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "FAILED lab invariants:" -ForegroundColor Red
    foreach ($f in $failures) {
        Write-Host "  - $f" -ForegroundColor Red
    }
    exit 1
}

Write-Host "OK - all lab invariants passed." -ForegroundColor Green
exit 0
