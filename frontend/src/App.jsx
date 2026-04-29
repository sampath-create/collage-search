import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TopNav from './components/TopNav';
import Auth from './pages/Auth';
import CollegeDetail from './pages/CollegeDetail';
import Compare from './pages/Compare';
import Home from './pages/Home';
import Saved from './pages/Saved';
import {
  clearToken,
  deleteSaved,
  fetchMe,
  fetchSaved,
  getToken,
  saveCollege,
  saveComparison,
  setToken
} from './lib/api';
import './App.css';

const COMPARE_KEY = 'rtu_compare';
const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

const loadCompareIds = () => {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 3);
  } catch (err) {
    return [];
  }
};

function App() {
  const [auth, setAuth] = useState({ token: getToken(), user: null });
  const [savedItems, setSavedItems] = useState([]);
  const [compareIds, setCompareIds] = useState(() => loadCompareIds());
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const payload = await fetchMe(auth.token);
        setAuth((prev) => ({ ...prev, user: payload.data }));
        setAuthError('');
      } catch (err) {
        clearToken();
        setAuth({ token: null, user: null });
        setAuthError('Session expired. Please login again.');
      }
    };

    if (auth.token) {
      loadUser();
    }
  }, [auth.token]);

  const refreshSaved = async (token) => {
    if (!token) {
      setSavedItems([]);
      return;
    }
    try {
      const payload = await fetchSaved(token);
      setSavedItems(payload.data || []);
    } catch (err) {
      setSavedItems([]);
    }
  };

  useEffect(() => {
    if (auth.token) {
      refreshSaved(auth.token);
    } else {
      setSavedItems([]);
    }
  }, [auth.token]);

  const handleAuthSuccess = ({ user, token }) => {
    setToken(token);
    setAuth({ user, token });
    setAuthError('');
  };

  const handleLogout = () => {
    clearToken();
    setAuth({ token: null, user: null });
    setSavedItems([]);
  };

  const toggleCompare = (id) => {
    let allowed = true;
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        allowed = false;
        return prev;
      }
      return [...prev, id];
    });
    return allowed;
  };

  const clearCompare = () => setCompareIds([]);

  const savedCollegeIds = useMemo(
    () =>
      savedItems
        .filter((item) => item.kind === 'college' && item.college)
        .map((item) => item.college._id),
    [savedItems]
  );

  const handleSaveCollege = async (collegeId) => {
    if (!auth.token) {
      return { ok: false, error: 'Login required to save colleges.' };
    }
    try {
      await saveCollege(collegeId, auth.token);
      await refreshSaved(auth.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const handleSaveComparison = async (collegeIds) => {
    if (!auth.token) {
      return { ok: false, error: 'Login required to save comparisons.' };
    }
    try {
      await saveComparison(collegeIds, auth.token);
      await refreshSaved(auth.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const handleRemoveSaved = async (id) => {
    if (!auth.token) return;
    await deleteSaved(id, auth.token);
    await refreshSaved(auth.token);
  };

  return (
    <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
      <div className="min-h-screen">
        <TopNav user={auth.user} onLogout={handleLogout} />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                  onClearCompare={clearCompare}
                  onSaveCollege={handleSaveCollege}
                  savedCollegeIds={savedCollegeIds}
                  authError={authError}
                />
              }
            />
            <Route
              path="/college/:id"
              element={
                <CollegeDetail
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                  onSaveCollege={handleSaveCollege}
                  savedCollegeIds={savedCollegeIds}
                />
              }
            />
            <Route
              path="/compare"
              element={
                <Compare
                  compareIds={compareIds}
                  onSaveComparison={handleSaveComparison}
                />
              }
            />
            <Route
              path="/auth"
              element={<Auth onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/saved"
              element={
                <Saved
                  items={savedItems}
                  isAuthed={Boolean(auth.token)}
                  onRemove={handleRemoveSaved}
                />
              }
            />
          </Routes>
        </main>
        <footer className="border-t-2 border-ink/70 bg-paper-muted">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span>Route to your collage</span>
            <span>Black and white sketch edition</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
