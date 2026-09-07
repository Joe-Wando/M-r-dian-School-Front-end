import { useState } from "react";
import { Plus, X, Trash2, Image as ImageIcon } from "lucide-react";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

/**
 * Editeur de contenu d'une section, adapte a son type :
 *  reading -> texte | video -> lien | image -> galerie legendee | quiz -> generateur QCM
 */
export default function SectionEditorModal({ section, onClose, onSave, saving }) {
  const [body, setBody] = useState(section.body || "");
  const [videoUrl, setVideoUrl] = useState(section.video_url || "");
  const [photos, setPhotos] = useState(section.photos || []);
  const [questions, setQuestions] = useState(section.questions || []);

  function handleSubmit(e) {
    e.preventDefault();
    if (section.type === "reading") onSave({ body });
    else if (section.type === "video") onSave({ video_url: videoUrl });
    else if (section.type === "image") onSave({ photos });
    else if (section.type === "quiz") onSave({ questions });
  }

  return (
    <Modal title={section.title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto p-6">
          {section.type === "reading" && (
            <Field label="Contenu de la lecture">
              <textarea
                autoFocus
                rows={10}
                className="field resize-none"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Ecris ici le texte de cette section…"
              />
            </Field>
          )}

          {section.type === "video" && (
            <Field
              label="Lien de la video hebergee"
              hint="Uploade d'abord la video sur ton service (Cloudflare Stream, Mux, Bunny…), puis colle le lien ici."
            >
              <input
                autoFocus
                className="field"
                placeholder="https://…"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </Field>
          )}

          {section.type === "image" && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted">Photos de la galerie</span>
              {photos.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-line-strong bg-ground">
                    {p.url ? (
                      <img src={p.url} alt="" className="h-full w-full rounded-md object-cover" />
                    ) : (
                      <ImageIcon size={18} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    className="field flex-1"
                    placeholder="URL de la photo"
                    value={p.url || ""}
                    onChange={(e) =>
                      setPhotos(photos.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))
                    }
                  />
                  <input
                    className="field flex-1"
                    placeholder="Legende"
                    value={p.caption || ""}
                    onChange={(e) =>
                      setPhotos(
                        photos.map((x, idx) => (idx === i ? { ...x, caption: e.target.value } : x))
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    aria-label="Retirer la photo"
                    className="text-gray-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPhotos([...photos, { url: "", caption: "" }])}
                className="btn-outline !py-2.5"
              >
                <Plus size={14} /> Ajouter une photo
              </button>
            </div>
          )}

          {section.type === "quiz" && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-muted">Questions</span>
              {questions.map((q, qi) => (
                <div key={qi} className="flex flex-col gap-2 rounded-md border border-line p-3">
                  <div className="flex items-center gap-2">
                    <input
                      className="field flex-1"
                      placeholder={`Question ${qi + 1}`}
                      value={q.question}
                      onChange={(e) =>
                        setQuestions(
                          questions.map((x, idx) =>
                            idx === qi ? { ...x, question: e.target.value } : x
                          )
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setQuestions(questions.filter((_, idx) => idx !== qi))}
                      aria-label="Supprimer la question"
                      className="text-gray-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correct_index === oi}
                        onChange={() =>
                          setQuestions(
                            questions.map((x, idx) =>
                              idx === qi ? { ...x, correct_index: oi } : x
                            )
                          )
                        }
                      />
                      <input
                        className="field flex-1 !py-1.5 !text-xs"
                        placeholder={`Choix ${oi + 1}`}
                        value={opt}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((x, idx) =>
                              idx === qi
                                ? {
                                    ...x,
                                    options: x.options.map((o, k) =>
                                      k === oi ? e.target.value : o
                                    ),
                                  }
                                : x
                            )
                          )
                        }
                      />
                    </label>
                  ))}
                  <p className="text-[10px] text-gray-400">Coche la bonne reponse a gauche.</p>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setQuestions([
                    ...questions,
                    { question: "", options: ["", "", "", ""], correct_index: 0 },
                  ])
                }
                className="btn-outline !py-2.5"
              >
                <Plus size={14} /> Ajouter une question
              </button>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer le contenu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
