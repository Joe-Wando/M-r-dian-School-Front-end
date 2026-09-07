import { useState } from "react";
import { PlayCircle, Image as ImageIcon, ClipboardCheck, CheckCircle2 } from "lucide-react";
import SectionIcon from "./SectionIcon";

export default function SectionContent({ module, section, onComplete, completing }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">
        {module.title.toUpperCase()} · {section.title}
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{section.title}</h1>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <SectionIcon type={section.type} /> {section.duration}
        </span>
        {section.practical && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
            Video pratique obligatoire
          </span>
        )}
      </div>

      <div className="mt-6">
        {section.type === "video" && <VideoBlock url={section.video_url} />}
        {section.type === "image" && <GalleryBlock photos={section.photos} />}
        {section.type === "reading" && <ReadingBlock body={section.body} />}
        {section.type === "quiz" && <QuizBlock questions={section.questions} />}
      </div>

      <button
        onClick={() => onComplete(section)}
        className="btn-primary mt-8"
        disabled={completing || section.completed}
      >
        <CheckCircle2 size={15} />
        {section.completed ? "Section terminee" : completing ? "…" : "Marquer comme terminee"}
      </button>
    </div>
  );
}

function VideoBlock({ url }) {
  if (url) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg bg-black">
        <iframe
          src={url}
          title="Video du cours"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-ink">
      <PlayCircle size={48} className="text-white" />
    </div>
  );
}

function GalleryBlock({ photos = [] }) {
  if (photos.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex aspect-square items-center justify-center rounded-md bg-line">
            <ImageIcon size={22} className="text-gray-400" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {photos.map((p, i) => (
        <figure key={i} className="overflow-hidden rounded-md border border-line">
          {p.url ? (
            <img src={p.url} alt={p.caption || ""} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-line">
              <ImageIcon size={22} className="text-gray-400" />
            </div>
          )}
          {p.caption && <figcaption className="p-2 text-xs text-muted">{p.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function ReadingBlock({ body }) {
  if (!body) {
    return (
      <p className="rounded-lg border border-line bg-white p-6 text-sm text-muted">
        Le contenu de cette lecture sera disponible prochainement.
      </p>
    );
  }
  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{body}</div>
  );
}

function QuizBlock({ questions = [] }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-ground p-6">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ClipboardCheck size={16} className="text-accent" /> Evaluation notee
        </p>
        <p className="mt-2 text-sm text-muted">
          Les questions de cette evaluation apparaitront ici une fois le contenu redige.
        </p>
      </div>
    );
  }

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0),
    0
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-5"
    >
      {questions.map((q, qi) => (
        <fieldset key={qi} className="rounded-lg border border-line p-4">
          <legend className="px-1 text-sm font-medium">{q.question}</legend>
          <div className="mt-2 flex flex-col gap-2">
            {q.options.map((opt, oi) => {
              const isCorrect = submitted && oi === q.correct_index;
              const isWrongPick = submitted && answers[qi] === oi && oi !== q.correct_index;
              return (
                <label
                  key={oi}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : isWrongPick
                        ? "border-red-400 bg-red-50"
                        : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers({ ...answers, [qi]: oi })}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      {!submitted ? (
        <button type="submit" className="btn-primary self-start">
          Valider mes reponses
        </button>
      ) : (
        <p className="text-sm font-medium">
          Score : {score} / {questions.length}
        </p>
      )}
    </form>
  );
}
