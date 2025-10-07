"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// --- Telegram WebApp Types ---
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

// --- App User Interface ---
interface AppUser {
  id: number;
  username: string;
  tp: number;
  taps: number;
  createdAt: string;
}

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (!tg || !tg.initDataUnsafe?.user) {
          setError("Please open this mini-app through Telegram.");
          setLoading(false);
          return;
        }

        const tgUser = tg.initDataUnsafe.user!;
        const username = tgUser.username || `tg_${tgUser.id}`;

        // create or fetch user from API
        const { data } = await axios.post(`${API}/api/users`, { username });

        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Unable to authenticate via Telegram.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleTap = async () => {
    if (!user) return;
    try {
      const { data } = await axios.post(`${API}/api/tap`, {
        username: user.username,
      });
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-white">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-400">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user?.username ?? "Guest"}
      </h1>
      <p className="mb-6 text-lg">Your Teuron Points (TP): {user?.tp ?? 0}</p>

      <button
        onClick={handleTap}
        disabled={!user}
        className="bg-yellow-400 text-black px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
      >
        🪙 Tap to Earn
      </button>
    </div>
  );
}
