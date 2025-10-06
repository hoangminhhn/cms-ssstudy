"use client";

import React from "react";
import StatTile from "./StatTile";
import { AlertTriangle, MessageSquare, Shield, CheckCircle2 } from "lucide-react";

export type StatItem = {
  id: string;
  icon: React.ElementType;
  count: number;
  title: string;
  subtitle?: string;
};

interface ModerationStatsProps {
  items: StatItem[];
  onSelect?: (id: string | null) => void;
  selectedId?: string | null;
}

const ModerationStats: React.FC<ModerationStatsProps> = ({ items, onSelect, selectedId = null }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <StatTile
          key={it.id}
          icon={it.icon}
          count={it.count}
          title={it.title}
          subtitle={it.subtitle}
          active={selectedId === it.id}
          onClick={() => onSelect?.(selectedId === it.id ? null : it.id)}
        />
      ))}
    </div>
  );
};

export default ModerationStats;