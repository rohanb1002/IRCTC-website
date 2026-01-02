import React from 'react';
import { Passenger } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, User } from 'lucide-react';

interface PassengerFormProps {
  passenger: Partial<Passenger>;
  index: number;
  onChange: (index: number, field: keyof Passenger, value: any) => void; 
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const PassengerForm: React.FC<PassengerFormProps> = ({    
  passenger,
  index,
  onChange,
  onRemove,
  canRemove,
}) => {
  return (
    <div className="bg-secondary/50 rounded-xl p-4 border border-border animate-slide-in-right">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-foreground">Passenger {index + 1}</span>
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor={`name-${index}`} className="text-sm font-medium text-foreground">
            Full Name (as per ID)
          </Label>
          <Input
            id={`name-${index}`}
            placeholder="Enter full name"
            value={passenger.name || ''}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor={`age-${index}`} className="text-sm font-medium text-foreground">
            Age
          </Label>
          <Input
            id={`age-${index}`}
            type="number"
            placeholder="Age"
            min={1}
            max={120}
            value={passenger.age || ''}
            onChange={(e) => onChange(index, 'age', parseInt(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor={`gender-${index}`} className="text-sm font-medium text-foreground">
            Gender
          </Label>
          <Select
            value={passenger.gender || ''}
            onValueChange={(value) => onChange(index, 'gender', value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={`berth-${index}`} className="text-sm font-medium text-foreground">
            Berth Preference
          </Label>
          <Select
            value={passenger.berthPreference || ''}
            onValueChange={(value) => onChange(index, 'berthPreference', value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lower">Lower</SelectItem>
              <SelectItem value="Middle">Middle</SelectItem>
              <SelectItem value="Upper">Upper</SelectItem>
              <SelectItem value="Side Lower">Side Lower</SelectItem>
              <SelectItem value="Side Upper">Side Upper</SelectItem>
              <SelectItem value="No Preference">No Preference</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;
