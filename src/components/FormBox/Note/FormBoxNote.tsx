import { Input } from "antd";

function FormBoxNote() {
  return (
    <main className="rounded-lg bg-white p-5">
      <div className="text-xl font-bold mb-5">Ghi chu</div>
      <Input.TextArea
        style={{ resize: "none", height: 180 }}
        className="bg-slate-100 border-none hover:bg-slate-100 focus:bg-white focus:border-blue-500"
        placeholder="Viet ghi chu cho don hang"
      />
    </main>
  );
}

export default FormBoxNote;
