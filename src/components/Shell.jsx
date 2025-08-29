import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Shell() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
