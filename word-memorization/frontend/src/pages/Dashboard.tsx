import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import { Build, MenuBook, Extension, Link as LinkIcon } from '@mui/icons-material';

const modules = [
  {
    title: 'Kelime Ekleme',
    description: 'Yeni kelimeler ve örnek cümleler ekleyin.',
    icon: <MenuBook sx={{ fontSize: 48 }} />, 
    path: '/word-add',
  },
  {
    title: 'Sınav',
    description: 'Ezber algoritmasına göre test olun.',
    icon: <Build sx={{ fontSize: 48 }} />, 
    path: '/quiz',
  },
  {
    title: 'Bulmaca (Wordle)',
    description: 'Öğrendiğiniz kelimelerle bulmaca çözün.',
    icon: <Extension sx={{ fontSize: 48 }} />, 
    path: '/wordle',
  },
  {
    title: 'Word Chain',
    description: 'Kelimelerle zincir oluşturun.',
    icon: <LinkIcon sx={{ fontSize: 48 }} />, 
    path: '/word-chain',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} align="center" mb={4}>
        Modül Seçimi
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {modules.map((mod) => (
          <Grid item xs={12} sm={6} md={3} key={mod.title}>
            <Card>
              <CardActionArea onClick={() => navigate(mod.path)}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200 }}>
                  {mod.icon}
                  <Typography variant="h6" fontWeight={600} mt={2}>{mod.title}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center" mt={1}>{mod.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 