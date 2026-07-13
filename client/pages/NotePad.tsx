"use client";

import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import { Download, Upload, Copy, Trash2, Check, Sparkles, Save, Plus, Settings, FileText, Edit2, Eye, HelpCircle, Copy as CopyIcon, Scissors, RotateCcw } from "lucide-react";

export default function NotePad() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("untitled.txt");
  const [copied, setCopied] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lineNumber, setLineNumber] = useState(1);
  const [columnNumber, setColumnNumber] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const timer = setTimeout(() => {
      if (content) {
        localStorage.setItem("notepad-content", content);
        localStorage.setItem("notepad-filename", fileName);
        setLastSaved(new Date());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, fileName, autoSaveEnabled]);

  // Load saved note on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("notepad-content");
    const savedFileName = localStorage.getItem("notepad-filename");
    if (savedContent) setContent(savedContent);
    if (savedFileName) setFileName(savedFileName);
  }, []);

  const wordCount = content.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = content.length;
  const charCountNoSpaces = content.replace(/\s/g, "").length;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);

    // Calculate line and column
    const textBeforeCursor = text.substring(0, e.target.selectionStart);
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines.length;
    const currentColumn = lines[lines.length - 1].length + 1;

    setLineNumber(currentLine);
    setColumnNumber(currentColumn);
  };

  const downloadNote = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const uploadNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert("Copy manually using Ctrl+A then Ctrl+C");
      } else {
        console.error(err);
      }
    }
  };

  const clearNote = () => {
    if (content && !window.confirm("Are you sure? This cannot be undone.")) return;
    setContent("");
  };

  const newNote = () => {
    if (content && !window.confirm("Start a new note? Current note will be lost.")) return;
    setContent("");
    setFileName("untitled.txt");
  };

  return (
    <div className="min-h-screen bg-white text-[#2D4D35] flex flex-col">
      <SEO
        title="Online NotePad"
        description="Simple, fast online notepad with auto-save, file download/upload, and word counting. Write, edit, and save notes instantly."
        keywords="notepad, online notepad, text editor, note taking, online text editor"
      />

      {/* Toolbar */}
      <div className="bg-[#F0F7F0] border-b border-[#C5DCC9] flex items-center h-12 px-2 gap-0.5">
        <button
          onClick={newNote}
          className="p-2 hover:bg-[#E8F0E8] rounded transition-colors"
          title="New"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={downloadNote}
          disabled={!content}
          className="p-2 hover:bg-[#E8F0E8] rounded transition-colors disabled:opacity-30"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-[#E8F0E8] rounded transition-colors"
          title="Open"
        >
          <Upload className="w-5 h-5" />
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!content}
          className="p-2 hover:bg-[#E8F0E8] rounded transition-colors disabled:opacity-30"
          title="Copy"
        >
          <CopyIcon className="w-5 h-5" />
        </button>
        <button
          onClick={clearNote}
          disabled={!content}
          className="p-2 hover:bg-[#E8F0E8] rounded transition-colors disabled:opacity-30"
          title="Clear"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-[#E8F0E8] rounded transition-colors" title="Undo">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Text Area with Lines */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* Line Numbers */}
        <div className="w-12 bg-[#F0F7F0] border-r border-[#C5DCC9] text-[#999B99] text-xs font-mono select-none overflow-y-hidden flex-shrink-0">
          {content.split("\n").map((_, i) => (
            <div key={i} className="px-2 text-right" style={{ height: "24px", lineHeight: "24px" }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Lines Background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 23px,
                #C5DCC9 23px,
                #C5DCC9 24px
              )`,
              backgroundPosition: "0 0",
            }}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            placeholder="Start typing your notes here..."
            className="relative w-full h-full px-4 pb-4 bg-transparent text-[#2D4D35] focus:outline-none resize-none font-mono text-sm border-0"
            spellCheck="false"
            style={{
              lineHeight: "24px",
              color: "#2D4D35",
            }}
          />

        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#F0F7F0] border-t border-[#C5DCC9] flex items-center h-8 px-4 gap-6 text-xs text-[#4A6857]">
        <div className="flex gap-4">
          <span>Line {lineNumber}, Column {columnNumber}</span>
        </div>
        <div className="flex gap-4 ml-auto">
          <span>Chars {charCount}, Words {wordCount}</span>
          {autoSaveEnabled && lastSaved && (
            <span className="text-[#10A968]">Auto-saved {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.js,.html,.css,.json,.xml"
        onChange={uploadNote}
        className="hidden"
      />
    </div>
  );
}
