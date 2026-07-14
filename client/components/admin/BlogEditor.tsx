"use client";

import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BlogEditor({ value, onChange, placeholder }: BlogEditorProps) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      height: 500,
      minHeight: 400,
      maxHeight: 800,
      readonly: false,
      placeholder: placeholder || "Write your blog content here...",
      theme: "default",
      uploader: {
        insertImageAsBase64URI: true,
      },
      toolbar: true,
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "superscript",
        "subscript",
        "|",
        "ul",
        "ol",
        "indent",
        "outdent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "link",
        "table",
        "|",
        "hr",
        "eraser",
        "clearFormatting",
        "|",
        "undo",
        "redo",
        "|",
        "fullsize",
        "source",
      ],
      buttonsMD: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "image",
        "link",
        "|",
        "fullsize",
        "source",
      ],
      buttonsSM: [
        "bold",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "fullsize",
      ],
      buttonsXS: [
        "bold",
        "italic",
        "|",
        "fullsize",
      ],
      toolbarButtonSize: "middle",
      textIcons: false,
      defaultActionOnPaste: "insert_as_html",
      defaultLineHeight: 1.5,
      enter: "div",
      spellcheck: true,
    } as any),
    []
  );

  return (
    <div className="jodit-editor-wrapper">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => onChange(newContent)}
      />
      <style jsx global>{`
        .jodit-container {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 0.75rem !important;
          color: #1f2937 !important;
        }

        .jodit-container.jodit_active {
          border-color: #60b044 !important;
        }

        .jodit-toolbar {
          background: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }

        .jodit-toolbar__box {
          background: #f8fafc !important;
        }

        .jodit-toolbar-button {
          color: #64748b !important;
        }

        .jodit-toolbar-button:hover {
          background: #e2e8f0 !important;
          color: #1f2937 !important;
        }

        .jodit-toolbar-button.jodit_disabled {
          opacity: 0.5 !important;
        }

        .jodit-toolbar-button.active {
          background: #4a8f3a !important;
          color: #1f2937 !important;
        }

        .jodit-wysiwyg {
          background: #ffffff !important;
          color: #1f2937 !important;
          padding: 1.5rem !important;
          min-height: 400px !important;
        }

        .jodit-wysiwyg_top_border {
          border-top: 1px solid #e2e8f0 !important;
        }

        .jodit-wysiwyg a {
          color: #4a8f3a !important;
        }

        .jodit-wysiwyg a:hover {
          color: #3d7a2e !important;
        }

        .jodit-status-bar {
          background: #f8fafc !important;
          border-top: 1px solid #e2e8f0 !important;
          color: #64748b !important;
        }

        .jodit-popup {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          color: #1f2937 !important;
        }

        .jodit-popup__header {
          background: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
          color: #1f2937 !important;
        }

        .jodit-popup input[type="text"],
        .jodit-popup input[type="url"],
        .jodit-popup textarea,
        .jodit-popup select {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          color: #1f2937 !important;
        }

        .jodit-popup input[type="text"]:focus,
        .jodit-popup input[type="url"]:focus,
        .jodit-popup textarea:focus,
        .jodit-popup select:focus {
          border-color: #60b044 !important;
          outline: none !important;
        }

        .jodit-dialog button {
          background: #4a8f3a !important;
          color: #1f2937 !important;
          border: none !important;
        }

        .jodit-dialog button:hover {
          background: #3d7a2e !important;
        }

        .jodit-dialog button.jodit_button_cancel {
          background: #e2e8f0 !important;
        }

        .jodit-dialog button.jodit_button_cancel:hover {
          background: #cbd5e1 !important;
        }

        /* Ensure proper sizing on all screens */
        .jodit-container {
          width: 100% !important;
        }

        .jodit-wysiwyg {
          font-family: system-ui, -apple-system, sans-serif !important;
          line-height: 1.6 !important;
        }

        .jodit-wysiwyg h1,
        .jodit-wysiwyg h2,
        .jodit-wysiwyg h3,
        .jodit-wysiwyg h4,
        .jodit-wysiwyg h5,
        .jodit-wysiwyg h6 {
          color: #1f2937 !important;
          margin-top: 1em !important;
          margin-bottom: 0.5em !important;
        }

        .jodit-wysiwyg h1 {
          font-size: 2em !important;
        }

        .jodit-wysiwyg h2 {
          font-size: 1.5em !important;
        }

        .jodit-wysiwyg h3 {
          font-size: 1.25em !important;
        }

        .jodit-wysiwyg code {
          background: #f8fafc !important;
          color: #4a8f3a !important;
          padding: 0.25em 0.5em !important;
          border-radius: 0.25rem !important;
          font-family: "Monaco", "Courier New", monospace !important;
        }

        .jodit-wysiwyg pre {
          background: #f8fafc !important;
          color: #64748b !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          border-left: 4px solid #4a8f3a !important;
        }

        .jodit-wysiwyg blockquote {
          border-left: 4px solid #4a8f3a !important;
          padding-left: 1rem !important;
          color: #64748b !important;
          font-style: italic !important;
          margin: 1em 0 !important;
        }

        .jodit-wysiwyg img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1em 0 !important;
        }

        .jodit-wysiwyg table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1em 0 !important;
        }

        .jodit-wysiwyg table td,
        .jodit-wysiwyg table th {
          border: 1px solid #e2e8f0 !important;
          padding: 0.75rem !important;
          text-align: left !important;
        }

        .jodit-wysiwyg table th {
          background: #f8fafc !important;
          color: #1f2937 !important;
          font-weight: 600 !important;
        }

        .jodit-wysiwyg table tr:hover {
          background: #f8fafc !important;
        }

        .jodit-wysiwyg ul,
        .jodit-wysiwyg ol {
          margin: 1em 0 !important;
          padding-left: 2em !important;
        }

        .jodit-wysiwyg li {
          margin: 0.5em 0 !important;
        }

        .jodit-wysiwyg hr {
          border: none !important;
          border-top: 1px solid #e2e8f0 !important;
          margin: 2em 0 !important;
        }
      `}</style>
    </div>
  );
}
