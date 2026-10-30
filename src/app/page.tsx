"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  image_url: string | null;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsapp = "https://wa.me/919313688716";

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("public_products")
        .select("*");

      if (error) {
        console.error("Product loading error:", error);
      } else {
        setProducts((data || []) as Product[]);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-[#26352b]">

      {/* Announcement */}
      <div className="bg-[#eee8d9] px-4 py-3 text-center text-[11px] font-semibold tracking-[0.2em] text-[#344b35]">
        ROOTED IN NATURE · INSPIRED BY AYURVEDA
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#e6dece] bg-[#fffdf8] px-5 py-5 md:px-12">
        <a href="#" className="font-serif text-3xl font-semibold tracking-wide text-[#263b2d]">
          ayukanti<span className="text-[#ad8750]">.</span>
        </a>

        <a
          href="#products"
          className="rounded-full border border-[#536447] px-5 py-2.5 text-sm font-semibold text-[#263b2d] transition hover:bg-[#eee8d9]"
        >
          Explore products ↗
        </a>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-16 md:py-24">

        <div>
          <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-[#997344]">
            NATURE, MADE PART OF YOU
          </p>

          <h1 className="max-w-xl font-serif text-5xl font-medium leading-[1.12] text-[#263b2d] md:text-7xl">
            A little closer to <span className="italic text-[#71805e]">nature.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-[#454d42]">
            Explore a thoughtful collection of herbal and natural products,
            inspired by timeless traditions and everyday rituals.
          </p>

          <a
            href="#products"
            className="mt-8 inline-block rounded-full border border-[#c6ad7d] bg-[#e9e4d4] px-8 py-4 text-sm font-bold text-[#17251b] shadow-sm transition hover:bg-[#ded5bd]"
          >
            Discover the collection ↗
          </a>

          <p className="mt-5 text-xs font-medium text-[#555d50]">
            Thoughtfully presented · Easy WhatsApp enquiries
          </p>
        </div>

        {/* Botanical Visual */}
        <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-t-full rounded-b-3xl border border-[#e5ddca] bg-[#eeeede] md:min-h-[480px]">
          <div className="absolute left-8 top-12 rotate-[-15deg] font-serif text-7xl text-[#849274]">
            ❧
          </div>

          <div className="absolute bottom-16 right-8 rotate-12 font-serif text-7xl text-[#849274]">
            ❋
          </div>

          <div className="flex h-60 w-44 flex-col items-center justify-center rounded-t-[55px] rounded-b-3xl border border-[#c9b993] bg-[#fffdf5] shadow-xl">
            <span className="text-4xl text-[#a77c43]">✳</span>
            <span className="mt-3 font-serif text-2xl font-semibold text-[#344633]">
              ayukanti
            </span>
            <span className="mt-2 text-[9px] font-semibold tracking-[0.2em] text-[#665c45]">
              BOTANICAL CARE
            </span>
          </div>

          <p className="absolute bottom-6 text-[10px] font-semibold tracking-[0.2em] text-[#46533d]">
            SIMPLE · NATURAL · THOUGHTFUL
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#e6dece] bg-[#f3efe5] px-6 py-7">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3 text-center text-[11px] font-semibold tracking-wide text-[#394638] md:text-sm">
          <p>✳ Nature-inspired</p>
          <p>❧ Thoughtful choices</p>
          <p>♡ Personal enquiries</p>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-5 py-16 md:px-12 md:py-20">

        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#997344]">
            THE AYUKANTI EDIT
          </p>

          <h2 className="font-serif text-4xl font-medium text-[#263b2d] md:text-5xl">
            Explore our collection
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#50584c]">
            Discover thoughtful choices inspired by nature and made for your everyday rituals.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center font-medium text-[#344633]">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="py-12 text-center font-medium text-[#344633]">
            No products available yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const price = Number(product.price) || 0;
              const discount = Number(product.discount) || 0;
              const finalPrice = price * (1 - discount / 100);

              const message = `Hello Ayukanti, I am interested in ${product.name}. Price: ₹${finalPrice.toFixed(0)}. Please share details.`;

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-[#e6dece] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-60 items-center justify-center bg-[#f0eee3]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-36 w-24 flex-col items-center justify-center rounded-t-2xl rounded-b-xl border border-[#c8bd9f] bg-[#fffdf5] shadow-md">
                        <span className="text-3xl text-[#a77c43]">✿</span>
                        <span className="mt-2 font-serif text-sm font-semibold text-[#344633]">
                          ayukanti
                        </span>
                        <span className="mt-1 text-[7px] font-semibold tracking-widest text-[#5c614e]">
                          BOTANICAL
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#997344]">
                      {product.category}
                    </p>

                    <h3 className="mt-2 font-serif text-2xl font-semibold text-[#263b2d]">
                      {product.name}
                    </h3>

                    <p className="mt-3 min-h-12 text-sm leading-7 text-[#454d42]">
                      {product.description}
                    </p>

                    <div className="mt-5 border-t border-[#e8e1d3] pt-5">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xl font-bold text-[#263b2d]">
                            ₹{finalPrice.toFixed(0)}
                          </span>

                          {discount > 0 && (
                            <span className="ml-2 text-sm font-medium text-[#77776c] line-through">
                              ₹{price.toFixed(0)}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold ${
                            product.stock > 0
                              ? "text-[#35643a]"
                              : "text-[#a33232]"
                          }`}
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <a
                        href={`${whatsapp}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 block rounded-full border border-[#a9b18f] bg-[#dfe7d4] px-4 py-3.5 text-center text-sm font-bold text-[#17251b] transition hover:bg-[#cdd9be]"
                      >
                        Enquire on WhatsApp ↗
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="mx-5 mb-16 rounded-3xl border border-[#e2d6bd] bg-[#eee8d9] px-6 py-14 text-center md:mx-12 md:py-20">

        <p className="text-xs font-bold tracking-[0.25em] text-[#997344]">
          YOUR NEXT NATURAL RITUAL
        </p>

        <h2 className="mx-auto mt-5 max-w-xl font-serif text-4xl font-medium text-[#263b2d] md:text-5xl">
          Let&apos;s find what suits you.
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#454d42]">
          Have a question about a product? Contact us directly for details.
        </p>

        <a
          href={`${whatsapp}?text=${encodeURIComponent("Hello Ayukanti, I would like to know more about your products.")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-full border border-[#b69a69] bg-[#fffdf5] px-8 py-4 text-sm font-bold text-[#17251b] shadow-sm transition hover:bg-[#e8dfca]"
        >
          Chat on WhatsApp ↗
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e6dece] bg-[#f3efe5] px-6 py-9 text-center">
        <p className="font-serif text-2xl font-semibold text-[#263b2d]">
          ayukanti<span className="text-[#ad8750]">.</span>
        </p>

        <p className="mt-3 text-xs font-medium text-[#50584c]">
          Inspired by nature. Made for everyday rituals.
        </p>

        <p className="mt-5 text-[10px] font-medium text-[#66675d]">
          © {new Date().getFullYear()} Ayukanti
        </p>
      </footer>
    </main>
  );
}
