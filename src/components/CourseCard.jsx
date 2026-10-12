import { Link } from "react-router-dom";
import { Clock, Lock, Unlock, ArrowUpRight } from "lucide-react";
import CategoryBadge from "./ui/CategoryBadge";
import { formatPrice } from "../lib/format";
import { catStyle } from "../lib/theme";

export default function CourseCard({ course }) {
  const c = catStyle(course.category);
  return (
    <Link
      to={`/cours/${course.id}`}
      className="group card relative flex flex-col gap-4 overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Liseré couleur de la matiere */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: c.color }} />
      <div className="flex items-center justify-between">
        <CategoryBadge category={course.category} />
        <span className="rounded-full bg-mist px-2.5 py-1 font-display text-[11px] font-semibold text-navy">
          {course.level}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug text-navy">{course.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted">{course.description}</p>
      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <Clock size={13} /> {course.duration}
        </span>
        <span className="flex items-center gap-3">
          <span
            className="flex items-center gap-1 font-display text-sm font-bold"
            style={{ color: course.is_free ? "#059669" : "#0B1F4D" }}
          >
            {course.is_free ? <Unlock size={13} /> : <Lock size={13} />}
            {formatPrice(course.price)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white transition group-hover:bg-accent">
            <ArrowUpRight size={15} />
          </span>
        </span>
      </div>
    </Link>
  );
}
