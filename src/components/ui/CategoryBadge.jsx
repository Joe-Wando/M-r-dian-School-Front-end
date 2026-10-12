import { catStyle } from "../../lib/theme";

export default function CategoryBadge({ category, level, className = "" }) {
  const c = catStyle(category);
  return (
    <span
      className={`inline-block w-fit rounded-full px-3 py-1 font-display text-[11px] font-semibold ${className}`}
      style={{ background: c.tint, color: c.text }}
    >
      {category}
      {level ? ` · ${level}` : ""}
    </span>
  );
}
