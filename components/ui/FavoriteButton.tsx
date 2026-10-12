// components/ui/FavoriteButton.tsx - UITGEBREIDE VERSIE
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  sdgNumber: number;
  initialIsFavorite?: boolean;
  userId?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ 
  sdgNumber, 
  initialIsFavorite = false, 
  userId,
  size = 'md' 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    console.log('Toggle favorite clicked:', { sdgNumber, userId, isFavorite });
    
    if (!userId) {
      console.log('No userId, redirecting to login');
      if (window.confirm('Je moet ingelogd zijn om favorieten toe te voegen. Wil je naar de login pagina gaan?')) {
        window.location.href = '/login';
      }
      return;
    }

    setIsLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      console.log('Making request with method:', method);
      
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdgNumber }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        setIsFavorite(!isFavorite);
        
        // Refresh de pagina om filters bij te werken
        window.location.reload();
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        alert(data.error || 'Er ging iets mis bij het toevoegen/verwijderen van favoriet');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Netwerkfout - probeer opnieuw');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  // Als er geen user is, toon een grijze knop
  if (!userId) {
    return (
      <button
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-dark-glass border border-purple-600/20 text-purple-600/50 cursor-not-allowed`}
        title="Log in om favorieten toe te voegen"
        disabled
      >
        <Heart size={iconSize[size]} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-300 ${
        isFavorite 
          ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-glow-md hover:from-red-600 hover:to-pink-700' 
          : 'bg-dark-glass border border-purple-600/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50'
      } hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
      title={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4/5 w-4/5 border-2 border-current border-t-transparent"></div>
      ) : (
        <Heart 
          size={iconSize[size]} 
          className={`transition-all duration-300 ${isFavorite ? 'fill-current' : ''}`}
        />
      )}
    </button>
  );
}