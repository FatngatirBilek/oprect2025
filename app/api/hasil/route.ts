import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { nama, terima, imageURL } = await request.json();
  await connect();
  await Hasil.create({ nama, terima, imageURL });
  try {
    return NextResponse.json({ message: "berhasil dibuat" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal dibuat" }, { status: 500 });
  }
}

export async function GET() {
  await connect();
  const hasil = await Hasil.find();
  return NextResponse.json({ hasil });
}
