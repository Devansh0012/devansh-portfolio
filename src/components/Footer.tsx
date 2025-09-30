export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center text-sm text-slate-300 sm:flex-row sm:justify-between">
        <p className="text-slate-400">
          © {new Date().getFullYear()} Devansh Dubey.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
          <a
            href="mailto:devanshdubey0012@gmail.com"
            className="transition hover:text-white"
          >
            Email
          </a>
          <a href="https://github.com/Devansh0012" className="transition hover:text-white">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/devanshdubey1" className="transition hover:text-white">
            LinkedIn
          </a>
          <a href="/rss.xml" className="transition hover:text-white">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
