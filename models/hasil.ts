import mongoose, { Schema, Document } from "mongoose";

interface IHasil extends Document {
  nama: string;
  terima: boolean;
}
const hasilSchema: Schema = new Schema(
  {
    nama: { type: String, required: true },
    terima: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const Hasil =
  mongoose.models.Hasil || mongoose.model<IHasil>("Hasil", hasilSchema);

export default Hasil;
