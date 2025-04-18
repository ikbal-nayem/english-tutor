// Common/overused words that could be improved
const commonWords = [
  { word: "good", alternatives: ["excellent", "outstanding", "superb", "wonderful", "fantastic"] },
  { word: "bad", alternatives: ["poor", "terrible", "awful", "unpleasant", "disappointing"] },
  { word: "nice", alternatives: ["pleasant", "delightful", "enjoyable", "charming", "lovely"] },
  { word: "big", alternatives: ["large", "enormous", "substantial", "massive", "extensive"] },
  { word: "small", alternatives: ["tiny", "compact", "miniature", "petite", "modest"] },
  { word: "happy", alternatives: ["delighted", "thrilled", "ecstatic", "joyful", "pleased"] },
  { word: "sad", alternatives: ["unhappy", "melancholy", "gloomy", "downcast", "despondent"] },
  { word: "angry", alternatives: ["furious", "enraged", "irate", "indignant", "outraged"] },
  { word: "scared", alternatives: ["frightened", "terrified", "petrified", "alarmed", "anxious"] },
  { word: "tired", alternatives: ["exhausted", "fatigued", "weary", "drained", "spent"] },
  { word: "very", alternatives: ["extremely", "exceedingly", "immensely", "tremendously", "incredibly"] },
  { word: "really", alternatives: ["genuinely", "truly", "absolutely", "completely", "thoroughly"] },
  { word: "a lot", alternatives: ["numerous", "abundant", "plentiful", "copious", "substantial"] },
  { word: "thing", alternatives: ["item", "object", "element", "component", "entity"] },
  { word: "stuff", alternatives: ["materials", "items", "possessions", "belongings", "goods"] },
  { word: "got", alternatives: ["received", "obtained", "acquired", "procured", "gained"] },
  { word: "get", alternatives: ["obtain", "acquire", "procure", "gain", "secure"] },
  { word: "like", alternatives: ["enjoy", "appreciate", "favor", "prefer", "admire"] },
  { word: "said", alternatives: ["mentioned", "stated", "declared", "remarked", "expressed"] },
  { word: "went", alternatives: ["traveled", "journeyed", "proceeded", "ventured", "headed"] },
]

// Advanced vocabulary words to highlight
const advancedWords = [
  "articulate",
  "eloquent",
  "profound",
  "meticulous",
  "diligent",
  "comprehensive",
  "intricate",
  "innovative",
  "versatile",
  "exemplary",
  "paramount",
  "imperative",
  "substantial",
  "pivotal",
  "integral",
  "fundamental",
  "quintessential",
  "unprecedented",
  "exemplify",
  "facilitate",
  "implement",
  "optimize",
  "leverage",
  "cultivate",
  "enhance",
  "mitigate",
  "alleviate",
  "elucidate",
  "elaborate",
  "substantiate",
  "corroborate",
  "scrutinize",
  "discern",
  "ascertain",
  "endeavor",
  "persevere",
  "resilient",
  "tenacious",
  "adept",
  "proficient",
  "cognizant",
  "pragmatic",
  "strategic",
  "analytical",
  "methodical",
  "systematic",
  "holistic",
  "nuanced",
  "intrinsic",
  "extrinsic",
  "ambiguous",
  "convoluted",
  "esoteric",
  "ubiquitous",
  "ephemeral",
  "perpetual",
  "arduous",
  "formidable",
  "lucrative",
  "prudent",
  "astute",
  "sagacious",
]

export interface VocabularyAnalysis {
  commonWords: {
    word: string
    index: number
    alternatives: string[]
  }[]
  advancedWords: {
    word: string
    index: number
  }[]
}

export function analyzeVocabulary(text: string): VocabularyAnalysis {
  const words = text.toLowerCase().split(/\s+/)
  const result: VocabularyAnalysis = {
    commonWords: [],
    advancedWords: [],
  }

  // Find common/overused words
  words.forEach((word, index) => {
    // Remove punctuation for comparison
    const cleanWord = word.replace(/[.,!?;:'"()]/g, "")

    // Check for common words
    const commonWord = commonWords.find((cw) => cw.word === cleanWord)
    if (commonWord) {
      result.commonWords.push({
        word: cleanWord,
        index,
        alternatives: commonWord.alternatives,
      })
    }

    // Check for advanced words
    if (advancedWords.includes(cleanWord)) {
      result.advancedWords.push({
        word: cleanWord,
        index,
      })
    }
  })

  return result
}
