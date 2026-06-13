import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { useApiList } from "../../hooks/useApiList";
import { api, unwrap } from "../../lib/api";
import { date, money } from "../../utils/formatters";

const chartColors = ["#15803d", "#0f766e", "#f59e0b", "#2563eb", "#dc2626", "#7c3aed"];

function ChartCard({ title, children }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <div style={{ width: "100%", height: 300 }}>{children}</div>
      </CardContent>
    </Card>
  );
}

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rows: logs } = useApiList("/admin/audit-logs", { limit: 8 });

  useEffect(() => {
    Promise.all([api.get("/admin/dashboard-stats"), api.get("/admin/dashboard-analytics")])
      .then(([statsResponse, analyticsResponse]) => {
        setStats(unwrap(statsResponse));
        setAnalytics(unwrap(analyticsResponse));
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    ["Users", stats?.totalUsers],
    ["Properties", stats?.totalProperties],
    ["Bookings", stats?.totalBookings],
    ["Revenue", money(stats?.totalRevenue)],
  ];

  return (
    <Page title="Overview" subtitle="Platform totals, revenue trends, booking health, and recent admin activity.">
      <Grid container spacing={2}>
        {cards.map(([label, value]) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card><CardContent><Typography color="text.secondary">{label}</Typography>{loading ? <Skeleton /> : <Typography variant="h5">{value ?? 0}</Typography>}</CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <ChartCard title="Monthly revenue and bookings">
            <ResponsiveContainer>
              <AreaChart data={analytics?.monthly || []} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value, name) => name === "revenue" ? money(value) : value} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#15803d" fill="#bbf7d0" name="Revenue" />
                <Area type="monotone" dataKey="bookings" stroke="#0f766e" fill="#ccfbf1" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ChartCard title="Booking status mix">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={analytics?.booking_status || []} dataKey="value" nameKey="name" outerRadius={95} label>
                  {(analytics?.booking_status || []).map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="New users and properties">
            <ResponsiveContainer>
              <BarChart data={analytics?.monthly || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#15803d" name="Users" />
                <Bar dataKey="properties" fill="#f59e0b" name="Properties" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="Top properties by bookings">
            <ResponsiveContainer>
              <BarChart data={analytics?.top_properties || []} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={130} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#15803d" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      <DataTable
        columns={[{ key: "action", label: "Action" }, { key: "admin.email", label: "Admin" }, { key: "created_at", label: "When", render: (row) => date(row.created_at) }]}
        rows={logs}
        loading={false}
        empty="No recent audit activity"
      />
    </Page>
  );
}
