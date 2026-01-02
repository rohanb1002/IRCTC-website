import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TrainCard from '@/components/TrainCard';
import SearchForm from '@/components/SearchForm';
import { searchTrains, Train, getStationName } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Train as TrainIcon, AlertCircle } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  
  const [results, setResults] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (from && to) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const trains = searchTrains(from, to);
        setResults(trains);
        setIsLoading(false);
      }, 500);
    }
  }, [from, to]);

  const handleSelectClass = (train: Train, classCode: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Store selection and navigate to booking
    const selectedClass = train.classes.find(c => c.code === classCode);
    localStorage.setItem('booking_selection', JSON.stringify({
      train,
      classCode,
      className: selectedClass?.name,
      fare: selectedClass?.fare,
      date,
    }));
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="railway-gradient py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{from}</span>
              <span className="text-primary-foreground/50">{getStationName(from)}</span>
            </div>
            <ArrowRight className="h-5 w-5" />
            <div className="flex items-center gap-2">
              <span className="font-semibold">{to}</span>
              <span className="text-primary-foreground/50">{getStationName(to)}</span>
            </div>
            <span className="ml-auto text-sm">
              {new Date(date).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Modify Search */}
        <div className="mb-6">
          {/* <SearchForm variant="compact" /> */}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full railway-gradient flex items-center justify-center animate-pulse mb-4">
              <TrainIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Searching for trains...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-foreground">{results.length}</span> train(s)
              </p>
            </div>
            
            {results.map((train) => (
              <TrainCard
                key={train.id}
                train={train}
                date={date}
                onSelectClass={handleSelectClass}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No Trains Found
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              We couldn't find any trains for this route. Try searching for a different route or date.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Try routes like NDLS → BCT, NDLS → HWH, or NDLS → SBC
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
