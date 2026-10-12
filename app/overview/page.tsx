"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { getAllSDGs } from "@/lib/data";
import { useState, useMemo, useEffect } from 'react';
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { Filter, Star, CheckCircle, XCircle } from 'lucide-react';
import { FilterControls, FilterState } from '@/components/dashboard/FilterControls'

export default function OverviewPage() {
  const [allSDGs, setAllSDGs] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    active: true,
    inactive: true,
    favorites: true,});

  const [favoriteSDGs, setFavoriteSDGs] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

// Haal SDG data op
  useEffect(() => {
    const loadData = async () => {
      try {
        const sdgs = getAllSDGs();
        setAllSDGs(sdgs);
      } catch (error) {
        console.error('Error loading SDGs:', error);
      }
    };
    loadData();
  }, []);

 // Haal user en favorites op
  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      try {
        // Haal user data op
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
          
          if (userData.user?.id) {
            // Haal favorites op
            const favResponse = await fetch('/api/favorites');
            if (favResponse.ok) {
              const favorites = await favResponse.json();
              setFavoriteSDGs(favorites);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();
  }, []);

  // Filter de SDGs
  const filteredSDGs = useMemo(() => {
    return allSDGs.filter(sdg => {
      const isFavorite = favoriteSDGs.includes(sdg.number);
      const isActive = sdg.implemented;
      
      // Toon alleen als aan filter criteria voldoet
      let shouldShow = false;
      
      if (filters.active && isActive) shouldShow = true;
      if (filters.inactive && !isActive) shouldShow = true;
      if (filters.favorites && isFavorite) shouldShow = true;
      
      return shouldShow;
    });
  }, [allSDGs, favoriteSDGs, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-300 light-text">Laden...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white-50 dark:bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white-900 dark:text-gray-100 mb-4">
            Duurzame Ontwikkelingsdoelen
          </h1>
          <p className="text-lg font-bold text-gray-500 dark:text-white-400 max-w-3xl mx-auto">
            De{" "}
            <a className="underline-offset-4 underline decoration-yellow-300">
              10 Duurzame Ontwikkelingsdoelen
            </a>{" "}
            zijn een universele oproep tot actie om{" "}
            <a className="underline-offset-4 underline decoration-yellow-300">
              armoede te beëindigen,
            </a>
            de
            <a className="underline-offset-4 underline decoration-yellow-300">
              {" "}
              planeet te beschermen
            </a>{" "}
            en{" "}
            <a className="underline-offset-4 underline decoration-yellow-300">
              welvaart
            </a>{" "}
            voor iedereen te waarborgen tegen{" "}
            <a className="underline-offset-4 underline decoration-yellow-300">
              2030.
            </a>
          </p>
        </div>
<div>
                    <p className="text-sm text-black black-text">Jouw favorieten</p>
                    <p className="text-2xl text-black font-bold black-text">
                      {favoriteSDGs.length}
                    </p>
                  </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredSDGs.map((sdg) => (
            <Link key={sdg.number} href={`/sdg/${sdg.number}`}>
              <Card className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="h-full" style={{ backgroundColor: sdg.color }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="h-14 w-14 rounded-lg flex items-center justify-center light-text text-2xl font-semibold"
                        style={{ backgroundColor: sdg.color }}
                        aria-hidden="true"
                      >
                        {sdg.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold mb-1 light-text">SDG {sdg.number}</p>
                            <h3 className="text-lg font-bold mb-2 light-text">{sdg.title}</h3>
                          </div>
                          {/* Favorite Indicator */}
                          {favoriteSDGs.includes(sdg.number) && user && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-black">★</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-navy-200 mb-3 line-clamp-3 light-text">{sdg.description}.</p>

                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors duration-300 ${
                              sdg.implemented
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {sdg.implemented ? 'Actief' : 'Niet actief'}
                          </span>

                          <FavoriteButton
                            sdgNumber={sdg.number}
                            size="sm"
                            userId={user?.id}
                            initialIsFavorite={favoriteSDGs.includes(sdg.number)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-500 font-bold dark:text-white-400">
            Dit dashboard biedt een overzicht van de 10 Duurzame
            Ontwikkelingsdoelen en hun status. Bekijk elk doel voor meer
            details.
          </p>
        </div>
      </div>
    </div>
  );
}
