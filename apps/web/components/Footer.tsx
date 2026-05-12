export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-white font-heading text-lg font-bold">ParentAssist</p>
          <p className="text-sm mt-1">For Indian mothers in Australia 🇦🇺</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="mailto:support@parentassist.app" className="hover:text-white transition-colors">Contact</a>
        </nav>
        <p className="text-xs text-neutral-600">© {new Date().getFullYear()} ParentAssist. All rights reserved.</p>
      </div>
    </footer>
  );
}
