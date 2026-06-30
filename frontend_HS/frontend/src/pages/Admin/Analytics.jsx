import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#ef4444"];
const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50">
      <h2 className="font-bold text-blue-950 text-lg mb-1">{title}</h2>
      <p className="text-xs text-gray-400 font-medium mb-6">{subtitle}</p>
      <div className="h-[350px]">{children}</div>
    </div>
  );
}

function Analytics({ users, homestays, bookings, revenue }) {
  const bookingStatus = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "CONFIRMED").length },
    { name: "Pending", value: bookings.filter((b) => b.status === "PENDING").length },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "CANCELLED").length },
  ].filter((item) => item.value > 0);

  const monthlyRevenue = MONTHS.map((month, index) => ({
    month,
    value: bookings
      .filter((b) => b.status === "CONFIRMED")
      .filter((b) => {
        if (!b.checkInDate) return false;
        const checkInMonth = new Date(b.checkInDate).getMonth();
        return checkInMonth === index;
      })
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  }));

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Users" value={users.length} />
        <StatCard title="Homestays" value={homestays.length} />
        <StatCard title="Bookings" value={bookings.length} />
        <StatCard title="Revenue" value={`${revenue.toLocaleString()} đ`} isRevenue />
      </div>

      {bookingStatus.length > 0 && (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <ChartCard title="Booking Status" subtitle="Tỉ lệ trạng thái đặt phòng">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bookingStatus} dataKey="value" innerRadius={75} outerRadius={100} paddingAngle={3}>
                    {bookingStatus.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="lg:col-span-7">
            <ChartCard title="Revenue Overview" subtitle="Doanh thu theo tháng">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} barSize={28}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v} />
                  <Tooltip cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, isRevenue }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100/80 shadow-sm shadow-gray-100/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">{title}</div>
      <div className={`text-3xl font-black tracking-tight ${isRevenue ? 'text-orange-500' : 'text-blue-950'}`}>{value}</div>
    </div>
  );
}

export default Analytics;