// src/app/playground/usePlaygroundState.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Character {
  name: string;
  role: string;
  account: string;
  owner: string;
  comboBurst: boolean;
  core?: Record<string, number>;
  needs?: string[];
}

interface ActiveSchedule {
  _id: string;
  name: string;
  groups: Character[][];
  createdAt: string;
}

export type ViewMode = 'name' | 'core' | 'needs';

export default function usePlaygroundState() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [groups, setGroups] = useState<Character[][]>(Array.from({ length: 8 }, () => []));
  const [viewMode, setViewMode] = useState<ViewMode>('name');
  const [showLevels, setShowLevels] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [groupList, setGroupList] = useState<ActiveSchedule[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [draggedChar, setDraggedChar] = useState<Character | null>(null);
  const [dragSourceGroupIndex, setDragSourceGroupIndex] = useState<number | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    axios.get(`${API_BASE}/characters/core`).then((charRes) => {
      const fetchedCharacters: Character[] = charRes.data;

      axios.get(`${API_BASE}/active-scheduling`).then((groupRes) => {
        const schedules: ActiveSchedule[] = groupRes.data;
        const firstGroup = schedules[0];
        setGroupList(schedules);

        if (firstGroup) {
          setCurrentGroupId(firstGroup._id);
          setGroups(firstGroup.groups);
          const used = new Set(firstGroup.groups.flat().map((c) => `${c.name}|${c.account}`));
          const available = fetchedCharacters.filter(
            (c) => !used.has(`${c.name}|${c.account}`)
          );
          setAllCharacters(available);
        } else {
          setAllCharacters(fetchedCharacters);
        }
      });
    });
  }, []);

  const handleDragStart = (event: React.DragEvent, char: Character, originGroupIndex?: number) => {
    setDraggedChar(char);
    setDragSourceGroupIndex(originGroupIndex ?? null);
    event.dataTransfer.setData('text/plain', JSON.stringify(char));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDropEvent = (event: React.DragEvent, targetGroupIndex: number) => {
    event.preventDefault();
    if (!draggedChar) return;

    const updatedGroups = [...groups];

    if (dragSourceGroupIndex !== null) {
      updatedGroups[dragSourceGroupIndex] = updatedGroups[dragSourceGroupIndex].filter(
        (c) => !(c.name === draggedChar.name && c.account === draggedChar.account)
      );
    } else {
      setAllCharacters((prev) =>
        prev.filter((c) => !(c.name === draggedChar.name && c.account === draggedChar.account))
      );
    }

    updatedGroups[targetGroupIndex] = [...updatedGroups[targetGroupIndex], draggedChar];
    setGroups(updatedGroups);
    setDraggedChar(null);
    setDragSourceGroupIndex(null);

    if (currentGroupId) {
      axios
        .post(`${API_BASE}/active-scheduling/${currentGroupId}`, {
          groups: updatedGroups,
        })
        .catch((err) => console.error('❌ Failed to save groups:', err));
    }
  };

  const handleRemoveCharacter = (groupIndex: number, charIndex: number, char: Character) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = updatedGroups[groupIndex].filter((_, i) => i !== charIndex);
    setGroups(updatedGroups);
    setAllCharacters((prev) => [...prev, char]);

    if (currentGroupId) {
      axios
        .post(`${API_BASE}/active-scheduling/${currentGroupId}`, {
          groups: updatedGroups,
        })
        .catch((err) => console.error('❌ Failed to sync groups:', err));
    }
  };

  const handleCreateNewGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/active-scheduling/create`, { name: newGroupName });
      const created = res.data;
      setMessage(`✅ Created group: ${created.name}`);
      setNewGroupName('');

      const updated = await axios.get(`${API_BASE}/active-scheduling`);
      setGroupList(updated.data);
      setCurrentGroupId(created._id);
    } catch (err) {
      console.error('Failed to create group:', err);
      setMessage('❌ Failed to create group');
    }
  };

  const handleSubmitCurrentSchedule = async () => {
    try {
      const schedule = groups.map((g, i) => ({
        groupIndex: i,
        characters: g,
      }));

      await axios.post(`${API_BASE}/current-schedule`, { schedule });
      alert('✅ 已保存为当前排表！');
    } catch (err) {
      console.error('❌ 提交当前排表失败:', err);
      alert('❌ 提交失败！');
    }
  };

  return {
    allCharacters,
    groups,
    viewMode,
    showLevels,
    newGroupName,
    message,
    groupList,
    currentGroupId,
    setNewGroupName,
    setViewMode,
    setShowLevels,
    setCurrentGroupId,
    handleCreateNewGroup,
    handleSubmitCurrentSchedule,
    handleDragStart,
    handleDragOver,
    handleDropEvent,
    handleRemoveCharacter,
  };
}
