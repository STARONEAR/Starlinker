import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Box, Container, Typography, Paper, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type Delivery = Database['public']['Tables']['deliveries']['Row'];

export default async function OrdersPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      deliveries (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: any };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>My Orders</Typography>

      {!orders || orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)' }}>
          <Typography color="text.secondary">No orders yet</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {orders.map((order: any) => {
            const delivery = (order.deliveries as Delivery[])?.[0];
            
            return (
              <Link 
                key={order.id} 
                href={`/orders/${order.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Paper 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">Order #{order.id.slice(0, 8)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={order.status.replace('_', ' ')} 
                      color={
                        order.status === 'completed' ? 'success' : 
                        order.status === 'cancelled' ? 'error' : 
                        'primary'
                      }
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                      <Typography variant="h6" color="primary.main">
                        ${order.total_amount.toFixed(2)}
                      </Typography>
                    </Box>

                    {delivery && (
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">Delivery Status</Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {delivery.status.replace('_', ' ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Link>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
