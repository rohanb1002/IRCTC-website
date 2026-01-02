import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { stations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Train, 
  Plus,
  Trash2,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddTrain: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    trainNo: '',
    name: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    daysOfOperation: [] as string[],
  });

  const [classes, setClasses] = useState([
    { code: '', name: '', fare: '', seats: '' }
  ]);

  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysOfOperation: prev.daysOfOperation.includes(day)
        ? prev.daysOfOperation.filter(d => d !== day)
        : [...prev.daysOfOperation, day]
    }));
  };

  const addClass = () => {
    setClasses([...classes, { code: '', name: '', fare: '', seats: '' }]);
  };

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index));
  };

  const updateClass = (index: number, field: string, value: string) => {
    const updated = [...classes];
    updated[index] = { ...updated[index], [field]: value };
    setClasses(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store train (in real app, call API)
    const newTrain = {
      id: 'train_' + Date.now(),
      ...formData,
      duration: calculateDuration(formData.departureTime, formData.arrivalTime),
      classes: classes.map(c => ({
        code: c.code,
        name: c.name,
        fare: parseInt(c.fare),
        availableSeats: parseInt(c.seats)
      }))
    };

    const existingTrains = JSON.parse(localStorage.getItem('irctc_custom_trains') || '[]');
    existingTrains.push(newTrain);
    localStorage.setItem('irctc_custom_trains', JSON.stringify(existingTrains));

    toast({
      title: 'Train Added',
      description: `Train ${formData.trainNo} - ${formData.name} has been added successfully.`,
    });

    navigate('/admin/trains');
  };

  const calculateDuration = (dep: string, arr: string) => {
    // Simple duration calculation (placeholder)
    return '12h 00m';
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/trains')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trains
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 railway-gradient rounded-xl">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Add New Train
              </h1>
              <p className="text-muted-foreground">Fill in the train details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Train Number</Label>
                  <Input
                    placeholder="e.g., 12345"
                    value={formData.trainNo}
                    onChange={(e) => setFormData({ ...formData, trainNo: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label>Train Name</Label>
                  <Input
                    placeholder="e.g., Rajdhani Express"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Route Details</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Source Station</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(v) => setFormData({ ...formData, source: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.code} - {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Destination Station</Label>
                  <Select
                    value={formData.destination}
                    onValueChange={(v) => setFormData({ ...formData, destination: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.filter(s => s.code !== formData.source).map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.code} - {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Departure Time</Label>
                  <Input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label>Arrival Time</Label>
                  <Input
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Days of Operation</Label>
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <label
                      key={day}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                        formData.daysOfOperation.includes(day)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Checkbox
                        checked={formData.daysOfOperation.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <span className="text-sm font-medium">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Classes */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Train Classes</h3>
                <Button type="button" variant="outline" size="sm" onClick={addClass}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Class
                </Button>
              </div>

              <div className="space-y-4">
                {classes.map((cls, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-secondary/50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Code</Label>
                        <Input
                          placeholder="e.g., 2A"
                          value={cls.code}
                          onChange={(e) => updateClass(index, 'code', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="e.g., Second AC"
                          value={cls.name}
                          onChange={(e) => updateClass(index, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Fare (₹)</Label>
                        <Input
                          type="number"
                          placeholder="1500"
                          value={cls.fare}
                          onChange={(e) => updateClass(index, 'fare', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Seats</Label>
                        <Input
                          type="number"
                          placeholder="50"
                          value={cls.seats}
                          onChange={(e) => updateClass(index, 'seats', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    {classes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeClass(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 railway-gradient text-primary-foreground font-semibold">
              <Save className="h-4 w-4 mr-2" />
              Add Train
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTrain;
