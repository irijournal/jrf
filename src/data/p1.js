/* PAPER 1 — General Paper on Teaching & Research Aptitude */
(function (J) {
  var T = J.T, Q = J.Q;

  T({ id: 'p1-teach', u: 'P1', t: 'Teaching aptitude: levels, learner, methods, support systems, evaluation', h: 3,
    p: [
      'Teaching = a planned process to bring desirable change in the learner (knowledge, skills, attitudes). Teaching ↔ learning: teaching is the **independent variable**, learning the **dependent variable**.',
      '**Levels of teaching**: **Memory** (Herbart; rote; teacher-centred) → **Understanding** (Morrison; insight, generalisation) → **Reflective** (Hunt; problem-centred, learner-centred, highest).',
      'Maxims: known → unknown, simple → complex, concrete → abstract, particular → general, whole → part, empirical → rational, analysis → synthesis, psychological → logical.',
      'Learner characteristics: adolescents & adults (**andragogy** — Malcolm Knowles: self-directed, experience-based, problem-centred, internally motivated), individual differences, learning styles (visual, auditory, kinaesthetic).',
      'Factors: teacher (competence, personality), learner (readiness, motivation), support material, institutional facilities, learning environment.',
      '**Bloom’s taxonomy** (1956; revised by Anderson & Krathwohl 2001): **Remember → Understand → Apply → Analyse → Evaluate → Create**. Domains: cognitive, affective (Krathwohl), psychomotor (Simpson/Harrow/Dave).',
      'Methods: **teacher-centred** (lecture, demonstration) vs **learner-centred** (discussion, project — Kilpatrick, problem-solving, case study, role-play, brainstorming, **flipped classroom**, cooperative learning). **Online**: **SWAYAM** (MOOCs; launched 2017), **SWAYAM PRABHA** (DTH educational channels), NPTEL, e-PG Pathshala, **MOOCs** (4 quadrants: e-tutorial, e-content, discussion forum, self-assessment).',
      'Teaching support systems: traditional (blackboard), modern (OHP, projector), ICT-based (smart boards, LMS, virtual labs).',
      'Evaluation: **formative** (during learning) vs **summative** (at end); **diagnostic**; **norm-referenced** (compare with others) vs **criterion-referenced** (against a standard); **CBCS** (Choice Based Credit System, 2015 UGC); **CCE** (continuous & comprehensive); grading (10-point scale, SGPA/CGPA).',
      'Good test: **validity** (measures what it should), **reliability** (consistency), **objectivity**, **usability**.'
    ],
    m: [['Levels “M-U-R” = Herbart, Morrison, Hunt', '“My Uncle Rides” — Memory (Herbart), Understanding (Morrison), Reflective (Hunt).'],
      ['Bloom revised “R-U-A-A-E-C”', '“Rahul Usually Asks Awesome Educational Questions… Creatively”.']],
    f: ['SWAYAM stands for “Study Webs of Active-Learning for Young Aspiring Minds”.'],
    d: 'Levels of teaching\n Memory level — Herbart — rote\n Understanding level — Morrison — insight\n Reflective level — Hunt — problem-solving',
    k: ['Plan a 10-minute lesson using two maxims of teaching.'],
    r: ['Any standard Paper 1 guide (Trueman’s / Arihant) — Teaching Aptitude chapter'],
    q: [
      Q.mt('Match the level of teaching with its proponent:', ['Memory level', 'Understanding level', 'Reflective level', 'Andragogy'], ['Herbart', 'Morrison', 'Hunt', 'Malcolm Knowles'], '', ['Level', 'Proponent']),
      Q.mcq('Which is the highest level in the revised Bloom’s taxonomy?', ['Evaluate', 'Analyse', 'Create', 'Apply'], 2, ''),
      Q.mcq('Assessment done during the course of instruction to improve learning is:', ['Summative', 'Formative', 'Norm-referenced', 'Placement'], 1, ''),
      Q.mcq('A test that consistently gives the same results is said to be:', ['Valid', 'Reliable', 'Objective', 'Usable'], 1, ''),
      Q.st('Which of the following are learner-centred methods?', ['Project method', 'Lecture method', 'Problem-solving', 'Flipped classroom'], [true, false, true, true], ''),
      Q.ar('A reflective level of teaching is the most thoughtful level.', 'It is problem-centred and involves learners actively.', 0, '')
    ] });

  T({ id: 'p1-res', u: 'P2', t: 'Research aptitude: types, methods, steps, writing, ethics', h: 3,
    p: [
      'Research = systematic, objective search for new knowledge. Characteristics: empirical, logical, cyclical, replicable, controlled.',
      'Types by purpose: **fundamental/basic/pure** (theory), **applied** (solve practical problems), **action research** (Stephen Corey; teacher solves classroom problems), **evaluation research**. By method: **experimental**, **descriptive** (survey, case study), **historical**, **ex post facto** (cause after effect), **qualitative** (ethnography, phenomenology, grounded theory), **quantitative**, **mixed**.',
      'Paradigms: **positivism** (Comte; objective, quantitative) vs **post-positivism / interpretivism** (subjective meanings, qualitative).',
      'Steps: identify problem → review literature → **hypothesis** → research design → sampling → data collection → analysis → interpretation → report.',
      'Hypothesis: **null (H₀)** — no relation; **alternative (H₁)**. Errors: **Type I** = rejecting a true null; **Type II** = accepting a false null.',
      'Sampling: **probability** (simple random, systematic, stratified, cluster, multi-stage) vs **non-probability** (convenience, purposive/judgement, quota, **snowball**).',
      'Variables: independent, dependent, intervening, extraneous/moderator. Scales: **nominal, ordinal, interval, ratio** (NOIR).',
      'Tools: questionnaire, schedule, interview, observation, rating scale, **Likert scale** (attitudes), sociometry.',
      'Writing: thesis chapters, **abstract**, keywords, references (APA/MLA/Chicago), **impact factor**, **h-index**, peer review, **UGC-CARE** list.',
      'Ethics: informed consent, confidentiality, avoid **plagiarism**, fabrication, falsification; **UGC 2018 plagiarism regulations**; IPR & copyright.'
    ],
    m: [['Scales “NOIR” (French for black)', 'Nominal < Ordinal < Interval < Ratio (ratio has a true zero).'],
      ['Type I = “False alarm”, Type II = “Missed alarm”', 'Rejecting a true null vs accepting a false null.']],
    f: ['Snowball sampling is useful for hidden populations — each respondent refers the next one.'],
    d: 'Research types\n By purpose\n  Fundamental · Applied · Action\n By method\n  Experimental · Descriptive · Historical · Ex post facto\n By data\n  Qualitative · Quantitative · Mixed',
    k: ['Design a mini study on “mobile phone use and study hours” — name the variables, hypothesis and sample.'],
    r: ['Paper 1 guide — Research Aptitude chapter', 'IGNOU MHI-103 (research methods)'],
    q: [
      Q.mcq('Research undertaken by a teacher to solve a classroom problem is:', ['Fundamental', 'Action', 'Historical', 'Ex post facto'], 1, ''),
      Q.mcq('Rejecting a true null hypothesis is a:', ['Type I error', 'Type II error', 'Sampling error', 'Standard error'], 0, ''),
      Q.mt('Match the sampling method with its type:', ['Stratified sampling', 'Snowball sampling', 'Cluster sampling', 'Quota sampling'], ['Probability', 'Non-probability (referral)', 'Probability (groups)', 'Non-probability (fixed shares)'], '', ['Method', 'Type']),
      Q.ch('Arrange the steps of research in order:', ['Identification of problem', 'Formulation of hypothesis', 'Collection of data', 'Interpretation and report'], ''),
      Q.mcq('Which scale has an absolute (true) zero?', ['Nominal', 'Ordinal', 'Interval', 'Ratio'], 3, ''),
      Q.ar('Ex post facto research cannot establish causation as firmly as experiments.', 'In ex post facto research the researcher cannot manipulate the independent variable.', 0, '')
    ] });

  T({ id: 'p1-comp', u: 'P3', t: 'Comprehension: strategy for the reading passage', h: 1,
    p: [
      'One passage + **5 questions** (10 marks). Usually ~500–700 words on social issues, education, environment, economy, philosophy.',
      'Strategy: **read questions first** (1 minute) → skim passage for structure → read actively, underline keywords → answer **from the passage only**, not outside knowledge.',
      'Question types: main idea/title, author’s tone/attitude, inference, factual detail, vocabulary in context, “NOT true” type.',
      'Traps: extreme words (always, never, only), options true in general but not stated, partial matches.',
      'Time target: **10–12 minutes** for the whole passage.'
    ],
    m: [['“Q-S-R-A”', 'Questions first, Skim, Read actively, Answer from text.']],
    f: ['Most wrong comprehension answers come from using outside knowledge instead of the passage.'],
    d: 'Comprehension routine\n Read 5 questions (1 min)\n Skim paragraphs (2 min)\n Active reading + underline (5 min)\n Answer & verify line by line (3 min)',
    k: ['Practise: summarise any newspaper editorial in 3 lines and give it a title.'],
    r: ['Daily: one editorial (The Hindu / Indian Express)'],
    q: [
      Q.mcq('In a comprehension passage, the best way to choose a title is to:', ['Pick the longest option', 'Identify the central idea of the whole passage', 'Use the first sentence only', 'Use outside knowledge'], 1, ''),
      Q.mcq('Options with words like “always” and “never” are usually:', ['Correct', 'Traps unless the passage says so', 'About vocabulary', 'About tone'], 1, '')
    ] });

  T({ id: 'p1-comm', u: 'P4', t: 'Communication: types, barriers, classroom & mass media', h: 2,
    p: [
      'Communication = sharing of meaning; from Latin **communis** (common). Elements: **sender, message, encoding, channel, decoding, receiver, feedback, noise, context**.',
      'Models: **Aristotle** (speaker–speech–audience), **Lasswell** (Who says What in Which channel to Whom with What effect), **Shannon–Weaver** (mathematical; introduced **noise**), **Berlo’s SMCR**, **Osgood–Schramm** (circular), Westley–MacLean, Dance’s helical model.',
      'Types: **verbal** (oral, written) & **non-verbal** (**kinesics** – body language, **proxemics** – space, **chronemics** – time, **haptics** – touch, **paralanguage** – tone/pitch, oculesics – eye contact); intrapersonal, interpersonal, group, public, mass; formal (vertical, horizontal, diagonal) & informal (**grapevine**).',
      'Effective communication: **7 Cs** — clear, concise, concrete, correct, coherent, complete, courteous.',
      '**Barriers**: physical (noise), semantic (language/jargon), psychological (emotions, prejudice), cultural, organisational, physiological.',
      'Classroom communication: two-way, feedback, questioning, active listening, non-verbal cues. **Inter-cultural communication**: awareness of high-context vs low-context cultures (Edward Hall).',
      'Mass media & society: functions (inform, educate, entertain, persuade, surveillance); theories — **hypodermic needle/magic bullet**, **two-step flow** (Lazarsfeld), **agenda-setting** (McCombs & Shaw), **uses & gratification**, **cultivation** (Gerbner), **spiral of silence** (Noelle-Neumann); **Marshall McLuhan** — “**medium is the message**”, “global village”.'
    ],
    m: [['Non-verbal “K-P-C-H-P”', 'Kinesics (body), Proxemics (space), Chronemics (time), Haptics (touch), Paralanguage (voice).'],
      ['Lasswell = 5 Ws', 'Who, says What, in Which channel, to Whom, with What effect.']],
    f: ['Shannon and Weaver designed their model for telephone engineering, not human conversation!'],
    d: 'Communication process\n Sender → Encoding → Message → Channel → Decoding → Receiver\n ↑ Feedback ←\n Noise can enter at any point',
    k: ['Name one barrier you faced in class this week and the “C” that would fix it.'],
    r: ['Paper 1 guide — Communication chapter'],
    q: [
      Q.mt('Match the term with its meaning:', ['Kinesics', 'Proxemics', 'Chronemics', 'Haptics'], ['Body movements', 'Use of space', 'Use of time', 'Touch'], '', ['Term', 'Meaning']),
      Q.mcq('“The medium is the message” was said by:', ['Lasswell', 'Marshall McLuhan', 'Shannon', 'Schramm'], 1, ''),
      Q.mcq('The concept of “noise” was introduced in the model of:', ['Aristotle', 'Shannon and Weaver', 'Lasswell', 'Berlo'], 1, ''),
      Q.mcq('Agenda-setting theory was proposed by:', ['Lazarsfeld', 'McCombs and Shaw', 'Gerbner', 'Noelle-Neumann'], 1, ''),
      Q.ar('Grapevine is an informal channel of communication.', 'It does not follow the formal chain of command in an organisation.', 0, '')
    ] });

  T({ id: 'p1-math', u: 'P5', t: 'Mathematical reasoning: series, coding, ratios, %, profit, interest, averages, time & distance', h: 3,
    p: [
      'Number series: check differences (1st, 2nd), ratios, squares/cubes (n², n³ ± k), primes, alternating series, Fibonacci-type.',
      'Letter series: use positions A=1…Z=26; reverse positions (A=26); “EJOTY” trick = 5,10,15,20,25.',
      'Coding–decoding: shift each letter (+1, −2…), reverse alphabet, number coding, substitution.',
      '**Percentage**: x% of y = xy/100; successive change a%, b% → a + b + ab/100; percentage change = change/original × 100.',
      '**Profit & loss**: Profit% = P/CP × 100; SP = CP × (100 + P%)/100; discount on MP; false weight gain% = error/(true − error) × 100.',
      '**Simple interest** = PRT/100; **compound** A = P(1 + R/100)ⁿ; CI − SI for 2 years = P(R/100)².',
      '**Ratio & proportion**: a:b = c:d → ad = bc; mixtures & alligation.',
      '**Average** = sum/number; new average when one item changes = old avg + change/n.',
      '**Time–speed–distance**: D = S × T; km/h → m/s × 5/18; average speed for equal distances = 2xy/(x + y); relative speed (same direction subtract, opposite add); trains: length/(relative speed).',
      '**Time & work**: if A does in a days, B in b days → together ab/(a + b) days.'
    ],
    m: [['“EJOTY”', 'E=5, J=10, O=15, T=20, Y=25 — instant letter positions.'],
      ['Average speed 2xy/(x+y)', 'Use only when the two distances are equal.']],
    f: ['Paper 1 maths is class 8–10 level; speed matters more than difficulty — aim for 1 minute per question.'],
    d: 'Quick formulas\n Successive % = a + b + ab/100\n SI = PRT/100\n CI = P(1 + R/100)^n − P\n Avg speed = 2xy/(x + y)\n Work together = ab/(a + b)',
    k: ['Make 5 number series questions for a friend and solve theirs.'],
    r: ['Practice tab → Paper 1 Maths drills (auto-generated, unlimited)'],
    q: [
      Q.mcq('Find the next term: 2, 6, 12, 20, 30, ?', ['40', '42', '44', '48'], 1, 'n(n+1): 1×2, 2×3 … 6×7 = 42.'),
      Q.mcq('A price rises by 20% and then falls by 20%. Net change:', ['0%', '4% decrease', '4% increase', '2% decrease'], 1, '20 − 20 − 400/100 = −4%.'),
      Q.mcq('A car goes at 40 km/h and returns at 60 km/h. Average speed:', ['48 km/h', '50 km/h', '52 km/h', '45 km/h'], 0, '2×40×60/100 = 48.'),
      Q.mcq('If CAT is coded as DBU, then DOG is coded as:', ['EPH', 'EPG', 'FPH', 'DPH'], 0, 'Each letter +1.'),
      Q.mcq('Simple interest on Rs 5000 at 8% per annum for 3 years:', ['Rs 1000', 'Rs 1200', 'Rs 1500', 'Rs 1800'], 1, '5000 × 8 × 3 / 100 = 1200.')
    ] });

  T({ id: 'p1-logic', u: 'P6', t: 'Logical reasoning: arguments, deduction/induction, Venn diagrams, analogies, Indian logic', h: 3,
    p: [
      'Argument = **premises** + **conclusion**. **Deductive**: conclusion necessarily follows (valid/invalid; sound = valid + true premises). **Inductive**: probable (strong/weak), from particular to general.',
      'Categorical propositions: **A** (All S are P), **E** (No S is P), **I** (Some S are P), **O** (Some S are not P). **Square of opposition**: A–O & E–I **contradictories**; A–E **contraries** (both can’t be true); I–O **sub-contraries** (both can’t be false); A→I, E→O **subalternation**.',
      'Distribution: A distributes subject; E both; I none; O predicate (“**Asebinop**”). Syllogism rules: middle term distributed at least once; no term distributed in conclusion unless in premise; two negatives → no conclusion.',
      'Fallacies (Western): ad hominem, straw man, begging the question (circular), false dilemma, slippery slope, hasty generalisation, appeal to authority/emotion.',
      '**Venn diagrams** for relations (e.g., doctors–women–mothers).',
      '**Indian logic — Pramanas** (means of valid knowledge): **pratyaksha** (perception), **anumana** (inference), **upamana** (comparison/analogy), **shabda** (verbal testimony), **arthapatti** (postulation/presumption), **anupalabdhi** (non-apprehension). Charvaka: 1 (pratyaksha); Buddhist/Vaisheshika: 2; Sankhya: 3; Nyaya: 4; Prabhakara Mimamsa: 5; Bhatta Mimamsa & Advaita: 6.',
      '**Nyaya five-membered inference (panchavayava)**: **pratijna** (thesis: hill has fire), **hetu** (reason: smoke), **udaharana** (example: kitchen), **upanaya** (application), **nigamana** (conclusion). Terms: **paksha** (subject — hill), **sadhya** (to be proved — fire), **hetu/linga** (smoke), **vyapti** (invariable concomitance).',
      '**Hetvabhasa** (fallacies of reason): **savyabhichara** (irregular/inconclusive), **viruddha** (contradictory), **satpratipaksha** (counter-balanced), **asiddha** (unproved), **badhita** (contradicted by other pramana).'
    ],
    m: [['Pramanas “P-A-U-S-A-A”', 'Pratyaksha, Anumana, Upamana, Shabda, Arthapatti, Anupalabdhi — “Please Always Use Simple Answers, Amigo”.'],
      ['Panchavayava “P-H-U-U-N”', 'Pratijna, Hetu, Udaharana, Upanaya, Nigamana — “Please Help Us Understand Nyaya”.'],
      ['“Asebinop”', 'A distributes Subject, E Both, I Neither, O Predicate.']],
    f: ['The classic Indian inference example — “the hill has fire because it has smoke, like a kitchen” — is over 1,500 years old.'],
    d: 'Square of opposition\n A (All S are P) ↔ O (Some S are not P): contradictory\n E (No S is P) ↔ I (Some S are P): contradictory\n A ↔ E: contrary\n I ↔ O: sub-contrary\n A → I, E → O: subalternation',
    k: ['Convert “smoke on the hill” into all five Nyaya steps aloud.'],
    r: ['Paper 1 guide — Logical Reasoning & Indian Logic'],
    q: [
      Q.mt('Match the Nyaya step with its meaning:', ['Pratijna', 'Hetu', 'Udaharana', 'Nigamana'], ['Statement of thesis', 'Reason', 'Example with universal rule', 'Conclusion'], '', ['Step', 'Meaning']),
      Q.mcq('Which pair of propositions are contradictories?', ['A and E', 'A and O', 'I and O', 'A and I'], 1, ''),
      Q.mcq('Arthapatti as a pramana means:', ['Perception', 'Comparison', 'Postulation/presumption', 'Non-apprehension'], 2, ''),
      Q.mcq('How many pramanas does the Nyaya school accept?', ['One', 'Two', 'Four', 'Six'], 2, ''),
      Q.mcq('In “the hill has fire because it has smoke”, the paksha is:', ['Fire', 'Smoke', 'Hill', 'Kitchen'], 2, ''),
      Q.s2('Two contrary propositions can both be false.', 'Two sub-contrary propositions can both be false.', true, false, '')
    ] });

  T({ id: 'p1-di', u: 'P7', t: 'Data interpretation: data types, graphs, governance', h: 2,
    p: [
      'Data: **qualitative** (categorical) vs **quantitative** (discrete/continuous); **primary** vs **secondary**; cross-sectional vs time-series.',
      'Representation: **table**, **bar chart** (compare categories), **histogram** (continuous classes, no gaps), **pie chart** (share of whole; angle = value/total × 360°), **line graph** (trends), frequency polygon, ogive (cumulative).',
      'DI set = one table/chart + **5 questions**: percentages, ratios, averages, growth rates (CAGR approx), maximum/minimum, differences.',
      'Speed tricks: approximate (round 2–3%), compare fractions by cross-multiplication, 1/8 = 12.5%, 1/6 ≈ 16.67%, 1/7 ≈ 14.28%.',
      'Data & governance: Open Government Data (data.gov.in), **NSO** (merged CSO + NSSO, 2019), census, Aadhaar & DBT, **Data Protection (DPDP) Act 2023**.'
    ],
    m: [['Fraction-percent table “2-50, 4-25, 8-12.5, 6-16.7, 7-14.3, 9-11.1”', 'Memorise for 3x faster DI.']],
    f: ['A pie chart’s full circle is 360°, so 1% equals 3.6°.'],
    d: 'Which chart?\n Compare categories → bar\n Continuous distribution → histogram\n Share of total → pie\n Trend over time → line',
    k: ['Turn your weekly study hours into a bar chart and a pie chart.'],
    r: ['Practice tab → Paper 1 DI sets (auto-generated tables)'],
    q: [
      Q.mcq('In a pie chart, a 25% share corresponds to:', ['45°', '90°', '120°', '180°'], 1, ''),
      Q.mcq('Which graph is best to show a trend over time?', ['Pie chart', 'Line graph', 'Histogram', 'Scatter plot'], 1, ''),
      Q.mcq('A histogram differs from a bar chart because:', ['Bars are separated', 'It represents continuous class intervals without gaps', 'It shows percentages only', 'It uses circles'], 1, '')
    ] });

  T({ id: 'p1-ict', u: 'P8', t: 'ICT: terms, internet, digital initiatives, e-governance', h: 2,
    p: [
      'Units: bit < nibble (4) < byte (8) < KB (1024 B) < MB < GB < TB < PB < EB < ZB < YB.',
      'Abbreviations: **URL, HTTP/HTTPS, HTML, IP, TCP, DNS, ISP, LAN/MAN/WAN, VoIP, SMTP/POP/IMAP, FTP, PDF, GIF/JPEG/PNG, RAM/ROM, CPU, ALU, USB, OCR, AI, IoT, CC/BCC**.',
      'Internet history: **ARPANET (1969)**; WWW by **Tim Berners-Lee (1989–91)**; India — public internet by **VSNL, 15 Aug 1995**.',
      'Email: To, CC (carbon copy), **BCC** (blind carbon copy — hidden). Spam, phishing, malware (virus, worm, trojan, ransomware), firewall, encryption.',
      'Conferencing: audio/video conferencing, webinars, LMS (Moodle).',
      'Digital initiatives in higher education: **SWAYAM, SWAYAM PRABHA, NPTEL, e-PG Pathshala, Shodhganga, Shodhgangotri, INFLIBNET, NDLI (National Digital Library), e-Yantra, Virtual Labs, NAD/DigiLocker, ABC (Academic Bank of Credits)**, NMEICT.',
      'ICT & governance: **Digital India (2015)**, e-Kranti, **UMANG**, DigiLocker, Aadhaar, **BharatNet**, CSC, PFMS, GeM, UPI, e-Office.'
    ],
    m: [['“Spam Phish Worm”', 'Spam = junk mail; Phishing = fake mail to steal data; Worm = self-replicating malware.']],
    f: ['The first email was sent by Ray Tomlinson in 1971 — he chose “@” to separate user and host.'],
    d: 'Network sizes\n PAN (person)\n LAN (building)\n MAN (city)\n WAN (country/world)',
    k: ['Explain HTTPS vs HTTP to a grandparent.'],
    r: ['Paper 1 guide — ICT chapter'],
    q: [
      Q.mcq('BCC in email stands for:', ['Blank carbon copy', 'Blind carbon copy', 'Basic carbon copy', 'Binary carbon copy'], 1, ''),
      Q.mcq('1 KB is equal to:', ['1000 bits', '1024 bytes', '1024 bits', '1000 bytes (exactly)'], 1, 'In computing, 1 KB = 1024 bytes.'),
      Q.mt('Match the initiative with its purpose:', ['Shodhganga', 'SWAYAM', 'NDLI', 'DigiLocker'], ['Repository of PhD theses', 'MOOCs platform', 'National digital library', 'Storage of digital documents'], '', ['Initiative', 'Purpose']),
      Q.mcq('The World Wide Web was invented by:', ['Vint Cerf', 'Tim Berners-Lee', 'Ray Tomlinson', 'Bill Gates'], 1, '')
    ] });

  T({ id: 'p1-env', u: 'P9', t: 'People, development & environment: SDGs, pollution, resources, disasters, laws, agreements', h: 3,
    p: [
      '**MDGs** (2000–2015; 8 goals) → **SDGs** (2015–2030; **17 goals, 169 targets**; “leave no one behind”).',
      'Pollution: air (PM2.5/PM10, SO₂, NOx, CO, O₃; **AQI** with 6 categories), water (BOD, COD, eutrophication), soil, noise (dB), e-waste, plastic. Health: respiratory diseases, **Minamata** (mercury), **Itai-itai** (cadmium), **blue baby** (nitrates), fluorosis, arsenicosis.',
      'Energy: renewable (solar, wind, hydro, biomass, geothermal, tidal) vs non-renewable. India targets: **500 GW non-fossil capacity by 2030**, **net zero by 2070** (Panchamrit, COP26).',
      'Disasters: natural (earthquake, cyclone, flood, drought, tsunami) vs man-made (**Bhopal gas tragedy 1984 – MIC**, Chernobyl 1986). **Sendai Framework (2015–30)**; **NDMA** (Disaster Management Act **2005**).',
      'Indian laws: **Wildlife Protection 1972**, **Water Act 1974**, **Forest Conservation 1980**, **Air Act 1981**, **Environment Protection Act 1986** (after Bhopal), **Biological Diversity 2002**, **NGT 2010**, Forest Rights 2006.',
      'International: **Stockholm (1972; UNEP)**, **Ramsar (1971, wetlands)**, CITES (1973), **Vienna (1985) & Montreal Protocol (1987; ozone)**, **Basel (1989; hazardous waste)**, **Rio Earth Summit (1992; UNFCCC, CBD, Agenda 21)**, **Kyoto (1997)**, **Cartagena (2000; biosafety)**, **Stockholm POPs (2001)**, **Nagoya (2010; ABS)**, **Paris (2015; 1.5–2 °C, NDCs)**, **Kigali amendment (2016; HFCs)**, **International Solar Alliance (2015; HQ Gurugram)**, **Minamata Convention (2013)**.',
      'Greenhouse gases: CO₂, CH₄, N₂O, HFCs, PFCs, SF₆ (Kyoto basket).'
    ],
    m: [['Ozone “V-M-K” = Vienna 85, Montreal 87, Kigali 16', 'Ozone treaties in order.'],
      ['Indian Acts “W-W-F-A-E” = 72-74-80-81-86', 'Wildlife, Water, Forest, Air, Environment: “We Want Fresh Air Everywhere”.']],
    f: ['The Montreal Protocol is the only UN treaty ratified by every member state.', 'India’s first Ramsar site was Chilika Lake (1981).'],
    d: 'Climate & environment treaties\n 1971 Ramsar (wetlands)\n 1972 Stockholm (UNEP)\n 1987 Montreal (ozone)\n 1992 Rio (UNFCCC, CBD)\n 1997 Kyoto\n 2015 Paris · SDGs · Sendai · ISA\n 2016 Kigali',
    k: ['Pick any 3 SDGs and connect each to one Indian scheme.'],
    r: ['Paper 1 guide — Environment chapter', 'IGNOU MHI-108 (environmental history) for depth'],
    q: [
      Q.mt('Match the convention with its subject:', ['Ramsar', 'Montreal Protocol', 'Basel Convention', 'Nagoya Protocol'], ['Wetlands', 'Ozone-depleting substances', 'Hazardous waste', 'Access and benefit sharing'], '', ['Convention', 'Subject']),
      Q.mcq('How many Sustainable Development Goals are there?', ['8', '15', '17', '21'], 2, ''),
      Q.mcq('The Environment (Protection) Act was passed in:', ['1972', '1981', '1986', '2002'], 2, ''),
      Q.mcq('Minamata disease is caused by:', ['Cadmium', 'Mercury', 'Arsenic', 'Lead'], 1, ''),
      Q.ch('Arrange chronologically:', ['Stockholm Conference', 'Montreal Protocol', 'Kyoto Protocol', 'Paris Agreement'], '1972 → 1987 → 1997 → 2015.'),
      Q.mcq('The International Solar Alliance has its headquarters in:', ['New Delhi', 'Gurugram', 'Paris', 'Bengaluru'], 1, '')
    ] });

  T({ id: 'p1-he', u: 'P10', t: 'Higher education system: ancient centres, post-1947 evolution, bodies, policies & governance', h: 2.5,
    p: [
      'Ancient: **Takshashila** (Panini, Charaka, Kautilya tradition), **Nalanda** (Kumaragupta I; Xuanzang & Yijing), **Vikramashila** (Dharmapala), **Valabhi**, **Odantapuri**, **Somapura**, **Jagaddala**, **Kanchi** ghatika; gurukulas.',
      'Colonial: universities at **Calcutta, Bombay, Madras (1857)**; Allahabad (1887); **Indian Universities Act 1904**; **Sadler Commission (1917–19)**; **IUB 1925** (later AIU).',
      'Post-1947: **Radhakrishnan Commission (1948–49)** → **UGC (1953; statutory 1956)**; **Kothari Commission (1964–66)** → **NPE 1968**; **NPE 1986** (POA 1992); **NKC (2005, Sam Pitroda)**; **Yash Pal Committee (2009)**; **RUSA (2013)**; **NEP 2020** (multidisciplinary HEIs, **ABC**, multiple entry-exit, **HECI** proposed with NHERC, NAC, HEGC, GEC; 50% GER by 2035).',
      'Regulators/bodies: **UGC, AICTE (1945/1987), NCTE (1995), BCI, NMC (2020, replaced MCI), PCI, ICAR, NAAC (1994, Bengaluru), NBA, NIRF (2015 ranking), NTA (2017), AIU, IUCs (INFLIBNET, CEC, IUAC)**.',
      'Types: central, state, deemed (Sec 3 UGC Act), private universities, **Institutes of National Importance** (IITs, AIIMS, NITs), **Institutions of Eminence** (2017).',
      'Programmes: **oriental** (Sanskrit, Pali, Persian, Arabic — e.g., Sampurnanand Sanskrit University), **conventional** (BA/BSc), **non-conventional** (distance/ODL — **IGNOU 1985**, open universities, MOOCs, online degrees).',
      'Professional, technical & **skill** education: **NSDC (2008)**, **NSQF**, Skill India (2015), B.Voc, Community Colleges. **Value education** & **environmental education** (SC direction in **M.C. Mehta case 1991**; UGC 6-month core course).',
      'Governance: **Concurrent List** (education moved from State List by **42nd Amendment, 1976**); MoE (renamed from MHRD in 2020); **CABE**; university bodies — Senate/Court, **Executive Council/Syndicate**, **Academic Council**, VC.'
    ],
    m: [['Ancient universities “T-N-V-V-O” = Takshashila, Nalanda, Vikramashila, Valabhi, Odantapuri', '“Today Nalanda Visits Very Old”.'],
      ['Policies “68-86-92-20”', 'NPE 1968, NPE 1986, POA 1992, NEP 2020.']],
    f: ['Nalanda was revived as a new university near the ancient site, with its campus opening formally in 2024.'],
    d: 'Higher-education regulators\n UGC — universities & grants\n AICTE — technical education\n NCTE — teacher education\n NMC — medical\n BCI — legal\n NAAC — accreditation\n NTA — entrance tests',
    k: ['Explain NEP 2020 to a cousin in 5 bullet points.'],
    r: ['Paper 1 guide — Higher Education chapter', 'NEP 2020 summary (Ministry of Education)'],
    q: [
      Q.mcq('Education was moved to the Concurrent List by the:', ['24th Amendment', '42nd Amendment', '44th Amendment', '86th Amendment'], 1, ''),
      Q.mt('Match the body with its year of establishment:', ['UGC (statutory)', 'IGNOU', 'NAAC', 'NTA'], ['1956', '1985', '1994', '2017'], '', ['Body', 'Year']),
      Q.mcq('Vikramashila university was founded by:', ['Kumaragupta I', 'Dharmapala', 'Harsha', 'Devapala'], 1, ''),
      Q.mcq('The Radhakrishnan Commission (1948–49) dealt with:', ['Secondary education', 'University education', 'Technical education', 'Primary education'], 1, ''),
      Q.ch('Arrange the education policies chronologically:', ['National Policy on Education (first)', 'National Policy on Education (second)', 'Programme of Action', 'National Education Policy'], '1968 → 1986 → 1992 → 2020.')
    ] });
})(window.JRF);
