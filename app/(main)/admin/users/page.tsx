'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Box } from '@mui/material';
import { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false }) as { data: any };
    
    if (data) setUsers(data);
    setLoading(false);
  };

  if (loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>User Management</Typography>

      <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar_url || undefined} sx={{ width: 32, height: 32 }}>
                      {user.full_name?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{user.full_name || 'Anonymous'}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.id.slice(0, 8)}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small"
                    color={user.role === 'admin' ? 'error' : user.role === 'seller' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>{user.location || '-'}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
