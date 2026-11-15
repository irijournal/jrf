"""Collect content/days/dayNN.py into out/days.json and check required fields."""
import importlib.util
import json
import sys
from pathlib import Path

HERE = Path(__file__).parent
DAYS_DIR = HERE.parent / "content" / "days"
REQUIRED = ["day", "week", "title", "question", "outcome", "objectives", "competencies", "anchor", "supporting",
            "theory", "concepts", "india", "timing", "slides", "misconceptions", "discussion", "activity",
            "worksheet", "independent", "readings", "assess", "takeaways", "exit", "next"]


def load_days():
    days = []
    for f in sorted(DAYS_DIR.glob("day*.py")):
        spec = importlib.util.spec_from_file_location(f.stem, f)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        batch = list(mod.DAYS) if hasattr(mod, "DAYS") else [mod.DAY]
        for d in batch:
            missing = [k for k in REQUIRED if k not in d]
            if missing:
                sys.exit(f"{f.name} day {d.get('day')}: missing {missing}")
            total = sum(t[1] for t in d["timing"])
            if total != 120:
                print(f"warning: {f.name} day {d['day']} timing totals {total} minutes")
            if d["theory"] is not None:
                d["theory"] = list(d["theory"])
            days.append(d)
    days.sort(key=lambda d: d["day"])
    return days


if __name__ == "__main__":
    days = load_days()
    out = HERE / "out"
    out.mkdir(exist_ok=True)
    (out / "days.json").write_text(json.dumps(days, ensure_ascii=False, indent=1))
    text = json.dumps(days, ensure_ascii=False)
    for bad in ("—", "–"):
        if bad in text:
            print("warning: dash character found", repr(bad))
    print(f"exported {len(days)} days")
