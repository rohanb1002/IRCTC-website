import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PassengerForm from '@/components/PassengerForm';
import { useAuth } from '@/context/AuthContext';
import { Passenger, Booking as BookingType, generatePNR, getStationName } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  Train, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Plus, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingSelection {
  train: {
    id: string;
    trainNo: string;
    name: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  };
  classCode: string;
  className: string;
  fare: number;
  date: string;
}

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [passengers, setPassengers] = useState<Partial<Passenger>[]>([{ id: '1' }]);
  const [step, setStep] = useState<'passengers' | 'payment' | 'confirmation'>('passengers');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingType | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const storedSelection = localStorage.getItem('booking_selection');
    if (storedSelection) {
      setSelection(JSON.parse(storedSelection));
    } else {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { id: String(passengers.length + 1) }]);
    }
  };

  const removePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const isPassengerValid = (p: Partial<Passenger>) => {
    return p.name && p.age && p.gender && p.berthPreference;
  };

  const canProceedToPayment = passengers.every(isPassengerValid);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (selection && user) {
        const booking: BookingType = {
          id: 'booking_' + Date.now(),
          pnr: generatePNR(),
          trainId: selection.train.id,
          trainNo: selection.train.trainNo,
          trainName: selection.train.name,
          source: selection.train.source,
          destination: selection.train.destination,
          date: selection.date,
          departureTime: selection.train.departureTime,
          arrivalTime: selection.train.arrivalTime,
          class: selection.classCode,
          passengers: passengers as Passenger[],
          totalFare: selection.fare * passengers.length,
          status: 'CONFIRMED',
          bookedAt: new Date().toISOString(),
        };

        // Store booking
        const existingBookings = JSON.parse(localStorage.getItem('irctc_bookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('irctc_bookings', JSON.stringify(existingBookings));

        setBookingResult(booking);
        setStep('confirmation');
        localStorage.removeItem('booking_selection');
      }
      setIsProcessing(false);
    }, 2000);
  };

  if (!selection) return null;

  const totalFare = selection.fare * passengers.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Progress Steps */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {['passengers', 'payment', 'confirmation'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${
                  s === step ? 'text-primary' : 
                  ['passengers', 'payment', 'confirmation'].indexOf(step) > i ? 'text-success' : 'text-muted-foreground'
                }`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    s === step ? 'bg-primary text-primary-foreground' :
                    ['passengers', 'payment', 'confirmation'].indexOf(step) > i ? 'bg-success text-success-foreground' : 'bg-muted'
                  }`}>
                    {['passengers', 'payment', 'confirmation'].indexOf(step) > i ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : i + 1}
                  </div>
                  <span className="hidden sm:inline font-medium capitalize">{s}</span>
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 'passengers' && (
              <>
                {/* Train Details */}
                <div className="bg-card rounded-xl shadow-card p-4 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 railway-gradient rounded-lg">
                      <Train className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-foreground">
                        {selection.train.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">#{selection.train.trainNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-foreground">{selection.train.departureTime}</p>
                      <p className="text-sm text-muted-foreground">{selection.train.source}</p>
                      <p className="text-xs text-muted-foreground">{getStationName(selection.train.source)}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{selection.train.duration}</span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{selection.train.arrivalTime}</p>
                      <p className="text-sm text-muted-foreground">{selection.train.destination}</p>
                      <p className="text-xs text-muted-foreground">{getStationName(selection.train.destination)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selection.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                      {selection.classCode} - {selection.className}
                    </span>
                  </div>
                </div>

                {/* Passenger Forms */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Passenger Details
                    </h3>
                    {passengers.length < 6 && (
                      <Button variant="outline" size="sm" onClick={addPassenger}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Passenger
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {passengers.map((passenger, index) => (
                      <PassengerForm
                        key={index}
                        passenger={passenger}
                        index={index}
                        onChange={handlePassengerChange}
                        onRemove={removePassenger}
                        canRemove={passengers.length > 1}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep('payment')}
                  disabled={!canProceedToPayment}
                  className="w-full h-12 railway-gradient text-primary-foreground font-semibold"
                >
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {step === 'payment' && (
              <div className="bg-card rounded-xl shadow-card p-6 border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-6">
                  Payment Details
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Mock Payment</p>
                        <p className="text-sm text-muted-foreground">Click pay to simulate payment</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('passengers')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 h-12 accent-gradient text-accent-foreground font-semibold"
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${totalFare.toLocaleString()}`}
                  </Button>
                </div>
              </div>
            )}

            {step === 'confirmation' && bookingResult && (
              <div className="bg-card rounded-xl shadow-card p-6 border border-border text-center">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your ticket has been booked successfully
                </p>

                <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">PNR Number</p>
                      <p className="font-mono font-bold text-xl text-primary">{bookingResult.pnr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-success/10 text-success text-sm font-medium">
                        {bookingResult.status}
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={() => navigate('/bookings')} className="w-full">
                  View My Bookings
                </Button>
              </div>
            )}
          </div>

          {/* Fare Summary */}
          {step !== 'confirmation' && (
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-4 border border-border sticky top-24">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Fare Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare × {passengers.length}</span>
                    <span className="font-medium text-foreground">₹{(selection.fare * passengers.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Tax</span>
                    <span className="font-medium text-foreground">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Convenience Fee</span>
                    <span className="font-medium text-foreground">₹0</span>
                  </div>
                  
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total Amount</span>
                      <span className="font-bold text-xl text-primary">₹{totalFare.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
