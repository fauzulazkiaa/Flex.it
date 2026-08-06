import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Activity, Category, STATUS_LABELS } from '../types';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

interface AnalyticsChartsProps {
  activities: Activity[];
  categories: Category[];
  selectedYear: string;
  selectedMonth: string;
}

const CATEGORY_COLORS = [
  '#10B981', // emerald
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#EC4899', // pink
  '#F43F5E', // rose
  '#14B8A6', // teal
  '#64748B', // slate
];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ activities, categories, selectedYear, selectedMonth }) => {
  const filtered = activities.filter(a => {
    const matchYear = selectedYear === 'ALL' || a.year.toString() === selectedYear;
    let matchMonth = true;
    if (selectedMonth !== 'ALL') {
      const dateStr = a.regDeadline || a.eventDate || a.createdAt;
      if (dateStr) {
        const month = new Date(dateStr).getMonth().toString();
        matchMonth = month === selectedMonth;
      }
    }
    return matchYear && matchMonth;
  });

  // 1. Distribution by Category (Pie Chart Data)
  const categoryDataMap: Record<string, number> = {};
  filtered.forEach(a => {
    categoryDataMap[a.categoryId] = (categoryDataMap[a.categoryId] || 0) + 1;
  });

  const pieData = Object.keys(categoryDataMap).map((catId, index) => {
    const catObj = categories.find(c => c.id === catId);
    return {
      name: catObj ? catObj.name : 'Lainnya',
      value: categoryDataMap[catId],
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
  }).filter(d => d.value > 0);

  // 2. Status Breakdown per Category (Bar Chart Data)
  const barData = categories.map(cat => {
    const catActs = filtered.filter(a => a.categoryId === cat.id);
    return {
      name: cat.name,
      'Belum Daftar': catActs.filter(a => a.status === 'BELUM_DAFTAR').length,
      'Sudah Daftar': catActs.filter(a => a.status === 'SUDAH_DAFTAR').length,
      'Lolos': catActs.filter(a => a.status === 'LOLOS').length,
      'Tidak Lolos': catActs.filter(a => a.status === 'TIDAK_LOLOS').length,
      'Selesai': catActs.filter(a => a.status === 'SELESAI').length,
      total: catActs.length,
    };
  }).filter(d => d.total > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Pie Chart Distribusi Kategori */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-base">
                Distribusi Kegiatan per Kategori
              </h3>
              <p className="text-xs text-zinc-400">
                Persentase fokus program yang diikuti
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            {pieData.reduce((acc, curr) => acc + curr.value, 0)} Total
          </span>
        </div>

        {pieData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-zinc-500">
            Belum ada data kegiatan untuk kategori ini.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121215', 
                    border: '1px solid #27272a', 
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px'
                  }} 
                  formatter={(value: number) => [`${value} Kegiatan`, 'Jumlah']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend Custom */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border-t border-zinc-800/80 pt-3">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-zinc-400 truncate">{item.name}:</span>
              <span className="font-semibold text-zinc-100">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Bar Chart Breakdown Status per Kategori */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-base">
                Status Capaian per Kategori
              </h3>
              <p className="text-xs text-zinc-400">
                Perbandingan pendaftaran, lolos, dan kelulusan
              </p>
            </div>
          </div>
        </div>

        {barData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-zinc-500">
            Belum ada data untuk ditampilkan dalam grafik.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#a1a1aa' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121215', 
                    borderRadius: '12px', 
                    color: '#f4f4f5', 
                    border: '1px solid #27272a',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="Belum Daftar" stackId="a" fill="#71717a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Sudah Daftar" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Lolos" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Tidak Lolos" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Selesai" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-3 justify-center text-xs border-t border-zinc-800/80 pt-3 text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-zinc-500" /> Belum</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Sudah Daftar</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Lolos</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Tidak Lolos</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal-500" /> Selesai</span>
        </div>

      </div>

    </div>
  );
};
