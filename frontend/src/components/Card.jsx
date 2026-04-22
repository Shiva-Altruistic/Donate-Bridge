export default function Card({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between transition-shadow hover:shadow-md border border-gray-100 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
    </div>
  );
}
