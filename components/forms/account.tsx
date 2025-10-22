'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { UploadAvatar } from '@/components/account';
import { LocationInput, Status } from '@/components/custom';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/select';
import { updateProfile } from '@/services';
import type { User } from '@/types';

const subjects = [
  'Use of English',
  'Mathematics',
  'Commerce',
  'Accounting',
  'Biology',
  'Physics',
  'Chemistry',
  'Lit. In English',
  'Government',
  'Christian Rel. Know',
  'Geography',
  'Economics',
  'Islamic Rel. Know',
  'Civic Education',
  'History'
];

const subjectMap: Record<string, string> = {
  'Use of English': 'english',
  Mathematics: 'mathematics',
  Commerce: 'commerce',
  Accounting: 'accounting',
  Biology: 'biology',
  Physics: 'physics',
  Chemistry: 'chemistry',
  'Lit. In English': 'englishlit',
  Government: 'government',
  'Christian Rel. Know': 'crk',
  Geography: 'geography',
  Economics: 'economics',
  'Islamic Rel. Know': 'irk',
  'Civic Education': 'civiledu',
  History: 'history'
};

const ENGLISH = subjects[0];

const accountSchema = z.object({
  firstname: z.string().min(2, 'First name is required'),
  lastname: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  birthday: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(10, 'Phone number is too short'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  location: z.string().min(1, 'Location is required'),
  subjects: z
    .array(z.string())
    .refine(
      (arr) => arr.length === 3,
      'Select exactly 3 more subjects (English is compulsory)'
    )
});

type AccountForm = z.infer<typeof accountSchema>;

export default function Account({ user }: { user: User }) {
  const form = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      subjects: [ENGLISH],
      gender: 'male'
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting }
  } = form;
  const selectedSubjects = watch('subjects');

  useEffect(() => {
    if (user) {
      const mappedSubjects = user.subjects
        ?.map(
          (s: string) => subjects.find((key) => subjectMap[key] === s) ?? ''
        )
        .filter(Boolean) || [ENGLISH];

      reset({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '',
        phone: user.phone || '',
        gender: (user.gender as 'male' | 'female') || 'male',
        location: user.location || '',
        subjects: mappedSubjects.length > 0 ? mappedSubjects : [ENGLISH]
      });
    }
  }, [user, reset]);

  if (!user)
    return (
      <Status
        image="/assets/profile.svg"
        desc1="Getting your details."
        desc2="Hold on."
      />
    );

  const handleCheckboxChange = (subject: string) => {
    if (subject === ENGLISH) return;

    if (selectedSubjects.includes(subject)) {
      setValue(
        'subjects',
        selectedSubjects.filter((s) => s !== subject),
        { shouldDirty: true, shouldValidate: true }
      );
    } else if (selectedSubjects.length < 3) {
      setValue('subjects', [...selectedSubjects, subject], {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  };

  const onSubmit = async (data: AccountForm) => {
    const mappedSubjects = data.subjects.map((s) => subjectMap[s]);
    await updateProfile({ ...data, subjects: mappedSubjects });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto my-10 flex w-[95%] flex-col items-center gap-6 p-4 lg:w-[80%] lg:p-8"
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full items-center gap-4">
          <h2 className="text-foreground/60 text-xs font-semibold whitespace-nowrap lg:text-sm">
            BIO DATA
          </h2>
          <div className="border-foreground/40 flex-1 border-t" />
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-16 md:flex-row">
          <UploadAvatar />
          <div className="grid w-full grid-cols-2 gap-4 lg:w-2/3">
            <div className="flex flex-col gap-1">
              <Label>First Name</Label>
              <Input {...register('firstname')} placeholder="John" />
              {errors.firstname && (
                <p className="text-sm text-red-500">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Last Name</Label>
              <Input {...register('lastname')} placeholder="Doe" />
              {errors.lastname && (
                <p className="text-sm text-red-500">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input
                type="email"
                {...register('email')}
                disabled
                placeholder="johndoe@gmail.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Date of Birth</Label>
              <Input type="date" {...register('birthday')} />
              {errors.birthday && (
                <p className="text-sm text-red-500">
                  {errors.birthday.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                {...register('phone')}
                placeholder="08123456789"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <Label>Location</Label>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <LocationInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col place-items-center gap-6">
        <div className="flex w-full items-center gap-4">
          <h2 className="text-foreground/60 text-xs font-semibold whitespace-nowrap lg:text-sm">
            PREFERRED SUBJECTS
          </h2>
          <div className="border-foreground/40 flex-1 border-t" />
        </div>
        <div className="xs:grid-cols-2 md:text-md grid grid-cols-1 gap-4 text-sm sm:grid-cols-3 md:grid-cols-6">
          {subjects.map((subject) => (
            <Label key={subject} className="flex items-center gap-2">
              <Checkbox
                checked={
                  subject === ENGLISH || selectedSubjects.includes(subject)
                }
                disabled={subject === ENGLISH}
                onCheckedChange={() => handleCheckboxChange(subject)}
              />
              <span>{subject}</span>
            </Label>
          ))}
        </div>
        {errors.subjects && (
          <p className="text-sm text-red-500">{errors.subjects.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting
          ? 'Submitting...'
          : isDirty
            ? 'Save changes'
            : 'No changes'}
      </Button>
    </form>
  );
}
