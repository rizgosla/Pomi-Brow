# Exports the client's Illustrator EPS logos to SVG and PNG using Illustrator's COM automation.
# Illustrator opens briefly while this runs. Requires Adobe Illustrator installed on this machine.
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts/export-logo.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$mediaDir = Join-Path $root "MEDIA"
$brandDir = Join-Path $root "src\assets\brand"
$publicDir = Join-Path $root "public"
New-Item -ItemType Directory -Force $brandDir | Out-Null
New-Item -ItemType Directory -Force $publicDir | Out-Null

$jobs = @(
  @{ eps = "Pomi-B-Logo-Black.eps"; svg = "logo-black.svg"; png = "logo-black.png" },
  @{ eps = "Pomi-B-Logo-White.eps"; svg = "logo-white.svg"; png = "logo-white.png" }
)

$app = New-Object -ComObject Illustrator.Application
$app.UserInteractionLevel = -1  # aiDONTDISPLAYALERTS

# Close anything left open from a previous run without saving.
while ($app.Documents.Count -gt 0) { $app.Documents.Item(1).Close(2) }

function Set-Opt($obj, $name, $value) {
  try { $obj.$name = $value } catch { Write-Host "  (skipped option $name)" }
}

foreach ($j in $jobs) {
  $epsPath = Join-Path $mediaDir $j.eps
  Write-Host "Opening $epsPath"
  $doc = $app.Open($epsPath)

  # SVG export
  $svgOpts = New-Object -ComObject Illustrator.ExportOptionsSVG
  Set-Opt $svgOpts "EmbedRasterImages" $false
  Set-Opt $svgOpts "FontType" 3            # aiSVGOutlineFont
  Set-Opt $svgOpts "CSSProperties" 2       # style attributes
  Set-Opt $svgOpts "DocumentEncoding" 3    # UTF-8
  Set-Opt $svgOpts "CoordinatePrecision" 3
  Set-Opt $svgOpts "DTD" 6                 # SVG 1.1
  $svgOut = Join-Path $brandDir $j.svg
  $doc.Export($svgOut, 3, $svgOpts)   # 3 = aiSVG
  Write-Host "Wrote $svgOut"

  # PNG export at 4x for a crisp raster fallback
  $pngOpts = New-Object -ComObject Illustrator.ExportOptionsPNG24
  $pngOpts.Transparency = $true
  $pngOpts.ArtBoardClipping = $true
  $pngOpts.AntiAliasing = $true
  $pngOpts.HorizontalScale = 400
  $pngOpts.VerticalScale = 400
  $pngOut = Join-Path $brandDir $j.png
  $doc.Export($pngOut, 5, $pngOpts)   # 5 = aiPNG24
  Write-Host "Wrote $pngOut"

  $doc.Close(2)  # aiDONOTSAVECHANGES
}

$app.Quit()
Write-Host "Done."
