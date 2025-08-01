import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";
import { NextRequest, NextResponse } from "next/server";

// GET /api/hasil/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  await connect();
  const hasil = await Hasil.findById(id);
  if (!hasil) {
    return NextResponse.json(
      { message: "Hasil Tidak ditemukan" },
      { status: 404 },
    );
  }
  return NextResponse.json({ hasil }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const {
    newNama: nama,
    newTerima: terima,
    newImageURL: imageURL,
  } = await request.json();
  await connect();
  await Hasil.findByIdAndUpdate(id, { nama, terima, imageURL });
  return NextResponse.json(
    { message: "Hasil updated successfully" },
    { status: 200 },
  );
}

// DELETE /api/hasil/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connect();
    await Hasil.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal dihapus" }, { status: 500 });
  }
}
