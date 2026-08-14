import { useState, useEffect, useRef } from 'react';
import { PresenceState } from '../types';

export function usePresence() {
  const [presence, setPresence] = useState<PresenceState>({
    onlineCount: 742,
    realActive: 1,
    isLive: true,
  });

  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // Generate or load unique session ID for this browser tab
    let sessionId = sessionStorage.getItem('tea_stall_session_id');
    if (!sessionId) {
      sessionId = `radio_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      sessionStorage.setItem('tea_stall_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;

    // Connect to Server-Sent Events stream for instantaneous live presence
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    function connectSSE() {
      try {
        eventSource = new EventSource(`/api/presence/stream?sessionId=${encodeURIComponent(sessionId!)}`);

        eventSource.onopen = () => {
          setPresence((prev) => ({ ...prev, isLive: true }));
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && typeof data.count === 'number') {
              setPresence({
                onlineCount: data.count,
                realActive: data.realActive || 1,
                isLive: true,
              });
            }
          } catch {
            // parse error
          }
        };

        eventSource.onerror = () => {
          setPresence((prev) => ({ ...prev, isLive: false }));
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Exponential backoff reconnect
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (e) {
        console.warn('SSE connection initialization error:', e);
      }
    }

    connectSSE();

    // Regular heartbeat every 15s to keep session alive
    const heartbeatInterval = setInterval(() => {
      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.count === 'number') {
            setPresence((prev) => ({
              ...prev,
              onlineCount: data.count,
              realActive: data.realActive || prev.realActive,
              isLive: true,
            }));
          }
        })
        .catch(() => {
          // network glitch
        });
    }, 15000);

    // On page unload / close, notify server immediately via sendBeacon
    const handleUnload = () => {
      if (navigator.sendBeacon) {
        const blob = new Blob(
          [JSON.stringify({ sessionId: sessionIdRef.current })],
          { type: 'application/json' }
        );
        navigator.sendBeacon('/api/presence/leave', blob);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) eventSource.close();
      handleUnload();
    };
  }, []);

  return presence;
}
