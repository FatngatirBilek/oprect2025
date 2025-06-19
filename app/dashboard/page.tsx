"use client";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await fetch(`/api/hasil/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newNama: form.nama,
            newTerima: form.terima,
            newImageURL: form.imageURL,
          }),
        });
        toast.success("Data berhasil diupdate");
      } else {
        await fetch("/api/hasil", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: form.nama,
            terima: !!form.terima,
            imageURL: form.imageURL,
          }),
        });
        toast.success("Data berhasil ditambah");
      }
      await fetchList();
      resetForm();
    } catch {
      toast.error("Gagal menyimpan data");
    }
    setLoading(false);
  }

  async function handleDelete(_id: string) {
    if (!window.confirm("Yakin hapus data ini?")) return;
    setLoading(true);
    try {
      await fetch(`/api/hasil/${_id}`, { method: "DELETE" });
      toast.success("Data berhasil dihapus");
      await fetchList();
    } catch {
      toast.error("Gagal menghapus data");
    }
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
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, imageURL: data.url }));
      else toast.error("Tidak bisa upload gambar");
    } catch {
      toast.error("Tidak bisa upload gambar");
    }
    setImgUploading(false);
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
    <div className="min-h-screen flex items-start justify-center py-12 bg-gradient-to-br from-pink-100 to-pink-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 border border-pink-100">
        <h2 className="text-4xl font-bold mb-8 text-center text-pink-700 drop-shadow">
          Dashboard Hasil
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-pink-50 rounded-xl p-6 shadow transition"
        >
          {/* Nama Input */}
          <Input
            required
            placeholder="Nama"
            value={form.nama ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            className="w-full bg-white border-2 border-pink-400 text-pink-900 font-semibold placeholder-pink-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
          />

          {/* Terima Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!form.terima}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, terima: checked as boolean }))
              }
              id="terima"
              className="border-2 border-pink-400 focus:ring-2 focus:ring-pink-400"
            />
            <label htmlFor="terima" className="text-pink-600 font-semibold">
              Terima
            </label>
          </div>

          {/* File Input */}
          <Input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleImageUpload}
            className="w-full bg-white border-2 border-pink-400 text-pink-900 font-medium focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
          />

          <div className="col-span-1 md:col-span-3 flex gap-2 mt-2">
            <Button
              type="submit"
              disabled={loading || imgUploading}
              className="w-32"
            >
              {editId ? "Update" : "Tambah"}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="w-24"
              >
                Batal
              </Button>
            )}
            {(loading || imgUploading) && (
              <div className="flex items-center text-sm text-pink-500 pl-4">
                Loading...
              </div>
            )}
          </div>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-pink-700">Nama</TableHead>
              <TableHead className="text-pink-700">Terima</TableHead>
              <TableHead className="text-pink-700">Image</TableHead>
              <TableHead className="text-pink-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((x) => (
              <TableRow key={x._id} className="hover:bg-pink-50 transition">
                <TableCell className="py-4 text-base font-semibold">
                  {x.nama}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={x.terima}
                    onCheckedChange={(checked) =>
                      toggleTerima(x._id, checked as boolean)
                    }
                    disabled={loading}
                    className="border-2 border-pink-400"
                  />
                </TableCell>
                <TableCell>
                  {x.imageURL ? (
                    <img
                      src={x.imageURL}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover border shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(x._id)}
                      disabled={loading}
                      className="rounded-lg border-pink-300 text-pink-700 hover:bg-pink-100"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(x._id)}
                      disabled={loading}
                      className="rounded-lg"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
