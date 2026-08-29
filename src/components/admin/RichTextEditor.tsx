"use client";

import { useRef, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

function insertMarkdown(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const text = selected || placeholder;

  const newText =
    textarea.value.substring(0, start) +
    before +
    text +
    after +
    textarea.value.substring(end);

  // Set the new value
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(textarea, newText);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  // Restore cursor position
  const newStart = start + before.length;
  const newEnd = newStart + text.length;
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(newStart, newEnd);
  });
}

function insertLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string,
  placeholder: string
) {
  const start = textarea.selectionStart;
  const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1;
  const text = textarea.value.substring(lineStart, start);

  // If line already starts with prefix, remove it
  if (text.startsWith(prefix)) {
    const newText =
      textarea.value.substring(0, lineStart) +
      textarea.value.substring(lineStart + prefix.length);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(textarea, newText);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start - prefix.length,
        start - prefix.length
      );
    });
    return;
  }

  const newText =
    textarea.value.substring(0, lineStart) +
    prefix +
    textarea.value.substring(lineStart);
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(textarea, newText);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, start + prefix.length);
  });
}

const buttons = [
  {
    label: "B",
    title: "Bold",
    className: "font-bold",
    action: (ta: HTMLTextAreaElement) =>
      insertMarkdown(ta, "**", "**", "bold text"),
  },
  {
    label: "I",
    title: "Italic",
    className: "italic",
    action: (ta: HTMLTextAreaElement) =>
      insertMarkdown(ta, "*", "*", "italic text"),
  },
  { type: "separator" as const },
  {
    label: "H2",
    title: "Heading 2",
    className: "text-xs font-bold",
    action: (ta: HTMLTextAreaElement) =>
      insertLinePrefix(ta, "## ", "Heading"),
  },
  {
    label: "H3",
    title: "Heading 3",
    className: "text-xs font-bold",
    action: (ta: HTMLTextAreaElement) =>
      insertLinePrefix(ta, "### ", "Heading"),
  },
  { type: "separator" as const },
  {
    label: "🔗",
    title: "Link",
    className: "",
    action: (ta: HTMLTextAreaElement) =>
      insertMarkdown(ta, "[", "](https://)", "link text"),
  },
  {
    label: "•",
    title: "Bullet List",
    className: "text-lg leading-none",
    action: (ta: HTMLTextAreaElement) =>
      insertLinePrefix(ta, "- ", "List item"),
  },
  {
    label: "1.",
    title: "Numbered List",
    className: "text-xs",
    action: (ta: HTMLTextAreaElement) =>
      insertLinePrefix(ta, "1. ", "List item"),
  },
  {
    label: "❝",
    title: "Quote",
    className: "text-lg leading-none",
    action: (ta: HTMLTextAreaElement) =>
      insertLinePrefix(ta, "> ", "Quote text"),
  },
  { type: "separator" as const },
  {
    label: "---",
    title: "Horizontal Rule",
    className: "text-xs",
    action: (ta: HTMLTextAreaElement) => {
      const start = ta.selectionStart;
      const prefix = ta.value[start - 1] === "\n" || start === 0 ? "" : "\n";
      const newText =
        ta.value.substring(0, start) + prefix + "\n---\n" + ta.value.substring(start);
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(ta, newText);
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length + 5, start + prefix.length + 5);
      });
    },
  },
];

export function RichTextEditor({
  value,
  onChange,
  rows = 16,
  placeholder = "Write your article content here...",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = useCallback(
    (action: (ta: HTMLTextAreaElement) => void) => {
      if (textareaRef.current) {
        action(textareaRef.current);
      }
    },
    []
  );

  return (
    <div className="rounded-lg border border-surface-300 dark:border-surface-700 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex-wrap">
        {buttons.map((btn, i) => {
          if ("type" in btn && btn.type === "separator") {
            return (
              <div
                key={`sep-${i}`}
                className="w-px h-5 bg-surface-300 dark:bg-surface-600 mx-1"
              />
            );
          }
          return (
            <button
              key={btn.title}
              type="button"
              title={btn.title}
              onClick={() => handleClick(btn.action)}
              className={`px-2 py-1 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white rounded transition-colors ${btn.className}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-base bg-white text-surface-900 placeholder:text-surface-400 border-0 focus:outline-none dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 resize-y font-mono text-sm leading-relaxed"
      />

      {/* Help text */}
      <div className="px-3 py-1.5 bg-surface-50 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-400 dark:text-surface-500">
          Supports <strong>Markdown</strong>: **bold**, *italic*, ## headings, - lists, &gt; quotes, [links](url)
        </p>
      </div>
    </div>
  );
}
