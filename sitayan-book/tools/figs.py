#!/usr/bin/env python3
"""Figures for The Many Lives of Sita. Run: python3 tools/figs.py  (writes figures/*.png)

Data figures read research/corpus.json (the author's corpus workbook, 243 works).
Interpretive figures (agency coding, voice/need plot) encode the author's readings and say so in captions.
"""
import json, os, subprocess, textwrap, collections, math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Wedge, Rectangle
import numpy as np

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "figures")
os.makedirs(OUT, exist_ok=True)

# palette: sindoor, turmeric, indigo, leaf, earth, slate, rose
C = dict(sindoor="#2F43A8", turmeric="#A85A26", indigo="#172033", leaf="#5867B8",
         earth="#56617A", slate="#56617A", rose="#A85A26", ink="#172033", paper="#F5F7FB",
         pale="#EEF1F6", grey="#AAB3C5", teal="#44507A")
SER = "Liberation Sans"
plt.rcParams.update({"font.family": [SER, "DejaVu Sans"], "axes.unicode_minus": False, "font.size": 10, "axes.edgecolor": C["ink"],
                     "axes.labelcolor": C["ink"], "xtick.color": C["ink"], "ytick.color": C["ink"],
                     "axes.spines.top": False, "axes.spines.right": False,
                     "savefig.dpi": 220, "axes.linewidth": 0.6, "xtick.major.width": 0.6, "ytick.major.width": 0.6, "axes.titlecolor": "#172033", "figure.facecolor": "white"})

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("wrote", name)

def corpus():
    return json.load(open(os.path.join(BASE, "research", "corpus.json")))

def box(ax, x, y, w, h, text, fc, ec=None, fs=9, color="white", bold=False, r=0.003, ha="center"):
    p = FancyBboxPatch((x - w / 2, y - h / 2), w, h, boxstyle=f"round,pad=0.01,rounding_size={r}",
                       fc=fc, ec=ec or fc, lw=0.8)
    ax.add_patch(p)
    ax.text(x if ha == "center" else x - w / 2 + 0.01, y, text, ha=ha, va="center", fontsize=fs,
            color=color, fontweight="bold" if bold else "normal", wrap=True)

def arrow(ax, x1, y1, x2, y2, color=None, lw=1.3, style="-|>", rad=0.0, ls="-"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=11,
                                 color=color or C["slate"], lw=lw, connectionstyle=f"arc3,rad={rad}", ls=ls))

def dot(name, src):
    p = os.path.join(OUT, name)
    subprocess.run(["dot", "-Tpng", "-Gdpi=220", "-o", p], input=src.encode(), check=True)
    print("wrote", name)

# ---------------------------------------------------------------- data figures
def fig_period():
    recs = corpus()
    order = ["Classical (before 1000)", "Medieval and early modern (1000 to 1800)", "Colonial (1800 to 1947)",
             "Post-independence (1947 to 1990)", "Liberalisation era (1991 to 2009)", "Contemporary (2010 onward)"]
    short = ["Classical\n(before 1000)", "Medieval &\nearly modern", "Colonial\n1800–1947", "Post-indep.\n1947–90",
             "Liberalisation\n1991–2009", "Contemporary\n2010–2026"]
    cats = ["Source text", "Primary", "Scholarship", "Theory"]
    cols = [C["earth"], C["sindoor"], C["indigo"], C["turmeric"]]
    data = {c: [sum(1 for r in recs if r["Period"] == p and r["Category"] == c) for p in order] for c in cats}
    fig, ax = plt.subplots(figsize=(7.2, 3.8))
    bottom = np.zeros(len(order))
    for c, col in zip(cats, cols):
        ax.bar(short, data[c], bottom=bottom, color=col, label={"Primary": "Primary works (retellings)"}.get(c, c), width=0.68)
        bottom += np.array(data[c])
    for i, t in enumerate(bottom):
        ax.text(i, t + 1.5, int(t), ha="center", fontsize=9)
    ax.set_ylabel("Number of works")
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    ax.set_title("The corpus by period: 243 works", loc="left", fontsize=11, fontweight="bold")
    save(fig, "fig_0_1_corpus_period.png")

def fig_language():
    recs = [r for r in corpus() if r["Category"] in ("Primary", "Source text")]
    cnt = collections.Counter()
    for r in recs:
        for lang in r["Original language"].replace(";", ",").split(","):
            l = lang.strip()
            if not l: continue
            l = {"Maharashtri Prakrit": "Prakrit", "Bengali (sung scrolls)": "Bengali", "Malayalam (Mappila)": "Malayalam",
                 "Visual (Mithila painting)": "Visual (Mithila)", "Silent": "Silent film"}.get(l, l)
            cnt[l] += 1
    items = cnt.most_common()
    fig, ax = plt.subplots(figsize=(7.2, 5.2))
    names = [k for k, v in items][::-1]; vals = [v for k, v in items][::-1]
    colors = [C["indigo"] if n == "English" else C["sindoor"] for n in names]
    ax.barh(names, vals, color=colors, height=0.7)
    for i, v in enumerate(vals):
        ax.text(v + 0.6, i, str(v), va="center", fontsize=8.5)
    ax.set_xlabel("Primary and source texts (a work in two languages counts in both)")
    ax.set_title("Languages of the primary corpus", loc="left", fontsize=11, fontweight="bold")
    ax.tick_params(axis="y", labelsize=8.5)
    save(fig, "fig_0_2_corpus_languages.png")

def fig_women():
    recs = [r for r in corpus() if r["Category"] in ("Primary", "Source text")]
    keys = {"Sita": ["Sita", "Siti Dewi", "Bhoomija", "Vaidehi"], "Surpanakha": ["Surpanakha", "Shurpanakha", "Meenakshi"],
            "Ahalya": ["Ahalya"], "Urmila": ["Urmila"], "Mandodari": ["Mandodari"], "Kaikeyi": ["Kaikeyi"],
            "Shabari": ["Shabari"], "Shanta": ["Shanta"], "Manthara": ["Manthara"], "Kaushalya": ["Kaushalya"],
            "Tara": ["Tara"], "Trijata / Sarama": ["Trijata", "Sarama"], "Renuka": ["Renuka"]}
    cnt = {k: sum(1 for r in recs if any(s in r["Central women characters"] for s in v)) for k, v in keys.items()}
    items = sorted(cnt.items(), key=lambda x: -x[1])
    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    ax.bar([k for k, v in items], [v for k, v in items], color=[C["sindoor"]] + [C["turmeric"]] * (len(items) - 1))
    for i, (k, v) in enumerate(items):
        ax.text(i, v + 1.2, v, ha="center", fontsize=8.5)
    plt.xticks(rotation=35, ha="right", fontsize=8.5)
    ax.set_ylabel("Primary and source texts")
    ax.set_title("Whose story? Women named as central characters", loc="left", fontsize=11, fontweight="bold")
    save(fig, "fig_0_3_corpus_women.png")

def fig_retellings_timeline():
    """Book-length and major retellings from 1860 to 2026, by language family and kind."""
    pts = [  # year, short title, language, kind(1 feminist,2 woman-centred,3 devotional,4 metaphor,5 critique)
        (1860, "Sitar Banabas", "Bengali", 2), (1861, "Meghnadbadh Kavya", "Bengali", 5), (1862, "Birangana Kabya", "Bengali", 1),
        (1882, "Toru Dutt, 'Sita'", "English", 2), (1912, "Tapaswini", "Odia", 2), (1919, "Chintavishtayaya Sita", "Malayalam", 1),
        (1924, "Sita Agnipravesam", "Telugu", 1), (1931, "Saket", "Hindi", 2), (1943, "Saapa Vimochanam", "Tamil", 1),
        (1949, "Ramayana Darshanam", "Kannada", 3), (1954, "Rama Retold", "English", 5), (1955, "Bhoomikanya Sita", "Marathi", 1),
        (1959, "Periyar, True Reading", "Tamil", 5), (1961, "Kanchana Sita (play)", "Malayalam", 1), (1961, "Agni-pariksha (Tulsi)", "Hindi", 2),
        (1972, "Seetha Muthal...", "Malayalam", 5), (1975, "Ramayana Vishavruksham", "Telugu", 5), (1975, "Where Shall We Go...", "English", 4),
        (1987, "Sitayana (Iyengar)", "English", 3), (1996, "Sitayan (M. Sengupta)", "Bengali", 1), (1998, "Mahamoha", "Odia", 2),
        (2005, "Sarah Joseph stories", "Malayalam", 1), (2010, "Ms Militancy", "English", 1), (2011, "Sita's Ramayana", "English", 1),
        (2013, "The Missing Queen", "English", 1), (2013, "Sita's Ascent", "English", 2), (2013, "Pattanaik, Sita", "English", 3),
        (2014, "Sita's Sister", "English", 1), (2016, "Liberation of Sita (Eng.)", "Telugu", 1), (2016, "Lanka's Princess", "English", 1),
        (2017, "Sita: Warrior of Mithila", "English", 2), (2017, "Uttarakaanda", "Kannada", 3), (2018, "Mandodari", "English", 2),
        (2019, "Forest of Enchantments", "English", 1), (2019, "Bhumika", "English", 1), (2019, "Sitayana (Majmudar)", "English", 2),
        (2021, "Valmiki's Women", "English", 2), (2022, "Kaikeyi", "English", 1), (2022, "Urmila (Samar)", "Marathi", 2),
        (2023, "Trin Dhari Ot", "Hindi", 1), (2023, "Tara's Truce", "English", 2), (2024, "Sita's Voice (Assamese)", "Assamese", 1),
        (2025, "On the Banks of the Pampa", "Telugu", 1), (2025, "The Renunciation", "English", 2), (2026, "Valmiki's Sita", "English", 3)]
    kc = {1: C["sindoor"], 2: C["turmeric"], 3: C["indigo"], 4: C["leaf"], 5: C["slate"]}
    kn = {1: "Feminist retelling", 2: "Woman-centred", 3: "Devotional / conservative", 4: "Sita as metaphor", 5: "Critique / anti-epic"}
    pts = sorted(pts)
    fig, ax = plt.subplots(figsize=(7.6, 9.6))
    n = len(pts)
    for i, (y, t, l, k) in enumerate(pts):
        yy = n - 1 - i
        ax.plot([1855, y], [yy, yy], color=C["pale"], lw=0.7, zorder=1)
        ax.scatter(y, yy, s=36, color=kc[k], edgecolor="white", zorder=3)
        ax.text(1853, yy, f"{t}", ha="right", va="center", fontsize=7.0)
        ax.text(y + 1.5, yy, f"{y} · {l}", va="center", fontsize=6.3, color=C["slate"])
    ax.set_xlim(1855, 2048); ax.set_ylim(-1, n)
    ax.set_yticks([]); ax.spines["left"].set_visible(False)
    for x, lab in [(1947, "Independence"), (1987, "TV Ramayan"), (1992, "6 Dec 1992")]:
        ax.axvline(x, color=C["grey"], lw=0.8, ls="--"); ax.text(x + (4 if x == 1992 else 0), n - 0.3 - (0.9 if x == 1992 else 0), lab, fontsize=6.5, ha="center", color=C["slate"])
    handles = [plt.Line2D([], [], marker="o", ls="", color=kc[k], label=kn[k]) for k in kn]
    ax.legend(handles=handles, frameon=False, fontsize=7.5, loc="lower left", bbox_to_anchor=(0.02, 0.02))
    ax.set_title("A timeline of literary retellings, 1860–2026", loc="left", fontsize=10, fontweight="bold")
    save(fig, "fig_0_4_retellings_timeline.png")

# ---------------------------------------------------------------- conceptual diagrams
def fig_central_tension():
    fig, ax = plt.subplots(figsize=(7.4, 4.3)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.5, 0.86, 0.36, 0.12, "SITA'S LITERARY AFTERLIFE", C["ink"], fs=10, bold=True)
    box(ax, 0.2, 0.55, 0.34, 0.2, "A history of women's\nchanging possibilities of speech\n(voice, interiority, desire, choice)", C["sindoor"], fs=8.6)
    box(ax, 0.8, 0.55, 0.34, 0.2, "A history of the changing\npolitical needs of the societies\nthat rewrite her", C["indigo"], fs=8.6)
    arrow(ax, 0.42, 0.8, 0.27, 0.66); arrow(ax, 0.58, 0.8, 0.73, 0.66)
    ax.text(0.2, 0.36, "reform • rationalism • Marxism\nliberal feminism • Dalit feminism\nthe market • the diaspora", ha="center", va="top", fontsize=7.6, color=C["sindoor"])
    ax.text(0.8, 0.36, "colonial reform • nationalism\nanti-caste politics • television\nHindutva • the 'empowerment' market", ha="center", va="top", fontsize=7.6, color=C["indigo"])
    box(ax, 0.5, 0.06, 0.9, 0.11, "This book's claim: the second history repeatedly passes itself off as the first.\nSita's constant is refusal, not voice.", C["pale"], ec=C["sindoor"], fs=8.6, color=C["ink"])
    arrow(ax, 0.2, 0.2, 0.33, 0.12, color=C["sindoor"]); arrow(ax, 0.8, 0.2, 0.67, 0.12, color=C["indigo"])
    save(fig, "fig_0_5_central_tension.png")

def fig_genealogy():
    fig, ax = plt.subplots(figsize=(7.8, 6.6)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.5, 0.95, 0.96, 0.07, "Rāma-kathā: a shared pool of tellings (Ramanujan) — no single 'original'", C["ink"], fs=8.8, bold=True)
    tiers = [(0.79, "Classical and sectarian", C["earth"], ["Vālmīki\n(Sanskrit)", "Dasaratha Jātaka\n(Pali, Buddhist)", "Paumacariya\n(Jain Prakrit)", "Kālidāsa;\nBhavabhūti"]),
             (0.6, "Regional and devotional", C["sindoor"], ["Kamban\n(Tamil)", "Adhyātma;\nAdbhuta", "Tulsīdās\n(Awadhi)", "Kṛttibās;\nCandrābatī", "Mollā\n(Telugu)", "Kandalī;\nŚaṅkaradeva"]),
             (0.41, "Performative, oral, visual", C["leaf"], ["Women's songs\n(Telugu, Maithili,\nBhojpuri, Marathi)", "Theatre; Rāmlīlā;\nNangyārkūttu", "Painting: Mewar,\nPahari, Paṭua,\nMithilā, Ravi Varma"]),
             (0.2, "Modern literary reconstruction", C["indigo"], ["Feminist\nSītā", "Political\nSītā", "Psychological\nSītā", "Ecological\nSītā", "Devotional-\n'empowered' Sītā"])]
    centers = {}
    for y, label, col, items in tiers:
        ax.text(0.01, y + 0.075, label, fontsize=8, color=col, fontweight="bold")
        n = len(items); w = min(0.15, 0.9 / n - 0.02)
        for i, it in enumerate(items):
            x = 0.08 + (i + 0.5) * (0.88 / n)
            box(ax, x, y, w, 0.095, it, col, fs=6.9)
            centers[(y, i)] = x
        for i in range(n):
            arrow(ax, 0.5, y + 0.155 if y < 0.79 else 0.915, centers[(y, i)], y + 0.05, color=C["grey"], lw=0.6, style="-")
    ax.text(0.5, 0.05, "Arrows are lines of borrowing and answer, not succession: songs feed Candrābatī; Tulsī feeds the Rāmlīlā;\n"
            "women's songs and Vālmīki's Uttara Kāṇḍa feed the feminist Sītā. The traditions run side by side.",
            ha="center", fontsize=7.2, style="italic", color=C["slate"])
    save(fig, "fig_2_1_genealogy.png")

def fig_agni():
    fig, ax = plt.subplots(figsize=(7.4, 4.6)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.2, 0.9, 0.36, 0.09, "SITĀ — what is examined", C["sindoor"], fs=9.5, bold=True)
    box(ax, 0.8, 0.9, 0.36, 0.09, "RĀMA — what is protected", C["indigo"], fs=9.5, bold=True)
    left = ["Sexual purity (cāritra)", "Reputation (apavāda)", "Bodily proof (agni-praveśa)", "Public scrutiny (janasaṃsad)"]
    right = ["Royal legitimacy (yaśas)", "Public duty (prajā-rañjana)", "Lineage (kula, vaṃśa)", "Moral judgement (the bench)"]
    for i, (l, r) in enumerate(zip(left, right)):
        y = 0.72 - i * 0.15
        box(ax, 0.2, y, 0.36, 0.1, l, C["pale"], ec=C["sindoor"], color=C["ink"], fs=8.2)
        box(ax, 0.8, y, 0.36, 0.1, r, C["pale"], ec=C["indigo"], color=C["ink"], fs=8.2)
        arrow(ax, 0.61, y, 0.39, y, color=C["slate"])
    ax.text(0.5, 0.79, "burden of proof flows ←", ha="center", fontsize=8, color=C["slate"], style="italic")
    box(ax, 0.5, 0.06, 0.98, 0.12, "Vālmīki 6.103.15–20: 'this war was not undertaken for your sake' — the trial protects the house, not the wife.\n"
        "Vālmīki 7.42.19: 'as the king does, so the subjects follow' — the second trial is a ruling on precedent.", C["ink"], fs=7.0)
    ax.text(0.5, 0.165, "Analytical hypothesis to be tested against each telling, not assumed to apply to all.", ha="center", fontsize=7.4, color=C["slate"], style="italic")
    save(fig, "fig_1_2_agni_pariksha.png")

def fig_valmiki_speech():
    ev = [(1.9, "Ayodhyā 24–27", "Insists on exile; taunts Rāma:\n'a woman in a man's form' (2.27.3)"),
          (3.1, "Araṇya 43; 54", "Accuses Lakṣmaṇa (3.43.20); defies\nRāvaṇa behind a blade of grass (3.54.1)"),
          (4.3, "Sundara 19; 35", "Refuses Rāvaṇa (5.19.3); refuses\nHanumān's rescue (5.35.62)"),
          (5.5, "Yuddha 104", "Rebukes Rāma 'like a common man\nto a common woman' (6.104.5); enters fire"),
          (6.7, "Uttara 47", "Message to the king: 'I do not grieve\nfor my own body' (7.47.12)"),
          (7.9, "Uttara 88", "Oath; the Earth takes her —\nno second ordeal (7.88.10)")]
    fig, ax = plt.subplots(figsize=(8.2, 3.8)); ax.set_xlim(1.2, 8.6); ax.set_ylim(-1.7, 1.7); ax.axis("off")
    ax.plot([1.5, 8.3], [0, 0], color=C["ink"], lw=1.4)
    for i, (x, lab, d) in enumerate(ev):
        up = 1 if i % 2 == 0 else -1
        ax.scatter(x, 0, s=70, color=C["sindoor"], zorder=3)
        ax.plot([x, x], [0, 0.45 * up], color=C["grey"], lw=0.8)
        ax.text(x, 0.55 * up, lab, ha="center", va="bottom" if up > 0 else "top", fontsize=8.5, fontweight="bold", color=C["sindoor"])
        ax.text(x, 0.92 * up if up > 0 else -0.85, d, ha="center", va="bottom" if up > 0 else "top", fontsize=7.2)
    ax.text(1.6, -0.25, "Book 2", fontsize=7, color=C["slate"]); ax.text(7.9, -0.25, "Book 7", fontsize=7, color=C["slate"], ha="right")
    ax.set_title("A speaking Sītā: six moments of speech and refusal in Vālmīki (critical edition)", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_1_1_valmiki_speech.png")

def fig_endings():
    texts = ["Dasaratha Jātaka", "Rāmopākhyāna\n(Mahābhārata)", "Vālmīki\n(crit. ed.)", "Paumacariya\n(Jain)", "Raghuvaṃśa 14–15",
             "Uttararāmacarita", "Tulsīdās, Mānas", "Adbhuta Rāmāyaṇa", "Assamese Uttarakāṇḍa"]
    cols = ["Abduction", "Fire ordeal", "Banishment", "Speech of\nreproach", "Earth / death", "Reunion", "Renunciation", "Sita as\nwarrior"]
    M = [[0, 0, 0, 0, 0, 1, 0, 0], [1, 2, 0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 1, 0, 0, 0], [1, 1, 1, 0, 0, 0, 1, 0],
         [1, 1, 1, 1, 1, 0, 0, 0], [1, 1, 1, 0, 0, 1, 0, 0], [1, 2, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 1, 0, 1],
         [1, 1, 1, 2, 1, 0, 0, 0]]
    fig, ax = plt.subplots(figsize=(7.6, 4.6))
    cmap = {0: C["pale"], 1: C["turmeric"], 2: C["sindoor"]}
    for i, row in enumerate(M):
        for j, v in enumerate(row):
            ax.add_patch(Rectangle((j, len(M) - 1 - i), 0.92, 0.88, color=cmap[v]))
    ax.set_xlim(0, len(cols)); ax.set_ylim(0, len(M))
    ax.set_xticks([j + 0.46 for j in range(len(cols))]); ax.set_xticklabels(cols, fontsize=7.6)
    ax.xaxis.tick_top()
    ax.set_yticks([len(M) - 1 - i + 0.44 for i in range(len(M))]); ax.set_yticklabels(texts, fontsize=7.8)
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(length=0)
    handles = [Rectangle((0, 0), 1, 1, color=cmap[k]) for k in (1, 2, 0)]
    ax.legend(handles, ["present", "present and transformed (oath before gods; shadow Sītā; open rejection)", "absent or not central"], frameon=False, fontsize=7.3,
              loc="upper center", bbox_to_anchor=(0.5, -0.02), ncol=3)
    save(fig, "fig_1_3_endings_matrix.png")

def fig_shadow():
    fig, ax = plt.subplots(figsize=(7.4, 3.0)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    steps = [("Before the abduction", "Rāma asks the real Sītā\nto enter the fire", C["earth"]),
             ("Abduction & captivity", "a māyā-Sītā (shadow)\nis taken to Laṅkā", C["slate"]),
             ("Agni-parīkṣā", "fire returns the real Sītā;\nthe shadow vanishes", C["sindoor"]),
             ("Effect", "purity guaranteed in advance;\nher suffering made unreal", C["indigo"])]
    for i, (h, t, col) in enumerate(steps):
        x = 0.13 + i * 0.25
        box(ax, x, 0.62, 0.21, 0.13, h, col, fs=8.4, bold=True)
        box(ax, x, 0.36, 0.21, 0.2, t, C["pale"], ec=col, color=C["ink"], fs=7.8)
        if i < 3: arrow(ax, x + 0.11, 0.62, x + 0.14, 0.62)
    ax.text(0.5, 0.1, "Adhyātma Rāmāyaṇa and Tulsīdās, Rāmcaritmānas (both in the Araṇya book): devotion protects Sītā's body by erasing her experience.",
            ha="center", fontsize=7.4, style="italic", color=C["slate"])
    ax.set_title("The shadow-Sītā device", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_2_3_shadow_sita.png")

def fig_map():
    pts = [("Vālmīki (Skt., pan-Indian)", 26.8, 82.2, "Sanskrit"), ("Tulsīdās, Awadhi", 25.3, 83.0, "Hindi belt"),
           ("Kṛttibās; Candrābatī", 24.6, 90.6, "Bengali"), ("Mādhava Kandalī; Śaṅkaradeva", 26.2, 91.7, "Assamese"),
           ("Balarāma Dāsa; Sāralā Dāsa; Tapaswini", 20.3, 85.8, "Odia"), ("Mollā; women's songs", 17.4, 78.5, "Telugu"),
           ("Kamban", 10.8, 79.4, "Tamil"), ("Ezhuthachan; Kumaran Asan", 9.5, 76.4, "Malayalam"),
           ("Kuvempu; Bhyrappa", 13.3, 75.8, "Kannada"), ("Grindmill ovi songs", 18.6, 73.9, "Marathi"),
           ("Maithili wedding songs; Mithilā painting", 26.4, 86.1, "Maithili"), ("Mewar Rāmāyaṇa (1649–53)", 24.6, 73.7, "Rajasthan"),
           ("Pahari series", 32.1, 76.3, "Pahari"), ("Hamida Banu's Persian Rāmāyaṇa", 28.6, 77.2, "Mughal Persian"),
           ("Bhojpuri women's songs", 25.7, 84.0, "Bhojpuri"), ("Mappila Rāmāyaṇa", 11.2, 75.8, "Mappila"),
           ("Ramakien", 13.75, 100.5, "Thai"), ("Hikayat Seri Rama", 3.1, 101.7, "Malay"), ("Kakawin; Prambanan reliefs", -7.75, 110.5, "Javanese")]
    fig, (ax, kx) = plt.subplots(1, 2, figsize=(8.0, 5.6), gridspec_kw={"width_ratios": [1.25, 1]})
    ax.set_facecolor(C["paper"])
    for i, (name, la, lo, lang) in enumerate(pts, start=1):
        col = C["indigo"] if lo > 95 else C["sindoor"]
        ax.scatter(lo, la, s=150, color=col, edgecolor="white", zorder=3)
        ax.text(lo, la, str(i), color="white", fontsize=6.5, ha="center", va="center", zorder=4, fontweight="bold")
    ax.set_xlim(66, 116); ax.set_ylim(-10, 36)
    ax.set_xlabel("Longitude (°E)", fontsize=8); ax.set_ylabel("Latitude (°N)", fontsize=8)
    ax.tick_params(labelsize=7); ax.grid(color="white", lw=1)
    kx.axis("off")
    for i, (name, la, lo, lang) in enumerate(pts, start=1):
        kx.text(0, 1 - i * 0.051, f"{i:>2}. {lang}: {name}", fontsize=7.1, transform=kx.transAxes, va="top")
    fig.suptitle("Regional Rāmāyaṇa traditions: a schematic map (approximate centres; no boundaries drawn)", x=0.02, ha="left", fontsize=9.5, fontweight="bold")
    save(fig, "fig_2_2_regional_map.png")

def fig_devsen_cycle():
    themes = ["Foundling", "Parents' worry\nover marriage", "Child bride", "Giving away", "In-laws &\ndomestic abuse",
              "Golden deer:\nblaming the victim", "Need to bear\na son", "Pregnancy\ncravings", "Childbirth in\ndire conditions", "Abandonment"]
    fig, ax = plt.subplots(figsize=(6.4, 6.4)); ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5); ax.axis("off"); ax.set_aspect("equal")
    n = len(themes)
    for i, t in enumerate(themes):
        a = math.pi / 2 - i * 2 * math.pi / n
        x, y = math.cos(a), math.sin(a)
        ax.add_patch(Circle((x, y), 0.25, color=C["sindoor"] if i in (0, 9) else C["turmeric"], alpha=0.95))
        ax.text(x, y, t, ha="center", va="center", fontsize=6.6, color="white" if i in (0, 9) else C["ink"])
        a2 = math.pi / 2 - (i + 1) * 2 * math.pi / n
        arrow(ax, math.cos(a - 0.2) * 1.0, math.sin(a - 0.2) * 1.0, math.cos(a2 + 0.2) * 1.0, math.sin(a2 + 0.2) * 1.0, rad=-0.25, color=C["grey"])
    ax.text(0, 0.08, "'They call it the Ramayan\nbut it is of Sita that they sing'", ha="center", fontsize=8.5, style="italic")
    ax.text(0, -0.25, "Dev Sen, Manushi 108 (1998), pp. 19–20", ha="center", fontsize=7, color=C["slate"])
    save(fig, "fig_2_4_devsen_cycle.png")

def fig_home_world():
    fig, ax = plt.subplots(figsize=(7.2, 3.8)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.27, 0.62, 0.42, 0.5, "", C["pale"], ec=C["sindoor"])
    box(ax, 0.75, 0.62, 0.42, 0.5, "", C["pale"], ec=C["indigo"])
    ax.text(0.27, 0.83, "GHAR — the inner domain", ha="center", fontsize=9.5, fontweight="bold", color=C["sindoor"])
    ax.text(0.75, 0.83, "BĀHIR — the outer domain", ha="center", fontsize=9.5, fontweight="bold", color=C["indigo"])
    ax.text(0.27, 0.6, "spiritual, 'national', uncolonised\nwoman as its sign\nSita as chaste, self-sacrificing wife\n(Vivekananda; Gupt; Ram Rajya, 1943)", ha="center", fontsize=8)
    ax.text(0.75, 0.6, "material, Western, colonised\nscience, statecraft, economy\nmen negotiate with modernity\n(the reformer, the clerk, the Congressman)", ha="center", fontsize=8)
    box(ax, 0.5, 0.15, 0.86, 0.14, "Partha Chatterjee's 'nationalist resolution of the women's question' (1989): the ideal Sita is a defensive\nconstruction — tradition rebuilt under the colonial gaze, not tradition itself.", C["ink"], fs=7.8)
    save(fig, "fig_3_1_home_world.png")

def fig_two_victims():
    fig, ax = plt.subplots(figsize=(7.4, 3.8)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.5, 0.9, 0.5, 0.1, "UTTARA KĀṆḌA: the king's two judgements", C["ink"], fs=9.5, bold=True)
    rows = [("Who", "Sītā, a queen (woman)", "Śambūka, an ascetic (Śūdra)"),
            ("Charge", "rumour of contamination (7.42.17–19)", "doing tapas 'from a Śūdra womb' (7.67.2)"),
            ("Rationale", "public opinion; precedent for subjects' wives", "a Brahmin boy's death; varṇa order"),
            ("Sentence", "banishment while pregnant (7.44.15)", "beheading by Rāma's own hand (7.67.4)"),
            ("Afterlife", "Kumaran Asan, Chandrabati, Volga, Sengupta", "Kuvempu, Omprakash Valmiki, Periyar")]
    for i, (h, a, b) in enumerate(rows):
        y = 0.75 - i * 0.14
        box(ax, 0.1, y, 0.16, 0.1, h, C["slate"], fs=8)
        box(ax, 0.4, y, 0.38, 0.1, a, C["pale"], ec=C["sindoor"], color=C["ink"], fs=7.8)
        box(ax, 0.79, y, 0.38, 0.1, b, C["pale"], ec=C["earth"], color=C["ink"], fs=7.8)
    save(fig, "fig_5_1_two_victims.png")

def fig_reversal():
    fig, ax = plt.subplots(figsize=(7.2, 3.4)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    for x, t, col in [(0.2, "Devotional epic", C["indigo"]), (0.8, "Anti-caste counter-reading\n(Periyar; Ranganayakamma)", C["sindoor"])]:
        box(ax, x, 0.88, 0.36, 0.13, t, col, fs=9, bold=True)
    pairs = [("Rāma: dharma incarnate", "Rāma: Aryan aggressor"), ("Rāvaṇa: demon", "Rāvaṇa: wronged Dravidian king"),
             ("Sītā: ideal wife", "Sītā: ?  (instrument of the argument)")]
    for i, (a, b) in enumerate(pairs):
        y = 0.64 - i * 0.2
        box(ax, 0.2, y, 0.36, 0.12, a, C["pale"], ec=C["indigo"], color=C["ink"], fs=8.4)
        box(ax, 0.8, y, 0.36, 0.12, b, C["pale"], ec=C["sindoor"], color=C["ink"], fs=8.4)
        arrow(ax, 0.39, y, 0.61, y, color=C["slate"])
    ax.text(0.5, 0.05, "The reversal changes the heroes, not the woman's place in the plot (Hypothesis C).", ha="center", fontsize=8, style="italic", color=C["slate"])
    save(fig, "fig_5_2_reversal.png")

def fig_censorship():
    ev = [(1955, "Rama Retold (Menen, 1954) banned in India"), (1969, "Sachchi Ramayan (Periyar, Hindi) seized; litigation to 1976"),
          (1970, "Acharya Tulsi's Agni-pariksha: protests in Raipur"), (1987, "Ambedkar's 'Riddle of Rama and Krishna': agitation in Maharashtra"),
          (1987, "Sagar's Ramayan: viewers' letters force a 'mock' fire ordeal (Kishwar)"), (2001, "Lajja: Janki refuses the ordeal on stage"),
          (2009, "Sita Sings the Blues: demands for a ban"), (2011, "Ramanujan's essay removed from DU syllabus"),
          (2016, "Volga's 'Asokam' story: threats"), (2023, "Adipurush: dialogue controversy; Kathmandu halts Hindi films"),
          (2026, "Ramayana Part One: 'warrior Sita' debate")]
    fig, ax = plt.subplots(figsize=(7.4, 4.4)); ax.set_xlim(1948, 2032); ax.set_ylim(-0.5, len(ev) + 0.2); ax.axis("off")
    for i, (y, t) in enumerate(ev):
        yy = len(ev) - 1 - i
        ax.scatter(y, yy, s=40, color=C["sindoor"], zorder=3)
        ax.text(y + 1, yy, f"{y}  {t}", va="center", fontsize=7.6)
    ax.plot([1950, 2028], [-0.4, -0.4], color=C["ink"], lw=0.8)
    for x in range(1950, 2031, 10): ax.text(x, -0.75, str(x), ha="center", fontsize=7)
    ax.set_title("Contested tellings: bans, suits and storms, 1954–2026", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_5_3_contested_tellings.png")

def fig_character_map():
    src = r'''graph G { layout=neato; overlap=false; splines=true; bgcolor="white"; sep="+12";
    node [shape=ellipse, style=filled, fontname="Liberation Sans", fontsize=13, fontcolor="white", color="white"];
    edge [fontname="Liberation Sans", fontsize=10.5, color="#56617A", fontcolor="#56617A"];
    Sita [label="SĪTĀ", fillcolor="#2F43A8", fontsize=14, width=1.3];
    Rama [label="Rāma", fillcolor="#172033"]; Lak [label="Lakṣmaṇa", fillcolor="#172033"]; Ravana [label="Rāvaṇa", fillcolor="#172033"];
    Urmila [label="Ūrmilā", fillcolor="#A85A26"]; Ahalya [label="Ahalyā", fillcolor="#A85A26"]; Sur [label="Śūrpaṇakhā", fillcolor="#A85A26"];
    Mand [label="Mandodarī", fillcolor="#A85A26"]; Kaik [label="Kaikeyī", fillcolor="#A85A26"]; Manth [label="Mantharā", fillcolor="#A85A26"];
    Kaus [label="Kausalyā", fillcolor="#A85A26"]; Shab [label="Śabarī", fillcolor="#5867B8"]; Tara [label="Tārā", fillcolor="#A85A26"];
    Shanta [label="Śāntā", fillcolor="#A85A26"]; Trij [label="Trijaṭā / Saramā", fillcolor="#A85A26"]; Ren [label="Reṇukā", fillcolor="#56617A"];
    Earth [label="Bhūmi (Earth)", fillcolor="#5867B8"]; Kukua [label="Kukuā", fillcolor="#56617A"];
    Sita -- Rama [label="marriage; trial; banishment"]; Sita -- Urmila [label="sisters"]; Sita -- Earth [label="birth and return"];
    Sita -- Ravana [label="captivity; refusal"]; Sita -- Sur [label="mirror: chaste/'loose' (Erndl)"];
    Sita -- Ahalya [label="tested women (Pudumaippittan, Volga)"]; Sita -- Mand [label="daughter? (Adbhuta, Jain)"];
    Sita -- Trij [label="companions in Laṅkā"]; Sita -- Kaus [label="mother-in-law"]; Sita -- Kukua [label="the portrait (Candrābatī)"];
    Sita -- Ren [label="Volga: 'Music of the Earth'"]; Urmila -- Lak [label="sleep; consent"]; Rama -- Shab [label="the tasted berries"];
    Rama -- Ahalya [label="'deliverance'"]; Lak -- Sur [label="mutilation (3.17.21)"]; Kaik -- Manth [label="nurse; counsel"];
    Kaik -- Rama [label="the boons; exile"]; Kaus -- Rama; Ravana -- Mand; Ravana -- Sur [label="brother"]; Tara -- Rama [label="Vālin's death"];
    Shanta -- Rama [label="sister given away"]; }'''
    dot("fig_6_1_character_map.png", src)

def fig_urmila_line():
    ev = [(1900, "Tagore, 'Kabye Upekshita'", "Bengali essay"), (1908, "Dwivedi, Saraswati", "Hindi essay"),
          (1931, "Gupt, Saket", "Hindi epic"), (1955, "Warerkar, Bhoomikanya Sita", "Marathi play"),
          (1961, "Sreekantan Nair, Kanchana Sita", "Malayalam play"), (2006, "V.N. Rao, 'Urmila's Separation'", "Telugu song (tr.)"),
          (2014, "Kane, Sita's Sister", "English novel"), (2016, "Saket, Urmila", "English novel"),
          (2022, "Samar, Urmila", "Marathi novel"), (2023, "Adishakti, Urmila", "Malayalam/English play")]
    fig, ax = plt.subplots(figsize=(7.6, 3.2)); ax.set_xlim(1890, 2032); ax.set_ylim(-1.7, 1.7); ax.axis("off")
    ax.plot([1893, 2028], [0, 0], color=C["turmeric"], lw=3)
    for i, (y, t, f) in enumerate(ev):
        up = 1 if i % 2 == 0 else -1
        ax.scatter(y, 0, s=50, color=C["sindoor"], zorder=3)
        ax.plot([y, y], [0, 0.4 * up], color=C["grey"], lw=0.8)
        ax.text(y, 0.48 * up, f"{y}\n{t}\n({f})", ha="center", va="bottom" if up > 0 else "top", fontsize=6.4)
    ax.text(1893, 0.15, "oral songs: undated, older", fontsize=6.5, color=C["slate"], style="italic")
    ax.set_title("Ūrmilā's long line: one 'neglected' woman across six languages", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_6_2_urmila_line.png")

def fig_ahalya():
    rows = [("Vālmīki 1.47–48", "consents 'out of curiosity'", "invisible, lives on air", "honoured by gods; reunited"),
            ("Kamban; Tulsī", "deceived", "turned to stone", "touched by Rāma's foot"),
            ("Pudumaippittan 1943", "deceived", "stone", "chooses stone again after hearing of Sītā's ordeal"),
            ("Volga 2016", "deceived", "—", "counsels Sītā on judgement and truth"),
            ("Pratibha Ray 1998", "seeker of love", "—", "desire as quest"),
            ("Kane 2019; Dasgupta 2020", "scholar; desiring subject", "—", "intellect, pleasure, choice"),
            ("Sujoy Ghosh film 2015", "the wife as lure", "the intruder becomes a figurine", "curse reversed")]
    fig, ax = plt.subplots(figsize=(7.6, 3.8)); ax.axis("off")
    tbl = ax.table(cellText=[r[1:] for r in rows], rowLabels=[r[0] for r in rows],
                   colLabels=["Her role in the act", "Punishment", "Resolution"], loc="center", cellLoc="left", rowLoc="left")
    tbl.auto_set_font_size(False); tbl.set_fontsize(7.4); tbl.scale(1, 1.55)
    for (r, c), cell in tbl.get_celld().items():
        cell.set_edgecolor(C["pale"])
        if r == 0: cell.set_facecolor(C["indigo"]); cell.get_text().set_color("white")
        elif c == -1: cell.set_facecolor(C["pale"])
    ax.set_title("Ahalyā across tellings: from invisibility to stone to choice", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_6_3_ahalya.png")

def fig_devsen_typology():
    fig, ax = plt.subplots(figsize=(6.8, 5.0)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    ax.plot([0.5, 0.5], [0.08, 0.9], color=C["grey"], lw=1); ax.plot([0.06, 0.94], [0.5, 0.5], color=C["grey"], lw=1)
    ax.text(0.5, 0.94, "reproduces the canon's frame", ha="center", fontsize=8, color=C["slate"])
    ax.text(0.5, 0.03, "breaks the canon's frame", ha="center", fontsize=8, color=C["slate"])
    ax.text(0.02, 0.5, "male\neyes", ha="left", va="center", fontsize=8, color=C["slate"])
    ax.text(0.98, 0.5, "women's\neyes", ha="right", va="center", fontsize=8, color=C["slate"])
    box(ax, 0.27, 0.72, 0.36, 0.22, "1. Borrowed male eyes\nMollā (16th c., Telugu)", C["indigo"], fs=8.6)
    box(ax, 0.73, 0.72, 0.36, 0.22, "4. One's own story through Sītā's\nvillage women's songs", C["leaf"], fs=8.6)
    box(ax, 0.27, 0.28, 0.36, 0.22, "3. Borrowed ideological lens\nRanganayakamma (Marxist)", C["slate"], fs=8.6)
    box(ax, 0.73, 0.28, 0.36, 0.22, "2. Women's own eyes\nCandrābatī (16th c., Bengali)", C["sindoor"], fs=8.6)
    ax.set_title("Nabaneeta Dev Sen's four ways women retell (Manushi 108, p. 18), arranged as a field", loc="left", fontsize=9.5, fontweight="bold")
    save(fig, "fig_7_1_devsen_typology.png")

def fig_volga_structure():
    fig, ax = plt.subplots(figsize=(6.6, 5.4)); ax.set_xlim(-1.6, 1.6); ax.set_ylim(-1.4, 1.5); ax.axis("off"); ax.set_aspect("equal")
    ax.add_patch(Circle((0, 0), 0.38, color=C["sindoor"])); ax.text(0, 0, "Sītā", ha="center", va="center", color="white", fontsize=12, fontweight="bold")
    items = [("Śūrpaṇakhā", "the garden:\nbeauty after mutilation"), ("Reṇukā", "motherhood\nquestioned"),
             ("Ūrmilā", "solitude chosen;\n'free yourself'"), ("Ahalyā", "on judgement\nand truth"),
             ("Rāma", "the king, too,\nbound by role")]
    for i, (n, t) in enumerate(items):
        a = math.pi / 2 + i * 2 * math.pi / 5
        x, y = 1.1 * math.cos(a), 1.1 * math.sin(a)
        ax.add_patch(Circle((x, y), 0.27, color=C["indigo"] if n == "Rāma" else C["turmeric"]))
        ax.text(x, y, n, ha="center", va="center", fontsize=8.5, color="white" if n == "Rāma" else C["ink"], fontweight="bold")
        ax.text(x * 1.42, y * 1.32 - 0.05, t, ha="center", va="center", fontsize=6.8)
        arrow(ax, x * 0.72, y * 0.72, x * 0.4, y * 0.4, color=C["slate"])
    ax.set_title("The Liberation of Sita: liberation as a sequence of encounters (themes paraphrased)", loc="left", fontsize=9, fontweight="bold")
    save(fig, "fig_8_1_volga_structure.png")

def fig_voice_heatmap():
    texts = ["Vālmīki", "Tulsīdās", "Candrābatī", "Kumaran Asan 1919", "Chalam 1924", "Saket 1931", "Ranganayakamma 1975",
             "M. Sengupta 1996", "Sarah Joseph 2005", "Volga 2016", "Arni, Missing Queen 2013", "Divakaruni 2019",
             "Amish 2017", "Bhyrappa 2017", "Majmudar 2019", "Anamika 2023"]
    cols = ["Omniscient\nnarrator", "Sītā first\nperson", "Other women\nnarrate", "Author\nargues openly", "Many\nvoices", "Sītā's interior\nmonologue"]
    M = np.array([[2, 0, 0, 0, 1, 1], [2, 0, 0, 1, 0, 0], [1, 0, 0, 2, 0, 1], [0, 0, 0, 0, 0, 2], [0, 1, 0, 1, 1, 1], [2, 0, 1, 0, 1, 1],
                  [1, 0, 0, 2, 0, 0], [0, 2, 1, 0, 0, 2], [1, 1, 2, 0, 2, 1], [2, 0, 1, 1, 1, 1], [1, 0, 2, 1, 1, 0], [0, 2, 0, 0, 0, 2],
                  [2, 0, 0, 0, 0, 1], [0, 2, 0, 1, 0, 2], [0, 1, 0, 0, 2, 0], [1, 1, 1, 1, 1, 1]])
    fig, ax = plt.subplots(figsize=(7.4, 6.2))
    from matplotlib.colors import ListedColormap
    ax.imshow(M, cmap=ListedColormap([C["pale"], "#C3CCF0", C["sindoor"]]), aspect="auto")
    ax.set_xticks(range(len(cols))); ax.set_xticklabels(cols, fontsize=7.4); ax.xaxis.tick_top()
    ax.set_yticks(range(len(texts))); ax.set_yticklabels(texts, fontsize=7.6)
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(length=0)
    ax.set_xlabel("pale = absent; light = secondary; deep = dominant mode (author's coding)", fontsize=7.4)
    save(fig, "fig_11_1_narrative_voice.png")

def fig_first_person():
    """Computed from the corpus: primary works whose 'Distinctive characterisation' says a woman of the epic narrates."""
    import re
    recs = [r for r in corpus() if r["Category"] == "Primary"]
    pat = re.compile(r"first person|narrat|monologue|in her own (voice|words)|tells the|speaks in her own|in Sita's voice|letters? (in which|written)", re.I)
    dec = collections.Counter()
    for r in recs:
        try: y = int(float(r["Sort year"]))
        except Exception: continue
        if y < 1800: continue
        if (pat.search(r["Distinctive characterisation"]) or pat.search(r.get("Told through", "")) or re.search(r"^(Sita|Urmila|Kaikeyi|Ahalya|Surpanakha|Mandodari|Tara|Shabari|Manthara|Shanta)\b", r.get("Told through", ""))) and not r["Form"].startswith("Essay"):
            dec[(y // 10) * 10] += 1
    xs = list(range(1860, 2030, 10))
    vals = [dec.get(x, 0) for x in xs]
    fig, ax = plt.subplots(figsize=(7.2, 3.2))
    ax.bar([f"{x}s" for x in xs], vals, color=[C["sindoor"] if x >= 2010 else C["turmeric"] for x in xs])
    for i, v in enumerate(vals):
        if v: ax.text(i, v + 0.2, v, ha="center", fontsize=8)
    plt.xticks(rotation=45, fontsize=7.5)
    ax.set_ylabel("primary works")
    ax.set_title("Women of the epic as narrators: corpus works by decade", loc="left", fontsize=9.5, fontweight="bold")
    ax.text(0.01, 0.97, "Count over the workbook's 'Distinctive characterisation' and 'Told through' fields:\na woman of the epic narrates, speaks in monologue or is the focal voice. 2020s = 2020-26.",
            transform=ax.transAxes, fontsize=6.8, color=C["slate"], va="top")
    save(fig, "fig_11_2_first_person.png")
    return dict(zip(xs, vals))

def fig_agency_matrix():
    texts = ["Vālmīki (Uttara)", "Candrābatī", "Assamese Uttarakāṇḍa", "Kumaran Asan", "Chalam", "Saapa Vimochanam", "Kanchana Sita (film)",
             "Ranganayakamma", "M. Sengupta, Sitayan", "Sarah Joseph", "Kandasamy", "Volga, Liberation", "Volga, Pampa", "Arni, Missing Queen",
             "Kane, Sita's Sister", "Amish, Sita", "Divakaruni", "Bhumika", "Patel, Kaikeyi", "Anamika, Sita's Veil"]
    cols = ["Narrative", "Political", "Sexual", "Caste & class", "Ecological"]
    # 3 strong, 2 partial, 1 absent ; author's coding
    M = np.array([[2, 1, 1, 1, 2], [3, 1, 1, 1, 2], [3, 2, 1, 1, 2], [3, 1, 1, 1, 2], [3, 1, 3, 1, 1], [2, 1, 2, 1, 1], [1, 2, 1, 3, 3],
                  [2, 2, 2, 3, 1], [3, 2, 2, 3, 2], [3, 2, 2, 2, 2], [3, 2, 3, 3, 1], [3, 2, 2, 1, 3], [3, 2, 1, 3, 3], [2, 3, 1, 2, 1],
                  [3, 2, 1, 1, 1], [2, 3, 1, 1, 1], [3, 1, 2, 1, 2], [3, 2, 2, 1, 2], [3, 3, 1, 1, 1], [3, 2, 2, 2, 2]])
    from matplotlib.colors import ListedColormap
    fig, ax = plt.subplots(figsize=(6.4, 7.0))
    ax.imshow(M, cmap=ListedColormap([C["pale"], "#C3CCF0", C["sindoor"]]), aspect="auto", vmin=1, vmax=3)
    ax.set_xticks(range(len(cols))); ax.set_xticklabels(cols, fontsize=8.4); ax.xaxis.tick_top()
    ax.set_yticks(range(len(texts))); ax.set_yticklabels(texts, fontsize=7.8)
    lab = {1: "absent", 2: "partial", 3: "strong"}
    for i in range(M.shape[0]):
        for j in range(M.shape[1]):
            ax.text(j, i, lab[M[i, j]], ha="center", va="center", fontsize=6.4, color="white" if M[i, j] == 3 else C["ink"])
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(length=0)
    ax.set_xlabel("Five kinds of agency, coded by the author on the corpus workbook's scheme", fontsize=7.4)
    save(fig, "fig_12_1_agency_matrix.png")

def fig_bargain():
    fig, ax = plt.subplots(figsize=(7.2, 4.4)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.5, 0.5, 0.26, 0.15, "The patriarchal\nhousehold\n(kula, rājya)", C["ink"], fs=9)
    items = [(0.15, 0.85, "Kaikeyī", "secures son's succession\nthrough the boons"), (0.85, 0.85, "Mantharā", "servant's leverage:\ncounsel and memory"),
             (0.15, 0.15, "Kausalyā", "senior wife's security\nthrough the son's virtue"), (0.85, 0.15, "Mandodarī", "queen's counsel;\nlater marries Vibhīṣaṇa"),
             (0.5, 0.9, "Tārā", "after Vālin's death,\nqueen to Sugrīva")]
    for x, y, n, t in items:
        box(ax, x, y, 0.22, 0.13, f"{n}\n{t}", C["turmeric"], color=C["ink"], fs=7.6)
        arrow(ax, x + (0.5 - x) * 0.25, y + (0.5 - y) * 0.25, x + (0.5 - x) * 0.62, y + (0.5 - y) * 0.62, color=C["slate"])
    ax.text(0.5, 0.29, "Kandiyoti (1988): women 'strategize within a set of concrete constraints';\nolder women gain power by enforcing the rules that bound them.",
            ha="center", fontsize=7.6, style="italic", color=C["slate"])
    save(fig, "fig_12_2_patriarchal_bargain.png")

def fig_vocabulary():
    stages = [("Idealisation", "virtue, fidelity, sacrifice", ["Vidyasagar 1860", "Vivekananda 1900", "Saket 1931", "Ram Rajya 1943", "Sagar 1987"]),
              ("Psychologisation", "interior life, emotion, memory", ["Asan 1919", "Tapaswini c.1912", "Toru Dutt 1882", "Divakaruni 2019"]),
              ("Politicisation", "authority, legitimacy, dissent", ["Chalam 1924", "Periyar 1959", "Ranganayakamma 1975", "Arni 2013", "Amish 2017"]),
              ("Feminist reconstruction", "agency, solidarity, sexuality", ["Dev Sen 1998", "Sarah Joseph 2005", "Kandasamy 2010", "Volga 2016"]),
              ("Contemporary contestation", "caste, ecology, identity, plurality", ["Kanchana Sita 1977", "Bansode 1980s", "Volga 2025", "Anamika 2023"])]
    fig, ax = plt.subplots(figsize=(8.6, 5.0)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    cols = [C["earth"], C["teal"], C["indigo"], C["sindoor"], C["leaf"]]
    for i, (s, d, ex) in enumerate(stages):
        x = 0.1 + i * 0.2
        box(ax, x, 0.82, 0.185, 0.12, s.replace(" ", "\n", 1) if len(s) > 14 else s, cols[i], fs=7.6, bold=True)
        ax.text(x, 0.69, d.replace(", ", ",\n", 1), ha="center", fontsize=6.8, style="italic")
        for k, e in enumerate(ex):
            box(ax, x, 0.56 - k * 0.09, 0.17, 0.07, e, C["pale"], ec=cols[i], color=C["ink"], fs=6.8)
    ax.annotate("", xy=(0.98, 0.94), xytext=(0.02, 0.94), arrowprops=dict(arrowstyle="-|>", color=C["grey"]))
    ax.text(0.5, 0.965, "provisional analytical categories — overlapping, not chronological stages", ha="center", fontsize=7.4, color=C["slate"])
    ax.text(0.5, 0.04, "Note the dates: 'psychological' Sitas precede 'idealised' ones; 'contemporary' concerns appear in 1977.", ha="center", fontsize=7.4, color=C["slate"], style="italic")
    save(fig, "fig_14_1_vocabulary.png")

def fig_screen():
    ev = [(1917, "Lanka Dahan", "male actor plays Sītā"), (1934, "Seeta (Debaki Bose)", "Uttara Kāṇḍa; Venice"),
          (1943, "Ram Rajya", "the calendar Sītā"), (1961, "Sampoorna Ramayana", "mythological"), (1977, "Kanchana Sita", "Sītā as nature"),
          (1987, "Ramayan (Sagar)", "Doordarshan"), (2001, "Lajja", "Janki refuses"), (2008, "Sita Sings the Blues", "jazz, divorce"),
          (2010, "Raavan / Raavanan", "lie-detector 'ordeal'"), (2015, "Siya Ke Ram", "'Sītā's perspective'"),
          (2023, "Adipurush", "spectacle; outrage"), (2026, "Ramayana Part One", "warrior debate")]
    fig, ax = plt.subplots(figsize=(7.6, 3.4)); ax.set_xlim(1910, 2034); ax.set_ylim(-1.8, 1.8); ax.axis("off")
    ax.plot([1912, 2030], [0, 0], color=C["ink"], lw=1.2)
    for i, (y, t, d) in enumerate(ev):
        up = 1 if i % 2 == 0 else -1
        ax.scatter(y, 0, s=45, color=C["indigo"], zorder=3)
        ax.plot([y, y], [0, 0.4 * up], color=C["grey"], lw=0.8)
        ax.text(y, 0.47 * up, f"{y}\n{t}\n{d}", ha="center", va="bottom" if up > 0 else "top", fontsize=6.4)
    ax.set_title("Sītā on screen, 1917–2026", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_15_1_screen.png")

def fig_agency_spectrum():
    fig, ax = plt.subplots(figsize=(7.6, 3.6)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    from matplotlib.colors import LinearSegmentedColormap
    grad = np.linspace(0, 1, 256).reshape(1, -1)
    ax.imshow(grad, extent=[0.04, 0.96, 0.46, 0.56], cmap=LinearSegmentedColormap.from_list("g", [C["indigo"], C["turmeric"], C["sindoor"]]), aspect="auto")
    for x, t in [(0.08, "piety as agency\n(Mahmood)"), (0.36, "negotiation within\nconstraint (Kandiyoti)"), (0.64, "refusal\n(withdrawal, silence, earth)"), (0.92, "resistance /\nrevolt")]:
        ax.text(x, 0.62, t, ha="center", fontsize=7.8, fontweight="bold")
    pts = [(0.1, "Sita Puni Boli;\nUntold Story"), (0.24, "Tulsī;\nSaket"), (0.38, "Kishwar's\ninterviewees"), (0.47, "Candrābatī"),
           (0.6, "Vālmīki 7.88"), (0.68, "Saapa\nVimochanam"), (0.75, "Assamese Sītā\n('Yamkal')"), (0.82, "Volga"),
           (0.9, "Chalam;\nKandasamy")]
    for x, t in pts:
        ax.plot([x, x], [0.44, 0.38], color=C["ink"], lw=0.8)
        ax.text(x, 0.36, t, ha="center", va="top", fontsize=6.6)
    ax.text(0.5, 0.06, "Liberal individualism reads only the right-hand end as agency; this book reads the whole bar.", ha="center", fontsize=7.6, style="italic", color=C["slate"])
    ax.set_title("A spectrum of agency, with texts placed by the author", loc="left", fontsize=10.5, fontweight="bold")
    save(fig, "fig_c_1_agency_spectrum.png")

def fig_voice_need():
    pts = [("Vālmīki", 0.62, 0.35), ("Tulsīdās", 0.25, 0.55), ("Candrābatī", 0.72, 0.25), ("Women's songs", 0.68, 0.12),
           ("Vidyasagar 1860", 0.35, 0.7), ("Vivekananda", 0.15, 0.85), ("Saket", 0.3, 0.8), ("Kumaran Asan", 0.84, 0.3),
           ("Chalam", 0.8, 0.75), ("Periyar", 0.12, 0.92), ("Ranganayakamma", 0.45, 0.9), ("Sagar TV", 0.2, 0.78),
           ("Volga", 0.85, 0.62), ("Kandasamy", 0.8, 0.8), ("Amish", 0.6, 0.72), ("Divakaruni", 0.9, 0.38),
           ("Arni", 0.55, 0.66), ("Anamika", 0.83, 0.56), ("Assamese Uttarakāṇḍa", 0.78, 0.2), ("Bhyrappa", 0.7, 0.6)]
    fig, ax = plt.subplots(figsize=(6.8, 5.6))
    ax.axvline(0.5, color=C["pale"]); ax.axhline(0.5, color=C["pale"])
    for n, x, y in pts:
        ax.scatter(x, y, s=48, color=C["sindoor"] if x > 0.5 else C["indigo"], edgecolor="white", zorder=3)
        ax.text(x + 0.015, y + 0.012, n, fontsize=7.2)
    ax.set_xlim(0, 1.1); ax.set_ylim(0, 1.12)
    ax.set_xlabel("How far Sītā speaks and judges in her own right →")
    ax.set_ylabel("How far the telling serves an external programme →")
    for (x, y, t) in [(0.03, 1.1, "Instrumental Sītā"), (0.58, 1.1, "Programmatic voice"), (0.03, 0.02, "Iconic Sītā"), (0.58, 0.02, "Sovereign Sītā")]:
        ax.text(x, y, t, fontsize=8.5, fontweight="bold", color=C["slate"], va="top" if y > 0.5 else "bottom")
    ax.set_title("Voice against need: an interpretive plot (author's placements)", loc="left", fontsize=10, fontweight="bold")
    save(fig, "fig_c_2_voice_need.png")

def fig_rege_layers():
    fig, ax = plt.subplots(figsize=(6.4, 5.2)); ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.2, 1.3); ax.axis("off"); ax.set_aspect("equal")
    layers = [(1.15, C["pale"], "Women outside the epic's speech: Śabarī, Śambūka's kin, Dalit labourers (Sannathimmi)"),
              (0.85, "#C3CCF0", "Women of the epic's margins: Śūrpaṇakhā, Mantharā, Tāṭakā, Ahalyā"),
              (0.55, C["turmeric"], "Royal women: Kaikeyī, Kausalyā, Mandodarī, Ūrmilā"),
              (0.28, C["sindoor"], "Sītā")]
    for r, col, t in layers:
        ax.add_patch(Circle((0, 0), r, color=col, ec="white", lw=2))
    ax.text(0, 0, "Sītā", ha="center", va="center", color="white", fontsize=10, fontweight="bold")
    for r, col, t in layers[:3]:
        ax.text(0, r - 0.13, textwrap.fill(t, 46), ha="center", va="center", fontsize=6.8)
    ax.text(0, -1.17, "Sharmila Rege's question: whose Sītā is universalised as 'Indian woman'?", ha="center", fontsize=7.8, style="italic")
    save(fig, "fig_10_1_rege_layers.png")

def fig_surpanakha():
    pts = [(0.05, "Vālmīki 3.16–17", "lustful rākṣasī"), (0.18, "Kamban", "beautiful seducer, then fury"), (0.3, "Tulsī", "'deceitful' woman"),
           (0.42, "Gupt, Panchavati 1925", "the tempting stranger"), (0.55, "Kavanasarma", "sorrow"), (0.66, "Kane, Lanka's Princess 2016", "unwanted daughter"),
           (0.78, "Volga 2016", "gardener; teacher of beauty"), (0.9, "Kandasamy, 'Traitress'", "anti-caste avenger")]
    fig, ax = plt.subplots(figsize=(7.6, 2.8)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    from matplotlib.colors import LinearSegmentedColormap
    ax.imshow(np.linspace(0, 1, 256).reshape(1, -1), extent=[0.02, 0.98, 0.5, 0.58], aspect="auto",
              cmap=LinearSegmentedColormap.from_list("s", [C["slate"], C["turmeric"], C["sindoor"]]))
    ax.text(0.02, 0.65, "villainess", fontsize=8, fontweight="bold"); ax.text(0.5, 0.65, "victim", fontsize=8, fontweight="bold", ha="center")
    ax.text(0.98, 0.65, "agent", fontsize=8, fontweight="bold", ha="right")
    for x, t, d in pts:
        ax.plot([x, x], [0.48, 0.4], color=C["ink"], lw=0.8)
        ax.text(x, 0.37, f"{t}\n{d}", ha="center", va="top", fontsize=6.3)
    ax.set_title("Śūrpaṇakhā: from villainess to victim to agent (cf. Sohini Pillai)", loc="left", fontsize=10, fontweight="bold")
    save(fig, "fig_10_2_surpanakha.png")

def fig_missing_queen():
    fig, ax = plt.subplots(figsize=(7.2, 3.6)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    box(ax, 0.5, 0.85, 0.3, 0.12, "The question:\n'Where is Sita?'", C["sindoor"], fs=9, bold=True)
    for x, t in [(0.15, "The journalist\n(a woman asks)"), (0.38, "Prosperous Ayodhya:\nmedia, markets"), (0.62, "'The Washerman':\nsecret police"), (0.85, "Ruined Lanka:\nthe war's other side")]:
        box(ax, x, 0.5, 0.2, 0.16, t, C["indigo"], fs=7.8)
        arrow(ax, 0.5, 0.78, x, 0.59, color=C["grey"])
    box(ax, 0.5, 0.15, 0.84, 0.12, "The dhobi of Uttara Kāṇḍa 7.42–43 is institutionalised: public opinion becomes an apparatus of the state.", C["ink"], fs=7.8)
    save(fig, "fig_13_1_missing_queen.png")

def fig_sitayan_titles():
    rows = [("Sitayana: Epic of the Earth-born", "K.R. Srinivasa Iyengar", "c. 1987", "English", "poet/narrator", "earth; devotional"),
            ("Sitayan", "Mallika Sengupta", "1996", "Bengali", "Sītā, first person", "departs in a mysterious chariot"),
            ("Sitayana", "Amit Majmudar", "2019", "English", "many voices", "Sītā's resistance at the core"),
            ("The Forest of Enchantments ('my Sitayan')", "Chitra Banerjee Divakaruni", "2019", "English", "Sītā, first person", "earth; her own choice"),
            ("Trin Dhari Ot / Sita's Veil ('a Sitayan')", "Anamika", "2023 / 2025", "Hindi", "Sītā", "scholar, single mother; letter to Śūrpaṇakhā"),
            ("Chandrabati's Rāmāyaṇa ('a Sitayan' — critics)", "Candrābatī", "16th c.", "Bengali", "poet to women listeners", "lament; earth")]
    fig, ax = plt.subplots(figsize=(7.8, 3.0)); ax.axis("off")
    tbl = ax.table(cellText=[r[1:] for r in rows], rowLabels=[r[0] for r in rows],
                   colLabels=["Author", "Year", "Language", "Narrator", "Ending / emphasis"], loc="center", cellLoc="left", rowLoc="left")
    tbl.auto_set_font_size(False); tbl.set_fontsize(6.8); tbl.scale(1, 1.6)
    for (r, c), cell in tbl.get_celld().items():
        cell.set_edgecolor(C["pale"])
        if r == 0: cell.set_facecolor(C["sindoor"]); cell.get_text().set_color("white")
        elif c == -1: cell.set_facecolor(C["pale"])
    ax.set_title("Who may call a book a 'Sitayan'?", loc="left", fontsize=10, fontweight="bold")
    save(fig, "fig_7_2_sitayan_titles.png")

def fig_interior_turn():
    rows = [("Tapaswini (Meher)", "c. 1912–15", "Odia", "after banishment", "narrator; Sītā's grief", "ascetic strength; reunion of sons"),
            ("Chintavishtayaya Sita (Asan)", "1919", "Malayalam", "after sons leave for court", "Sītā's reverie", "judgement of Rāma; dignified death"),
            ("Ramayana Darshanam (Kuvempu)", "1949–57", "Kannada", "whole epic", "epic narrator", "Rāma enters the fire with her"),
            ("Kanchana Sita (Nair)", "1961", "Malayalam", "Uttara Kāṇḍa", "Rāma and others", "Sītā absent; present as nature")]
    fig, ax = plt.subplots(figsize=(7.8, 2.4)); ax.axis("off")
    tbl = ax.table(cellText=[r[1:] for r in rows], rowLabels=[r[0] for r in rows],
                   colLabels=["Date", "Language", "Where it begins", "Whose consciousness", "Ending"], loc="center", cellLoc="left", rowLoc="left")
    tbl.auto_set_font_size(False); tbl.set_fontsize(6.8); tbl.scale(1, 1.7)
    for (r, c), cell in tbl.get_celld().items():
        cell.set_edgecolor(C["pale"])
        if r == 0: cell.set_facecolor(C["teal"]); cell.get_text().set_color("white")
        elif c == -1: cell.set_facecolor(C["pale"])
    ax.set_title("The interior turn: four early twentieth-century reconstructions", loc="left", fontsize=10, fontweight="bold")
    save(fig, "fig_4_1_interior_turn.png")

def fig_joseph_voices():
    fig, ax = plt.subplots(figsize=(7.0, 3.4)); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    for i, w in enumerate(["Mantharā", "Sītā", "Śūrpaṇakhā"]):
        x = 0.2 + i * 0.3
        box(ax, x, 0.75, 0.22, 0.13, w, C["sindoor"] if w == "Sītā" else C["turmeric"], color="white" if w == "Sītā" else C["ink"], fs=9.5, bold=True)
    for i, t in enumerate(["'Black Holes'\n(Mantharā's side)", "'Asoka'", "'Mother Clan'", "'What is Not\nin the Story'"]):
        x = 0.13 + i * 0.25
        box(ax, x, 0.42, 0.21, 0.16, t, C["pale"], ec=C["turmeric"], color=C["ink"], fs=7.6)
    for i in range(3):
        for j in range(4):
            ax.plot([0.2 + i * 0.3, 0.13 + j * 0.25], [0.68, 0.5], color=C["pale"], lw=0.8, zorder=0)
    ax.text(0.5, 0.12, "Sarah Joseph's method: the monologue as counter-memory (stories 1990s–2000s; tr. in Retelling the Ramayana, OUP 2005)", ha="center", fontsize=7.6, style="italic", color=C["slate"])
    save(fig, "fig_9_1_joseph_voices.png")

if __name__ == "__main__":
    for f in [fig_period, fig_language, fig_women, fig_retellings_timeline, fig_central_tension, fig_genealogy, fig_agni,
              fig_valmiki_speech, fig_endings, fig_shadow, fig_map, fig_devsen_cycle, fig_home_world, fig_two_victims, fig_reversal,
              fig_censorship, fig_character_map, fig_urmila_line, fig_ahalya, fig_devsen_typology, fig_volga_structure,
              fig_voice_heatmap, fig_first_person, fig_agency_matrix, fig_bargain, fig_vocabulary, fig_screen, fig_agency_spectrum,
              fig_voice_need, fig_rege_layers, fig_surpanakha, fig_missing_queen, fig_sitayan_titles, fig_interior_turn, fig_joseph_voices]:
        f()
