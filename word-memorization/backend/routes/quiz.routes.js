const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middlewares/authMiddleware');

// JWT ile kullanıcıyı doğrulayan bir middleware eklemelisin (ör: authMiddleware)
// Şimdilik req.user.user_id üzerinden user_id alındığı varsayılıyor

// Quiz oluşturma
router.get('/generate', authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const now = new Date();

  // 1. Önce review zamanı gelmiş kelimeleri al
  const reviewWordsRes = await db.query(
    `SELECT w.* FROM words w
     JOIN word_progress wp ON w.word_id = wp.word_id
     WHERE wp.user_id = $1 
     AND wp.next_review_date <= $2
     AND wp.is_learned = FALSE
     ORDER BY wp.next_review_date ASC
     LIMIT 5`, [userId, now]
  );

  // 2. Henüz hiç sorulmamış kelimeleri al
  const remainingSlots = 10 - reviewWordsRes.rows.length;
  const newWordsRes = await db.query(
    `SELECT w.* FROM words w
     LEFT JOIN word_progress wp ON w.word_id = wp.word_id AND wp.user_id = $1
     WHERE wp.progress_id IS NULL
     ORDER BY RANDOM()
     LIMIT $2`, [userId, remainingSlots]
  );

  const allWords = [...reviewWordsRes.rows, ...newWordsRes.rows];
  let questions = [];

  for (const word of allWords) {
    let type = 'word';
    if (word.picture) type = Math.random() < 0.33 ? 'picture' : 'word';
    const sampleRes = await db.query(
      `SELECT samples FROM wordsamples WHERE wordid = $1 LIMIT 1`, [word.word_id]
    );
    if (sampleRes.rows.length > 0 && Math.random() < 0.5) type = 'sample';

    let choices = [];
    let correct, questionText, image, sample;

    if (type === 'word') {
      correct = word.tur_word_name;
      const wrongsRes = await db.query(
        `SELECT tur_word_name FROM words WHERE word_id != $1 ORDER BY RANDOM() LIMIT 3`, [word.word_id]
      );
      choices = [correct, ...wrongsRes.rows.map(r => r.tur_word_name)];
      choices = choices.sort(() => Math.random() - 0.5);
      const correctIndex = choices.indexOf(correct);
      questionText = word.eng_word_name;
      questions.push({
        word_id: word.word_id,
        type,
        questionText,
        image: undefined,
        sample: undefined,
        choices,
        correctIndex
      });
    } else if (type === 'picture') {
      correct = word.eng_word_name;
      const wrongsRes = await db.query(
        `SELECT eng_word_name FROM words WHERE word_id != $1 ORDER BY RANDOM() LIMIT 3`, [word.word_id]
      );
      choices = [correct, ...wrongsRes.rows.map(r => r.eng_word_name)];
      choices = choices.sort(() => Math.random() - 0.5);
      const correctIndex = choices.indexOf(correct);
      questionText = null;
      image = word.picture;
      questions.push({
        word_id: word.word_id,
        type,
        questionText,
        image,
        sample: undefined,
        choices,
        correctIndex
      });
    } else if (type === 'sample') {
      sample = sampleRes.rows[0].samples.replace(
        new RegExp(word.eng_word_name, 'gi'),
        `<u>${word.eng_word_name}</u>`
      );
      correct = word.tur_word_name;
      const wrongsRes = await db.query(
        `SELECT tur_word_name FROM words WHERE word_id != $1 ORDER BY RANDOM() LIMIT 3`, [word.word_id]
      );
      choices = [correct, ...wrongsRes.rows.map(r => r.tur_word_name)];
      choices = choices.sort(() => Math.random() - 0.5);
      const correctIndex = choices.indexOf(correct);
      questions.push({
        word_id: word.word_id,
        type,
        questionText: null,
        image: undefined,
        sample,
        choices,
        correctIndex
      });
    }
  }

  res.json({ questions });
});

// Cevap kontrolü ve ilerleme güncelleme
router.post('/answer', authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const { word_id, is_correct } = req.body;
  const now = new Date();

  const progressRes = await db.query(
    `SELECT * FROM word_progress WHERE user_id = $1 AND word_id = $2`, [userId, word_id]
  );

  if (progressRes.rows.length === 0) {
    // İlk kez cevaplanan kelime
    const nextReviewDate = is_correct ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : now; // 1 gün sonra
    await db.query(
      `INSERT INTO word_progress (user_id, word_id, correct_count, last_correct_date, next_review_date, review_stage)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, word_id, is_correct ? 1 : 0, is_correct ? now : null, nextReviewDate, is_correct ? 1 : 0]
    );
  } else {
    const progress = progressRes.rows[0];
    if (is_correct) {
      const newStage = progress.review_stage + 1;
      let nextReviewDate;
      
      // Spaced repetition intervals
      switch (newStage) {
        case 1: // 1 gün
          nextReviewDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 2: // 1 hafta
          nextReviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 3: // 1 ay
          nextReviewDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case 4: // 3 ay
          nextReviewDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
          break;
        case 5: // 6 ay
          nextReviewDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
          break;
        case 6: // 1 yıl
          nextReviewDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          nextReviewDate = now;
      }

      const isLearned = newStage > 6;
      await db.query(
        `UPDATE word_progress 
         SET correct_count = correct_count + 1, 
             last_correct_date = $1, 
             next_review_date = $2, 
             review_stage = $3, 
             is_learned = $4 
         WHERE progress_id = $5`,
        [now, nextReviewDate, newStage, isLearned, progress.progress_id]
      );
    } else {
      // Yanlış cevap durumunda başa dön
      await db.query(
        `UPDATE word_progress 
         SET correct_count = 0, 
             last_correct_date = NULL, 
             next_review_date = $1, 
             review_stage = 0 
         WHERE progress_id = $2`,
        [now, progress.progress_id]
      );
    }
  }

  res.json({ success: true });
});

module.exports = router; 