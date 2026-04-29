import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { compareColleges } from '../lib/api';
import { formatFees, formatPercent, formatRating } from '../lib/format';

const Compare = ({ compareIds, onSaveComparison }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (compareIds.length < 2) return;
    let active = true;
    setLoading(true);
    setError('');

    compareColleges(compareIds)
      .then((payload) => {
        if (!active) return;
        setRows(payload.data || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to compare.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [compareIds]);

  const handleSave = async () => {
    const result = await onSaveComparison(compareIds);
    if (!result.ok) {
      setNotice(result.error);
    } else {
      setNotice('Comparison saved.');
    }
  };

  if (compareIds.length < 2) {
    return (
      <section className="sketch-panel p-6">
        <p className="uppercase tracking-[0.2em]">
          Select at least 2 colleges from the listing to compare.
        </p>
        <Link to="/" className="sketch-button mt-4 inline-flex">
          Back to listing
        </Link>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="sketch-panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">
              Compare table
            </p>
            <h1 className="font-title text-2xl tracking-[0.2em]">
              Decision snapshot
            </h1>
          </div>
          <button className="sketch-button" type="button" onClick={handleSave}>
            Save comparison
          </button>
        </div>
        {notice && (
          <p className="mt-3 text-xs uppercase tracking-[0.2em]">{notice}</p>
        )}
      </section>

      {loading && (
        <section className="sketch-panel p-6">
          <p className="uppercase tracking-[0.2em]">Loading comparison...</p>
        </section>
      )}

      {error && !loading && (
        <section className="sketch-panel p-6">
          <p className="uppercase tracking-[0.2em]">{error}</p>
        </section>
      )}

      {!loading && !error && rows.length > 0 && (
        <section className="sketch-panel overflow-x-auto p-6">
          <table className="sketch-table text-sm">
            <thead>
              <tr>
                <th>Feature</th>
                {rows.map((college) => (
                  <th key={college.id}>{college.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Location</td>
                {rows.map((college) => (
                  <td key={`${college.id}-location`}>{college.location}</td>
                ))}
              </tr>
              <tr>
                <td>Fees</td>
                {rows.map((college) => (
                  <td key={`${college.id}-fees`}>{formatFees(college.fees)}</td>
                ))}
              </tr>
              <tr>
                <td>Placement rate</td>
                {rows.map((college) => (
                  <td key={`${college.id}-placement`}>
                    {formatPercent(college.placementRate)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {rows.map((college) => (
                  <td key={`${college.id}-rating`}>
                    {formatRating(college.rating)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default Compare;
