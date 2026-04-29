import { useEffect, useState } from 'react';
import { fetchColleges } from '../lib/api';
import SketchCard from '../components/SketchCard';
import CompareTray from '../components/CompareTray';

const LOCATION_OPTIONS = ['Andhra Pradesh', 'Telangana'];

const COURSE_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering'
];

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  course: '',
  minFees: '',
  maxFees: '',
  sort: 'rating_desc'
};

const LIMIT = 6;

const Home = ({
  compareIds,
  onToggleCompare,
  onClearCompare,
  onSaveCollege,
  savedCollegeIds,
  authError
}) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [colleges, setColleges] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchColleges({ ...applied, page, limit: LIMIT })
      .then((payload) => {
        if (!active) return;
        setColleges(payload.data || []);
        setMeta(payload.meta || { page: 1, totalPages: 1, total: 0 });
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load colleges.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applied, page]);

  const totalPages = meta.totalPages || 1;

  const applyFilters = (event) => {
    event.preventDefault();
    setApplied(filters);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleCompareToggle = (id) => {
    const ok = onToggleCompare(id);
    if (!ok) {
      setNotice('You can compare up to 3 colleges.');
    }
  };

  const handleSave = async (id) => {
    const result = await onSaveCollege(id);
    if (!result.ok) {
      setNotice(result.error);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="sketch-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] opacity-70">
              Route to your collage
            </p>
            <h1 className="mt-3 font-title text-3xl tracking-[0.25em] sm:text-4xl">
              Find the right college like a notebook detective
            </h1>
            <p className="mt-4 text-base opacity-80">
              Search by name, filter by location, fees, and course, then compare
              shortlists side by side. Everything stays in a black and white
              study journal.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm uppercase tracking-[0.2em]">
            <div className="sketch-stamp">MVP checklist</div>
            <ul className="space-y-2">
              <li>[x] Listing + search</li>
              <li>[x] College detail</li>
              <li>[x] Compare table</li>
              <li>[x] Auth + saved items</li>
            </ul>
          </div>
        </div>
      </section>

      {(authError || notice) && (
        <section className="sketch-panel sketch-panel--soft p-4">
          <p className="text-sm uppercase tracking-[0.2em]">
            {authError || notice}
          </p>
        </section>
      )}

      <section className="sketch-panel p-6">
        <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-6" onSubmit={applyFilters}>
          <div className="lg:col-span-2">
            <label className="text-xs uppercase tracking-[0.3em]">Search</label>
            <input
              className="sketch-input mt-2"
              placeholder="College name"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em]">Location</label>
            <select
              className="sketch-input mt-2"
              value={filters.location}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, location: event.target.value }))
              }
            >
              <option value="">All</option>
              {LOCATION_OPTIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em]">Course</label>
            <select
              className="sketch-input mt-2"
              value={filters.course}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, course: event.target.value }))
              }
            >
              <option value="">All</option>
              {COURSE_OPTIONS.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em]">Min fees</label>
            <input
              className="sketch-input mt-2"
              type="number"
              min="0"
              placeholder="120000"
              value={filters.minFees}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, minFees: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em]">Max fees</label>
            <input
              className="sketch-input mt-2"
              type="number"
              min="0"
              placeholder="300000"
              value={filters.maxFees}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, maxFees: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <button className="sketch-button" type="submit">
              Apply
            </button>
            <button
              className="sketch-button sketch-button--ghost"
              type="button"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
        <span>{meta.total || 0} colleges</span>
        <span>
          Page {page} of {totalPages}
        </span>
      </section>

      {loading && (
        <section className="sketch-panel p-6">
          <p className="uppercase tracking-[0.2em]">Loading colleges...</p>
        </section>
      )}

      {error && !loading && (
        <section className="sketch-panel p-6">
          <p className="uppercase tracking-[0.2em]">{error}</p>
        </section>
      )}

      {!loading && !error && (
        <section className="grid gap-6 md:grid-cols-2">
          {colleges.map((college) => (
            <SketchCard
              key={college._id}
              college={college}
              isCompared={compareIds.includes(college._id)}
              onToggleCompare={handleCompareToggle}
              onSave={handleSave}
              isSaved={savedCollegeIds.includes(college._id)}
            />
          ))}
        </section>
      )}

      <section className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="sketch-button sketch-button--ghost"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          type="button"
          className="sketch-button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </section>

      <CompareTray compareIds={compareIds} onClear={onClearCompare} />
    </div>
  );
};

export default Home;
