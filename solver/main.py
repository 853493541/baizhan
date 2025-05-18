from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from smart_solver import solve_schedule

app = FastAPI()

# ✅ CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/solve")
async def solve(request: Request):
    body = await request.json()
    characters = body.get("characters", [])
    skillToggle = body.get("skillToggle", {})
    needsCount = body.get("needsCount", {})

    print(f"📥 Received {len(characters)} characters")
    print(f"✅ Enabled skills: {', '.join([k for k, v in skillToggle.items() if v])}")
    print(f"📊 needsCount received with {len(needsCount)} keys")
    for k, v in needsCount.items():
        print(f"   - {k}: {v}")

    result = solve_schedule(characters, skillToggle, needsCount)
    print(f"🧠 Returning {len(result)} groups")
    return {"groups": result}
