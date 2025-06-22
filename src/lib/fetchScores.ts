// src/lib/fetchScores.ts
export type SiteScore = {
  source: string
  rating: number | null
  reviewCount: number | null
}

export type ScoreResult = {
  average: number | null
  scores: SiteScore[]
}

export async function fetchScores(title: string, author: string): Promise<ScoreResult> {
  // Replace with real API calls or mock values for now
  console.log(title, author)
  
  const scores: SiteScore[] = [
    { source: 'Goodreads', rating: 4.3, reviewCount: 1023 },
    { source: 'Amazon', rating: 4.6, reviewCount: 245 },
    { source: 'Audible', rating: 4.7, reviewCount: 310 },
    { source: 'Apple Books', rating: 4.4, reviewCount: 100 },
  ]

  const weightedAverage = computeWeightedAverage(scores)
  return { average: weightedAverage, scores }
}

function computeWeightedAverage(scores: SiteScore[]): number | null {
  const totalWeighted = scores.reduce((acc, s) => {
    if (s.rating != null && s.reviewCount != null) {
      acc.total += s.rating * s.reviewCount
      acc.count += s.reviewCount
    }
    return acc
  }, { total: 0, count: 0 })

  return totalWeighted.count > 0 ? totalWeighted.total / totalWeighted.count : null
}