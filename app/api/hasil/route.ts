import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";
import { NextRequest, NextResponse } from "next/server";

// POST /api/hasil — create new hasil
export async function POST(request: NextRequest) {
  try {
    const { nama, terima, imageURL } = await request.json();
    await connect();
    const created = await Hasil.create({ nama, terima, imageURL });
    return NextResponse.json(
      { message: "berhasil dibuat", hasil: created },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal dibuat" }, { status: 500 });
  }
}

// GET /api/hasil — get all hasil
export async function GET() {
  try {
    await connect();
    const hasil = await Hasil.find();
    // Return as { hasil: [...] } for your dashboard code
    return NextResponse.json({ hasil }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}
