'use client';

import { useState } from 'react';
import { Box, Button, TextField, Rating, Typography, Paper } from '@mui/material';
import { createClient } from '@/lib/supabase/client';

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('reviews').insert({
      product_id: productId,
      order_id: orderId,
      reviewer_id: user.id,
      rating,
      comment,
    } as any);

    setLoading(false);
    onSuccess();
  };

  return (
    <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Write a Review</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Rating</Typography>
          <Rating value={rating} onChange={(_, value) => setRating(value)} size="large" />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={loading || !rating}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Paper>
  );
}
