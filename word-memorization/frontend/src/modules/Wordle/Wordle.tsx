import React from 'react';
import { Box, Typography } from '@mui/material';

const Wordle: React.FC = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
    <Typography variant="h4" fontWeight={700} mb={2}>Bulmaca (Wordle) Modülü</Typography>
    <Typography color="text.secondary">Buradan kelime bulmaca oyununu oynayabilirsiniz.</Typography>
  </Box>
);

export default Wordle; 