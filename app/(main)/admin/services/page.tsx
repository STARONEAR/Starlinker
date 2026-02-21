'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
import { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'installation',
    base_price: 50,
    duration_minutes: 60,
  });
  const supabase = createClient();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false }) as { data: any };
    
    if (data) setServices(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    await supabase.from('services').insert({
      ...formData,
      is_active: true,
    } as any);
    
    setOpen(false);
    setFormData({ name: '', description: '', category: 'installation', base_price: 50, duration_minutes: 60 });
    loadServices();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    // @ts-expect-error - Supabase type inference issue
    await supabase.from('services').update({ is_active: !isActive }).eq('id', id);
    loadServices();
  };

  if (loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Service Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Service</Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <Typography variant="body2">{service.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{service.description?.slice(0, 50)}...</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={service.category} size="small" />
                </TableCell>
                <TableCell>${service.base_price}</TableCell>
                <TableCell>{service.duration_minutes} min</TableCell>
                <TableCell>
                  <Chip 
                    label={service.is_active ? 'Active' : 'Inactive'} 
                    size="small"
                    color={service.is_active ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => toggleActive(service.id, service.is_active)}>
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
            >
              <MenuItem value="installation">Installation</MenuItem>
              <MenuItem value="repair">Repair</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="consultation">Consultation</MenuItem>
            </Select>
            <TextField
              label="Base Price ($)"
              type="number"
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Service</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
