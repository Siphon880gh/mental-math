type Block =
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string }
  | { type: "quote"; text: string };

function inline(text: string) {
  const parts: Array<{ t: string; bold?: boolean }> = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index) });
    parts.push({ t: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ t: text.slice(last) });
  return parts.map((part, i) =>
    part.bold ? <strong key={i}>{part.t}</strong> : <span key={i}>{part.t}</span>,
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks: Block[] = [];
  for (const raw of source.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (line.startsWith("### ")) blocks.push({ type: "h", level: 3, text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ type: "h", level: 2, text: line.slice(3) });
    else if (line.startsWith("# ")) blocks.push({ type: "h", level: 1, text: line.slice(2) });
    else if (line.startsWith("> ")) blocks.push({ type: "quote", text: line.slice(2) });
    else if (line.startsWith("- ")) blocks.push({ type: "li", text: line.slice(2) });
    else if (/^\|.+\|$/.test(line) || /^[-| :]+$/.test(line)) continue;
    else blocks.push({ type: "p", text: line });
  }

  return (
    <div className="md">
      {blocks.map((block, i) => {
        if (block.type === "h" && block.level === 1) return <h1 key={i}>{block.text}</h1>;
        if (block.type === "h" && block.level === 2) return <h2 key={i}>{block.text}</h2>;
        if (block.type === "h") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "quote") return <blockquote key={i}>{inline(block.text)}</blockquote>;
        if (block.type === "li") return <li key={i}>{inline(block.text)}</li>;
        return <p key={i}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
