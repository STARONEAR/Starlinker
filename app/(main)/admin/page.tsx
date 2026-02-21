import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch stats
  const [
    { count: totalUsers },
    { count: totalProducts },
    { count: totalOrders },
    { count: totalBookings }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }) as any,
    supabase.from('products').select('*', { count: 'exact', head: true }) as any,
    supabase.from('orders').select('*', { count: 'exact', head: true }) as any,
    supabase.from('bookings').select('*', { count: 'exact', head: true }) as any,
  ]);

  const stats = [
    { label: 'Total Users', value: totalUsers || 0, icon: Users, color: '#3B82F6', link: '/admin/users' },
    { label: 'Total Products', value: totalProducts || 0, icon: Package, color: '#8B5CF6', link: '/admin/services' },
    { label: 'Total Orders', value: totalOrders || 0, icon: ShoppingCart, color: '#10B981', link: '/admin/deliveries' },
    { label: 'Total Bookings', value: totalBookings || 0, icon: TrendingUp, color: '#F59E0B', link: '/admin/analytics' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Admin Dashboard</Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Link href={stat.link} style={{ textDecoration: 'none' }}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderColor: stat.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `${stat.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/admin/users" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(59,130,246,0.1)', borderRadius: 1, cursor: 'pointer' }}>
                  <Typography>Manage Users</Typography>
                </Box>
              </Link>
              <Link href="/admin/services" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(139,92,246,0.1)', borderRadius: 1, cursor: 'pointer' }}>
                  <Typography>Manage Services</Typography>
                </Box>
              </Link>
              <Link href="/admin/deliveries" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(16,185,129,0.1)', borderRadius: 1, cursor: 'pointer' }}>
                  <Typography>Manage Deliveries</Typography>
                </Box>
              </Link>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Platform Status</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Database</Typography>
                <Typography color="success.main">● Online</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Realtime</Typography>
                <Typography color="success.main">● Active</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Storage</Typography>
                <Typography color="success.main">● Available</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
