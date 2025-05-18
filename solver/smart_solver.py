from typing import List, Dict
from pulp import LpProblem, LpVariable, LpMinimize, lpSum, LpBinary, PULP_CBC_CMD, LpStatus

def solve_schedule(characters: List[Dict], skillToggle: Dict[str, bool], needsCount: Dict[str, int]) -> List[List[str]]:
    print("🚀 Starting solver")
    print(f"📋 Total characters: {len(characters)}")
    healer_count = sum(1 for c in characters if c["role"] == "Healer")
    print(f"🧑‍⚕️ Total healers: {healer_count}")
    print(f"👤 Unique accounts: {len(set(c['account'] for c in characters))}")

    # 🧾 Log all received characters
    print("📦 Characters received:")
    for i, c in enumerate(characters):
        print(f"{i:02d}. {c['name']} ({c['role']}) - {c['account']}")

    enabled_skills = [k for k, v in skillToggle.items() if v]
    filtered_targets = {k: v for k, v in needsCount.items() if k in enabled_skills}
    capped_targets = {k: min(v, 8) for k, v in filtered_targets.items()}
    skills = list(capped_targets.keys())
    accounts = set(c["account"] for c in characters)

    print(f"⚙️ Enabled skills: {enabled_skills}")
    print(f"📦 Filtered and capped skill targets (max 8):")
    for k, v in capped_targets.items():
        print(f"   - {k}: {v}")

    char_keys = [f'{c["name"]}|{c["account"]}' for c in characters]
    n_chars = len(characters)
    n_groups = 8

    prob = LpProblem("SkillGroupAssignment", LpMinimize)
    x = [[LpVariable(f"x_{i}_{g}", cat=LpBinary) for g in range(n_groups)] for i in range(n_chars)]
    y = {s: [LpVariable(f"y_{s}_{g}", cat=LpBinary) for g in range(n_groups)] for s in skills}

    print("📦 Preparing to solve with constraints:")
    print(" - 8 groups")
    print(" - 3 members per group (total needed: 24)")
    print(" - At least 1 healer per group (total needed: 8)")
    print(" - No same account in same group")
    if not skills:
        print(" - ⚠️ No skill-based constraints — only group size, healer, and account rules")

    # Character constraints
    for i in range(n_chars):
        prob += lpSum(x[i][g] for g in range(n_groups)) <= 1

    # Group-level constraints
    for g in range(n_groups):
        prob += lpSum(x[i][g] for i in range(n_chars)) == 3
        prob += lpSum(x[i][g] for i, c in enumerate(characters) if c["role"] == "Healer") >= 1
        for acc in accounts:
            prob += lpSum(x[i][g] for i, c in enumerate(characters) if c["account"] == acc) <= 1

    # Skill-based constraints
    for s in skills:
        for g in range(n_groups):
            contributors = [i for i, c in enumerate(characters) if s in c.get("needs", [])]
            prob += lpSum(x[i][g] for i in contributors) >= y[s][g]
    for s in skills:
        prob += lpSum(y[s][g] for g in range(n_groups)) == capped_targets[s]

    prob += 0  # Feasibility only
    solver = PULP_CBC_CMD(msg=True)
    prob.solve(solver)

    if prob.status != 1:
        print(f"❌ No feasible solution. Solver status: {LpStatus[prob.status]}")
        prob.writeLP("infeasible.lp")
        print("📝 Wrote problem to infeasible.lp for manual inspection.")
        return [[] for _ in range(n_groups)]

    result = []
    for g in range(n_groups):
        members = [char_keys[i] for i in range(n_chars) if x[i][g].varValue == 1]
        result.append(members)

    print("✅ Feasible solution returned.")
    return result
