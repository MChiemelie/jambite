'use client';

import axios from 'axios';

const questionUrl = process.env.NEXT_PUBLIC_QUESTION_API_URL;

export async function getQuestions(
  subjects: string[],
  randomYear: string,
  onProgress?: (progress: number) => void
) {
  let progressInterval: NodeJS.Timeout | null = null;
  let currentProgress = 10;

  try {
    const queryParams = new URLSearchParams();
    if (subjects.length > 0) {
      queryParams.set('subjects', subjects.join(','));
    }
    if (randomYear) {
      queryParams.set('randomYear', randomYear);
    }

    onProgress?.(10);

    progressInterval = setInterval(() => {
      if (currentProgress < 85) {
        currentProgress += 5;
        onProgress?.(currentProgress);
      }
    }, 3000);

    const response = await axios.get(
      `${questionUrl}/api/questions?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        onDownloadProgress: (progressEvent) => {
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }

          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            currentProgress = percentCompleted;
            onProgress?.(percentCompleted);
          } else {
            const loaded = progressEvent.loaded;
            const estimated = Math.min(90, 30 + Math.floor(loaded / 10000));
            currentProgress = estimated;
            onProgress?.(estimated);
          }
        }
      }
    );

    if (progressInterval) clearInterval(progressInterval);
    onProgress?.(100);
    return response.data;
  } catch (error) {
    if (progressInterval) clearInterval(progressInterval);
    console.error('Error fetching questions:', error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - server took too long to respond');
      }
      throw new Error(error.response?.data?.error || error.message);
    }
    throw error;
  }
}
