// playground/filterSuggestions.ts
import { Character } from '../types';
import { SkillToggle } from './filterSkills';

export function getValidSuggestions(
  allCharacters: Character[],
  currentGroup: Character[],
  skillToggle: SkillToggle
): Character[] {
  const groupAccounts = new Set(currentGroup.map((c) => c.account));
  const groupNames = new Set(currentGroup.map((c) => `${c.name}|${c.account}`));

  const allSkills = ['钱', '斗', '天', '黑', '引'];

  const checkedSkills = new Set<string>();
  currentGroup.forEach((c) => {
    (c.needs || []).forEach((n) => {
      if (skillToggle[n]) checkedSkills.add(n);
    });
  });

  const uncheckedSkills = allSkills.filter((s) => skillToggle[s] && !checkedSkills.has(s));
  const checkedList = allSkills.filter((s) => skillToggle[s] && checkedSkills.has(s));

  const groupHasHealer = currentGroup.some((c) => c.role === 'Healer');
  const groupHasTank = currentGroup.some((c) => c.role === 'Tank');

  const roleWeight = (role: string) => {
    if (!groupHasHealer) return role === 'Healer' ? 0 : role === 'Tank' ? 1 : 2;
    if (!groupHasTank) return role === 'Tank' ? 0 : role === 'DPS' ? 1 : 2;
    return role === 'DPS' ? 0 : role === 'Tank' ? 1 : 2;
  };

  const filtered = allCharacters.filter((char) => {
    const key = `${char.name}|${char.account}`;
    return !groupNames.has(key) && !groupAccounts.has(char.account);
  });

  const groupSize = currentGroup.length;

  const scored = filtered.map((char) => {
    const activeNeeds = (char.needs || []).filter((n) => skillToggle[n]);
    const contribution = activeNeeds.filter((n) => uncheckedSkills.includes(n));
    const overlap = activeNeeds.filter((n) => checkedList.includes(n));

    let score = 0;
    let tiebreak = 0;

    if (groupSize === 0) {
      score = -contribution.length; // prefer more coverage
      tiebreak = 0;
    } else if (groupSize === 1) {
      score = contribution.length; // prefer fewer contributions
      tiebreak = overlap.length;   // fewer overlaps is better
    } else {
      score = -contribution.length; // prefer to finish remaining boxes
      tiebreak = 0;
    }

    return {
      char,
      score,
      tiebreak,
      roleRank: roleWeight(char.role),
    };
  });

  return scored
    .sort((a, b) => {
      if (a.roleRank !== b.roleRank) return a.roleRank - b.roleRank;
      if (a.score !== b.score) return a.score - b.score;
      return a.tiebreak - b.tiebreak;
    })
    .map((entry) => entry.char);
}

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
