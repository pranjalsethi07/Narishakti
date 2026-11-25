// Helpers that turn the compact lesson definitions in finance*.js and health*.js into the shape the
// Learn pages use (see data/courses.js). A definition looks like this:
//
//   {
//     id: 1, level: 1, min: 6,
//     title:   ['English title', 'हिंदी शीर्षक'],
//     summary: ['One line in English.', 'हिंदी में एक पंक्ति।'],
//     points:  [['🌸', 'Card title', 'कार्ड शीर्षक', 'Card text in English.', 'हिंदी में कार्ड का पाठ।'], ...],
//     quiz:    [['Question?', ['Option A', 'Option B', 'Option C'], 'Option B'], ...],
//   }
//
// Every bullet in the course outline is one point (one "key point" card).

// Moves the right answer to a different slot from question to question (always the same slot would be
// too easy to guess). Fixed by the lesson and question numbers, so the order is the same on every visit.
const placeAnswer = (options, answer, seed) => {
  const others = options.filter((o) => o !== answer);
  const slot = seed % options.length;
  return [...others.slice(0, slot), answer, ...others.slice(slot)];
};

export const buildLesson = (d) => ({
  id: d.id,
  level: d.level,
  title: { en: d.title[0], hi: d.title[1] },
  minutes: d.min,
  summary: { en: d.summary[0], hi: d.summary[1] },
  read: d.points.map(([icon, titleEn, titleHi, bodyEn, bodyHi]) => ({
    icon,
    title: { en: titleEn, hi: titleHi },
    body: { en: bodyEn, hi: bodyHi },
  })),
  quiz: d.quiz.map(([question, options, answer], i) => ({ question, options: placeAnswer(options, answer, d.id + i), answer })),
});

// A level of a course: a heading that groups 4 sections.
export const level = (id, titleEn, titleHi, blurbEn, blurbHi) => ({
  id,
  title: { en: titleEn, hi: titleHi },
  blurb: { en: blurbEn, hi: blurbHi },
});
