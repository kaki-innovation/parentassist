export default function Hero() {
  return (
    <section className="bg-cream-100 px-6 py-24 text-center">
      <p className="text-saffron-500 font-semibold tracking-wide uppercase text-sm mb-4">
        For Indian mothers in Australia
      </p>
      <h1 className="font-heading text-5xl md:text-6xl text-neutral-900 mb-6 leading-tight">
        Less thinking,<br />more doing ✨
      </h1>
      <p className="text-xl text-neutral-600 max-w-xl mx-auto mb-10">
        ParentAssist handles the daily decisions — what to cook, how to keep the kids busy,
        and how to celebrate Indian festivals — so you can just enjoy being a mum.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#"
          className="bg-saffron-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-saffron-600 transition-colors"
        >
          Download Free
        </a>
        <a
          href="#features"
          className="border-2 border-saffron-500 text-saffron-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-saffron-50 transition-colors"
        >
          See how it works
        </a>
      </div>
    </section>
  );
}
