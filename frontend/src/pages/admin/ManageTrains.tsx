import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { trains as defaultTrains, Train, getStationName } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Train as TrainIcon, 
  Plus,
  Search,
  ArrowRight,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const ManageTrains: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const [trains, setTrains] = useState<Train[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
      return;
    }

    // Combine default trains with custom trains
    const customTrains = JSON.parse(localStorage.getItem('irctc_custom_trains') || '[]');
    setTrains([...defaultTrains, ...customTrains]);
  }, [isAuthenticated, isAdmin, navigate]);

  const filteredTrains = trains.filter(
    train =>
      train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.trainNo.includes(searchQuery)
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Manage Trains
            </h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, or remove trains from the system
            </p>
          </div>
          <Button onClick={() => navigate('/admin/trains/add')} className="accent-gradient text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add New Train
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by train name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Train List */}
        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <div
              key={train.id}
              className="bg-card rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl railway-gradient flex items-center justify-center">
                    <TrainIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{train.name}</h3>
                    <p className="text-sm text-muted-foreground">#{train.trainNo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{train.source}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{train.destination}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{train.departureTime} - {train.arrivalTime}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {train.classes.map((cls) => (
                  <Badge key={cls.code} variant="secondary" className="text-xs">
                    {cls.code} - ₹{cls.fare}
                  </Badge>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {train.daysOfOperation.map((day) => (
                  <span key={day} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTrains;
