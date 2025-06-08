import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
import axios from 'axios';

const topics = [
  { value: 'Daily Life', label: 'Günlük Hayat' },
  { value: 'Food & Drink', label: 'Yiyecek & İçecek' },
  { value: 'Travel & Transport', label: 'Ulaşım & Seyahat' },
  { value: 'Emotions & Personality', label: 'Duygular & Kişilik' },
  { value: 'Education & School', label: 'Eğitim & Okul' },
  { value: 'Nature & Weather', label: 'Doğa & Hava Durumu' },
];

const WordAdd: React.FC = () => {
  const [form, setForm] = useState({
    eng_word_name: '',
    tur_word_name: '',
    picture: '',
    topic: topics[0].value,
    pronunciation: '',
    sample: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, topic: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.tur_word_name || (!form.eng_word_name && !form.picture)) {
      setError('Türkçe ve (İngilizce veya Resim) zorunlu!');
      return;
    }
    try {
      await axios.post('/api/words/add', form);
      setSuccess('Kelime başarıyla eklendi!');
      setForm({
        eng_word_name: '',
        tur_word_name: '',
        picture: '',
        topic: topics[0].value,
        pronunciation: '',
        sample: '',
      });
    } catch (err) {
      setError('Kayıt sırasında hata oluştu!');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Typography variant="h4" fontWeight={700} mb={2}>Kelime Ekleme Modülü</Typography>
      <Typography color="text.secondary" mb={2}>Buradan yeni kelime ekleyebilirsiniz.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: 350 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField
          label="İngilizce Kelime"
          name="eng_word_name"
          value={form.eng_word_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Türkçe Karşılık *"
          name="tur_word_name"
          value={form.tur_word_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Resim (URL)"
          name="picture"
          value={form.picture}
          onChange={handleChange}
          fullWidth
          margin="normal"
          placeholder="uploads/kelime.jpg"
        />
        <TextField
          select
          label="Konu *"
          name="topic"
          value={form.topic}
          onChange={handleSelectChange}
          fullWidth
          margin="normal"
          required
        >
          {topics.map((topic) => (
            <MenuItem key={topic.value} value={topic.value}>{topic.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Telafuz (opsiyonel)"
          name="pronunciation"
          value={form.pronunciation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Örnek Cümle (opsiyonel)"
          name="sample"
          value={form.sample}
          onChange={handleChange}
          fullWidth
          margin="normal"
          placeholder="I have a red car."
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Ekle
        </Button>
      </Box>
    </Box>
  );
};

export default WordAdd; 