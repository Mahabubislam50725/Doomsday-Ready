export default function StatCard({ icon, label, value, accent = "red" }) {
  const colors = {
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    zinc: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}
