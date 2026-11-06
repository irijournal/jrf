/* UNIT V — Medieval administration & economy */
(function (J) {
  var T = J.T, Q = J.Q;

  T({ id: 'h5-sadm', u: 'H5', t: 'Sultanate administration, nature of state, iqta, succession', h: 2.5,
    p: [
      '**Nature of state** debate: **theocratic** (sharia, ulema, Caliph’s investiture, jizya) vs **secular-military in practice** (sultan’s own laws = **zawabit**; Barani’s *Fatawa-i-Jahandari*). Alauddin told Qazi Mughis he did what was good for the state.',
      'Central departments: **Diwan-i-Wizarat** (finance; **wazir**; mushrif-i-mamalik = accountant-general, mustaufi-i-mamalik = auditor-general) · **Diwan-i-Arz** (military; **ariz-i-mamalik**; created by Balban) · **Diwan-i-Insha** (royal correspondence; dabir-i-khas) · **Diwan-i-Risalat** (religious matters & appeals; **sadr-us-sudur**) · **Diwan-i-Qaza** (justice; qazi-ul-quzat).',
      'Household & court: **wakil-i-dar**, **amir-i-hajib** (ceremonial), **barid-i-mamalik** (intelligence & post), amir-i-akhur (stables).',
      'Special departments: **Diwan-i-Mustakhraj** (arrears – Alauddin), **Diwan-i-Riyasat** (markets – Alauddin), **Diwan-i-Kohi** (agriculture – MBT), **Diwan-i-Khairat, Bandagan, Istihqaq** (Firoz).',
      '**Iqta** = revenue assignment in lieu of salary; holder = **muqti/wali**; collects revenue, maintains troops, transferable. **Iltutmish** institutionalised it; **Balban** added **khwajas** (auditors); **Alauddin** tightened audit & transfers; **MBT** separated revenue collection from army pay; **Firoz** made iqtas **hereditary** (weakened state).',
      'Local: **shiq** (shiqdar) → **pargana** (amil, mushrif) → village (**khut, muqaddam, chaudhari, patwari**). **Khalisa** = crown land under direct collection.',
      'Taxes: **kharaj** (land tax; 1/5 → 1/2 under Alauddin), **jizya** (non-Muslims), **zakat** (2.5% on Muslim wealth), **khams** (1/5 of war booty; Alauddin kept 4/5). Firoz added **haq-i-sharb** (irrigation, ~1/10).',
      '**Succession**: no fixed law — nomination by sultan, election by nobles (Firoz), heredity, or force (Alauddin). Turkish idea that all sons had equal claims.'
    ],
    m: [['Big 4 Diwans = “W-A-I-R”', 'Wizarat (finance), Arz (army), Insha (letters), Risalat (religion) — “WAIR the crown”.'],
      ['Iqta timeline “I-B-A-M-F”', 'Iltutmish creates → Balban audits → Alauddin controls → MBT separates → Firoz makes hereditary.']],
    f: ['Barani’s Fatawa-i-Jahandari openly says a ruler may frame state laws (zawabit) when sharia is silent.'],
    d: 'Sultanate central government\n Sultan\n  Wazir — Diwan-i-Wizarat (finance)\n  Ariz-i-mamalik — Diwan-i-Arz (army)\n  Dabir-i-khas — Diwan-i-Insha (letters)\n  Sadr-us-sudur — Diwan-i-Risalat (religion)\n  Qazi-ul-quzat — justice\n  Barid-i-mamalik — intelligence',
    k: ['Is the Delhi Sultanate a theocracy? Give 2 points for and 2 against.'],
    r: ['Satish Chandra ch. 8', 'V.D. Mahajan ch. 16, 22', 'IGNOU MHI-104 (Sultanate polity)'],
    q: [
      Q.mt('Match the department with its head:', ['Diwan-i-Arz', 'Diwan-i-Insha', 'Diwan-i-Risalat', 'Diwan-i-Wizarat'], ['Ariz-i-mamalik', 'Dabir-i-khas', 'Sadr-us-sudur', 'Wazir'], '', ['Department', 'Head']),
      Q.mcq('Who made iqtas hereditary?', ['Iltutmish', 'Balban', 'Muhammad bin Tughlaq', 'Firoz Shah Tughlaq'], 3, ''),
      Q.mcq('Zakat was a tax on:', ['Non-Muslims', 'Muslims’ wealth', 'War booty', 'Irrigation'], 1, ''),
      Q.mcq('Mustaufi-i-mamalik was the:', ['Accountant-general', 'Auditor-general', 'Chief of intelligence', 'Chief judge'], 1, ''),
      Q.ar('The Delhi Sultanate cannot be called a pure theocracy.', 'Sultans framed state laws (zawabit) according to political needs.', 0, '')
    ] });

  T({ id: 'h5-madm', u: 'H5', t: 'Sher Shah’s reforms & Mughal administration: mansabdari, jagirdari, land revenue', h: 4,
    p: [
      'Mughal kingship: **farr-i-izadi** (divine light — Abul Fazl), **sulh-i-kul**, jharokha darshan.',
      'Centre: **Wakil** (regent/PM, faded after Bairam Khan) · **Wazir / Diwan-i-Kul** (finance) · **Mir Bakhshi** (military pay, mansabdars, intelligence) · **Mir Saman** (household & karkhanas) · **Sadr-us-Sudur** (grants, religious affairs) · **Qazi-ul-Quzat** · **Muhtasib** (public morals) · **Mir Atish** (artillery) · Daroga-i-Dak Chowki.',
      'Provinces (**subas**: 12 in 1580 → 15 by 1605): **subedar/nazim**, **diwan** (finance, independent check), **bakhshi**, sadr, qazi, **waqia-navis**, **kotwal** (city).',
      'Sarkar: **faujdar** (order), **amalguzar** (revenue), bitikchi, khazanadar. Pargana: **shiqdar, amil, qanungo** (land records, hereditary), fotedar, karkun. Village: **muqaddam, patwari**.',
      '**Mansabdari** (Akbar, c. 1573–77): decimal ranks; **zat** (personal rank & pay) and **sawar** (cavalry) dual ranks; classes by sawar/zat ratio; **dagh & chehra**; **du-aspa sih-aspa** (Jahangir — extra sawar without raising zat); **month-scale** jagirs (Shah Jahan).',
      '**Jagirdari**: assignment of revenue; **jama/jamadami** (estimated) vs **hasil** (actual); transferred every ~3 years; types — **tankhwah** (salary), **watan** (hereditary homeland of Rajput chiefs), **inam**, **mashrut**. **Khalisa** = crown land. Late 17th c. shortage = **be-jagiri** (jagirdari crisis).',
      'Revenue: Sher Shah’s **rai** → Akbar’s experiments → **Karori experiment (1574–75)** → **Ain-i-Dahsala (1580)** by **Raja Todar Mal**: 10-year (1570–79) average of produce & prices → cash rates (**dastur-ul-amal**) for revenue circles (**dasturs**) = **zabt**. Share ≈ **1/3**.',
      'Other methods: **batai/ghalla-bakhshi** (crop-sharing: khet, lang, rasi), **kankut** (estimation), **nasaq** (past records).',
      'Land classes: **polaj** (every year) · **parauti** (fallow 1–2 yrs) · **chachar** (3–4 yrs) · **banjar** (5+ yrs). **Ilahi gaz** (41 digits) & bamboo **jarib** with iron rings.',
      '**Madad-i-maash / suyurghal**: revenue-free grants to scholars & religious men, under the Sadr. **Taqavi** = loans to peasants.',
      'Zamindars (S. Nurul Hasan): **autonomous chiefs**, **intermediary** zamindars, **primary** zamindars.'
    ],
    m: [['Land classes “P-P-C-B” = “Please Put Chai Bro”', 'Polaj, Parauti, Chachar, Banjar — from best to worst.'],
      ['Mughal ministers “W-B-S-S” = “We Build Strong States”', 'Wazir (finance), Bakhshi (army), Saman (household), Sadr (religion).']],
    f: ['Jagirs were transferred so often that Bernier said jagirdars had no reason to care for peasants’ long-term welfare.', 'Todar Mal had earlier served Sher Shah — continuity across dynasties!'],
    d: 'Mansab ranks\n Zat → personal rank & salary\n Sawar → number of horsemen\n  Class 1: sawar = zat\n  Class 2: sawar ≥ 1/2 zat\n  Class 3: sawar < 1/2 zat\n Paid by\n  Naqd (cash)\n  Jagir (revenue assignment)',
    k: ['Explain zat & sawar to a friend using the example of a 1000/500 mansabdar.'],
    r: ['Satish Chandra ch. 13, 16', 'Irfan Habib, The Agrarian System of Mughal India', 'IGNOU MHI-104 / MHI-105'],
    q: [
      Q.mcq('The Ain-i-Dahsala system was introduced in:', ['1570', '1575', '1580', '1585'], 2, ''),
      Q.mt('Match the land category with its description:', ['Polaj', 'Parauti', 'Chachar', 'Banjar'], ['Cultivated every year', 'Fallow for 1–2 years', 'Fallow for 3–4 years', 'Fallow for 5 years or more'], '', ['Category', 'Description']),
      Q.mcq('The Mughal officer in charge of military pay and mansabdars was the:', ['Mir Saman', 'Mir Bakhshi', 'Sadr-us-Sudur', 'Diwan-i-Kul'], 1, ''),
      Q.mcq('Du-aspa sih-aspa was introduced by:', ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'], 1, ''),
      Q.mt('Match the jagir with its meaning:', ['Tankhwah jagir', 'Watan jagir', 'Inam jagir', 'Mashrut jagir'], ['Given in lieu of salary', 'Hereditary home territory of chiefs', 'Free of obligations', 'Conditional'], '', ['Jagir', 'Meaning']),
      Q.ar('The Mughal diwan of a province was independent of the subedar.', 'The empire used checks and balances to prevent provincial rebellion.', 0, ''),
      Q.st('Which of the following are methods of revenue assessment under Akbar?', ['Zabt', 'Batai', 'Kankut', 'Ijara'], [true, true, true, false], 'Ijara (revenue farming) spreads after Aurangzeb.')
    ] });

  T({ id: 'h5-dadm', u: 'H5', t: 'Deccan administration: Vijayanagara, Bahmani, Maratha', h: 2,
    p: [
      '**Vijayanagara**: raya with council; provinces (**rajya/mandala**) → **nadu** → **sthala** → **grama**.',
      '**Nayankara system**: **nayakas** (military chiefs) received **amaram** lands; supplied troops & tribute (Nuniz counted ~200). Later **Palaiyakkarar/Polygars** (Aravidus & Nayakas of Madurai, Thanjavur, Gingee).',
      '**Ayagar system**: **12 hereditary village functionaries** paid with tax-free (**manya**) land. Other land: **bhandaravada** (crown), brahmadeya, devadana, matha-pura.',
      'Interpretations: Nilakanta Sastri (“war state”), **Burton Stein** (segmentary), **Noboru Karashima** (compared the nayaka system with feudalism).',
      '**Bahmani**: **Wakil-us-Sultanat** (PM), **Wazir-i-Kul**, **Amir-i-Jumla** (finance), **Wazir-i-Ashraf** (foreign affairs), Nazir, Peshwa, Kotwal, **Sadr-i-Jahan** (justice & religion). Provinces = **tarafs** under **tarafdars** (4 → 8 by **Mahmud Gawan**, who kept khalisa land & forts under central control).',
      'Bahmani factions: **Afaqis** (newcomers: Persians, Turks, Arabs) vs **Dakhnis** (old settlers + Habshis) — caused Gawan’s fall.',
      '**Maratha (Shivaji)**: **Ashtapradhan**; forts as admin units; **chauth & sardeshmukhi**; land survey by **Annaji Datto**.',
      '**Peshwa era**: **Huzur Daftar** (central secretariat, Pune); **kamavisdar/mamlatdar** (district revenue); **deshmukh, deshpande** (hereditary pargana officers); village **patil** (head) & **kulkarni** (accountant); **balutedars** (artisans paid with baluta); **watan** = hereditary right.',
      'Division of chauth: **babti** (25% to king), **mokasa** (66% to sardars), **sahotra** (6%), **nadgaunda** (3%).'
    ],
    m: [['Vijayanagara “N-A-A” = Nayaka gets Amaram, Ayagars serve village', 'Nayankara (military fief) + Ayagar (village servants).'],
      ['Chauth split “B-M-S-N” = 25-66-6-3', 'Babti, Mokasa, Sahotra, Nadgaunda.']],
    f: ['Domingo Paes said Vijayanagara was “as large as Rome” and full of markets selling rubies and diamonds.'],
    d: 'Maratha village & district\n Peshwa (Huzur Daftar, Pune)\n Mamlatdar / Kamavisdar (district)\n Deshmukh · Deshpande (pargana, hereditary)\n Patil (village head) · Kulkarni (accountant)\n Balutedars (12 artisans)',
    k: ['Compare nayakas of Vijayanagara with Mughal jagirdars in three points.'],
    r: ['Satish Chandra ch. 9, 14, 18', 'Burton Stein, Vijayanagara (New Cambridge)'],
    q: [
      Q.mcq('Ayagars in the Vijayanagara empire were:', ['Military chiefs', 'Village functionaries', 'Temple dancers', 'Foreign merchants'], 1, ''),
      Q.mcq('In the Bahmani kingdom, provinces were called:', ['Subas', 'Tarafs', 'Iqtas', 'Mandalams'], 1, ''),
      Q.mt('Match the Maratha official with the role:', ['Patil', 'Kulkarni', 'Deshmukh', 'Kamavisdar'], ['Village headman', 'Village accountant', 'Hereditary pargana chief', 'Revenue officer of a district'], '', ['Official', 'Role']),
      Q.ar('Mahmud Gawan increased the number of tarafs from four to eight.', 'He wanted to reduce the power of provincial governors.', 0, '')
    ] });

  T({ id: 'h5-front', u: 'H5', t: 'Frontier policy & inter-state relations (Sultanate & Mughal)', h: 1.5,
    p: [
      '**Mongols**: Chingiz Khan reached the Indus (1221) chasing **Jalaluddin Mangbarni**; **Iltutmish** refused him shelter to avoid Mongol wrath.',
      '**Balban**: chain of forts — **Bhatinda, Sunam, Samana, Dipalpur, Multan, Lahore**; his cousin **Sher Khan** as warden; son Prince Muhammad died fighting (1285).',
      '**Alauddin**: repelled 6 big invasions; strong garrisons; **Ghazi Malik** (later Ghiyasuddin) as warden at **Dipalpur**. MBT faced **Tarmashirin**; planned the Khurasan expedition.',
      'Mughal NW frontier: **Kabul–Kandahar** line as the “scientific frontier”. **Kandahar**: taken by Akbar 1595 → lost to **Shah Abbas I (1622)** → regained 1638 (Ali Mardan Khan) → lost **1649**; failed sieges 1649, 1652 (Aurangzeb), 1653 (Dara).',
      'Central Asia: Akbar stayed at **Lahore (1585–98)** to watch **Abdullah Khan Uzbek**; Shah Jahan’s **Balkh–Badakhshan (1646–47)** failure.',
      'Afghan tribes: **Raushanai** movement (Bayazid Ansari); **Birbal killed (1586)** fighting Yusufzais; Aurangzeb’s **Yusufzai (1667)** & **Afridi (1672)** revolts; poet-chief **Khushhal Khan Khattak**.',
      'Inter-state relations: Sultanate–Deccan tribute; **Bahmani–Vijayanagara wars over Raichur doab**; Mughal–Rajput alliances & **watan jagirs**; **Deed of Submission (1636)**; Mughal–**Safavid** rivalry over Kandahar; Ottomans; Portuguese **cartaz** passes for ships.',
      'North-east: **Mir Jumla** invaded Assam (1662); Ahoms under **Lachit Borphukan** won **Saraighat (1671)**.'
    ],
    m: [['Kandahar ping-pong “95-22-38-49”', 'Mughal 1595 → Persian 1622 → Mughal 1638 → Persian 1649 (for good).']],
    f: ['Lachit Borphukan’s victory at Saraighat is celebrated as Lachit Divas (24 Nov) in Assam.'],
    d: 'Kandahar timeline\n 1595 Akbar takes it\n 1622 Shah Abbas I captures\n 1638 Ali Mardan Khan hands it back\n 1649 lost forever\n 1649/1652/1653 sieges fail',
    k: ['Why was Kandahar so important to both Mughals and Safavids? Two reasons.'],
    r: ['Satish Chandra ch. 6, 15'],
    q: [
      Q.mcq('Kandahar was finally lost by the Mughals in:', ['1622', '1638', '1649', '1653'], 2, ''),
      Q.mcq('The Battle of Saraighat (1671) was won by:', ['Mir Jumla', 'Ahoms under Lachit Borphukan', 'Ram Singh', 'Shaista Khan'], 1, ''),
      Q.ch('Arrange chronologically:', ['Akbar captures Kandahar', 'Shah Abbas I captures Kandahar', 'Ali Mardan Khan surrenders Kandahar to Mughals', 'Kandahar finally lost'], '')
    ] });

  T({ id: 'h5-econ', u: 'H5', t: 'Agriculture, irrigation, village economy, peasantry, urbanization & demography', h: 2.5,
    p: [
      'Two harvests: **rabi** (winter: wheat, barley, gram) & **kharif** (monsoon: rice, millets, cotton). Ain lists many cash crops: **sugarcane, cotton, indigo** (Bayana, Sarkhej), **opium**, poppy.',
      'New World crops via Portuguese: **tobacco** (early 17th c.; Jahangir tried to ban smoking), **maize, chillies**, pineapple, papaya, cashew.',
      'Irrigation: wells with **saqiya/Persian wheel** (Babur describes), tanks, canals — **Firoz’s Western Yamuna canal**, Shah Jahan’s **Nahr-i-Faiz** (Ali Mardan Khan), **Nahr-i-Bahisht**; **karez** at Bidar.',
      'Village: muqaddam & patwari; artisans paid in shares (**jajmani**). The “self-sufficient village republic” idea (Metcalfe, Marx) is now questioned — villages were linked to markets via cash revenue.',
      'Peasants: **khud-kasht** (resident cultivators), **pahi-kasht** (non-resident, often lower rates), **muzarian** (tenants). Irfan Habib — *The Agrarian System of Mughal India* (1963).',
      'Grants & loans: **madad-i-maash**, **inam**; **taqavi** (state loans; MBT’s **sondhar**).',
      'Urbanization: big cities **Agra, Delhi, Lahore, Fatehpur Sikri, Ahmedabad, Surat, Patna, Dhaka, Burhanpur, Masulipatnam**; Irfan Habib estimates ~15% urban population around 1600.',
      'Population c. 1600: **Moreland ~100 million**, Kingsley Davis ~125 million, **Shireen Moosvi ~145 million**.'
    ],
    m: [['Khud = “Khud ka” (own village)', 'Khud-kasht = resident; Pahi-kasht = from outside (pahi = traveller).']],
    f: ['Babur complained that Hindustan had no running-water gardens — so he made them!'],
    d: 'Mughal peasantry\n Khud-kasht (resident, own land)\n Pahi-kasht (non-resident)\n Muzarian (tenants)\n Landless labourers',
    k: ['Explain why pahi-kasht peasants often got lower revenue rates.'],
    r: ['Satish Chandra ch. 16', 'IGNOU MHI-105'],
    q: [
      Q.mcq('Pahi-kasht peasants were:', ['Resident owner-cultivators', 'Non-resident cultivators', 'Landless labourers', 'Village officials'], 1, ''),
      Q.mcq('“The Agrarian System of Mughal India” was written by:', ['W.H. Moreland', 'Irfan Habib', 'Shireen Moosvi', 'S. Nurul Hasan'], 1, ''),
      Q.mt('Match the estimate of India’s population c. 1600 with the scholar:', ['~100 million', '~125 million', '~145 million', 'Agrarian System of Mughal India'], ['W.H. Moreland', 'Kingsley Davis', 'Shireen Moosvi', 'Irfan Habib'], '', ['Estimate / Work', 'Scholar'])
    ] });

  T({ id: 'h5-trade', u: 'H5', t: 'Industries, trade, European trade, hundi, currency, mints, famines & revolts', h: 2.5,
    p: [
      'Textiles: cotton (**Gujarat, Coromandel – chintz/kalamkari, Bengal – Dhaka muslin**), silk (**Kasimbazar**, Gujarat patola), **Kashmir shawls**; **karkhanas** (imperial workshops). Others: **indigo, saltpetre (Bihar), sugar, shipbuilding** (Surat, Masulipatnam).',
      'Technology: **spinning wheel** & carding bow spread (13th–14th c.), paper, gunpowder & artillery (Babur), worm-gear cotton gin (Irfan Habib, *Technology in Medieval India*).',
      'Organisation: **dadani** (advance payments to weavers by merchants/companies) — putting-out system.',
      'Internal trade: **Banjaras** (bullock caravans), river traffic, roads & sarais. Ports: **Surat** (main Mughal port), Cambay, Broach, **Masulipatnam**, Pulicat, **Hugli, Satgaon, Chittagong**, Calicut, Cochin.',
      'Exports: textiles, indigo, saltpetre, spices, sugar. Imports: **silver & gold bullion** (India = “sink of precious metals”), horses, luxuries.',
      'Merchants: **Virji Vohra** (Surat), **Abdul Ghafur** (Surat ship-owner), **Shantidas Jhaveri** (Ahmedabad), **Jagat Seth** (Bengal bankers), **Mir Jumla**, Chettis, Khatris, Bohras, Armenians.',
      'Credit: **hundi** (bill of exchange), **sarrafs** (money-changers/bankers), **bima** (insurance for goods & ships).',
      'Currency: Akbar’s **mohur** (gold), **rupaya** (silver), **dam** (copper; **40 dams = 1 rupee**); many mints & **free coinage**; Jahangir’s **zodiac coins** & Nur Jahan’s name on coins.',
      'State income: land revenue (main), customs (~2.5–3.5%), mint, jizya, zakat, escheat, **peshkash**, booty. Expenditure: army, court, buildings.',
      'Famines: Doab (MBT, 1330s–40s), 1555–56, 1595–98, **1630–32 Deccan–Gujarat** (Peter Mundy) — relief through **langars**, remission, taqavi. Peasant revolts: Doab (MBT), **Jats, Satnamis, Sikhs, Marathas** (agrarian roots per Irfan Habib).'
    ],
    m: [['Surat merchants “V-A-S” = Virji, Abdul, Shantidas', 'Virji Vohra (Surat), Abdul Ghafur (Surat), Shantidas (Ahmedabad).'],
      ['“40 dam = 1 rupee”', 'Copper dam to silver rupaya under Akbar.']],
    f: ['Virji Vohra was so rich that the English Company borrowed money from him.', 'Dhaka muslin was so fine it was nicknamed “woven air” (abrawan — running water).'],
    d: 'Mughal trade system\n Producers (weavers, peasants)\n  ← dadani advances\n Merchants & brokers\n  ← hundi & sarraf credit\n Ports (Surat, Hugli, Masulipatnam)\n  → Europe, West Asia, SE Asia\n  ← bullion in',
    k: ['Explain how a hundi works with an example of a merchant from Surat paying in Agra.'],
    r: ['Satish Chandra ch. 16', 'IGNOU MHI-105'],
    q: [
      Q.mcq('Hundi in medieval India was a:', ['Land tax', 'Bill of exchange', 'Insurance policy', 'Weaver’s guild'], 1, ''),
      Q.mcq('Virji Vohra was a leading merchant of:', ['Ahmedabad', 'Surat', 'Masulipatnam', 'Hugli'], 1, ''),
      Q.mcq('Under Akbar, one rupee was equal to:', ['16 dams', '32 dams', '40 dams', '64 dams'], 2, ''),
      Q.ar('India was called a “sink of precious metals”.', 'Indian exports were paid for largely in gold and silver bullion.', 0, '')
    ] });
})(window.JRF);
