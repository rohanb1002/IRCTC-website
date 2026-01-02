import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import { useAuth } from '@/context/AuthContext';
import { 
  Train, 
  Clock, 
  MapPin, 
  Calendar,
  ArrowRight,
  History,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trains, getStationName } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const popularRoutes = [
    { from: 'NDLS', to: 'BCT', name: 'Delhi → Mumbai' },
    { from: 'NDLS', to: 'HWH', name: 'Delhi → Kolkata' },
    { from: 'NDLS', to: 'SBC', name: 'Delhi → Bangalore' },
    { from: 'BCT', to: 'MAS', name: 'Mumbai → Chennai' },
  ];

  const upcomingTrains = trains.slice(0, 3);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Welcome Section */}
      <div className="railway-gradient">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/70 mb-1">Welcome back,</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                {user?.name}
              </h1>
            </div>
            <Button
              onClick={() => navigate('/bookings')}
              variant="secondary"
              className="hidden sm:flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              My Bookings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="-mt-16 mb-8">
          <SearchForm variant="hero" />
        </div>

        {/* <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Popular Routes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {popularRoutes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/search?from=${route.from}&to=${route.to}&date=${new Date().toISOString().split('T')[0]}`)}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all text-left group"
                >
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {route.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getStationName(route.from)} → {getStationName(route.to)}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>

            <h2 className="font-display text-xl font-bold text-foreground mb-4 mt-8 flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              Featured Trains
            </h2>
            <div className="space-y-4">
              {upcomingTrains.map((train) => (
                <div
                  key={train.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-card transition-all"
                >
                  <div className="h-12 w-12 rounded-xl railway-gradient flex items-center justify-center">
                    <Train className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">{train.name}</p>
                      <span className="text-xs text-muted-foreground">#{train.trainNo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{train.source}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{train.destination}</span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">
                      {train.departureTime} - {train.arrivalTime}
                    </p>
                    <p className="text-xs text-muted-foreground">{train.duration}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/search?from=${train.source}&to=${train.destination}&date=${new Date().toISOString().split('T')[0]}`)}
                    className="shrink-0"
                  >
                    Book
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/bookings')}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Booking History</p>
                  <p className="text-sm text-muted-foreground">View past & upcoming trips</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Manage Profile</p>
                  <p className="text-sm text-muted-foreground">Update personal details</p>
                </div>
              </button>
            </div>

            <div className="mt-8 p-4 bg-secondary/50 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground mb-3">💡 Travel Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Book tickets 120 days in advance for best availability</li>
                <li>• Check train running status before your journey</li>
                <li>• Carry a valid ID proof during travel</li>
                <li>• Download e-ticket on your phone</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
