import React from 'react';
import { Box, Typography } from '@mui/material';

const WordChain: React.FC = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
    <Typography variant="h4" fontWeight={700} mb={2}>Word Chain Modülü</Typography>
    <Typography color="text.secondary">Buradan kelime zinciri oluşturabilirsiniz.</Typography>
  </Box>
);

export default WordChain; 