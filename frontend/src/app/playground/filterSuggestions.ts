// playground/filterSuggestions.ts
import { Character } from '../types';
import { SkillToggle } from './filterSkills';

/**
 * Return sorted and filtered suggestions based on:
 * 1. Not in group
 * 2. No same account
 * 3. Role priority (Healer > Tank > DPS)
 * 4. Within role, sort by number of unmet group needs fulfilled
 */

export function getValidSuggestions(
  allCharacters: Character[],
  currentGroup: Character[],
  skillToggle: SkillToggle
): Character[] {
  const groupAccounts = new Set(currentGroup.map((c) => c.account));
  const groupNames = new Set(currentGroup.map((c) => `${c.name}|${c.account}`));

  // Step 1: compute group unmet needs (respects toggle)
  const allNeeds = ['钱', '斗', '天', '黑', '引'];
  const checked: Record<string, boolean> = {};
  currentGroup.forEach((c) => {
    (c.needs || []).forEach((need) => {
      if (skillToggle[need]) checked[need] = true;
    });
  });
  const unchecked = allNeeds.filter((s) => skillToggle[s] && !checked[s]);

  // Step 2: filter candidates
  const filtered = allCharacters.filter((candidate) => {
    const key = `${candidate.name}|${candidate.account}`;
    if (groupNames.has(key)) return false;
    if (groupAccounts.has(candidate.account)) return false;
    return true;
  });

  // Step 3: determine role priority
  const groupHasHealer = currentGroup.some((c) => c.role === 'Healer');
  const groupHasTank = currentGroup.some((c) => c.role === 'Tank');

  const roleWeight = (role: string) => {
    if (!groupHasHealer) return role === 'Healer' ? 0 : role === 'Tank' ? 1 : 2;
    if (!groupHasTank) return role === 'Tank' ? 0 : role === 'DPS' ? 1 : 2;
    return role === 'DPS' ? 0 : role === 'Tank' ? 1 : 2;
  };

  // Step 4: sort
  const sorted = filtered
    .map((char) => {
      const needs = char.needs?.filter((n) => skillToggle[n]) || [];
      const contribution = needs.filter((n) => unchecked.includes(n));
      return {
        char,
        score: contribution.length,
        roleRank: roleWeight(char.role),
      };
    })
    .sort((a, b) => {
      if (a.roleRank !== b.roleRank) return a.roleRank - b.roleRank;
      return b.score - a.score;
    })
    .map((entry) => entry.char);

  return sorted;
}

/**
 * Utility for UI: split character needs into helpful and extra
 * Example: 钱 | 斗 黑
 */
export function splitNeedsForDisplay(
  character: Character,
  groupUnmet: string[],
  skillToggle: SkillToggle
): [string[], string[]] {
  const activeNeeds = character.needs?.filter((n) => skillToggle[n]) || [];
  const helpful = activeNeeds.filter((n) => groupUnmet.includes(n));
  const extra = activeNeeds.filter((n) => !groupUnmet.includes(n));
  return [helpful, extra];
}
