// components/Testimonials.jsx
'use client'; // Required if this component uses hooks and is rendered in a server component context

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// We can use a hook to configure the automatic scrolling
import Autoplay from 'embla-carousel-autoplay';

// --- Best Practice: Define your data structure outside the component ---
const testimonialsData = [
  {
    id: 1,
    name: 'Sarah K.',
    title: 'Computer Science Student',
    avatarUrl: '/images/avatar-sarah.jpg', // Replace with actual image path or URL
    initials: 'SK',
    statement:
      'The ability to share notes easily with my study group has been a game-changer. My grades improved significantly after using this app!',
  },
  {
    id: 2,
    name: 'David L.',
    title: 'Mechanical Engineering',
    avatarUrl: '/images/avatar-david.jpg',
    initials: 'DL',
    statement:
      'Finding organized notes for my core classes used to be a nightmare. This platform makes it simple and efficient. Highly recommend!',
  },
  {
    id: 3,
    name: 'Emily R.',
    title: 'Biology Major',
    avatarUrl: null, // Example of no image, will use fallback
    initials: 'ER',
    statement:
      "I love the clean interface and search functionality. It's the perfect companion for lecture review and exam prep.",
  },
];

export default function Testimonials() {
  // --- Best Practice: Configure Autoplay outside the component for cleaner code ---
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }), // Scrolls every 5 seconds
  );

  return (
    <div className="w-full py-12">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-4xl mx-auto"
        onMouseEnter={plugin.current.stop} // Stops auto-scrolling on mouse hover
        onMouseLeave={plugin.current.play} // Resumes auto-scrolling when mouse leaves
        opts={{
            loop: true, // Ensures continuous looping
        }}
      >
        <CarouselContent>
          {testimonialsData.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
                  <CardContent className="flex flex-col items-center p-6 text-center h-full">
                    {/* 1. Avatar at the top */}
                    <Avatar className="w-16 h-16 mb-4 border-2 border-primary/50">
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary text-white">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* 2. Testimonial Statement */}
                    <blockquote className="text-lg italic font-medium text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                      "{testimonial.statement}"
                    </blockquote>
                    
                    {/* 3. Name and Title */}
                    <div className="mt-auto"> {/* Pushes name to the bottom */}
                        <p className="text-md font-semibold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Manual change controls */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}