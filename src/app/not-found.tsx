export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f2] px-6 text-center text-[#203b2d]">
      <p className="text-sm tracking-[0.25em] text-[#997849]">
        AYUKANTI
      </p>
      <h1 className="mt-5 font-serif text-5xl">Page not found</h1>
      <p className="mt-4 text-sm text-[#657064]">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-8 rounded-full bg-[#203b2d] px-6 py-3 text-sm text-white"
      >
        Return to homepage
      </a>
    </main>
  );
}
