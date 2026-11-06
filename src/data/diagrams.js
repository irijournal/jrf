/* Diagrams & flowcharts. D(id, title, unit, topics, type, body, note)
   type: tree  — indented lines (one space per level), "Label — detail"
         flow  — one step per line, "Label | detail"
         cycle — like flow, last step leads back to the first
         table — "|"-separated, first line = header
         cer   — lines "C: cause", "E: event", "R: result" */
(function (J) {
  J.diagrams = [];
  function D(id, t, u, topics, type, body, note) { J.diagrams.push({ id: id, t: t, u: u, topics: topics ? topics.split(',') : [], type: type, body: body.replace(/^\n/, '').replace(/\n$/, ''), note: note || '' }); }

  /* ---------- Unit I ---------- */
  D('vedic-lit', 'Map of Vedic literature', 'H1', 'h1-lit,h1-lved', 'tree', `
Vedic literature
 Shruti — “heard”, revealed
  Four Vedas — Rig · Sama · Yajur · Atharva
  Each Veda has four layers
   Samhita — hymns
   Brahmana — ritual prose
   Aranyaka — forest texts
   Upanishad — philosophy (Vedanta)
 Vedangas — six “limbs”
  Shiksha — phonetics
  Kalpa — ritual (Shrauta, Grihya, Dharma, Sulba sutras)
  Vyakarana — grammar
  Nirukta — etymology
  Chhanda — metre
  Jyotisha — astronomy
 Smriti — “remembered”
  Epics — Ramayana · Mahabharata
  Puranas — 18 major
  Dharmashastras — Manu · Yajnavalkya · Narada`, 'Shruti is revealed; smriti is human tradition.');
  D('darshana', 'Six schools of Indian philosophy (in pairs)', 'H1', 'h1-lved', 'tree', `
Indian philosophy
 Nyaya — Gautama: logic and valid knowledge
  pairs with Vaisheshika — Kanada: atoms and categories
 Samkhya — Kapila: purusha (spirit) and prakriti (matter)
  pairs with Yoga — Patanjali: eight limbs of discipline
 Purva Mimamsa — Jaimini: Vedic ritual
  pairs with Uttara Mimamsa (Vedanta) — Badarayana: Brahman
 Heterodox (nastika) — reject Vedic authority
  Buddhism · Jainism · Charvaka (Lokayata) · Ajivika`);
  D('buddh-jain', 'Buddhism vs Jainism', 'H1', 'h1-het', 'table', `
Feature | Buddhism | Jainism
Teacher | Gautama Buddha (Shakya clan) | Mahavira, 24th Tirthankara
Born | Lumbini | Kundagrama near Vaishali
Enlightenment | Bodh Gaya | Jrimbhikagrama, on the Rijupalika
Death | Kushinagar | Pavapuri
Path | Middle path; Four Noble Truths; Eightfold Path | Three jewels; five vows; strict non-violence
Soul | No permanent self (anatta) | Every being has a soul (jiva)
Early texts | Pali — Tripitaka | Ardhamagadhi Prakrit — Agamas (12 Angas)
Sects | Theravada, Mahayana, Vajrayana | Shvetambara, Digambara
Councils | Rajagriha, Vaishali, Pataliputra, Kashmir | Pataliputra, Vallabhi`);
  D('harappa-town', 'Harappan town plan', 'H1', 'h1-hrp,h1-hrp2', 'tree', `
Harappan town plan
 Citadel — raised mound, usually on the west
  Great Bath, “granary”, pillared hall (Mohenjo-daro)
 Lower town — east, residential
  Grid streets running north–south and east–west
  Covered drains; baked bricks in the ratio 1:2:4
 Variations
  Dholavira — three parts: citadel, middle town, lower town; big water reservoirs
  Lothal — dockyard and bead factory
  Kalibangan — ploughed field, fire altars`);
  D('ashrama', 'Four stages of life (ashramas)', 'H1', 'h1-lved', 'flow', `
Brahmacharya | Student life, celibacy, learning
Grihastha | Householder: family, work, rituals
Vanaprastha | Retreat to the forest, gradual withdrawal
Sannyasa | Renunciation, search for moksha`);

  /* ---------- Unit II ---------- */
  D('magadha-rise', 'Rise of Magadha', 'H2', 'h2-mag', 'flow', `
Haryanka | Bimbisara (marriage alliances, Anga), Ajatashatru (Vajji war, Pataliputra fort)
Shishunaga | Shishunaga takes Avanti; Kalashoka holds the Second Buddhist Council
Nanda | Mahapadma Nanda, “destroyer of all Kshatriyas”; huge army and treasury
Maurya | Chandragupta Maurya with Kautilya overthrows Dhana Nanda (c. 321 BCE)`, 'Why Magadha? Iron mines, fertile Ganga plain, elephants, rivers for trade and defence, able rulers.');
  D('saptanga', 'Kautilya’s saptanga: seven limbs of the state', 'H2', 'h2-mau', 'tree', `
Saptanga (Arthashastra)
 Swami — the king
 Amatya — ministers and officials
 Janapada — territory and people
 Durga — fortified capital
 Kosha — treasury
 Danda — army and the power to punish
 Mitra — ally`);
  D('stupa', 'Parts of a stupa', 'H2', 'h2-art', 'tree', `
Stupa
 Anda — hemispherical dome holding the relics
 Harmika — railed box on top of the dome
 Yashti — central mast
 Chhatra — umbrellas on the mast
 Medhi — raised terrace for walking
 Pradakshinapatha — path for walking around
 Vedika — railing around the stupa
 Torana — gateways (four at Sanchi)`);
  D('art-schools', 'Gandhara vs Mathura vs Amaravati', 'H2', 'h2-art', 'table', `
Feature | Gandhara | Mathura | Amaravati
Region | North-west (Peshawar, Taxila) | Mathura (Uttar Pradesh) | Krishna valley (Andhra)
Patrons | Kushanas | Kushanas | Satavahanas, Ikshvakus
Material | Grey-blue schist, stucco | Spotted red sandstone | Whitish-green limestone (“marble”)
Influence | Greco-Roman | Indigenous | Indigenous
Buddha image | Wavy hair, heavy drapery, calm face | Shaven or curled head, smiling, fleshy | Mostly narrative relief scenes
Religions | Mainly Buddhist | Buddhist, Jain, Brahmanical | Mainly Buddhist`);

  /* ---------- Unit III ---------- */
  D('temple-styles', 'Temple styles: Nagara, Dravida, Vesara', 'H3', 'h3-char,h2-art', 'table', `
Feature | Nagara | Dravida | Vesara
Region | North India | South India | Deccan
Tower | Curvilinear shikhara | Stepped, pyramidal vimana | Mix of both
Crown | Amalaka and kalasha | Dome-shaped shikhara (stupi) | Varies
Gateways | No large gateways | Tall gopurams (later temples) | —
Enclosure | Usually no boundary wall | High enclosure wall | —
Examples | Kandariya Mahadeva, Lingaraja, Konark | Brihadishvara, Shore temple, Kailasa (Ellora) | Hoysaleswara, Chennakeshava, Mahadeva (Itagi)`);
  D('state-debate', 'Early medieval state: three models', 'H3', 'h3-char,h10-ind', 'table', `
Model | Main voices | Core idea | Evidence used
Feudal | R.S. Sharma, D.N. Jha, B.N.S. Yadava | Land grants created intermediaries; towns and trade declined; dependent peasants | Land grants, decline of coins and towns
Segmentary | Burton Stein | Ritual sovereignty at the centre; real power with peasant localities (nadus) | Chola inscriptions, Southall’s African model
Integrative | B.D. Chattopadhyaya, Hermann Kulke | States grew by integrating lineages, cults and local groups — not decline | Regional inscriptions, temple cults
Critics of feudalism | Harbans Mukhia, D.C. Sircar | Indian peasants were free; “landlordism” is not feudalism | Comparative history`);

  /* ---------- Unit IV ---------- */
  D('sultanate-dyn', 'Delhi Sultanate: five dynasties', 'H4', 'h4-ds1,h4-ds2,h4-ds3', 'flow', `
Mamluk 1206–1290 | Aibak, Iltutmish, Raziya, Balban
Khalji 1290–1320 | Jalaluddin; Alauddin — markets, Deccan raids
Tughlaq 1320–1414 | Ghiyasuddin, Muhammad, Firoz; Timur sacks Delhi (1398)
Sayyid 1414–1451 | Khizr Khan, Timur’s deputy
Lodi 1451–1526 | Bahlul, Sikandar (founds Agra), Ibrahim — loses at Panipat (1526)`, 'Mnemonic: “Many Kings Took Sweet Laddoos”.');
  D('mughal-family', 'Mughal family line', 'H4', 'h4-mug1,h4-mug2,h4-mug3', 'tree', `
Babur (1526–30)
 Humayun (1530–40, 1555–56)
  Akbar (1556–1605) — mother Hamida Banu Begum
   Jahangir (1605–27) — mother Mariam-uz-Zamani; wife Nur Jahan
    Prince Khusrau — rebelled in 1606
    Shah Jahan (1628–58) — wife Mumtaz Mahal
     Dara Shukoh — defeated at Samugarh (1658), executed
     Shah Shuja — fled to Arakan
     Murad Bakhsh — executed
     Aurangzeb (1658–1707) — won the war of succession
      Bahadur Shah I (1707–12)`, 'The last emperor, Bahadur Shah II (1837–57), was exiled to Rangoon after 1857.');
  D('vijay-dyn', 'Vijayanagara: four dynasties', 'H4', 'h4-vij', 'flow', `
Sangama 1336–1485 | Harihara I and Bukka; Devaraya II
Saluva 1485–1505 | Saluva Narasimha
Tuluva 1505–1570 | Krishnadevaraya; Talikota (1565) under Sadashiva with Rama Raya in control
Aravidu 1570–c. 1650 | Tirumala; capital moves to Penukonda and Chandragiri`, 'Mnemonic: “SaSaTuA” — Sangama, Saluva, Tuluva, Aravidu.');
  D('ashta-pradhan', 'Ashta Pradhan: Shivaji’s council of eight', 'H4', 'h4-mar,h5-dadm', 'tree', `
Ashta Pradhan
 Peshwa — prime minister
 Amatya (Mazumdar) — finance and accounts
 Mantri (Waqia-navis) — royal records
 Sachiv (Surnavis) — royal correspondence
 Sumant (Dabir) — foreign affairs
 Senapati (Sar-i-Naubat) — army chief
 Panditrao — religious affairs and charity
 Nyayadhish — justice`);

  /* ---------- Unit V ---------- */
  D('iqta-jagir', 'Iqta vs jagir', 'H5', 'h5-sadm,h5-madm', 'table', `
Feature | Iqta (Sultanate) | Jagir (Mughal)
Holder | Muqti or wali | Mansabdar
Duties | Collect revenue, keep troops, maintain order | Right to revenue only; administration by other officials
Transfer | Transferable (Balban, Alauddin tightened control) | Transferred every few years
Hereditary? | Became hereditary under Firoz Tughlaq | Not hereditary, except watan jagirs
Linked to | Military service | Mansab rank (zat and sawar)`);
  D('mughal-decline', 'Why did the Mughal Empire decline?', 'H5', 'h4-mug3,h5-madm', 'cer', `
C: Jagirdari crisis — too many mansabdars, too few jagirs (Athar Ali, Satish Chandra)
C: Agrarian crisis — over-exploitation of peasants, revolts (Irfan Habib)
C: Aurangzeb’s long Deccan wars and religious policy
C: Weak later Mughals; noble factions (Irani, Turani, Hindustani)
E: Decline of Mughal power after 1707
R: Successor states — Hyderabad, Bengal, Awadh
R: Rise of Marathas, Sikhs, Jats and Afghans
R: Nadir Shah (1739) and Abdali’s raids
R: Opening for the English East India Company
R: Revisionists (Muzaffar Alam, C.A. Bayly): regional growth, not only decline`);

  /* ---------- Unit VI ---------- */
  D('bhakti-sufi', 'Map of Bhakti and Sufi traditions', 'H6', 'h6-bhak,h6-sufi', 'tree', `
Devotional traditions
 Tamil Bhakti (6th–9th c.)
  Alvars — Vishnu · Nayanars — Shiva
 Acharyas
  Shankara — Advaita → Ramanuja — Vishishtadvaita → Madhva — Dvaita
 Nirguna (formless God)
  Kabir · Guru Nanak · Ravidas · Dadu
 Saguna (God with form)
  Rama — Tulsidas · Krishna — Surdas, Mirabai, Chaitanya, Vallabha
 Maharashtra (Varkari)
  Jnaneshwar · Namdev · Eknath · Tukaram
 Sufi silsilas
  Chishti — Ajmer, Delhi · Suhrawardi — Multan · Naqshbandi — Sirhindi · Qadiri`);

  /* ---------- Unit VII ---------- */
  D('company-acts', 'Company-era acts: step by step', 'H7', 'h7-adm,h7-const', 'flow', `
Regulating Act 1773 | Governor-General of Bengal; Supreme Court at Calcutta (1774)
Pitt’s India Act 1784 | Board of Control; dual government
Charter Act 1793 | Charter renewed for 20 years
Charter Act 1813 | Trade monopoly ends (except tea and China); ₹1 lakh for education
Charter Act 1833 | Governor-General of India; Company becomes purely administrative; law member
Charter Act 1853 | Open competition for the civil service; separate legislative wing
Government of India Act 1858 | Crown rule; Secretary of State; Viceroy
Indian Councils Act 1861 | Portfolio system; Indians nominated to councils`);
  D('carnatic', 'Carnatic wars', 'H7', 'h7-eur', 'table', `
War | Years | Background | Ended by | Result
First | 1746–48 | War of Austrian Succession; Battle of Adyar (1746) | Treaty of Aix-la-Chapelle (1748) | Madras returned to the English
Second | 1749–54 | Succession disputes in Hyderabad and Carnatic; Clive takes Arcot (1751) | Treaty of Pondicherry (1754) | Dupleix recalled
Third | 1756–63 | Seven Years’ War; Battle of Wandiwash (1760) | Treaty of Paris (1763) | End of French power in India`);
  D('mysore-wars', 'Anglo-Mysore wars', 'H7', 'h7-bri', 'table', `
War | Years | British head | Mysore ruler | End
First | 1767–69 | Verelst (Bengal) | Haidar Ali | Treaty of Madras (1769)
Second | 1780–84 | Warren Hastings | Haidar Ali, then Tipu | Treaty of Mangalore (1784)
Third | 1790–92 | Cornwallis | Tipu Sultan | Treaty of Seringapatam (1792)
Fourth | 1799 | Wellesley | Tipu Sultan (killed) | Wodeyars restored under subsidiary alliance`);
  D('maratha-wars', 'Anglo-Maratha wars', 'H7', 'h7-bri', 'table', `
War | Years | Governor-General | Key events | End
First | 1775–82 | Warren Hastings | Raghunathrao’s claim; Convention of Wadgaon (1779) | Treaty of Salbai (1782)
Second | 1803–05 | Wellesley | Treaty of Bassein (1802); Battle of Assaye (1803) | Treaties of Deogaon, Surji-Anjangaon (1803), Rajpurghat (1805)
Third | 1817–18 | Lord Hastings | Pindari campaign; Peshwa defeated at Kirkee and Koregaon | Peshwaship abolished; Treaty of Mandsaur (1818)`);
  D('sikh-wars', 'Anglo-Sikh wars', 'H7', 'h7-bri', 'table', `
War | Years | Governor-General | Battles | Result
First | 1845–46 | Hardinge | Mudki, Ferozeshah, Aliwal, Sobraon | Treaties of Lahore and Bhyrowal (1846)
Second | 1848–49 | Dalhousie | Chillianwala, Gujrat | Punjab annexed (1849)`);
  D('1857-causes', 'Revolt of 1857: causes and results', 'H7', 'h7-1857', 'cer', `
C: Political — Doctrine of Lapse; annexation of Awadh (1856)
C: Economic — heavy revenue demand; ruin of artisans and taluqdars
C: Social-religious — fear of conversion; reforms seen as interference
C: Military — General Service Enlistment Act (1856); low pay; greased cartridges
E: Revolt begins at Meerut (10 May 1857) and spreads to Delhi
R: Company rule ends — Government of India Act 1858
R: Queen’s Proclamation (1 Nov 1858): no more annexations; religious tolerance
R: Army reorganised (Peel Commission); more European troops
R: Princes become allies; divide-and-rule policy hardens`);
  D('1857-centres', 'Revolt of 1857: centres, leaders and suppressors', 'H7', 'h7-1857', 'table', `
Centre | Indian leaders | Suppressed by
Delhi | Bahadur Shah II; Bakht Khan | John Nicholson, William Hodson
Kanpur | Nana Saheb; Tantia Tope | Colin Campbell
Lucknow | Begum Hazrat Mahal | Colin Campbell
Jhansi | Rani Lakshmibai | Hugh Rose
Bareilly | Khan Bahadur Khan | Colin Campbell
Arrah (Jagdishpur) | Kunwar Singh | Vincent Eyre, William Taylor`);
  D('reforms-1909-35', 'Constitutional reforms 1909 → 1919 → 1935', 'H7', 'h7-const', 'table', `
Act | Key features | Electorates | Viceroy
Morley–Minto (1909) | Councils enlarged; first Indian in Viceroy’s council (S.P. Sinha) | Separate electorates for Muslims | Minto
Montagu–Chelmsford (1919) | Dyarchy in provinces; bicameral central legislature | Communal electorates extended (e.g. Sikhs) | Chelmsford
Government of India Act (1935) | Provincial autonomy; all-India federation planned (never formed); dyarchy at the centre; Federal Court | Separate electorates extended; wider franchise | Willingdon (passed), Linlithgow (in force)`);

  /* ---------- Unit VIII ---------- */
  D('land-systems', 'British land revenue systems', 'H8', 'h8-land', 'table', `
Feature | Permanent Settlement | Ryotwari | Mahalwari
Year | 1793 | 1820 (Madras) | 1822; revised 1833
Introduced by | Cornwallis (with John Shore) | Thomas Munro, Alexander Read | Holt Mackenzie; R.M. Bird, James Thomason
Areas | Bengal, Bihar, Orissa | Madras, Bombay | North-Western Provinces, Punjab, Central India
Who pays | Zamindar | Ryot (cultivator) | Village community (mahal) jointly
Revenue | Fixed for ever | Revised every 20–30 years | Revised periodically
Effects | Absentee landlords; sub-infeudation | High rates; moneylenders | Rigid demand; indebtedness`);

  /* ---------- Unit IX ---------- */
  D('inc-phases', 'Three phases of the national movement', 'H9', 'h9-inc,h9-swad,h9-gan', 'table', `
Phase | Years | Leaders | Methods
Moderate | 1885–1905 | Naoroji, Gokhale, Pherozeshah Mehta, Surendranath Banerjea | Petitions, prayers, protests; economic critique (drain)
Extremist | 1905–1919 | Lal-Bal-Pal, Aurobindo Ghosh | Swadeshi, boycott, passive resistance
Gandhian | 1919–1947 | Gandhi, Nehru, Patel, Azad, Bose | Mass satyagraha and non-violence`);
  D('bengal-partition', 'Partition of Bengal: causes and results', 'H9', 'h9-swad', 'cer', `
C: Official reason — Bengal too large to administer
C: Real aim — weaken Bengali nationalism; divide Hindus and Muslims
E: Partition of Bengal (Curzon) — in force 16 October 1905
R: Swadeshi and Boycott movement; national education; Bande Mataram
R: Moderate–Extremist rift → Surat split (1907)
R: Muslim League founded at Dacca (1906)
R: Partition annulled at the Delhi Durbar (1911); capital moved to Delhi`);
  D('gandhi-flow', 'Gandhian movements step by step', 'H9', 'h9-gan', 'flow', `
Champaran 1917 | Indigo peasants (tinkathia); first civil disobedience in India
Ahmedabad 1918 | Mill workers; Gandhi’s first hunger strike; 35% wage rise
Kheda 1918 | Crop failure; revenue remission; Vallabhbhai Patel joins
Rowlatt Satyagraha 1919 | First all-India call; Jallianwala Bagh (13 April)
Non-Cooperation 1920–22 | With the Khilafat movement; withdrawn after Chauri Chaura (Feb 1922)
Civil Disobedience 1930–34 | Dandi March (12 March–6 April 1930); Gandhi–Irwin Pact (1931)
Individual Satyagraha 1940–41 | Vinoba Bhave first, Nehru second
Quit India 1942 | “Do or die” (8 August); leaders arrested; parallel governments`);
  D('post47', 'India after 1947: the big steps', 'H9', 'h9-post', 'flow', `
Independence and Partition 1947 | 15 August; refugee crisis
Integration of states 1947–49 | Patel and V.P. Menon; Junagadh, Hyderabad, Kashmir
Constitution 1950 | In force 26 January; Ambedkar chairs the Drafting Committee
First general election 1951–52 | Universal adult franchise
First Five-Year Plan 1951 | Agriculture first
States Reorganisation 1956 | Linguistic states (Fazl Ali Commission)
Wars 1962, 1965, 1971 | China; Pakistan (Tashkent 1966); Bangladesh created
Emergency 1975–77 | Janata government follows (1977)
Economic reforms 1991 | Liberalisation, privatisation, globalisation`);

  /* ---------- Unit X ---------- */
  D('annales-gen', 'Annales school: four generations', 'H10', 'h10-phil', 'tree', `
Annales school (1929 →)
 Generation 1 — Lucien Febvre and Marc Bloch
  Total history, mentalities, problem-history
  Journal Annales founded at Strasbourg (1929)
 Generation 2 — Fernand Braudel
  Longue durée; geo-history
  The Mediterranean (1949)
 Generation 3 — Le Roy Ladurie, Le Goff, Duby, Ariès, Nora
  Mentalities; Montaillou; sites of memory
 Generation 4 — Roger Chartier
  Cultural history of books and reading`);
  D('braudel-time', 'Braudel’s three levels of time', 'H10', 'h10-phil', 'tree', `
Braudel’s historical time
 Longue durée — geographical time: mountains, seas, climate (very slow)
 Conjonctures — social time: economies, states, societies (medium)
 Événements — individual time: events and politics (fast — “dust”)`);
  D('polybius', 'Polybius: cycle of constitutions', 'H10', 'h10-anc', 'cycle', `
Monarchy | Rule of one, for all
Tyranny | Rule of one, for himself
Aristocracy | Rule of the best few
Oligarchy | Rule of the rich few
Democracy | Rule of the many
Mob rule (ochlocracy) | Disorder — a strong man restores monarchy`, 'Anacyclosis: constitutions decay and repeat.');
  D('vico-ages', 'Vico: three ages and the return (ricorso)', 'H10', 'h10-ren', 'cycle', `
Age of gods | Rule through religion and oracles
Age of heroes | Rule of aristocratic heroes
Age of men | Equality, reason, democracy — then decay`, 'Corsi e ricorsi: the cycle starts again.');
  D('ranke-vs-carr', 'Positivist vs relativist view of facts', 'H10', 'h10-meth,h10-phil', 'table', `
Question | Positivist / Rankean | Relativist / Carr
Do facts speak for themselves? | Yes — collect them from documents | No — the historian selects them
Aim | Show the past “as it actually was” | An unending dialogue between present and past
Role of historian | Neutral recorder | Interpreter shaped by his own time
Key names | Ranke, Comte, Langlois & Seignobos, Bury, Elton (defender) | Croce, Becker, Beard, Carr
Famous line | “No documents, no history” | “Study the historian before you study the facts”`);
  D('indian-schools', 'Indian historiography: who says what', 'H10', 'h10-ind', 'table', `
School | Main names | Key idea | Example work
Colonial | James Mill, V.A. Smith, James Tod | Static, despotic India; British rule as progress | The History of British India (1817)
Nationalist | K.P. Jayaswal, R.C. Majumdar, H.C. Raychaudhuri | Glorious past; self-rule in ancient India | Hindu Polity (1924)
Marxist | D.D. Kosambi, R.S. Sharma, Irfan Habib, Bipan Chandra | Modes of production; class; agrarian relations | An Introduction to the Study of Indian History (1956)
Cambridge | Anil Seal, Gallagher, Judith Brown, C.A. Bayly | Nationalism as elite competition | The Emergence of Indian Nationalism (1968)
Subaltern | Ranajit Guha, Partha Chatterjee, Shahid Amin | History from below; elite bias criticised | Subaltern Studies I (1982)`);
  D('research-method', 'Historical research: from sources to synthesis', 'H10', 'h10-res,h10-meth', 'flow', `
Heuristics | Search for and collect sources
External criticism | Is the document genuine? (date, author, forgery)
Internal criticism | Is it credible? (bias, accuracy, meaning)
Synthesis | Arrange facts, explain causes, use imagination carefully
Exposition | Write with notes, footnotes and bibliography; avoid plagiarism`, 'Langlois & Seignobos laid out these steps (1898).');

  /* ---------- Paper 1 ---------- */
  D('research-process', 'Research process (Paper 1)', 'P2', 'p1-res', 'flow', `
Identify the problem | A clear, researchable question
Review of literature | Find the gap
Hypothesis | A testable statement
Research design | Method, variables, tools
Sampling | Population and sample
Data collection | Questionnaire, interview, observation, archives
Analysis | Statistics or qualitative coding
Interpretation | Test the hypothesis, draw conclusions
Report | Thesis, references, research ethics`);
  D('comm-model', 'Communication process (Paper 1)', 'P4', 'p1-comm', 'flow', `
Sender | Has an idea
Encoding | Idea turned into words or symbols
Message | What is sent
Channel | Speech, print, digital — noise can enter here
Decoding | Receiver interprets the symbols
Receiver | Understands the message
Feedback | Response goes back to the sender`);
  D('teach-levels', 'Levels of teaching (Paper 1)', 'P1', 'p1-teach', 'table', `
Level | Proponent | Focus | Best for
Memory | Herbart | Recall of facts | Young learners
Understanding | Morrison | Meaning, relations, generalisations | Middle classes
Reflective | Hunt | Problem-solving, critical thinking | Higher classes`);
  D('square', 'Square of opposition (Paper 1 logic)', 'P6', 'p1-logic', 'tree', `
Square of opposition
 A — All S are P (universal affirmative)
  Contradictory of O · Contrary of E (cannot both be true)
 E — No S is P (universal negative)
  Contradictory of I
 I — Some S are P (particular affirmative)
  Subaltern of A · Subcontrary of O (cannot both be false)
 O — Some S are not P (particular negative)
  Subaltern of E`);
  D('he-bodies', 'Higher education bodies (Paper 1)', 'P10', 'p1-he', 'tree', `
Higher education in India
 Regulators and agencies
  UGC — 1953; statutory 1956: universities and grants
  AICTE — 1945; statutory 1987: technical education
  NCTE — statutory body (1995): teacher education
  NAAC — 1994: accreditation of institutions
  NBA — accreditation of programmes
  NTA — 2017: national tests, including UGC-NET
 Policies
  NPE 1968 · NPE 1986 (Programme of Action 1992) · NEP 2020
 NEP 2020 proposals
  HECI — one umbrella regulator`);
})(window.JRF);
