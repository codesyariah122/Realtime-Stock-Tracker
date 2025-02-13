import {
  CodeBracketIcon,
  ServerIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";

const techStack = [
  {
    name: "Next.js",
    icon: <CodeBracketIcon className="w-6 h-6 text-blue-500" />,
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    icon: <CodeBracketIcon className="w-6 h-6 text-cyan-500" />,
    category: "Styling Library",
  },
  {
    name: "Recharts",
    icon: <CodeBracketIcon className="w-6 h-6 text-purple-500" />,
    category: "Charts",
  },
  {
    name: "Python",
    icon: <ServerIcon className="w-6 h-6 text-green-500" />,
    category: "Backend",
  },
  {
    name: "yfinance",
    icon: <ChartBarIcon className="w-6 h-6 text-emerald-500" />,
    category: "Tracker",
  },
  {
    name: "cachetools",
    icon: <ArchiveBoxIcon className="w-6 h-6 text-emerald-500" />,
    category: "Cache Library",
  },
];

export default function TechList() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Real-Time Stock Tracker</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center space-x-3 p-4 bg-gray-50 shadow-md rounded-lg border border-gray-200 transition-all hover:scale-105 hover:shadow-lg"
          >
            {tech.icon}
            <div>
              <p className="font-semibold text-gray-800">{tech.name}</p>
              <p className="text-xs text-gray-500">{tech.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
