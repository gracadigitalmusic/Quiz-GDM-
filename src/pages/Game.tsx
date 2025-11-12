import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const biblicalQuestions: Question[] = [
  {
    id: 1,
    question: "Quem foi o primeiro homem criado por Deus?",
    options: ["Noé", "Abraão", "Adão", "Moisés"],
    correctAnswer: 2,
    category: "Antigo Testamento"
  },
  {
    id: 2,
    question: "Quantos dias e noites durou o dilúvio?",
    options: ["7", "30", "40", "100"],
    correctAnswer: 2,
    category: "Antigo Testamento"
  },
  {
    id: 3,
    question: "Quem construiu a arca?",
    options: ["Abraão", "Noé", "Moisés", "Davi"],
    correctAnswer: 1,
    category: "Antigo Testamento"
  },
  {
    id: 4,
    question: "Qual o nome da mãe de Jesus?",
    options: ["Marta", "Maria Madalena", "Maria", "Isabel"],
    correctAnswer: 2,
    category: "Novo Testamento"
  },
  {
    id: 5,
    question: "Quantos discípulos Jesus tinha?",
    options: ["10", "12", "7", "15"],
    correctAnswer: 1,
    category: "Novo Testamento"
  },
  {
    id: 6,
    question: "Quem traiu Jesus?",
    options: ["Pedro", "João", "Judas", "Tiago"],
    correctAnswer: 2,
    category: "Novo Testamento"
  },
  {
    id: 7,
    question: "Quem matou Golias?",
    options: ["Saul", "Samuel", "Davi", "Salomão"],
    correctAnswer: 2,
    category: "Antigo Testamento"
  },
  {
    id: 8,
    question: "Quantos livros tem a Bíblia?",
    options: ["66", "73", "50", "100"],
    correctAnswer: 0,
    category: "Geral"
  },
  {
    id: 9,
    question: "Onde Jesus nasceu?",
    options: ["Jerusalém", "Nazaré", "Belém", "Cafarnaum"],
    correctAnswer: 2,
    category: "Novo Testamento"
  },
  {
    id: 10,
    question: "Quem recebeu os Dez Mandamentos?",
    options: ["Abraão", "Moisés", "Josué", "Elias"],
    correctAnswer: 1,
    category: "Antigo Testamento"
  }
];

const Game = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === biblicalQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correto! 🎉",
        description: "Você acertou!",
      });
    } else {
      toast({
        title: "Ops! ❌",
        description: "Resposta incorreta.",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentQuestion < biblicalQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        finishGame();
      }
    }, 1500);
  };

  const finishGame = async () => {
    setGameFinished(true);
    
    if (user) {
      try {
        await supabase.from('quiz_results').insert({
          user_id: user.id,
          score,
          total_questions: biblicalQuestions.length,
          category: 'Geral',
        });
        
        toast({
          title: "Pontuação salva! 🏆",
          description: `Você acertou ${score} de ${biblicalQuestions.length} perguntas!`,
        });
      } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
      }
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameFinished(false);
  };

  if (!user) return null;

  if (gameFinished) {
    const percentage = (score / biblicalQuestions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-2 shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">Jogo Concluído!</CardTitle>
            <CardDescription className="text-lg">Confira sua pontuação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {score}/{biblicalQuestions.length}
              </div>
              <p className="text-2xl text-muted-foreground">
                {percentage >= 80 ? '🌟 Excelente!' : percentage >= 60 ? '👏 Muito bom!' : percentage >= 40 ? '📖 Continue estudando!' : '💪 Não desista!'}
              </p>
            </div>
            
            <Progress value={percentage} className="h-4" />
            
            <div className="flex gap-4">
              <Button onClick={restartGame} className="flex-1" size="lg">
                Jogar Novamente
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="flex-1" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = biblicalQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / biblicalQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/20 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pergunta {currentQuestion + 1} de {biblicalQuestions.length}
            </span>
            <span className="text-sm font-bold text-primary">
              Pontuação: {score}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-wide">
              {question.category}
            </CardDescription>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = selectedAnswer !== null && isCorrect;
              const showIncorrect = selectedAnswer !== null && isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  variant={showCorrect ? "default" : showIncorrect ? "destructive" : "outline"}
                  className={`w-full justify-start text-left h-auto py-4 px-6 text-base transition-all ${
                    showCorrect ? 'bg-success hover:bg-success' : ''
                  }`}
                >
                  <span className="flex items-center gap-3 w-full">
                    <span className="font-bold text-lg">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                    {showIncorrect && <XCircle className="w-5 h-5" />}
                  </span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;
