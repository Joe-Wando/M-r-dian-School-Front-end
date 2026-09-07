import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Field from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Indique ton nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide.";
    if (form.password.length < 8) e.password = "Au moins 8 caracteres.";
    if (form.confirm !== form.password) e.confirm = "Les mots de passe ne correspondent pas.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password });
      navigate("/mes-cours", { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo variant="icon" to={null} />
        <h1 className="text-2xl font-semibold">Creer un compte</h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Nom" error={errors.name} required>
          <input
            className="field"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Mot de passe" error={errors.password} hint="8 caracteres minimum" required>
          <input
            type="password"
            autoComplete="new-password"
            className="field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <Field label="Confirmer le mot de passe" error={errors.confirm} required>
          <input
            type="password"
            autoComplete="new-password"
            className="field"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </Field>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creation…" : "Creer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Deja inscrit ?{" "}
        <Link to="/connexion" className="font-medium text-accent">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
