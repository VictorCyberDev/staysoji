const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('staysoji-theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

/** Runs before paint so the toggled theme never flashes back to the default. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
