import React from 'react';
import {
  Coffee,
  Music,
  ShoppingBag,
  Gamepad2,
  Target,
  Smartphone,
  Play,
  MessageSquare,
  Tv,
  Camera,
  Blocks,
} from 'lucide-react';

export function GiftCardLogo({ brand }: { brand: string }) {
  switch (brand) {
    case 'Starbucks':
      return <Coffee className="w-5 h-5" aria-hidden="true" />;
    case 'Spotify':
      return <Music className="w-5 h-5" aria-hidden="true" />;
    case 'Apple':
      return <Smartphone className="w-5 h-5" aria-hidden="true" />;
    case 'Amazon':
      return <ShoppingBag className="w-5 h-5" aria-hidden="true" />;
    case 'Nintendo eShop':
      return <Gamepad2 className="w-5 h-5" aria-hidden="true" />;
    case 'Target':
      return <Target className="w-5 h-5" aria-hidden="true" />;
    default:
      return <ShoppingBag className="w-5 h-5" aria-hidden="true" />;
  }
}

export function ManagedAppIcon({ name }: { name: string }) {
  switch (name) {
    case 'TikTok':
    case 'YouTube':
      return <Play className="w-4 h-4" aria-hidden="true" />;
    case 'Instagram':
    case 'Snapchat':
      return <Camera className="w-4 h-4" aria-hidden="true" />;
    case 'Discord':
      return <MessageSquare className="w-4 h-4" aria-hidden="true" />;
    case 'Roblox':
    case 'Minecraft':
      return <Blocks className="w-4 h-4" aria-hidden="true" />;
    case 'Netflix':
      return <Tv className="w-4 h-4" aria-hidden="true" />;
    default:
      return <Smartphone className="w-4 h-4" aria-hidden="true" />;
  }
}
