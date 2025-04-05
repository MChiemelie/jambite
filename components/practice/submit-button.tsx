import React, { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { Popup } from '@/types';

export default function SubmitButton({ isOpen, setIsOpen, buttonText, title, description, children, onSubmit, disabled, className, isSubmitted = false }: Popup) {
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);

  const handleSubmit = () => {
    setIsOpen(true);
  };

  const handleConfirmSubmission = () => {
    setIsConfirmDisabled(true); // Disable the button
    if (onSubmit) onSubmit();
  };

  const handleReview = () => {
    setIsOpen(false);
  };

  const handleContinueExam = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" onClick={handleSubmit} disabled={disabled} className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black lg:p-4 p-2 w-[90%] lg:max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-xl lg:text-3xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center text-xs md:text-sm lg:text-md">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">{children}</div>
        {isSubmitted ? (
          <Button className="w-[40%] max-w-80 bg-accent-2 text-white mx-auto hover:text-black" onClick={handleReview}>
            Review
          </Button>
        ) : (
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handleConfirmSubmission} className="w-40 bg-accent-3 text-white hover:text-black" disabled={isConfirmDisabled}>
              {isConfirmDisabled ? 'Submitting' : 'Confirm'}
            </Button>
            <Button onClick={handleContinueExam} className="w-40 bg-gray-300 text-black">
              Resume
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
