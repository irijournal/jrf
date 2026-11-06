/* Historiography memory bank: schools, historians, works (with years), key ideas, short phrases, memory hooks.
   Format per historian:
     @id|Name|life|W or I (world / India)|school ids (comma)
     W|Work|year        (year: number; negative = BCE; prefix c = approximate; blank = no year)
     I|Key idea
     Q|Short phrase the historian is known for
     H|Memory hook
     C|Concept|Meaning   (a concept linked to this historian)
   Written in our own words; phrases are short and widely cited. */
(function (J) {
  J.hSchools = [
    // World
    { id: 'greek', n: 'Greek & Roman (classical)', r: 'W', era: '5th c. BCE – 2nd c. CE', core: 'History as inquiry into human deeds; eyewitness evidence; lessons for politics and morals.', mn: '“HT-PL-T”: Herodotus, Thucydides, Polybius, Livy, Tacitus — Greek to Roman in order.' },
    { id: 'chinese', n: 'Chinese official history', r: 'W', era: '1st c. BCE onward', core: 'State-sponsored dynastic histories; annals + biographies; Mandate of Heaven.', mn: 'Sima Qian started it, Ban Gu made it dynastic.' },
    { id: 'church', n: 'Medieval Christian (church) history', r: 'W', era: '4th – 14th c.', core: 'Providence guides history; time is linear from Creation to Judgement; universal chronicles.', mn: '“E-A-B”: Eusebius (church), Augustine (two cities), Bede (AD dating).' },
    { id: 'islamic', n: 'Arab & Islamic historiography', r: 'W', era: '9th – 15th c.', core: 'Chains of reporters (isnad); universal histories; Ibn Khaldun’s science of society.', mn: '“TMK”: Tabari (isnad), Masudi (Meadows of Gold), Khaldun (asabiyya).' },
    { id: 'renaissance', n: 'Renaissance humanism', r: 'W', era: '15th – 16th c.', core: 'Secular, man-centred history; philology exposes forgeries; politics studied realistically.', mn: 'Valla caught the fake Donation; Machiavelli caught the real politics.' },
    { id: 'erudite', n: 'Erudite (antiquarian) scholarship', r: 'W', era: '17th c.', core: 'Rules for testing charters and manuscripts: diplomatics, palaeography.', mn: 'Mabillon = Manuscripts.' },
    { id: 'enlight', n: 'Enlightenment', r: 'W', era: '18th c.', core: 'Reason and progress; history of civilisation and manners, not just kings; criticism of the church.', mn: '“V-M-G-H”: Voltaire, Montesquieu, Gibbon, Hume.' },
    { id: 'romantic', n: 'Romanticism & nationalism', r: 'W', era: 'late 18th – 19th c.', core: 'Each people has its own spirit (Volksgeist); feeling, nation and heroes matter.', mn: 'Herder’s Volk, Michelet’s France, Carlyle’s heroes.' },
    { id: 'speculative', n: 'Speculative philosophy of history', r: 'W', era: '18th – 20th c.', core: 'Grand patterns in the whole of history: stages, cycles, spirit, civilisations.', mn: '“V-H-S-T”: Vico (cycles), Hegel (spirit), Spengler (decline), Toynbee (challenge–response).' },
    { id: 'rankean', n: 'Scientific / Rankean history', r: 'W', era: '19th c.', core: 'Archives, critical method, seminars, footnotes; history as a professional discipline.', mn: 'Ranke’s seminar → Mommsen, Droysen, Sybel; in England Acton & Bury.' },
    { id: 'positivist', n: 'Positivism', r: 'W', era: '19th c.', core: 'History should find general laws like natural science; facts first.', mn: 'Comte’s 3 stages + Buckle’s laws + Taine’s race–milieu–moment.' },
    { id: 'whig', n: 'Whig / liberal history', r: 'W', era: '19th – early 20th c.', core: 'English past as steady progress towards liberty and parliament.', mn: 'Macaulay → (great-nephew) Trevelyan; Butterfield attacked it.' },
    { id: 'marxist', n: 'Marxist history', r: 'W', era: '19th – 20th c.', core: 'Mode of production, class struggle, base and superstructure drive change.', mn: 'Marx & Engels → Gramsci → British Marxists (Dobb, Hill, Hilton, Thompson, Hobsbawm).' },
    { id: 'idealist', n: 'Idealist / critical philosophy of history', r: 'W', era: 'late 19th – 20th c.', core: 'History is the study of human thought and meaning; understanding (Verstehen) not laws.', mn: 'Dilthey → Croce → Collingwood: the mind behind the event.' },
    { id: 'analytic', n: 'Analytical philosophy of history', r: 'W', era: '20th c.', core: 'Logic of historical explanation: laws, colligation, prediction.', mn: 'Hempel’s laws vs Popper’s attack vs Walsh’s colligation.' },
    { id: 'relativist', n: 'Relativism & the objectivity debate', r: 'W', era: '20th c.', core: 'The historian’s present shapes what is written; facts are selected.', mn: 'Beard & Becker in USA, Carr in Britain.' },
    { id: 'annales', n: 'Annales school', r: 'W', era: '1929 →', core: 'Total history, problem-oriented history, mentalities, long-term structures; ties with geography, sociology.', mn: 'Gen 1: Febvre & Bloch · Gen 2: Braudel · Gen 3: Le Roy Ladurie, Le Goff, Duby, Ariès, Nora.' },
    { id: 'micro', n: 'Microhistory', r: 'W', era: '1970s →', core: 'A small case (one miller, one village) studied intensely to reveal a whole world.', mn: 'Ginzburg’s miller, Davis’s imposter, Levi’s exorcist.' },
    { id: 'cultural', n: 'New cultural history', r: 'W', era: '1970s →', core: 'Meanings, symbols, rituals; borrowing from anthropology.', mn: 'Geertz’s thick description → Darnton’s cats.' },
    { id: 'postmodern', n: 'Postmodernism & the linguistic turn', r: 'W', era: '1960s →', core: 'History is a text/narrative; no single objective truth; suspicion of grand narratives.', mn: '“F-D-L-W”: Foucault, Derrida, Lyotard, White.' },
    { id: 'postcolonial', n: 'Postcolonial theory', r: 'W', era: '1978 →', core: 'How Western knowledge produced “the Orient” and the colonised.', mn: 'Said (Orientalism) · Spivak (subaltern speak?) · Bhabha (hybridity).' },
    { id: 'gender', n: 'Women’s & gender history', r: 'W', era: '1970s →', core: 'Recover women hidden from history; gender as a category of analysis.', mn: 'Rowbotham hidden → Kelly’s Renaissance → Scott’s gender category.' },
    { id: 'global', n: 'World & global history', r: 'W', era: '1960s →', core: 'Connections, systems and comparisons across the whole world.', mn: 'McNeill (rise of West) → Wallerstein (world-system) → Pomeranz (divergence).' },
    { id: 'quant', n: 'Quantitative & structural methods', r: 'W', era: '20th c.', core: 'Numbers, statistics, collective biography.', mn: 'Namier counted MPs; Fogel counted slaves’ output (cliometrics).' },
    // India
    { id: 'itihasa', n: 'Early Indian historical tradition', r: 'I', era: 'to 13th c.', core: 'Itihasa–purana, vamshavalis, prashastis and charitas (royal biographies).', mn: 'Bana (Harsha), Bilhana (Vikramaditya VI), Kalhana (Kashmir).' },
    { id: 'indopersian', n: 'Indo-Persian chronicles', r: 'I', era: '11th – 18th c.', core: 'Court histories in Persian: dynastic, didactic, often written for patrons.', mn: 'Minhaj → Barani → Abul Fazl → Badauni → Khafi Khan.' },
    { id: 'orientalist', n: 'Orientalist scholarship', r: 'I', era: 'late 18th – 19th c.', core: 'Study of Sanskrit and classical India; admiration for an ancient golden age.', mn: 'Jones founded, Prinsep deciphered, Max Müller edited.' },
    { id: 'colonial', n: 'Colonial / imperialist & utilitarian', r: 'I', era: '19th – early 20th c.', core: 'India as static and despotic; British rule as improvement; Hindu–Muslim–British periods.', mn: 'Mill’s 3 periods, Smith’s despotism, Tod’s Rajputs.' },
    { id: 'nationalist', n: 'Nationalist historiography', r: 'I', era: 'late 19th – mid 20th c.', core: 'Answer colonial claims: India’s glorious past, self-government, economic drain.', mn: 'Jayaswal (republics), Raychaudhuri (political), Majumdar (11 volumes).' },
    { id: 'marxist-i', n: 'Marxist historiography (India)', r: 'I', era: '1940s →', core: 'Modes of production, feudalism, agrarian relations, class and economy.', mn: 'Kosambi founded; Sharma (feudalism), Habib (agrarian), Bipan (nationalism).' },
    { id: 'aligarh', n: 'Aligarh school', r: 'I', era: '1950s →', core: 'Medieval India from Persian sources: agrarian system, nobility, economy.', mn: 'Habib (father & son), Athar Ali, Nurul Hasan, Moosvi.' },
    { id: 'cambridge', n: 'Cambridge school', r: 'I', era: '1960s – 70s', core: 'Nationalism as competition among elites for power and patronage under British institutions.', mn: 'Seal started; Gallagher, Johnson, Brown, Bayly followed. Critics: “animal politics”.' },
    { id: 'subaltern', n: 'Subaltern Studies', r: 'I', era: '1982 →', core: 'History from below: peasants, tribals, workers as makers of history; critique of elite nationalism.', mn: 'Guha started (1982); Chatterjee, Amin, Chakrabarty, Pandey, Hardiman, Arnold.' },
    { id: 'gender-i', n: 'Gender history (India)', r: 'I', era: '1980s →', core: 'Women, caste and patriarchy; partition and memory.', mn: 'Chakravarti (brahmanical patriarchy), Sangari–Vaid (Recasting Women), Butalia (Partition).' },
    { id: 'dalit', n: 'Dalit & anti-caste history', r: 'I', era: '19th c. →', core: 'Caste as domination; history from the standpoint of the oppressed castes.', mn: 'Phule → Ambedkar → Omvedt, Zelliot.' },
    { id: 'env-i', n: 'Environmental history (India)', r: 'I', era: '1980s →', core: 'Forests, water, wildlife and colonial ecology.', mn: 'Gadgil–Guha (Fissured Land), Guha (Unquiet Woods), Rangarajan (Fencing the Forest).' },
    { id: 'econ-i', n: 'Economic history (India)', r: 'I', era: '20th c. →', core: 'Trade, de-industrialisation, merchants and the Indian Ocean.', mn: 'K.N. Chaudhuri (Indian Ocean), Das Gupta (Surat), Tirthankar Roy.' },
    { id: 'state-i', n: 'Early medieval state formation', r: 'I', era: '1960s →', core: 'Feudal, segmentary and integrative models of the early medieval state.', mn: 'Sharma (feudal) vs Stein (segmentary) vs Chattopadhyaya & Kulke (integrative).' },
    { id: 'colknow', n: 'Colonial knowledge & caste', r: 'I', era: '1980s →', core: 'Census, survey and Orientalist scholarship shaped caste and “India”.', mn: 'Cohn (forms of knowledge), Dirks (castes of mind), Inden (imagining India).' }
  ];

  var RAW = `
@herodotus|Herodotus|c. 484–425 BCE|W|greek
W|Histories (Greco-Persian Wars)|c-430
I|Called the “Father of History” by Cicero; his word historia means “inquiry”.
I|Collected oral reports while travelling; mixes customs, geography and stories — critics called him “father of lies”.
H|Hero-dotus = hero of dots: joined many travel stories into one history.
@thucydides|Thucydides|c. 460–400 BCE|W|greek
W|History of the Peloponnesian War|c-400
I|Eyewitness, critical and political: rejected gods as causes; reconstructed speeches.
I|Called the father of scientific (or political) history.
Q|A possession for all time
H|Thucy-dides = “touchy” about facts: strict and critical.
@xenophon|Xenophon|c. 430–354 BCE|W|greek
W|Anabasis|
W|Hellenica|
I|Continued Thucydides’ story; Anabasis tells the march of the Ten Thousand Greeks.
@polybius|Polybius|c. 200–118 BCE|W|greek
W|The Histories (rise of Rome)|
I|Pragmatic and universal history; explained how Rome conquered the Mediterranean.
I|Cycle of constitutions (anacyclosis): monarchy → tyranny → aristocracy → oligarchy → democracy → mob rule.
@caesar|Julius Caesar|100–44 BCE|W|greek
W|Commentaries on the Gallic War|
I|Plain military memoir written in the third person.
@sallust|Sallust|86–35 BCE|W|greek
W|The Conspiracy of Catiline|
W|The Jugurthine War|
I|Moralist: Rome declined through greed and ambition.
@livy|Livy|59 BCE–17 CE|W|greek
W|Ab Urbe Condita (History of Rome from its Founding)|
I|Patriotic, moral history of Rome with heroic examples (exempla).
@tacitus|Tacitus|c. 56–120 CE|W|greek
W|Germania|98
W|Annals|
W|Histories (Tacitus)|
W|Agricola|98
I|Wrote of imperial tyranny with sharp moral judgement.
Q|Sine ira et studio — without anger and bias
H|Tacit = silent but sharp: few words, deep judgement.
@plutarch|Plutarch|c. 46–119 CE|W|greek
W|Parallel Lives|
I|Paired biographies of Greeks and Romans to teach character and virtue.
@suetonius|Suetonius|c. 69–122 CE|W|greek
W|Lives of the Twelve Caesars|
I|Gossipy imperial biographies.
@sima-qian|Sima Qian|c. 145–86 BCE|W|chinese
W|Shiji (Records of the Grand Historian)|
I|Father of Chinese historiography: annals, tables, treatises and biographies.
H|Sima = “seema”: drew the borders of Chinese history.
@ban-gu|Ban Gu|32–92 CE|W|chinese
W|Hanshu (Book of Han)|
I|First single-dynasty history — the model for later official dynastic histories.
@eusebius|Eusebius of Caesarea|c. 260–339|W|church
W|Ecclesiastical History|
W|Chronicle (Eusebius)|
I|Father of church history; used documents and lists of bishops.
@augustine|St Augustine|354–430|W|church
W|The City of God|c426
I|Two cities: the earthly city and the city of God; history moves in a straight line guided by Providence.
C|Linear providential history|Time runs one way from Creation to the Last Judgement, guided by God
H|Augustine wrote after Rome was sacked (410): Rome falls, God’s city stays.
@orosius|Orosius|c. 375–420|W|church
W|Seven Books of History against the Pagans|
I|Pupil of Augustine; argued Christianity did not cause Rome’s troubles.
@gregory|Gregory of Tours|538–594|W|church
W|History of the Franks|
I|Main source for Merovingian Gaul.
@bede|Bede|673–735|W|church
W|Ecclesiastical History of the English People|731
I|Popularised Anno Domini (AD) dating; careful about sources.
C|Anno Domini dating|Counting years from the birth of Christ, popularised by Bede
H|Bede = Bed-time AD: the year count you sleep with.
@einhard|Einhard|c. 775–840|W|church
W|Life of Charlemagne|
I|Court biography modelled on Suetonius.
@otto|Otto of Freising|c. 1114–1158|W|church
W|The Two Cities (Chronicle)|
I|Universal chronicle following Augustine’s two-cities idea.
@froissart|Jean Froissart|c. 1337–1405|W|church
W|Chronicles (Hundred Years’ War)|
I|Chivalric chronicle of the Hundred Years’ War.
@tabari|Al-Tabari|839–923|W|islamic
W|History of the Prophets and Kings|
I|Universal history built on chains of reporters (isnad), giving variant reports side by side.
C|Isnad|Chain of transmitters used to test a report
@masudi|Al-Masudi|c. 896–956|W|islamic
W|Meadows of Gold (Muruj al-Dhahab)|
I|Traveller-historian; called the “Herodotus of the Arabs”.
@ibn-athir|Ibn al-Athir|1160–1233|W|islamic
W|The Complete History (al-Kamil fi al-Tarikh)|
I|Universal history up to the Mongol invasions.
@ibn-khaldun|Ibn Khaldun|1332–1406|W|islamic
W|Muqaddimah|1377
W|Kitab al-Ibar|
I|Group solidarity (asabiyya) lets desert peoples conquer cities; luxury weakens them; dynasties rise and fall in about three or four generations.
I|Laid rules for criticising reports; seen as a founder of sociology and the philosophy of history.
C|Asabiyya|Group feeling or social solidarity that drives the rise and fall of dynasties
H|Khaldun = “Khandaan”: families rise with asabiyya and fall in 3–4 generations.
@bruni|Leonardo Bruni|c. 1370–1444|W|renaissance
W|History of the Florentine People|
I|Humanist civic history; often credited with the three-part division ancient–medieval–modern.
@valla|Lorenzo Valla|1407–1457|W|renaissance
W|On the Donation of Constantine|1440
I|Proved the Donation of Constantine a forgery by its Latin — a landmark of source criticism.
H|Valla = “Wah, fake pakda!” — language gave the forgery away.
@machiavelli|Niccolò Machiavelli|1469–1527|W|renaissance
W|The Prince|1513
W|Discourses on Livy|
W|Florentine Histories|
I|Politics as it is, not as it ought to be; used history for lessons of statecraft.
@guicciardini|Francesco Guicciardini|1483–1540|W|renaissance
W|History of Italy (Storia d’Italia)|
I|Critical political history from diplomatic documents.
@bodin|Jean Bodin|1530–1596|W|renaissance
W|Method for the Easy Comprehension of History|1566
I|Early method of reading histories; climate shapes peoples.
@mabillon|Jean Mabillon|1632–1707|W|erudite
W|De re diplomatica|1681
I|Founded diplomatics and palaeography: rules to test the age and authenticity of charters.
C|Diplomatics|Critical study of documents and charters to test their authenticity
@vico|Giambattista Vico|1668–1744|W|speculative
W|The New Science (Scienza Nuova)|1725
I|We can know history because humans made it (verum factum).
I|Three ages — gods, heroes, men — repeating in cycles (corsi e ricorsi).
C|Verum factum|The true is what has been made: humans can know history because they made it
C|Corsi e ricorsi|Recurring cycles of the ages of gods, heroes and men
H|Vico = “Vicious cycle”: ages come and come back.
@montesquieu|Montesquieu|1689–1755|W|enlight
W|The Spirit of the Laws|1748
I|Climate and geography shape laws and government; separation of powers.
@voltaire|Voltaire|1694–1778|W|enlight
W|The Age of Louis XIV|1751
W|Essay on the Customs and Spirit of Nations|1756
I|Coined the phrase “philosophy of history”; wrote history of civilisation and manners, not just wars.
H|Voltaire = Volt of light: Enlightenment’s spark.
@hume|David Hume|1711–1776|W|enlight
W|History of England|1754
I|Sceptical philosopher-historian; human nature is constant.
@robertson|William Robertson|1721–1793|W|enlight
W|An Historical Disquisition concerning Ancient India|1791
W|History of America|1777
I|Enlightenment historian who wrote admiringly of ancient Indian civilisation.
@gibbon|Edward Gibbon|1737–1794|W|enlight
W|The Decline and Fall of the Roman Empire|1776
I|Blamed Rome’s fall partly on Christianity and barbarian invasions.
Q|The triumph of barbarism and religion
H|Gibbon = “Gir-bin”: the fall of Rome.
@kant|Immanuel Kant|1724–1804|W|enlight
W|Idea for a Universal History with a Cosmopolitan Purpose|1784
I|History moves, through conflict (“unsocial sociability”), towards a lawful world order.
@condorcet|Condorcet|1743–1794|W|enlight
W|Sketch for a Historical Picture of the Progress of the Human Mind|1795
I|Human progress in ten stages, the tenth still to come.
@herder|Johann Gottfried Herder|1744–1803|W|romantic,speculative
W|Ideas on the Philosophy of History of Humanity|1784
I|Every people has its own spirit (Volksgeist) and must be judged by its own standards.
C|Volksgeist|The spirit of a people expressed in its language and culture
H|Herder = herd: each herd (people) has its own spirit.
@hegel|G.W.F. Hegel|1770–1831|W|speculative
W|Lectures on the Philosophy of History|1837
I|World Spirit (Weltgeist) unfolds through the dialectic; the state is its highest form.
I|Called India and China outside the movement of history — an idea later criticised.
Q|World history is the progress of the consciousness of freedom
C|Weltgeist|World Spirit unfolding through history
C|Cunning of reason|Reason uses human passions to achieve its own ends
H|Hegel = “Hey, Geist!”: the Spirit marches.
@niebuhr|Barthold Georg Niebuhr|1776–1831|W|rankean
W|Roman History (Niebuhr)|1811
I|Pioneer of critical method: separated legend from fact in early Rome.
@ranke|Leopold von Ranke|1795–1886|W|rankean
W|Histories of the Latin and Germanic Peoples|1824
W|History of the Popes|1834
I|Show the past “wie es eigentlich gewesen” — as it actually was — from archives and original documents.
I|Seminar method at Berlin; father of modern scientific history.
Q|Every epoch is immediate to God
C|Wie es eigentlich gewesen|To show the past “as it actually was”, from original sources
H|Ranke = Rank-1 archives: original documents first.
@comte|Auguste Comte|1798–1857|W|positivist
W|Course in Positive Philosophy|1830
I|Law of three stages: theological → metaphysical → positive (scientific); coined “sociology”.
C|Law of three stages|Human thought passes through theological, metaphysical and positive stages
H|Comte = Count 3: three stages.
@michelet|Jules Michelet|1798–1874|W|romantic
W|History of France|1833
I|Romantic nationalist; gave “Renaissance” its meaning as a period; history as resurrection of the past.
@carlyle|Thomas Carlyle|1795–1881|W|romantic
W|The French Revolution: A History|1837
W|On Heroes, Hero-Worship and the Heroic in History|1841
I|Great men make history (Great Man theory).
Q|The history of the world is but the biography of great men
C|Great Man theory|History is shaped mainly by heroic individuals
H|Carlyle = car of heroes.
@macaulay|T.B. Macaulay|1800–1859|W|whig
W|History of England from the Accession of James II|1848
W|Minute on Indian Education|1835
I|Classic Whig historian of English progress; in India pushed English education.
@droysen|Johann Gustav Droysen|1808–1884|W|rankean
W|Outline of the Principles of History (Grundriss der Historik)|1868
I|Prussian school; history aims at understanding (Verstehen) rather than causal explanation.
@mommsen|Theodor Mommsen|1817–1903|W|rankean
W|History of Rome|1854
W|Corpus Inscriptionum Latinarum (director)|
I|Great Roman historian and epigraphist; won the Nobel Prize for Literature (1902).
@sybel|Heinrich von Sybel|1817–1895|W|rankean
W|Historische Zeitschrift (journal founded)|1859
I|Prussian school; founded the first major professional history journal.
@burckhardt|Jacob Burckhardt|1818–1897|W|other
W|The Civilization of the Renaissance in Italy|1860
I|Cultural history: Renaissance as birth of the individual and of the state as a work of art.
@marx|Karl Marx|1818–1883|W|marxist
W|The Communist Manifesto (with Engels)|1848
W|The Eighteenth Brumaire of Louis Bonaparte|1852
W|A Contribution to the Critique of Political Economy|1859
W|Capital (Das Kapital), vol. I|1867
I|Historical materialism: the economic base shapes the political and ideological superstructure.
I|Stages: primitive communism, slavery, feudalism, capitalism, socialism; Asiatic mode of production for the East.
Q|The history of all hitherto existing society is the history of class struggles
Q|Men make their own history, but not just as they please
C|Base and superstructure|Economic relations (base) shape law, politics and ideas (superstructure)
C|Asiatic mode of production|Marx’s idea of self-sufficient villages under a despotic state, without private land
H|Marx = marks of class on every page.
@engels|Friedrich Engels|1820–1895|W|marxist
W|The Condition of the Working Class in England|1845
W|The Origin of the Family, Private Property and the State|1884
I|Marx’s partner; linked family, property and the rise of the state.
@buckle|H.T. Buckle|1821–1862|W|positivist
W|History of Civilization in England|1857
I|Positivist: climate, food and soil shape societies; history should find general laws.
@taine|Hippolyte Taine|1828–1893|W|positivist
W|History of English Literature|1863
I|Culture explained by race, milieu and moment.
C|Race, milieu, moment|Taine’s three determinants of a culture
@fustel|Fustel de Coulanges|1830–1889|W|positivist
W|The Ancient City|1864
I|Strict reliance on documents; religion shaped the ancient family and city.
@treitschke|Heinrich von Treitschke|1834–1896|W|rankean
W|German History in the Nineteenth Century|1879
I|Prussian school; nationalist historian of German unification.
@acton|Lord Acton|1834–1902|W|rankean
W|Cambridge Modern History (planned)|
I|Liberal Catholic; promoted scientific history in England.
Q|Study problems, not periods
Q|Power tends to corrupt, and absolute power corrupts absolutely
@dilthey|Wilhelm Dilthey|1833–1911|W|idealist
W|Introduction to the Human Sciences|1883
I|Human sciences differ from natural sciences; they need understanding (Verstehen) of lived experience.
C|Verstehen|Interpretive understanding of human meaning, from the inside
@bernheim|Ernst Bernheim|1850–1942|W|rankean
W|Textbook of Historical Method (Lehrbuch der historischen Methode)|1889
I|Standard German manual of external and internal criticism.
@langlois-seignobos|Langlois and Seignobos||W|rankean
W|Introduction to the Study of History|1898
I|French manual of method: heuristics, external and internal criticism, synthesis.
Q|No documents, no history
@turner|Frederick Jackson Turner|1861–1932|W|other
W|The Significance of the Frontier in American History|1893
I|The moving frontier shaped American democracy and character.
C|Frontier thesis|The western frontier shaped American democracy
@bury|J.B. Bury|1861–1927|W|rankean
W|The Science of History (inaugural lecture)|1903
W|The Idea of Progress|1920
Q|History is a science, no less and no more
@weber|Max Weber|1864–1920|W|other
W|The Protestant Ethic and the Spirit of Capitalism|1905
I|Ideas (Calvinist ethic) helped shape capitalism; ideal types as tools of analysis.
C|Ideal type|A model built by stressing key features, used to compare real cases
@croce|Benedetto Croce|1866–1952|W|idealist
W|Theory and History of Historiography|1917
W|History as the Story of Liberty|1938
Q|All history is contemporary history
H|Croce = “Kar se” — the past is written from today.
@trevelyan|G.M. Trevelyan|1876–1962|W|whig
W|Clio, a Muse|1913
W|English Social History|1944
I|Great-nephew of Macaulay; history as literature; social history as “history with the politics left out”.
@beard|Charles Beard|1874–1948|W|relativist
W|An Economic Interpretation of the Constitution of the United States|1913
W|Written History as an Act of Faith|1933
I|Economic interests shaped the US Constitution; objectivity is a “noble dream”.
@becker|Carl Becker|1873–1945|W|relativist
W|Everyman His Own Historian|1931
I|Every person constructs a past; history is relative to the present.
@febvre|Lucien Febvre|1878–1956|W|annales
W|A Geographical Introduction to History|1922
W|The Problem of Unbelief in the Sixteenth Century: The Religion of Rabelais|1942
W|Annales d’histoire économique et sociale (founded with Bloch)|1929
I|Co-founder of Annales; mentalities (outillage mental); problem-oriented history.
C|Histoire-problème|History that starts from a question, not a narrative of events
@spengler|Oswald Spengler|1880–1936|W|speculative
W|The Decline of the West|1918
I|Cultures are organisms that grow, mature and die; the West was in its decline (“civilisation” phase).
H|Spengler = “Spring-ler”: spring → winter, every culture dies.
@bloch|Marc Bloch|1886–1944|W|annales
W|The Royal Touch|1924
W|French Rural History|1931
W|Feudal Society|1939
W|The Historian’s Craft|1949
I|Co-founder of Annales; comparative history and mentalities; shot by the Nazis (1944).
I|Regressive method: read the past backwards from the present landscape.
C|Total history|Study every side of a society — economy, society, mentality — together
H|Bloch = block of Annales, with Febvre.
@namier|Lewis Namier|1888–1960|W|quant
W|The Structure of Politics at the Accession of George III|1929
I|Studied politics through careers of individual MPs (prosopography / collective biography).
C|Prosopography|Collective biography of a group to reveal patterns
@toynbee|Arnold Toynbee|1889–1975|W|speculative
W|A Study of History|1934
I|Civilisations grow by responding to challenges; a creative minority leads; about 21 civilisations studied.
C|Challenge and response|Civilisations grow by meeting challenges and decay when they fail
H|Toynbee = “Toy-be”: 21 civilisations like 21 toys, each challenged.
@collingwood|R.G. Collingwood|1889–1943|W|idealist
W|The Idea of History|1946
I|The historian re-enacts past thought; every event has an outside (action) and an inside (thought).
Q|All history is the history of thought
C|Re-enactment|The historian rethinks the thoughts of past actors
H|Collingwood = “call in the wood”: call back the thought.
@gramsci|Antonio Gramsci|1891–1937|W|marxist
W|Prison Notebooks|
I|Hegemony: rule by consent as well as force; “subaltern” classes — terms later used by Subaltern Studies.
C|Hegemony|Domination through consent and culture, not only force
C|Subaltern|Subordinate groups outside the ruling bloc (Gramsci’s term)
@carr|E.H. Carr|1892–1982|W|relativist
W|What is History?|1961
W|A History of Soviet Russia|1950
I|Facts do not speak for themselves; the historian selects them.
Q|An unending dialogue between the present and the past
Q|Study the historian before you begin to study the facts
H|Carr = car driven by the historian: facts are passengers.
@butterfield|Herbert Butterfield|1900–1979|W|other
W|The Whig Interpretation of History|1931
I|Attacked judging the past by present values and seeing it as steady progress.
C|Whig interpretation|Reading the past as steady progress leading to the present
@oakeshott|Michael Oakeshott|1901–1990|W|idealist
W|Experience and its Modes|1933
I|History is one mode of experience: the past for its own sake, not the practical past.
@braudel|Fernand Braudel|1902–1985|W|annales
W|The Mediterranean and the Mediterranean World in the Age of Philip II|1949
W|Civilization and Capitalism, 15th–18th Century|1979
I|Three levels of time: geographical (longue durée), social (conjunctures), individual (events).
Q|Events are dust
C|Longue durée|Very slow, long-term time of geography and structures
H|Braudel = broad-el: the broadest, longest time.
@popper|Karl Popper|1902–1994|W|analytic
W|The Poverty of Historicism|1957
W|The Open Society and Its Enemies|1945
I|Attacked “historicism” — the claim that history follows laws allowing prediction.
@hempel|Carl Hempel|1905–1997|W|analytic
W|The Function of General Laws in History|1942
I|Covering-law model: explaining an event means bringing it under general laws.
C|Covering-law model|Explanation by deducing an event from general laws
@wittfogel|Karl Wittfogel|1896–1988|W|other
W|Oriental Despotism|1957
I|Hydraulic societies: large irrigation works produced despotic states in Asia.
C|Hydraulic society|Despotic state built on control of large irrigation works
@dobb|Maurice Dobb|1900–1976|W|marxist
W|Studies in the Development of Capitalism|1946
I|Started the transition debate (feudalism to capitalism) with Paul Sweezy.
@beauvoir|Simone de Beauvoir|1908–1986|W|gender
W|The Second Sex|1949
Q|One is not born, but rather becomes, a woman
@walsh|W.H. Walsh|1913–1986|W|analytic
W|An Introduction to Philosophy of History|1951
I|Colligation: explaining events by grouping them under a unifying concept.
C|Colligation|Grouping events under a general idea to explain them
@hill|Christopher Hill|1912–2003|W|marxist
W|The World Turned Upside Down|1972
I|British Marxist historian of the English Revolution and radical sects.
@aries|Philippe Ariès|1914–1984|W|annales
W|Centuries of Childhood|1960
I|Argued childhood as a separate stage is a modern idea.
@hilton|Rodney Hilton|1916–2002|W|marxist
W|Bond Men Made Free|1973
I|British Marxist historian of medieval peasants and the 1381 revolt.
@hobsbawm|Eric Hobsbawm|1917–2012|W|marxist
W|Primitive Rebels|1959
W|The Age of Revolution|1962
W|Bandits|1969
W|The Age of Capital|1975
W|The Invention of Tradition (with Ranger)|1983
W|The Age of Empire|1987
W|The Age of Extremes|1994
I|Social banditry; invented traditions; the “short twentieth century” (1914–1991).
C|Social banditry|Peasant outlaws seen by their own people as heroes or avengers
C|Invented tradition|Recent practices presented as ancient to give legitimacy
C|Short twentieth century|1914–1991, from the First World War to the fall of the USSR
H|Hobsbawm’s “Ages”: Revolution → Capital → Empire → Extremes.
@mcneill|William H. McNeill|1917–2016|W|global
W|The Rise of the West|1963
I|World history of contacts and diffusion between civilisations.
@lerner|Gerda Lerner|1920–2013|W|gender
W|The Creation of Patriarchy|1986
I|Patriarchy is historical, not natural.
@elton|G.R. Elton|1921–1994|W|other
W|The Practice of History|1967
I|Defended empirical, archive-based history against Carr’s relativism.
@duby|Georges Duby|1919–1996|W|annales
W|The Three Orders: Feudal Society Imagined|1978
I|Medieval mentalities: those who pray, fight and work.
@le-goff|Jacques Le Goff|1924–2014|W|annales
W|Medieval Civilization|1964
I|Third-generation Annales; anthropology of the Middle Ages; “new history”.
@lyotard|Jean-François Lyotard|1924–1998|W|postmodern
W|The Postmodern Condition|1979
Q|Incredulity toward metanarratives
C|Metanarrative|A grand story that claims to explain all of history (e.g. progress, Marxism)
@thompson|E.P. Thompson|1924–1993|W|marxist
W|The Making of the English Working Class|1963
W|History from Below (essay)|1966
W|The Moral Economy of the English Crowd|1971
I|Class is made through experience; history from below.
Q|Rescue ordinary people from the enormous condescension of posterity
C|Moral economy|Crowd’s idea of a just price and fair practice, used to justify food riots
C|History from below|History of ordinary people, not elites
H|Thompson “made” the working class — from below.
@foucault|Michel Foucault|1926–1984|W|postmodern
W|Madness and Civilization|1961
W|The Archaeology of Knowledge|1969
W|Discipline and Punish|1975
W|The History of Sexuality, vol. I|1976
I|Power and knowledge are linked; genealogy of prisons, madness, sexuality; discourse and episteme.
C|Power/knowledge|Knowledge is produced by and supports power
C|Genealogy|Tracing how present practices came about through power, not progress
C|Panopticon|Prison where inmates feel always watched — model of modern discipline
@geertz|Clifford Geertz|1926–2006|W|cultural
W|The Interpretation of Cultures|1973
I|Anthropologist; culture as a text to be read through thick description (Balinese cockfight).
C|Thick description|Description of an action with its layers of cultural meaning
@fogel|Robert Fogel|1926–2013|W|quant
W|Time on the Cross (with Engerman)|1974
I|Cliometrics: economic theory and statistics applied to history; Nobel Prize in Economics (1993).
C|Cliometrics|Use of economic theory and statistics in history
@le-roy-ladurie|Emmanuel Le Roy Ladurie|1929–2023|W|annales
W|The Peasants of Languedoc|1966
W|Montaillou|1975
I|Third-generation Annales; Montaillou rebuilt a heretic village from an Inquisition register; “motionless history”.
@derrida|Jacques Derrida|1930–2004|W|postmodern
W|Of Grammatology|1967
I|Deconstruction: texts have no fixed meaning.
Q|There is nothing outside the text
C|Deconstruction|Reading that exposes unstable meanings and hidden oppositions in a text
@wallerstein|Immanuel Wallerstein|1930–2019|W|global
W|The Modern World-System, vol. I|1974
I|Capitalist world-economy of core, semi-periphery and periphery from the 16th century.
C|World-system theory|Global capitalist economy divided into core, semi-periphery and periphery
@nora|Pierre Nora|b. 1931|W|annales
W|Realms of Memory (Les Lieux de mémoire)|1984
I|Sites of memory: places, symbols and rituals where a nation remembers.
C|Lieux de mémoire|Sites of memory where collective memory is anchored
@crosby|Alfred Crosby|1931–2018|W|global
W|The Columbian Exchange|1972
W|Ecological Imperialism|1986
I|Plants, animals and germs crossing the Atlantic changed world history.
C|Columbian Exchange|Transfer of plants, animals and diseases between the Old and New Worlds after 1492
@white|Hayden White|1928–2018|W|postmodern
W|Metahistory|1973
I|Histories are narratives with plots (romance, tragedy, comedy, satire) and tropes.
C|Emplotment|Shaping events into a story with a plot type
H|White = writer: historians write like novelists.
@davis|Natalie Zemon Davis|1928–2023|W|micro
W|The Return of Martin Guerre|1983
I|Microhistory of a famous impostor case in 16th-century France.
@frank|Andre Gunder Frank|1929–2005|W|global
W|ReOrient|1998
I|Asia, especially China, was the centre of the world economy before 1800; dependency theory.
@said|Edward Said|1935–2003|W|postcolonial
W|Orientalism|1978
W|Culture and Imperialism|1993
I|Western scholarship constructed “the Orient” as exotic and inferior to justify domination.
C|Orientalism|Western way of representing the East as backward and other, tied to power
H|Said = “said” things about the East — and power wrote them.
@ginzburg|Carlo Ginzburg|b. 1939|W|micro
W|The Cheese and the Worms|1976
I|Microhistory of the miller Menocchio; evidential (clue) paradigm.
C|Microhistory|Intensive study of a small case to reveal larger structures
@darnton|Robert Darnton|b. 1939|W|cultural
W|The Great Cat Massacre|1984
I|Cultural history of meanings in 18th-century France.
@levi|Giovanni Levi|b. 1939|W|micro
W|Inheriting Power|1985
I|Italian microhistorian of a village exorcist.
@anderson|Perry Anderson|b. 1938|W|marxist
W|Passages from Antiquity to Feudalism|1974
W|Lineages of the Absolutist State|1974
I|Marxist comparative history of state forms.
@brenner|Robert Brenner|b. 1943|W|marxist
W|Agrarian Class Structure and Economic Development in Pre-Industrial Europe|1976
I|Class relations, not population, explain different paths of development (Brenner debate).
@spivak|Gayatri Chakravorty Spivak|b. 1942|W|postcolonial,subaltern
W|Can the Subaltern Speak?|1988
I|The subaltern woman is silenced by both colonial and native patriarchal discourse.
C|Strategic essentialism|Temporarily accepting a group identity for political action
@scott|Joan Wallach Scott|b. 1941|W|gender
W|Gender: A Useful Category of Historical Analysis|1986
I|Gender is a primary way of signifying relations of power.
@kelly|Joan Kelly|1928–1982|W|gender
W|Did Women Have a Renaissance?|1977
I|Periods look different when seen from women’s lives.
@rowbotham|Sheila Rowbotham|b. 1943|W|gender
W|Hidden from History|1973
I|Recovering women’s lives from socialist-feminist perspective.
@paul-thompson|Paul Thompson||W|other
W|The Voice of the Past: Oral History|1978
I|Pioneer of oral history method.
@fukuyama|Francis Fukuyama|b. 1952|W|other
W|The End of History and the Last Man|1992
I|After the Cold War, liberal democracy is the end point of ideological evolution.
@jenkins|Keith Jenkins||W|postmodern
W|Re-thinking History|1991
I|History is a discourse about the past, never the past itself.
@munslow|Alun Munslow||W|postmodern
W|Deconstructing History|1997
I|History as narrative construction.
@evans|Richard J. Evans|b. 1947|W|other
W|In Defence of History|1997
I|Defended historical knowledge against postmodern scepticism.
@marwick|Arthur Marwick|1936–2006|W|other
W|The Nature of History|1970
I|Textbook on historical method and primary versus secondary sources.
@bhabha|Homi K. Bhabha|b. 1949|W|postcolonial
W|The Location of Culture|1994
I|Hybridity, mimicry and ambivalence in colonial encounters.
C|Hybridity|Mixed cultural forms produced by colonial contact
@chakrabarty|Dipesh Chakrabarty|b. 1948|W|postcolonial,subaltern
W|Rethinking Working-Class History: Bengal 1890–1940|1989
W|Provincializing Europe|2000
I|Europe’s categories are not universal; they must be “provincialized”.
C|Provincializing Europe|Treating European ideas as one regional tradition, not a universal standard
@pomeranz|Kenneth Pomeranz|b. 1958|W|global
W|The Great Divergence|2000
I|China’s Yangzi delta and England were alike until c. 1800; coal and colonies made the difference.
C|Great Divergence|Why Europe pulled ahead of Asia economically after c. 1800
@abu-lughod|Janet Abu-Lughod|1928–2013|W|global
W|Before European Hegemony|1989
I|A 13th-century world system linked Europe, the Middle East and Asia.
@burke|Peter Burke|b. 1937|W|cultural
W|The French Historical Revolution: The Annales School, 1929–89|1990
W|What is Cultural History?|2004
I|British historian of the Annales school and of cultural history.
@hunt|Lynn Hunt|b. 1945|W|cultural
W|The New Cultural History (ed.)|1989
I|Gave the name to the new cultural history.
@skinner|Quentin Skinner|b. 1940|W|other
W|Meaning and Understanding in the History of Ideas|1969
I|Cambridge school of intellectual history: read texts in their linguistic context.
@lovejoy|Arthur Lovejoy|1873–1962|W|other
W|The Great Chain of Being|1936
I|Founder of the history of ideas (unit-ideas).
@erikson|Erik Erikson|1902–1994|W|other
W|Young Man Luther|1958
I|Psychohistory: psychoanalysis applied to historical figures.
C|Psychohistory|Using psychology to explain historical actors
@chartier|Roger Chartier|b. 1945|W|annales,cultural
W|The Cultural Origins of the French Revolution|1990
I|Fourth-generation Annales; history of books and reading.
@kalhana|Kalhana|12th c.|I|itihasa
W|Rajatarangini|1148
I|Verse history of the kings of Kashmir; seen as the first true historical work of India; stresses impartiality.
H|Kalhana = “Kal ka”: Kashmir’s yesterday.
@bana|Banabhatta|7th c.|I|itihasa
W|Harshacharita|
W|Kadambari|
I|Court poet of Harsha; first major historical biography (charita) in Sanskrit.
@bilhana|Bilhana|11th c.|I|itihasa
W|Vikramankadevacharita|
I|Biography of the Chalukya king Vikramaditya VI of Kalyani.
@sandhyakara|Sandhyakaranandin|c. 12th c.|I|itihasa
W|Ramacharita|
I|Double-meaning poem on Rama and the Pala king Ramapala (Kaivarta revolt).
@merutunga|Merutunga|14th c.|I|itihasa
W|Prabandhachintamani|1305
I|Jain prabandha (anecdotal history) of western India.
@alberuni|Alberuni|973–1048|I|indopersian
W|Kitab-ul-Hind (Tahqiq-i-Hind)|c1030
I|Came with Mahmud of Ghazni; studied Sanskrit; noted that Indians did not record history in order.
@minhaj|Minhaj-us-Siraj|b. 1193|I|indopersian
W|Tabaqat-i-Nasiri|1260
I|History of the early Delhi Sultans, dedicated to Nasiruddin Mahmud.
@barani|Ziauddin Barani|c. 1285–1357|I|indopersian
W|Tarikh-i-Firoz Shahi|1357
W|Fatawa-i-Jahandari|
I|Didactic history: history teaches rulers; favoured the high-born and orthodox rule (zawabit, state laws).
H|Barani = “bura-bhala” — judged every Sultan.
@khusrau|Amir Khusrau|1253–1325|I|indopersian
W|Khazain-ul-Futuh|
W|Qiran-us-Sadain|
W|Nuh Sipihr|
I|Poet-historian of the Khaljis; praised India in Nuh Sipihr.
@isami|Isami|14th c.|I|indopersian
W|Futuh-us-Salatin|
I|Verse history of the Sultans; critical of Muhammad bin Tughlaq.
@afif|Shams-i-Siraj Afif|14th c.|I|indopersian
W|Tarikh-i-Firoz Shahi (Afif)|
I|Detailed account of Firoz Shah Tughlaq’s reign.
@babur|Babur|1483–1530|I|indopersian
W|Baburnama (Tuzuk-i-Baburi)|
I|Memoir in Chaghatai Turkish; frank observations of Hindustan.
@abul-fazl|Abul Fazl|1551–1602|I|indopersian
W|Akbarnama|
W|Ain-i-Akbari|1598
I|Official, rational history of Akbar; sulh-i-kul; detailed statistics of the empire.
H|Abul Fazl = A for Akbar: Akbarnama + Ain.
@badauni|Abdul Qadir Badauni|1540–c. 1615|I|indopersian
W|Muntakhab-ut-Tawarikh|1595
I|Orthodox critic of Akbar’s religious experiments; wrote secretly.
@nizamuddin|Nizamuddin Ahmad|d. 1594|I|indopersian
W|Tabaqat-i-Akbari|1593
I|First Persian history to treat India as a whole, region by region.
@ferishta|Muhammad Qasim Ferishta|c. 1560–1620|I|indopersian
W|Tarikh-i-Ferishta (Gulshan-i-Ibrahimi)|
I|History of India and the Deccan written at Bijapur.
@lahori|Abdul Hamid Lahori|d. 1654|I|indopersian
W|Padshahnama (Badshahnama)|
I|Official history of Shah Jahan’s reign.
@khafi-khan|Khafi Khan|c. 1664–1732|I|indopersian
W|Muntakhab-ul-Lubab|
I|Wrote secretly on Aurangzeb’s reign and later Mughals.
@ghulam-husain|Ghulam Husain Tabatabai||I|indopersian
W|Siyar-ul-Mutakhkhirin|1781
I|Critical account of 18th-century Bengal and early British rule.
@jones|William Jones|1746–1794|I|orientalist
W|Asiatic Society of Bengal (founded)|1784
I|Saw the link of Sanskrit with Greek and Latin (Indo-European); identified Sandrocottus with Chandragupta Maurya.
H|Jones = joins languages: Sanskrit + Greek + Latin.
@colebrooke|H.T. Colebrooke|1765–1837|I|orientalist
W|On the Vedas|1805
I|Sanskritist who wrote on the Vedas, law and astronomy.
@wilkins|Charles Wilkins|1749–1836|I|orientalist
W|Bhagavad Gita (English translation)|1785
I|First English translation of the Gita; helped make Bengali type.
@prinsep|James Prinsep|1799–1840|I|orientalist
W|Decipherment of Brahmi|1837
I|Deciphered Brahmi and Kharoshthi; identified “Devanampiya Piyadasi”.
@max-muller|Max Müller|1823–1900|I|orientalist
W|A History of Ancient Sanskrit Literature|1859
W|Sacred Books of the East (ed.)|1879
I|Edited the Rigveda; popularised the idea of an Aryan race of language speakers.
@cunningham|Alexander Cunningham|1814–1893|I|orientalist
W|The Ancient Geography of India|1871
I|First Director-General of the Archaeological Survey of India; used Hiuen Tsang to locate sites.
@orme|Robert Orme|1728–1801|I|colonial
W|A History of the Military Transactions of the British Nation in Indostan|1763
I|Company historian of the Carnatic wars.
@dow|Alexander Dow|c. 1735–1779|I|colonial
W|The History of Hindostan|1768
I|Translated Ferishta; wrote on “oriental despotism”.
@wilks|Mark Wilks|c. 1759–1831|I|colonial
W|Historical Sketches of the South of India|1810
I|History of Mysore.
@mill|James Mill|1773–1836|I|colonial
W|The History of British India|1817
I|Utilitarian; never visited India; divided Indian history into Hindu, Muslim and British periods; called Indian civilisation backward.
C|Hindu–Muslim–British periodisation|James Mill’s religious division of Indian history
H|Mill = mill grinding India into 3 religious periods.
@metcalfe|Charles Metcalfe|1785–1846|I|colonial
W|Minute on village communities|1830
I|Described Indian villages as unchanging “little republics”.
C|Little republics|Colonial image of unchanging, self-sufficient Indian villages
@elphinstone|Mountstuart Elphinstone|1779–1859|I|colonial
W|The History of India|1841
I|Hindu and Muhammedan periods; administrator of Bombay.
@tod|James Tod|1782–1835|I|colonial
W|Annals and Antiquities of Rajasthan|1829
I|Romantic history of Rajput clans; compared them with European feudalism.
@grant-duff|James Grant Duff|1789–1858|I|colonial
W|A History of the Mahrattas|1826
I|First full history of the Marathas, by a British resident at Satara.
@elliot-dowson|Elliot and Dowson||I|colonial
W|The History of India as Told by Its Own Historians|1867
I|Eight volumes of translated Persian chronicles, chosen to show Muslim misrule.
@hunter|W.W. Hunter|1840–1900|I|colonial
W|The Indian Musalmans|1871
W|The Imperial Gazetteer of India|1881
I|Statistician-administrator; gazetteers.
@vasmith|Vincent A. Smith|1848–1920|I|colonial
W|The Early History of India|1904
W|Akbar the Great Mogul|1917
W|The Oxford History of India|1919
I|Saw India’s history as despotism and disunity, needing a strong central power.
H|Smith = smith hammering “despotism” on India.
@moreland|W.H. Moreland|1868–1938|I|colonial
W|India at the Death of Akbar|1920
W|The Agrarian System of Moslem India|1929
I|ICS officer; founder of Indian economic history of the Mughal period.
@rgbhandarkar|R.G. Bhandarkar|1837–1925|I|nationalist
W|Early History of the Dekkan|1884
I|Pioneer Indian historian of the Deccan and of Vaishnavism and Shaivism.
@ranade|M.G. Ranade|1842–1901|I|nationalist
W|Rise of the Maratha Power|1900
I|Maratha rise as a people’s movement inspired by saints.
@naoroji|Dadabhai Naoroji|1825–1917|I|nationalist
W|Poverty and Un-British Rule in India|1901
I|Drain of wealth theory.
C|Drain of wealth|Transfer of India’s wealth to Britain without return
@rcdutt|R.C. Dutt|1848–1909|I|nationalist
W|The Economic History of India|1902
I|Economic nationalist; land revenue and de-industrialisation.
@tilak|B.G. Tilak|1856–1920|I|nationalist
W|The Orion|1893
W|The Arctic Home in the Vedas|1903
I|Dated the Vedas very early using astronomy.
@savarkar|V.D. Savarkar|1883–1966|I|nationalist
W|The Indian War of Independence of 1857|1909
I|Called 1857 the first war of independence.
@mookerji|R.K. Mookerji|1884–1963|I|nationalist
W|The Fundamental Unity of India|1914
W|Chandragupta Maurya and His Times|
I|Stressed the cultural unity of India.
@jayaswal|K.P. Jayaswal|1881–1937|I|nationalist
W|Hindu Polity|1924
I|Called ancient ganas “republics” to show India’s democratic past.
H|Jayaswal = “Jai-swa-raj”: India had self-rule (republics) long ago.
@raychaudhuri|H.C. Raychaudhuri|1892–1957|I|nationalist
W|Political History of Ancient India|1923
I|Careful political history from Parikshit to the Guptas.
@majumdar|R.C. Majumdar|1888–1980|I|nationalist
W|The History and Culture of the Indian People (general editor)|1951
W|History of the Freedom Movement in India (Majumdar)|1962
I|Eleven volumes (Bharatiya Vidya Bhavan); challenged the official account of the freedom struggle.
@sastri|K.A. Nilakanta Sastri|1892–1975|I|nationalist
W|The Colas|1935
W|A History of South India|1955
I|Leading historian of South India; Chola state as strong and centralised.
@jsarkar|Jadunath Sarkar|1870–1958|I|nationalist
W|Shivaji and His Times|1919
W|History of Aurangzib|1912
W|Fall of the Mughal Empire|1932
I|Rigorous use of Persian and Marathi sources; critical of Aurangzeb.
@sardesai|G.S. Sardesai|1865–1959|I|nationalist
W|New History of the Marathas|1946
I|Maratha history from Marathi sources (Peshwa daftar).
@altekar|A.S. Altekar|1898–1960|I|nationalist
W|The Position of Women in Hindu Civilization|1938
W|State and Government in Ancient India|1949
I|Ancient Indian women and polity.
@tara-chand|Tara Chand|1888–1973|I|nationalist
W|Influence of Islam on Indian Culture|1922
W|History of the Freedom Movement in India (Tara Chand)|1961
I|Composite culture; official history of the freedom movement.
@sn-sen|S.N. Sen|1890–1962|I|nationalist
W|Eighteen Fifty-Seven|1957
I|Official centenary history of the revolt.
@panikkar|K.M. Panikkar|1895–1963|I|nationalist
W|Asia and Western Dominance|1953
I|Vasco da Gama epoch (1498–1945) of Western dominance in Asia.
@nehru|Jawaharlal Nehru|1889–1964|I|nationalist
W|Glimpses of World History|1934
W|The Discovery of India|1946
I|Unity in diversity; written in jail.
@kosambi|D.D. Kosambi|1907–1966|I|marxist-i
W|An Introduction to the Study of Indian History|1956
W|Myth and Reality|1962
W|The Culture and Civilisation of Ancient India in Historical Outline|1965
I|Founder of Marxist history in India; combined field-work, archaeology and texts; “feudalism from above” and “from below”.
Q|History is the presentation in chronological order of successive changes in the means and relations of production
H|Kosambi = combined: maths + Marx + fieldwork.
@dange|S.A. Dange|1899–1991|I|marxist-i
W|India from Primitive Communism to Slavery|1949
I|Early orthodox Marxist scheme for ancient India.
@rpdutt|R. Palme Dutt|1896–1974|I|marxist-i
W|India Today|1940
I|Marxist critique of colonial exploitation and the national movement.
@ardesai|A.R. Desai|1915–1994|I|marxist-i
W|Social Background of Indian Nationalism|1948
I|Nationalism as a product of colonial economic change.
@rssharma|R.S. Sharma|1919–2011|I|marxist-i,state-i
W|Sudras in Ancient India|1958
W|Indian Feudalism|1965
W|Material Culture and Social Formations in Ancient India|1983
W|Urban Decay in India|1987
W|Looking for the Aryans|1995
I|Indian feudalism c. 300–1200: land grants, decline of trade and towns, Kali age crisis.
C|Indian feudalism|Land grants to brahmanas and officials created intermediaries and dependent peasants (c. 300–1200)
H|Sharma = “sharm” of the Kali age: crisis → feudalism.
@thapar|Romila Thapar|b. 1931|I|marxist-i
W|Asoka and the Decline of the Mauryas|1961
W|From Lineage to State|1984
W|Early India|2002
W|Somanatha: The Many Voices of a History|2004
I|Social history of early India; lineage to state; multiple voices on Somanatha.
@dnjha|D.N. Jha|1940–2021|I|marxist-i
W|The Myth of the Holy Cow|2002
I|Beef eating in early Indian texts.
@ihabib|Irfan Habib|b. 1931|I|marxist-i,aligarh
W|The Agrarian System of Mughal India|1963
W|An Atlas of the Mughal Empire|1982
I|Agrarian crisis of the jagirdari system explained Mughal decline; peasant revolts.
H|Habib = “hisaab”: counted the Mughal revenue.
@bipan|Bipan Chandra|1928–2014|I|marxist-i
W|The Rise and Growth of Economic Nationalism in India|1966
W|Communalism in Modern India|1984
W|India’s Struggle for Independence (with others)|1988
I|Congress strategy as a Gramscian “war of position”: struggle–truce–struggle (S–T–S).
C|Struggle–Truce–Struggle|Bipan Chandra’s description of Congress strategy as a war of position
@sumit-sarkar|Sumit Sarkar|b. 1939|I|marxist-i
W|The Swadeshi Movement in Bengal 1903–1908|1973
W|Modern India 1885–1947|1983
W|Writing Social History|1997
I|Early member of Subaltern Studies who later criticised its cultural turn (“The Decline of the Subaltern in Subaltern Studies”).
@ashraf|K.M. Ashraf|1903–1962|I|marxist-i
W|Life and Conditions of the People of Hindustan|1935
I|Social history of the Sultanate period.
@mukhia|Harbans Mukhia|b. 1939|I|marxist-i
W|Historians and Historiography during the Reign of Akbar|1976
W|Was There Feudalism in Indian History? (article)|1981
I|Challenged the Indian feudalism thesis: Indian peasants were free.
@bns-yadava|B.N.S. Yadava||I|marxist-i
W|Society and Culture in Northern India in the Twelfth Century|1973
I|Supported the feudalism thesis with social evidence.
@mhabib|Mohammad Habib|1895–1971|I|aligarh
W|Sultan Mahmud of Ghaznin|1927
W|Introduction to Elliot and Dowson vol. II|1952
I|Turkish conquest as an “urban revolution” and “rural revolution”.
C|Urban and rural revolution|Mohammad Habib’s view of change after the Turkish conquest
@athar-ali|M. Athar Ali|1925–1998|I|aligarh
W|The Mughal Nobility under Aurangzeb|1966
W|The Apparatus of Empire|1985
I|Composition of the Mughal nobility; shortage of jagirs (be-jagiri).
@nurul-hasan|S. Nurul Hasan|1921–1993|I|aligarh
W|Thoughts on Agrarian Relations in Mughal India|1973
I|Three types of zamindars: autonomous chiefs, intermediary and primary zamindars.
@moosvi|Shireen Moosvi||I|aligarh
W|The Economy of the Mughal Empire c. 1595|1987
I|Statistical study of the Ain-i-Akbari.
@satish-chandra|Satish Chandra|1922–2017|I|aligarh
W|Parties and Politics at the Mughal Court|1959
W|Medieval India: From Sultanat to the Mughals|1997
I|Crisis of the jagirdari system and noble factions in Mughal decline.
@seal|Anil Seal||I|cambridge
W|The Emergence of Indian Nationalism|1968
I|Nationalism as competition and collaboration among western-educated elites.
@gallagher|John Gallagher|1919–1980|I|cambridge
W|Locality, Province and Nation (ed. with Johnson & Seal)|1973
I|Imperialism of free trade; local politics in India.
@gjohnson|Gordon Johnson||I|cambridge
W|Provincial Politics and Indian Nationalism|1973
I|Bombay politics and the Congress.
@jbrown|Judith Brown|b. 1944|I|cambridge
W|Gandhi’s Rise to Power|1972
I|Gandhi rose through sub-contractors (local leaders) of politics.
@bayly|C.A. Bayly|1945–2015|I|cambridge
W|Rulers, Townsmen and Bazaars|1983
W|Indian Society and the Making of the British Empire|1988
W|Empire and Information|1996
W|The Birth of the Modern World|2004
I|18th century as regional growth, not decline; Indian merchants helped the Company.
@washbrook|David Washbrook||I|cambridge
W|The Emergence of Provincial Politics: Madras Presidency|1976
I|Madras politics through local networks.
@frobinson|Francis Robinson|b. 1944|I|cambridge
W|Separatism among Indian Muslims|1974
I|Muslim politics in UP as elite interest.
@tapan|Tapan Raychaudhuri|1926–2014|I|other
W|Indian Nationalism as Animal Politics (review)|1979
W|Europe Reconsidered|1988
I|Attacked the Cambridge school for ignoring ideas and emotions — called its view “animal politics”.
@rguha|Ranajit Guha|1923–2023|I|subaltern
W|A Rule of Property for Bengal|1963
W|On Some Aspects of the Historiography of Colonial India|1982
W|Elementary Aspects of Peasant Insurgency in Colonial India|1983
W|Dominance without Hegemony|1997
I|Founded Subaltern Studies (vol. I, 1982); peasants had their own politics; colonial rule was dominance without hegemony.
C|Dominance without hegemony|Colonial rule ruled by force without winning consent
H|Guha = “gully”: history from the gullies, not the palaces.
@pchatterjee|Partha Chatterjee|b. 1947|I|subaltern
W|Nationalist Thought and the Colonial World: A Derivative Discourse?|1986
W|The Nation and Its Fragments|1993
I|Nationalism borrowed Western forms but claimed an inner spiritual domain.
C|Derivative discourse|Nationalist thought shaped by colonial categories
C|Inner and outer domain|Nationalism kept an inner spiritual sphere free from the West
@amin|Shahid Amin||I|subaltern
W|Gandhi as Mahatma (essay)|1984
W|Event, Metaphor, Memory: Chauri Chaura 1922–1992|1995
I|How peasants imagined Gandhi; memory of Chauri Chaura.
@pandey|Gyanendra Pandey||I|subaltern
W|The Construction of Communalism in Colonial North India|1990
W|Remembering Partition|2001
I|Communalism as a colonial construct.
@hardiman|David Hardiman||I|subaltern
W|The Coming of the Devi|1987
I|Adivasi assertion in western India.
@arnold|David Arnold||I|subaltern
W|Colonizing the Body|1993
I|Medicine and epidemics under colonial rule.
@uma-chakravarti|Uma Chakravarti|b. 1941|I|gender-i
W|Conceptualising Brahmanical Patriarchy in Early India (article)|1993
W|Rewriting History: The Life and Times of Pandita Ramabai|1998
W|Gendering Caste|2003
I|Caste purity depends on controlling women’s sexuality — brahmanical patriarchy.
C|Brahmanical patriarchy|Control of women’s sexuality to keep caste boundaries
@sangari-vaid|Kumkum Sangari and Sudesh Vaid||I|gender-i
W|Recasting Women (ed.)|1989
I|Essays on colonial-era reform and the remaking of patriarchy.
@tanika-sarkar|Tanika Sarkar||I|gender-i
W|Hindu Wife, Hindu Nation|2001
I|Women, religion and nationalism in Bengal.
@butalia|Urvashi Butalia|b. 1952|I|gender-i
W|The Other Side of Silence|1998
I|Oral history of women and partition.
@menon-bhasin|Ritu Menon and Kamla Bhasin||I|gender-i
W|Borders and Boundaries|1998
I|Women in India’s partition.
@kumkum-roy|Kumkum Roy||I|gender-i
W|The Emergence of Monarchy in North India|1994
I|Gender and early Indian polity.
@forbes|Geraldine Forbes||I|gender-i
W|Women in Modern India|1996
I|Survey of women’s history in modern India.
@phule|Jyotirao Phule|1827–1890|I|dalit
W|Gulamgiri|1873
I|Brahmanical domination as slavery; a counter-history of the Aryan invasion.
@ambedkar|B.R. Ambedkar|1891–1956|I|dalit
W|Annihilation of Caste|1936
W|Who Were the Shudras?|1946
W|The Untouchables|1948
I|Shudras were once Kshatriyas; untouchability arose from “broken men”.
@omvedt|Gail Omvedt|1941–2021|I|dalit
W|Dalits and the Democratic Revolution|1994
I|Anti-caste movements as democratic revolution.
@zelliot|Eleanor Zelliot|1926–2016|I|dalit
W|From Untouchable to Dalit|1992
I|The Ambedkarite movement.
@ohanlon|Rosalind O’Hanlon||I|dalit
W|Caste, Conflict and Ideology|1985
I|Phule and low-caste protest in 19th-century western India.
@gadgil-guha|Madhav Gadgil and Ramachandra Guha||I|env-i
W|This Fissured Land|1992
I|Ecological history of India.
@ramachandra-guha|Ramachandra Guha|b. 1958|I|env-i
W|The Unquiet Woods|1989
I|Chipko and peasant resistance in the Himalaya.
@rangarajan|Mahesh Rangarajan||I|env-i
W|Fencing the Forest|1996
I|Colonial forest policy in the Central Provinces.
@grove|Richard Grove|1955–2020|I|env-i
W|Green Imperialism|1995
I|Colonial roots of environmentalism.
@tirthankar-roy|Tirthankar Roy||I|econ-i
W|The Economic History of India 1857–1947|2000
I|Economic history of colonial India.
@dharma-kumar|Dharma Kumar|1928–2001|I|econ-i
W|Land and Caste in South India|1965
W|The Cambridge Economic History of India, vol. 2 (ed.)|1983
I|Agrarian labour in Madras.
@kn-chaudhuri|K.N. Chaudhuri||I|econ-i
W|Trade and Civilisation in the Indian Ocean|1985
I|Braudelian history of the Indian Ocean.
@das-gupta|Ashin Das Gupta|1932–1998|I|econ-i
W|Indian Merchants and the Decline of Surat|1979
I|Indian Ocean merchants.
@om-prakash|Om Prakash||I|econ-i
W|The Dutch East India Company and the Economy of Bengal|1985
I|European trade and Bengal.
@morris|Morris D. Morris||I|econ-i
W|Towards a Reinterpretation of Nineteenth-Century Indian Economic History|1963
I|Questioned the nationalist de-industrialisation thesis.
@stein|Burton Stein|1926–1996|I|state-i
W|Peasant State and Society in Medieval South India|1980
I|Chola state was segmentary: ritual sovereignty at the centre, real power with peasant localities (nadus).
C|Segmentary state|Ritual sovereignty at the centre, political power in local segments (Southall’s model)
H|Stein = stone segments: many pieces, one ritual centre.
@kulke|Hermann Kulke|b. 1938|I|state-i
W|A History of India (with Rothermund)|1986
I|Processual (integrative) model of state formation; Jagannath cult and Odisha kingship.
@bdc|B.D. Chattopadhyaya||I|state-i
W|The Making of Early Medieval India|1994
I|Integrative model: local states formed by integrating lineages, peasants and cults — not decline.
C|Integrative model|Early medieval states grew by integrating local groups, cults and lineages
@karashima|Noboru Karashima|1933–2015|I|state-i
W|South Indian History and Society|1984
I|Chola land rights from inscriptions using statistics.
@champakalakshmi|R. Champakalakshmi||I|state-i
W|Trade, Ideology and Urbanization: South India 300 BC to AD 1300|1996
I|Temple towns and urbanisation.
@cohn|Bernard Cohn|1928–2003|I|colknow
W|Colonialism and Its Forms of Knowledge|1996
I|Census, survey and law as colonial knowledge.
@dirks|Nicholas Dirks|b. 1950|I|colknow
W|Castes of Mind|2001
I|Modern caste shaped by colonial ethnography and census.
@inden|Ronald Inden||I|colknow
W|Imagining India|1990
I|Western scholarship imagined India as essentialised.
@trautmann|Thomas Trautmann||I|colknow
W|Aryans and British India|1997
I|Victorian ideas of race and language.
@basham|A.L. Basham|1914–1986|I|other
W|The Wonder That Was India|1954
I|Sympathetic survey of ancient Indian culture.
@dcsircar|D.C. Sircar|1907–1985|I|other
W|Indian Epigraphy|1965
I|Leading epigraphist; edited Select Inscriptions.
@upinder|Upinder Singh|b. 1959|I|other
W|A History of Ancient and Early Medieval India|2008
W|Political Violence in Ancient India|2017
I|Textbook combining texts, archaeology and inscriptions.
@alam|Muzaffar Alam|b. 1947|I|other
W|The Crisis of Empire in Mughal North India|1986
I|18th century: regional states in Awadh and Punjab grew as the empire weakened.
@jalal|Ayesha Jalal|b. 1956|I|other
W|The Sole Spokesman|1985
I|Jinnah used the Pakistan demand as a bargaining counter.
@joya-chatterji|Joya Chatterji||I|other
W|Bengal Divided|1994
I|Bengal Hindus also sought partition.
`;

  J.historians = [];
  J.hConcepts = [];
  var cur = null;
  function yr(s) {
    s = (s || '').trim(); if (!s) return null;
    var approx = s.charAt(0) === 'c'; var n = parseInt(approx ? s.slice(1) : s, 10);
    return isNaN(n) ? null : { y: n, approx: approx };
  }
  RAW.split('\n').forEach(function (line) {
    line = line.trim(); if (!line) return;
    var p = line.split('|');
    if (p[0].charAt(0) === '@') {
      cur = { id: p[0].slice(1), n: p[1], life: p[2], r: p[3], s: p[4].split(','), w: [], i: [], q: [], hk: '', c: [] };
      J.historians.push(cur); return;
    }
    if (!cur) return;
    if (p[0] === 'W') { var y = yr(p[2]); cur.w.push({ t: p[1], y: y ? y.y : null, approx: y ? y.approx : false }); }
    else if (p[0] === 'I') cur.i.push(p[1]);
    else if (p[0] === 'Q') cur.q.push(p[1]);
    else if (p[0] === 'H') cur.hk = p[1];
    else if (p[0] === 'C') { cur.c.push([p[1], p[2]]); J.hConcepts.push({ t: p[1], m: p[2], h: cur.id }); }
  });
})(window.JRF);

/* Hand-written historiography questions (appended to the Unit X topics) */
(function (J) {
  var Q = J.Q;
  function addQ(tid, qs) { var t = J.topics.filter(function (x) { return x.id === tid; })[0]; if (t) t.q = (t.q || []).concat(qs); }
  addQ('h10-anc', [
    Q.ar('Ibn Khaldun explained the rise and fall of dynasties through asabiyya.', 'He held that history is moved only by divine will and cannot be studied rationally.', 2, 'Ibn Khaldun gave a rational, social explanation: group solidarity (asabiyya) rises and decays.'),
    Q.ar('Herodotus is called the “Father of History”.', 'He relied entirely on written state archives.', 2, 'Herodotus mostly used oral reports and his own travels; Cicero called him the Father of History.'),
    Q.ar('Thucydides is often called the father of scientific history.', 'He rejected the gods as causes and checked eyewitness accounts.', 0, '')
  ]);
  addQ('h10-ren', [
    Q.ar('Ranke insisted on the use of original archival documents.', 'He wanted to show the past “as it actually was”.', 0, 'Wie es eigentlich gewesen.'),
    Q.ar('Vico held that humans can know history better than they know nature.', 'Humans themselves have made history (verum factum).', 0, ''),
    Q.ar('Lorenzo Valla proved the Donation of Constantine to be a forgery.', 'He found words and forms in its Latin that could not belong to the 4th century.', 0, ''),
    Q.st('Which of the following are correct about Leopold von Ranke?', ['He trained students through the seminar method.', 'He wrote “The Idea of History”.', 'He stressed primary sources and archives.', 'He wanted to write history “as it actually was”.'], [true, false, true, true], '“The Idea of History” is by R.G. Collingwood.')
  ]);
  addQ('h10-phil', [
    Q.ar('E.H. Carr argued that facts do not speak for themselves.', 'The historian decides which facts become historical facts.', 0, ''),
    Q.ar('Braudel divided historical time into three levels.', 'He regarded short-term events as the most important level of history.', 2, 'For Braudel the longue durée mattered most; events were “dust”.'),
    Q.ar('Collingwood said that all history is the history of thought.', 'He held that the historian must re-enact past thought in his own mind.', 0, ''),
    Q.ar('The Annales school favoured “total history”.', 'It was founded by Lucien Febvre and Marc Bloch in 1929.', 1, 'Both true, but the founding date does not explain the method.'),
    Q.ar('Hayden White treated historical writing as a form of narrative.', 'He argued that histories are shaped by plot types such as romance and tragedy.', 0, ''),
    Q.ar('Lyotard defined the postmodern as incredulity toward metanarratives.', 'Lyotard was one of the founders of the Annales school.', 2, ''),
    Q.ar('Edward Said’s “Orientalism” linked Western knowledge of the East with power.', 'Said drew on Michel Foucault’s idea of discourse.', 0, ''),
    Q.ar('Toynbee held that civilisations grow through challenge and response.', 'Spengler wrote “A Study of History”.', 2, '“A Study of History” is Toynbee’s; Spengler wrote “The Decline of the West”.'),
    Q.st('Which of the following are correct about the Annales school?', ['It was founded in 1929 by Lucien Febvre and Marc Bloch.', 'Fernand Braudel belonged to its second generation.', 'It focused mainly on political events and great men.', 'Le Roy Ladurie wrote “Montaillou”.'], [true, true, false, true], 'Annales moved away from event-based political history.'),
    Q.mcq('Which of the following is NOT a work of Eric Hobsbawm?', ['The Age of Revolution', 'The Age of Extremes', 'The Making of the English Working Class', 'Primitive Rebels'], 2, '“The Making of the English Working Class” is by E.P. Thompson.')
  ]);
  addQ('h10-meth', [
    Q.ch('Arrange the following works in chronological order:', ['Muqaddimah — Ibn Khaldun', 'The New Science — Vico', 'The Decline and Fall of the Roman Empire — Gibbon', 'What is History? — E.H. Carr'], '1377 → 1725 → 1776 → 1961.'),
    Q.mt('Match the concept with the thinker:', ['Asabiyya', 'Verum factum', 'Longue durée', 'Re-enactment'], ['Ibn Khaldun', 'Giambattista Vico', 'Fernand Braudel', 'R.G. Collingwood'], '', ['Concept', 'Thinker'])
  ]);
  addQ('h10-ind', [
    Q.ar('James Mill divided Indian history into Hindu, Muslim and British periods.', 'Mill spent many years in India studying its archives.', 2, 'Mill never visited India.'),
    Q.ar('Subaltern Studies criticised the elite historiography of Indian nationalism.', 'It argued that both colonialist and nationalist histories left out the politics of the people.', 0, ''),
    Q.ar('R.S. Sharma described the period c. 300–1200 CE as feudal.', 'Land grants created a class of landed intermediaries above the peasants.', 0, ''),
    Q.ar('Burton Stein called the Chola state “segmentary”.', 'He held that real power lay with peasant localities while the king had ritual sovereignty.', 0, ''),
    Q.ar('The Cambridge school saw Indian nationalism as a contest among elites.', 'It stressed competition and collaboration within British institutions.', 0, ''),
    Q.ar('K.P. Jayaswal wrote “Hindu Polity”.', 'He wanted to show that ancient India had republican traditions.', 0, ''),
    Q.ar('Bipan Chandra described Congress strategy as struggle–truce–struggle.', 'He used Gramsci’s idea of a “war of position”.', 0, ''),
    Q.st('Which of the following are correct about Subaltern Studies?', ['Its first volume appeared in 1982.', 'Ranajit Guha was its founding editor.', 'The word “subaltern” was taken from Gramsci.', 'It celebrated the elite leadership of the Congress.'], [true, true, true, false], ''),
    Q.ch('Arrange the following works in chronological order:', ['The History of British India — James Mill', 'Hindu Polity — K.P. Jayaswal', 'An Introduction to the Study of Indian History — D.D. Kosambi', 'Subaltern Studies, vol. I — Ranajit Guha (ed.)'], '1817 → 1924 → 1956 → 1982.'),
    Q.s2('The Cambridge school emphasised ideology and mass mobilisation in Indian nationalism.', 'Tapan Raychaudhuri criticised the Cambridge view as “animal politics”.', false, true, 'The Cambridge school stressed elite interests, not ideology.')
  ]);
})(window.JRF);
