'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersThisMonth: 0,
    bookingsThisMonth: 0,
    activeProducts: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
      { data: orders },
      { data: bookings },
      { count: activeProducts }
    ] = await Promise.all([
      supabase.from('orders').select('total_amount, created_at') as any,
      supabase.from('bookings').select('created_at').gte('created_at', firstDayOfMonth) as any,
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true) as any,
    ]);

    const totalRevenue = orders?.reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0;
    const ordersThisMonth = orders?.filter((o: any) => o.created_at >= firstDayOfMonth).length || 0;
    const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0;

    setStats({
      totalRevenue,
      ordersThisMonth,
      bookingsThisMonth: bookings?.length || 0,
      activeProducts: activeProducts || 0,
      avgOrderValue,
    });
    setLoading(false);
  };

  if (loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;

  const metrics = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: '#10B981' },
    { label: 'Orders This Month', value: stats.ordersThisMonth, color: '#3B82F6' },
    { label: 'Bookings This Month', value: stats.bookingsThisMonth, color: '#8B5CF6' },
    { label: 'Active Products', value: stats.activeProducts, color: '#F59E0B' },
    { label: 'Avg Order Value', value: `$${stats.avgOrderValue.toFixed(2)}`, color: '#EC4899' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Analytics Dashboard</Typography>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.label}>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {metric.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Platform Overview</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(16,185,129,0.1)', borderRadius: 1 }}>
                <Typography>Revenue Growth</Typography>
                <Typography color="success.main">+12.5%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(59,130,246,0.1)', borderRadius: 1 }}>
                <Typography>User Engagement</Typography>
                <Typography color="primary.main">High</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(139,92,246,0.1)', borderRadius: 1 }}>
                <Typography>Order Fulfillment Rate</Typography>
                <Typography color="secondary.main">94%</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
