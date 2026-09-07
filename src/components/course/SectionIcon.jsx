import { PlayCircle, Image as ImageIcon, ClipboardCheck, FileText } from "lucide-react";

export default function SectionIcon({ type, size = 14 }) {
  if (type === "video") return <PlayCircle size={size} />;
  if (type === "image") return <ImageIcon size={size} />;
  if (type === "quiz") return <ClipboardCheck size={size} />;
  return <FileText size={size} />;
}
