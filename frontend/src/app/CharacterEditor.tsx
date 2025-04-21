import { useState } from 'react';

const ROLE_OPTIONS = ['DPS', 'Tank', 'Healer'];
const CLASS_OPTIONS = ['七秀', '天策', '纯阳', '药宗', '刀宗', '明教', '少林', '凌雪', '蓬莱', '五毒'];

export default function CharacterEditor({ character, onSave, onCancel }: {
  character: any,
  onSave: (updated: any) => void,
  onCancel: () => void
}) {
  const [role, setRole] = useState(character.role || '');
  const [charClass, setCharClass] = useState(character.class || '');
  const [abilities, setAbilities] = useState<{ [key: string]: number }>({ ...character.abilities });

  const handleLevelChange = (key: string, value: number) => {
    setAbilities({ ...abilities, [key]: value });
  };

  const handleDelete = (key: string) => {
    const newAbilities = { ...abilities };
    delete newAbilities[key];
    setAbilities(newAbilities);
  };

  const handleSave = () => {
    onSave({
      ...character,
      role,
      class: charClass,
      abilities
    });
  };

  return (
    <div className="border p-4 rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold mb-4">编辑角色：{character.name}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">职业</label>
        <select
          className="border mt-1 p-2 rounded w-full"
          value={charClass}
          onChange={(e) => setCharClass(e.target.value)}
        >
          <option value="">-- 选择职业 --</option>
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">定位</label>
        <select
          className="border mt-1 p-2 rounded w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- 选择定位 --</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">技能列表</label>
        {Object.entries(abilities).map(([ability, level]) => (
          <div key={ability} className="flex items-center gap-2 mb-2">
            <span className="w-20 font-semibold text-gray-700">{ability}</span>
            <input
              type="number"
              className="border p-1 rounded w-24"
              value={level}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleLevelChange(ability, Number(e.target.value))
              }
            />
            <button
              onClick={() => handleDelete(ability)}
              className="text-red-600 text-sm hover:underline"
            >
              删除
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          取消
        </button>
      </div>
    </div>
  );
}
