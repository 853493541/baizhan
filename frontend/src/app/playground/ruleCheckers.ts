import { Character } from '../types';

const CORE_SKILLS = ['钱', '斗', '天', '黑', '引'];

// ✅ 1. Check which core skills are already fulfilled
export function getCheckedNeeds(group: Character[]): Record<string, boolean> {
  const needed: Record<string, boolean> = {
    钱: false,
    斗: false,
    天: false,
    黑: false,
    引: false,
  };

  group.forEach((char) => {
    char.needs?.forEach((skill) => {
      if (CORE_SKILLS.includes(skill)) {
        needed[skill] = true;
      }
    });
  });

  console.log('🟩 Needed core skills:', needed);
  return needed;
}

// ⚠️ 2. Return list of warning strings
export function getGroupWarnings(group: Character[]): string[] {
  const warnings: string[] = [];

  if (group.length === 0) return warnings;

  // 🟥 Same account conflict
  const seenAccounts = new Set<string>();
  for (const char of group) {
    if (seenAccounts.has(char.account)) {
      warnings.push('同账号角色');
      break;
    }
    seenAccounts.add(char.account);
  }

  // 🟩 Missing healer
  const hasHealer = group.some((char) => char.role === 'Healer');
  if (!hasHealer) warnings.push('缺少治疗');

  // ⚫ Core needs unmet (only if 3+ chars)
  if (group.length >= 3) {
    const checked = getCheckedNeeds(group);
    const missing = CORE_SKILLS.filter((s) => !checked[s]);
    for (const skill of missing) {
      warnings.push(`冲突技能 ${skill}`);
    }
  }

  return warnings;
}
