export interface Train {
  id: string;
  trainNo: string;
  name: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
  daysOfOperation: string[];
}

export interface TrainClass {
  code: string;
  name: string;
  fare: number;
  availableSeats: number;
}

export interface Station {
  code: string;
  name: string;
  city: string;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  berthPreference: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'No Preference';
}

export interface Booking {
  id: string;
  pnr: string;
  trainId: string;
  trainNo: string;
  trainName: string;
  source: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  class: string;
  passengers: Passenger[];
  totalFare: number;
  status: 'CONFIRMED' | 'WAITING' | 'CANCELLED';
  bookedAt: string;
}

export const stations: Station[] = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'SBC', name: 'Bangalore City', city: 'Bengaluru' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'LKO', name: 'Lucknow', city: 'Lucknow' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
];

export const trains: Train[] = [
  {
    id: '1',
    trainNo: '12301',
    name: 'Rajdhani Express',
    source: 'NDLS',
    destination: 'HWH',
    departureTime: '16:55',
    arrivalTime: '10:00',
    duration: '17h 05m',
    classes: [
      { code: '1A', name: 'First AC', fare: 4500, availableSeats: 12 },
      { code: '2A', name: 'Second AC', fare: 2800, availableSeats: 45 },
      { code: '3A', name: 'Third AC', fare: 1950, availableSeats: 120 },
    ],
    daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    id: '2',
    trainNo: '12951',
    name: 'Mumbai Rajdhani',
    source: 'NDLS',
    destination: 'BCT',
    departureTime: '16:35',
    arrivalTime: '08:35',
    duration: '16h 00m',
    classes: [
      { code: '1A', name: 'First AC', fare: 4200, availableSeats: 8 },
      { code: '2A', name: 'Second AC', fare: 2500, availableSeats: 32 },
      { code: '3A', name: 'Third AC', fare: 1750, availableSeats: 85 },
    ],
    daysOfOperation: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
  {
    id: '3',
    trainNo: '12259',
    name: 'Duronto Express',
    source: 'NDLS',
    destination: 'SBC',
    departureTime: '20:10',
    arrivalTime: '06:40',
    duration: '34h 30m',
    classes: [
      { code: '1A', name: 'First AC', fare: 5200, availableSeats: 6 },
      { code: '2A', name: 'Second AC', fare: 3200, availableSeats: 24 },
      { code: '3A', name: 'Third AC', fare: 2200, availableSeats: 65 },
      { code: 'SL', name: 'Sleeper', fare: 850, availableSeats: 200 },
    ],
    daysOfOperation: ['Tue', 'Thu', 'Sat'],
  },
  {
    id: '4',
    trainNo: '12627',
    name: 'Karnataka Express',
    source: 'NDLS',
    destination: 'SBC',
    departureTime: '21:30',
    arrivalTime: '06:20',
    duration: '32h 50m',
    classes: [
      { code: '2A', name: 'Second AC', fare: 2900, availableSeats: 28 },
      { code: '3A', name: 'Third AC', fare: 1980, availableSeats: 95 },
      { code: 'SL', name: 'Sleeper', fare: 750, availableSeats: 320 },
    ],
    daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    id: '5',
    trainNo: '12431',
    name: 'Trivandrum Rajdhani',
    source: 'NDLS',
    destination: 'MAS',
    departureTime: '10:55',
    arrivalTime: '14:30',
    duration: '27h 35m',
    classes: [
      { code: '1A', name: 'First AC', fare: 4800, availableSeats: 10 },
      { code: '2A', name: 'Second AC', fare: 2950, availableSeats: 38 },
      { code: '3A', name: 'Third AC', fare: 2050, availableSeats: 110 },
    ],
    daysOfOperation: ['Mon', 'Thu', 'Sat'],
  },
  {
    id: '6',
    trainNo: '12002',
    name: 'Shatabdi Express',
    source: 'NDLS',
    destination: 'ADI',
    departureTime: '06:00',
    arrivalTime: '14:25',
    duration: '8h 25m',
    classes: [
      { code: 'CC', name: 'Chair Car', fare: 1450, availableSeats: 150 },
      { code: 'EC', name: 'Exec. Chair Car', fare: 2800, availableSeats: 45 },
    ],
    daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
];

export const getStationName = (code: string): string => {
  const station = stations.find(s => s.code === code);
  return station ? station.name : code;
};

export const searchTrains = (source: string, destination: string): Train[] => {
  return trains.filter(
    train => train.source === source && train.destination === destination
  );
};

export const generatePNR = (): string => {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};
