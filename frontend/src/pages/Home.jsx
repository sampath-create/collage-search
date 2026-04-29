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

const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Rating: High to low' },
  { value: 'rating_asc', label: 'Rating: Low to high' },
  { value: 'fees_asc', label: 'Fees: Low to high' },
  { value: 'fees_desc', label: 'Fees: High to low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
];

const SORT_LABELS = SORT_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  course: '',
  minFees: '',
  maxFees: '',
  sort: 'rating_desc'
};

const LIMIT = 6;

const isDefaultFilters = (value) =>
  value.search === '' &&
  value.location === '' &&
  value.course === '' &&
  value.minFees === '' &&
  value.maxFees === '' &&
  value.sort === DEFAULT_FILTERS.sort;

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
  const hasActiveFilters = !isDefaultFilters(applied);
  const canReset = hasActiveFilters || !isDefaultFilters(filters);
  const totalCount = meta.total || 0;
  const visibleCount = colleges.length;

  const filterTags = [];
  if (applied.search) filterTags.push(`Search: ${applied.search}`);
  if (applied.location) filterTags.push(`Location: ${applied.location}`);
  if (applied.course) filterTags.push(`Course: ${applied.course}`);
  if (applied.minFees || applied.maxFees) {
    const minLabel = applied.minFees ? applied.minFees : '0';
    const maxLabel = applied.maxFees ? applied.maxFees : 'No max';
    filterTags.push(`Fees: ${minLabel} - ${maxLabel}`);
  }
  if (applied.sort && applied.sort !== DEFAULT_FILTERS.sort) {
    filterTags.push(`Sort: ${SORT_LABELS[applied.sort] || applied.sort}`);
  }

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
        <form
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-12"
          onSubmit={applyFilters}
        >
          <div className="lg:col-span-4">
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
          <div className="lg:col-span-2">
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
          <div className="lg:col-span-2">
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
          <div className="lg:col-span-2">
            <label className="text-xs uppercase tracking-[0.3em]">Sort</label>
            <select
              className="sketch-input mt-2"
              value={filters.sort}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, sort: event.target.value }))
              }
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1">
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
          <div className="lg:col-span-1">
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end lg:col-span-12">
            <button className="sketch-button w-full sm:w-auto" type="submit">
              Apply filters
            </button>
            <button
              className="sketch-button sketch-button--ghost w-full sm:w-auto"
              type="button"
              onClick={resetFilters}
              disabled={!canReset}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {filterTags.length > 0 && (
        <section className="sketch-panel sketch-panel--soft p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em]">
              <span className="sketch-stamp">Active filters</span>
              {filterTags.map((tag) => (
                <span key={tag} className="sketch-tag">
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="sketch-button sketch-button--ghost"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {visibleCount} of {totalCount} colleges</span>
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

      {!loading && !error && colleges.length === 0 && (
        <section className="sketch-panel p-6">
          <p className="text-sm uppercase tracking-[0.2em]">
            No colleges match those filters.
          </p>
          <p className="mt-2 text-sm opacity-70">
            Try clearing fees or course, or broaden the search text.
          </p>
          <div className="mt-4">
            <button
              type="button"
              className="sketch-button sketch-button--ghost"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>
        </section>
      )}

      {!loading && !error && colleges.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
