import { useState } from "react";

const CATEGORIES = [
  "Productivity",
  "Design & Graphics",
  "Development",
  "Writing & Docs",
  "Privacy",
  "Utilities",
  "Data & Analytics",
  "Media",
];

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    tags: "",
    github: "",
    category: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, description, url, category } = form;
    if (!name.trim() || !description.trim() || !url.trim() || !category) {
      setErrorMsg("NAME, DESCRIPTION, URL, and CATEGORY are required.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        github: form.github.trim(),
        category: form.category,
      };

      const res = await fetch(
        "https://fcksignups-submit.abdullahalkafajy.workers.dev/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || `HTTP ${res.status}`,
        );
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Submission failed. Try again.",
      );
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
      url: "",
      tags: "",
      github: "",
      category: "",
    });
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            SUBMIT_<span className="modal-title-accent">TOOL</span>
          </h2>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <p className="modal-success-title">TOOL SUBMITTED</p>
            <p className="modal-success-sub">
              We'll review it and add it to the index shortly.
            </p>
            <button className="modal-submit-btn" onClick={handleClose}>
              CLOSE
            </button>
          </div>
        ) : (
          <>
            <p className="modal-subtitle">
              No accounts. No emails. Just fill this out.
            </p>

            <div className="modal-form">
              <div className="modal-field">
                <label className="modal-label">
                  NAME <span className="modal-required">*</span>
                </label>
                <input
                  className="modal-input"
                  name="name"
                  placeholder="e.g. Excalidraw"
                  value={form.name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">
                  DESCRIPTION <span className="modal-required">*</span>
                </label>
                <textarea
                  className="modal-input modal-textarea"
                  name="description"
                  placeholder="One sentence. What does it do?"
                  value={form.description}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  rows={2}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">
                  URL <span className="modal-required">*</span>
                </label>
                <input
                  className="modal-input"
                  name="url"
                  type="url"
                  placeholder="https://excalidraw.com"
                  value={form.url}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">TAGS</label>
                <input
                  className="modal-input"
                  name="tags"
                  placeholder="drawing, whiteboard, collaboration"
                  value={form.tags}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
                <span className="modal-hint">Comma-separated</span>
              </div>

              <div className="modal-field">
                <label className="modal-label">GITHUB</label>
                <input
                  className="modal-input"
                  name="github"
                  type="url"
                  placeholder="https://github.com/excalidraw/excalidraw"
                  value={form.github}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">
                  CATEGORY <span className="modal-required">*</span>
                </label>
                <select
                  className="modal-input modal-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={status === "loading"}
                >
                  <option value="">— Select one —</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {errorMsg && <p className="modal-error">{errorMsg}</p>}

              <button
                className="modal-submit-btn"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "SUBMITTING..." : "SUBMIT TOOL →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
