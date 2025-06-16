import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseconnect";
import Hasil from "@/models/hasil";

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, context: { params: Params }) {
  try {
    const { id } = context.params;
    const {
      newNama: nama,
      newTerima: terima,
      newImageURL: imageURL,
    } = await request.json();
    await connect();
    const updated = await Hasil.findByIdAndUpdate(
      id,
      { nama, terima, imageURL },
      { new: true },
    );
    if (!updated) {
      return NextResponse.json({ message: "Hasil not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Suara updated successfully", hasil: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, context: { params: Params }) {
  try {
    const { id } = context.params;
    await connect();
    const hasil = await Hasil.findOne({ _id: id });
    if (!hasil) {
      return NextResponse.json({ message: "Hasil not found" }, { status: 404 });
    }
    return NextResponse.json({ hasil }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
