"use client";

import React from "react";
import NotFound from "@/pages/NotFound";

/**
 * RoomsTab is intentionally not implemented in detail yet.
 * Per request, tabs without detailed description should show 404.
 */
const RoomsTab: React.FC = () => {
  return <NotFound />;
};

export default RoomsTab;