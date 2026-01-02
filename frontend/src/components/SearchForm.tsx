import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeftRight, CalendarIcon, Search, Train } from 'lucide-react';
import { format } from 'date-fns';

interface SearchFormProps {
  variant?: 'hero' | 'compact';
}

const SearchForm: React.FC<SearchFormProps> = ({ variant = 'hero' }) => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (source && destination && date) {
      navigate(`/search?from=${source}&to=${destination}&date=${format(date, 'yyyy-MM-dd')}`);
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className={`${isHero ? 'glass-card rounded-2xl p-6 md:p-8' : 'bg-card rounded-xl p-4 shadow-card'}`}>
      {isHero && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 railway-gradient rounded-xl">
            <Train className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Book Train Tickets</h2>
            <p className="text-sm text-muted-foreground">Find and book trains across India</p>
          </div>
        </div>
      )}

      <div className={`grid gap-4 ${isHero ? 'md:grid-cols-4' : 'md:grid-cols-5'} items-end`}>
        <div className="relative">
          <Label className="text-sm font-medium text-foreground mb-1.5 block">From</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className={`${isHero ? 'h-12' : 'h-10'} bg-background`}>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.code} value={station.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{station.code}</span>
                    <span className="text-muted-foreground">- {station.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isHero && (
          <div className="hidden md:flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full h-10 w-10 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className={isHero ? '' : 'relative'}>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">To</Label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className={`${isHero ? 'h-12' : 'h-10'} bg-background`}>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stations.filter(s => s.code !== source).map((station) => (
                <SelectItem key={station.code} value={station.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{station.code}</span>
                    <span className="text-muted-foreground">- {station.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${isHero ? 'h-12' : 'h-10'} bg-background ${!date && 'text-muted-foreground'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'EEE, dd MMM yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={handleSearch}
          disabled={!source || !destination || !date}
          className={`accent-gradient text-accent-foreground font-semibold ${isHero ? 'h-12' : 'h-10'} hover:opacity-90 transition-opacity`}
        >
          <Search className="mr-2 h-4 w-4" />
          Search Trains
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;
