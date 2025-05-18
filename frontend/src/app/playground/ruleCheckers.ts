import { Character } from './usePlaygroundState';

const CORE_SKILLS = ['钱', '斗', '天', '黑', '引'];

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

  return needed;
}

export function getGroupWarnings(
  group: Character[],
  skillToggle: Record<string, boolean>
): string[] {
  const warnings: string[] = [];

  if (group.length === 0) return warnings;

  // ✅ Same account check
  const seenAccounts = new Set<string>();
  for (const char of group) {
    if (seenAccounts.has(char.account)) {
      warnings.push('同账号角色');
      break;
    }
    seenAccounts.add(char.account);
  }

  // ✅ Healer requirement
  const hasHealer = group.some((char) => char.role === 'Healer');
  if (!hasHealer) warnings.push('缺少治疗');

  // ✅ Conflict skills (respecting toggle)
  if (group.length >= 3) {
    const checked = getCheckedNeeds(group);
    for (const skill of CORE_SKILLS) {
      if (skillToggle[skill] && !checked[skill]) {
        warnings.push(`冲突技能 ${skill}`);
      }
    }
  }

  return warnings;
}
