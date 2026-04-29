import { Link, NavLink } from 'react-router-dom';

const TopNav = ({ user, onLogout }) => {
  const navClass = ({ isActive }) =>
    `sketch-link px-3 py-2 text-xs uppercase tracking-widest ${
      isActive ? 'font-semibold' : 'opacity-70 hover:opacity-100'
    }`;

  return (
    <header className="border-b-2 border-ink/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="sketch-badge">RTYC</div>
          <div>
            <p className="font-title text-lg uppercase tracking-[0.25em]">
              Route to your collage
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] opacity-70">
              Notebook edition
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          <NavLink to="/" className={navClass} end>
            Explore
          </NavLink>
          <NavLink to="/compare" className={navClass}>
            Compare
          </NavLink>
          <NavLink to="/saved" className={navClass}>
            Saved
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-xs uppercase tracking-wider sm:inline">
                Hi {user.name}
              </span>
              <button
                type="button"
                className="sketch-button sketch-button--ghost"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="sketch-button">
              Login
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t-2 border-ink/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.4em] sm:hidden">
        <NavLink to="/" className={navClass} end>
          Explore
        </NavLink>
        <NavLink to="/compare" className={navClass}>
          Compare
        </NavLink>
        <NavLink to="/saved" className={navClass}>
          Saved
        </NavLink>
      </div>
    </header>
  );
};

export default TopNav;
