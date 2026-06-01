export function genrateOtp(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

export function getOtp(otp: number){
 return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Otp Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div>
    <h1>Your Otp code</h1>
    <p>Your OTP is: ${otp}</p>
    <p>Please enter this code to verify your account.</p>
    <p>Your Otp expires in 5 minutes.</p>
  </div>
</body>
</html>`

}

export function forgetOtp(otp: number){
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Otp</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
    }
  </style>
</head>
<body>
  <div>
    <h1>Password Reset OTP</h1>
    <p>Your OTP for resetting password is: ${otp}</p>
    <p>Please enter this code to reset your password.</p>
    <p>Your Otp expires in 5 minutes.</p>
  </div>
</body>
</html>`}