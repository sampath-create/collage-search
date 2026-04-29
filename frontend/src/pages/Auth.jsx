import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../lib/api';

const Auth = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload =
        mode === 'login'
          ? await login({ email: form.email, password: form.password })
          : await register({
              name: form.name,
              email: form.email,
              password: form.password
            });

      onAuthSuccess(payload.data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sketch-panel max-w-xl p-6">
      <p className="text-xs uppercase tracking-[0.3em] opacity-70">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </p>
      <h1 className="mt-2 font-title text-2xl tracking-[0.2em]">
        {mode === 'login' ? 'Login to save progress' : 'Join the notebook'}
      </h1>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div>
            <label className="text-xs uppercase tracking-[0.3em]">Name</label>
            <input
              className="sketch-input mt-2"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-[0.3em]">Email</label>
          <input
            className="sketch-input mt-2"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em]">Password</label>
          <input
            className="sketch-input mt-2"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            required
          />
        </div>
        {error && (
          <p className="text-xs uppercase tracking-[0.2em]">{error}</p>
        )}
        <button className="sketch-button" type="submit" disabled={loading}>
          {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em]">
        <span>
          {mode === 'login'
            ? 'Need an account?'
            : 'Already have an account?'}
        </span>
        <button
          type="button"
          className="sketch-link"
          onClick={() =>
            setMode((prev) => (prev === 'login' ? 'register' : 'login'))
          }
        >
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </div>
    </section>
  );
};

export default Auth;
