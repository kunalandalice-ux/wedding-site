# Simple PowerShell HTTP server for the wedding site
$port = 3456
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port"

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.png'  = 'image/png'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.woff2'= 'font/woff2'
}

while ($listener.IsListening) {
  $ctx  = $listener.GetContext()
  $req  = $ctx.Request
  $resp = $ctx.Response

  $urlPath = $req.Url.AbsolutePath
  if ($urlPath -eq '/' -or $urlPath -eq '') { $urlPath = '/index.html' }
  $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

  if (Test-Path $filePath -PathType Leaf) {
    $ext  = [System.IO.Path]::GetExtension($filePath).ToLower()
    $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $resp.ContentType   = $mime
    $resp.ContentLength64 = $bytes.Length
    $resp.StatusCode    = 200
    $resp.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $resp.StatusCode = 404
    $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    $resp.ContentLength64 = $body.Length
    $resp.OutputStream.Write($body, 0, $body.Length)
  }
  $resp.OutputStream.Close()
}
