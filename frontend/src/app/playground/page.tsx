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
  core: Record<string, number>;
  needs: string[];
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
  const [newGroupName, setNewGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [groupList, setGroupList] = useState<ActiveSchedule[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    console.log("📥 Fetching /characters/core...");
    axios.get(`${API_BASE}/characters/core`)
      .then((res) => {
        console.log("✅ Characters loaded:", res.data.length);
        setAllCharacters(res.data);
      })
      .catch((err) => console.error("❌ Failed to load characters:", err));

    console.log("📥 Fetching /active-scheduling...");
    axios.get(`${API_BASE}/active-scheduling`)
      .then((res) => {
        console.log("✅ Groups loaded:", res.data.length);
        console.log("📦 First group:", res.data[0]);
        setGroupList(res.data);
        if (res.data.length > 0) {
          setCurrentGroupId(res.data[0]._id);
          setGroups(res.data[0].groups);
        }
      })
      .catch((err) => console.error("❌ Failed to load group list", err));
  }, []);

  useEffect(() => {
    if (!currentGroupId) return;
    const selected = groupList.find((g) => g._id === currentGroupId);
    console.log("🔄 Switching to group:", currentGroupId, selected?.name);
    if (selected) {
      setGroups(selected.groups);
      console.log("🧩 Group members:", selected.groups);
    }
  }, [currentGroupId, groupList]);

  const renderDisplay = (char: Character) => {
    if (viewMode === "name") return `${char.comboBurst ? "@" : ""}${char.name}`;
    if (viewMode === "core") return Object.entries(char.core).map(([k, v]) => `${v}${k}`).join("  ");
    if (viewMode === "needs") return `需求: ${char.needs.join(", ")}`;
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

  const handleDrop = (groupIndex: number, char: Character) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = [...updatedGroups[groupIndex], char];
    setGroups(updatedGroups);

    if (currentGroupId) {
      axios.post(`${API_BASE}/active-scheduling/${currentGroupId}`, { groups: updatedGroups })
        .catch(err => console.error("Failed to update active group:", err));
    }
  };

  const handleDragStart = (event: React.DragEvent, char: Character) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(char));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDropEvent = (event: React.DragEvent, groupIndex: number) => {
    event.preventDefault();
    const charData = event.dataTransfer.getData("text/plain");
    const char: Character = JSON.parse(charData);
    handleDrop(groupIndex, char);
  };

  const handleCreateNewGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/active-scheduling/create`, {
        name: newGroupName,
      });

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
        {groups.map((group, groupIndex) => {
          console.log(`🧪 Rendering Group ${groupIndex + 1}`, group);
          return (
            <div
              key={groupIndex}
              className={styles.groupBox}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropEvent(e, groupIndex)}
            >
              <h3>组 {groupIndex + 1}</h3>
              {group.map((char, i) => (
                <div key={i} className={`${styles.charPill} ${getRoleClass(char.role)}`}>
                  {renderDisplay(char)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
