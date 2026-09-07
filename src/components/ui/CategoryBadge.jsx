import { catStyle } from "../../lib/theme";

export default function CategoryBadge({ category, level, className = "" }) {
  const c = catStyle(category);
  return (
    <span
      className={`inline-block w-fit rounded-full px-2 py-1 text-xs font-medium ${className}`}
      style={{ background: c.tint, color: c.text }}
    >
      {category}
      {level ? ` · ${level}` : ""}
    </span>
  );
}
