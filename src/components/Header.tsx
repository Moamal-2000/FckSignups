interface HeaderProps {
  toolCount: number;
  categoryCount: number;
}

export function Header({ toolCount, categoryCount }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-grid">
        <div className="brand-block">
          <h1>
            <span className="fck glitch" data-text="F*CK">
              F*CK
            </span>
            <span className="signups">Signups</span>
          </h1>
          <div className="tagline-block">
            <p className="tagline-main">Open Source Tools. Zero Bullsh*t.</p>
            <p className="tagline-sub">
              A curated collection of open-source tools you can use instantly in
              your browser — no accounts, no emails, no tracking. Just tools
              that work.
            </p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-row">
            <span className="stat-dot" />
            LIVE INDEX
          </div>
          <div className="stat-row">
            {String(toolCount).padStart(3, "0")} TOOLS LOADED
          </div>
          <div className="stat-row">
            {String(categoryCount).padStart(3, "0")} CATEGORIES
          </div>
        </div>
      </div>
    </header>
  );
}
