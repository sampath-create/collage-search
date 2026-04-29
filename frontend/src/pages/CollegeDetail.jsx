import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCollege } from '../lib/api';
import { formatFees, formatPercent, formatRating } from '../lib/format';

const CollegeDetail = ({
  compareIds,
  onToggleCompare,
  onSaveCollege,
  savedCollegeIds
}) => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchCollege(id)
      .then((payload) => {
        if (!active) return;
        setCollege(payload.data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load college.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleCompare = () => {
    const ok = onToggleCompare(id);
    if (!ok) {
      setNotice('You can compare up to 3 colleges.');
    }
  };

  const handleSave = async () => {
    const result = await onSaveCollege(id);
    if (!result.ok) {
      setNotice(result.error);
    }
  };

  if (loading) {
    return (
      <section className="sketch-panel p-6">
        <p className="uppercase tracking-[0.2em]">Loading details...</p>
      </section>
    );
  }

  if (error || !college) {
    return (
      <section className="sketch-panel p-6">
        <p className="uppercase tracking-[0.2em]">{error || 'Not found.'}</p>
      </section>
    );
  }

  const overview = college.overview || {};
  const placements = college.placements || {};

  return (
    <div className="flex flex-col gap-8">
      <Link to="/" className="sketch-link text-xs uppercase tracking-[0.3em]">
        Back to listing
      </Link>

      {notice && (
        <section className="sketch-panel sketch-panel--soft p-4">
          <p className="text-sm uppercase tracking-[0.2em]">{notice}</p>
        </section>
      )}

      <section className="sketch-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">
              {college.location}
            </p>
            <h1 className="mt-2 font-title text-3xl tracking-[0.2em]">
              {college.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm opacity-80">
              {college.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="sketch-tag">{formatRating(college.rating)}</span>
            <span className="sketch-tag">{formatFees(college.fees)}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="sketch-button" type="button" onClick={handleCompare}>
            {compareIds.includes(id) ? 'Remove compare' : 'Add compare'}
          </button>
          <button
            className="sketch-button sketch-button--ghost"
            type="button"
            onClick={handleSave}
            disabled={savedCollegeIds.includes(id)}
          >
            {savedCollegeIds.includes(id) ? 'Saved' : 'Save college'}
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="sketch-panel p-5">
          <h2 className="font-title text-lg tracking-[0.2em]">Overview</h2>
          <div className="mt-4 space-y-2 text-sm uppercase tracking-[0.15em]">
            <p>Established: {overview.established || 'N/A'}</p>
            <p>Type: {overview.type || 'N/A'}</p>
            <p>Affiliation: {overview.affiliation || 'N/A'}</p>
            <p>Campus size: {overview.campusSize || 'N/A'}</p>
          </div>
        </div>
        <div className="sketch-panel p-5">
          <h2 className="font-title text-lg tracking-[0.2em]">Placements</h2>
          <div className="mt-4 space-y-2 text-sm uppercase tracking-[0.15em]">
            <p>Placement rate: {formatPercent(placements.placementRate)}</p>
            <p>Average package: {placements.avgPackage || 'N/A'} LPA</p>
            <p>
              Top recruiters:{' '}
              {(placements.topRecruiters || []).slice(0, 3).join(', ') || 'N/A'}
            </p>
          </div>
        </div>
        <div className="sketch-panel p-5">
          <h2 className="font-title text-lg tracking-[0.2em]">Quick facts</h2>
          <div className="mt-4 space-y-2 text-sm uppercase tracking-[0.15em]">
            <p>{college.courses?.length || 0} active courses</p>
            <p>Reviews: {college.reviews?.length || 0}</p>
            <p>Decision signal: {college.rating >= 4.2 ? 'Strong' : 'Moderate'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="sketch-panel p-5">
          <h2 className="font-title text-lg tracking-[0.2em]">Courses</h2>
          <div className="mt-4 space-y-3 text-sm">
            {(college.courses || []).map((course, index) => (
              <div key={`${course.name}-${index}`} className="note-box">
                <p className="uppercase tracking-[0.2em]">{course.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                  {course.level} | {course.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="sketch-panel p-5">
          <h2 className="font-title text-lg tracking-[0.2em]">Reviews</h2>
          <div className="mt-4 space-y-3 text-sm">
            {(college.reviews || []).map((review, index) => (
              <div key={`${review.name}-${index}`} className="note-box">
                <p className="uppercase tracking-[0.2em]">
                  {review.name} - {formatRating(review.rating)}
                </p>
                <p className="mt-1 text-xs opacity-80">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollegeDetail;
