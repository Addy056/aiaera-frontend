import {
  useContext,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

/*
========================================
PROTECTED ROUTE
========================================
Centralized auth protection
using AuthContext only
========================================
*/

export default function ProtectedRoute({
  children,
}) {

  /*
  ========================================
  AUTH CONTEXT
  ========================================
  */
  const {
    user,
    loading,
  } =
    useContext(
      AuthContext
    );

  /*
  ========================================
  CURRENT LOCATION
  ========================================
  */
  const location =
    useLocation();

  /*
  ========================================
  LOADING SCREEN
  ========================================
  */
  if (loading) {

    return (

      <div className="min-h-screen bg-[#050816] flex items-center justify-center overflow-hidden relative">

        {/* BACKGROUND */}
        <div className="absolute top-[-150px] left-[-150px] w-[340px] h-[340px] bg-purple-600/20 blur-[160px] rounded-full"></div>

        <div className="absolute bottom-[-150px] right-[-150px] w-[340px] h-[340px] bg-blue-600/20 blur-[160px] rounded-full"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center">

          {/* SPINNER */}
          <div className="relative mb-6">

            <div className="absolute inset-0 bg-purple-500/20 blur-[30px] rounded-full"></div>

            <div className="relative w-16 h-16 rounded-full border-[5px] border-purple-500/10 border-t-purple-500 animate-spin"></div>

          </div>

          {/* TITLE */}
          <h2 className="text-white text-2xl font-bold mb-2">

            Loading Workspace...

          </h2>

          {/* DESC */}
          <p className="text-gray-400 text-sm">

            Verifying your session

          </p>

        </div>

      </div>
    );
  }

  /*
  ========================================
  USER NOT FOUND
  ========================================
  */
  if (!user) {

    console.log(
      "NO USER FOUND - REDIRECT LOGIN"
    );

    return (

      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />

    );
  }

  /*
  ========================================
  AUTHORIZED
  ========================================
  */
  return children;
}