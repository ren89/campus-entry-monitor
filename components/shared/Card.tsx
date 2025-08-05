import React from "react";
import { Card as BaseCard, CardContent, CardHeader } from "../ui/card";

interface CustomCardProps {
  header?: React.ReactNode | string;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  children?: React.ReactNode;
  className?: string;
}

export default function Card({
  header,
  title,
  description,
  children,
  className,
}: CustomCardProps) {
  return (
    <BaseCard className={className}>
      {(header || title || description) && (
        <CardHeader className="text-center">
          {header && (
            <div className="mb-4">
              {typeof header === "string" ? <div>{header}</div> : header}
            </div>
          )}
          
          {title && (
            <div className="text-3xl font-extrabold text-blue-900">
              {typeof title === "string" ? title : title}
            </div>
          )}
          
          {description && (
            <div className="text-blue-600">
              {typeof description === "string" ? description : description}
            </div>
          )}
        </CardHeader>
      )}

      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </BaseCard>
  );
}
