import { useState } from "react";
import { Plus, Pencil, Trash2, Lock, Unlock, BookOpen, DollarSign, Mail } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import { useMutation } from "../../hooks/useMutation";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import CategoryBadge from "../../components/ui/CategoryBadge";
import CourseFormModal from "../../components/admin/CourseFormModal";
import ModuleManagerModal from "../../components/admin/ModuleManagerModal";
import { formatPrice } from "../../lib/format";

export default function AdminDashboardPage() {
  const stats = useApi(() => api.adminStats(), []);
  const courses = useApi(() => api.listCourses(), []);
  const messages = useApi(() => api.contactMessages(), []);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [managing, setManaging] = useState(null);

  const createCourse = useMutation(api.createCourse);
  const updateCourse = useMutation(api.updateCourse);
  const deleteCourse = useMutation(api.deleteCourse);

  async function patchCourse(id, patch) {
    const updated = await updateCourse.mutate(id, patch);
    courses.setData((list) => list.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  }

  const statCards = stats.data
    ? [
        { label: "Cours publies", value: stats.data.published_courses, icon: BookOpen },
        { label: "Ventes ce mois", value: stats.data.sales_this_month, icon: DollarSign },
        { label: "Revenu total", value: formatPrice(stats.data.total_revenue), icon: DollarSign },
        { label: "Messages non lus", value: stats.data.unread_messages, icon: Mail },
      ]
    : [];

  return (
    <div>
      <header className="border-b border-line bg-white px-4 pb-6 pt-10 md:px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Tableau de bord</h1>
        <p className="mt-1.5 text-sm text-muted">
          Vue reservee au proprietaire de la plateforme — protegee par role cote serveur.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 border-b border-line bg-white px-4 py-6 md:px-8 lg:grid-cols-4">
        {stats.loading && <Spinner />}
        {stats.error && <ErrorState message={stats.error} onRetry={stats.reload} />}
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-line p-4">
            <div className="mb-1 flex items-center gap-2 text-gray-400">
              <s.icon size={14} />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <p className="text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-6 md:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Gestion des cours</p>
          <button onClick={() => setAdding(true)} className="btn-primary !px-3 !py-2">
            <Plus size={14} /> Ajouter un cours
          </button>
        </div>

        {courses.loading && <Spinner />}
        {courses.error && <ErrorState message={courses.error} onRetry={courses.reload} />}

        {courses.data && (
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-ground text-left text-muted">
                  <th className="px-4 py-2.5 font-medium">Cours</th>
                  <th className="px-4 py-2.5 font-medium">Matiere</th>
                  <th className="px-4 py-2.5 font-medium">Niveau</th>
                  <th className="px-4 py-2.5 font-medium">Statut</th>
                  <th className="px-4 py-2.5 font-medium">Prix (FCFA)</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.data.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="px-4 py-2.5">{c.title}</td>
                    <td className="px-4 py-2.5">
                      <CategoryBadge category={c.category} />
                    </td>
                    <td className="px-4 py-2.5 text-muted">{c.level}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => patchCourse(c.id, { is_free: !c.is_free })}
                        className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium"
                        style={{
                          borderColor: c.is_free ? "#059669" : "#D1D5DB",
                          background: c.is_free ? "#D1FAE5" : "white",
                          color: c.is_free ? "#047857" : "#6B7280",
                        }}
                      >
                        {c.is_free ? <Unlock size={11} /> : <Lock size={11} />}
                        {c.is_free ? "Gratuit" : "Payant"}
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        disabled={c.is_free}
                        defaultValue={c.is_free ? 0 : c.price}
                        onBlur={(e) => {
                          const price = Number(e.target.value) || 0;
                          if (price !== c.price) patchCourse(c.id, { price });
                        }}
                        className="w-24 rounded-md border border-line-strong px-2 py-1.5 text-sm outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setManaging(c)}
                          className="text-xs font-medium text-accent"
                        >
                          Modules
                        </button>
                        <button
                          onClick={() => setEditing(c)}
                          aria-label="Modifier"
                          className="text-gray-400"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={async () => {
                            if (!window.confirm(`Supprimer « ${c.title} » ?`)) return;
                            await deleteCourse.mutate(c.id);
                            courses.setData((list) => list.filter((x) => x.id !== c.id));
                          }}
                          aria-label="Supprimer"
                          className="text-gray-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {updateCourse.error && <p className="mt-2 text-sm text-red-600">{updateCourse.error}</p>}
      </div>

      <div className="px-4 pb-10 md:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Messages de contact
        </p>
        {messages.loading && <Spinner />}
        {messages.error && <ErrorState message={messages.error} onRetry={messages.reload} />}
        <div className="flex flex-col gap-2">
          {messages.data?.length === 0 && (
            <p className="text-sm text-gray-400">Aucun message pour l'instant.</p>
          )}
          {messages.data?.map((m) => (
            <div key={m.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{m.name}</p>
                <span className="text-xs text-gray-400">
                  {new Date(m.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="text-xs text-muted">{m.email}</p>
              <p className="mt-1.5 text-sm text-gray-700">{m.message}</p>
            </div>
          ))}
        </div>
      </div>

      {adding && (
        <CourseFormModal
          onClose={() => setAdding(false)}
          saving={createCourse.loading}
          error={createCourse.error}
          onSubmit={async (payload) => {
            const created = await createCourse.mutate(payload);
            courses.setData((list) => [created, ...list]);
            setAdding(false);
            stats.reload();
          }}
        />
      )}

      {editing && (
        <CourseFormModal
          course={editing}
          onClose={() => setEditing(null)}
          saving={updateCourse.loading}
          error={updateCourse.error}
          onSubmit={async (payload) => {
            await patchCourse(editing.id, payload);
            setEditing(null);
          }}
        />
      )}

      {managing && <ModuleManagerModal course={managing} onClose={() => setManaging(null)} />}
    </div>
  );
}
