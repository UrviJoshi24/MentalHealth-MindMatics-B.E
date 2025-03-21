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
  const happyQuestions = media.Happy || [];
  const sadQuestions = media.Sad || [];

  let selectedQuestions = [];

  // Step 1: Shuffle and select first 3 questions from Happy
  const shuffledHappy = happyQuestions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 3 && shuffledHappy.length > 0; i++) {
    selectedQuestions.push(shuffledHappy.pop());
  }

  // Step 2: Shuffle and select next 3 questions from Sad
  const shuffledSad = sadQuestions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 3 && shuffledSad.length > 0; i++) {
    selectedQuestions.push(shuffledSad.pop());
  }

  return selectedQuestions;
};
