
const Login = () => {
  return (
    <div>
      <img src="" alt="Nhà hàng" />
       <h1><b>Sign in</b></h1>
       <p>Please login to continue to your account</p>
       <label htmlFor="emaill">Emaill:</label>
       <br />
       <input type="emaill" id="emaill" name="emaill" value=" "/>
       <br />
       <label htmlFor="password">Mật khẩu:</label>
       <br />
       <input type="text" id='password' name='password' value="Password"/>
       <br />
       <input type="checkbox" />
       <p><b>Sign in</b></p>
       <p>or</p>
       <p>Sign in with Google</p>
       <p>Need an account <ins>Create one</ins></p>
    </div>
  )
}

export default Login
