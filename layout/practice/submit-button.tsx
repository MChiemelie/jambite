import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  buttonText: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
  disabled?: boolean;
  className?: string;
  isSubmitted?: boolean;
}

export default function SubmitButton({ isOpen, setIsOpen, buttonText, title, description, children, onSubmit, disabled, className, isSubmitted = false }: PopupProps) {
  const handleSubmit = () => {
    setIsOpen(true);
  };

  const handleConfirmSubmission = () => {
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
        <Button variant="outline" onClick={handleSubmit} disabled={disabled} className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[600px] p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center text-md">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">{children}</div>
        {isSubmitted ? (
          <Button className="w-80 bg-accent-2 text-white mx-auto" onClick={handleReview}>
            Review
          </Button>
        ) : (
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handleConfirmSubmission} className="w-40 bg-accent-3 text-white">
              Confirm
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