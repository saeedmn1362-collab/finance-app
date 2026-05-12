$baseUrl = "http://localhost:5000/api"

# =========================
# 1. REGISTER USER
# =========================
Write-Host "REGISTERING USER..."

$uniqueEmail = "testuser_$([guid]::NewGuid().ToString().Substring(0,8))@test.com"

$registerBody = @{
    name = "Auto User"
    email = $uniqueEmail
    password = "123456"
} | ConvertTo-Json

$register = Invoke-RestMethod -Method POST "$baseUrl/auth/register" `
-ContentType "application/json" `
-Body $registerBody

Write-Host "USER CREATED: $uniqueEmail"

# =========================
# 2. LOGIN
# =========================
Write-Host "LOGIN..."

$loginBody = @{
    email = $uniqueEmail
    password = "123456"
} | ConvertTo-Json

$login = Invoke-RestMethod -Method POST "$baseUrl/auth/login" `
-ContentType "application/json" `
-Body $loginBody

$token = $login.token

if (-not $token) {
    throw "Login failed"
}

Write-Host "TOKEN OK"

$headers = @{
    Authorization = "Bearer $token"
}

# =========================
# 3. CREATE ACCOUNT
# =========================
Write-Host "CREATING ACCOUNT..."

$accountBody = @{
    name = "AutoAccount_$([guid]::NewGuid().ToString().Substring(0,6))"
    type = "BANK"
    initialBalance = 1000
} | ConvertTo-Json

$account = Invoke-RestMethod -Method POST "$baseUrl/accounts" `
-Headers $headers `
-ContentType "application/json" `
-Body $accountBody

$accountId = $account.account.id

Write-Host "ACCOUNT ID: $accountId"

# =========================
# 4. INCOME
# =========================
Write-Host "INCOME..."

$incomeBody = @{
    type = "INCOME"
    amount = 500
    accountId = $accountId
    description = "Salary"
} | ConvertTo-Json

Invoke-RestMethod -Method POST "$baseUrl/transactions" `
-Headers $headers `
-ContentType "application/json" `
-Body $incomeBody

# =========================
# 5. EXPENSE
# =========================
Write-Host "EXPENSE..."

$expenseBody = @{
    type = "EXPENSE"
    amount = 200
    accountId = $accountId
    description = "Food"
} | ConvertTo-Json

Invoke-RestMethod -Method POST "$baseUrl/transactions" `
-Headers $headers `
-ContentType "application/json" `
-Body $expenseBody

# =========================
# 6. BALANCE
# =========================
Write-Host "BALANCE..."

$balance = Invoke-RestMethod -Method GET "$baseUrl/transactions/balance/$accountId" `
-Headers $headers

# =========================
# 7. RESULT
# =========================
Write-Host "DONE"
Write-Host "User: $uniqueEmail"
Write-Host "Account: $accountId"

Write-Host "BALANCE RESULT:" -ForegroundColor Yellow
$balance | ConvertTo-Json -Depth 10

