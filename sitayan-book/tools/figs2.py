#!/usr/bin/env python3
"""First-principles diagrams for The Many Lives of Sita (consulting style).

Design rules: an action title that states the point; at most one accent colour per figure; pale fills,
thin rules, thin arrows; no data plotting; a small source line. Palette from the author's stylesheet.
Run: python3 tools/figs2.py   ->  figures/d_*.png
"""
import os, textwrap
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyArrowPatch, Polygon, Circle, Ellipse

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "figures"); os.makedirs(OUT, exist_ok=True)
INK, ACC, PALE, MUTED, LINE, COP, WHITE, SOFT = "#172033", "#2F43A8", "#EEF1F6", "#56617A", "#D8DEE9", "#A85A26", "#FFFFFF", "#E3E7FA"
plt.rcParams.update({"font.family": ["Liberation Sans", "DejaVu Sans"], "font.size": 9, "savefig.dpi": 230})

def canvas(title, sub=None, h=3.6, w=7.0):
    fig = plt.figure(figsize=(w, h)); ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")
    ax.add_patch(Rectangle((3, 95.2), 4, 1.1, color=ACC))
    tl = textwrap.wrap(title, 88)
    ax.text(3, 92.5, "\n".join(tl), fontsize=11.2, fontweight="bold", color=INK, va="top", ha="left", linespacing=1.15)
    if sub: ax.text(3, 85.5 - (len(tl) - 1) * 6.2 * 3.6 / h, sub, fontsize=8.4, color=MUTED, va="top")
    return fig, ax

def wrap(t, width):
    return "\n".join(textwrap.fill(p, width) for p in t.split("\n"))

def rect(ax, x, y, w, h, text="", kind="pale", fs=8.4, bold=False, align="center", wrapw=None):
    fc, ec, tc = {"pale": (PALE, PALE, INK), "accent": (ACC, ACC, WHITE), "outline": (WHITE, LINE, INK),
                  "ink": (INK, INK, WHITE), "soft": (SOFT, SOFT, INK), "copper": (WHITE, COP, INK), "none": ("none", "none", INK)}[kind]
    ax.add_patch(Rectangle((x, y), w, h, fc=fc, ec=ec, lw=0.8))
    if text:
        ww = wrapw or max(8, int(w * 1.12 * 8.4 / fs))
        tx = x + w / 2 if align == "center" else x + 1.2
        ax.text(tx, y + h / 2, wrap(text, ww), ha=align, va="center", fontsize=fs, color=tc, fontweight="bold" if bold else "normal", linespacing=1.25)

def arrow(ax, x1, y1, x2, y2, color=MUTED, lw=0.9, rad=0.0, style="-|>"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=9, color=color, lw=lw, connectionstyle=f"arc3,rad={rad}"))

def text(ax, x, y, t, fs=8.2, color=INK, ha="left", va="center", bold=False, italic=False, wrapw=None):
    ax.text(x, y, wrap(t, wrapw) if wrapw else t, fontsize=fs, color=color, ha=ha, va=va, fontweight="bold" if bold else "normal", style="italic" if italic else "normal", linespacing=1.25)

def rule(ax, x1, x2, y, color=LINE, lw=0.8):
    ax.plot([x1, x2], [y, y], color=color, lw=lw)

def source(ax, t):
    ax.text(3, 2.5, "Source: " + t, fontsize=6.8, color=MUTED, va="bottom")

def chevrons(ax, items, y=40, h=22, x0=3, x1=97, accent=None, fs=7.8):
    n = len(items); w = (x1 - x0) / n
    for i, (head, body) in enumerate(items):
        x = x0 + i * w; tip = 2.2
        pts = [(x, y), (x + w - tip, y), (x + w, y + h / 2), (x + w - tip, y + h), (x, y + h), (x + tip if i else x, y + h / 2)]
        col = ACC if accent == i else (INK if i == 0 and accent is None else PALE)
        ax.add_patch(Polygon(pts, closed=True, fc=col, ec=WHITE, lw=1.5))
        ax.text(x + w / 2, y + h / 2, wrap(head, int(w * 1.3)), ha="center", va="center", fontsize=fs, fontweight="bold", color=WHITE if col in (ACC, INK) else INK)
        if body: ax.text(x + w / 2, y - 2.5, wrap(body, int(w * 1.55)), ha="center", va="top", fontsize=7.4, color=INK, linespacing=1.25)

def matrix(ax, xlab, ylab, quads, x0=14, y0=10, w=80, h=64, hi=None, xlo="", xhi="", ylo="", yhi=""):
    hw, hh = w / 2, h / 2
    pos = [(x0, y0 + hh), (x0 + hw, y0 + hh), (x0, y0), (x0 + hw, y0)]  # TL, TR, BL, BR
    for i, ((px, py), (head, body)) in enumerate(zip(pos, quads)):
        kind = "accent" if hi == i else "pale"
        ax.add_patch(Rectangle((px + 0.6, py + 0.6), hw - 1.2, hh - 1.2, fc=ACC if kind == "accent" else PALE, ec="none"))
        tc = WHITE if kind == "accent" else INK
        ax.text(px + 2.2, py + hh - 3, head, fontsize=8.8, fontweight="bold", color=tc, va="top")
        ax.text(px + 2.2, py + hh - 9.5, wrap(body, int(hw * 1.35)), fontsize=7.6, color=tc, va="top", linespacing=1.25)
    ax.text(x0 + w / 2, y0 - 4.5, xlab, ha="center", fontsize=8, color=MUTED)
    ax.text(x0 - 6.5, y0 + h / 2, ylab, ha="center", va="center", rotation=90, fontsize=8, color=MUTED)
    for t, xx, ha in ((xlo, x0, "left"), (xhi, x0 + w, "right")):
        if t: ax.text(xx, y0 - 1.5, t, ha=ha, va="top", fontsize=7, color=MUTED)
    for t, yy, va in ((ylo, y0, "bottom"), (yhi, y0 + h, "top")):
        if t: ax.text(x0 - 1.5, yy, t, ha="right", va=va, fontsize=7, color=MUTED, rotation=90)

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), facecolor="white"); plt.close(fig); print("wrote", name)

# ------------------------------------------------------------------ Introduction
def d_two_histories():
    f, a = canvas("The history of Sita's 'voice' is repeatedly a history of someone's need, presented as hers",
                  "Two ways to read 150 years of retellings, and the constant beneath both")
    rect(a, 3, 44, 42, 26, "History of speech\nWhat women could say through Sita: interiority, judgement, desire, choice", "pale", fs=8.4)
    rect(a, 55, 44, 42, 26, "History of need\nWhat each society needed Sita to say: reform, nation, reason, class, market, heritage", "pale", fs=8.4)
    arrow(a, 45.5, 57, 54.5, 57, color=COP); arrow(a, 54.5, 53, 45.5, 53, color=COP)
    text(a, 50, 62, "passes itself off as", fs=7, color=COP, ha="center")
    rect(a, 3, 12, 94, 20, "Constant across the strongest tellings: refusal. The second ordeal declined, the court left, the earth chosen.", "accent", fs=9, bold=True)
    arrow(a, 24, 43.5, 30, 32.5); arrow(a, 76, 43.5, 70, 32.5)
    source(a, "author's argument; Vālmīki 7.88.9–13 (critical edition)")
    save(f, "d_0_1_two_histories.png")

def d_three_errors():
    f, a = canvas("The liberation narrative fails at its start, its middle and its end",
                  "Three errors that compound into mistaking the newest use of Sita for her emancipation")
    cols = [("1 · Textual", "Claim: the traditional Sita is silent.", "Evidence: Vālmīki's Sita argues (2.27.3), defies (3.54.1), rebukes (6.104.5), instructs the king (7.47.11)."),
            ("2 · Historical", "Claim: silence is ancient Brahmanical patriarchy.", "Evidence: the silent Sita is consolidated by devotion (the shadow) and by colonial reform, nationalism, print and film."),
            ("3 · Conceptual", "Claim: agency = voice = self-assertion.", "Evidence: Sita's agency is most often refusal and withdrawal; voice can be borrowed.")]
    for i, (h, c, e) in enumerate(cols):
        x = 3 + i * 32
        rect(a, x, 62, 30, 9, h, "ink" if i == 0 else "pale", fs=9, bold=True)
        rect(a, x, 44, 30, 16, c, "outline", fs=8)
        rect(a, x, 14, 30, 28, e, "soft", fs=7.8)
    source(a, "Introduction; critical-edition locators as given")
    save(f, "d_0_2_three_errors.png")

def d_evidence_levels():
    f, a = canvas("Four levels of evidence, each with a different job", "The book keeps them distinct in the argument and in the notes")
    levels = [("IV  Theory", "interrogates the texts (Spivak, Butler, Rege, Mahmood)"), ("III  Scholarship", "establishes what is known; argued with"),
              ("II  Intellectual & historical sources", "classical texts, prefaces, judgements, reception"), ("I  Primary literary texts", "the retellings themselves, by edition")]
    for i, (h, d) in enumerate(levels):
        w = 40 + i * 14; x = 50 - w / 2; y = 66 - i * 15
        rect(a, x, y, w, 12, h, "accent" if i == 3 else "pale", fs=8.6, bold=True)
        text(a, x + w + 2, y + 6, d, fs=7.4, color=MUTED, wrapw=26)
    source(a, "research plan, §2")
    save(f, "d_0_3_evidence_levels.png")

# ------------------------------------------------------------------ Chapter 1
def d_trial_procedure():
    f, a = canvas("Read as a trial, Book 6 ends with the judge confessing and the accused appealing over his head",
                  "The five stages of the scene before the fire, with critical-edition locators", h=3.5)
    chevrons(a, [("Charge", "Suspicion, not an act: 'your character has come under doubt' (6.103.17)"),
                 ("Defence", "Body was 'in another's control'; heart 'in mine' (6.104.8–9)"),
                 ("Appeal", "She calls for the pyre and names fire 'witness of the world' (6.104.18, 24)"),
                 ("Verdict", "Agni: 'no sin in her … I command you' (6.106.4–9)"),
                 ("Confession", "Rama: he knew; the ordeal was 'for the conviction of the worlds' (6.106.13–14)")], y=46, h=18, accent=4)
    source(a, "Vālmīki, Rāmāyaṇa, critical edition, 6.103–106 (translations the author's)")
    save(f, "d_1_1_trial_procedure.png")

def d_two_domains():
    f, a = canvas("Sita's defence rests on one distinction: what depends on her, and what does not",
                  "Vālmīki 6.104.8–9, the most precise statement of agency in the epic")
    rect(a, 3, 22, 45, 52, "", "pale")
    text(a, 6, 69, "parādhīna · 'dependent on another'", bold=True); text(a, 6, 62, "Her body in Laṅkā", color=MUTED)
    text(a, 6, 50, "'If I came into contact with another's body, I was helpless; it was not my will. Fate is at fault.'", wrapw=44, italic=True)
    text(a, 6, 31, "kāmakāro na me · not my choice", color=MUTED)
    rect(a, 52, 22, 45, 52, "", "accent")
    text(a, 55, 69, "madadhīna · 'dependent on me'", bold=True, color=WHITE); text(a, 55, 62, "Her heart", color=SOFT)
    text(a, 55, 50, "'That which is in my control, my heart, abides in you. What could I, powerless, do about my limbs?'", wrapw=44, italic=True, color=WHITE)
    text(a, 55, 31, "Fidelity is a property of the will", color=SOFT)
    source(a, "Vālmīki 6.104.8–9 (critical edition; author's translation)")
    save(f, "d_1_2_two_domains.png")

def d_precedent():
    f, a = canvas("The banishment is a ruling on precedent, not a finding of guilt",
                  "The citizens' argument at Vālmīki 7.42.19, reconstructed as a syllogism")
    steps = [("Premise 1", "The king's conduct sets the norm: 'as the king does, so the subjects follow.'"),
             ("Premise 2", "If the king keeps a wife who lived in another's house, we must tolerate it in our wives."),
             ("Conclusion", "To protect every household's norm, the king's household must expel her.")]
    for i, (h, t) in enumerate(steps):
        y = 60 - i * 19
        rect(a, 3, y, 18, 14, h, "accent" if i == 2 else "ink", fs=8.4, bold=True)
        rect(a, 22, y, 50, 14, t, "pale", fs=8.2, align="left", wrapw=58)
        if i < 2: arrow(a, 12, y - 0.5, 12, y - 4.5)
    rect(a, 75, 22, 22, 52, "Missing from the proceeding:\n\n· any finding of fact\n· a hearing (7.44.18 bars argument)\n· notice to the accused", "copper", fs=7.8, align="left", wrapw=24)
    source(a, "Vālmīki 7.42.17–19; 7.44.13–19 (critical edition)")
    save(f, "d_1_3_precedent.png")

def d_four_endings():
    f, a = canvas("The banishment is a choice some tellings make, not a fixed part of the story",
                  "Four ways early tellings end Sita's story")
    ends = [("Reunion", "Dasaratha Jātaka; Rāmopākhyāna; Bhavabhūti; Tulsīdās (no banishment)"),
            ("Earth", "Vālmīki 7.88; Kālidāsa; Candrābatī"),
            ("Renunciation", "Jain Paumacariya: Sita takes initiation as a nun"),
            ("Open rejection", "Assamese Uttarakāṇḍa: Sita names Rama 'death'")]
    for i, (h, t) in enumerate(ends):
        x = 3 + i * 24
        rect(a, x, 50, 22, 14, h, "accent" if i == 3 else "pale", fs=9.4, bold=True)
        rect(a, x, 18, 22, 30, t, "outline", fs=7.8)
    text(a, 3, 74, "Same heroine, same abduction:", color=MUTED)
    source(a, "texts as cited in Chapters 1–2")
    save(f, "d_1_4_four_endings.png")

# ------------------------------------------------------------------ Chapter 2
def d_grammar():
    f, a = canvas("The tradition is plural, but its plurality is stratified",
                  "Which variations of Sita the premodern record permits, and where")
    rings = [(40, PALE, "Freely varied", "birth (furrow, Mandodarī, lotus); Rama human or divine; Ravana demon or king"),
             (27, SOFT, "Register-bound", "Rama called 'sinner': in women's songs, not court Sanskrit"),
             (14, ACC, "Almost absent", "Sita taking a lover; Śabarī speaking at length")]
    for r, c, h, t in rings:
        a.add_patch(Ellipse((28, 42), r * 2 * 0.40, r * 2 * 0.775, fc=c, ec=WHITE, lw=2))
    for i, (r, c, h, t) in enumerate(rings):
        y = 72 - i * 20
        rect(a, 74, y - 7, 2, 12, "", "accent" if i == 2 else ("soft" if i == 1 else "pale"))
        text(a, 78, y + 3, h, bold=True); a.text(78, y - 1, wrap(t, 26), fontsize=7.2, color=MUTED, va="top")
    text(a, 28, 42, "almost\nabsent", fs=7.2, color=WHITE, ha="center")
    source(a, "author's synthesis of Ramanujan (1991) and Narayana Rao (2004)")
    save(f, "d_2_1_grammar.png")

def d_line_cycle():
    f, a = canvas("The male epic is a line; the women's Rāmāyaṇa is a round",
                  "What the bard sings and what the village woman sings (after Dev Sen)")
    a.plot([5, 45], [52, 52], color=INK, lw=1.4)
    for i, t in enumerate(["birth", "exile", "abduction", "war", "coronation"]):
        x = 5 + i * 10; a.add_patch(Circle((x, 52), 1.3, color=INK)); text(a, x, 45, t, fs=7.4, ha="center")
    text(a, 5, 66, "The professional bard sings of Ram", bold=True)
    import math
    items = ["foundling", "marriage", "in-laws", "blamed", "pregnant", "birth alone", "abandoned"]
    for i, t in enumerate(items):
        ang = math.pi / 2 - i * 2 * math.pi / len(items); x, y = 75 + 15 * math.cos(ang), 46 + 20 * math.sin(ang)
        a.add_patch(Circle((x, y), 1.4, color=ACC)); text(a, x, y - 5.5, t, fs=7.2, ha="center")
    text(a, 58, 80, "The village woman sings of Sita", bold=True)
    source(a, "Nabaneeta Dev Sen, Manushi 108 (1998), pp. 19–20")
    save(f, "d_2_2_line_cycle.png")

def d_choral():
    f, a = canvas("In the songs, the case against Rama is made by a chorus, not a soloist",
                  "Choral agency: the critique is distributed among those who share Sita's exile")
    rect(a, 40, 38, 20, 14, "Sita\nlaments", "accent", fs=9, bold=True)
    voices = [(8, 70, "The singer", "'Ram, you've lost your mind'"), (68, 70, "The trees", "plum and babul tree listen"),
              (8, 16, "Lakshmana", "refuses at first to abandon her"), (68, 16, "The women", "'Sita's exile, let us share it'")]
    for x, y, h, t in voices:
        rect(a, x, y, 24, 12, h + "\n" + t, "pale", fs=7.8)
        arrow(a, x + 12, y + (0 if y > 50 else 12), 50, 45 + (7 if y > 50 else -7), color=MUTED)
    source(a, "Dev Sen, Manushi 108, pp. 19–26; Kishwar, Manushi 98, p. 23")
    save(f, "d_2_3_choral.png")

def d_shadow():
    f, a = canvas("The shadow Sita protects her body by deleting her experience",
                  "The device of the Adhyātma Rāmāyaṇa and Tulsīdās, in four steps", h=3.3)
    chevrons(a, [("Before abduction", "Real Sita enters the fire"), ("Captivity", "A shadow is taken to Laṅkā"),
                 ("Ordeal", "Fire returns the real Sita"), ("Result", "Purity guaranteed; suffering made unreal; Rama unaccusable")], y=44, h=18, accent=3)
    source(a, "Adhyātma Rāmāyaṇa and Rāmcaritmānas, Araṇya book")
    save(f, "d_2_4_shadow.png")

# ------------------------------------------------------------------ Chapter 3
def d_tribunal():
    f, a = canvas("Colonial-era parties disagreed on Sita's value but agreed on her description",
                  "Why the 'traditional Sita' of modern critique is a nineteenth-century settlement")
    parties = [("Missionary", "deplores her: proof of degradation"), ("Reformer", "pities her: an education in sentiment"),
               ("Nationalist", "venerates her: the uncolonised inner home")]
    for i, (h, t) in enumerate(parties):
        x = 3 + i * 32; rect(a, x, 50, 30, 20, h + "\n" + t, "pale", fs=8.2)
        arrow(a, x + 15, 49.5, x + 15, 38.5)
    rect(a, 3, 22, 94, 15, "Shared description: silent, patient, chaste, self-sacrificing", "accent", fs=9.4, bold=True)
    text(a, 3, 13, "Modern liberation narratives inherit the description and reverse only the valuation.", fs=8, color=COP)
    source(a, "Mani (1987); Chatterjee (1989); Chapter 3")
    save(f, "d_3_1_tribunal.png")

def d_redirected():
    f, a = canvas("Nationalism kept Sita's refusal but changed its target",
                  "Outward at Laṅkā (the foreign abductor); never inward at Ayodhya (the king)")
    rect(a, 3, 36, 26, 24, "Laṅkā\nRavana", "ink", fs=9, bold=True)
    rect(a, 37, 36, 26, 24, "Sita", "accent", fs=10, bold=True)
    rect(a, 71, 36, 26, 24, "Ayodhya\nRama", "pale", fs=9, bold=True)
    arrow(a, 36.5, 48, 29.5, 48, color=ACC, lw=2)
    text(a, 33, 64, "refusal kept", fs=7.6, color=ACC, ha="center")
    a.plot([64, 70], [48, 48], color=MUTED, lw=1, ls=(0, (2, 2)))
    text(a, 67, 64, "refusal removed", fs=7.6, color=MUTED, ha="center")
    text(a, 3, 22, "Gandhi's satyagrahi Sita resists Ravana; the Sita who declines the king's second ordeal is not invoked.", fs=8, wrapw=100)
    source(a, "Chapter 3")
    save(f, "d_3_2_redirected.png")

# ------------------------------------------------------------------ Chapter 4
def d_interior():
    f, a = canvas("A Sita who thinks is not yet a Sita who is heard",
                  "Two separate questions: does she judge, and does the judgement reach its object?")
    matrix(a, "Is the judgement addressed to Rama?", "Does Sita form a judgement?",
           [("Thinks, unheard", "Kumaran Asan 1919: verdict reached alone on a riverbank, executed by leaving"),
            ("Thinks and is heard", "Vālmīki 6.104: the rebuke before the armies"),
            ("Neither", "The calendar Sita: devotion without judgement"),
            ("Addressed, not hers", "Anti-epic Sitas who voice the author's case (Ch. 5)")], hi=0,
           xlo="no", xhi="yes", ylo="no", yhi="yes")
    source(a, "Chapter 4")
    save(f, "d_4_1_interior.png")

def d_fire_shared():
    f, a = canvas("Kuvempu redistributes the ordeal; he does not abolish it", "Three solutions to the fire")
    opts = [("Cancel it", "Sita refuses; author denounces", "modern liberal retellings"), ("Share it", "Rama walks into the fire after her", "Kuvempu, 1949–57"),
            ("Ritualise it", "A shadow is exchanged for the real Sita", "Adhyātma; Tulsīdās")]
    for i, (h, t, s) in enumerate(opts):
        x = 3 + i * 32
        rect(a, x, 50, 30, 14, h, "accent" if i == 1 else "pale", fs=9.4, bold=True)
        rect(a, x, 26, 30, 22, t + "\n\n" + s, "outline", fs=8)
    text(a, 3, 16, "What none of the three removes: the premise that a wife's purity is a matter for public proof.", fs=8, color=COP, wrapw=110)
    source(a, "Chapters 2 and 4")
    save(f, "d_4_2_fire_shared.png")

# ------------------------------------------------------------------ Chapter 5
def d_borrowed():
    f, a = canvas("In the anti-epic, Sita speaks louder, and in someone else's sentences",
                  "Each author's programme, and the role it assigns Sita")
    rows = [("Chalam, 1924", "sexual freedom", "chooses Ravana; the author's verdict on two men"),
            ("Periyar, 1959", "anti-Brahmin, Dravidian", "collateral damage in the case against Rama"),
            ("Ambedkar, 1954–55", "democratic morality", "witness for the prosecution"),
            ("Ranganayakamma, 1974–76", "class analysis", "a queen whose pain cannot be the measure")]
    text(a, 3, 76, "Author", color=MUTED, fs=7.6); text(a, 33, 76, "Programme", color=MUTED, fs=7.6); text(a, 60, 76, "Role given to Sita", color=MUTED, fs=7.6)
    for i, (au, pr, ro) in enumerate(rows):
        y = 60 - i * 14
        rect(a, 3, y, 28, 11, au, "ink", fs=8, bold=True); rect(a, 33, y, 25, 11, pr, "pale", fs=8); rect(a, 60, y, 37, 11, ro, "outline", fs=8)
    source(a, "Chapter 5")
    save(f, "d_5_1_borrowed.png")

def d_reversal():
    f, a = canvas("Reversing the heroes leaves the woman where she was", "The anti-caste counter-reading's structure")
    pairs = [("Rama", "dharma incarnate", "Aryan aggressor"), ("Ravana", "demon", "wronged king"), ("Sita", "ideal wife", "object of the argument")]
    text(a, 22, 74, "Devotional epic", bold=True, ha="center"); text(a, 74, 74, "Counter-reading", bold=True, ha="center")
    for i, (n, l, r) in enumerate(pairs):
        y = 56 - i * 16
        rect(a, 3, y, 38, 11, f"{n}: {l}", "pale", fs=8.4); rect(a, 55, y, 42, 11, f"{n}: {r}", "accent" if n == "Sita" else "pale", fs=8.4)
        arrow(a, 41.5, y + 5.5, 54.5, y + 5.5)
    source(a, "Richman (1991) on Periyar; Chapter 5")
    save(f, "d_5_2_reversal.png")

def d_two_victims():
    f, a = canvas("One book, one king, two judgements: a woman on rumour, a Śūdra on birth",
                  "The Uttarakāṇḍa's paired victims, which modern traditions have read separately")
    rows = [("Charge", "rumour of contact (7.42.17–19)", "tapas 'from a Śūdra womb' (7.67.2)"),
            ("Hearing", "none; argument barred (7.44.18)", "beheaded mid-sentence (7.67.4)"),
            ("Ground", "precedent for subjects' wives", "order of varṇa"),
            ("Modern heirs", "feminist retellings", "anti-caste plays")]
    text(a, 30, 76, "Sītā", bold=True, ha="center"); text(a, 74, 76, "Śambūka", bold=True, ha="center")
    for i, (h, s, b) in enumerate(rows):
        y = 60 - i * 13
        text(a, 3, y + 5, h, color=MUTED, fs=7.8); rect(a, 14, y, 36, 10, s, "pale", fs=8); rect(a, 56, y, 41, 10, b, "pale", fs=8)
    rule(a, 3, 97, 18, color=COP)
    text(a, 3, 13, "Feminism followed Sita; the anti-caste movement followed Śambūka. Neither alone reads the book whole.", fs=8, color=COP, wrapw=110)
    source(a, "Vālmīki, critical edition; Chapters 1, 5, 10")
    save(f, "d_5_3_two_victims.png")

# ------------------------------------------------------------------ Chapter 6
def d_accretions():
    f, a = canvas("Three emblems of 'traditional' oppression are absent from Vālmīki",
                  "What the oldest layer says, and what the later tradition added")
    rows = [("The silent Sita", "argues, taunts, rebukes (2.27.3; 6.104.5)", "devotional & colonial ideal"),
            ("The Lakshmaṇa-rekhā", "no line drawn; she sends both men away (3.43)", "later tellings and songs"),
            ("Ahalyā's stone", "made invisible, lives on air; purified by her own tapas (1.47.29; 1.48.20)", "Tulsīdās and devotional tradition")]
    text(a, 27, 76, "Vālmīki (critical edition)", bold=True, ha="center"); text(a, 78, 76, "Added later", bold=True, ha="center")
    for i, (h, v, l) in enumerate(rows):
        y = 56 - i * 17
        rect(a, 3, y, 18, 13, h, "ink", fs=8, bold=True); rect(a, 22, y, 44, 13, v, "pale", fs=7.8); rect(a, 67, y, 30, 13, l, "outline", fs=7.8)
    source(a, "Vālmīki 1.47–48, 2.27, 3.43, 6.104 (critical edition); Dev Sen, Manushi 108, p. 24")
    save(f, "d_6_1_accretions.png")

def d_urmila():
    f, a = canvas("Each era gave Ūrmilā a voice, and each voice was the one that era needed",
                  "Five Ūrmilās, five needs", h=3.5)
    chevrons(a, [("Nationalist", "Saket 1931: patriotic waiting"), ("Progressive", "Warerkar 1950s: protest"),
                 ("Oral", "Telugu song: refuses to recognise her husband"), ("Market", "Kane 2014: the capable administrator"),
                 ("#MeToo era", "Adishakti 2023: who consented to her sleep?")], y=46, h=18, accent=2)
    text(a, 3, 22, "Only the oral voice answers no external programme.", fs=8.4, color=COP)
    source(a, "Chapter 6")
    save(f, "d_6_2_urmila.png")

# ------------------------------------------------------------------ Chapter 7
def d_devsen():
    f, a = canvas("Women have retold the Rāmāyaṇa in four distinct ways",
                  "Nabaneeta Dev Sen's typology, arranged by whose eyes and whose frame")
    matrix(a, "Whose eyes?", "Canon's frame?",
           [("Borrowed male eyes", "Mollā, 16th c., Telugu: a perfect classical telling by a Śūdra woman"),
            ("Own story through Sita's", "village women's songs"),
            ("Borrowed ideology", "Ranganayakamma: the Marxist lens"),
            ("Women's own eyes", "Candrābatī, 16th c., Bengali")], hi=3,
           xlo="male / ideological", xhi="women's", ylo="breaks", yhi="keeps")
    source(a, "Dev Sen, Manushi 108 (1998), p. 18")
    save(f, "d_7_1_devsen.png")

def d_teller_told():
    f, a = canvas("Candrābatī keeps her judgement in her own voice, not in Sita's mouth",
                  "Teller and told: an honesty the first-person novel cannot claim")
    rect(a, 3, 44, 44, 28, "The teller (poet)\ncondemns Rama: 'a deranged wimp', responsible for Ayodhya's fall", "accent", fs=8.4)
    rect(a, 53, 44, 44, 28, "The told (Sita)\nlaments; remains, largely, a docile wife", "pale", fs=8.4)
    text(a, 3, 30, "Dev Sen: 'Chandrabati, the narrator, lashes her whip under her name.'", fs=8, italic=True)
    text(a, 3, 20, "Contrast: the first-person Sita novel merges teller and told, so the author's verdict arrives as Sita's own voice.", fs=8, color=COP, wrapw=110)
    source(a, "Dev Sen, Manushi 108, pp. 20, 27")
    save(f, "d_7_2_teller_told.png")

# ------------------------------------------------------------------ Chapter 8
def d_volga():
    f, a = canvas("Volga's Sita is liberated by what other women know, not by finding her voice",
                  "Liberation as an education in four encounters, ending in refusal", h=3.5)
    chevrons(a, [("Śūrpaṇakhā", "beauty found beyond men's gaze"), ("Ahalyā", "no tribunal can try the truth"),
                 ("Reṇukā", "sons will belong to the father"), ("Ūrmilā", "free yourself from Rama"), ("Refusal", "Sita no longer needs his verdict")], y=46, h=18, accent=4)
    source(a, "Volga, The Liberation of Sita (2016), themes paraphrased")
    save(f, "d_8_1_volga.png")

def d_renunciant():
    f, a = canvas("The most celebrated feminist Sita leaves the way the Jain Sita left",
                  "Volga's exit rejoins one of the oldest tellings")
    rect(a, 3, 40, 28, 30, "Paumacariya (Jain)\nafter the ordeal, initiation as a nun; other women follow", "pale", fs=8)
    rect(a, 36, 40, 28, 30, "Vālmīki 7.88.9\nSita comes to the assembly in ochre (kāṣāya), the renunciant's colour", "pale", fs=8)
    rect(a, 69, 40, 28, 30, "Volga 2016\nliberation as release from attachment to Rama's verdict", "accent", fs=8)
    arrow(a, 31.5, 55, 35.5, 55); arrow(a, 64.5, 55, 68.5, 55)
    text(a, 3, 26, "What is new in Volga is the route (solidarity among wronged women), not the exit.", fs=8.4, color=COP)
    source(a, "Chapters 1 and 8")
    save(f, "d_8_2_renunciant.png")

# ------------------------------------------------------------------ Chapter 9
def d_proof():
    f, a = canvas("By the śāstra's own rules, Rama's ordeal was irregular: human evidence was available",
                  "The hierarchy of proof, and three answers to it")
    rect(a, 3, 52, 44, 20, "Human proof (first)\ndocuments · possession · witnesses", "pale", fs=8.6)
    rect(a, 3, 26, 44, 20, "Divine proof (last resort)\nordeal by fire, water, balance, poison", "outline", fs=8.6)
    arrow(a, 25, 51.5, 25, 46.5); text(a, 27, 49, "only if human proof is lacking", fs=7, color=MUTED)
    ans = [("Rama", "ordeal despite her oath, Hanumān's report and his own knowledge"), ("Sita 6.104.24", "names the fire a witness (sākṣin): ordeal turned into testimony"),
           ("Kannada song", "'Do you accept my truth, my lord?' — her word alone")]
    for i, (h, t) in enumerate(ans):
        y = 60 - i * 17; rect(a, 52, y, 45, 14, f"{h}: {t}", "accent" if i == 2 else "pale", fs=7.8, align="left", wrapw=52)
    source(a, "Yājñavalkya Smṛti 2.22 (to be verified); Vālmīki 6.104–106; Richman (2008)")
    save(f, "d_9_1_proof.png")

def d_bargain():
    f, a = canvas("Each woman of the household bargains for security inside the order that binds her",
                  "Kandiyoti's patriarchal bargain applied to the Rāmāyaṇa")
    rect(a, 38, 38, 24, 18, "The household\n(kula, rājya)", "ink", fs=9, bold=True)
    ws = [(3, 64, "Kaikeyī", "secures her son's succession"), (71, 64, "Mantharā", "bargains through her mistress"),
          (3, 14, "Kausalyā", "security through Rama's virtue"), (71, 14, "Tārā / Mandodarī", "survival by remarriage")]
    for x, y, h, t in ws:
        rect(a, x, y, 26, 14, h + "\n" + t, "pale", fs=8)
        arrow(a, x + 13, y + (0 if y > 50 else 14), 50, 47 + (9 if y > 50 else -9))
    source(a, "Kandiyoti (1988); Chapters 9 and 12")
    save(f, "d_9_2_bargain.png")

# ------------------------------------------------------------------ Chapter 10
def d_three_regimes():
    f, a = canvas("The epic disciplines three kinds of female body differently; feminism has watched only one",
                  "Three regimes under Brahmanical patriarchy")
    cols = [("Tested", "Sītā", "upper-caste wife; purity guards the lineage", "ordeal"),
            ("Mutilated", "Śūrpaṇakhā", "outsider whose desire crosses the boundary", "ears and nose cut (3.17.21)"),
            ("Polluting", "Śabarī", "low-caste woman whose touch is the question", "the tasted berries")]
    for i, (h, n, t, m) in enumerate(cols):
        x = 3 + i * 32
        rect(a, x, 62, 30, 10, h, "accent" if i == 0 else "ink", fs=9.4, bold=True)
        rect(a, x, 50, 30, 10, n, "pale", fs=9, bold=True)
        rect(a, x, 22, 30, 26, t + "\n\nmechanism: " + m, "outline", fs=7.8)
    text(a, 3, 13, "Feminist attention (blue) has concentrated on the regime of privilege.", fs=8, color=ACC)
    source(a, "Chakravarti (1993); Rege (1998); Chapter 10")
    save(f, "d_10_1_three_regimes.png")

def d_rege():
    f, a = canvas("Ask whose Sita is being universalised, and the circle widens", "After Sharmila Rege")
    for r, c in ((40, PALE), (29, SOFT), (18, "#C3CCF0"), (8, ACC)):
        a.add_patch(Ellipse((28, 42), r * 2 * 0.40, r * 2 * 0.775, fc=c, ec=WHITE, lw=2))
    text(a, 28, 42, "Sītā", color=WHITE, ha="center", bold=True)
    labs = [("Royal women", "Kaikeyī, Kausalyā, Mandodarī, Ūrmilā"), ("Margins", "Śūrpaṇakhā, Mantharā, Tāṭakā, Ahalyā"),
            ("Outside the epic's speech", "Śabarī, Śambūka's kin, Sannathimmi")]
    for i, (h, t) in enumerate(labs):
        y = 66 - i * 18; text(a, 64, y + 3, h, bold=True); a.text(64, y - 1, wrap(t, 34), fontsize=7.4, color=MUTED, va="top")
    source(a, "Rege (1998); Chapter 10")
    save(f, "d_10_2_rege.png")

def d_declared():
    f, a = canvas("The honest retelling declares its programme; the dishonest one calls it Sita's voice",
                  "A test for any Sita: whose need, and is it admitted?")
    matrix(a, "Does Sita speak in her own right?", "Is the author's programme declared?",
           [("Declared instrument", "Kandasamy's 'my Sita'; Anamika's Sita modelled on women in war"),
            ("Declared and sovereign", "Arni's journalist asks about Sita instead of speaking as her"),
            ("Concealed instrument", "Periyar's 'true reading'"),
            ("Concealed ventriloquism", "first-person novels presenting the author's thesis as Sita's recovered voice")], hi=1,
           xlo="no", xhi="yes", ylo="concealed", yhi="declared")
    source(a, "Chapters 5, 10, 11, 13, 14")
    save(f, "d_10_3_declared.png")

# ------------------------------------------------------------------ Chapter 11
def d_narrator():
    f, a = canvas("The first person gives Sita the right to interpret events, not the power to change them",
                  "Two different powers, often confused")
    rect(a, 3, 26, 44, 44, "Interpretive power\n(what the first person gives)\n\n· selects and colours every scene\n· names motives\n· judges Rama", "accent", fs=8.4)
    rect(a, 53, 26, 44, 44, "Narrative power\n(what it does not)\n\n· abduction still happens\n· ordeal still happens\n· banishment still happens", "pale", fs=8.4)
    text(a, 3, 16, "Test for a 'feminist' retelling: does the plot change, or only the point of view?", fs=8.4, color=COP)
    source(a, "Chapter 11 (Divakaruni, Naidu, Siya Ke Ram)")
    save(f, "d_11_1_narrator.png")

def d_round_trip():
    f, a = canvas("The 'empowered' diaspora Sita is the nationalist export Sita, re-imported",
                  "A century-long round trip through the gaze of the other")
    rect(a, 3, 48, 28, 20, "1900s · Export\nVivekananda's exalted Sita, shown to the West", "pale", fs=8)
    rect(a, 36, 48, 28, 20, "Abroad\nmeasured by the host culture's ideal of womanhood", "outline", fs=8)
    rect(a, 69, 48, 28, 20, "2010s · Re-import\n'An empowering tale for our time', sold back to India", "accent", fs=8)
    arrow(a, 31.5, 58, 35.5, 58); arrow(a, 64.5, 58, 68.5, 58)
    text(a, 3, 32, "Constant: Sita is shaped for an external audience's approval. Only the standard of approval changes.", fs=8.4, color=COP, wrapw=110)
    source(a, "Chapters 3 and 11")
    save(f, "d_11_2_round_trip.png")

# ------------------------------------------------------------------ Chapter 12
def d_empowered_for():
    f, a = canvas("The popular novel empowers its women for a purpose, rarely for themselves",
                  "Power and the cause it serves")
    rows = [("Amish's Sita", "office, command", "the nation's renewal"), ("Patel's Kaikeyī", "persuasion (the Binding Plane)", "women in public life"),
            ("Kane / Dasgupta's Tārā", "survival", "political continuity"), ("Vālmīki 7.88", "refusal", "herself")]
    text(a, 3, 76, "Figure", color=MUTED, fs=7.6); text(a, 36, 76, "Kind of power", color=MUTED, fs=7.6); text(a, 68, 76, "In the service of", color=MUTED, fs=7.6)
    for i, (n, p, s) in enumerate(rows):
        y = 60 - i * 13
        rect(a, 3, y, 31, 10, n, "ink", fs=8, bold=True); rect(a, 36, y, 30, 10, p, "pale", fs=8)
        rect(a, 68, y, 29, 10, s, "accent" if i == 3 else "outline", fs=8)
    source(a, "Chapter 12")
    save(f, "d_12_1_empowered_for.png")

def d_deferral():
    f, a = canvas("Empowerment by deferral: the warrior Sita's story stops before the trials begin",
                  "Where the question of Sita's power is actually posed", h=3.4)
    chevrons(a, [("Mithila", "Amish: prime minister, warrior"), ("Marriage", "a political alliance"), ("Abduction", "Amish ends here"),
                 ("Laṅkā & fire", "the king judges her"), ("Riverbank & earth", "she refuses him")], y=46, h=18, accent=2)
    a.add_patch(Rectangle((60.5, 40), 36.5, 28, fc="none", ec=COP, lw=1, ls=(0, (3, 2))))
    text(a, 62, 36, "never reached", fs=7.4, color=COP)
    source(a, "Amish, Sita: Warrior of Mithila (2017); Chapter 12")
    save(f, "d_12_2_deferral.png")

# ------------------------------------------------------------------ Chapter 13
def d_washerman():
    f, a = canvas("Across tellings, the voice of the banishment moves from the public to a person to the state",
                  "Three locations of the 'washerman'", h=3.4)
    chevrons(a, [("Vālmīki 7.42", "the citizens' talk: public opinion, reported to the king"), ("Later tellings", "one quarrelsome low-caste washerman"),
                 ("Arni 2013", "'the Washerman': head of a secret police")], y=46, h=18, accent=2)
    text(a, 3, 22, "The tradition blamed a poor man; Arni blames the state.", fs=8.4, color=COP)
    source(a, "Chapters 1 and 13")
    save(f, "d_13_1_washerman.png")

def d_absence():
    f, a = canvas("Absence argues only when someone asks about it", "How three works make Sita's disappearance speak")
    rows = [("The Missing Queen", "Sita missing", "a journalist asks 'Where is Sita?'"), ("Sita's Ramayana", "Sita restrained", "a woman painter's images judge"),
            ("Sita Sings the Blues", "Sita returns to earth", "an animator takes her name and goes on")]
    for i, (w, ab, ag) in enumerate(rows):
        y = 58 - i * 15
        rect(a, 3, y, 28, 11, w, "ink", fs=8, bold=True); rect(a, 33, y, 26, 11, ab, "pale", fs=8)
        arrow(a, 59.5, y + 5.5, 63.5, y + 5.5); rect(a, 64, y, 33, 11, ag, "accent", fs=8)
    source(a, "Chapter 13")
    save(f, "d_13_2_absence.png")

# ------------------------------------------------------------------ Chapter 14
def d_deshaj():
    f, a = canvas("Hindi grammar supplies the exact word for a native feminism: deśaj",
                  "The four origins of Hindi words, read as four sources of feminism")
    matrix(a, "Origin", "", [("Tatsam · 'same as that'", "Sanskritic: the śāstra's own ideal, taken whole"),
                             ("Videśaj · 'born abroad'", "imported: Mill, Beauvoir, the global market"),
                             ("Tadbhav · 'born of that'", "classical ideas transformed by use"),
                             ("Deśaj · 'born of the land'", "the speech of the people: songs, proverbs, quarrels")], hi=3)
    source(a, "Hindi grammatical tradition; Anamika (corpus W201); Chapter 14")
    save(f, "d_14_1_deshaj.png")

# ------------------------------------------------------------------ Chapter 15
def d_reception():
    f, a = canvas("Reception is a form of retelling: the audience rewrote the televised ordeal",
                  "The loop recorded by Madhu Kishwar for Sagar's Ramayan (1987–88)")
    pts = [(20, 62, "Broadcast", "Tulsī-based serial approaches the ordeal"), (70, 62, "Letters", "viewers protest in advance"),
           (70, 22, "Revision", "ordeal shown as 'a mock one'"), (20, 22, "New text", "'Ram ordered to behave better'")]
    for x, y, h, t in pts:
        rect(a, x - 14, y - 7, 28, 16, h + "\n" + t, "accent" if h == "New text" else "pale", fs=8)
    arrow(a, 34.5, 63, 55.5, 63); arrow(a, 70, 54.5, 70, 39.5); arrow(a, 55.5, 23, 34.5, 23); arrow(a, 20, 39.5, 20, 54.5)
    source(a, "Kishwar, Manushi 98 (1997), p. 29")
    save(f, "d_15_1_reception.png")

def d_screen_refusal():
    f, a = canvas("Popular cinema staged Sita's refusal through modern stand-ins",
                  "The refusal travelled from a 1924 play to the multiplex")
    rows = [("Lajja, 2001", "actress playing Sita refuses the ordeal on stage", "village audience attacks her"),
            ("Raavan, 2010", "wife refuses the lie-detector 'ordeal'", "she leaves her husband"),
            ("Kanchana Sita, 1978", "Sita never shown", "present only as nature")]
    for i, (f_, r, c) in enumerate(rows):
        y = 58 - i * 15
        rect(a, 3, y, 24, 11, f_, "ink", fs=8, bold=True); rect(a, 29, y, 38, 11, r, "pale", fs=8); rect(a, 69, y, 28, 11, c, "outline", fs=8)
    source(a, "Chapter 15")
    save(f, "d_15_2_screen_refusal.png")

# ------------------------------------------------------------------ Conclusion
def d_refusals():
    f, a = canvas("Sita's agency takes four forms of refusal", "A taxonomy built from the tellings examined")
    rs = [("Of the will", "chooses captivity over rescue on another's terms (5.35.62)"), ("Of the tribunal", "declines the second ordeal; calls the earth, not the fire (7.88.10)"),
          ("Of relation", "reaches a verdict and withholds it (Asan); will not lecture Ravana (Anamika)"), ("Of the world", "renunciation: Jain nun; Volga; Agrawal's Vandevī")]
    for i, (h, t) in enumerate(rs):
        x = 3 + (i % 2) * 48; y = 46 - (i // 2) * 30
        rect(a, x, y + 16, 46, 10, h, "accent" if i == 1 else "ink", fs=9.4, bold=True)
        rect(a, x, y, 46, 15, t, "pale", fs=8)
    source(a, "Conclusion")
    save(f, "d_c_1_refusals.png")

def d_voice_need():
    f, a = canvas("The sovereign Sita, who speaks for herself and serves no programme, is mostly old",
                  "Voice against need: the book's central framework")
    matrix(a, "Does Sita speak and judge in her own right?", "Does the telling serve an outside programme?",
           [("Instrument", "Periyar; Vivekananda's export Sita; the calendar"), ("Programmatic voice", "Chalam; Kandasamy; Amish; most bestsellers"),
            ("Icon", "Tulsī's protected Sita; the serial"), ("Sovereign", "Vālmīki 7.88; the women's songs; the Assamese Sita; Candrābatī")], hi=3,
           xlo="little", xhi="much", ylo="little", yhi="much")
    source(a, "Conclusion; placements are the author's")
    save(f, "d_c_2_voice_need.png")

def d_liberated_into():
    f, a = canvas("The question is not whether Sita is freed, but from what, and into what",
                  "Liberation from the household is only half the description")
    rect(a, 3, 44, 26, 24, "From:\nthe patriarchal household", "ink", fs=9, bold=True)
    outs = [("Into the nation", "warrior Sita"), ("Into the market", "the bestseller Sita"), ("Into heritage", "the diaspora Sita"), ("Into nothing", "she leaves")]
    for i, (h, t) in enumerate(outs):
        y = 70 - i * 15
        rect(a, 52, y, 45, 11, f"{h}: {t}", "accent" if i == 3 else "pale", fs=8.2)
        arrow(a, 29.5, 56, 51.5, y + 5.5, rad=0.0)
    text(a, 3, 16, "Only the last cannot be conscripted.", fs=8.4, color=COP)
    source(a, "Introduction, proposition 8; Conclusion")
    save(f, "d_c_3_liberated_into.png")

# ------------------------------------------------------------------ New chapters
def d_painting_axes():
    f, a = canvas("Who painted Sita, and for whom, decides which Sita we see",
                  "Patron and maker, the two variables of the painted Sita")
    matrix(a, "Who painted?", "For whom?",
           [("Court, male workshop", "Mewar, Pahari, Mughal manuscripts: beautiful, devoted, seldom complaining"),
            ("Court, women's hands", "rare; the Hamida Banu manuscript is a woman's commission, not her brush"),
            ("Bazaar, male press", "Ravi Varma oleograph, calendar art: one Sita, mass-produced"),
            ("Courtyard, women's hands", "Mithilā walls, Paṭuā scrolls: Sita as bride and as abducted woman")], hi=3,
           xlo="male workshop / press", xhi="women", ylo="market / home", yhi="court")
    source(a, "Chapters 16–17")
    save(f, "d_16_1_painting_axes.png")

def d_painters_moments():
    f, a = canvas("Painters returned to five moments, and the choice of moment is the argument",
                  "The scenes the visual tradition prefers, and what each makes visible", h=3.5)
    chevrons(a, [("Wedding", "Mithilā: every bride is Sītā"), ("Forest idyll", "Pahari: shared meals, garlands"), ("Abduction", "Paṭuā, Mewar: the woman carried off"),
                 ("Aśoka grove", "Ravi Varma, Akbar: captive and alone"), ("Earth", "bazaar print: the departure")], y=46, h=18, accent=2)
    text(a, 3, 22, "Almost never painted: the rebuke before the armies (6.104).", fs=8.4, color=COP)
    source(a, "Chapters 16–17")
    save(f, "d_16_2_moments.png")

def d_proof_continuum():
    f, a = canvas("Bodily proof of a woman's chastity runs from the epic's fire to the forensic lab",
                  "Four institutions of the same idea", h=3.4)
    chevrons(a, [("Fire", "Vālmīki 6.104"), ("Caste tribunal", "Nambūtiri smārtavicāram, 1905"), ("Village court", "panchāyat 'tests'"),
                 ("Forensic test", "the 'two-finger test', disapproved by the Supreme Court")], y=46, h=18, accent=3)
    text(a, 3, 22, "Common premise: a woman's word is insufficient; her body must be examined.", fs=8.4, color=COP)
    source(a, "Chapter 18; case citations in notes to be verified")
    save(f, "d_18_1_proof_continuum.png")

def d_natural_justice():
    f, a = canvas("Judged by natural justice, the banishment fails every test",
                  "The Uttarakāṇḍa decision against principles Indian law calls fundamental")
    tests = [("Notice", "Sita told only on the far bank (7.47)"), ("Hearing", "none; 'I am not to be answered back' (7.44.18)"),
             ("Unbiased judge", "the king judges his own reputation"), ("Reasons", "public talk, not a finding (7.42.19)"),
             ("Representation", "advocacy barred on oath (7.44.19)")]
    for i, (h, t) in enumerate(tests):
        y = 70 - i * 12
        rect(a, 3, y, 22, 9.5, h, "ink", fs=8.2, bold=True); rect(a, 26, y, 60, 9.5, t, "pale", fs=8, align="left", wrapw=70)
        rect(a, 87, y, 10, 9.5, "fails", "accent", fs=8, bold=True)
    source(a, "Vālmīki, critical edition; Chapter 18")
    save(f, "d_18_2_natural_justice.png")

def d_lanka_women():
    f, a = canvas("The war over one woman was paid for by many others", "Laṅkā's women and what the epic gives them")
    rows = [("Mandodarī", "counsels Ravana; mourns; in some tellings marries Vibhīṣaṇa"), ("Trijaṭā", "dreams Ravana's fall; comforts Sita"),
            ("Saramā", "befriends the captive; hears her story (Madhusudan)"), ("The guards", "threaten Sita; later spared at her plea"),
            ("The widows", "unnamed; the burning city's cost")]
    for i, (h, t) in enumerate(rows):
        y = 70 - i * 12
        rect(a, 3, y, 22, 9.5, h, "accent" if i == 4 else "ink", fs=8.2, bold=True); rect(a, 26, y, 71, 9.5, t, "pale", fs=8, align="left", wrapw=80)
    source(a, "Chapter 19")
    save(f, "d_19_1_lanka_women.png")

def d_border():
    f, a = canvas("Outside India, the story kept its plot and changed its sympathies",
                  "Three movements of the Rāmāyaṇa beyond the subcontinent")
    cols = [("Courts of Southeast Asia", "Ramakien, Hikayat Seri Rama, Kakawin: kingship, Islam, local gods"),
            ("Temple stone", "Prambanan, Angkor: the story as architecture"),
            ("Indenture ships", "Girmitiya Ramayan in Fiji, Trinidad, Mauritius, Suriname: Tulsī as home")]
    for i, (h, t) in enumerate(cols):
        x = 3 + i * 32
        rect(a, x, 56, 30, 12, h, "accent" if i == 2 else "ink", fs=8.6, bold=True); rect(a, x, 24, 30, 30, t, "pale", fs=8)
    source(a, "Chapter 20")
    save(f, "d_20_1_border.png")


def d_speech_moments():
    f, a = canvas("Vālmīki's Sita speaks at every decisive moment of her story", "Six moments of speech and refusal, with critical-edition locators", h=3.5)
    chevrons(a, [("Ayodhyā", "taunts Rama: 'a woman in a man's form' (2.27.3)"), ("Araṇya", "defies Ravana behind a blade of grass (3.54.1)"),
                 ("Sundara", "refuses rescue on another's terms (5.35.62)"), ("Yuddha", "'like a common man to a common woman' (6.104.5)"),
                 ("Uttara 47", "instructs the king who banished her (7.47.11)"), ("Uttara 88", "declines the second ordeal; the earth (7.88.10)")], y=46, h=18, accent=5, fs=7.4)
    source(a, "Vālmīki, Rāmāyaṇa, critical edition")
    save(f, "d_1_0_speech.png")

def d_agni():
    f, a = canvas("The ordeal places the burden of proof on her body to protect his legitimacy",
                  "The politics of the agni-parīkṣā: a hypothesis to test against each telling")
    left = ["Sexual purity", "Reputation", "Bodily proof", "Public scrutiny"]; right = ["Royal legitimacy", "Public duty", "Lineage", "The judge's seat"]
    text(a, 3, 76, "Sītā: what is examined", bold=True, color=ACC); text(a, 60, 76, "Rāma: what is protected", bold=True)
    for i, (l, r) in enumerate(zip(left, right)):
        y = 62 - i * 12
        rect(a, 3, y, 34, 9.5, l, "soft", fs=8.4); rect(a, 60, y, 37, 9.5, r, "pale", fs=8.4)
        arrow(a, 59.5, y + 4.75, 37.5, y + 4.75)
    text(a, 48.5, 70, "burden of proof", fs=7, color=MUTED, ha="center")
    rect(a, 3, 10, 94, 10, "Vālmīki 6.103.15: 'this war was not undertaken for your sake'", "ink", fs=8.4)
    source(a, "research plan, Diagram 2; Vālmīki 6.103–106")
    save(f, "d_1_5_agni.png")

def d_genealogy():
    f, a = canvas("Sita travels through four kinds of tradition that run side by side, not in sequence",
                  "The genealogy of Sita: a conceptual model")
    tiers = [("Classical & sectarian", "Vālmīki · Jātaka · Jain Paumacariya · Kālidāsa · Bhavabhūti"),
             ("Regional & devotional", "Kamban · Tulsī · Kṛttibās · Candrābatī · Mollā · Śaṅkaradeva"),
             ("Performative & oral", "women's songs · Rāmlīlā · scrolls · wall painting"),
             ("Modern literary", "feminist · political · psychological · ecological · devotional-'empowered'")]
    for i, (h, t) in enumerate(tiers):
        y = 63 - i * 14
        rect(a, 3, y, 26, 11, h, "accent" if i == 3 else "ink", fs=8.4, bold=True); rect(a, 30, y, 67, 11, t, "pale", fs=8, align="left", wrapw=80)
    a.annotate("", xy=(98.5, 22), xytext=(98.5, 74), arrowprops=dict(arrowstyle="<|-|>", color=MUTED, lw=0.8))
    text(a, 3, 12, "Borrowing runs in every direction: songs feed Candrābatī; Tulsī feeds the Rāmlīlā; the songs and Vālmīki's last book feed the feminist Sita.", fs=7.8, color=MUTED, wrapw=120)
    source(a, "research plan, Diagram 1")
    save(f, "d_2_0_genealogy.png")

def d_home_world():
    f, a = canvas("Nationalism split the world in two and made Sita the sign of the half it would not surrender",
                  "The 'nationalist resolution of the women's question' (after Partha Chatterjee)")
    rect(a, 3, 30, 45, 40, "Ghar · the inner domain\nspiritual, uncolonised\nwoman as its sign\nSita: chaste, self-sacrificing, silent", "accent", fs=8.6)
    rect(a, 52, 30, 45, 40, "Bāhir · the outer domain\nmaterial, Western, to be learned\nmen negotiate with modernity\nthe office, the court, the market", "pale", fs=8.6)
    text(a, 3, 20, "A Sita who argued with Rama would have brought the outer world's conflict into the inner one.", fs=8, color=COP, wrapw=110)
    source(a, "Chatterjee (1989; 1993)")
    save(f, "d_3_3_home_world.png")

def d_characters():
    f, a = canvas("Each woman at the edge of Sita's story reflects one part of hers",
                  "A character map: the relation each woman has to Sita, and the modern text that made it central")
    rect(a, 40, 36, 20, 12, "Sītā", "accent", fs=11, bold=True)
    ws = [(3, 60, "Ūrmilā", "the sister left behind · consent (Adishakti)"), (37, 62, "Ahalyā", "the woman tested before her · stone (Pudumaippittan)"),
          (71, 60, "Śūrpaṇakhā", "the anti-Sita · the garden (Volga)"), (3, 12, "Mandodarī", "the enemy's queen · Laṅkā (Dasgupta)"),
          (37, 8, "Śabarī", "the forest woman · knowledge (Volga 2025)"), (71, 12, "Kaikeyī", "the bargain · the boons (Patel)")]
    for x, y, h, t in ws:
        rect(a, x, y, 26, 13, h + "\n" + t, "pale", fs=7.4)
        arrow(a, x + 13, y + (0 if y > 50 else 13), 50, 42 + (6 if y > 50 else -6), color=LINE, style="-")
    source(a, "research plan, character-relationship map")
    save(f, "d_6_0_characters.png")

def d_vocabulary():
    f, a = canvas("Sita's vocabulary has shifted five times, but the shifts overlap rather than succeed",
                  "The changing vocabulary of Sita: provisional analytical categories", h=3.5)
    chevrons(a, [("Idealisation", "virtue, fidelity, sacrifice (Vivekananda; Ram Rajya)"), ("Psychologisation", "interior life, memory (Asan 1919)"),
                 ("Politicisation", "authority, dissent (Periyar; Arni)"), ("Feminist reconstruction", "agency, solidarity (Volga)"),
                 ("Contestation", "caste, ecology, plurality (Kanchana Sita 1977)")], y=46, h=18, accent=4, fs=7.4)
    text(a, 3, 20, "Note the dates: the 'psychological' Sita (1919) precedes the screen's 'ideal' one (1943).", fs=8.2, color=COP)
    source(a, "research plan, Diagram 3")
    save(f, "d_14_2_vocabulary.png")

def d_mercy():
    f, a = canvas("Sita's case for mercy towards her guards is the case no one made for her",
                  "Two judgements, two cantos apart in the critical edition")
    rect(a, 3, 64, 45, 9, "Sita on the guards (6.101.30–36)", "accent", fs=8.8, bold=True)
    rect(a, 52, 64, 45, 9, "Rama on Sita (6.103.15–24)", "ink", fs=8.8, bold=True)
    rows = [("acted under a king's command", "acted on no one's command"), ("no further danger once Ravana is dead", "no danger at all"),
            ("'there is no one who does not err'", "'your character has come under doubt'"), ("verdict: compassion", "verdict: 'go where you please'")]
    for i, (l, r) in enumerate(rows):
        y = 51 - i * 12
        rect(a, 3, y, 45, 10, l, "soft", fs=8); rect(a, 52, y, 45, 10, r, "pale", fs=8)
    source(a, "Vālmīki, critical edition, 6.101 and 6.103")
    save(f, "d_19_2_mercy.png")

def d_embodiment():
    f, a = canvas("Every tradition that stages Sita answers one question first: whose body may be hers?",
                  "Four answers, sorted by who performs and what the performance claims", h=3.9)
    matrix(a, "Who performs Sita", "What the performance claims",
           [("The svarūpa", "Rāmnagar Rāmlīlā: a Brahmin boy, crowned, is the goddess for the season. Pilgrims touch his feet."),
            ("The hereditary woman", "Kūṭiyāṭṭam: Naṅṅyār women play Sita in the temple theatre, by hereditary right."),
            ("The type", "Kathakali, Yakṣagāna, early Marathi stage: men play the strī vēṣam, an ideal of feminine gesture."),
            ("The actress", "Kalakshetra, stage, screen, TV: any woman may play Sita, and is then judged by the role.")],
           hi=3, xlo="boys and men", xhi="women", ylo="representation", yhi="embodiment")
    source(a, "author's synthesis; Kapur (1990); Jones (1984); Zarrilli (2000)")
    save(f, "d_21_1_embodiment.png")

def d_sons():
    f, a = canvas("Every form of evidence was supplied, and the oath was still demanded",
                  "Five elements of the epic's last trial (7.84–7.88)", h=3.6)
    chevrons(a, [("The song", "the sons sing 'the great life of Sita' at Rama's door (7.84.3–5)"),
                 ("The faces", "'images lifted from an image': the boys are Rama's likeness (7.85.7–8)"),
                 ("The witness", "Vālmīki stakes his austerities on her innocence (7.87.14–20)"),
                 ("The admission", "Rama: 'I know these twins are my sons' (7.88.3–4)"),
                 ("The demand", "an oath 'for her purification, and for mine' (7.86.6)")], y=44, h=20, accent=4, fs=7.4)
    text(a, 3, 20, "The oath was not for want of evidence. It was for the king's reputation.", fs=8.4, color=COP)
    source(a, "Vālmīki, critical edition, 7.84–7.88")
    save(f, "d_22_1_sons.png")

def d_theologies():
    f, a = canvas("Theology raised Sita above Rama, and lifted her out of reach of the trial",
                  "Four theological Sitas: what each makes her, and what each does with the ordeal", h=3.9)
    cols = [("The furrow", "Vedic Sītā; 'not born of a womb' (1.65.15)", "Chastity is the wrong question: the furrow is fertile, not 'pure'"),
            ("The mediatrix", "Śrī as puruṣakāra (Śrīvaiṣṇava)", "Her suffering was chosen, to show a mercy greater than Rama's"),
            ("The power", "Prakṛti or Śakti (Adhyātma; Adbhuta)", "The woman tried was a shadow; the goddess was never touched"),
            ("The beloved", "Eternal bride (rasik devotion)", "Her eternal moment comes before the forest; nothing was done to her")]
    for i, (h, w, e) in enumerate(cols):
        x = 3 + i * 24
        rect(a, x, 62, 22.5, 9, h, "accent" if i == 1 else "ink", fs=8.8, bold=True)
        rect(a, x, 44, 22.5, 16, w, "soft", fs=7.6)
        rect(a, x, 20, 22.5, 22, e, "pale", fs=7.6)
    text(a, 3, 12, "Each elevates her. Each, read rightly, is also a judgement on the trial.", fs=8.4, color=COP)
    source(a, "author's synthesis; Mumme (1991); Lutgendorf (1991); CE 1.65, 5.36, 6.101")
    save(f, "d_23_1_theologies.png")

if __name__ == "__main__":
    for fn in [v for k, v in list(globals().items()) if k.startswith("d_") and callable(v)]:
        fn()
