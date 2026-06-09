import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useauth } from './hooks/use.auth';
import gsap from 'gsap';
import '../style/login.scss';
import { useSelector } from 'react-redux';

const Login = () => {
  const { handlelogin, loading } = useauth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cardRef = useRef(null);
  const user = useSelector(state => state.auth.user)
   


  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power4.out' }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Agar state empty hai toh frontend par hi rok lo, request bhejkar 400 mat khao
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const res = await handlelogin( username, password );
      if (res) {
        navigate('/home');
      } else {
        setError('Invalid credentials. Access Denied.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('400 Bad Request: Backend rejected payload layout.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="bg-abstract-geometry">
        <div className="blade-1"></div>
        <div className="blade-2"></div>
      </div>

      <div className="login-card" ref={cardRef}>
        <div className="brand-logo">
          <h2>CineVerse</h2>
        </div>

        <div className="divider-line"></div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          
          {/* HACK: In invisible dummy inputs ko dekh kar Chrome/Edge saara autofill inme ghasit dega */}
          <input type="text" name="username" style={{ display: 'none' }} aria-hidden="true" />
          <input type="password" name="password" style={{ display: 'none' }} aria-hidden="true" />

          {/* Real Inputs */}
          <div className="input-wrapper">
            <label htmlFor="real-username">Email or Username</label>
            <input 
              type="text"
              id="real-username"
              name="real-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="off" // Dummy targets upar hain, toh yeh clean rahega
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="real-password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="real-password"
                name="real-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="new-password"
              />
              <span 
                className="eye-icon" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ userSelect: 'none' }}
              >
                {showPassword ? '🙈' : '👁'}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            New to the platform?{' '}
            <span className="navigate-link" onClick={() => !loading && navigate('/register')}>
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;