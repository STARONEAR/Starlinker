import { Box, Rating, Typography } from '@mui/material';

interface RatingDisplayProps {
  rating: number;
  count: number;
}

export default function RatingDisplay({ rating, count }: RatingDisplayProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating value={rating} readOnly precision={0.1} size="small" />
      <Typography variant="body2" color="text.secondary">
        {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
      </Typography>
    </Box>
  );
}
