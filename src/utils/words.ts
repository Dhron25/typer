// src/utils/words.ts

const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "person", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const punctuationAndNumbersWords = [
    "console.log('hello, world!');", "let i = 0;", "const x = 100;", "if (x > 50) { return true; }", "Array.prototype.map()", "function(x, y) { return x + y; }", "font-size: 1.2rem;", "color: #ff0000;", "margin: 0 auto;", "padding: 10px 20px;", "border-radius: 5px;", "background-color: rgba(0, 0, 0, 0.5);", "The year is 2025.", "Is it 3:00 PM yet?", "The value is $1,234.56.", "Email me at user@example.com.", "1 + 2 * (3 / 4) - 5", "object-fit: cover;", "display: flex;", "align-items: center;", "justify-content: center;", "z-index: 999;", "position: absolute;", "top: 50%;", "left: 50%;", "transform: translate(-50%, -50%);", "const response = await fetch(url);", "const data = await response.json();", "try...catch (e) {}", "new Promise((resolve, reject) => {})", "document.getElementById('root')", "localStorage.setItem('key', 'value');", "null", "undefined", "NaN", "true", "false"
];

const shuffle = (array: string[]): string[] => {
    // Create a copy to avoid modifying the original array
    const newArray = [...array];
    
    // Fisher-Yates shuffle algorithm
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export const generateWords = (count: number, withPunctuation = false): string[] => {
  const wordList = withPunctuation ? [...commonWords, ...punctuationAndNumbersWords] : commonWords;
  return shuffle(wordList).slice(0, count);
};
