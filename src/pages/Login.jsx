import React, { useState } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/hooks/useAuth';

const Login = () => {
  const { login, error, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='login-container'>
      <div className='login-card glass-card'>
        <div className='login-header'>
          <div className='logo'>
            <div className='logo-icon'>E</div>
            <span className='logo-text'>dukaster</span>
          </div>
          <div className='admin-badge'>
            <Shield size={16} />
            <span>Admin Portal</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className='login-form'>
          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='input'
              placeholder='Enter your admin email'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <div className='password-input'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='input'
                placeholder='Enter your password'
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className='error-message'>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type='submit'
            className='btn btn-primary login-btn'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className='spinner'></div>
                Signing in...
              </>
            ) : (
              <>
                <Shield size={18} />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <div className='login-footer'>
          <div className='credentials-info'>
            <h4>Default Admin Credentials</h4>
            <div className='credential-item'>
              <span className='label'>Email:</span>
              <code>admin@edukaster.com</code>
            </div>
            <div className='credential-item'>
              <span className='label'>Password:</span>
              <code>Admin123!</code>
            </div>
            <p className='security-note'>
              Please change these credentials after first login
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .login-card {
          padding: 48px;
          width: 100%;
          max-width: 480px;
          position: relative;
          animation: fadeInUp 0.6s ease-out;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }

        .logo-text {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #1a1b5c 0%, #2d5dcc 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(26, 27, 92, 0.3);
        }

        .login-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .login-header p {
          color: #6b7280;
          font-size: 18px;
          font-weight: 500;
        }

        .login-form {
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 16px;
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .login-btn {
          width: 100%;
          font-size: 16px;
          padding: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-footer {
          border-top: 1px solid rgba(229, 231, 235, 0.3);
          padding-top: 32px;
        }

        .credentials-info {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(10px);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .credentials-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 16px;
          text-align: center;
        }

        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 0;
        }

        .credential-item .label {
          font-weight: 500;
          color: #6b7280;
        }

        .credential-item code {
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          padding: 4px 8px;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          font-weight: 600;
        }

        .security-note {
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
          margin-top: 16px;
          font-style: italic;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 32px 24px;
          }

          .login-header h1 {
            font-size: 28px;
          }

          .page-title {
            font-size: 24px;
          }

          .header-search {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};
export default Login;
