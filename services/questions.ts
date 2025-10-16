'use client';

import axios from 'axios';

const RENDER_API_URL = 'https://jambite-question-api.onrender.com';

export async function getQuestions(subjects: string[], randomYear: string, onProgress?: (progress: number) => void) {
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

    onProgress?.(10); // Initial progress

    // Simulate progress for cold starts - increment slowly
    progressInterval = setInterval(() => {
      if (currentProgress < 85) {
        currentProgress += 5;
        onProgress?.(currentProgress);
      }
    }, 3000); // Every 3 seconds, add 5%

    // Use Axios for progress tracking
    const response = await axios.get(`${RENDER_API_URL}/api/questions?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 180000, // 3 minutes timeout
      onDownloadProgress: (progressEvent) => {
        // Clear simulated progress once real download starts
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }

        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          currentProgress = percentCompleted;
          onProgress?.(percentCompleted);
        } else {
          // Estimate progress when total is unknown
          const loaded = progressEvent.loaded;
          const estimated = Math.min(90, 30 + Math.floor(loaded / 10000));
          currentProgress = estimated;
          onProgress?.(estimated);
        }
      }
    });

    if (progressInterval) clearInterval(progressInterval);
    onProgress?.(100); // Complete
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
