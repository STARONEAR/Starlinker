'use client';

import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { Database } from '@/types/database';

type DeliveryStatus = Database['public']['Enums']['delivery_status'];

interface DeliveryTrackerProps {
  status: DeliveryStatus;
  currentLocation?: string;
  estimatedDelivery?: string;
}

const statusSteps: DeliveryStatus[] = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

const statusLabels: Record<DeliveryStatus, string> = {
  pending: 'Order Placed',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed'
};

export default function DeliveryTracker({ status, currentLocation, estimatedDelivery }: DeliveryTrackerProps) {
  const currentIndex = statusSteps.indexOf(status);
  const isCancelled = status === 'cancelled' || status === 'failed';

  return (
    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Delivery Status</Typography>
      
      <Stack spacing={2}>
        {statusSteps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isDisabled = isCancelled || index > currentIndex;

          return (
            <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isCompleted || isActive ? 'primary.main' : 'rgba(255,255,255,0.05)',
                  color: isCompleted || isActive ? 'white' : 'text.disabled',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}
              >
                {isCompleted ? '✓' : index + 1}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: isActive ? 'primary.main' : isCompleted ? 'text.primary' : 'text.disabled',
                    fontWeight: isActive ? 600 : 400
                  }}
                >
                  {statusLabels[step]}
                </Typography>
              </Box>
              {isActive && (
                <Chip label="Current" size="small" color="primary" />
              )}
            </Box>
          );
        })}
      </Stack>

      {isCancelled && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'error.dark', borderRadius: 1 }}>
          <Typography variant="body2" color="error.light">
            Delivery {status}
          </Typography>
        </Box>
      )}

      {currentLocation && !isCancelled && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(59,130,246,0.1)', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">Current Location</Typography>
          <Typography variant="body2">{currentLocation}</Typography>
        </Box>
      )}

      {estimatedDelivery && !isCancelled && status !== 'delivered' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(139,92,246,0.1)', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">Estimated Delivery</Typography>
          <Typography variant="body2">{new Date(estimatedDelivery).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}</Typography>
        </Box>
      )}
    </Paper>
  );
}
