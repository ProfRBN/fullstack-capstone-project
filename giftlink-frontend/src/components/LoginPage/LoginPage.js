import React, { useState } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('name', data.userName);
                sessionStorage.setItem('email', data.userEmail);
                setIsLoggedIn(true);
                setUserName(data.userName);
                navigate('/app');
            } else {
                setErrorMessage(data.error || 'Login failed');
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setErrorMessage('Login failed');
        }
    }

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="text"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>

              <p className="mt-4 text-center">
                New here? <a href="/app/register" className="text-primary">Register Here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;
