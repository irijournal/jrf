/* Extra facts found by checking your textbooks against the built-in notes (gap check).
   Written in our own words; each point is added to the matching topic so it also becomes
   cards, recall blanks and questions. */
(function (J) {
  function add(id, pts) { var t = J.topics.filter(function (x) { return x.id === id; })[0]; if (!t) return; t.p = (t.p || []).concat(pts.map(function (p) { return p + ' (from the books)'; })); }
  function addPairs(id, rows) {
    var p = J.pairs.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    rows.split('\n').forEach(function (l) { l = l.trim(); var i = l.indexOf('='); if (i > 0) p.items.push([l.slice(0, i).trim(), l.slice(i + 1).trim()]); });
  }

  /* ---------- Unit I ---------- */
  add('h1-pre', [
    '**Pleistocene** (c. 2.6 million–11,700 years ago) is the geological epoch of the Palaeolithic; the **Holocene** (from c. 11,700 years ago) begins with the Mesolithic and warmer climate.',
    '**Levallois technique**: a prepared-core method of striking flakes of a planned shape — typical of the Middle Palaeolithic.',
    '**K. Paddayya** studied the Acheulian sites of the **Hunsgi–Baichbal** valleys (Karnataka); **Baghor** (Son valley, MP) has an Upper Palaeolithic stone platform seen as a possible early shrine.'
  ]);
  add('h1-neo', [
    '**Ganeshwar–Jodhpura** culture (north-east Rajasthan, Khetri copper belt): copper arrowheads, fishhooks and axes; a supplier of copper to Harappan centres.',
    'Early farming & Chalcolithic sites of Baluchistan: **Kili Gul Muhammad**, **Damb Sadaat**, **Mundigak** (Afghanistan); Mehrgarh lies on the **Kachi** plain.',
    'Ganga valley sites with early rice and Neolithic–Chalcolithic layers: **Senuar** (Bihar), **Narhan** (Gorakhpur area), **Chirand**; **Watgal** is a South Indian Neolithic site (Karnataka).',
    '**Savalda** culture (Maharashtra) precedes the Malwa and Jorwe phases in the Deccan Chalcolithic sequence.'
  ]);
  add('h1-hrp', [
    '**Cholistan** (Bahawalpur, Pakistan): the dry **Hakra** channel area surveyed by **M. Rafique Mughal**, with hundreds of sites incl. the large city **Ganweriwala**.',
    'Smaller excavated settlements: **Allahdino** (near Karachi), **Nausharo** (next to Mehrgarh, shows the transition to the mature phase), **Kunal** (Haryana, early Harappan).'
  ]);
  add('h1-hrp2', [
    'Archaeobotany names you will meet: **Triticum** = wheat, **Hordeum** = barley; millets are reported from Harappa, Surkotada and Shortughai.',
    '**Cemetery-H** culture (Harappa, Late Harappan) has painted pottery and urn burials, unlike the extended burials of the mature-phase cemetery R-37.'
  ]);
  add('h1-ved', [
    '**Sapta-Sindhu** = the land of seven rivers of the Rigveda; Rigvedic texts describe the **Dasas** and **Dasyus** as enemies of the Aryas (dark-skinned, “noseless”, not performing sacrifice).',
    '**Rajanya** is the early Vedic term for the warrior/ruling group, later called Kshatriya.'
  ]);
  add('h1-lved', [
    '**Kalpasutras** have three parts: **Shrautasutras** (big public sacrifices), **Grihyasutras** (domestic rites: birth, marriage, death) and **Dharmasutras** (social rules); **Sulbasutras** give geometry for altars.',
    'Early Dharmasutra authors: **Gautama, Baudhayana, Apastamba, Vasishtha**. Major Brahmanas: **Aitareya** (Rigveda), **Shatapatha** (Shukla Yajurveda).',
    '**Uttara Mimamsa** is another name for Vedanta (Badarayana); **Purva Mimamsa** is Jaimini’s ritual school; **Samkhya** (Kapila) is dualist (purusha and prakriti).'
  ]);
  add('h1-mjp', [
    '**Prasenajit** (Pasenadi) of Kosala was a contemporary of the Buddha and brother-in-law of Bimbisara; his son Vidudabha attacked the Shakyas.',
    'Excavated city sites: **Basarh** (= Vaishali), **Rajghat** (Varanasi), **Hastinapura** (PGW; abandoned after a Ganga flood), **Kausambi**, **Sonkh** (Mathura), **Chandraketugarh** (Bengal; rich terracottas).',
    '**Kanyakubja** is the old name of Kanauj. **Piprahwa** (UP) yielded a relic casket used to identify the Shakya homeland near Kapilavastu.',
    '**Taxila** had three successive cities: **Bhir Mound** (Achaemenid–Mauryan), **Sirkap** (Indo-Greek/Shaka–Parthian grid city) and **Sirsukh** (Kushana); the **Dharmarajika** stupa lies nearby.'
  ]);
  add('h1-het', [
    'The **Patimokkha** (in the Vinaya Pitaka) is the list of monastic rules recited by monks every fortnight on **uposatha** days.',
    'Buddha-biography texts: **Lalitavistara**, **Mahavastu**, **Buddhacharita**. Sanskrit Buddhist stories about Ashoka: **Divyavadana** and **Ashokavadana** (the latter also tells of Pushyamitra’s hostility to Buddhists).'
  ]);

  /* ---------- Unit II ---------- */
  add('h2-pm', [
    'Tribal republics of the post-Mauryan period issued their own coins: **Yaudheyas** (Haryana–Punjab; “Yaudheya-gana”; defeated by Rudradaman), **Malavas** (Rajasthan; the Malava era = Vikrama era), **Arjunayanas**, **Kunindas**.',
    '**Azes I** (Shaka ruler in Gandhara): the **Azes era of 57 BCE** is identified by many scholars with the Vikrama era.',
    '**Agathocles** (Indo-Greek) issued coins showing **Samkarshana-Balarama** and **Vasudeva-Krishna** — the earliest images of these deities.',
    '**Kankali Tila** (Mathura) is a major Jain stupa site with Kushana-period sculptures; **Junnar** (Maharashtra) has the largest group of Satavahana-period rock-cut caves.'
  ]);
  add('h2-gupc', [
    'Early Vaishnava cult figures: **Vasudeva-Krishna** and **Samkarshana-Balarama** (Vrishni heroes), worshipped in the **Pancharatra** tradition; later texts: **Harivamsha**, **Vishnu Purana**, **Bhagavata Purana**, **Bhagavad Gita**.',
    'Gupta-period imagery includes **Karttikeya** (Skanda), the **Matrikas** (mother goddesses), **Durga Mahishasuramardini** (Udayagiri) and the Bodhisattva **Avalokiteshvara**.',
    '**Maharashtri** is the Prakrit of the Gathasattasai and later Prakrit poetry; Pravarasena II’s Setubandha is in Maharashtri.'
  ]);
  add('h2-sang', ['In Tamil tradition the sage **Agastya** brought culture to the south and is linked with the first Sangam; **Kannaki** (Kannagi) of the Silappadikaram became the goddess **Pattini**.']);
  add('h2-trade', ['**Kumarajiva** (4th–5th c. CE), a monk from Kucha in Central Asia, translated many Mahayana texts into Chinese — a sign of Indian–Chinese Buddhist links along the Silk Route.']);
  add('h2-gup', ['**Kotivarsha** was a Gupta vishaya in north Bengal; its town board is known from the **Damodarpur** copper plates.']);

  /* ---------- Unit III–IV ---------- */
  add('h3-arab', [
    '**Subuktigin** (r. 977–997) founded Ghaznavid power and defeated the Hindushahi king **Jayapala**; Mahmud then crushed **Anandapala** (Battle of **Waihind**, 1008–09).',
    'The **Hindushahis** (Udabhandapura/Waihind) — Jayapala, Anandapala, Trilochanapala, Bhimapala — were the first Indian dynasty to face the Ghaznavids.'
  ]);
  add('h4-ds1', [
    '**Lakhnauti** (Gaur) was the capital of the Khalji maliks of Bengal after Bakhtiyar Khalji; Bengal’s governors (e.g. **Tughril Khan**) often rebelled from there.',
    '**Katehar** (Rohilkhand) and **Mewat** were zones of frequent revolt against the early Sultans; Balban led campaigns against both.'
  ]);
  add('h4-ds2', [
    '**Deval Devi**, daughter of Rai Karan of Gujarat, married Prince **Khizr Khan** (subject of Amir Khusrau’s *Ashiqa*). The **Padmini** story of Chittor comes from Jayasi’s *Padmavat* (1540), not from contemporary chronicles.',
    'Alauddin’s southern campaigns reached **Mabar** (the Coromandel/Madurai region), later a separate Sultanate (1335).'
  ]);
  add('h4-ds3', [
    'Muhammad bin Tughlaq was earlier called **Ulugh Khan** / **Jauna (Juna) Khan**. The Tughlaqs are sometimes called **Qarauna Turks** (Ibn Battuta’s term).',
    'After Timur left (1398–99), **Mallu Iqbal** controlled what remained of Delhi; the Lodi noble **Hamid Khan** helped **Bahlul Lodi** take Delhi.'
  ]);
  add('h4-mug1', ['**Tardi Beg**, Humayun’s governor of Delhi, lost Delhi to Hemu (1556, Battle of Tughlaqabad) and was executed by Bairam Khan.']);
  add('h4-mug2', [
    '**Adham Khan**, son of Akbar’s nurse Maham Anaga, was executed in 1562 for killing the wazir Atka Khan — this ended the “petticoat government”.',
    'Akbar’s half-brother **Mirza Hakim** ruled Kabul; Akbar marched to Kabul in **1581** to stop him.',
    '**Sher Afghan** (Ali Quli Istajlu) was Nur Jahan’s first husband. Jahangir’s son **Khusrau** rebelled (1606) and was later blinded; Shah Jahan’s rebellion against Jahangir lasted 1622–26.',
    'Shah Jahan’s Central Asian campaign (1646–47) was aimed at Balkh and Badakhshan, then held by **Nazr Muhammad Khan** of the **Uzbeks**.'
  ]);
  add('h4-mug3', ['The Sayyid brothers were **Hussain Ali Khan** and **Abdullah Khan**. Bahadur Shah I was earlier Prince **Muazzam** (Shah Alam).']);
  add('h4-vij', [
    'Bahmani nobility split into **Afaqis/Pardesis** (newcomers, mostly Shia Persians) and **Deccanis** (older settlers with Habshis) — the rivalry that destroyed Mahmud Gawan.',
    'Several Deccan Sultanates followed **Shia** Islam (Bijapur under Yusuf Adil Shah, Golconda, Ahmadnagar), which affected their ties with the Sunni Mughals and Shia Safavids.',
    '**Rama Raya** (Ramaraja) of the Aravidu family was the real power under Sadashivaraya and was killed at Talikota.'
  ]);
  add('h4-mar', ['**Tarabai**, widow of Rajaram, led Maratha resistance (1700–07) as regent for her son Shivaji II; **Shambhaji** (Sambhaji) was Shivaji’s elder son.']);
  add('h5-sadm', [
    'Reading the **khutba** (Friday sermon) and striking **sikka** (coins) in a ruler’s name were the two public signs of sovereignty in the Sultanate.',
    'Sultanate coins: silver **tanka** and copper **jital** (Iltutmish); the Arab **dirham** was a silver unit used in earlier and contemporary accounts.'
  ]);
  add('h5-front', [
    'Mughal–Persian rivalry was with the **Safavids**: Shah Tahmasp sheltered Humayun; **Shah Abbas I** took Kandahar (1622); **Shah Abbas II** retook it for good (1649). Kandahar is spelled Qandhar in many texts.',
    'Akbar’s stay at Lahore (1585–98) was to watch **Abdullah Khan Uzbek**, who had seized Balkh and Badakhshan.'
  ]);

  /* ---------- Unit VII–IX ---------- */
  add('h7-bri', [
    'Afghan politics: **Shah Shuja** (Durrani) was restored to the Kabul throne by the British in the **First Anglo-Afghan War** (1839–42), which ended in disaster.',
    'Anglo-Burmese wars: **1824–26** (Amherst; Treaty of Yandabo), **1852** (Dalhousie; Lower Burma), **1885** (Dufferin; Upper Burma annexed).'
  ]);
  add('h9-gan', ['**Tej Bahadur Sapru** (Liberal leader) helped negotiate the Gandhi–Irwin Pact and was part of the INA trials defence team.']);
  add('h9-post', [
    'Parties after 1947: **Bharatiya Jana Sangh** (1951, S.P. Mookerjee); the **Janata Party** won in 1977; **Akali Dal** led the Punjabi Suba movement.',
    'Institutions: **Election Commission** (Art. 324), **Lok Sabha** & **Rajya Sabha** (Council of States); **Lokpal and Lokayuktas Act** (2013). **East Pakistan** became **Bangladesh** in 1971.'
  ]);

  /* ---------- Unit X ---------- */
  add('h10-ren', [
    'The **Prussian school** of nationalist historians — **Droysen**, **Sybel**, **Treitschke** — used history to support German unification; **Meinecke** wrote on historism.',
    '**Whig interpretation**: reading the past as steady progress towards the present (criticised by **Herbert Butterfield**, 1931).',
    'The **Reformation** produced partisan church histories on both sides (e.g. the Protestant **Magdeburg Centuries**); Vico’s work is the **Scienza Nuova**.'
  ]);
  add('h10-phil', ['**Lewis Namier** analysed politics through the careers of individual members of Parliament (prosopography); **F.W. Maitland** founded the modern study of English legal history.']);
  add('h10-ind', [
    'Survey works on Indian historians: **C.H. Philips (ed.), Historians of India, Pakistan and Ceylon** (1961) and **Peter Hardy, Historians of Medieval India** (1960).',
    '**Will Durant** wrote *The Story of Civilization* (vol. 1, *Our Oriental Heritage*, includes India); **Arthur Marwick** — *The Nature of History*; **G.P. Gooch** — *History and Historians in the Nineteenth Century*.'
  ]);

  addPairs('historians', `
Will Durant = The Story of Civilization
Arthur Marwick = The Nature of History
G.P. Gooch = History and Historians in the Nineteenth Century
Herbert Butterfield = The Whig Interpretation of History
Friedrich Meinecke = Historism
J.G. Droysen = Outline of the Principles of History
Lewis Namier = The Structure of Politics at the Accession of George III
F.W. Maitland = The History of English Law
`);
  addPairs('ind-historians', `
Peter Hardy = Historians of Medieval India
C.H. Philips (ed.) = Historians of India, Pakistan and Ceylon
`);
})(window.JRF);
