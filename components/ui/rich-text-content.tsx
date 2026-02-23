"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { stripHtml, isHtml } from "@/lib/rich-text";

export interface RichTextContentProps {
  /** HTML or plain text content */
  content: string | null | undefined;
  /** Additional class names */
  className?: string;
  /** Max lines for truncation (e.g. line-clamp-2) */
  lineClamp?: 1 | 2 | 3 | 4 | 5 | "none";
  /** Render as plain text only (no HTML) - useful for truncated previews */
  plainText?: boolean;
  /** HTML element to render as */
  as?: "div" | "p" | "span";
}

/**
 * Renders rich text (HTML from TipTap) or plain text safely.
 * Use for full display in dialogs/detail views.
 * For card previews, use plainText or stripHtml + truncate.
 */
export function RichTextContent({
  content,
  className,
  lineClamp,
  plainText = false,
  as: Component = "div",
}: RichTextContentProps) {
  if (!content || !content.trim()) return null;

  const trimmed = content.trim();

  const lineClampClass =
    lineClamp && lineClamp !== "none"
      ? { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4", 5: "line-clamp-5" }[
        lineClamp
      ]
      : undefined;

  if (plainText || !isHtml(trimmed)) {
    const text = plainText ? stripHtml(trimmed) : trimmed;
    return (
      <Component className={cn(lineClampClass, className)}>{text}</Component>
    );
  }

  return (
    <Component
      className={cn(
        "prose prose-sm max-w-none text-slate-700 prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 rich-text-content",
        lineClampClass,
        className
      )}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
}
