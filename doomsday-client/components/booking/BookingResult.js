import { CheckCircle2, XCircle, Package } from "lucide-react";

export default function BookingResult({ result, groupSize, cinemaName }) {
  if (!result) return null;

  if (!result.possible) {
    return (
      <div className="bg-yellow-950/40 border border-yellow-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <p className="font-semibold text-yellow-300 text-lg">Not Possible</p>
        </div>
        <p className="text-yellow-600 text-sm">
          No exact bundle combination exists for <span className="text-yellow-400 font-medium">{groupSize} seats</span> at {cinemaName}.
          Try a different group size.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-950/30 border border-green-800/40 rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-300 text-lg">Booking Found!</p>
          <p className="text-green-600 text-sm">
            {result.totalBundles} bundle{result.totalBundles !== 1 ? "s" : ""} for {groupSize} seats at {cinemaName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {result.bundles.map(({ size, count }) => (
          <div key={size} className="bg-green-900/30 border border-green-800/40 rounded-xl p-4 text-center">
            <Package className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-300">×{count}</p>
            <p className="text-green-600 text-xs mt-0.5">{size}-seat bundle</p>
            <p className="text-green-700 text-xs">{size * count} seats</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-green-900/20 border border-green-800/30 rounded-xl px-4 py-3">
        <span className="text-green-600 text-sm">Total Seats</span>
        <span className="text-green-300 font-bold">{groupSize}</span>
      </div>
    </div>
  );
}
