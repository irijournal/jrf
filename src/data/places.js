/* Map places. Format: Name|lat|lon|layer|note|state  (state = present-day state/country; blank if unsure)
   Coordinates are approximate (±0.2°) — good enough for exam-level map memory. */
(function (J) {
  J.layers = [
    { id: 'pre', name: 'Prehistoric, Neolithic & Chalcolithic', unit: 'H1' },
    { id: 'hrp', name: 'Harappan sites', unit: 'H1' },
    { id: 'mjp', name: 'Mahajanapada capitals', unit: 'H1' },
    { id: 'ash', name: 'Ashokan inscriptions', unit: 'H2' },
    { id: 'bud', name: 'Buddhist, Jain & cave sites', unit: 'H2' },
    { id: 'port', name: 'Ports (ancient → colonial)', unit: 'H2' },
    { id: 'emed', name: 'Early medieval capitals & temples', unit: 'H3' },
    { id: 'med', name: 'Sultanate, Mughal, Deccan & Maratha', unit: 'H4' },
    { id: 'bat', name: 'Battles', unit: 'H4' },
    { id: 'eur', name: 'European settlements', unit: 'H7' },
    { id: 'r57', name: 'Revolt of 1857', unit: 'H7' },
    { id: 'move', name: 'Peasant & tribal movements', unit: 'H8' },
    { id: 'nat', name: 'National movement', unit: 'H9' }
  ];
  var RAW = `
Bhimbetka|22.94|77.61|pre|Rock shelters & paintings (Wakankar 1957)|Madhya Pradesh
Attirampakkam|13.23|79.88|pre|Acheulian tools c. 1.5 million years|Tamil Nadu
Pallavaram|12.97|80.15|pre|First Palaeolithic tool found by Robert Bruce Foote (1863)|Tamil Nadu
Hathnora|22.87|77.80|pre|Narmada Man skull (Sonakia 1982)|Madhya Pradesh
Isampur|16.50|76.48|pre|Acheulian quarry-workshop|Karnataka
Bagor|25.37|74.38|pre|Largest Mesolithic site; early domestication|Rajasthan
Adamgarh|22.75|77.73|pre|Mesolithic; early domestication|Madhya Pradesh
Sarai Nahar Rai|25.92|81.96|pre|Mesolithic burials|Uttar Pradesh
Mehrgarh|29.39|67.61|pre|Earliest farming in South Asia (c. 7000 BCE)|Pakistan
Burzahom|34.17|74.88|pre|Neolithic pit-dwellings; dog burials|Jammu & Kashmir
Gufkral|33.93|75.07|pre|Neolithic “cave of the potter”|Jammu & Kashmir
Chirand|25.68|84.85|pre|Neolithic bone tools|Bihar
Koldihwa|24.92|82.02|pre|Early rice (dates debated)|Uttar Pradesh
Mahagara|24.95|82.06|pre|Neolithic cattle pen|Uttar Pradesh
Lahuradewa|26.77|83.03|pre|Very early rice|Uttar Pradesh
Brahmagiri|14.82|76.83|pre|Neolithic & megalithic site; Ashokan edict|Karnataka
Maski|15.96|76.65|pre|Neolithic; edict with name Ashoka|Karnataka
Sanganakallu|15.18|76.97|pre|Neolithic site near Bellary|Karnataka
Daojali Hading|25.45|93.05|pre|North-eastern Neolithic|Assam
Ahar|24.59|73.72|pre|Ahar–Banas Chalcolithic (Tambavati)|Rajasthan
Gilund|25.04|74.08|pre|Ahar–Banas Chalcolithic|Rajasthan
Kayatha|23.23|76.02|pre|Kayatha Chalcolithic culture|Madhya Pradesh
Navdatoli|22.18|75.59|pre|Malwa Chalcolithic|Madhya Pradesh
Inamgaon|18.62|74.53|pre|Jorwe Chalcolithic; urn burials|Maharashtra
Nevasa|19.55|74.93|pre|Middle Palaeolithic & Jorwe|Maharashtra
Adichanallur|8.63|77.87|pre|Megalithic urn burials|Tamil Nadu
Junapani|21.18|79.01|pre|Megalithic iron tools|Maharashtra
Harappa|30.63|72.86|hrp|On Ravi; Daya Ram Sahni 1921|Pakistan
Mohenjo-daro|27.33|68.14|hrp|On Indus; Great Bath; R.D. Banerji 1922|Pakistan
Dholavira|23.89|70.21|hrp|Three-part city; signboard; UNESCO 2021|Gujarat
Lothal|22.52|72.25|hrp|Dockyard on Bhogava; S.R. Rao|Gujarat
Kalibangan|29.47|74.13|hrp|Ploughed field; fire altars; on Ghaggar|Rajasthan
Rakhigarhi|29.29|76.11|hrp|Largest Harappan site in India|Haryana
Banawali|29.60|75.39|hrp|Terracotta plough model|Haryana
Bhirrana|29.55|75.55|hrp|Very early dates|Haryana
Ropar|30.97|76.53|hrp|On Sutlej; dog buried with man|Punjab
Chanhudaro|26.17|68.32|hrp|Bead-making; no citadel|Pakistan
Kot Diji|27.35|68.71|hrp|Early Harappan fortified site|Pakistan
Sutkagen-dor|25.50|61.95|hrp|Westernmost; Makran coast|Pakistan
Surkotada|23.62|70.84|hrp|Claimed horse remains|Gujarat
Rangpur|22.40|71.92|hrp|Late Harappan; on Bhadar|Gujarat
Alamgirpur|28.95|77.47|hrp|Easternmost; on Hindon|Uttar Pradesh
Manda|32.87|74.73|hrp|Northernmost; on Chenab|Jammu & Kashmir
Daimabad|19.52|74.70|hrp|Southernmost; bronze hoard|Maharashtra
Shortugai|37.33|69.52|hrp|Trading outpost on Amu Darya|Afghanistan
Champa|25.25|86.95|mjp|Capital of Anga|Bihar
Rajagriha|25.03|85.42|mjp|Capital of Magadha|Bihar
Varanasi|25.32|83.00|mjp|Capital of Kashi|Uttar Pradesh
Shravasti|27.51|82.05|mjp|Capital of Kosala|Uttar Pradesh
Vaishali|25.99|85.13|mjp|Capital of the Vajji confederacy|Bihar
Kushinagar|26.74|83.89|mjp|Malla capital; Buddha’s Mahaparinirvana|Uttar Pradesh
Kaushambi|25.34|81.39|mjp|Capital of Vatsa|Uttar Pradesh
Indraprastha|28.61|77.24|mjp|Capital of Kuru|Delhi
Ahichchhatra|28.37|79.13|mjp|Capital of (north) Panchala|Uttar Pradesh
Viratanagara (Bairat)|27.45|76.20|mjp|Capital of Matsya; Ashokan edict|Rajasthan
Mathura|27.49|77.67|mjp|Capital of Shurasena; Kushana art|Uttar Pradesh
Potana (Bodhan)|18.67|77.90|mjp|Capital of Ashmaka|Telangana
Ujjayini|23.18|75.78|mjp|Capital of Avanti|Madhya Pradesh
Taxila|33.75|72.82|mjp|Capital of Gandhara; centre of learning|Pakistan
Kapilavastu|27.54|83.06|mjp|Shakya republic; Buddha’s home|Nepal
Kalsi|30.53|77.85|ash|Major Rock Edicts|Uttarakhand
Girnar (Junagadh)|21.52|70.46|ash|Major Rock Edicts; Rudradaman inscription|Gujarat
Shahbazgarhi|34.22|72.17|ash|Major Rock Edicts in Kharoshthi|Pakistan
Mansehra|34.33|73.20|ash|Major Rock Edicts in Kharoshthi|Pakistan
Dhauli|20.19|85.84|ash|Separate Kalinga Edicts|Odisha
Jaugada|19.52|84.83|ash|Separate Kalinga Edicts|Odisha
Sopara|19.42|72.82|ash|Major Rock Edict; ancient port|Maharashtra
Erragudi|15.16|77.63|ash|Major & Minor Rock Edicts|Andhra Pradesh
Kandahar|31.61|65.71|ash|Greek–Aramaic edict|Afghanistan
Sannati|16.80|76.94|ash|Major Rock Edicts|Karnataka
Rupnath|23.65|80.05|ash|Minor Rock Edict|Madhya Pradesh
Sasaram|24.95|84.03|ash|Minor Rock Edict; Sher Shah’s tomb|Bihar
Rummindei (Lumbini)|27.47|83.28|ash|Pillar: Buddha’s birthplace; bali exempted|Nepal
Topra|30.12|77.15|ash|Original site of the Delhi-Topra pillar (PE VII)|Haryana
Rampurva|27.27|84.50|ash|Bull capital pillar|Bihar
Lauriya-Nandangarh|26.99|84.40|ash|Single-lion pillar|Bihar
Nigali Sagar|27.59|83.04|ash|Pillar: Konakamana stupa enlarged|Nepal
Bodh Gaya|24.70|84.99|bud|Buddha’s enlightenment|Bihar
Sarnath|25.38|83.02|bud|First sermon; lion capital|Uttar Pradesh
Nalanda|25.14|85.44|bud|Mahavihara (Kumaragupta I)|Bihar
Vikramashila|25.32|87.28|bud|Mahavihara (Dharmapala)|Bihar
Sanchi|23.48|77.74|bud|Stupa with Satavahana-era gateways|Madhya Pradesh
Bharhut|24.47|80.86|bud|Shunga stupa railing|Madhya Pradesh
Amaravati|16.57|80.36|bud|Stupa; Amaravati school|Andhra Pradesh
Nagarjunakonda|16.52|79.24|bud|Ikshvaku Buddhist centre|Andhra Pradesh
Ajanta|20.55|75.70|bud|Painted caves (Vakataka)|Maharashtra
Ellora|20.03|75.18|bud|Buddhist, Hindu & Jain caves; Kailasa|Maharashtra
Karle|18.78|73.47|bud|Largest chaitya|Maharashtra
Kanheri|19.21|72.91|bud|Buddhist caves|Maharashtra
Udayagiri–Khandagiri|20.26|85.78|bud|Jain caves; Hathigumpha|Odisha
Shravanabelagola|12.86|76.49|bud|Gommateshvara; Chandragupta Maurya’s sallekhana|Karnataka
Pavapuri|25.09|85.54|bud|Mahavira’s death|Bihar
Valabhi|21.89|71.88|bud|Maitraka capital; Jain council|Gujarat
Paharpur (Somapura)|25.03|88.98|bud|Somapura Mahavihara (Dharmapala)|Bangladesh
Barabar caves|25.00|85.06|bud|Ajivika caves (Lomas Rishi)|Bihar
Bharuch (Barygaza)|21.70|72.98|port|Barygaza of the Periplus|Gujarat
Muziris (Pattanam)|10.16|76.21|port|Chera port; Roman trade|Kerala
Arikamedu|11.90|79.82|port|Indo-Roman trade (Wheeler 1945)|Puducherry
Puhar (Kaveripattinam)|11.15|79.85|port|Chola port|Tamil Nadu
Korkai|8.63|78.07|port|Pandya port (pearls)|Tamil Nadu
Tamralipti (Tamluk)|22.30|87.92|port|Eastern port; Tamluk Jatiya Sarkar (1942)|West Bengal
Calicut|11.25|75.78|port|Vasco da Gama 1498; Zamorin|Kerala
Cambay (Khambhat)|22.31|72.62|port|Gujarat trade port|Gujarat
Surat|21.17|72.83|port|Mughal port; English factory 1613|Gujarat
Masulipatnam|16.17|81.13|port|Golconda port; Dutch & English factories|Andhra Pradesh
Hugli|22.90|88.39|port|Portuguese settlement (taken 1632)|West Bengal
Nagapattinam|10.77|79.84|port|Chola port; Dutch HQ later|Tamil Nadu
Goa|15.50|73.83|eur|Taken by Albuquerque 1510|Goa
Cochin|9.97|76.24|eur|Portuguese then Dutch (1663)|Kerala
Diu|20.71|70.98|eur|Portuguese (1535)|Daman & Diu
Pulicat|13.42|80.32|eur|Dutch HQ on Coromandel|Tamil Nadu
Chinsura|22.90|88.39|eur|Dutch settlement in Bengal|West Bengal
Tranquebar|11.03|79.85|eur|Danish settlement|Tamil Nadu
Serampore|22.75|88.34|eur|Danish; Serampore mission|West Bengal
Pondicherry|11.93|79.83|eur|French HQ (1674)|Puducherry
Chandernagore|22.87|88.37|eur|French settlement in Bengal|West Bengal
Mahe|11.70|75.54|eur|French settlement|Puducherry
Madras (Fort St George)|13.08|80.27|eur|English, 1639|Tamil Nadu
Bombay|18.94|72.84|eur|English from 1668|Maharashtra
Calcutta|22.57|88.36|eur|Job Charnock 1690; capital till 1911|West Bengal
Kanauj|27.05|79.92|emed|Harsha; Tripartite struggle|Uttar Pradesh
Thanesar|29.97|76.83|emed|Pushyabhuti capital|Haryana
Badami (Vatapi)|15.92|75.68|emed|Chalukya capital|Karnataka
Aihole|16.02|75.88|emed|Inscription of Pulakeshin II; early temples|Karnataka
Pattadakal|15.95|75.82|emed|Virupaksha temple; UNESCO|Karnataka
Kanchipuram|12.83|79.70|emed|Pallava capital; ghatika|Tamil Nadu
Mahabalipuram|12.62|80.19|emed|Rathas; Shore temple|Tamil Nadu
Thanjavur|10.79|79.14|emed|Brihadishvara temple|Tamil Nadu
Gangaikondacholapuram|11.21|79.45|emed|Rajendra I’s capital|Tamil Nadu
Madurai|9.93|78.12|emed|Pandya capital; Sangam|Tamil Nadu
Manyakheta|17.19|77.16|emed|Rashtrakuta capital|Karnataka
Kalyani|17.87|76.95|emed|Western Chalukya capital|Karnataka
Vengi|16.81|81.10|emed|Eastern Chalukya capital|Andhra Pradesh
Devagiri (Daulatabad)|19.94|75.21|emed|Yadava capital; MBT’s capital 1327|Maharashtra
Warangal|17.97|79.60|emed|Kakatiya capital|Telangana
Halebid (Dvarasamudra)|13.21|75.99|emed|Hoysala capital|Karnataka
Belur|13.16|75.86|emed|Chennakeshava temple|Karnataka
Talakad|12.18|77.03|emed|Western Ganga capital|Karnataka
Banavasi|14.53|75.02|emed|Kadamba capital|Karnataka
Dhar|22.60|75.30|emed|Paramara capital (Dhara)|Madhya Pradesh
Patan (Anahilapataka)|23.85|72.12|emed|Chaulukya capital; Rani-ki-Vav|Gujarat
Modhera|23.58|72.13|emed|Sun temple (Bhima I)|Gujarat
Somnath|20.89|70.40|emed|Sacked by Mahmud 1025|Gujarat
Tripuri|23.17|79.93|emed|Kalachuri capital|Madhya Pradesh
Khajuraho|24.85|79.92|emed|Chandela temples|Madhya Pradesh
Ajmer|26.45|74.64|emed|Chahamana capital; Muinuddin Chishti|Rajasthan
Gaur|24.87|88.13|emed|Capital of Bengal (Pala/Sena/Sultanate)|West Bengal
Nadia (Navadwip)|23.41|88.37|emed|Sena seat; Chaitanya; Navya Nyaya|West Bengal
Bhubaneswar|20.27|85.83|emed|Lingaraja; Mukteshvara|Odisha
Puri|19.81|85.83|emed|Jagannath temple|Odisha
Konark|19.89|86.09|emed|Sun temple (Narasimhadeva I)|Odisha
Guwahati (Pragjyotishpura)|26.14|91.74|emed|Varman capital; Kamakhya|Assam
Delhi|28.65|77.23|med|Sultanate & Mughal capital|Delhi
Agra|27.18|78.01|med|Founded by Sikandar Lodi (1504)|Uttar Pradesh
Fatehpur Sikri|27.09|77.66|med|Akbar’s capital (1571–85)|Uttar Pradesh
Lahore|31.55|74.34|med|Ghaznavid, Mughal & Sikh capital|Pakistan
Jaunpur|25.75|82.68|med|Sharqi capital; “Shiraz of India”|Uttar Pradesh
Mandu|22.36|75.39|med|Malwa Sultanate|Madhya Pradesh
Ahmedabad|23.03|72.58|med|Founded by Ahmad Shah (1411)|Gujarat
Chittor|24.88|74.62|med|Mewar fort; Vijay Stambh|Rajasthan
Ranthambhor|26.02|76.46|med|Taken by Alauddin (1301)|Rajasthan
Kalinjar|25.00|80.49|med|Sher Shah died here (1545)|Uttar Pradesh
Hampi|15.33|76.46|med|Vijayanagara capital|Karnataka
Gulbarga|17.33|76.83|med|First Bahmani capital|Karnataka
Bidar|17.91|77.52|med|Later Bahmani capital; Gawan’s madrasa|Karnataka
Bijapur|16.83|75.71|med|Adil Shahi capital; Gol Gumbaz|Karnataka
Golconda|17.38|78.40|med|Qutb Shahi capital; diamonds|Telangana
Hyderabad|17.38|78.48|med|Founded 1591; Charminar|Telangana
Ahmadnagar|19.09|74.74|med|Nizam Shahi capital; Chand Bibi|Maharashtra
Burhanpur|21.31|76.23|med|Gateway to the Deccan|Madhya Pradesh
Asirgarh|21.47|76.29|med|Akbar’s last conquest (1601)|Madhya Pradesh
Raigad|18.23|73.44|med|Shivaji’s coronation (1674)|Maharashtra
Shivneri|19.20|73.86|med|Shivaji’s birthplace|Maharashtra
Pratapgad|17.93|73.58|med|Afzal Khan killed (1659)|Maharashtra
Sindhudurg|16.04|73.46|med|Shivaji’s sea fort|Maharashtra
Gingee|12.25|79.42|med|Rajaram’s refuge|Tamil Nadu
Pune|18.52|73.86|med|Peshwa capital|Maharashtra
Srirangapatna|12.42|76.69|med|Tipu’s capital|Karnataka
Murshidabad|24.18|88.27|med|Bengal Nawabs’ capital|West Bengal
Lucknow|26.85|80.95|med|Awadh capital from 1775|Uttar Pradesh
Amritsar|31.63|74.87|med|Harmandir Sahib; Jallianwala Bagh|Punjab
Anandpur Sahib|31.24|76.50|med|Khalsa founded (1699)|Punjab
Nanded|19.15|77.30|med|Guru Gobind Singh died (1708)|Maharashtra
Multan|30.20|71.47|med|Bahauddin Zakariya|Pakistan
Pakpattan (Ajodhan)|30.34|73.39|med|Baba Farid|Pakistan
Panipat|29.39|76.97|bat|Battles of 1526, 1556, 1761|Haryana
Tarain (Taraori)|29.80|76.92|bat|Battles of 1191 & 1192|Haryana
Khanwa|27.03|77.53|bat|Babur vs Rana Sanga (1527)|Rajasthan
Chanderi|24.72|78.13|bat|Babur vs Medini Rai (1528)|Madhya Pradesh
Chausa|25.53|83.90|bat|Sher Khan defeats Humayun (1539)|Bihar
Haldighati|24.89|73.70|bat|Akbar’s army vs Maharana Pratap (1576)|Rajasthan
Talikota|16.48|76.31|bat|Vijayanagara defeated (1565)|Karnataka
Samugarh|27.17|78.25|bat|Aurangzeb defeats Dara (1658)|Uttar Pradesh
Saraighat|26.17|91.68|bat|Ahoms defeat Mughals (1671)|Assam
Karnal|29.69|76.99|bat|Nadir Shah defeats Muhammad Shah (1739)|Haryana
Plassey|23.80|88.25|bat|Clive vs Siraj-ud-Daula (1757)|West Bengal
Buxar|25.56|83.98|bat|EIC vs combined forces (1764)|Bihar
Wandiwash|12.50|79.62|bat|English defeat French (1760)|Tamil Nadu
Arcot|12.91|79.32|bat|Clive seizes Arcot (1751)|Tamil Nadu
Colachel|8.18|77.25|bat|Travancore defeats Dutch (1741)|Tamil Nadu
Assaye|20.25|75.89|bat|Wellesley vs Sindhia–Bhonsle (1803)|Maharashtra
Koregaon|18.65|74.06|bat|EIC vs Peshwa (1818)|Maharashtra
Sobraon|31.18|74.85|bat|First Anglo-Sikh war (1846)|Punjab
Chillianwala|32.65|73.60|bat|Second Anglo-Sikh war (1849)|Pakistan
Barrackpore|22.76|88.37|r57|Mangal Pandey (29 March 1857)|West Bengal
Meerut|28.98|77.71|r57|Outbreak on 10 May 1857|Uttar Pradesh
Kanpur|26.45|80.33|r57|Nana Saheb, Tantia Tope|Uttar Pradesh
Jhansi|25.45|78.57|r57|Rani Lakshmibai|Uttar Pradesh
Bareilly|28.37|79.43|r57|Khan Bahadur Khan|Uttar Pradesh
Jagdishpur|25.47|84.42|r57|Kunwar Singh|Bihar
Faizabad|26.78|82.13|r57|Maulvi Ahmadullah|Uttar Pradesh
Allahabad|25.44|81.85|r57|Liyaqat Ali; Queen’s Proclamation 1858|Uttar Pradesh
Gwalior|26.22|78.18|r57|Rani Lakshmibai died nearby (1858)|Madhya Pradesh
Bhognadih|24.93|87.62|move|Santhal Hul (Sidhu & Kanhu, 1855)|Jharkhand
Khunti|23.07|85.28|move|Birsa Munda’s Ulgulan (1899–1900)|Jharkhand
Rampachodavaram|17.44|81.77|move|Rampa rebellion; Alluri Sitarama Raju|Andhra Pradesh
Pabna|24.00|89.24|move|Pabna agrarian league (1873)|Bangladesh
Krishnanagar (Nadia)|23.40|88.50|move|Indigo revolt (1859–60)|West Bengal
Mangarh|23.20|74.00|move|Bhil massacre under Govind Guru (1913)|Rajasthan
Malappuram|11.07|76.07|move|Mappila (Moplah) rebellion (1921)|Kerala
Nalgonda|17.05|79.27|move|Telangana movement (1946–51)|Telangana
Dinajpur|25.62|88.63|move|Tebhaga movement (1946–47)|West Bengal
Jagdalpur|19.08|82.02|move|Bastar Bhumkal (1910)|Chhattisgarh
Gumla|23.04|84.54|move|Tana Bhagat movement|Jharkhand
Bijolia|25.16|75.33|move|Bijolia peasant movement|Rajasthan
Champaran (Motihari)|26.65|84.92|nat|Gandhi’s first satyagraha (1917)|Bihar
Kheda|22.75|72.68|nat|Kheda satyagraha (1918)|Gujarat
Sabarmati Ashram|23.06|72.58|nat|Start of the Dandi March|Gujarat
Dandi|20.89|72.80|nat|Salt law broken (6 April 1930)|Gujarat
Bardoli|21.12|73.11|nat|Bardoli satyagraha (1928)|Gujarat
Chauri Chaura|26.65|83.58|nat|Violence that ended NCM (1922)|Uttar Pradesh
Vedaranyam|10.37|79.85|nat|Rajagopalachari’s salt march|Tamil Nadu
Payyanur|12.10|75.20|nat|Kelappan’s salt satyagraha|Kerala
Peshawar|34.01|71.58|nat|Khudai Khidmatgars; Qissa Khwani (1930)|Pakistan
Chittagong|22.34|91.83|nat|Armoury raid (Surya Sen, 1930)|Bangladesh
Kakori|26.87|80.79|nat|Kakori train action (1925)|Uttar Pradesh
Ballia|25.76|84.15|nat|Parallel government (1942)|Uttar Pradesh
Satara|17.68|74.00|nat|Prati Sarkar (1943–46)|Maharashtra
Vaikom|9.75|76.39|nat|Vaikom satyagraha (1924–25)|Kerala
Mahad|18.08|73.42|nat|Ambedkar’s satyagraha (1927)|Maharashtra
Moirang|24.50|93.77|nat|INA flag hoisted (1944)|Manipur
Kohima|25.67|94.11|nat|Imphal–Kohima campaign (1944)|Nagaland
Wardha|20.74|78.60|nat|Gandhi’s Sevagram; Basic Education (1937)|Maharashtra
Belgaum|15.85|74.50|nat|Gandhi presided INC (1924); Tilak’s Home Rule League|Karnataka
Karachi|24.86|67.00|nat|INC 1931: Fundamental Rights resolution|Pakistan
Haripura|21.10|73.40|nat|INC 1938 (Bose); Nandalal Bose posters|Gujarat
`;
  RAW.split('\n').forEach(function (line) {
    line = line.trim(); if (!line) return;
    var p = line.split('|');
    J.places.push({ n: p[0], lat: +p[1], lon: +p[2], layer: p[3], note: p[4] || '', st: p[5] || '' });
  });

  /* Approximate river courses (lat, lon pairs) for orientation only. */
  J.rivers = {
    Indus: [[34.16, 77.58], [35.3, 75.6], [35.75, 74.6], [34.9, 72.9], [33.9, 72.25], [32.96, 71.55], [31.83, 70.9], [28.95, 70.37], [27.7, 68.85], [27.33, 68.2], [25.38, 68.37], [24.75, 67.9], [24.0, 67.5]],
    Jhelum: [[34.08, 74.8], [34.2, 74.35], [34.37, 73.47], [33.15, 73.64], [32.93, 73.73], [32.3, 72.35], [31.15, 72.15]],
    Chenab: [[33.3, 75.77], [32.87, 74.73], [32.55, 74.05], [31.72, 72.98], [31.15, 72.15], [29.35, 71.0], [28.95, 70.37]],
    Ravi: [[32.55, 76.13], [32.36, 75.6], [31.6, 74.3], [30.63, 72.86], [30.68, 71.75]],
    Beas: [[32.24, 77.19], [31.7, 76.93], [31.97, 75.95], [31.16, 74.95]],
    Sutlej: [[31.8, 78.75], [31.45, 77.63], [31.41, 76.43], [30.97, 76.53], [30.98, 75.85], [31.16, 74.95], [30.92, 74.6], [29.4, 71.68], [29.35, 71.0]],
    'Ghaggar-Hakra': [[30.7, 76.86], [30.2, 76.2], [29.53, 75.03], [29.47, 74.13], [29.19, 73.2], [29.19, 72.86]],
    Yamuna: [[31.01, 78.45], [30.44, 77.63], [30.13, 77.28], [28.61, 77.25], [27.49, 77.67], [27.18, 78.02], [26.78, 79.02], [25.42, 81.88]],
    Ganga: [[30.99, 78.94], [30.1, 78.3], [29.95, 78.16], [29.37, 78.13], [28.2, 78.38], [27.05, 79.92], [26.45, 80.33], [25.42, 81.88], [25.15, 82.57], [25.32, 83.01], [25.58, 83.57], [25.6, 85.1], [25.38, 86.47], [25.25, 87.0], [25.25, 87.65], [24.81, 87.92], [24.37, 88.6], [23.8, 89.75], [23.22, 90.65], [22.5, 90.7]],
    Hooghly: [[24.47, 88.07], [24.18, 88.27], [23.41, 88.37], [22.57, 88.35], [22.19, 88.19], [21.65, 88.05]],
    Son: [[22.67, 81.75], [23.3, 81.4], [24.4, 81.9], [24.9, 84.18], [25.65, 84.88]],
    Gandak: [[27.45, 83.92], [26.47, 84.44], [25.69, 85.21]],
    Ghaghra: [[27.57, 81.6], [26.8, 82.2], [26.27, 83.5], [25.75, 84.7]],
    Chambal: [[22.55, 75.76], [24.7, 75.55], [25.18, 75.83], [26.7, 77.9], [26.48, 79.3]],
    Betwa: [[23.0, 77.4], [23.52, 77.81], [25.35, 78.64], [25.95, 80.15]],
    Narmada: [[22.67, 81.75], [22.6, 80.37], [23.13, 79.88], [22.75, 77.72], [22.24, 76.15], [22.18, 75.59], [21.83, 73.75], [21.7, 72.98], [21.65, 72.6]],
    Tapti: [[21.77, 78.25], [21.31, 76.23], [21.05, 75.78], [21.17, 72.83], [21.1, 72.65]],
    Mahi: [[22.65, 74.9], [23.55, 74.43], [22.65, 73.3], [22.25, 72.75]],
    Sabarmati: [[24.5, 73.5], [23.03, 72.58], [22.3, 72.5]],
    Godavari: [[19.93, 73.53], [19.48, 75.38], [19.15, 77.3], [18.8, 79.4], [17.67, 80.89], [17.0, 81.78], [16.6, 82.3]],
    Krishna: [[17.92, 73.66], [16.85, 74.57], [16.33, 75.88], [16.08, 78.87], [16.57, 79.31], [16.57, 80.36], [16.5, 80.62], [15.75, 80.95]],
    Tungabhadra: [[13.93, 75.57], [15.33, 76.46], [15.83, 78.04], [15.9, 78.2]],
    Kaveri: [[12.38, 75.49], [12.46, 75.96], [12.42, 76.69], [12.12, 77.78], [11.8, 77.8], [11.35, 77.72], [10.85, 78.69], [10.95, 79.13], [11.14, 79.85]],
    Mahanadi: [[20.3, 81.88], [21.2, 82.3], [21.47, 83.97], [20.47, 85.88], [20.27, 86.67]],
    Brahmaputra: [[29.3, 85.0], [29.3, 88.9], [29.3, 91.1], [29.45, 94.35], [28.3, 95.4], [27.48, 94.91], [26.76, 94.2], [26.62, 92.8], [26.18, 91.74], [26.02, 89.98], [25.15, 89.7], [23.8, 89.75]],
    Damodar: [[23.8, 85.1], [23.8, 86.43], [23.5, 87.3], [23.15, 87.85], [22.3, 88.1]]
  };
})(window.JRF);
