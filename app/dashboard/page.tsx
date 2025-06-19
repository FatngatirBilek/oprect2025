"use client";
import { useEffect, useState, useRef } from "react";

interface Hasil {
  _id: string;
  nama: string;
  terima: boolean;
  imageURL: string;
}

export default function DashboardPage() {
  const [list, setList] = useState<Hasil[]>([]);
  const [form, setForm] = useState<Partial<Hasil>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Fetch all hasil on mount
  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    const res = await fetch("/api/hasil");
    const data = await res.json();
    setList(data.hasil ?? []);
  }

  function resetForm() {
    setForm({});
    setEditId(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    if (editId) {
      // Edit mode: PUT /api/hasil/[id]
      await fetch(`/api/hasil/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newNama: form.nama,
          newTerima: form.terima,
          newImageURL: form.imageURL,
        }),
      });
    } else {
      // Create: POST /api/hasil
      await fetch("/api/hasil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          terima: !!form.terima,
          imageURL: form.imageURL,
        }),
      });
    }
    await fetchList();
    setLoading(false);
    resetForm();
  }

  async function handleDelete(_id: string) {
    if (!window.confirm("Yakin hapus data ini?")) return;
    setLoading(true);
    await fetch(`/api/hasil/${_id}`, { method: "DELETE" });
    await fetchList();
    setLoading(false);
  }

  async function startEdit(_id: string) {
    setLoading(true);
    const res = await fetch(`/api/hasil/${_id}`);
    const data = await res.json();
    setForm({
      nama: data.hasil.nama,
      terima: data.hasil.terima,
      imageURL: data.hasil.imageURL,
    });
    setEditId(_id);
    setLoading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    // Use your API route for Cloudinary upload
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setImgUploading(false);
    if (data.url) setForm((f) => ({ ...f, imageURL: data.url }));
    else alert("Upload gagal");
  }

  async function toggleTerima(id: string, val: boolean) {
    setLoading(true);
    const hasil = list.find((x) => x._id === id);
    if (!hasil) return;
    await fetch(`/api/hasil/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newNama: hasil.nama,
        newTerima: val,
        newImageURL: hasil.imageURL,
      }),
    });
    await fetchList();
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2 style={{ fontSize: 32, marginBottom: 20 }}>Dashboard Hasil</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 40,
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 12,
          background: "#fafbfc",
        }}
      >
        <input
          type="text"
          required
          placeholder="Nama"
          value={form.nama ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
          style={{
            padding: 8,
            marginRight: 16,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 180,
          }}
        />
        <label style={{ marginRight: 16 }}>
          <input
            type="checkbox"
            checked={!!form.terima}
            onChange={(e) =>
              setForm((f) => ({ ...f, terima: e.target.checked }))
            }
            style={{ marginRight: 4 }}
          />
          Terima
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={handleImageUpload}
          style={{ marginRight: 8 }}
        />
        {imgUploading && <span style={{ color: "#888" }}>Uploading...</span>}
        {form.imageURL && (
          <img
            src={form.imageURL}
            alt="Preview"
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: 8,
              marginRight: 8,
            }}
          />
        )}
        <button
          type="submit"
          disabled={loading || imgUploading}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "8px 20px",
            border: "none",
            borderRadius: 8,
            marginLeft: 8,
          }}
        >
          {editId ? "Update" : "Tambah"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              marginLeft: 14,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #aaa",
              background: "#fff",
            }}
          >
            Batal
          </button>
        )}
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th>Nama</th>
            <th>Terima</th>
            <th>Image</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((x) => (
            <tr key={x._id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{x.nama}</td>
              <td>
                <input
                  type="checkbox"
                  checked={x.terima}
                  onChange={(e) => toggleTerima(x._id, e.target.checked)}
                  disabled={loading}
                />
              </td>
              <td>
                {x.imageURL && (
                  <img
                    src={x.imageURL}
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
              </td>
              <td>
                <button
                  onClick={() => startEdit(x._id)}
                  style={{
                    marginRight: 8,
                    padding: "4px 12px",
                    borderRadius: 7,
                    border: "1px solid #2563eb",
                    background: "#fff",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(x._id)}
                  style={{
                    color: "red",
                    border: "1px solid red",
                    borderRadius: 7,
                    padding: "4px 12px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
