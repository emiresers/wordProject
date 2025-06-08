const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Kullanıcı var mı kontrol et
    const userCheck = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten mevcut.' });
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Kullanıcı oluştur
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id',
      [username, hashedPassword]
    );
    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu.',
      userId: result.rows[0].user_id
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Kayıt olurken bir hata oluştu.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Kullanıcı var mı kontrol et
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }
    const user = result.rows[0];
    // Şifreyi kontrol et
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }
    // Token oluştur
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Giriş başarılı!',
      token,
      userId: user.user_id,
      username: user.username
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Giriş sırasında bir hata oluştu.' });
  }
});

// Şifre sıfırlama (reset password) route
router.post('/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    // Kullanıcı var mı kontrol et
    const userCheck = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Şifreyi güncelle
    await db.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [hashedPassword, username]
    );
    res.json({ message: 'Şifre başarıyla güncellendi!' });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({ message: 'Şifre sıfırlanırken bir hata oluştu.' });
  }
});

module.exports = router; 