import React from "react";
import { VenmoIcon, LinkedInIcon } from "./icons.js";

export default function Popup() {
  return (
    <div
      className="flex flex-col items-center justify-center bg-white text-gray-800"
      style={{ width: "300px", height: "200px", padding: "16px" }}
    >
      <p className="text-sm font-medium text-center mb-4">
        🎓 Ratings should be viewable on ONE.UF!
      </p>

      <div className="flex flex-row justify-center items-center gap-4">
        <VenmoIcon />
        <LinkedInIcon />
      </div>
    </div>
  );
}