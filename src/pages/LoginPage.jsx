import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/ui/AuthShell";
import Field from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { USE_MOCKS } from "../api/client";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/mes-cours";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide.";
    if (form.password.length < 6) e.password = "Au moins 6 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Connexion">
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Mot de passe" error={errors.password} required>
          <input
            type="password"
            autoComplete="current-password"
            className="field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button type="submit" className="btn-primary mt-2 !py-4" disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-muted md:text-left">
        Pas encore de compte ?{" "}
        <Link to="/inscription" className="font-medium text-accent">
          Creer un compte
        </Link>
      </p>

      {USE_MOCKS && (
        <p className="rounded-2xl bg-accent-soft px-4 py-3 text-center text-xs font-medium text-accent">
          Demo — admin@meredian.dev / admin1234 · demo@meredian.dev / demo1234
        </p>
      )}
    </AuthShell>
  );
}
