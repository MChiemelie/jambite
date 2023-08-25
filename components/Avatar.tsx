'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = createClientComponentClient();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        (error.message)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <Image width={size} height={size} src={avatarUrl} alt="Avatar" className="border border-accent-4 mx-auto" style={{ height: size, width: size }} />) : (
        <div className='flex justify-center items-center mx-auto border border-accent-4 bg-zinc-500' style={{ height: size, width: size }}>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-2/5 fill-current mx-auto' viewBox="0 0 512 512">
            <rect x="48" y="80" width="416" height="352" rx="48" ry="48" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" /><circle cx="336" cy="176" r="32" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><path d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
          </svg>
        </div>
      )}
      <div style={{ width: size }} className="p-2 pb-0 mx-auto">
        <label htmlFor="single" className="bg-accent-1 p-2 rounded mx-auto flex justify-center items-center text-white">
          {uploading ? 'Uploading ...' : 'Upload Image'}
        </label>
        <input className='text-white' style={{ visibility: 'hidden', position: 'relative', }} type="file" id="single" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
      </div>
    </div>
  )
}