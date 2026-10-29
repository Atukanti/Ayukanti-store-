
const products = [
  {
    name: "Herbal Face Mist",
    category: "SKINCARE",
    description: "A refreshing botanical ritual for your daily skincare routine.",
    price: "₹299",
    symbol: "✿",
    color: "#e5ebd9",
  },
  {
    name: "Ayurvedic Hair Oil",
    category: "HAIR CARE",
    description: "A traditional-inspired hair care ritual with botanical goodness.",
    price: "₹399",
    symbol: "❋",
    color: "#eee2cc",
  },
  {
    name: "Herbal Wellness Blend",
    category: "WELLNESS",
    description: "Discover thoughtfully selected ingredients inspired by nature.",
    price: "₹249",
    symbol: "❧",
    color: "#e8e2d5",
  },
];

export default function Home() {
  const whatsapp = "https://wa.me/91XXXXXXXXXX";

  return (
    <main className="min-h-screen bg-[#faf8f2] text-[#203b2d]">
      <div className="bg-[#203b2d] px-4 py-2 text-center text-xs tracking-widest text-white">
        ROOTED IN NATURE · INSPIRED BY AYURVEDA
      </div>

      <header className="flex items-center justify-between border-b border-[#e7e4d9] px-5 py-5 md:px-12">
        <a href="#" className="text-2xl font-serif font-semibold tracking-wide">
          ayukanti<span className="text-[#a77c43]">.</span>
        </a>
        <a
          href="#products"
          className="rounded-full border border-[#203b2d] px-4 py-2 text-sm"
        >
          Explore products ↗
        </a>
      </header>

      <section className="grid items-center gap-8 px-6 py-14 md:grid-cols-2 md:px-16 md:py-24">
        <div>
          <p className="mb-5 text-xs tracking-[0.25em] text-[#997849]">
            NATURE, MADE PART OF YOU
          </p>
          <h1 className="max-w-xl font-serif text-5xl leading-[1.12] md:text-7xl">
            A little closer to <span className="italic">nature.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#657064]">
            Explore a thoughtful collection of herbal and natural products,
            inspired by timeless traditions and everyday rituals.
          </p>
          <a
            href="#products"
            className="mt-8 inline-block rounded-full bg-[#203b2d] px-7 py-4 text-sm text-white"
          >
            Discover the collection ↗
          </a>
          <p className="mt-5 text-xs text-[#7c8276]">
            Thoughtfully presented · Easy WhatsApp enquiries
          </p>
        </div>

        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-t-full bg-[#e6eadc] md:min-h-[470px]">
          <div className="absolute left-7 top-10 text-5xl text-[#879777]">❧</div>
          <div className="absolute bottom-12 right-8 rotate-12 text-6xl text-[#879777]">❋</div>
          <div className="flex h-56 w-40 flex-col items-center justify-center rounded-t-[48px] rounded-b-2xl border border-[#c9c6ac] bg-[#f8f5eb] shadow-xl">
            <span className="text-3xl text-[#a77c43]">✳</span>
            <span className="mt-3 font-serif text-xl">ayukanti</span>
            <span className="mt-2 text-[9px] tracking-[0.2em]">BOTANICAL CARE</span>
          </div>
          <p className="absolute bottom-5 text-xs tracking-widest text-[#596950]">
            SIMPLE. NATURAL. THOUGHTFUL.
          </p>
        </div>
      </section>

      <section className="border-y border-[#e7e4d9] px-6 py-6">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3 text-center text-xs tracking-wide text-[#657064] md:text-sm">
          <p>✳ Nature-inspired</p>
          <p>❧ Thoughtful choices</p>
          <p>♡ Personal enquiries</p>
        </div>
      </section>

      <section id="products" className="px-5 py-14 md:px-12 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs tracking-[0.2em] text-[#997849]">
              THE AYUKANTI EDIT
            </p>
            <h2 className="font-serif text-3xl md:text-5xl">
              Explore our collection
            </h2>
          </div>
          <span className="pb-1 text-xs text-[#657064]">01 — 03</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-2xl border border-[#e7e4d9] bg-white"
            >
              <div
                className="flex h-56 items-center justify-center"
                style={{ backgroundColor: product.color }}
              >
                <div className="flex h-36 w-24 flex-col items-center justify-center rounded-t-2xl rounded-b-xl border border-[#c8c5b1] bg-[#faf8f0] shadow-lg">
                  <span className="text-3xl text-[#a77c43]">{product.symbol}</span>
                  <span className="mt-2 font-serif text-sm">ayukanti</span>
                  <span className="mt-1 text-[7px] tracking-widest">BOTANICAL</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] tracking-[0.2em] text-[#997849]">
                  {product.category}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{product.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#657064]">
                  {product.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[#e7e4d9] pt-4">
                  <span className="text-lg">{product.price}</span>
                  <a
                    href={`${whatsapp}?text=${encodeURIComponent(
                      `Hello Ayukanti, I am interested in ${product.name} (${product.price}). Please share details.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#203b2d] px-4 py-3 text-xs text-white"
                  >
                    Enquire ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-[#7c8276]">
          Sample products and prices are for layout preview only. Replace them
          with your actual products before publishing.
        </p>
      </section>

      <section className="mx-5 mb-14 rounded-3xl bg-[#203b2d] px-6 py-12 text-center text-white md:mx-12 md:py-16">
        <p className="text-xs tracking-[0.25em] text-[#d6c29a]">
          YOUR NEXT NATURAL RITUAL
        </p>
        <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl md:text-5xl">
          Let&apos;s find what suits you.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#e0e5d9]">
          Have a question about a product? Contact us directly for details.
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-block rounded-full bg-[#faf8f2] px-7 py-4 text-sm text-[#203b2d]"
        >
          Chat on WhatsApp ↗
        </a>
      </section>

      <footer className="border-t border-[#e7e4d9] px-6 py-7 text-center">
        <p className="font-serif text-xl">ayukanti.</p>
        <p className="mt-2 text-xs text-[#7c8276]">
          Inspired by nature. Made for everyday rituals.
        </p>
        <p className="mt-4 text-[10px] text-[#7c8276]">
          © {new Date().getFullYear()} Ayukanti
        </p>
      </footer>
    </main>
  );
      }
              
