export function getEffectiveAbilities(
    abilities: { [key: string]: number }
  ): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    for (const [name, level] of Object.entries(abilities)) {
      if (level >= 9) {
        result[name] = level;
      }
    }
    return result;
  }
  