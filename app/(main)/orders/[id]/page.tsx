import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Box, Container, Typography, Paper, Grid, Divider, Stack } from '@mui/material';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  products: Database['public']['Tables']['products']['Row'];
};
type Delivery = Database['public']['Tables']['deliveries']['Row'];

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      ),
      deliveries (*)
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single() as { data: any };

  if (!order) notFound();

  const items = order.order_items as OrderItem[];
  const delivery = (order.deliveries as Delivery[])?.[0];

  // Check if order is delivered and get existing reviews
  const canReview = delivery?.status === 'delivered';
  const { data: existingReviews } = await supabase
    .from('reviews')
    .select('product_id')
    .eq('order_id', order.id) as { data: any };
  
  const reviewedProductIds = new Set(existingReviews?.map((r: any) => r.product_id) || []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Order #{order.id.slice(0, 8)}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Order Items</Typography>
            <Stack spacing={2}>
              {items.map((item) => (
                <Box key={item.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="body1">{item.products.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="primary.main">
                      ${item.price_at_time.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 3, pt: 2, borderTop: '2px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${order.total_amount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Delivery Fee</Typography>
                <Typography variant="body1">$5.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">
                  ${(order.total_amount + 5).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Delivery Address</Typography>
            <Typography variant="body1">{order.delivery_address}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {order.delivery_city}, {order.delivery_state} {order.delivery_zip}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Contact: {order.delivery_phone}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {delivery ? (
            <DeliveryTracker
              status={delivery.status}
              currentLocation={delivery.current_location || undefined}
              estimatedDelivery={delivery.estimated_delivery || undefined}
            />
          ) : (
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Delivery Status</Typography>
              <Typography color="text.secondary">Delivery information not available yet</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Review Section */}
      {canReview && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Review Products</Typography>
          <Stack spacing={3}>
            {items.map((item) => (
              !reviewedProductIds.has(item.product_id) && (
                <Box key={item.product_id}>
                  <Typography variant="h6" sx={{ mb: 2 }}>{item.products.title}</Typography>
                  <ReviewForm
                    productId={item.product_id}
                    orderId={order.id}
                    onSuccess={() => window.location.reload()}
                  />
                </Box>
              )
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
}
