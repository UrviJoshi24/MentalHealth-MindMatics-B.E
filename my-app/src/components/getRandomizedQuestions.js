// export const getRandomizedQuestions = (media) => {
//   const neutralQuestions = media.Neutral || [];
//   const nonNeutralQuestions = [
//     ...(media.Happy || []),
//     ...(media.Sad || []),
//     ...(media.Anger || []),
//     ...(media.Fear || []),
//   ];

//   let selectedQuestions = [];

//   // Step 1: Randomly decide if a neutral question should be included (50% chance)
//   const includeNeutral = Math.random() < 0.5; // 50% probability
//   if (includeNeutral && neutralQuestions.length > 0) {
//     const firstQuestion = neutralQuestions[Math.floor(Math.random() * neutralQuestions.length)];
//     selectedQuestions.push(firstQuestion);
//   }

//   // Step 2: Shuffle non-neutral questions and pick the remaining ones
//   const shuffledNonNeutral = nonNeutralQuestions.sort(() => Math.random() - 0.5);
//   while (selectedQuestions.length < 6 && shuffledNonNeutral.length > 0) {
//     selectedQuestions.push(shuffledNonNeutral.pop());
//   }

//   return selectedQuestions;
// };
export const getRandomizedQuestions = (media) => {
  const depressionQuestions = media.depressionVideos || [];
  const anxietyQuestions = media.anxietyVideos || [];
  const stressQuestions = media.stressVideos || [];

  let selectedQuestions = [];

  // Step 1: Shuffle and select 2 questions from Depression
  const shuffledDepression = depressionQuestions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2 && shuffledDepression.length > 0; i++) {
    selectedQuestions.push(shuffledDepression.pop());
  }

  // Step 2: Shuffle and select 2 questions from Anxiety
  const shuffledAnxiety = anxietyQuestions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2 && shuffledAnxiety.length > 0; i++) {
    selectedQuestions.push(shuffledAnxiety.pop());
  }

  // Step 3: Shuffle and select 2 questions from Stress
  const shuffledStress = stressQuestions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2 && shuffledStress.length > 0; i++) {
    selectedQuestions.push(shuffledStress.pop());
  }

  return selectedQuestions;
};