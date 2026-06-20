import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function AnalyticsBarChart({ data, dataKey = 'value', xKey = 'name', color = '#6366F1', height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: 'rgba(99,102,241,0.06)' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12, boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  )
}
