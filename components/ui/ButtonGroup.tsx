"use client";
import { Children, cloneElement, ReactElement } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface iAppProps {
  className?: string;
  children: ReactElement<React.ComponentProps<typeof Button>>[];
}

export function ButtonGroup({ className, children }: iAppProps) {
  const totalButtons = Children.count(children);
  return (
    <div className={cn("flex w-full", className)}>
      {children.map((child, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === totalButtons - 1;
        return cloneElement(child, {
          key: index,
          className: cn(
            {
              "rounded-l-none": !isFirstItem,
              "rounded-r-none": !isLastItem,
              "border-l-0": !isFirstItem,
            },
            child.props.className
          ),
        });
      })}
    </div>
  );
}
