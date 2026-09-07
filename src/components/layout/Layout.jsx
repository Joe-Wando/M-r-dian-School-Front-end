import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ withFooter = true }) {
  return (
    <div className="flex min-h-full flex-col bg-ground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {withFooter && <Footer />}
    </div>
  );
}
