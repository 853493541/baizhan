from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from smart_solver import solve_schedule

app = FastAPI()

# ✅ Allow frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/solve")
async def solve(request: Request):
    body = await request.json()
    characters = body.get("characters", [])
    skillToggle = body.get("skillToggle", {})

    print(f"📥 Received {len(characters)} characters")
    print(f"✅ Enabled skills: {', '.join([k for k, v in skillToggle.items() if v])}")

    result = solve_schedule(characters, skillToggle)
    print(f"🧠 Returning {len(result)} groups")
    return {"groups": result}
