$projectPath = "f:\project animation\ezgif-5fd007b9e9277887-jpg\dine-epay"
$outFilePath = "$projectPath\Main_Index_Code_Blackbook.txt"

# Only include main entry/index equivalent files
$files = Get-ChildItem -Path $projectPath -Recurse -File | Where-Object { 
    ($_.Name -eq "page.tsx" -or 
     $_.Name -eq "layout.tsx" -or 
     $_.Name -eq "route.ts" -or 
     $_.Name -eq "schema.prisma" -or 
     $_.Name -eq "middleware.ts" -or
     $_.Name -eq "globals.css") -and
    $_.DirectoryName -notmatch "\\node_modules" -and 
    $_.DirectoryName -notmatch "\\\.next" -and
    $_.DirectoryName -notmatch "\\\.git" -and
    $_.DirectoryName -notmatch "\\_app_backup"
}

[System.IO.File]::WriteAllText($outFilePath, "DINE EPAY - MAIN INDEX SOURCE CODE FOR BLACKBOOK`r`n=================================================`r`nThis file contains only the core Pages, Layouts, APIs, and Schema.`r`n")

foreach ($file in $files) {
    $relPath = $file.FullName.Substring($projectPath.Length + 1)
    
    $header = "`r`n`r`n" + ("=" * 80) + "`r`nFILE: $relPath`r`n" + ("=" * 80) + "`r`n"
    [System.IO.File]::AppendAllText($outFilePath, $header)
    
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        [System.IO.File]::AppendAllText($outFilePath, $content)
    }
    catch {
        [System.IO.File]::AppendAllText($outFilePath, "[Error reading file content]`r`n")
    }
}

Write-Host "Index Code Generated at: $outFilePath"
