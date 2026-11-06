/* Master timeline. Format: year|event|unit   (negative = BCE; a leading ~ = approximate date, used only with wide gaps in chronology questions) */
(function (J) {
  var RAW = `
~-7000|Farming begins at Mehrgarh|H1
~-2600|Mature Harappan phase begins|H1
~-2350|Sargon of Akkad’s texts mention Meluhha|H1
~-1900|Decline of Harappan cities begins|H1
~-1500|Composition of the Rigveda begins|H1
~-1380|Boghazkoi inscription names Vedic gods|H1
~-1000|Painted Grey Ware & spread of iron in the Ganga valley|H1
~-600|Sixteen Mahajanapadas|H1
~-563|Birth of the Buddha (traditional date)|H1
~-540|Birth of Mahavira (one traditional view)|H1
~-544|Bimbisara becomes king of Magadha|H2
~-518|Darius I makes north-west India a Persian satrapy|H2
~-483|First Buddhist council at Rajagriha|H1
~-383|Second Buddhist council at Vaishali|H1
~-345|Mahapadma Nanda founds the Nanda dynasty|H2
-326|Alexander crosses the Indus; Battle of the Hydaspes|H2
-323|Death of Alexander at Babylon|H2
~-321|Chandragupta Maurya founds the Mauryan empire|H2
-305|Chandragupta Maurya defeats Seleucus Nicator|H2
~-268|Ashoka becomes emperor|H2
~-261|Kalinga war|H2
~-250|Third Buddhist council at Pataliputra|H2
~-185|Pushyamitra Shunga kills Brihadratha|H2
~-165|Menander rules from Sakala|H2
~-110|Heliodorus pillar set up at Besnagar|H2
-57|Start of the Vikrama era|H2
~-28|End of the Kanva dynasty|H2
~45|Hippalus/monsoon route in use for Indo-Roman trade|H2
78|Start of the Shaka era|H2
~127|Accession of Kanishka (revised dating)|H2
~150|Junagadh inscription of Rudradaman I|H2
~106|Gautamiputra Satakarni becomes king|H2
320|Start of the Gupta era (Chandragupta I)|H2
~335|Samudragupta becomes king|H2
~375|Chandragupta II becomes king|H2
399|Fa-Hien begins his journey to India|H2
~415|Kumaragupta I becomes king|H2
~455|Skandagupta repels the Hunas|H2
476|Birth of Aryabhata|H2
499|Aryabhatiya composed|H2
510|Eran inscription — first epigraphic sati|H2
532|Mandasor inscription of Yashodharman|H2
543|Pulakeshin I founds the Badami Chalukya kingdom|H3
606|Harsha era begins|H2
~618|Pulakeshin II defeats Harsha on the Narmada|H2
628|Brahmagupta writes Brahmasphutasiddhanta|H2
629|Hiuen Tsang sets out for India|H2
634|Aihole inscription of Pulakeshin II|H3
642|Narasimhavarman I captures Vatapi|H3
643|Harsha’s assembly at Kanauj|H2
647|Death of Harsha|H2
671|I-tsing sets out for India|H2
712|Muhammad bin Qasim conquers Sindh|H3
~750|Gopala elected king of Bengal|H3
~753|Dantidurga founds Rashtrakuta power|H3
~788|Birth of Shankaracharya (traditional)|H3
~836|Mihira Bhoja becomes Pratihara king|H3
851|Arab merchant Sulaiman writes about India|H3
~850|Vijayalaya Chola captures Thanjavur|H3
919|First Uttaramerur inscription of Parantaka I|H3
949|Battle of Takkolam|H3
973|Tailapa II founds the Kalyani Chalukya dynasty|H3
985|Rajaraja Chola I becomes king|H3
~983|Gommateshvara statue at Shravanabelagola|H3
1000|Mahmud of Ghazni’s first raid on India|H3
1010|Brihadishvara temple at Thanjavur completed|H3
1025|Mahmud of Ghazni sacks Somnath|H3
1025|Rajendra Chola’s naval raid on Srivijaya|H3
1030|Alberuni completes Kitab-ul-Hind (c.)|H3
1077|Kulottunga I sends 72 merchants to China|H3
1117|Chennakeshava temple at Belur|H3
1148|Kalhana begins Rajatarangini|H1
1175|Muhammad Ghori takes Multan|H4
1178|Ghori defeated at Kayadara by the Chaulukyas|H4
1191|First Battle of Tarain|H4
1192|Second Battle of Tarain|H4
1194|Battle of Chandawar|H4
~1204|Bakhtiyar Khalji captures Nadia|H4
1206|Qutbuddin Aibak becomes Sultan|H4
1221|Chingiz Khan reaches the Indus|H5
1229|Iltutmish receives investiture from the Caliph|H4
1236|Raziya becomes Sultan|H4
1266|Balban becomes Sultan|H4
1290|Jalaluddin Khalji founds the Khalji dynasty|H4
1296|Alauddin Khalji becomes Sultan|H4
1303|Alauddin captures Chittor|H4
1311|Alai Darwaza built|H6
1311|Malik Kafur reaches Madurai|H4
1320|Ghiyasuddin Tughlaq founds the Tughlaq dynasty|H4
1325|Muhammad bin Tughlaq becomes Sultan|H4
1327|Capital shifted to Daulatabad|H4
1329|Token currency introduced|H4
1333|Ibn Battuta arrives in India|H4
1336|Foundation of Vijayanagara|H4
1347|Foundation of the Bahmani kingdom|H4
1351|Firoz Shah Tughlaq becomes Sultan|H4
1398|Timur sacks Delhi|H4
1414|Khizr Khan founds the Sayyid dynasty|H4
1420|Nicolo Conti visits Vijayanagara (c.)|H4
1443|Abdur Razzaq visits Vijayanagara|H4
1451|Bahlul Lodi founds the Lodi dynasty|H4
1469|Birth of Guru Nanak|H6
1481|Execution of Mahmud Gawan|H4
1498|Vasco da Gama reaches Calicut|H7
1504|Sikandar Lodi founds Agra|H4
1509|Krishnadevaraya becomes king|H4
1510|Albuquerque captures Goa|H7
1526|First Battle of Panipat|H4
1527|Battle of Khanwa|H4
1528|Battle of Chanderi|H4
1529|Battle of Ghaghra|H4
1539|Battle of Chausa|H4
1540|Battle of Kanauj (Bilgram)|H4
1544|Battle of Samel (Giri-Sumel)|H4
1545|Death of Sher Shah at Kalinjar|H4
1556|Second Battle of Panipat|H4
1562|Akbar marries the daughter of Raja Bharmal|H4
1563|Akbar abolishes the pilgrim tax|H4
1564|Akbar abolishes jizya|H4
1565|Battle of Talikota|H4
1568|Akbar captures Chittor|H4
1571|Foundation of Fatehpur Sikri|H6
1574|Tulsidas begins Ramcharitmanas|H6
1575|Ibadat Khana built|H4
1576|Battle of Haldighati|H4
1579|Mahzar issued|H4
1580|Ain-i-Dahsala introduced|H5
1582|Din-i-Ilahi / Tauhid-i-Ilahi|H4
1591|Charminar built; Hyderabad founded|H4
1600|English East India Company chartered|H7
1601|Akbar captures Asirgarh|H4
1602|Dutch VOC formed|H7
1604|Compilation of the Adi Granth|H6
1606|Execution of Guru Arjan Dev|H6
1608|William Hawkins reaches Surat|H7
1611|Jahangir marries Nur Jahan|H4
1612|Battle of Swally|H7
1613|English factory at Surat|H7
1615|Sir Thomas Roe reaches Jahangir’s court|H7
1622|Persians capture Kandahar|H5
1632|Construction of the Taj Mahal begins|H6
1633|Mughals annex Ahmadnagar|H4
1639|Fort St George (Madras) founded|H7
1649|Mughals finally lose Kandahar|H5
1658|Battle of Samugarh|H4
1659|Shivaji kills Afzal Khan|H4
1661|Bombay given as dowry to Charles II|H7
1664|French East India Company formed|H7
1664|Shivaji sacks Surat|H4
1665|Treaty of Purandar|H4
1669|Jat revolt under Gokula|H4
1671|Battle of Saraighat|H5
1674|Coronation of Shivaji|H4
1675|Execution of Guru Tegh Bahadur|H6
1679|Aurangzeb reimposes jizya|H4
1686|Mughals annex Bijapur|H4
1687|Mughals annex Golconda|H4
1689|Execution of Sambhaji|H4
1690|Job Charnock settles at Sutanuti|H7
1699|Foundation of the Khalsa|H6
1707|Death of Aurangzeb|H4
1713|Balaji Vishwanath becomes Peshwa|H4
1716|Execution of Banda Bahadur|H6
1717|Farrukhsiyar’s farman to the East India Company|H7
1719|Mughal grant of chauth & sardeshmukhi to Marathas|H4
1724|Nizam-ul-Mulk founds Hyderabad state (Shakar Kheda)|H7
1728|Battle of Palkhed|H4
1739|Nadir Shah’s invasion; Battle of Karnal|H4
1741|Battle of Colachel|H7
1746|Battle of St Thome (Adyar)|H7
1751|Clive captures Arcot|H7
1757|Battle of Plassey|H7
1760|Battle of Wandiwash|H7
1761|Third Battle of Panipat|H4
1764|Battle of Buxar|H7
1765|Treaty of Allahabad; Diwani to the Company|H7
1767|First Anglo-Mysore War begins|H7
1770|Great Bengal famine|H8
1772|Warren Hastings ends dual government|H7
1773|Regulating Act|H7
1775|First Anglo-Maratha War begins|H7
1780|Hicky’s Bengal Gazette|H8
1781|Calcutta Madrasa founded|H8
1782|Treaty of Salbai|H7
1784|Pitt’s India Act; Asiatic Society of Bengal|H7
1791|Benares Sanskrit College founded|H8
1792|Treaty of Seringapatam|H7
1793|Permanent Settlement; Cornwallis Code|H8
1798|Subsidiary Alliance with Hyderabad|H7
1799|Death of Tipu Sultan; Ranjit Singh takes Lahore|H7
1800|Fort William College founded|H8
1802|Treaty of Bassein|H7
1806|Vellore mutiny|H7
1809|Treaty of Amritsar (Ranjit Singh)|H7
1813|Charter Act ends the Company’s monopoly|H7
1817|Hindu College, Calcutta founded|H8
1818|End of the Peshwaship|H7
1820|Ryotwari system in Madras|H8
1822|Mahalwari system (Holt Mackenzie)|H8
1828|Brahmo Sabha founded|H8
1829|Abolition of sati|H8
1831|Kol uprising|H8
1833|Charter Act — Governor-General of India|H7
1835|Macaulay’s Minute; English Education Act|H8
1837|Prinsep deciphers Brahmi|H1
1843|Annexation of Sindh|H7
1848|Doctrine of Lapse applied to Satara|H7
1849|Annexation of Punjab|H7
1853|First railway, Bombay–Thane|H8
1854|Wood’s Despatch|H8
1855|Santhal Hul|H8
1856|Annexation of Awadh; Widow Remarriage Act|H7
1857|Revolt of 1857; universities at Calcutta, Bombay, Madras|H7
1858|Government of India Act; Queen’s Proclamation|H7
1859|Indigo revolt|H8
1861|Indian Councils Act; ASI founded|H7
1866|Orissa famine; East India Association|H8
1867|Prarthana Samaj founded|H8
1873|Satyashodhak Samaj; Pabna agrarian league|H8
1875|Arya Samaj founded; Deccan riots; MAO College|H8
1876|Indian Association founded|H9
1877|Delhi Durbar proclaims Victoria Empress of India|H7
1878|Vernacular Press Act|H8
1881|First Factory Act|H8
1882|Ripon’s resolution on local self-government; Hunter Commission|H7
1883|Ilbert Bill controversy|H9
1885|Foundation of the Indian National Congress|H9
1891|Age of Consent Act|H8
1892|Indian Councils Act 1892|H7
1893|Vivekananda at the Chicago Parliament of Religions|H8
1897|Ramakrishna Mission founded; Rand murdered|H8
1899|Birsa Munda’s Ulgulan|H8
1901|Naoroji’s Poverty and Un-British Rule in India|H8
1904|Indian Universities Act|H8
1905|Partition of Bengal; Swadeshi movement|H9
1906|Muslim League founded|H9
1907|Surat split; TISCO founded|H9
1908|Muzaffarpur bomb case|H9
1909|Morley–Minto reforms|H7
1911|Delhi Durbar annuls the partition; capital to Delhi|H9
1913|Ghadar Party founded; Tagore wins the Nobel Prize|H9
1914|Komagata Maru incident|H9
1915|Gandhi returns to India; Hindu Mahasabha founded|H9
1916|Lucknow Pact; Home Rule Leagues|H9
1917|Champaran satyagraha; Montagu Declaration|H9
1918|Kheda satyagraha; Ahmedabad mill strike|H9
1919|Rowlatt Act; Jallianwala Bagh; GoI Act 1919|H9
1920|Non-Cooperation Movement; AITUC founded|H9
1921|Moplah rebellion|H8
1922|Chauri Chaura|H9
1923|Swaraj Party formed|H9
1924|Vaikom satyagraha begins|H8
1925|Kakori train action; RSS founded|H9
1927|Simon Commission appointed; Mahad satyagraha|H9
1928|Bardoli satyagraha; Nehru Report; HSRA|H9
1929|Lahore Congress — Purna Swaraj; Assembly bomb|H9
1930|Dandi March; First Round Table Conference|H9
1931|Gandhi–Irwin Pact; Bhagat Singh hanged; Karachi session|H9
1932|Communal Award; Poona Pact|H9
1934|Congress Socialist Party formed|H9
1935|Government of India Act 1935; RBI starts|H7
1936|All India Kisan Sabha formed|H8
1937|Provincial elections; Congress ministries|H9
1939|Congress ministries resign; Forward Bloc|H9
1940|Lahore Resolution; August Offer|H9
1942|Cripps Mission; Quit India|H9
1943|Bengal famine; Provisional Government of Free India|H9
1944|Bombay Plan; Imphal–Kohima campaign|H9
1945|Simla Conference; INA trials|H9
1946|RIN mutiny; Cabinet Mission; Direct Action Day|H9
1947|Independence and Partition|H9
1948|Assassination of Gandhi; Operation Polo|H9
1949|Constitution adopted (26 Nov)|H9
1950|Constitution in force; Planning Commission|H9
1951|First Five-Year Plan begins|H9
1953|Andhra state formed|H9
1954|Panchsheel agreement|H9
1955|Bandung conference; Avadi session|H9
1956|States Reorganisation Act; Ambedkar embraces Buddhism|H9
1961|Belgrade NAM summit; liberation of Goa|H9
1962|India–China war|H9
1964|Kothari Commission set up|H9
1966|Tashkent Declaration|H9
1968|National Policy on Education|H9
1969|Bank nationalisation|H9
1971|India–Pakistan war; Bangladesh created|H9
1972|Simla Agreement|H9
1973|Chipko movement|H9
1974|Pokhran nuclear test|H9
1975|Emergency declared|H9
1977|Janata government formed|H9
1986|National Policy on Education (second)|H9
1991|Economic liberalisation|H9
2020|National Education Policy|H9
-484|Birth of Herodotus (c.)|H10
~-431|Thucydides begins his history of the Peloponnesian War|H10
1377|Ibn Khaldun completes the Muqaddimah|H10
1440|Lorenzo Valla exposes the Donation of Constantine|H10
1513|Machiavelli writes The Prince|H10
1566|Bodin’s Methodus|H10
1681|Mabillon’s De re diplomatica|H10
1725|Vico’s New Science|H10
1776|First volume of Gibbon’s Decline and Fall|H10
1824|Ranke’s first major history|H10
1848|Communist Manifesto|H10
1918|Spengler’s The Decline of the West (vol. 1)|H10
1929|Annales journal founded|H10
1934|Toynbee’s A Study of History begins|H10
1946|Collingwood’s The Idea of History|H10
1949|Braudel’s The Mediterranean|H10
1961|E.H. Carr’s What is History?|H10
1973|Hayden White’s Metahistory|H10
1978|Edward Said’s Orientalism|H10
1979|Lyotard’s The Postmodern Condition|H10
1982|First volume of Subaltern Studies|H10
`;
  RAW.split('\n').forEach(function (line) {
    line = line.trim(); if (!line) return;
    var p = line.split('|');
    var approx = p[0].charAt(0) === '~';
    var y = parseInt(approx ? p[0].slice(1) : p[0], 10);
    J.events.push({ y: y, approx: approx, t: p[1], u: p[2] });
  });
  J.events.sort(function (a, b) { return a.y - b.y; });
})(window.JRF);
