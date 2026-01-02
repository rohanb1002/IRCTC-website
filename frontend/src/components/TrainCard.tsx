import React from 'react';
import { Train as TrainType, getStationName } from '@/data/mockData';
import { Train, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrainCardProps {
  train: TrainType;
  date: string;
  onSelectClass: (train: TrainType, classCode: string) => void;
}

const TrainCard: React.FC<TrainCardProps> = ({ train, date, onSelectClass }) => {
  return (
    <div className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border animate-fade-in">
      {/* Header */}
      <div className="railway-gradient px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-lg">
            <Train className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-primary-foreground">
              {train.name}
            </h3>
            <p className="text-sm text-primary-foreground/70">#{train.trainNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {train.daysOfOperation.slice(0, 3).map((day) => (
            <Badge 
              key={day} 
              variant="secondary" 
              className="text-xs bg-primary-foreground/20 text-primary-foreground border-0"
            >
              {day}
            </Badge>
          ))}
          {train.daysOfOperation.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-primary-foreground/20 text-primary-foreground border-0"
            >
              +{train.daysOfOperation.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Journey Details */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {train.departureTime}
            </p>
            <p className="text-sm font-medium text-foreground">{train.source}</p>
            <p className="text-xs text-muted-foreground">{getStationName(train.source)}</p>
          </div>
          
          <div className="flex-1 mx-4 flex flex-col items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{train.duration}</span>
            </div>
            <div className="w-full flex items-center gap-2 my-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <div className="flex-1 h-0.5 bg-border relative">
                <div className="absolute inset-0 bg-gradient-to-r from-success to-primary" style={{ width: '100%' }} />
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {train.arrivalTime}
            </p>
            <p className="text-sm font-medium text-foreground">{train.destination}</p>
            <p className="text-xs text-muted-foreground">{getStationName(train.destination)}</p>
          </div>
        </div>

        {/* Class Options */}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Select Class</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {train.classes.map((cls) => (
              <button
                key={cls.code}
                onClick={() => onSelectClass(train, cls.code)}
                className={`p-3 rounded-lg border-2 text-left transition-all hover:border-primary hover:shadow-md ${
                  cls.availableSeats > 0 
                    ? 'border-border bg-card' 
                    : 'border-border bg-muted opacity-60'
                }`}
                disabled={cls.availableSeats === 0}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">{cls.code}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    cls.availableSeats > 20 
                      ? 'bg-success/10 text-success' 
                      : cls.availableSeats > 0 
                        ? 'bg-warning/10 text-warning' 
                        : 'bg-destructive/10 text-destructive'
                  }`}>
                    {cls.availableSeats > 0 ? `${cls.availableSeats} left` : 'WL'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{cls.name}</p>
                <p className="text-lg font-bold text-primary">₹{cls.fare.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;
