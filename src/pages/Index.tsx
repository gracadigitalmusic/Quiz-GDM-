import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Leaderboard } from '@/components/Leaderboard';
import { Book, Play, LogOut, Sparkles } from 'lucide-react';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6">
            <Book className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            Jornada Bíblica <Sparkles className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Teste seus conhecimentos sobre a Palavra de Deus
          </p>
          <p className="text-sm text-muted-foreground">
            Bem-vindo(a), <span className="font-semibold text-foreground">{user.email}</span>
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Como Jogar</CardTitle>
              <CardDescription>Regras simples para começar sua jornada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-sm">Responda 10 perguntas sobre a Bíblia</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm">Escolha a resposta correta entre 4 opções</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm">Acumule pontos e suba no ranking!</p>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => navigate('/game')} 
                  className="w-full" 
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Começar Jogo
                </Button>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>

          <Leaderboard />
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="border-2 shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="text-2xl">📖 Dica Espiritual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic text-muted-foreground">
                "Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho." - Salmos 119:105
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
