import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const canUseOutput = output && output !== "invalid json";

  const hasInput = input.trim().length > 0;

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  function loadSample() {
    const compact = '{"name":"DevToolsHub","version":"1.0.0"}';

    setInput(compact);

    try {
      const parsed = JSON.parse(compact);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function downloadJson() {
    if (!canUseOutput) {
      return;
    }

    const file = new Blob([output], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "formatted.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function clear() {
    setInput("");
    setOutput("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Input JSON
            </label>

            <button
              type="button"
              onClick={loadSample}
              className="text-xs font-medium text-blue-500 transition-colors hover:text-blue-400"
            >
              Sample
            </button>
          </div>

          <textarea
            className="custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-white outline-none transition-colors focus:border-blue-500/50"
            rows={15}
            placeholder='Paste your JSON here (e.g. {"name": "DevToolsHub"})'
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Formatted Output
            </label>
          </div>

          <div className="relative group">
            <textarea
              readOnly
              className="custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none"
              rows={15}
              value={output}
            />

            {canUseOutput && (
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  type="button"
                  onClick={downloadJson}
                  className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Download
                </button>

                <button
                  type="button"
                  onClick={copyOutput}
                  className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          disabled={!hasInput}
          onClick={formatJson}
          className={`rounded-full px-8 py-3 font-semibold text-white transition-all active:scale-95 ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : "bg-neutral-700 cursor-not-allowed opacity-50"
          }`}
        >
          Format JSON
        </button>
        {/* only show clear if any output - even for error */}
        {output && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-neutral-600 px-8 py-3 font-semibold text-white transition-all hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-500/20 active:scale-95"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
