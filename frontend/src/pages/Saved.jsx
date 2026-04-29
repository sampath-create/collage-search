import { Link } from 'react-router-dom';
import { formatFees, formatRating } from '../lib/format';

const Saved = ({ items, isAuthed, onRemove }) => {
  if (!isAuthed) {
    return (
      <section className="sketch-panel p-6">
        <p className="uppercase tracking-[0.2em]">
          Login to view saved colleges and comparisons.
        </p>
        <Link to="/auth" className="sketch-button mt-4 inline-flex">
          Go to login
        </Link>
      </section>
    );
  }

  const collegeItems = items.filter(
    (item) => item.kind === 'college' && item.college
  );
  const comparisonItems = items.filter((item) => item.kind === 'comparison');

  return (
    <div className="flex flex-col gap-8">
      <section className="sketch-panel p-6">
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">
          Saved desk
        </p>
        <h1 className="mt-2 font-title text-2xl tracking-[0.2em]">
          Your saved shortlist
        </h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {collegeItems.length === 0 && (
          <div className="sketch-panel p-6">
            <p className="uppercase tracking-[0.2em]">
              No saved colleges yet.
            </p>
          </div>
        )}
        {collegeItems.map((item) => (
          <div key={item._id} className="sketch-panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  to={`/college/${item.college._id}`}
                  className="font-title text-lg tracking-[0.2em]"
                >
                  {item.college.name}
                </Link>
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                  {item.college.location}
                </p>
                <p className="mt-2 text-sm">
                  {formatFees(item.college.fees)} |{' '}
                  {formatRating(item.college.rating)}
                </p>
              </div>
              <button
                type="button"
                className="sketch-button sketch-button--ghost"
                onClick={() => onRemove(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="sketch-panel p-6">
        <h2 className="font-title text-lg tracking-[0.2em]">
          Saved comparisons
        </h2>
        {comparisonItems.length === 0 && (
          <p className="mt-3 text-sm uppercase tracking-[0.2em]">
            No saved comparisons yet.
          </p>
        )}
        <div className="mt-4 space-y-4">
          {comparisonItems.map((item) => (
            <div key={item._id} className="note-box">
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                {item.collegeIds?.length || 0} colleges
              </p>
              <p className="mt-1 text-sm">
                {(item.collegeIds || [])
                  .map((college) => college.name)
                  .join(' vs ')}
              </p>
              <button
                type="button"
                className="sketch-button sketch-button--ghost mt-3"
                onClick={() => onRemove(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Saved;
