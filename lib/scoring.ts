export function bayesianAverage(rating: number, reviews: number, baseline: number, weight: number) {
  if (reviews === 0) return baseline;
  return ((rating * reviews) + (baseline * weight)) / (reviews + weight);
}

export function calculateAllScores({
  audible, amazon, apple, goodreads
}: {
  audible: { rating: number, reviews: number },
  amazon: { rating: number, reviews: number },
  apple: { rating: number, reviews: number },
  goodreads: { rating: number, reviews: number },
}) {
  const score_audible = bayesianAverage(audible.rating, audible.reviews, 3.5, 250);
  const score_amazon = bayesianAverage(amazon.rating, amazon.reviews, 3.5, 500);
  const score_apple = bayesianAverage(apple.rating, apple.reviews, 3.5, 50);
  const score_goodreads = bayesianAverage(goodreads.rating, goodreads.reviews, 3.5, 500);

  const score_final = (
    score_audible + score_amazon + score_apple + score_goodreads
  ) / 4;

  return {
    score_audible: Number(score_audible.toFixed(2)),
    score_amazon: Number(score_amazon.toFixed(2)),
    score_apple: Number(score_apple.toFixed(2)),
    score_goodreads: Number(score_goodreads.toFixed(2)),
    score_final: Number(score_final.toFixed(2)),
  };
}