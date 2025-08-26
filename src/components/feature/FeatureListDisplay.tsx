"use client";

import React from "react";
import { FeatureBlock } from "./FeatureBlockEditor";
import { Check } from "lucide-react";

type Props = {
  block: FeatureBlock;
};

const FeatureListDisplay: React.FC<Props> = ({ block }) => {
  if (!block) return null;

  const items = block.items.filter((it) => it.visible);

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          {block.title && <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{block.title}</h2>}
          {block.subtitle && <p className="text-sm text-muted-foreground mb-4">{block.subtitle}</p>}

          <ul
            className={`grid gap-3 ${
              block.layout === "two" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {items.map((it) => (
              <li key={it.id} className="flex items-start gap-3 p-2">
                <div className={`mt-1 p-2 rounded ${it.highlighted ? "bg-orange-100" : "bg-green-50"}`}>
                  <Check className={`h-5 w-5 ${it.highlighted ? "text-orange-500" : "text-green-600"}`} aria-hidden />
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{it.content}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeatureListDisplay;