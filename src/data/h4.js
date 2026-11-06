/* UNIT IV — Medieval political history */
(function (J) {
  var T = J.T, Q = J.Q;

  T({ id: 'h4-src', u: 'H4', t: 'Sources of medieval Indian history', h: 2.5,
    p: [
      'Sultanate chronicles: **Hasan Nizami** – *Taj-ul-Maasir* (first official history) · **Minhaj-us-Siraj** – *Tabaqat-i-Nasiri* (to 1259/60) · **Ziauddin Barani** – *Tarikh-i-Firoz Shahi* & *Fatawa-i-Jahandari* · **Shams Siraj Afif** – *Tarikh-i-Firoz Shahi* · **Isami** – *Futuh-us-Salatin* · **Yahya Sirhindi** – *Tarikh-i-Mubarak Shahi* · Firoz Shah – *Futuhat-i-Firoz Shahi*.',
      '**Amir Khusrau**: *Khazain-ul-Futuh* (Alauddin’s conquests), *Miftah-ul-Futuh* (Jalaluddin), *Qiran-us-Sadain* (Bughra Khan meets Kaiqubad), *Ashiqa* (Deval Rani–Khizr Khan), *Nuh Sipihr* (Mubarak Shah), *Tughlaq Nama*.',
      'Mughal: **Babur** – *Baburnama* (Turki) · **Gulbadan Begum** – *Humayun Nama* · **Jauhar Aftabchi** – *Tazkirat-ul-Waqiat* · **Abbas Khan Sarwani** – *Tarikh-i-Sher Shahi* · **Abul Fazl** – *Akbarnama* (vol. 3 = *Ain-i-Akbari*) · **Badauni** – *Muntakhab-ut-Tawarikh* (critical of Akbar) · **Nizamuddin Ahmad** – *Tabaqat-i-Akbari*.',
      'Later: **Jahangir** – *Tuzuk-i-Jahangiri* · **Abdul Hamid Lahori** – *Badshahnama* · **Inayat Khan** – *Shahjahannama* · **Muhammad Kazim** – *Alamgirnama* · **Saqi Mustaid Khan** – *Maasir-i-Alamgiri* · **Khafi Khan** – *Muntakhab-ul-Lubab* · **Bhimsen** – *Nuskha-i-Dilkusha* · **Ishwardas Nagar** – *Futuhat-i-Alamgiri* · **Firishta** – *Tarikh-i-Firishta* (Bijapur).',
      '**Daftar-khanas** (record rooms): **firman** (emperor’s order), **nishan** (prince’s order), **hasb-ul-hukm** (wazir’s order on emperor’s behalf), **parwana**, **akhbarat** (newsletters by **waqia-navis**), **arzdasht** (petitions); merchants’ **bahis/pothis** (account books); Rajasthan archives (Bikaner, Jaipur — vakil reports).',
      'Sanskrit/regional: *Prithvirajavijaya* (Jayanaka), *Hammira Mahakavya* (Nayachandra Suri), *Prithviraj Raso* (Chand Bardai), Kashmir chronicles of **Jonaraja & Srivara**, *Amuktamalyada* (Krishnadevaraya), Marathi **bakhars**, Assamese **Buranjis**, Odisha **Madala Panji**.',
      'Foreign travellers: **Marco Polo** (Pandya, Kakatiya) · **Ibn Battuta** (Muhammad bin Tughlaq; *Rihla*) · **Nicolo Conti** (Devaraya I) · **Abdur Razzaq** (Devaraya II, 1443) · **Athanasius Nikitin** (Bahmani) · **Domingo Paes** (Krishnadevaraya) · **Fernao Nuniz** (Achyutaraya) · **Ralph Fitch** (Akbar) · **William Hawkins** & **Thomas Roe** (Jahangir) · **Pelsaert** (Jahangir) · **Peter Mundy, Tavernier, Bernier, Manucci** (Shah Jahan–Aurangzeb).'
    ],
    m: [['“Hasan Minhaj Barani Afif” = H M B A', 'Sultanate chroniclers roughly in time order: Hasan Nizami → Minhaj → Barani → Afif.'],
      ['Vijayanagara visitors “C-R-P-N”', 'Conti (Devaraya I) → Razzaq (Devaraya II) → Paes (Krishnadeva) → Nuniz (Achyuta).']],
    f: ['Khafi Khan wrote his history secretly because Aurangzeb had banned official history-writing after his tenth year.', 'Bernier was Dara Shikoh’s physician and later served a Mughal noble.'],
    d: 'Medieval sources\n Persian chronicles\n  Sultanate (Minhaj, Barani, Afif)\n  Mughal (Abul Fazl, Badauni, Lahori)\n Documents\n  Firman, Nishan, Hasb-ul-hukm, Akhbarat\n Regional\n  Bakhars, Buranjis, Madala Panji\n Travellers\n  Ibn Battuta, Razzaq, Paes, Bernier',
    k: ['Pick any three chroniclers and say which ruler each one wrote about.'],
    r: ['V.D. Mahajan ch. 1 (Sources)', 'Satish Chandra (bibliographies at chapter ends)'],
    q: [
      Q.mt('Match the work with the author:', ['Tabaqat-i-Nasiri', 'Tarikh-i-Firoz Shahi (earlier)', 'Futuh-us-Salatin', 'Taj-ul-Maasir'], ['Minhaj-us-Siraj', 'Ziauddin Barani', 'Isami', 'Hasan Nizami'], '', ['Work', 'Author']),
      Q.mt('Match the traveller with the ruler visited:', ['Nicolo Conti', 'Abdur Razzaq', 'Domingo Paes', 'Fernao Nuniz'], ['Devaraya I', 'Devaraya II', 'Krishnadevaraya', 'Achyutadevaraya'], '', ['Traveller', 'Ruler']),
      Q.mcq('An order issued by a Mughal prince was called:', ['Firman', 'Nishan', 'Parwana', 'Hasb-ul-hukm'], 1, ''),
      Q.mcq('Which work is critical of Akbar’s religious policy?', ['Akbarnama', 'Tabaqat-i-Akbari', 'Muntakhab-ut-Tawarikh', 'Ain-i-Akbari'], 2, 'Badauni.'),
      Q.mcq('Humayun Nama was written by:', ['Jauhar Aftabchi', 'Gulbadan Begum', 'Abul Fazl', 'Bayazid Bayat'], 1, ''),
      Q.ch('Arrange the European visitors to the Mughal court in order:', ['Ralph Fitch', 'William Hawkins', 'Thomas Roe', 'François Bernier'], '1580s → 1608 → 1615 → 1650s–60s.')
    ] });

  T({ id: 'h4-ds1', u: 'H4', t: 'Ghorids & the early Turkish (Ilbari) Sultans', h: 2.5,
    p: [
      '**Muhammad Ghori**: Multan 1175 · defeated at **Kayadara (1178)** by the Chaulukyas · took Lahore 1186 (last Ghaznavid) · **Tarain I (1191)** lost to **Prithviraj III** · **Tarain II (1192)** won · **Chandawar (1194)** killed Jayachandra · murdered by Khokhars 1206.',
      '**Bakhtiyar Khalji** raided Bihar (Odantapuri/Nalanda) and took **Nadia** from **Lakshmanasena** (c. 1204).',
      '**Qutbuddin Aibak (1206–10)**: “**Lakh Bakhsh**”; capital **Lahore**; **Quwwat-ul-Islam** mosque, began **Qutb Minar**, **Adhai Din ka Jhonpra** (Ajmer); died playing **chaugan** (polo).',
      '**Iltutmish (1210–36)**: real consolidator; capital **Delhi**; crushed Yildiz & Qubacha; kept away from the **Mongols** (refused shelter to Jalaluddin Mangbarni, 1221); created **Turkan-i-Chahalgani** (the Forty); organised **iqta**; issued **silver tanka & copper jital**; **investiture from the Abbasid Caliph (1229)**; completed Qutb Minar; built **Sultan Ghari** (first Islamic tomb in India).',
      '**Raziya (1236–40)**: only woman ruler of Delhi; promoted Abyssinian **Jamaluddin Yaqut**; gave up purdah; revolt of **Altunia** (Bhatinda) whom she married; killed 1240.',
      'Weak rulers → nobles’ power: **naib-i-mamlikat** post created under Bahram Shah. **Nasiruddin Mahmud (1246–66)** — Balban as naib; *Tabaqat-i-Nasiri* dedicated to him.',
      '**Balban (1266–87)**: kingship as **Niyabat-i-Khudai** & **Zill-i-Ilahi**; introduced **sijda & paibos**, Persian festival **Nauroz**; “**blood and iron**”; broke the Forty; created **diwan-i-arz** (military dept.); spies (**barids**); crushed **Tughril Khan** (Bengal) and Mewatis. Son Prince Muhammad killed fighting Mongols (1285).',
      'End: Kaiqubad & Kayumars → **Khalji revolution (1290)**.'
    ],
    m: [['“A-I-R-B” = Aibak, Iltutmish, Raziya, Balban', '“All Indians Respect Balban” — main Mamluk rulers in order.'],
      ['Tarain “1-9-1 lost, 1-9-2 won”', 'Ghori lost Tarain I (1191) and won Tarain II (1192).']],
    f: ['The name “Lakh Bakhsh” (giver of lakhs) shows Aibak’s generosity.', 'Iltutmish’s silver tanka weighed about 175 grains and became the base of later Indian silver currency.'],
    d: 'Ilbari / Mamluk rulers\n Qutbuddin Aibak (1206–10)\n Aram Shah (1210)\n Iltutmish (1210–36)\n Ruknuddin Firuz (1236)\n Raziya (1236–40)\n Bahram · Masud\n Nasiruddin Mahmud (1246–66)\n Balban (1266–87)\n Kaiqubad · Kayumars (–1290)',
    k: ['Compare Iltutmish and Balban as state-builders in four points.'],
    r: ['Satish Chandra ch. 5–6', 'V.D. Mahajan ch. 6–7'],
    q: [
      Q.mcq('Who received a letter of investiture from the Abbasid Caliph?', ['Qutbuddin Aibak', 'Iltutmish', 'Balban', 'Alauddin Khalji'], 1, '1229.'),
      Q.mcq('Who introduced sijda and paibos?', ['Iltutmish', 'Raziya', 'Balban', 'Alauddin'], 2, ''),
      Q.mcq('Turkan-i-Chahalgani was organised by:', ['Aibak', 'Iltutmish', 'Balban', 'Raziya'], 1, ''),
      Q.ch('Arrange the battles chronologically:', ['First Battle of Tarain', 'Second Battle of Tarain', 'Battle of Chandawar', 'Capture of Nadia by Bakhtiyar Khalji'], ''),
      Q.ar('Balban broke the power of the Chahalgani.', 'He believed that only a strong, awe-inspiring monarch could control the nobility.', 0, ''),
      Q.mt('Match the monument with its builder:', ['Quwwat-ul-Islam mosque', 'Sultan Ghari', 'Adhai Din ka Jhonpra', 'Alai Darwaza'], ['Qutbuddin Aibak', 'Iltutmish', 'Qutbuddin Aibak (Ajmer)', 'Alauddin Khalji'], '', ['Monument', 'Builder'])
    ] });

  T({ id: 'h4-ds2', u: 'H4', t: 'Khaljis: conquests, market control, revenue, army', h: 2.5,
    p: [
      '**Jalaluddin Khalji (1290–96)**: mild ruler; capital Kilokhri; settled Ulghu’s Mongols (“New Muslims”); executed **Sidi Maula**; killed by nephew **Alauddin** at Kara after the **Devagiri raid (1296)**.',
      '**Alauddin (1296–1316)** — “Sikandar-i-Sani”. North: **Gujarat 1299** (bought **Malik Kafur**), **Ranthambhor 1301** (Hammir Deva), **Chittor 1303** (Ratan Singh; Jayasi’s *Padmavat*, 1540, created the Padmini legend), Malwa 1305, Siwana, Jalor.',
      'South via **Malik Kafur**: **Devagiri 1307–08** (Ramachandra), **Warangal 1309–10** (Prataparudra), **Dvarasamudra 1310–11** (Ballala III), **Madurai 1311** (Pandyas). Policy: tribute, not annexation.',
      'Mongol attacks beaten: **Kili (1299)** Qutlugh Khwaja; **Targhi (1303)** besieged Delhi → **Siri** fort built; Amroha (1305); Ravi (1306).',
      '**Four ordinances** to stop revolts: confiscate grants (milk, inam, waqf); spy network; **ban on liquor**; nobles need permission to meet/marry.',
      '**Market control** (Barani): **Shahna-i-Mandi** (market superintendent), **Diwan-i-Riyasat**, **Sarai-i-Adl** (cloth & costly goods market), fixed prices of grain, cloth, horses, slaves, cattle; spies (**munhiyan**); grain stored; **Banjaras** carried grain.',
      'Revenue: land measured (**masahat**, unit **biswa**); demand **50%** of produce (kharaj) mainly in kind in the Doab; **ghari** (house tax) & **chari** (grazing tax); khuts, muqaddams, chaudharis lose privileges.',
      'Army: **first standing army paid in cash**; **dagh** (branding horses) & **huliya/chehra** (descriptive roll).',
      'Buildings: **Alai Darwaza (1311)** — earliest true dome built on Islamic principles (the earliest true arch is usually credited to **Balban’s tomb**); **Siri**; **Hauz-i-Alai**; unfinished **Alai Minar**.',
      'End: Mubarak Shah (1316–20) killed by **Khusrau Khan** → Ghazi Malik (Tughlaq) seized power 1320.'
    ],
    m: [['South raids “D-W-D-M” = “Delhi Wants Daily Money”', 'Devagiri → Warangal → Dvarasamudra → Madurai (Malik Kafur).'],
      ['Market staff “S-D-S”', 'Shahna-i-Mandi, Diwan-i-Riyasat, Sarai-i-Adl.']],
    f: ['Barani claims prices stayed the same throughout Alauddin’s reign, even in years of drought.', 'Alai Darwaza’s dome and pointed horseshoe arches show Seljuk-style craftsmanship brought by artisans fleeing the Mongols.'],
    d: 'Alauddin’s market control\n Why: pay a big army cheaply\n How\n  Fixed prices (grain, cloth, horses)\n  Shahna-i-Mandi + spies\n  Grain revenue in kind from Doab\n  Banjaras supply chain\n Effect\n  Stable prices; burden on peasants & traders',
    k: ['Explain why Alauddin needed price control (hint: Mongols + cash salaries).'],
    r: ['Satish Chandra ch. 7', 'V.D. Mahajan ch. 8–9'],
    q: [
      Q.mcq('Shahna-i-Mandi was the officer in charge of:', ['Revenue', 'Markets', 'Army', 'Spies'], 1, ''),
      Q.mcq('Which Sultan introduced dagh and huliya?', ['Balban', 'Alauddin Khalji', 'Muhammad bin Tughlaq', 'Firoz Tughlaq'], 1, ''),
      Q.ch('Arrange Malik Kafur’s campaigns chronologically:', ['Devagiri', 'Warangal', 'Dvarasamudra', 'Madurai'], ''),
      Q.mcq('Ghari and chari were taxes on:', ['Houses and grazing', 'Trade and salt', 'Pilgrims and markets', 'Liquor and horses'], 0, ''),
      Q.ar('Alauddin Khalji fixed the prices of essential goods.', 'He wanted to maintain a large standing army on low cash salaries.', 0, ''),
      Q.s2('Alai Darwaza is regarded as the first building in India with a true dome.', 'Siri fort was built after the Mongol siege of Delhi in 1303.', true, true, 'Balban’s tomb is credited with the earliest true arch.')
    ] });

  T({ id: 'h4-ds3', u: 'H4', t: 'Tughlaqs, Sayyids, Lodis, provincial kingdoms & decline', h: 3,
    p: [
      '**Ghiyasuddin Tughlaq (1320–25)**: built **Tughlaqabad**; Warangal annexed 1323; moderate revenue (increase limited to 1/10–1/11); canals; clash with **Nizamuddin Auliya** (“*Hunuz Dilli dur ast*”); died when a pavilion collapsed at Afghanpur.',
      '**Muhammad bin Tughlaq (1325–51)** experiments: ① **Doab tax increase** (during famine) ② **capital to Daulatabad (1327)** ③ **token currency (1329–30)** in copper/brass ④ **Khurasan** expedition (army raised, disbanded) ⑤ **Qarachil** (Kumaon) disaster. Created **Diwan-i-Kohi** (agriculture dept.) & gave **sondhar/taqavi** loans.',
      'Ibn Battuta served as **qazi of Delhi** and was sent as envoy to **China (1342)**. Revolts: **Madurai** (1335), **Vijayanagara (1336)**, **Bengal**, **Bahmani (1347)**. Died at **Thatta (1351)** — Badauni: “the king was freed of his people and they of him.”',
      '**Firoz Shah Tughlaq (1351–88)**: **Diwan-i-Khairat** (charity), **Dar-ul-Shifa** (hospital), **Diwan-i-Bandagan** (slaves; ~1,80,000), employment bureau; canals (**Western Yamuna**), towns (**Firozabad, Hisar, Jaunpur, Fatehabad**); brought **Ashokan pillars** (Topra, Meerut) to Delhi; taxes per sharia + **haq-i-sharb** (irrigation, 1/10); **jizya on brahmanas**; made **iqtas & army posts hereditary**; *Futuhat-i-Firoz Shahi*; Sanskrit books translated after **Nagarkot**.',
      '**Timur’s invasion (1398)** sacked Delhi in Nasiruddin Mahmud Tughlaq’s reign.',
      '**Sayyids (1414–51)**: **Khizr Khan** (Timur’s deputy, took title *Rayat-i-Ala*, not Sultan) → Mubarak Shah → Muhammad Shah → Alam Shah (gave Delhi to Bahlul Lodi).',
      '**Lodis (1451–1526)**: **Bahlul** (first Afghan dynasty; conquered Jaunpur; nobles as equals) → **Sikandar (1489–1517)**: founded **Agra (1504)**, **gaz-i-Sikandari** (land measure), pen-name **Gulrukhi**, abolished corn duty → **Ibrahim (1517–26)**: alienated nobles (**Daulat Khan Lodi** invited Babur); lost **Khatauli (1517–18)** to Rana Sanga; killed at **Panipat 1526**.',
      'Provincial kingdoms: **Jaunpur** (Sharqis; Atala Masjid), **Bengal** (Ilyas Shah; Adina mosque; Husain Shah), **Gujarat** (Ahmad Shah – Ahmedabad 1411; **Mahmud Begarha**), **Malwa** (Mandu; Hoshang Shah), **Kashmir** (**Zain-ul-Abidin “Budshah”**), **Mewar** (**Rana Kumbha** – Vijay Stambh, Kumbhalgarh; Rana Sanga).',
      'Decline of the Sultanate: Muhammad bin Tughlaq’s failed projects, Firoz’s hereditary iqtas & slave corps, **Timur 1398**, provincial breakaways, noble factions & no succession law.'
    ],
    m: [['MBT’s 5 experiments = “D-C-T-K-Q”', 'Doab tax, Capital shift, Token currency, Khurasan, Qarachil — “Daddy Can’t Take Kids Quietly”.'],
      ['Firoz’s 4 Diwans = “K-S-B-I”', 'Khairat (charity), Shifa (hospital), Bandagan (slaves), Istihqaq (pensions).']],
    f: ['Firoz moved Ashoka’s 40-tonne Topra pillar to Delhi on a 42-wheeled cart pulled by 8,400 men, wrapped in silk cotton.', 'Ibn Battuta survived being robbed and shipwrecked on his way to China as MBT’s envoy.'],
    d: 'Delhi Sultanate dynasties\n Mamluk/Ilbari (1206–1290)\n Khalji (1290–1320)\n Tughlaq (1320–1414)\n Sayyid (1414–1451)\n Lodi (1451–1526)',
    k: ['Defend Muhammad bin Tughlaq: give one sensible reason behind each experiment.'],
    r: ['Satish Chandra ch. 7, 10', 'V.D. Mahajan ch. 10–13'],
    q: [
      Q.mcq('Diwan-i-Kohi was established by:', ['Alauddin Khalji', 'Ghiyasuddin Tughlaq', 'Muhammad bin Tughlaq', 'Firoz Tughlaq'], 2, ''),
      Q.mt('Match the department with its function:', ['Diwan-i-Khairat', 'Diwan-i-Bandagan', 'Diwan-i-Arz', 'Diwan-i-Kohi'], ['Charity', 'Slaves', 'Military', 'Agriculture'], '', ['Department', 'Function']),
      Q.mcq('Who founded the city of Agra?', ['Bahlul Lodi', 'Sikandar Lodi', 'Ibrahim Lodi', 'Babur'], 1, ''),
      Q.ch('Arrange in chronological order:', ['Token currency of Muhammad bin Tughlaq', 'Timur’s invasion', 'Foundation of Agra', 'First Battle of Panipat'], ''),
      Q.mcq('Which Sayyid ruler did NOT take the title of Sultan?', ['Khizr Khan', 'Mubarak Shah', 'Muhammad Shah', 'Alam Shah'], 0, ''),
      Q.ar('Firoz Shah Tughlaq weakened the Sultanate in the long run.', 'He made iqtas and military posts hereditary.', 0, ''),
      Q.mt('Match the provincial kingdom with a ruler:', ['Kashmir', 'Gujarat', 'Jaunpur', 'Mewar'], ['Zain-ul-Abidin', 'Mahmud Begarha', 'Ibrahim Shah Sharqi', 'Rana Kumbha'], '', ['Kingdom', 'Ruler'])
    ] });

  T({ id: 'h4-mug1', u: 'H4', t: 'Babur, Humayun and the Sur interlude', h: 2.5,
    p: [
      '**Babur**: Timurid (father) + Chingizid (mother); from **Farghana**; took **Kabul 1504**; invited by **Daulat Khan Lodi**.',
      '**First Panipat (21 April 1526)** vs Ibrahim Lodi — **tulughma** (flanking) + **araba** carts in Ottoman (“Rumi”) style + artillery (**Ustad Ali, Mustafa**).',
      '**Khanwa (1527)** vs **Rana Sanga** — declared jihad, gave up wine, abolished **tamgha** for Muslims, took title **Ghazi**. **Chanderi (1528)** vs Medini Rai. **Ghaghra (1529)** vs Afghans (Mahmud Lodi) & Nusrat Shah of Bengal.',
      'Babur died at Agra (1530), buried at Kabul. ***Baburnama*** in Chaghatai Turki (Persian translation by **Abdur Rahim Khan-i-Khanan**). Built charbagh gardens (Ram Bagh, Agra).',
      '**Humayun (1530–40; 1555–56)**: divided empire with brothers (**Kamran** got Kabul–Kandahar–Punjab); built **Dinpanah**; Gujarat campaign vs Bahadur Shah (1535); lost **Chausa (1539)** & **Kanauj/Bilgram (1540)** to Sher Khan; exile in **Persia** (Shah Tahmasp); won **Machhiwara & Sirhind (1555)**; died falling from the **Sher Mandal** library stairs (1556).',
      '**Humayun’s tomb** (built by **Bega Begum**, architect **Mirak Mirza Ghiyas**) = first great **charbagh garden-tomb**, model for the Taj.',
      '**Sher Shah Sur (1540–45)**: Farid of **Sasaram**; Malwa, **Raisen (1543)**, Marwar — **Battle of Samel/Giri-Sumel (1544)** vs **Maldeo** (“for a handful of bajra…”); died at **Kalinjar (1545)** in a gunpowder blast; tomb at **Sasaram**.',
      'Sher Shah’s reforms: **rupiya** (silver, ~178 grains) & **dam** (copper); **Sarak-i-Azam/GT Road** (Sonargaon–Peshawar) with **sarais** & dak chowkis; land **measured** (gaz-i-Sikandari, **jarib**), crop-rate schedule **rai**, demand **1/3** of average produce, **patta & qabuliyat**; local responsibility for crime (**muqaddams**).',
      'Sur administration: sarkar (**shiqdar-i-shiqdaran**, **munsif-i-munsifan**), pargana (**shiqdar, amin, fotedar, karkuns**). Built **Purana Qila** (Qila-i-Kuhna mosque) & **Rohtas fort**.',
      'After Sher Shah: **Islam Shah**; **Hemu** (minister of Adil Shah Sur) took Delhi as “Vikramaditya” (1556) before Second Panipat.'
    ],
    m: [['Babur’s 4 battles = “Panipat Khanwa Chanderi Ghaghra” = “People Keep Calling Ghaghra”', '1526, 1527, 1528, 1529 — one per year!'],
      ['Humayun’s 2 losses = “Chausa-Kanauj”, 2 wins = “Machhiwara-Sirhind”', '1539–40 lost; 1555 regained.']],
    f: ['Lane-Poole wrote that Humayun “tumbled through life and tumbled out of it”.', 'Sher Shah’s rupiya is the ancestor of today’s rupee.'],
    d: 'Sher Shah’s land revenue\n Measure land (jarib)\n Classify (good / middling / bad)\n Average produce\n Rai (crop-rate schedule)\n State share 1/3\n Patta (title) ↔ Qabuliyat (agreement)',
    k: ['Teach Sher Shah’s revenue system step by step like a recipe.'],
    r: ['Satish Chandra ch. 12', 'V.D. Mahajan Mughal part ch. 2–4'],
    q: [
      Q.mt('Match the battle with the year:', ['First Panipat', 'Khanwa', 'Chanderi', 'Ghaghra'], ['1526', '1527', '1528', '1529'], '', ['Battle', 'Year']),
      Q.mcq('Humayun was defeated at Chausa in:', ['1537', '1539', '1540', '1545'], 1, ''),
      Q.mcq('The Battle of Samel (Giri-Sumel) was fought between Sher Shah and:', ['Maldeo', 'Puran Mal', 'Rana Sanga', 'Humayun'], 0, ''),
      Q.mcq('Patta and qabuliyat were introduced by:', ['Babur', 'Sher Shah', 'Akbar', 'Alauddin'], 1, ''),
      Q.ar('Babur won at Panipat despite a smaller army.', 'He used tulughma tactics, carts and field artillery.', 0, ''),
      Q.ch('Arrange chronologically:', ['Battle of Khanwa', 'Battle of Chausa', 'Battle of Samel', 'Second Battle of Panipat'], '1527 → 1539 → 1544 → 1556.')
    ] });

  T({ id: 'h4-mug2', u: 'H4', t: 'Akbar to Aurangzeb: expansion & consolidation', h: 4,
    p: [
      '**Akbar (1556–1605)**: born **Amarkot** (1542); crowned at **Kalanaur**; **Second Panipat (5 Nov 1556)** vs **Hemu** (regent **Bairam Khan**, till 1560); “petticoat government” (Maham Anaga) 1560–64.',
      'Rajput policy: marriage with **Bharmal’s daughter (Amber, 1562)**; abolished **pilgrim tax (1563)** & **jizya (1564)**; **Chittor (1568)**, Ranthambhor (1569); **Haldighati (1576)** vs **Maharana Pratap** (Mughal side led by **Man Singh**).',
      'Expansion: **Gujarat 1572–73** (→ **Buland Darwaza**), Bengal 1576, Kabul 1581, **Kashmir 1586**, Sindh 1591, Odisha 1592, Kandahar 1595; Deccan — Berar 1596, **Ahmadnagar 1600** (**Chand Bibi**), **Asirgarh 1601** (last conquest).',
      'Religion: **Ibadat Khana (1575)** at Fatehpur Sikri (opened to all 1578) → **Mahzar (1579)** → **Din-i-Ilahi/Tauhid-i-Ilahi (1582)** (Birbal only Hindu member) → **Sulh-i-kul**; Jesuits (**Acquaviva, Monserrate**), Jain **Hiravijaya Suri**, Parsi **Dastur Meherji Rana**; **Ilahi era**; translation bureau (**Maktab Khana**) – *Razmnama* (Mahabharata).',
      '**Jahangir (1605–27)**: **chain of justice**; executed **Guru Arjan (1606)** for helping rebel Khusrau; married **Nur Jahan (1611)** — “junta” of **Itimad-ud-Daula, Asaf Khan, Khurram**; Mewar peace (1615); Kangra (1620); Kandahar lost (1622); **Hawkins & Roe** came; **Mahabat Khan’s coup (1626)**; painting peak (**Mansur, Abul Hasan, Bishandas**).',
      '**Shah Jahan (1628–58)**: revolts of **Khan Jahan Lodi** & **Bundelas**; **Ahmadnagar annexed (1633)**; Deed of Submission (1636) from Bijapur & Golconda; **Balkh–Badakhshan** failure (1646–47); **Kandahar lost (1649)**; **Peacock Throne**, **Taj Mahal** (Ustad Ahmad Lahori), **Shahjahanabad/Red Fort** (1639–48), Jama Masjid.',
      'War of succession (1657–59): **Dharmat** (Aurangzeb & Murad beat Jaswant Singh) → **Samugarh** (Dara beaten) → **Khajwa** (Shuja) → **Deorai** (Dara). Shah Jahan confined in **Agra fort** till 1666.',
      '**Aurangzeb (1658–1707)**: “Alamgir”, “Zinda Pir”; stopped music at court, **jharokha darshan**, tuladan, Nauroz; **jizya reimposed 1679**; temples destroyed (Vishwanath 1669, Keshav Rai 1670).',
      'Revolts: **Jats** (Gokula 1669, Rajaram, Churaman), **Satnamis (1672)**, **Sikhs** (**Guru Tegh Bahadur** executed 1675), **Rajputs** (Marwar after Jaswant Singh, **Durgadas**, Ajit Singh; Prince Akbar’s revolt 1681), **Afghans** (Yusufzai, Afridi).',
      'Deccan: **Bijapur 1686**, **Golconda 1687** annexed; **Sambhaji executed 1689**; long war with Marathas; died **Ahmednagar 1707**, buried **Khuldabad**. *Fatawa-i-Alamgiri* compiled; **Bibi ka Maqbara** (Aurangabad, by Azam Shah).'
    ],
    m: [['Akbar’s religion path “I-M-D-S”', 'Ibadat Khana 1575 → Mahzar 1579 → Din-i-Ilahi 1582 → Sulh-i-kul: “I Make Dal Sweet”.'],
      ['Succession war “D-S-K-D”', 'Dharmat, Samugarh, Khajwa, Deorai — “Don’t Steal Kids’ Doughnuts”.']],
    f: ['Akbar could not read or write, yet his library had about 24,000 manuscripts.', 'The Peacock Throne took seven years to make and was carried off by Nadir Shah in 1739.'],
    d: 'Great Mughals\n Babur (1526–30)\n Humayun (1530–40, 1555–56)\n Akbar (1556–1605)\n Jahangir (1605–27)\n Shah Jahan (1628–58)\n Aurangzeb (1658–1707)',
    k: ['Tell the story of the war of succession as four “episodes” with winners and losers.'],
    r: ['Satish Chandra ch. 13, 15, 18, 19', 'V.D. Mahajan Mughal ch. 5 onwards'],
    q: [
      Q.mcq('The Ibadat Khana was built in:', ['1562', '1575', '1579', '1582'], 1, ''),
      Q.mcq('Who commanded the Mughal army at Haldighati?', ['Todar Mal', 'Man Singh', 'Abdur Rahim', 'Bairam Khan'], 1, ''),
      Q.ch('Arrange the battles of the war of succession in order:', ['Dharmat', 'Samugarh', 'Khajwa', 'Deorai'], ''),
      Q.mt('Match the Mughal emperor with the event:', ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'], ['Abolition of jizya', 'Execution of Guru Arjan', 'Loss of Kandahar (1649)', 'Reimposition of jizya'], '', ['Emperor', 'Event']),
      Q.mcq('Bijapur and Golconda were annexed by Aurangzeb in:', ['1676 and 1677', '1686 and 1687', '1689 and 1690', '1698 and 1699'], 1, ''),
      Q.ar('Akbar issued the Mahzar in 1579.', 'It allowed him to choose among interpretations of Islamic law as Imam-i-Adil.', 0, ''),
      Q.st('Which of the following were members of the “Nur Jahan junta”?', ['Itimad-ud-Daula', 'Asaf Khan', 'Prince Khurram', 'Mahabat Khan'], [true, true, true, false], 'Mahabat Khan led a coup against them.')
    ] });

  T({ id: 'h4-mug3', u: 'H4', t: 'Later Mughals & decline of the Mughal Empire (debates)', h: 2,
    p: [
      '**Bahadur Shah I (1707–12)** — won **Jajau** vs Azam; released **Shahu**; “Shah-i-Bekhabar”; Banda Bahadur’s revolt.',
      '**Jahandar Shah (1712–13)** — **Zulfiqar Khan** as wazir; **ijara** (revenue farming) spreads.',
      '**Farrukhsiyar (1713–19)** — **Sayyid brothers** (Abdullah Khan & Husain Ali Khan, “king-makers”); **1717 farman** to the East India Company; Banda executed 1716.',
      '**Muhammad Shah “Rangila” (1719–48)**: rise of successor states — **Murshid Quli Khan** (Bengal), **Saadat Khan** (Awadh, 1722), **Nizam-ul-Mulk** (Hyderabad; **Shakar Kheda 1724**); **Baji Rao’s raid on Delhi (1737)**; **Nadir Shah (1739)** — **Karnal**, massacre, took **Peacock Throne & Koh-i-Noor**.',
      '**Ahmad Shah Abdali** raids (1748–67); **Third Panipat 1761**. **Shah Alam II** (1759–1806): **Buxar 1764**, **Allahabad treaty 1765** (Diwani); returned to Delhi under **Mahadji Sindhia (1772)**; blinded by Ghulam Qadir (1788); British control from **1803**.',
      '**Akbar II** sent **Ram Mohan Roy** to England (gave title “Raja”). **Bahadur Shah II “Zafar”** — led 1857, exiled to **Rangoon** (d. 1862).',
      'Decline debates — **J.N. Sarkar** (Aurangzeb’s policies & personal failings) · **Satish Chandra** (crisis of the **jagirdari system**; *Parties and Politics at the Mughal Court*) · **Irfan Habib** (**agrarian crisis**, over-exploitation, peasant revolts) · **M. Athar Ali** (shortage of jagirs, “cultural failure”).',
      'Revisionists: **Muzaffar Alam** (*Crisis of Empire in Mughal North India* — regional prosperity in Awadh/Punjab) · **C.A. Bayly** (*Rulers, Townsmen and Bazaars* — rise of intermediaries) · **Karen Leonard** (“**great firm**” theory — bankers withdrew support) · **André Wink** (**fitna** – sedition/alliance politics) · **J.F. Richards** (Deccan drain).'
    ],
    m: [['Later Mughals “Big Jumbo Fries Make All Americans Smile After Burgers”', 'Bahadur Shah I, Jahandar, Farrukhsiyar, Muhammad Shah, Ahmad Shah, Alamgir II, Shah Alam II, Akbar II, Bahadur Shah II.'],
      ['Decline schools: “Aligarh = crisis; Revisionist = regions”', 'Habib/Chandra/Athar Ali → crisis of the system; Alam/Bayly/Wink → regional reorganisation, not just decay.']],
    f: ['The 1717 farman of Farrukhsiyar is often called the “Magna Carta” of the East India Company.', 'Nadir Shah took so much loot from Delhi that he exempted Iran from taxes for three years.'],
    d: 'Decline of Mughals — explanations\n Personal / religious\n  J.N. Sarkar\n Structural (Aligarh school)\n  Jagirdari crisis — Satish Chandra\n  Agrarian crisis — Irfan Habib\n  Jagir shortage — Athar Ali\n Regional / revisionist\n  Muzaffar Alam, C.A. Bayly\n  Great firm — Karen Leonard\n  Fitna — André Wink',
    k: ['Pick one “Aligarh” and one “revisionist” historian and explain the difference in one minute.'],
    r: ['Satish Chandra ch. 19–20', 'IGNOU MHI-104 (18th century block)'],
    q: [
      Q.mt('Match the historian with the explanation of Mughal decline:', ['Irfan Habib', 'Satish Chandra', 'Karen Leonard', 'Muzaffar Alam'], ['Agrarian crisis', 'Crisis of the jagirdari system', 'Great firm theory', 'Regional prosperity and new elites'], '', ['Historian', 'Explanation']),
      Q.mcq('Who were known as the “king-makers” in the early 18th century?', ['Nizam-ul-Mulk and Saadat Khan', 'Sayyid brothers', 'Zulfiqar Khan and Asad Khan', 'Mahadji Sindhia and Nana Phadnavis'], 1, ''),
      Q.ch('Arrange chronologically:', ['Farman of Farrukhsiyar to the EIC', 'Nadir Shah’s invasion', 'Third Battle of Panipat', 'Battle of Buxar'], '1717 → 1739 → 1761 → 1764.'),
      Q.mcq('“The Crisis of Empire in Mughal North India” was written by:', ['C.A. Bayly', 'Muzaffar Alam', 'Satish Chandra', 'Athar Ali'], 1, '')
    ] });

  T({ id: 'h4-vij', u: 'H4', t: 'Vijayanagara, Bahmanis, Deccan Sultanates, Eastern Gangas & Gajapatis', h: 3,
    p: [
      '**Vijayanagara** founded **1336** by **Harihara & Bukka** (Sangama) with sage **Vidyaranya**; capital **Hampi** on the Tungabhadra. Four dynasties: **Sangama → Saluva → Tuluva → Aravidu**.',
      'Sangama: **Devaraya I** (dam on Tungabhadra; **Nicolo Conti**), **Devaraya II** (Muslims in army; **Abdur Razzaq 1443**).',
      '**Krishnadevaraya (1509–29)**, Tuluva: *Amuktamalyada* (Telugu); **Ashtadiggajas** (e.g. **Allasani Peddana**, Tenali Ramakrishna); took **Raichur (1520)** from Bijapur; defeated **Prataparudra Gajapati**; ally of Portuguese; **Domingo Paes** visited; Vithala & Hazara Rama temples.',
      '**Battle of Talikota / Rakshasi-Tangadi (23 Jan 1565)**: **Bijapur, Ahmadnagar, Golconda, Bidar** defeated **Rama Raya** → Hampi sacked; Aravidus ruled from Penukonda/Chandragiri.',
      '**Bahmani kingdom (1347)**: **Alauddin Hasan Bahman Shah** at **Gulbarga** → capital **Bidar** (Ahmad Shah Wali, 1425); **Firoz Shah Bahmani** (observatory at Daulatabad); **Mahmud Gawan** (wazir 1463–81; madrasa at Bidar; 4 tarafs → 8; executed 1481).',
      'Five **Deccan Sultanates**: **Bijapur (Adil Shahi)**, **Ahmadnagar (Nizam Shahi)**, **Berar (Imad Shahi)**, **Golconda (Qutb Shahi)**, **Bidar (Barid Shahi)**. Berar → Ahmadnagar (1574); Bidar → Bijapur (1619); Ahmadnagar → Mughals (1633); Bijapur (1686) & Golconda (1687) → Aurangzeb.',
      '**Bijapur**: **Ibrahim Adil Shah II** (*Kitab-i-Nauras*, “Jagadguru”), **Gol Gumbaz** (Muhammad Adil Shah). **Golconda**: **Muhammad Quli Qutb Shah** founded **Hyderabad (1591)**, **Charminar**; diamonds. **Ahmadnagar**: **Chand Bibi**; **Malik Ambar** (revenue settlement, guerrilla war, founded Khadki/Aurangabad).',
      '**Eastern Gangas** (Odisha): **Anantavarman Chodaganga** (Jagannath temple, Puri), **Narasimhadeva I** (**Konark Sun temple**, 13th c.).',
      '**Suryavamshi Gajapatis (1434–1541)**: **Kapilendra Deva** (founder), **Purushottama**, **Prataparudra** (devotee of **Chaitanya**; lost to Krishnadevaraya).'
    ],
    m: [['Vijayanagara “Sangama Saluva Tuluva Aravidu” = “Some Silly Tigers Attack”', 'S-S-T-A in order.'],
      ['Deccan sultanates “BAG-BB”', 'Bijapur, Ahmadnagar, Golconda, Berar, Bidar. Talikota alliance = all except Berar.']],
    f: ['Abdur Razzaq described seven concentric fortifications at Vijayanagara.', 'Gol Gumbaz has one of the largest unsupported domes in the world and a whispering gallery.'],
    d: 'Bahmani break-up\n Bahmani (Gulbarga → Bidar)\n  Bijapur — Adil Shahi\n  Ahmadnagar — Nizam Shahi\n  Berar — Imad Shahi\n  Golconda — Qutb Shahi\n  Bidar — Barid Shahi',
    k: ['Narrate the Battle of Talikota in 5 sentences: who, why, where, result, aftermath.'],
    r: ['Satish Chandra ch. 9, 14', 'V.D. Mahajan ch. 14–15'],
    q: [
      Q.mt('Match the Deccan Sultanate with its dynasty:', ['Bijapur', 'Ahmadnagar', 'Golconda', 'Berar'], ['Adil Shahi', 'Nizam Shahi', 'Qutb Shahi', 'Imad Shahi'], '', ['Sultanate', 'Dynasty']),
      Q.mcq('Amuktamalyada was written by:', ['Devaraya II', 'Krishnadevaraya', 'Allasani Peddana', 'Achyutaraya'], 1, ''),
      Q.mcq('Which Deccan Sultanate did NOT join the alliance at Talikota?', ['Bijapur', 'Golconda', 'Berar', 'Ahmadnagar'], 2, ''),
      Q.mcq('Mahmud Gawan was the minister of the:', ['Vijayanagara empire', 'Bahmani kingdom', 'Bijapur sultanate', 'Gajapatis'], 1, ''),
      Q.ch('Arrange the Vijayanagara dynasties in order:', ['Sangama', 'Saluva', 'Tuluva', 'Aravidu'], ''),
      Q.mcq('The Konark Sun temple was built by:', ['Anantavarman Chodaganga', 'Narasimhadeva I', 'Kapilendra Deva', 'Prataparudra'], 1, '')
    ] });

  T({ id: 'h4-mar', u: 'H4', t: 'Marathas: Shivaji, Peshwas, Confederacy, decline', h: 3,
    p: [
      'Roots: Western Ghats & forts, Bhakti saints (**Jnaneshwar, Namdev, Eknath, Tukaram, Ramdas**), Maratha service in Deccan sultanates (**Shahji Bhonsle**).',
      '**Shivaji** (b. **Shivneri, 1630**; mother **Jijabai**; guardian **Dadaji Kondadev**): Torna (1646) · Javli (1656) · killed **Afzal Khan** at **Pratapgarh (1659)** · night attack on **Shaista Khan** (Pune, 1663) · sacked **Surat (1664, 1670)**.',
      '**Treaty of Purandar (1665)** with **Jai Singh** — 23 forts surrendered; Agra visit & escape (1666). **Coronation at Raigad (1674)** by **Gaga Bhatt** — “Chhatrapati”. Karnataka campaign (Jinji, Vellore) 1677–78; died 1680.',
      '**Ashtapradhan**: **Peshwa** (PM), **Amatya/Mazumdar** (finance), **Sachiv/Shurunavis** (correspondence), **Mantri/Waqia-navis** (intelligence, household), **Senapati/Sar-i-Naubat** (army), **Sumant/Dabir** (foreign affairs), **Nyayadhish** (justice), **Panditrao** (religion). Only Nyayadhish & Panditrao had no military duty.',
      'Revenue: survey by **Annaji Datto**; demand rose to 40%; **chauth** (1/4 of revenue from neighbouring areas) & **sardeshmukhi** (extra 10%). Army: **paga/bargirs** (state horses) & **shiledars** (own horses); Mavali infantry; navy (later **Kanhoji Angre**).',
      'Successors: **Sambhaji** (executed 1689) → **Rajaram** (Jinji) → **Tarabai** (regent) → **Shahu** (released 1707; **Battle of Khed**; Satara vs Kolhapur; **Treaty of Warna 1731**).',
      'Peshwas: **Balaji Vishwanath** (1713–20; **1719 Mughal grants** of chauth & sardeshmukhi) → **Baji Rao I** (1720–40; **Palkhed 1728** vs Nizam; Delhi raid 1737; **Bhopal 1738**; Bassein from Portuguese 1739) → **Balaji Baji Rao / Nana Saheb** (1740–61; **Sangola 1750**; **Third Panipat 14 Jan 1761** — Sadashivrao Bhau vs **Ahmad Shah Abdali**).',
      'Later: **Madhav Rao I** (revival) → Narayan Rao (murdered 1773) → **Raghunath Rao** vs **Barbhai council (Nana Phadnavis)** → Sawai Madhav Rao → **Baji Rao II** (**Treaty of Bassein 1802**).',
      '**Confederacy**: Peshwa (Pune), **Bhonsle (Nagpur), Gaekwad (Baroda), Holkar (Indore), Sindhia (Gwalior)**.',
      'Anglo-Maratha wars: **I (1775–82)** — Wadgaon humiliation, **Salbai 1782** · **II (1803–05)** — **Assaye, Laswari**; treaties Deogaon, Surji-Arjangaon · **III (1817–18)** — **Koregaon**, Kirkee, Ashti; Peshwaship abolished. Decline: disunity, Panipat losses, no modern army discipline, British diplomacy & subsidiary alliance.'
    ],
    m: [['Ashtapradhan “P-A-S-M-S-S-N-P” = “Please Are Shivaji’s Men Sure Strong? No Problem!”', 'Peshwa, Amatya, Sachiv, Mantri, Senapati, Sumant, Nyayadhish, Panditrao.'],
      ['Peshwas “B-B-B-M” = “Balaji, Baji, Balaji, Madhav”', 'Balaji Vishwanath → Baji Rao I → Balaji Baji Rao (Nana Saheb) → Madhav Rao I.']],
    f: ['Shivaji escaped from Agra hidden in baskets of sweets (traditional account).', 'At Third Panipat, the Marathas’ artillery was commanded by Ibrahim Khan Gardi, trained by the French.'],
    d: 'Maratha Confederacy\n Chhatrapati (Satara) — nominal\n Peshwa (Pune) — head\n  Bhonsle — Nagpur\n  Gaekwad — Baroda\n  Holkar — Indore\n  Sindhia — Gwalior',
    k: ['Explain chauth and sardeshmukhi like a “protection fee + bonus” to a friend.'],
    r: ['Satish Chandra ch. 18–19', 'Spectrum: Anglo-Maratha wars'],
    q: [
      Q.mcq('The Treaty of Purandar (1665) was signed between Shivaji and:', ['Shaista Khan', 'Jai Singh', 'Afzal Khan', 'Aurangzeb directly'], 1, ''),
      Q.mt('Match the Ashtapradhan post with the function:', ['Amatya', 'Sumant', 'Sachiv', 'Panditrao'], ['Finance', 'Foreign affairs', 'Royal correspondence', 'Religious matters'], '', ['Post', 'Function']),
      Q.mcq('Third Battle of Panipat was fought in:', ['1748', '1757', '1761', '1764'], 2, ''),
      Q.mt('Match the Maratha house with its seat:', ['Bhonsle', 'Gaekwad', 'Holkar', 'Sindhia'], ['Nagpur', 'Baroda', 'Indore', 'Gwalior'], '', ['House', 'Seat']),
      Q.ch('Arrange chronologically:', ['Treaty of Purandar', 'Coronation of Shivaji', 'Treaty of Salbai', 'Treaty of Bassein'], '1665 → 1674 → 1782 → 1802.'),
      Q.ar('Chauth was a levy of one-fourth of land revenue.', 'Marathas collected it from areas outside their direct rule as protection money.', 0, '')
    ] });
})(window.JRF);
