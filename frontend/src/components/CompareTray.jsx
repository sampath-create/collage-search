import { Link } from 'react-router-dom';

const CompareTray = ({ compareIds, onClear }) => {
  if (!compareIds.length) return null;

  return (
    <div className="sketch-panel mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">
          Comparison tray
        </p>
        <p className="text-lg font-title tracking-[0.2em]">
          {compareIds.length} selected
        </p>
        <p className="text-sm opacity-70">
          Pick 2 to 3 colleges to unlock the compare table.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/compare" className="sketch-button">
          Open compare
        </Link>
        <button
          type="button"
          className="sketch-button sketch-button--ghost"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default CompareTray;
