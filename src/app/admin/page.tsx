"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  cost_price: number | null;
  discount: number | null;
  stock: number;
  description: string | null;
  image_url: string | null;
  is_active: boolean | null;
};

const emptyProduct = {
  name: "",
  category: "",
  price: "0",
  cost_price: "0",
  discount: "0",
  stock: "0",
  description: "",
  image_url: "",
  is_active: true,
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLoggedIn(true);
        loadProducts();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
        if (!session) setProducts([]);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);
    if (error) setMessage("Login failed: " + error.message);
    else {
      setLoggedIn(true);
      await loadProducts();
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setProducts([]);
    setMessage("");
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from("public_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Products load error: " + error.message);
      return;
    }

    setProducts((data || []) as Product[]);
  }

  function editProduct(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      category: p.category || "",
      price: String(p.price ?? 0),
      cost_price: String(p.cost_price ?? 0),
      discount: String(p.discount ?? 0),
      stock: String(p.stock ?? 0),
      description: p.description || "",
      image_url: p.image_url || "",
      is_active: p.is_active ?? true,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      cost_price: Number(form.cost_price),
      discount: Number(form.discount),
      stock: Number(form.stock),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    };

    if (
      !payload.name ||
      !Number.isFinite(payload.price) ||
      !Number.isFinite(payload.cost_price) ||
      !Number.isFinite(payload.discount) ||
      !Number.isFinite(payload.stock) ||
      payload.price < 0 ||
      payload.cost_price < 0 ||
      payload.discount < 0 ||
      payload.discount > 100 ||
      payload.stock < 0
    ) {
      setMessage("Please check product details. Discount must be 0–100.");
      setBusy(false);
      return;
    }

    const result = editingId
      ? await supabase
          .from("public_products")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("public_products").insert([payload]);

    setBusy(false);

    if (result.error) {
      setMessage("Save error: " + result.error.message);
      return;
    }

    setMessage(editingId ? "Product updated." : "Product added.");
    setForm(emptyProduct);
    setEditingId(null);
    await loadProducts();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyProduct);
    setMessage("");
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-[#faf7ef] p-5 text-[#263b2d]">
        <section className="mx-auto mt-12 max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-widest text-[#997344]">
            AYUKANTI
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Admin Login</h1>
          <form onSubmit={login} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input
                className="mt-1 w-full rounded-lg border p-3 text-base text-gray-900"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                className="mt-1 w-full rounded-lg border p-3 text-base text-gray-900"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button
              disabled={busy}
              className="w-full rounded-lg bg-[#263b2d] p-3 font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {message && <p className="mt-4 break-words text-sm">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7ef] p-4 text-[#263b2d] sm:p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9c9a3] pb-5">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#997344]">
              AYUKANTI
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Product Management</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-[#263b2d] px-4 py-2 font-medium"
          >
            Sign Out
          </button>
        </header>

        <section className="mt-6 rounded-2xl border border-[#e4dccb] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={saveProduct} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Product Name *
              <input
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <label className="text-sm font-medium">
              Category
              <input
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </label>

            <label className="text-sm font-medium">
              Selling Price (₹) *
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </label>

            <label className="text-sm font-medium">
              Cost Price (₹)
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.cost_price}
                onChange={(e) =>
                  setForm({ ...form, cost_price: e.target.value })
                }
                required
              />
            </label>

            <label className="text-sm font-medium">
              Discount (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                required
              />
            </label>

            <label className="text-sm font-medium">
              Stock Quantity
              <input
                type="number"
                min="0"
                step="1"
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Image URL
              <input
                type="url"
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Description
              <textarea
                className="mt-1 w-full rounded-lg border p-3 text-base"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              Product is active on store
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                disabled={busy}
                className="rounded-lg bg-[#263b2d] px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border px-5 py-3 font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className="mt-4 break-words rounded-lg bg-[#f8f0dc] p-3 text-sm">
              {message}
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">
              Products ({products.length})
            </h2>
            <button
              onClick={loadProducts}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-[#e4dccb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-600">
                    {p.category || "Uncategorized"} · ₹{p.price} · Stock: {p.stock}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cost: ₹{p.cost_price ?? 0} · Discount: {p.discount ?? 0}%
                  </p>
                  <p className="text-sm">
                    {p.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <button
                  onClick={() => editProduct(p)}
                  className="rounded-lg border border-[#263b2d] px-4 py-2 font-medium"
                >
                  Edit
                </button>
              </article>
            ))}

            {products.length === 0 && (
              <p className="rounded-xl border bg-white p-5 text-sm text-gray-600">
                No products found, or the database returned an error.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
                }
