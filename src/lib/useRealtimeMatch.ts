"use client";

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

interface MatchRealtimeData {
  status: 'live' | 'upcoming' | 'finished';
  score: string | undefined;
}

export function useRealtimeMatch(matchId: number | undefined, initialData: MatchRealtimeData) {
  const [data, setData] = useState<MatchRealtimeData>(initialData);

  useEffect(() => {
    // If no real ID is provided, just stick to mock data
    if (!matchId) return;

    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          console.log('Realtime Update Received:', payload);
          setData({
            status: payload.new.status || 'upcoming',
            score: payload.new.score || undefined,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  return data;
}
