import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Booking, getStationName } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Train, 
  ArrowRight, 
  Calendar, 
  Users,
  Clock,
  XCircle,
  Ticket,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingsHistory: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const storedBookings = JSON.parse(localStorage.getItem('irctc_bookings') || '[]');
    setBookings(storedBookings.reverse()); // Show latest first
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = () => {
    if (cancelBookingId) {
      const updatedBookings = bookings.map(b => 
        b.id === cancelBookingId ? { ...b, status: 'CANCELLED' as const } : b
      );
      setBookings(updatedBookings);
      localStorage.setItem('irctc_bookings', JSON.stringify(updatedBookings.reverse()));
      
      toast({
        title: 'Booking Cancelled',
        description: 'Your ticket has been cancelled. Refund will be processed shortly.',
      });
      
      setCancelBookingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-success/10 text-success border-success/20';
      case 'WAITING':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              My Bookings
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your train bookings
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="hidden sm:flex">
            <Search className="h-4 w-4 mr-2" />
            Book New Ticket
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No Bookings Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              You haven't booked any train tickets yet. Start by searching for trains.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Book Your First Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-all"
              >
                {/* Header */}
                <div className="railway-gradient px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Train className="h-5 w-5 text-primary-foreground" />
                    <div>
                      <p className="font-semibold text-primary-foreground">{booking.trainName}</p>
                      <p className="text-sm text-primary-foreground/70">#{booking.trainNo}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} border`}>
                    {booking.status}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground">{booking.departureTime}</p>
                          <p className="text-sm font-medium text-foreground">{booking.source}</p>
                          <p className="text-xs text-muted-foreground">{getStationName(booking.source)}</p>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="w-16 h-0.5 bg-border my-1" />
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{booking.arrivalTime}</p>
                          <p className="text-sm font-medium text-foreground">{booking.destination}</p>
                          <p className="text-xs text-muted-foreground">{getStationName(booking.destination)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{booking.passengers.length} Passenger(s)</span>
                    </div>
                    <div className="px-2 py-0.5 bg-secondary rounded font-medium">
                      {booking.class}
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">PNR</p>
                        <p className="font-mono font-bold text-primary">{booking.pnr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Fare</p>
                        <p className="font-bold text-foreground">₹{booking.totalFare.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Passengers</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.passengers.map((passenger, i) => (
                        <span key={i} className="text-sm px-2 py-1 bg-secondary rounded">
                          {passenger.name} ({passenger.age}, {passenger.gender?.[0]})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status !== 'CANCELLED' && (
                    <div className="mt-4 pt-4 border-t border-border flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelBookingId(booking.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel Ticket
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              Refund will be processed as per cancellation policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsHistory;
