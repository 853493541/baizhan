from typing import List, Dict
from pulp import LpProblem, LpVariable, LpMinimize, lpSum, LpBinary, PULP_CBC_CMD

def solve_schedule(characters: List[Dict], skillToggle: Dict[str, bool]) -> List[List[str]]:
    # Enable only selected skills
    skill_targets = {
        "钱": 5,
        "斗": 7,
        "天": 8,
        "黑": 8,
        "引": 8,
    }

    enabled_skills = [k for k, v in skillToggle.items() if v]
    filtered_targets = {k: v for k, v in skill_targets.items() if k in enabled_skills}
    skills = list(filtered_targets.keys())
    accounts = set(c["account"] for c in characters)

    char_keys = [f'{c["name"]}|{c["account"]}' for c in characters]
    n_chars = len(characters)
    n_groups = 8

    prob = LpProblem("SkillGroupAssignment", LpMinimize)
    x = [[LpVariable(f"x_{i}_{g}", cat=LpBinary) for g in range(n_groups)] for i in range(n_chars)]
    y = {s: [LpVariable(f"y_{s}_{g}", cat=LpBinary) for g in range(n_groups)] for s in skills}

    # Constraints
    for i in range(n_chars):
        prob += lpSum(x[i][g] for g in range(n_groups)) <= 1  # max 1 group

    for g in range(n_groups):
        prob += lpSum(x[i][g] for i in range(n_chars)) == 3
        prob += lpSum(x[i][g] for i, c in enumerate(characters) if c["role"] == "Healer") >= 1
        for acc in accounts:
            prob += lpSum(x[i][g] for i, c in enumerate(characters) if c["account"] == acc) <= 1

    for s in skills:
        for g in range(n_groups):
            contributors = [i for i, c in enumerate(characters) if s in c.get("needs", [])]
            prob += lpSum(x[i][g] for i in contributors) >= y[s][g]

    for s in skills:
        prob += lpSum(y[s][g] for g in range(n_groups)) == filtered_targets[s]

    prob += 0  # Feasibility only
    solver = PULP_CBC_CMD(msg=True)
    prob.solve(solver)

    if prob.status != 1:
        print("❌ No feasible solution.")
        return [[] for _ in range(n_groups)]

    result = []
    for g in range(n_groups):
        members = [char_keys[i] for i in range(n_chars) if x[i][g].varValue == 1]
        result.append(members)

    print("✅ Feasible solution returned.")
    return result
