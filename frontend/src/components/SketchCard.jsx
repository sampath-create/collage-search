import { Link } from 'react-router-dom';
import { formatFees, formatRating } from '../lib/format';

const SketchCard = ({
  college,
  isCompared,
  onToggleCompare,
  onSave,
  isSaved
}) => {
  const courseList = (college.courses || [])
    .map((course) => course.name)
    .filter(Boolean);
  const primaryCourses = courseList.slice(0, 2);
  const extraCourseCount = Math.max(0, courseList.length - primaryCourses.length);

  return (
    <article className="sketch-card flex h-full flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-title text-lg tracking-[0.2em]">
            {college.name}
          </h3>
          <p className="text-sm uppercase tracking-[0.2em] opacity-70">
            {college.location}
          </p>
        </div>
        <span className="sketch-tag">{formatRating(college.rating)}</span>
      </header>
      <p className="text-sm leading-relaxed opacity-80">
        {college.description}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em]">
        <span className="sketch-tag">{formatFees(college.fees)}</span>
        {primaryCourses.map((course) => (
          <span key={course} className="sketch-tag">
            {course}
          </span>
        ))}
        {extraCourseCount > 0 && (
          <span className="sketch-tag">+{extraCourseCount} more</span>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3">
        <Link to={`/college/${college._id}`} className="sketch-button">
          View details
        </Link>
        <button
          type="button"
          className="sketch-button sketch-button--ghost"
          onClick={() => onToggleCompare(college._id)}
        >
          {isCompared ? 'Remove compare' : 'Add compare'}
        </button>
        <button
          type="button"
          className="sketch-button"
          onClick={() => onSave(college._id)}
          disabled={isSaved}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  );
};

export default SketchCard;
