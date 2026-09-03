"use client";

import React, { useState } from "react";
import { Copy, Check, Calculator } from "lucide-react";

interface MarkdownMessageProps {
  content: string;
  isStreaming?: boolean;
}

function cleanLatexFormula(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();

  // Remove wrapping brackets or delimiters
  s = s.replace(/^\\\[\s*/, "").replace(/\s*\\\]$/, "");
  s = s.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, "");
  s = s.replace(/^\\\(\s*/, "").replace(/\s*\\\)$/, "");
  s = s.replace(/^\$\s*/, "").replace(/\s*\$$/, "");

  // Clean LaTeX macro commands
  s = s.replace(/\\text\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathbf\{([^}]+)\}/g, "$1");
  s = s.replace(/\\textbf\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathit\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");
  
  // Clean mathematical operators & symbols
  s = s.replace(/\\times/g, "×");
  s = s.replace(/\\cdot/g, "·");
  s = s.replace(/\\div/g, "÷");
  s = s.replace(/\\pm/g, "±");
  s = s.replace(/\\approx/g, "≈");
  s = s.replace(/\\le(q)?/g, "≤");
  s = s.replace(/\\ge(q)?/g, "≥");
  s = s.replace(/\\ne(q)?/g, "≠");
  s = s.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");
  s = s.replace(/\\sum/g, "∑");
  s = s.replace(/\\%/g, "%");
  s = s.replace(/\\quad/g, "  ");
  s = s.replace(/\\qquad/g, "    ");
  s = s.replace(/\\,/g, " ");
  s = s.replace(/\\;/g, " ");
  s = s.replace(/\\left\(/g, "(");
  s = s.replace(/\\right\)/g, ")");
  s = s.replace(/\\left\[/g, "[");
  s = s.replace(/\\right\]/g, "]");
  s = s.replace(/\\left\{/g, "{");
  s = s.replace(/\\right\}/g, "}");

  return s.trim();
}

export default function MarkdownMessage({ content, isStreaming = false }: MarkdownMessageProps) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const renderFormattedText = (text: string) => {
    // Clean inline LaTeX equations like \( ... \) or $ ... $
    const cleanedText = text
      .replace(/\\\((.*?)\\\)/g, (_, eq) => ` ${cleanLatexFormula(eq)} `)
      .replace(/(?<!\$)\$(?!\$)(.*?)\$(?!\$)/g, (_, eq) => ` ${cleanLatexFormula(eq)} `);

    // Process bold, inline code, links, and inline citations like [1], [2]
    const parts = cleanedText.split(/(\*\*.*?\*\*|`.*?`|\[\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={i} className="font-bold text-[#18181b]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && !part.startsWith("```") && part.length >= 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#18181b] font-mono text-[13px] border border-[#e4e4e7]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (/^\[\d+\]$/.test(part)) {
        const citationNum = part.slice(1, -1);
        return (
          <span
            key={i}
            title={`Source Citation [${citationNum}] - Verified prospectus chunk`}
            className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/90 border border-teal-200 rounded-md cursor-pointer transition-colors align-baseline select-none"
          >
            [{citationNum}]
          </span>
        );
      }
      return part;
    });
  };

  const parseBlocks = () => {
    const lines = content.split("\n");
    const blocks: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableBuffer: string[] = [];
    let inMathBlock = false;
    let mathBuffer: string[] = [];
    let blockIndex = 0;

    const flushTable = () => {
      if (tableBuffer.length === 0) return;
      const rows = tableBuffer
        .map((r) => r.trim())
        .filter((r) => r.startsWith("|") && r.endsWith("|"));
      if (rows.length > 0) {
        const headerRow = rows[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        const dataRows = rows.slice(2).map((r) =>
          r
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );

        blocks.push(
          <div key={`table-${blockIndex++}`} className="my-3 overflow-x-auto rounded-xl border border-[#e4e4e7]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f4f5] border-b border-[#e4e4e7]">
                  {headerRow.map((h, hi) => (
                    <th key={hi} className="py-2 px-3.5 font-bold text-[#18181b]">
                      {renderFormattedText(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f5] bg-white">
                {dataRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-[#fafafa] transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3.5 text-[#3f3f46]">
                        {renderFormattedText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableBuffer = [];
      inTable = false;
    };

    const flushCodeBlock = () => {
      if (codeBuffer.length === 0) return;
      const codeText = codeBuffer.join("\n");
      const currentIndex = blockIndex++;
      blocks.push(
        <div key={`code-${currentIndex}`} className="my-3 rounded-2xl overflow-hidden border border-[#27272a] bg-[#18181b] text-white">
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#27272a] text-[11px] font-mono text-[#a1a1aa]">
            <span>{codeLanguage || "code"}</span>
            <button
              type="button"
              onClick={() => handleCopyCode(codeText, currentIndex)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              {copiedCodeIndex === currentIndex ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono text-[#e4e4e7] leading-relaxed">
            <code>{codeText}</code>
          </pre>
        </div>
      );
      codeBuffer = [];
      inCodeBlock = false;
    };

    const flushMathBlock = () => {
      if (mathBuffer.length === 0) return;
      const rawFormula = mathBuffer.join(" ").trim();
      const cleaned = cleanLatexFormula(rawFormula);
      if (cleaned) {
        blocks.push(
          <div
            key={`math-${blockIndex++}`}
            className="my-3 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-center font-mono font-semibold text-[13px] sm:text-sm text-[#0f172a] shadow-2xs flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 text-[#64748b] flex-shrink-0" />
            <span className="break-words select-all">{cleaned}</span>
          </div>
        );
      }
      mathBuffer = [];
      inMathBlock = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Math Block Detection (\[ ... \] or $$ ... $$)
      if (trimmed === "\\[" || trimmed === "$$") {
        if (!inMathBlock) {
          if (inTable) flushTable();
          inMathBlock = true;
          mathBuffer = [];
        } else {
          flushMathBlock();
        }
        continue;
      }
      if (trimmed === "\\]" || (inMathBlock && trimmed === "$$")) {
        flushMathBlock();
        continue;
      }
      if (inMathBlock) {
        mathBuffer.push(line);
        continue;
      }

      // Single line LaTeX block like \[ \text{FSC} = 90% \]
      if ((trimmed.startsWith("\\[") && trimmed.endsWith("\\]")) || (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4)) {
        const cleaned = cleanLatexFormula(trimmed);
        if (cleaned) {
          blocks.push(
            <div
              key={`math-${blockIndex++}`}
              className="my-3 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-center font-mono font-semibold text-[13px] sm:text-sm text-[#0f172a] shadow-2xs flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#64748b] flex-shrink-0" />
              <span className="break-words select-all">{cleaned}</span>
            </div>
          );
        }
        continue;
      }

      // Code Block Detection
      if (trimmed.startsWith("```")) {
        if (!inCodeBlock) {
          if (inTable) flushTable();
          inCodeBlock = true;
          codeLanguage = trimmed.slice(3).trim();
          codeBuffer = [];
        } else {
          flushCodeBlock();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Table Detection
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        inTable = true;
        tableBuffer.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Headings
      if (line.startsWith("### ")) {
        blocks.push(
          <h3 key={blockIndex++} className="font-bold text-base text-[#18181b] mt-4 mb-1.5 tracking-tight flex items-center gap-2">
            {renderFormattedText(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        blocks.push(
          <h2 key={blockIndex++} className="font-bold text-lg text-[#18181b] mt-5 mb-2 tracking-tight">
            {renderFormattedText(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        blocks.push(
          <h1 key={blockIndex++} className="font-extrabold text-xl text-[#18181b] mt-6 mb-2 tracking-tight">
            {renderFormattedText(line.slice(2))}
          </h1>
        );
      } else if (line.startsWith("> ")) {
        blocks.push(
          <blockquote key={blockIndex++} className="my-2 pl-3.5 border-l-2 border-[#18181b] text-xs text-[#52525b] italic bg-[#fafafa] py-1 rounded-r-lg">
            {renderFormattedText(line.slice(2))}
          </blockquote>
        );
      } else if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletText = trimmed.replace(/^[•\-\*]\s*/, "");
        blocks.push(
          <div key={blockIndex++} className="flex items-start gap-2.5 my-1 ml-1 text-sm text-[#27272a] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] mt-2 flex-shrink-0" />
            <div className="flex-1">{renderFormattedText(bulletText)}</div>
          </div>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s*(.*)/);
        const num = match ? match[1] : "1";
        const rest = match ? match[2] : line;
        blocks.push(
          <div key={blockIndex++} className="flex items-start gap-2.5 my-1 ml-1 text-sm text-[#27272a] leading-relaxed">
            <span className="font-mono font-bold text-xs text-[#71717a] mt-0.5 w-4 flex-shrink-0 text-right">
              {num}.
            </span>
            <div className="flex-1">{renderFormattedText(rest)}</div>
          </div>
        );
      } else if (trimmed === "") {
        blocks.push(<div key={blockIndex++} className="h-1.5" />);
      } else {
        blocks.push(
          <p key={blockIndex++} className="text-sm text-[#27272a] leading-relaxed my-1">
            {renderFormattedText(line)}
          </p>
        );
      }
    }

    // Flush any unclosed blocks
    if (inMathBlock) {
      flushMathBlock();
    }
    if (inCodeBlock) {
      flushCodeBlock();
    }
    if (inTable) {
      flushTable();
    }

    return blocks;
  };

  return (
    <div className="space-y-1 text-sm">
      {parseBlocks()}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-[#18181b] ml-1 rounded-xs animate-pulse align-middle" />
      )}
    </div>
  );
}
