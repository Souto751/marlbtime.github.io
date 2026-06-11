import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import type { ProductQuestion } from '../types';

interface ProductQuestionsProps {
  questions: ProductQuestion[];
  onAskQuestion?: () => void;
}

function formatQuestionDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default function ProductQuestions({ questions, onAskQuestion }: ProductQuestionsProps) {
  const answeredCount = questions.filter((q) => q.answer).length;

  return (
    <Box component="section" aria-labelledby="product-questions-heading">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        mb={2.5}
      >
        <Box>
          <Typography id="product-questions-heading" variant="h6" fontWeight={700} gutterBottom>
            Preguntas y respuestas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {questions.length} {questions.length === 1 ? 'consulta' : 'consultas'}
            {answeredCount > 0 && ` · ${answeredCount} respondidas`}
          </Typography>
        </Box>
        {onAskQuestion && (
          <Button variant="outlined" size="small" onClick={onAskQuestion}>
            Hacer una pregunta
          </Button>
        )}
      </Stack>

      {questions.length === 0 ? (
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: { xs: 2, sm: 2.5 },
            py: 3,
            textAlign: 'center',
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Todavía no hay preguntas sobre este producto.
          </Typography>
          {onAskQuestion && (
            <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={onAskQuestion}>
              Sé el primero en preguntar
            </Button>
          )}
        </Box>
      ) : (
        <Stack spacing={2}>
          {questions.map((item) => (
            <Box
              key={item.id}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 2, sm: 2.5 },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={1.5}>
                <QuestionAnswerOutlinedIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.25 }} />
                <Box flex={1}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ sm: 'center' }}
                    spacing={0.5}
                    mb={0.5}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {item.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatQuestionDate(item.date)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.primary">
                    {item.question}
                  </Typography>
                </Box>
              </Stack>

              {item.answer ? (
                <Box
                  sx={{
                    ml: { xs: 0, sm: 4.5 },
                    pl: { xs: 2, sm: 2.5 },
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <Typography variant="caption" fontWeight={600} color="primary.main">
                      {item.answeredBy ?? 'Vendedor'}
                    </Typography>
                    {item.answerDate && (
                      <Typography variant="caption" color="text.secondary">
                        · {formatQuestionDate(item.answerDate)}
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {item.answer}
                  </Typography>
                </Box>
              ) : (
                <Chip
                  label="Sin responder"
                  size="small"
                  variant="outlined"
                  sx={{ ml: { xs: 0, sm: 4.5 }, mt: 0.5 }}
                />
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
