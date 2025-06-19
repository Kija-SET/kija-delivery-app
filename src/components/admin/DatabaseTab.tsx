
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseTab = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState('');

  const executeSql = async () => {
    if (!sqlQuery.trim()) return;
    
    try {
      setSqlResult('Executando consulta...');
      
      // Para consultas SELECT simples
      if (sqlQuery.trim().toLowerCase().startsWith('select')) {
        // Usando uma abordagem mais simples sem RPC para evitar o erro
        setSqlResult('Funcionalidade de consulta SQL será implementada em breve.');
      } else {
        setSqlResult('Apenas consultas SELECT são permitidas via interface.');
      }
    } catch (error: any) {
      setSqlResult(`Erro: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas de Database</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Digite consultas SQL SELECT para visualizar dados"
          className="min-h-32"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
        />
        <div className="flex space-x-2">
          <Button className="gradient-purple" onClick={executeSql}>
            Executar Consulta
          </Button>
          <Button variant="outline" onClick={() => {
            setSqlQuery('');
            setSqlResult('');
          }}>
            Limpar
          </Button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
            {sqlResult || 'Resultado das consultas aparecerá aqui...'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
