import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { stations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Plus,
  Search,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStation, setNewStation] = useState({ code: '', name: '', city: '' });

  const [allStations, setAllStations] = useState(stations);

  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const filteredStations = allStations.filter(
    station =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (allStations.find(s => s.code === newStation.code)) {
      toast({
        title: 'Error',
        description: 'Station code already exists',
        variant: 'destructive',
      });
      return;
    }

    setAllStations([...allStations, newStation]);
    setNewStation({ code: '', name: '', city: '' });
    setShowAddForm(false);
    
    toast({
      title: 'Station Added',
      description: `${newStation.name} has been added successfully.`,
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Manage Routes & Stations
            </h1>
            <p className="text-muted-foreground mt-1">
              Add or manage railway stations
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="accent-gradient text-accent-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Station
          </Button>
        </div>

        {/* Add Station Form */}
        {showAddForm && (
          <div className="bg-card rounded-xl shadow-card border border-border p-6 mb-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">Add New Station</h3>
            <form onSubmit={handleAddStation} className="grid sm:grid-cols-4 gap-4">
              <div>
                <Label>Station Code</Label>
                <Input
                  placeholder="e.g., NDLS"
                  value={newStation.code}
                  onChange={(e) => setNewStation({ ...newStation, code: e.target.value.toUpperCase() })}
                  className="mt-1.5"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label>Station Name</Label>
                <Input
                  placeholder="e.g., New Delhi"
                  value={newStation.name}
                  onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  placeholder="e.g., Delhi"
                  value={newStation.city}
                  onChange={(e) => setNewStation({ ...newStation, city: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" className="railway-gradient text-primary-foreground">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by station name, code, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((station) => (
            <div
              key={station.code}
              className="bg-card rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">{station.code}</span>
                    </div>
                    <p className="font-medium text-foreground">{station.name}</p>
                    <p className="text-sm text-muted-foreground">{station.city}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Stations Found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRoutes;
