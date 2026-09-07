import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";

import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
import AccompagnementPage from "./pages/AccompagnementPage";
import ProfilPage from "./pages/ProfilPage";
import ContactPage from "./pages/ContactPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/cours/:id" element={<CourseDetailPage />} />
        <Route path="/accompagnement" element={<AccompagnementPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route
          path="/mes-cours"
          element={
            <RequireAuth>
              <MyCoursesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboardPage />
            </RequireAdmin>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* La lecture d'un cours occupe tout l'ecran (pas de footer). */}
      <Route element={<Layout withFooter={false} />}>
        <Route
          path="/cours/:id/apprendre"
          element={
            <RequireAuth>
              <CoursePlayerPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
