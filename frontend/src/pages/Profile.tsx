import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Ticket,
  LogOut
} from 'lucide-react';
import { Booking } from '@/data/mockData';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const bookings: Booking[] = JSON.parse(localStorage.getItem('irctc_bookings') || '[]');
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            My Profile
          </h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-xl shadow-card border border-border p-6 text-center">
                <div className="h-24 w-24 rounded-full railway-gradient flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {user.name}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.role === 'ADMIN' && (
                  <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{confirmedBookings}</p>
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{cancelledBookings}</p>
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/bookings')}
                  className="w-full mt-4"
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  View Bookings
                </Button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-xl shadow-card border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Personal Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={user.name}
                        readOnly
                        className="pl-10 bg-muted"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Email Address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={user.email}
                        readOnly
                        className="pl-10 bg-muted"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Phone Number</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Add phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Date of Birth</Label>
                    <div className="relative mt-1.5">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button className="mt-6 railway-gradient text-primary-foreground">
                  Update Profile
                </Button>
              </div>

              {/* Account Actions */}
              <div className="bg-card rounded-xl shadow-card border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Account Actions
                </h3>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
