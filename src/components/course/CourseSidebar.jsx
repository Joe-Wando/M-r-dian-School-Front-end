import { useState } from "react";
import { ChevronDown, Circle, CheckCircle2, Lock } from "lucide-react";
import SectionIcon from "./SectionIcon";

function ModuleStatusIcon({ status }) {
  if (status === "done") return <CheckCircle2 size={16} className="text-emerald-600" />;
  if (status === "locked") return <Lock size={13} className="text-line-strong" />;
  return <Circle size={16} className="text-accent" />;
}

export default function CourseSidebar({ title, modules, activeSectionId, onSelect }) {
  const initiallyOpen = modules.find((m) => m.status === "current")?.id || modules[0]?.id;
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <aside className="w-full shrink-0 border-r border-line bg-white lg:w-72">
      <div className="border-b border-line p-5">
        <h2 className="text-base font-semibold leading-snug">{title}</h2>
      </div>
      <nav className="py-2">
        {modules.map((mod, i) => {
          const isOpen = open === mod.id;
          const isLocked = mod.status === "locked";
          return (
            <div key={mod.id} className="border-b border-gray-100">
              <button
                disabled={isLocked}
                onClick={() => setOpen(isOpen ? null : mod.id)}
                className="flex w-full items-center justify-between px-5 py-3 text-left"
                style={{ opacity: isLocked ? 0.5 : 1 }}
              >
                <span className="flex items-center gap-2.5 text-sm">
                  <ModuleStatusIcon status={mod.status} />
                  <span style={{ fontWeight: mod.status === "current" ? 600 : 500 }}>
                    Module {i + 1} — {mod.title}
                  </span>
                </span>
                {!isLocked && (
                  <ChevronDown
                    size={14}
                    className="text-gray-400 transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  />
                )}
              </button>
              {isOpen && !isLocked && (
                <div className="flex flex-col gap-1 pb-3 pl-11 pr-4">
                  {mod.sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelect(mod, s)}
                      className={`flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs ${
                        activeSectionId === s.id ? "bg-accent-soft text-accent" : "text-muted"
                      }`}
                    >
                      {s.completed ? (
                        <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                      ) : (
                        <SectionIcon type={s.type} />
                      )}
                      <span className="flex-1">{s.title}</span>
                      {s.practical && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                          Pratique
                        </span>
                      )}
                      <span className="text-gray-400">{s.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
