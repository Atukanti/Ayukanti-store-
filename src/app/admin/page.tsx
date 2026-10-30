
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

type ProductForm = {
  name: string;
  category: string;
  price: string;
  cost_price: string;
  discount: string;
  stock: string;
  description: string;
  image_url: string;
  is_active: boolean;
};

const emptyProduct: ProductForm = {
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
  const [checkingSession, setCheckingSession] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>({ ...emptyProduct });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setMessage("Session error: " + error.message);
      }

      setLoggedIn(!!data.session);
      setCheckingSession(false);

      if (data.session) {
        await loadProducts();
      }
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setLoggedIn(!!session);

        if (!session) {
          setProducts([]);
          setEditingId(null);
          setForm({ ...emptyProduct });
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setBusy(false);

    if (error) {
      setMessage("Login failed: " + error.message);
      return;
    }

    setPassword("");
    setLoggedIn(true);
    await loadProducts();
  }

  async function logout() {
    setBusy(true);

    const { error } = await supabase.auth.signOut();

    setBusy(false);

    if (error) {
      setMessage("Logout error: " + error.message);
      return;
    }

    setLoggedIn(false);
    setProducts([]);
    setForm({ ...emptyProduct });
    setEditingId(null);
    setMessage("");
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

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

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyProduct });
    setMessage("");
  }

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (busy) return;

    const price = Number(form.price);
    const costPrice = Number(form.cost_price);
    const discount = Number(form.discount);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      form.price.trim() === "" ||
      form.cost_price.trim() === "" ||
      form.discount.trim() === "" ||
      form.stock.trim() === "" ||
      !Number.isFinite(price) ||
      !Number.isFinite(costPrice) ||
      !Number.isFinite(discount) ||
      !Number.isFinite(stock) ||
      price < 0 ||
      costPrice < 0 ||
      discount < 0 ||
      discount > 100 ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setMessage(
        "Details check karo. Prices non-negative, discount 0–100 ane stock whole number hovo joie."
      );
      return;
    }

    setBusy(true);
    setMessage("");

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || null,
      price,
      cost_price: costPrice,
      discount,
      stock,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    };

    const result = editingId
      ? await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId)
          .select("id")
      : await supabase
          .from("products")
          .insert([payload])
          .select("id");

    setBusy(false);

    if (result.error) {
      setMessage("Save error: " + result.error.message);
      return;
    }

    if (!result.data || result.data.length === 0) {
      setMessage(
        "Save confirm nathi thayu. Database permissions check karvi padse."
      );
      return;
    }

    setMessage(editingId ? "Product updated." : "Product added.");
    setForm({ ...emptyProduct });
    setEditingId(null);
    await loadProducts();
  }

  async function toggleProductStatus(p: Product) {
    if (busy) return;

    const nextActive = !(p.is_active ?? true);
    const action = nextActive ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `"${p.name}" ne ${action} karvo chhe?`
    );

    if (!confirmed) return;

    setBusy(true);
    setMessage("");

    const { data, error } = await supabase
      .from("products")
      .update({ is_active: nextActive })
      .eq("id", p.id)
      .select("id");

    setBusy(false);

    if (error) {
      setMessage("Status update error: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setMessage("Status change confirm nathi thayu.");
      return;
    }

    setMessage(
      nextActive ? "Product activated." : "Product deactivated."
    );

    await loadProducts();
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#faf7ef] p-6 text-[#263b2d]">
        <p className="mx-auto mt-16 max-w-md text-center">
          Checking login...
        </p>
      </main>
    );
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
                autoComplete="username"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[#263b2d] p-3 font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && (
            <p className="mt-4 break-words rounded-lg bg-[#f8f0dc] p-3 text-sm">
              {message}
            </p>
          )}
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
            <h1 className="mt-1 text-3xl font-semibold">
              Product Management
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            disabled={busy}
            className="rounded-lg border border-[#263b2d] px-4 py-2 font-medium disabled:opacity-50"
          >
            Sign Out
          </button>
        </header>

        <section className="mt-6 rounded-2xl border border-[#e4dccb] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <form
            onSubmit={saveProduct}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <label className="text-sm font-medium">
              Product Name *
              <input
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </label>

            <label className="text-sm font-medium">
              Category
              <input
                className="mt-1 w-full rounded-lg border p-3 text-base"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                required
              />
            </label>

            <label className="text-sm font-medium">
              Cost Price (₹) *
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
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
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
                type="submit"
                disabled={busy}
                className="rounded-lg bg-[#263b2d] px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {busy
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={busy}
                  className="rounded-lg border px-5 py-3 font-medium disabled:opacity-50"
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">
              Products ({products.length})
            </h2>

            <button
              type="button"
              onClick={loadProducts}
              disabled={busy}
              className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
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
                    {p.category || "Uncategorized"} · ₹{p.price} · Stock:{" "}
                    {p.stock}
                  </p>

                  <p className="text-sm text-gray-600">
                    Cost: ₹{p.cost_price ?? 0} · Discount:{" "}
                    {p.discount ?? 0}%
                  </p>

                  <p className="text-sm">
                    Status: {p.is_active ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editProduct(p)}
                    disabled={busy}
                    className="rounded-lg border border-[#263b2d] px-4 py-2 font-medium disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleProductStatus(p)}
                    disabled={busy}
                    className="rounded-lg border border-red-600 px-4 py-2 font-medium text-red-600 disabled:opacity-50"
                  >
                    {p.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </article>
            ))}

            {products.length === 0 && (
              <p className="rounded-xl border bg-white p-5 text-sm text-gray-600">
                No products found. Refresh karo athva upar no error check karo.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
