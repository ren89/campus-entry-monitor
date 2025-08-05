import React from "react";

export interface StatCard {
  title: string;
  value: string | number;
  color?: string;
}

interface StatsCardsProps {
  cards: StatCard[];
  columns?: 1 | 2 | 3 | 4;
}

export function StatsCards({ cards, columns = 3 }: StatsCardsProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {card.title}
          </h3>
          <p className={`text-3xl font-bold ${card.color || "text-primary"}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
