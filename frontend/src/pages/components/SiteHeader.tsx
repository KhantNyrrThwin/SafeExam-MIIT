import { Link } from 'react-router-dom';

export default function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400 text-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/miit-logo.png" alt="MIIT" className="h-8 w-8 rounded bg-white/90 p-1" />
          <div className="font-semibold tracking-wide">SafeExam@MIIT</div>
        </Link>
        <div className="flex items-center gap-3">
          {right}
        </div>
      </div>
    </header>
  );
}


