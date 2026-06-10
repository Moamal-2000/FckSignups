# FckSignups

> **Open Source Tools. Zero Bullsh*t.**

A curated collection of open-source tools you can use instantly in your browser — no accounts, no emails, no tracking. Just tools that work.

---

## What is this?

FckSignups is a single-file, dependency-free directory of browser-based tools that respect your time. No signups. No dark patterns. No "create an account to continue." Just open the page, find a tool, and use it.

The entire site is one HTML file. No build step. No npm. No framework. Open it in any browser and it works.

---

## Philosophy

| We believe | We reject |
|------------|-----------|
| Tools should work immediately | Forced registration walls |
| Your data belongs to you | Data harvesting and tracking |
| Open source is the default | Proprietary black boxes |
| Simple is better | Bloat and unnecessary complexity |

---

## Tool schema

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | URL-friendly unique identifier |
| `name` | Yes | Display name |
| `description` | Yes | One-sentence summary |
| `url` | Yes | Direct link to the tool |
| `category` | Yes | Must match a category `id` |
| `tags` | No | Array of searchable keywords |
| `github` | No | Link to source repository |
| `license` | No | SPDX license identifier |
| `stars` | No | GitHub star count (for display) |
| `featured` | No | Boolean — pins to top |

---

## Categories

The default categories are:

| ID | Name | Icon |
|----|------|------|
| `all` | All | ◈ |
| `productivity` | Productivity | ⚡ |
| `design` | Design & Graphics | ▣ |
| `development` | Development | ◆ |
| `writing` | Writing & Docs | ✎ |
| `privacy` | Privacy | ◊ |
| `utilities` | Utilities | ◉ |
| `data` | Data & Analytics | ◐ |
| `media` | Media | ◫ |


---

## Contributing

### Contribution guidelines
- The tool must work **without creating an account**
- Include accurate GitHub star counts and license info when available (temporary until stars fetcher workers)
- Keep descriptions under 140 characters
- Use 3-5 relevant tags per tool
- Use the following link to add a tool you [found/made](https://github.com/BraveOPotato/FckSignups/issues/new?template=request-to-add-a-tool.md)

---

## License

The FckSignups directory code is released under the **MIT License**.

Individual tools listed in the directory retain their own licenses. We do not claim ownership of any third-party projects.

---

## Credits

Curated with spite by people who are tired of typing their email into everything.

---

*No cookies. No analytics. No bullsh*t.*
