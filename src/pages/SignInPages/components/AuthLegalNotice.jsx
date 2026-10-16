import React from "react";
import { Link } from "react-router";

export default function AuthLegalNotice() {
  return (
    <p className="text-xs text-slate-500 text-center leading-relaxed">
      By signing in, you agree to SpillRate's{" "}
      <Link
        to="/terms"
        className="text-slate-700 hover:text-teal-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
      >
        Terms and Conditions
      </Link>{" "}
      and acknowledge our{" "}
      <Link
        to="/privacy-policy"
        className="text-slate-700 hover:text-teal-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}