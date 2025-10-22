'use client';

import { forwardRef, useEffect, useState } from 'react';
import { Input } from '@/components/shadcn/input';

type Suggestion = {
  place_id: string;
  display_name: string;
};

type LocationInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(({ value, onChange, onBlur, name, ...props }, ref) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?countrycodes=ng&format=json&q=${encodeURIComponent(query)}`, { headers: { 'Accept-Language': 'en' } });
        const data = (await res.json()) as Suggestion[];
        setSuggestions(data || []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className='relative w-full'>
      <Input
        ref={ref}
        name={name}
        value={value ?? (selected || query)}
        onChange={(e) => {
          setSelected('');
          setQuery(e.target.value);
          onChange?.(e);
        }}
        onBlur={onBlur}
        placeholder='Location'
        className='focus:ring-brand w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none'
        {...props}
      />

      {suggestions.length > 0 && !selected && (
        <ul className='text-foreground bg-background absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border shadow'>
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              className='hover:bg-accent hover:text-accent-foreground cursor-pointer px-4 py-2'
              onClick={() => {
                setSelected(place.display_name);
                setQuery(place.display_name);
                setSuggestions([]);
                onChange?.({
                  target: { value: place.display_name, name }
                } as any);
              }}
              onKeyPress={() => {
                setSelected(place.display_name);
                setQuery(place.display_name);
                setSuggestions([]);
                onChange?.({
                  target: { value: place.display_name, name }
                } as any);
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

LocationInput.displayName = 'LocationInput';

export default LocationInput;
