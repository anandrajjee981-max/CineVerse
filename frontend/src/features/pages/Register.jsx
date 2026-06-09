import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useauth } from './hooks/use.auth'; // Make sure your useauth hook exposes handleregister
import gsap from 'gsap';
import '../style/login.scss'; // Reusing the premium login styles

const Register = () => {
  const { handleregister, loading } = useauth();
  const navigate = useNavigate();

  // All fields completely empty by default
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    // Hardware accelerated smooth entry load animation
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power4.out' }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Please fill in all standard fields.');
      return;
    }

    try {
      // Direct clean single object layout matching hook syntax
      const res = await handleregister({ username, email, password });
      if (res) {
        navigate('/login'); // Successfully registered, routing to login
      } else {
        setError('Registration failed. Username or email might be taken.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error establishing connection with registration server.');
      }
    }
  };

  return (
    <div className="login-container">
      {/* Dynamic background geometric blades */}
      <div className="bg-abstract-geometry">
        <div className="blade-1"></div>
        <div className="blade-2"></div>
      </div>

      {/* Cyber-Obsidian Shaped Panel */}
      <div className="login-card" ref={cardRef}>
        <div className="brand-logo">
          <h2>CineVerse</h2>
        </div>

        <div className="divider-line"></div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Invisible dummy targets to trap browser's rogue autofill data streams */}
          <input type="text" name="username" style={{ display: 'none' }} aria-hidden="true" />
          <input type="email" name="email" style={{ display: 'none' }} aria-hidden="true" />
          <input type="password" name="password" style={{ display: 'none' }} aria-hidden="true" />

          {/* Username Input Field */}
          <div className="input-wrapper">
            <label htmlFor="real-username">Username</label>
            <input 
              type="text"
              id="real-username"
              name="real-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Create a unique username"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Email Input Field */}
          <div className="input-wrapper">
            <label htmlFor="real-email">Email Address</label>
            <input 
              type="email"
              id="real-email"
              name="real-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Password Input Field */}
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
                placeholder="Create a strong password"
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{' '}
            <span className="navigate-link" onClick={() => !loading && navigate('/')}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;