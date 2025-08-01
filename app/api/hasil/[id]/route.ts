import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connect();
  const hasil = await Hasil.findOne({ _id: id });
  if (!hasil) {
    return NextResponse.json(
      { message: "Hasil Tidak ditemukan" },
      { status: 404 },
    );
  }
  return NextResponse.json({ hasil }, { status: 200 });
}
// PUT update hasil
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { newNama, newTerima, newImageURL } = await request.json();
    await connect();
    const updated = await Hasil.findByIdAndUpdate(
      params.id,
      { nama: newNama, terima: newTerima, imageURL: newImageURL },
      { new: true },
    );
    if (!updated) {
      return NextResponse.json({ message: "Hasil not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Hasil updated successfully", hasil: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE hasil
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
