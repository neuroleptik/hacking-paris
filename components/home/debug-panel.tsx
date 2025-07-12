'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XIcon, RefreshCwIcon } from 'lucide-react';

interface DebugLog {
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
  data?: any;
}

export function DebugPanel() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intercepter les console.log pour les afficher dans le debug panel
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog.apply(console, args);
      addLog('info', args.join(' '), args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addLog('error', args.join(' '), args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const addLog = (type: 'info' | 'success' | 'error', message: string, data?: any) => {
    const newLog: DebugLog = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data
    };
    setLogs(prev => [...prev.slice(-9), newLog]); // Garder seulement les 10 derniers logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50"
      >
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-96 max-h-64 overflow-hidden z-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug Panel</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
            >
              <RefreshCwIcon className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <XIcon className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-2">
                <Badge
                  variant={log.type === 'error' ? 'destructive' : log.type === 'success' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {log.timestamp}
                </Badge>
                <span className={log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-blue-500'}>
                  {log.message}
                </span>
              </div>
              {log.data && (
                <pre className="text-xs bg-muted p-1 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
