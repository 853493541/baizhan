"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";

interface Character {
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

type ViewMode = "name" | "core" | "needs";

export default function Playground() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [groups, setGroups] = useState<Character[][]>(Array.from({ length: 8 }, () => []));
  const [viewMode, setViewMode] = useState<ViewMode>("name");
  const [showLevels, setShowLevels] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [groupList, setGroupList] = useState<ActiveSchedule[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [draggedChar, setDraggedChar] = useState<Character | null>(null);
  const [dragSourceGroupIndex, setDragSourceGroupIndex] = useState<number | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    console.log("📥 Fetching available characters...");
    axios.get(`${API_BASE}/characters/core`).then((charRes) => {
      const fetchedCharacters: Character[] = charRes.data;

      console.log("📥 Fetching active schedule snapshot...");
      axios.get(`${API_BASE}/active-scheduling`).then((groupRes) => {
        const schedules: ActiveSchedule[] = groupRes.data;
        const firstGroup = schedules[0];
        setGroupList(schedules);

        if (firstGroup) {
          console.log("📦 Loaded active schedule:", firstGroup);
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

  const renderDisplay = (char: Character) => {
    if (viewMode === "name") return `${char.comboBurst ? "@" : ""}${char.name}`;
    if (viewMode === "core") {
      if (!char.core) return "(无技能)";
      return Object.entries(char.core)
        .map(([k, v]) => (showLevels ? `${v}${k}` : k))
        .join("  ");
    }
    if (viewMode === "needs") {
      if (!char.needs) return "(无需求)";
      return char.needs.length > 0 ? `${char.needs.join(" ")}` : "无需求";
    }
    return char.name;
  };

  const getRoleClass = (role: string) => {
    switch (role) {
      case "Tank": return styles.tank;
      case "Healer": return styles.healer;
      case "DPS": return styles.dps;
      default: return styles.defaultBox;
    }
  };

  const handleDragStart = (event: React.DragEvent, char: Character, originGroupIndex?: number) => {
    setDraggedChar(char);
    setDragSourceGroupIndex(originGroupIndex ?? null);
    event.dataTransfer.setData("text/plain", JSON.stringify(char));
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
      axios.post(`${API_BASE}/active-scheduling/${currentGroupId}`, {
        groups: updatedGroups
      }).catch((err) => console.error("❌ Failed to save groups:", err));
    }
  };

  const handleRemoveCharacter = (groupIndex: number, charIndex: number, char: Character) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = updatedGroups[groupIndex].filter((_, i) => i !== charIndex);
    setGroups(updatedGroups);
    setAllCharacters((prev) => [...prev, char]);

    if (currentGroupId) {
      axios.post(`${API_BASE}/active-scheduling/${currentGroupId}`, {
        groups: updatedGroups
      }).catch((err) => console.error("❌ Failed to sync groups:", err));
    }
  };

  const handleCreateNewGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/active-scheduling/create`, { name: newGroupName });
      const created = res.data;
      setMessage(`✅ Created group: ${created.name}`);
      setNewGroupName("");

      const updated = await axios.get(`${API_BASE}/active-scheduling`);
      setGroupList(updated.data);
      setCurrentGroupId(created._id);
    } catch (err) {
      console.error("Failed to create group:", err);
      setMessage("❌ Failed to create group");
    }
  };

  const handleSubmitCurrentSchedule = async () => {
    try {
      console.log("🚀 Submitting current schedule...");
      console.log("📋 Current groups state:", groups);

      const schedule = groups.map((g, i) => ({
        groupIndex: i,
        characters: g
      }));

      console.log("📤 Transformed schedule to send:", JSON.stringify(schedule, null, 2));

      const res = await axios.post(`${API_BASE}/current-schedule`, { schedule });

      console.log("✅ Server response:", res.data);
      alert("✅ 已保存为当前排表！");
    } catch (err: any) {
      console.error("❌ 提交当前排表失败:", err);
      if (err.response) {
        console.error("❗ Server responded with:", err.response.data);
      } else if (err.request) {
        console.error("❗ No response received:", err.request);
      } else {
        console.error("❗ Error setting up request:", err.message);
      }
      alert("❌ 提交失败！");
    }
  };

  return (
    <div className={styles.container}>
      <h1>分组总览</h1>

      <div className={styles.createGroupRow}>
        <input
          className={styles.groupInput}
          type="text"
          placeholder="新分组名称"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={handleCreateNewGroup}>创建新分组</button>
        {message && <span className={styles.message}>{message}</span>}
      </div>

      <div className={styles.groupSelectorRow}>
        <label htmlFor="groupSelect">切换分组:</label>
        <select
          id="groupSelect"
          value={currentGroupId || ""}
          onChange={(e) => setCurrentGroupId(e.target.value)}
        >
          {groupList.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.toggleButtons}>
        <button onClick={() => setViewMode("name")}>显示名字</button>
        <button onClick={() => setViewMode("core")}>显示技能</button>
        <button onClick={() => setViewMode("needs")}>显示需求</button>
        {viewMode === "core" && (
          <label style={{ marginLeft: "1rem", fontWeight: "500" }}>
            <input
              type="checkbox"
              checked={showLevels}
              onChange={() => setShowLevels(!showLevels)}
              style={{ marginRight: "0.5rem" }}
            />
            显示等级
          </label>
        )}
      </div>

      <div className={styles.resetRow}>
        <button className={styles.resetButton} onClick={handleSubmitCurrentSchedule}>
          ✅ 提交为当前排表
        </button>
      </div>

      <h2>可选角色</h2>
      <div className={styles.availableGrid}>
        {allCharacters.map((char, i) => (
          <div
            key={i}
            className={`${styles.charPill} ${getRoleClass(char.role)}`}
            draggable
            onDragStart={(e) => handleDragStart(e, char)}
          >
            {renderDisplay(char)}
          </div>
        ))}
      </div>

      <h2>小队</h2>
      <div className={styles.groupGrid}>
        {groups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={styles.groupCard}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropEvent(e, groupIndex)}
          >
            <h3>组 {groupIndex + 1}</h3>
            {group.map((char, i) => (
              <div
                key={i}
                className={`${styles.charPill} ${getRoleClass(char.role)}`}
                draggable
                onDragStart={(e) => handleDragStart(e, char, groupIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleRemoveCharacter(groupIndex, i, char);
                }}
              >
                {renderDisplay(char)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}