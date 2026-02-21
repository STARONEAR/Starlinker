'use client';

import { Box, Typography, Rating, Paper, Stack, Avatar } from '@mui/material';
import { Database } from '@/types/database';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  users: { full_name: string | null; avatar_url: string | null };
};

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
        <Typography color="text.secondary">No reviews yet</Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {reviews.map((review) => (
        <Paper key={review.id} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar src={review.users.avatar_url || undefined} sx={{ width: 40, height: 40 }}>
              {review.users.full_name?.[0] || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {review.users.full_name || 'Anonymous'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          {review.comment && (
            <Typography variant="body2" color="text.secondary">
              {review.comment}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  );
}
