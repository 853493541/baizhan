export const SKILL_ALIAS: Record<string, string> = {
  黑: '秦雷',
  天: '鬼影',
  引: '阿依努尔',
  钱: '冯度',
  斗: '冯度',
};

export const ALL_SKILLS = ['钱', '斗', '天', '黑', '引'];

export type SkillToggle = Record<string, boolean>;

export function getFilteredCore(
  core: Record<string, number> | undefined,
  enabled: SkillToggle
): Record<string, number> {
  if (!core) return {};
  const result: Record<string, number> = {};
  for (const skill of Object.keys(core)) {
    if (enabled[skill]) {
      result[skill] = core[skill];
    }
  }
  return result;
}

export function getFilteredNeeds(
  needs: string[] | undefined,
  enabled: SkillToggle
): string[] {
  if (!needs) return [];
  return needs.filter((skill) => enabled[skill]);
}

export function getEnabledCoreSkills(enabled: SkillToggle): string[] {
  return ALL_SKILLS.filter((s) => enabled[s]);
}
