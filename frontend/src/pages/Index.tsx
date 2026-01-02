import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { 
  Train, 
  Shield, 
  Clock, 
  CreditCard, 
  Users, 
  MapPin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Train,
      title: 'Wide Network',
      description: 'Access to all major Indian railway routes',
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your data is protected with bank-grade security',
    },
    {
      icon: Clock,
      title: 'Instant Confirmation',
      description: 'Get your e-ticket within seconds',
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Multiple payment options available',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Daily Bookings' },
    { value: '500+', label: 'Trains' },
    { value: '2000+', label: 'Stations' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 railway-gradient opacity-95" />
        <div className="absolute inset-0 train-pattern" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>India's Most Trusted Railway Booking Platform</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Book Your Train Journey
              <span className="block text-accent">Across India</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in">
              Search, compare, and book train tickets with ease. Experience seamless 
              travel booking with real-time availability and instant confirmations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchForm variant="hero" />
          </div>

          {/* Stats */}
          <div className="max-w-3xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose IRCTC?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the best railway booking experience with features designed for your convenience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30"
              >
                <div className="h-12 w-12 rounded-xl railway-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl accent-gradient mb-6">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Start Your Journey Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create your account to enjoy faster bookings, manage your trips, and get exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="accent-gradient text-accent-foreground font-semibold px-8">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="font-semibold px-8">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="railway-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <Train className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-primary-foreground">IRCTC</p>
                <p className="text-xs text-primary-foreground/70">Indian Railways</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-primary-foreground/70">
              <a href="#" className="hover:text-primary-foreground transition-colors">About</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Help</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms</a>
            </div>
            
            <p className="text-sm text-primary-foreground/50">
              © 2026 IRCTC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
