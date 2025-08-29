import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";
import { NextRequest, NextResponse } from "next/server";

// Helper to extract id from request.nextUrl
function getIdFromRequest(request: NextRequest) {
  return request.nextUrl.pathname.split("/").pop();
}

// GET /api/hasil/[id]
export async function GET(request: NextRequest) {
  const id = getIdFromRequest(request);
  await connect();
  const hasil = await Hasil.findOne({ _id: id });
  if (!hasil) {
    return NextResponse.json({ message: "Hasil not found" }, { status: 404 });
  }
  return NextResponse.json({ hasil }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    const {
      newNama: nama,
      newTerima: terima,
      newImageURL: imageURL,
    } = await request.json();
    await connect();
    const updated = await Hasil.findByIdAndUpdate(id, {
      nama,
      terima,
      imageURL,
    });
    if (!updated) {
      return NextResponse.json(
        { message: "Hasil Tidak ditemukan untuk diupdate" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Hasil updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal update hasil", error: error?.message || error },
      { status: 500 },
    );
  }
}

// DELETE /api/hasil/[id]
export async function DELETE(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await connect();
    await Hasil.findByIdAndDelete(id);
    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal dihapus" }, { status: 500 });
  }
}
