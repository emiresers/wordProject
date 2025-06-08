const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

const allowedTopics = [
  "Daily Life",
  "Food & Drink",
  "Travel & Transport",
  "Emotions & Personality",
  "Education & School",
  "Nature & Weather"
];

// Kelime ekleme endpoint'i
router.post('/add', async (req, res) => {
  const { eng_word_name, tur_word_name, picture, topic, pronunciation, sample } = req.body;

  // Zorunlu alan kontrolü
  if (!tur_word_name || (!eng_word_name && !picture) || !topic) {
    return res.status(400).json({ message: "Türkçe ve (İngilizce veya Resim) zorunlu, konu seçilmeli!" });
  }
  if (!allowedTopics.includes(topic)) {
    return res.status(400).json({ message: "Geçersiz konu!" });
  }

  try {
    // Önce kelimeyi ekle
    const result = await db.query(
      `INSERT INTO words (eng_word_name, tur_word_name, picture, topic, pronunciation)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [eng_word_name || null, tur_word_name, picture || null, topic, pronunciation || null]
    );
    const word = result.rows[0];

    // Eğer sample varsa, WordSamples tablosuna ekle
    if (sample && sample.trim().length > 0) {
      await db.query(
        `INSERT INTO wordsamples (wordid, samples) VALUES ($1, $2)`,
        [word.word_id, sample]
      );
    }

    res.status(201).json(word);
  } catch (err) {
    res.status(500).json({ message: "Veritabanı hatası", error: err });
  }
});

module.exports = router; 