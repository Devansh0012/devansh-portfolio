export default function Footer() {
  return (
    <footer className="glass mt-auto border-t border-white/10 bg-black/80 backdrop-blur-xl shadow-lg shadow-black/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center text-sm text-neutral-400 sm:flex-row sm:justify-between">
        <p className="text-neutral-500">
          © {new Date().getFullYear()} Devansh Dubey.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-400">
          <a
            href="mailto:work@devanshdubey.com"
            className="transition-colors hover:text-white"
          >
            Email
          </a>
          <a href="https://github.com/Devansh0012" className="transition-colors hover:text-white">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/devanshdubey1" className="transition-colors hover:text-white">
            LinkedIn
          </a>
          <a href="/rss.xml" className="transition-colors hover:text-white">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
