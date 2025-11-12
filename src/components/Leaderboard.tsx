import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          score,
          total_questions,
          completed_at,
          profiles:user_id (username)
        `)
        .order('score', { ascending: false })
        .order('completed_at', { ascending: true })
        .limit(10);

      if (error) throw error;

      const formattedData = data?.map((entry: any) => ({
        username: entry.profiles?.username || 'Anônimo',
        score: entry.score,
        total_questions: entry.total_questions,
        completed_at: entry.completed_at,
      })) || [];

      setLeaders(formattedData);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-primary" />;
    if (index === 1) return <Medal className="w-6 h-6 text-secondary" />;
    if (index === 2) return <Award className="w-6 h-6 text-accent" />;
    return <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>;
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Ranking Global
        </CardTitle>
        <CardDescription>Os melhores jogadores da Jornada Bíblica</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando ranking...</div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma pontuação registrada ainda. Seja o primeiro!
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-center w-10">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{leader.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(leader.completed_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {leader.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    de {leader.total_questions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
