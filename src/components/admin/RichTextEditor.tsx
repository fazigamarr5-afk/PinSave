"use client";

import { useRef, useCallback, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

// Convert HTML from MS Word/Google Docs to Markdown
function htmlToMarkdown(html: string): string {
  let md = html;

  // Step 1: Remove MS Office junk BEFORE any processing
  // Remove <xml> blocks (Word namespace declarations)
  md = md.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
  // Remove <style> blocks
  md = md.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove Word namespace tags like <w:sdt>, <w:body>, <o:p>, etc.
  md = md.replace(/<\/?[a-z]+:[^>]+>/gi, "");
  // Remove VML tags
  md = md.replace(/<v:[^>]+>[\s\S]*?<\/v:[^>]+>/gi, "");
  md = md.replace(/<o:[^>]+>[\s\S]*?<\/o:[^>]+>/gi, "");
  md = md.replace(/<w:[^>]+>[\s\S]*?<\/w:[^>]+>/gi, "");
  // Remove <!--[if ...]> blocks
  md = md.replace(/<!--[\s\S]*?-->/gi, "");
  // Remove MSO-specific class styles and meta tags
  md = md.replace(/<meta[^>]+>/gi, "");
  md = md.replace(/<link[^>]+>/gi, "");
  // Remove empty divs and spans that Word creates
  md = md.replace(/<div[^>]*>\s*<\/div>/gi, "");
  md = md.replace(/<span[^>]*>\s*<\/span>/gi, "");

  // Step 2: Decode HTML entities
  md = md.replace(/&nbsp;/g, " ");
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&#8217;/g, "'");
  md = md.replace(/&#8220;/g, '"');
  md = md.replace(/&#8221;/g, '"');
  md = md.replace(/&#8211;/g, "-");
  md = md.replace(/&#8212;/g, "--");

  // Step 3: Convert block elements to newlines
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<\/p>/gi, "\n\n");
  md = md.replace(/<\/div>/gi, "\n");
  md = md.replace(/<\/h1>/gi, "\n\n");
  md = md.replace(/<\/h2>/gi, "\n\n");
  md = md.replace(/<\/h3>/gi, "\n\n");
  md = md.replace(/<\/h4>/gi, "\n\n");
  md = md.replace(/<\/li>/gi, "\n");
  md = md.replace(/<\/tr>/gi, "\n");
  md = md.replace(/<\/td>/gi, " | ");
  md = md.replace(/<hr[^>]*>/gi, "\n---\n");
  md = md.replace(/<li[^>]*>/gi, "- ");

  // Step 4: Headings
  md = md.replace(/<h1[^>]*>/gi, "# ");
  md = md.replace(/<h2[^>]*>/gi, "## ");
  md = md.replace(/<h3[^>]*>/gi, "### ");
  md = md.replace(/<h4[^>]*>/gi, "#### ");

  // Step 5: Bold and italic (handle nested)
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, "*$2*");

  // Step 6: Links and images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Step 7: Inline code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Step 8: Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content: string) => {
    return content
      .split("\n")
      .map((line: string) => "> " + line.trim())
      .join("\n");
  });

  // Step 9: Remove ALL remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Step 10: Decode any remaining entities
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");

  // Step 11: Clean up
  // Remove lines that are only whitespace or CSS-like content
  md = md.split("\n").filter((line: string) => {
    const trimmed = line.trim();
    // Skip empty lines, CSS, JS, or Word artifacts
    if (!trimmed) return true;
    if (/^[{};:.,\s]+$/.test(trimmed)) return false;
    if (/^\d+$/.test(trimmed)) return false;
    if (/^(true|false|EN-US|X-NONE|Normal)$/i.test(trimmed)) return false;
    if (trimmed.length < 2 && /^[\s\d]+$/.test(trimmed)) return false;
    return true;
  }).join("\n");

  // Clean up excessive newlines
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();

  return md;
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

  const scrollTop = textarea.scrollTop;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(textarea, newText);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  const newStart = start + before.length;
  const newEnd = newStart + text.length;
  requestAnimationFrame(() => {
    textarea.scrollTop = scrollTop;
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

  if (text.startsWith(prefix)) {
    const newText =
      textarea.value.substring(0, lineStart) +
      textarea.value.substring(lineStart + prefix.length);
    const scrollTop = textarea.scrollTop;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(textarea, newText);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    requestAnimationFrame(() => {
      textarea.scrollTop = scrollTop;
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
  const scrollTop = textarea.scrollTop;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(textarea, newText);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  requestAnimationFrame(() => {
    textarea.scrollTop = scrollTop;
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
    label: "🖼️",
    title: "Upload Image",
    className: "",
    action: () => {}, // handled separately
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
      const scrollTop = ta.scrollTop;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(ta, newText);
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      requestAnimationFrame(() => {
        ta.scrollTop = scrollTop;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = useCallback(
    (action: (ta: HTMLTextAreaElement) => void) => {
      if (textareaRef.current) {
        action(textareaRef.current);
      }
    },
    []
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !textareaRef.current) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        const markdown = `![${alt}](${data.url})`;

        const ta = textareaRef.current;
        const start = ta.selectionStart;
        const newText =
          ta.value.substring(0, start) +
          (start > 0 && ta.value[start - 1] !== "\n" ? "\n" : "") +
          markdown +
          "\n" +
          ta.value.substring(start);

        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        nativeSetter?.call(ta, newText);
        ta.dispatchEvent(new Event("input", { bubbles: true }));

        const newCursor = start + markdown.length + 2;
        requestAnimationFrame(() => {
          ta.focus();
          ta.setSelectionRange(newCursor, newCursor);
        });
      } catch (err: any) {
        alert(err.message || "Failed to upload image");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    []
  );

  // Handle paste from MS Office / Google Docs
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const html = e.clipboardData.getData("text/html");
      const plainText = e.clipboardData.getData("text/plain");

      // Word/Office HTML is too messy to reliably convert.
      // Use the plain text version from clipboard instead —
      // it preserves paragraph breaks and is clean.
      // The toolbar buttons (B, I, H2, etc.) handle formatting.
      if (html && plainText && plainText.trim().length > 0) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const cleanText = plainText.replace(/\r\n/g, "\n");
        const newText =
          textarea.value.substring(0, start) +
          cleanText +
          textarea.value.substring(end);

        const scrollTop = textarea.scrollTop;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(textarea, newText);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));

        const newCursor = start + cleanText.length;
        requestAnimationFrame(() => {
          textarea.scrollTop = scrollTop;
          textarea.focus();
          textarea.setSelectionRange(newCursor, newCursor);
        });
      }
      // Plain text paste — let browser handle it normally
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
          if (btn.title === "Upload Image") {
            return (
              <button
                key={btn.title}
                type="button"
                title={uploading ? "Uploading..." : "Upload Image"}
                disabled={uploading}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`px-2 py-1 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white rounded transition-colors ${uploading ? "opacity-50 cursor-wait" : ""}`}
              >
                {uploading ? "⏳" : btn.label}
              </button>
            );
          }
          return (
            <button
              key={btn.title}
              type="button"
              title={btn.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleClick(btn.action)}
              className={`px-2 py-1 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white rounded transition-colors ${btn.className}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Textarea — tall with proper scrolling */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white text-surface-900 placeholder:text-surface-400 border-0 focus:outline-none dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 font-mono text-sm leading-relaxed"
        style={{ minHeight: "400px", resize: "vertical" }}
      />

      {/* Help text */}
      <div className="px-3 py-1.5 bg-surface-50 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-400 dark:text-surface-500">
          Supports <strong>Markdown</strong>: **bold**, *italic*, ## headings, - lists, &gt; quotes, [links](url), ![images](url) — click 🖼️ to upload
        </p>
      </div>
    </div>
  );
}
