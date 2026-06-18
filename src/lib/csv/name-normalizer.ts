// Simple Levenshtein distance implementation
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null))

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }

  return matrix[b.length][a.length]
}

export function normalizePlayerName(
  inputName: string, 
  knownPlayers: string[], 
  threshold: number = 3
): string | null {
  if (!inputName) return null
  
  const normalizedInput = inputName.toLowerCase().trim()
  
  // 1. Exact match check
  const exactMatch = knownPlayers.find(p => p.toLowerCase() === normalizedInput)
  if (exactMatch) return exactMatch

  // 2. Fuzzy match finding lowest distance
  let bestMatch: string | null = null
  let minDistance = Infinity

  for (const player of knownPlayers) {
    const normalizedPlayer = player.toLowerCase()
    
    // Quick inclusion check (e.g., "Mbappe" in "Kylian Mbappe")
    if (normalizedPlayer.includes(normalizedInput) || normalizedInput.includes(normalizedPlayer)) {
      return player // Return early on strong partial match
    }

    const distance = levenshteinDistance(normalizedInput, normalizedPlayer)
    if (distance < minDistance) {
      minDistance = distance
      bestMatch = player
    }
  }

  // Only return if within threshold
  return minDistance <= threshold ? bestMatch : null
}
