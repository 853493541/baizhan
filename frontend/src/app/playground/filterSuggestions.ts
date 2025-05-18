// playground/filterSuggestions.ts
import { Character } from '../types';

export function getValidSuggestions(
  allCharacters: Character[],
  currentGroup: Character[]
): Character[] {
  return allCharacters.filter((candidate) => {
    // Rule 1: Not already in this group
    if (currentGroup.find((c) => c.name === candidate.name)) return false;

    // Rule 2: Same account already in this group?
    if (currentGroup.some((c) => c.account === candidate.account)) return false;

    // Rule 3: Candidate must help meet an unmet need
    const unmetNeeds = new Set(currentGroup.flatMap((c) => c.needs || []));
    const candidateSkills = Object.keys(candidate.core || {});
    return candidateSkills.some((skill) => unmetNeeds.has(skill));
  });
}
