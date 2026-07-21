const fs = require('fs');
let content = fs.readFileSync('assets/css/style.css', 'utf8');

// Add .nav-right and .lang-toggle CSS around line 173 (before .nav-menu)
const navCSS = `
.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.lang-toggle-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px;
}

.lang-toggle-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s var(--ease);
}

.lang-toggle-btn.active {
  background: var(--primary);
  color: #fff;
}

.lang-toggle-btn:hover:not(.active) {
  color: var(--text-primary);
}
`;

content = content.replace('.nav-menu {', navCSS + '\n.nav-menu {');

fs.writeFileSync('assets/css/style.css', content);
