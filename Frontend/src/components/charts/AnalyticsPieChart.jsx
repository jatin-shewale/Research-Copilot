import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#6366F1', '#A78BFA', '#60A5FA', '#22C55E', '#F59E0B', '#EF4444', '#0EA5E9', '#EC4899']

export default function AnalyticsPieChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#64748B' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
