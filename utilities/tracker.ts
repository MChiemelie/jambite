export function calculateStreak(practiceData) {
  if (!practiceData.length) return 0;

  const dates = practiceData.map((p) => new Date(p.timestamp)).sort((a, b) => a - b);
  let streak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const dayDifference = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (dayDifference === 1) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }

  return maxStreak;
}

export function getMostPracticedSubject(performanceData) {
  const subjectCounts = performanceData.reduce((acc, p) => {
    acc[p.subject] = (acc[p.subject] || 0) + 1;
    return acc;
  }, {});

  const [mostPracticedSubject, mostPracticedCount] = Object.entries(subjectCounts)
    .filter(([subject]) => subject !== 'Use of English')
    .reduce((max, curr) => (curr[1] > max[1] ? curr : max), ['', 0]);

  return { mostPracticedSubject, mostPracticedCount };
}

export function abbreviateSubject(subject) {
  const subjectMap = {
    'Use of English': 'English',
    Mathematics: 'Maths',
    Commerce: 'Commerce',
    Accounting: 'Accounting',
    Biology: 'Biology',
    Physics: 'Physics',
    Chemistry: 'Chemistry',
    'Lit. In English': 'Lit. Eng',
    Government: 'Govt',
    'Christian Rel. Know': 'CRK',
    Geography: 'Geography',
    Economics: 'Economics',
    'Islamic Rel. Know': 'IRK',
    'Civic Education': 'Civic',
    History: 'History',
  };
  return subjectMap[subject] || subject;
}
