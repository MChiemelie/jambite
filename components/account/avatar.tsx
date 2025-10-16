'use client';

import imageCompression from 'browser-image-compression';
import { ImageUp } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Input } from '@/components/shadcn/input';
import { useUser } from '@/contexts';
import { createAvatar, updateAvatar } from '@/helpers/avatar';

export default function UploadAvatar() {
  const { user } = useUser();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/images/profile/default.jpg');

  const avatarId = user?.avatarId;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: 'image/jpeg'
      });

      const compressedFile = new File([compressedBlob], `${file.name.split('.').slice(0, -1).join('.') || 'avatar'}.jpg`, { type: 'image/jpeg' });

      setAvatarUrl(URL.createObjectURL(compressedFile));

      let newAvatar: any;
      if (avatarId) {
        newAvatar = await updateAvatar(compressedFile);
      } else {
        newAvatar = await createAvatar(compressedFile);
      }

      if (newAvatar?.$id) {
        const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${newAvatar.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}&t=${Date.now()}`;
        setAvatarUrl(url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='relative cursor-pointer'>
        <Image src={avatarUrl} alt={user?.fullname || 'Avatar'} width={300} height={300} className='border-2 border-foreground/60 object-cover rounded-full h-60 w-60' />

        <div className='absolute bottom-4 right-4 lg:bottom-5 lg:right-5 bg-background/90 p-1 rounded-full border-2 border-brand'>
          <ImageUp className='text-foreground w-6 h-6' />
        </div>
      </div>
      <Input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} className='hidden' onClick={handleClick} />
    </div>
  );
}
