export default function Footer() {
  return (
    <footer className="glass mt-auto shadow-lg shadow-slate-900/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center text-sm text-slate-300 sm:flex-row sm:justify-between">
        <p className="text-slate-400">
          © {new Date().getFullYear()} Devansh Dubey.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
          <a
            href="mailto:work@devanshdubey.com"
            className="transition-colors hover:text-blue-400"
          >
            Email
          </a>
          <a href="https://github.com/Devansh0012" className="transition-colors hover:text-blue-400">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/devanshdubey1" className="transition-colors hover:text-blue-400">
            LinkedIn
          </a>
          <a href="/rss.xml" className="transition-colors hover:text-blue-400">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
