import { Link } from "react-router-dom";
import { Clock, Lock, Unlock } from "lucide-react";
import CategoryBadge from "./ui/CategoryBadge";
import { formatPrice } from "../lib/format";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/cours/${course.id}`}
      className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <CategoryBadge category={course.category} />
        <span className="rounded border border-line-strong px-2 py-0.5 text-xs font-medium text-muted">
          {course.level}
        </span>
      </div>
      <h3 className="text-base font-semibold leading-snug">{course.title}</h3>
      <p className="flex-1 text-sm text-muted">{course.description}</p>
      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={12} /> {course.duration}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: course.is_free ? "#059669" : "#1A1A1A" }}
        >
          {course.is_free ? <Unlock size={12} /> : <Lock size={12} />}
          {formatPrice(course.price)}
        </span>
      </div>
    </Link>
  );
}
