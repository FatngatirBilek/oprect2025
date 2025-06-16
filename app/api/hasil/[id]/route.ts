import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  const { newNama: nama, newTerima: terima } = await request.json();
  await connect();
  await Hasil.findByIdAndUpdate(id, { nama, terima });
  return NextResponse.json(
    { message: "Suara updated successfully" },
    { status: 200 },
  );
}

export async function GET(_: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  await connect();
  const hasil = await Hasil.findOne({ _id: id });
  if (!hasil) {
    return NextResponse.json({ message: "Suara not found" }, { status: 404 });
  }
  return NextResponse.json({ hasil }, { status: 200 });
}
