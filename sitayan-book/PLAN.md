# THE MANY LIVES OF SITA — working plan (read this first after any context reset)

Author: Deeksha Tyagi. Inputs: user's plan PDF (four levels of evidence, debates, visual programme,
"Reading Against the Text" box per chapter, Chicago notes) + corpus workbook (243 works, IDs W001–W243;
dump at /tmp/claude-0/-home-user-jrf/ee6e8a4f-9253-58ae-98f1-5c706341764f/scratchpad/in/master.txt).

Target: ~150,000 words. Tone: J Sai Deepak — first-person, lawyerly, argumentative ("I submit",
"It is my case that", "Let me be clear"), decolonial vocabulary (coloniality, epistemic sovereignty,
Bharat/Indic consciousness, the colonial gaze), numbered propositions, heavy footnotes, long quotations
from primary sources, fair but combative engagement with Left/feminist historiography. No communal content.

## Central thesis
Sita's literary afterlife is less a history of women "acquiring" voice (Valmiki's Sita already speaks,
refuses, rebukes) than a history of the changing political needs of the societies that rewrite her —
colonial reform, nationalism, rationalism, Marxism, liberal feminism, the market, Hindutva, the diaspora.
The most radical Sitas often come from inside the tradition (Valmiki's Uttara refusal, Chandrabati,
the Assamese Sita who calls Rama Yamkal, Telugu/Bhojpuri/Maithili/Marathi women's songs), and many modern
"liberated" Sitas import a liberal-individualist grammar that the tradition did not need. Refusal,
not voice, is Sita's signature. But tradition is not innocent: the Uttara Kanda pairs Sita with Shambuka;
caste and Brahmanical patriarchy (Chakravarti, Rege) must be faced, not explained away.
Hypotheses (user's): A domestic as counter-epic; B voice ≠ liberation; C feminist canon's exclusions;
D vernacular women's narratives = intellectual history.

## Chapters (file → target words → status)
00-front.md  front matter, note on citations/verification, transliteration (5k)
01-introduction.md  Whose Sita? (9k)
PART I THE INHERITANCE
02-ch1-valmiki.md  The Sita of Valmiki: voice, refusal, the "original" (9k)
03-ch2-many-ramayanas.md  Regional, devotional, women's traditions (9k)
04-ch3-colonial.md  Colonial Sita: reform, nation, ideal wife (9k)
PART II REBELS AND REFORMERS
05-ch4-interior.md  Kumaran Asan, Tapaswini, Kuvempu: the thinking Sita (8k)
06-ch5-anti-epic.md  Chalam, Periyar, Ambedkar, Ranganayakamma, Shambuka (9k)
07-ch6-margins.md  Ahalya, Urmila, Kanchana Sita, Bhoomikanya (9k)
PART III FEMINIST RECONSTRUCTION
08-ch7-womens-eyes.md  Chandrabati, Dev Sen, Mallika Sengupta, Kishwar (8k)
09-ch8-volga.md  The Liberation of Sita; On the Banks of the Pampa (9k)
10-ch9-kerala.md  Sarah Joseph, Ambai, Kerala/Tamil women's voices (7k)
11-ch10-caste-desire.md  Kandasamy, Bansode, Du. Saraswathi, Rege (8k)
PART IV MARKET, SCREEN, NATION
12-ch11-sitayan-moment.md  Divakaruni, Naidu, Bhyrappa, Majmudar, Agrawal, Panicker, Iyengar's Bhumika (9k)
13-ch12-warrior.md  Amish's Sita, Patel's Kaikeyi, Kane, Dasgupta, Adbhuta warrant (8k)
14-ch13-disappearance.md  Arni's Missing Queen & Sita's Ramayana, Paley (8k)
15-ch14-anamika.md  Sita's Veil and deshaj feminism (7k)
16-ch15-screen.md  Sagar, Lajja, Raavan, Siya Ke Ram, Adipurush, Ramayana 2026 (7k)
17-conclusion.md  The earth opens: refusal and sovereignty (7k)
18-back.md  glossary, chronology, corpus appendix, bibliography, illustration credits (8k)

Every chapter: thesis paragraph; numbered propositions; ≥1 "Reading Against the Text" box;
≥1 "Debate" box (competing positions from the PDF's debate table); figures; Chicago footnotes (^[...]).

## Citation rules (NON-NEGOTIABLE — user's own PDF forbids invented pages)
- Pinpoint pages only when verified in research/source-bank.md, or for canonical locators
  (Valmiki kanda.sarga.verse of the Baroda critical edition; Manas kanda/doha/chaupai).
- Otherwise cite the work and, where known, the article page range, and add "(pinpoint to be verified)".
- Never present paraphrase as quotation. Quotations from novels only if verified.
- Cover images: credit "Cover © publisher; reproduced for criticism and review; permission to be cleared".

## Build
Markdown in chapters/ → tools/build.sh (pandoc → DOCX with reference doc; LibreOffice → PDF).
Figures: tools/figs.py (matplotlib/networkx/graphviz) → figures/. Covers: covers/ via covers.openlibrary.org.
Public-domain art: images/ via upload.wikimedia.org (record licence in research/image-credits.md).

## Progress log
- Research done: Valmiki CE excerpts (research/valmiki-ce-excerpts.txt), source-bank.md (Dev Sen 1998, Kishwar 1997).
- Figures done: 35 PNGs in figures/ (tools/figs.py). Images: few (Wikimedia 429); covers via tools/covers_fetch.py (slow).
- Chapters split into -a/-b files of ~4.5k words each; build concatenates in filename order.
- Figure markdown: ![Figure N.M. Caption](../figures/FILE.png)

## ROUND 2 (user, 25 Nov): 1.5 lakh words of BODY (excl. footnotes & references); painting chapter(s); McKinsey-style diagrams
- Body count script: strip ^[...] footnotes, figures, and back-matter files; baseline 82,019.
- Diagrams: tools/figs2.py → figures/d_*.png. First-principles frameworks only (no dataset charts). Style: user's
  stylesheet (ink #172033, accent #2F43A8, pale #EEF1F6, muted #56617A, copper #A85A26), Liberation Sans,
  action titles (a sentence that states the point), thin arrows, one accent per figure, small source line.
  Remove from chapters: fig_0_1..0_4, fig_11_1, fig_11_2, fig_12_1, fig_5_3, fig_15_1, fig_2_2, fig_c_2 scatter etc.
- Paintings: tools/fetch_paintings.py + tools/paintings.txt (upload.wikimedia.org md5 paths work; API is 429).
- New chapters (files): 17-ch16.md painted Sita I (manuscript/mural/scroll); 18-ch17.md painted Sita II (oleograph,
  calendar, comic, poster); 19-ch18.md the law of the ordeal (proof, hearing, precedent; lawyerly); 20-ch19.md Lanka's
  women; 21-ch20.md beyond the border (SE Asia, girmitiya). Conclusion → 22-conclusion.md; back → 23-back-a.md, 24-back-b.md.
- Expansions: new sections inserted before "## Conclusion" of existing chapter files (tools/insert_section.py).
