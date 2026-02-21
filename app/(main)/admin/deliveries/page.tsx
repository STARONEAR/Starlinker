'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Container, Typography, Paper, Stack, Box, Select, MenuItem, TextField, Button, Chip } from '@mui/material';
import { Database } from '@/types/database';

type Delivery = Database['public']['Tables']['deliveries']['Row'] & {
  orders: Database['public']['Tables']['orders']['Row'];
};
type DeliveryStatus = Database['public']['Enums']['delivery_status'];

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    const { data } = await supabase
      .from('deliveries')
      .select('*, orders(*)')
      .order('created_at', { ascending: false }) as { data: any };
    
    if (data) setDeliveries(data as Delivery[]);
    setLoading(false);
  };

  const updateDelivery = async (id: string, updates: Record<string, any>) => {
    // @ts-expect-error - Supabase type inference issue with update
    await supabase.from('deliveries').update(updates).eq('id', id);
    loadDeliveries();
  };

  if (loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Manage Deliveries</Typography>

      <Stack spacing={2}>
        {deliveries.map((delivery) => (
          <Paper key={delivery.id} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6">Order #{delivery.order_id.slice(0, 8)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Delivery #{delivery.id.slice(0, 8)}
                </Typography>
              </Box>
              <Chip 
                label={delivery.status.replace('_', ' ')} 
                color={delivery.status === 'delivered' ? 'success' : 'primary'}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={delivery.status}
                  onChange={(e) => updateDelivery(delivery.id, { status: e.target.value as DeliveryStatus })}
                  sx={{ mt: 0.5 }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="picked_up">Picked Up</MenuItem>
                  <MenuItem value="in_transit">In Transit</MenuItem>
                  <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Current Location</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={delivery.current_location || ''}
                  onChange={(e) => updateDelivery(delivery.id, { current_location: e.target.value })}
                  placeholder="Enter location"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">Estimated Delivery</Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={delivery.estimated_delivery?.split('T')[0] || ''}
                onChange={(e) => updateDelivery(delivery.id, { estimated_delivery: e.target.value })}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
