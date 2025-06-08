import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Question {
  word_id: number;
  type: 'word' | 'picture' | 'sample';
  questionText?: string | null;
  image?: string | null;
  sample?: string | null;
  choices: string[];
  correctIndex: number;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/quiz/generate', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data.questions);
      } catch (err) {
        setError('Sorular yüklenemedi.');
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (choice: string, idx: number) => {
    if (!questions[current]) return;
    setSelected(choice);
    const isCorrect = idx === questions[current].correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    // Cevabı backend'e gönder
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/quiz/answer', {
        word_id: questions[current].word_id,
        is_correct: isCorrect
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (finished) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Typography variant="h4" fontWeight={700} mb={2}>Sınav Tamamlandı!</Typography>
      <Typography>Doğru Sayısı: {score} / {questions.length}</Typography>
    </Box>
  );
  if (!questions.length) return <Typography>Hiç soru bulunamadı.</Typography>;

  const q = questions[current];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Typography variant="h5" mb={2}>Soru {current + 1} / {questions.length}</Typography>
      <Card sx={{ minWidth: 350, mb: 2 }}>
        <CardContent>
          {q.type === 'word' && (
            <Typography variant="h6">{q.questionText}</Typography>
          )}
          {q.type === 'picture' && q.image && (
            <img src={q.image} alt="Kelime" style={{ maxWidth: 300, maxHeight: 200, marginBottom: 16 }} />
          )}
          {q.type === 'sample' && q.sample && (
            <Typography variant="h6" dangerouslySetInnerHTML={{ __html: q.sample }} />
          )}
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            {q.choices.map((choice, idx) => (
              <Button
                key={idx}
                variant={selected === choice ? (idx === q.correctIndex ? 'contained' : 'outlined') : 'outlined'}
                color={selected ? (idx === q.correctIndex ? 'success' : (selected === choice ? 'error' : 'primary')) : 'primary'}
                onClick={() => !selected && handleAnswer(choice, idx)}
                disabled={!!selected}
              >
                {choice}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
      {selected && <Typography mt={2}>{q.choices[q.correctIndex] === selected ? 'Doğru!' : 'Yanlış!'}</Typography>}
    </Box>
  );
};

export default Quiz; 