/* Dynasties & rulers. Format per block:
@id|Name|Region|Era|Unit|Capital|Span|Mnemonic|
   Ruler|Reign|Key facts            (a leading ~ marks a ruler skipped in auto-questions: disputed/obscure)
   Order of rulers = order of succession (used for "who came next" and chronology questions). */
(function (J) {
  var RAW = `
@haryanka|Haryanka (Magadha)|East|Ancient|H2|Rajagriha → Pataliputra|c. 544–413 BCE|“Bimbi-Ajat-Uday” — father, son, grandson|
Bimbisara|c. 544–492 BCE|Annexed Anga; marriage alliances with Kosala, Licchavis, Madra; physician Jivaka
Ajatashatru|c. 492–460 BCE|Defeated Vajjis with mahashilakantaka & rathamusala; 1st Buddhist council
Udayin|c. 460–444 BCE|Founded Pataliputra at Ganga–Son confluence
Nagadasaka|c. 437–413 BCE|Last Haryanka; overthrown by Shishunaga
@shishunaga|Shishunaga (Magadha)|East|Ancient|H2|Pataliputra (briefly Vaishali)|c. 413–345 BCE||1
Shishunaga|c. 413–395 BCE|Destroyed the Pradyota dynasty of Avanti
Kalashoka|c. 395–367 BCE|Also Kakavarna; 2nd Buddhist council at Vaishali
@nanda|Nanda (Magadha)|East|Ancient|H2|Pataliputra|c. 345–321 BCE||1
Mahapadma Nanda|c. 345–329 BCE|“Ekarat”, “Sarvakshatrantaka”; conquered Kalinga
Dhana Nanda|c. 329–321 BCE|“Agrammes” of Greeks; overthrown by Chandragupta Maurya
@maurya|Mauryas|North|Ancient|H2|Pataliputra|c. 321–185 BCE|“Chandra Bindu Ashok” — moon, dot, no sorrow|1
Chandragupta Maurya|c. 321–297 BCE|Overthrew Nandas with Kautilya; defeated Seleucus (305 BCE); Megasthenes came
Bindusara|c. 297–273 BCE|“Amitraghata”; envoy Deimachus; Ajivika leanings
Ashoka|c. 268–232 BCE|Kalinga war (c. 261 BCE); Dhamma; 3rd Buddhist council
Dasharatha|c. 232–224 BCE|Gifted Nagarjuni caves to Ajivikas
Samprati|c. 224–215 BCE|Jain patron (in Jain tradition)
~Shalishuka|c. 215–202 BCE|Later Maurya
~Devavarman|c. 202–195 BCE|Later Maurya
~Shatadhanvan|c. 195–187 BCE|Later Maurya
Brihadratha|c. 187–185 BCE|Last Maurya; killed by general Pushyamitra Shunga
@shunga|Shungas|North|Ancient|H2|Pataliputra / Vidisha|c. 185–73 BCE||
Pushyamitra Shunga|c. 185–149 BCE|Brahmin general; two ashvamedhas; Patanjali tradition
Agnimitra|c. 149–141 BCE|Hero of Kalidasa’s Malavikagnimitram
~Vasujyeshtha|c. 141–131 BCE|Shunga king
Vasumitra|c. 131–124 BCE|Defeated Yavanas on the Sindhu (tradition)
Bhagabhadra|late 2nd c. BCE|Heliodorus pillar at Besnagar erected in his reign
Devabhuti|c. 83–73 BCE|Last Shunga; killed by Vasudeva Kanva
@kanva|Kanvas|North|Ancient|H2|Pataliputra|c. 73–28 BCE||1
Vasudeva Kanva|c. 73–64 BCE|Founder; killed Devabhuti
Bhumimitra|c. 64–50 BCE|Kanva king
Narayana|c. 50–38 BCE|Kanva king
Susharman|c. 38–28 BCE|Last Kanva; ended by the Satavahanas
@satavahana|Satavahanas|Deccan|Ancient|H2|Pratishthana (Paithan); later Amaravati|c. 1st c. BCE–3rd c. CE|“Simuka Starts, Gautami’s son Shines, Yajna Sails”|
Simuka|c. late 1st c. BCE|Founder
Satakarni I|1st c. BCE|Naneghat inscription of queen Naganika; ashvamedha
Hala|1st c. CE|Compiled Gathasattasai (Prakrit)
Gautamiputra Satakarni|c. 106–130 CE|Defeated Nahapana; Nasik inscription of Gautami Balashri
Vasishthiputra Pulumavi|c. 130–158 CE|Expanded into Andhra; Amaravati
Yajna Sri Satakarni|c. 165–194 CE|Last great king; ship-motif coins
@indogreek|Indo-Greeks|North-West|Ancient|H2|Sakala (Sialkot), Taxila|c. 190 BCE–10 CE||
Demetrius I|c. 200–180 BCE|Began Indo-Greek conquests
Eucratides I|c. 171–145 BCE|Rival dynasty; large silver coins
Menander I|c. 165/155–130 BCE|Milinda of Milindapanho; capital Sakala
Antialcidas|c. 115–95 BCE|Sent Heliodorus to Shunga Bhagabhadra
Hermaeus|c. 90–70 BCE|Among the last Indo-Greek kings
@shaka|Shakas & Western Kshatrapas|West|Ancient|H2|Taxila, Mathura, Ujjain, Minnagara|c. 1st c. BCE–c. 395 CE||
Maues|c. 85–60 BCE|“Moga”; first Shaka king in India (Taxila)
Nahapana|c. early 2nd c. CE|Kshaharata ruler; defeated by Gautamiputra Satakarni
Chashtana|c. 78–130 CE|Founder of the Kardamaka line at Ujjain
Rudradaman I|c. 130–150 CE|Junagadh inscription (Sanskrit); repaired Sudarshana lake
Rudrasimha III|c. 388–395 CE|Last Western Kshatrapa; ended by Chandragupta II
@kushana|Kushanas|North-West|Ancient|H2|Purushapura (Peshawar), Mathura|c. 30–375 CE|“K-V-V-K-H-V”|
Kujula Kadphises|c. 30–80 CE|Founder; copper coins
Vima Takto|c. 80–95 CE|“Soter Megas”
Vima Kadphises|c. 95–127 CE|First large gold coinage; Shiva devotee
Kanishka I|c. 127–150 CE (78 CE in older view)|Rabatak inscription; 4th Buddhist council; Ashvaghosha, Charaka
Huvishka|c. 150–190 CE|Many coin types
Vasudeva I|c. 190–230 CE|Last great Kushana
@gupta|Guptas|North|Ancient|H2|Pataliputra (also Ujjain, Ayodhya)|c. 319–550 CE|“Sir Ghee Chaawal Samosa, Chole Kulche Skewers”|1
Sri Gupta|c. 240–280 CE|Founder
Ghatotkacha|c. 280–319 CE|Maharaja
Chandragupta I|c. 319–335 CE|Gupta era 319–20; married Licchavi Kumaradevi
Samudragupta|c. 335–375 CE|Allahabad prashasti (Harishena); “Napoleon of India”
~Ramagupta|c. 375 CE (disputed)|Known from Devichandraguptam and copper coins
Chandragupta II|c. 375–415 CE|Vikramaditya; ended Western Kshatrapas; Fa-Hien visited
Kumaragupta I|c. 415–455 CE|Founded Nalanda (Shakraditya)
Skandagupta|c. 455–467 CE|Repelled Hunas (Bhitari pillar); Sudarshana lake repaired
~Purugupta|c. 467–473 CE|Later Gupta
Budhagupta|c. 476–495 CE|Ruled a still-large empire
Narasimhagupta Baladitya|c. 495–530 CE|Defeated Mihirakula (Hiuen Tsang)
~Kumaragupta III|c. 530–540 CE|Later Gupta
Vishnugupta|c. 540–550 CE|Last recognised Gupta ruler
@vakataka|Vakatakas|Deccan|Ancient|H2|Nandivardhana, Pravarapura; Vatsagulma (branch)|c. 250–500 CE||
Vindhyashakti|c. 250–270 CE|Founder
Pravarasena I|c. 270–330 CE|Only Vakataka “Samrat”; four ashvamedhas
Rudrasena II|c. 380–385 CE|Married Prabhavatigupta, daughter of Chandragupta II
Prabhavatigupta|c. 385–405 CE (regent)|Poona copper plates
Pravarasena II|c. 410–440 CE|Wrote Setubandha (Prakrit); founded Pravarapura
Harishena|c. 460–480 CE|Vatsagulma branch; Ajanta caves 16, 17 patronage
@pushyabhuti|Pushyabhutis (Vardhanas)|North|Ancient|H2|Thanesar → Kanauj|c. 580–647 CE||1
Prabhakaravardhana|c. 580–605 CE|First to take Maharajadhiraja
Rajyavardhana|c. 605–606 CE|Killed by Shashanka of Gauda
Harshavardhana|606–647 CE|Harsha era 606; Kanauj; Hiuen Tsang; defeated by Pulakeshin II
@badami|Chalukyas of Badami (Vatapi)|Deccan|Early Medieval|H3|Vatapi (Badami)|543–753 CE|“Please Keep My Phone” — Pulakeshin I, Kirtivarman, Mangalesha, Pulakeshin II|1
Pulakeshin I|543–566|Founder; fortified Vatapi; ashvamedha
Kirtivarman I|566–597|Expanded against Kadambas
Mangalesha|597–609|Badami cave temple (Cave 3)
Pulakeshin II|609–642|Defeated Harsha; Aihole inscription (Ravikirti); killed when Narasimhavarman I took Vatapi
Vikramaditya I|655–681|Restored Chalukya power
Vinayaditya|681–696|Chalukya king
Vijayaditya|696–733|Long peaceful reign; temples at Pattadakal
Vikramaditya II|733–744|Took Kanchi; Virupaksha temple by queen Lokamahadevi
Kirtivarman II|744–753|Last; overthrown by Dantidurga Rashtrakuta
@vengi|Eastern Chalukyas of Vengi|Deccan|Early Medieval|H3|Vengi, later Rajahmundry|c. 624–1070 CE||
Kubja Vishnuvardhana|624–641|Founder; brother of Pulakeshin II
Vijayaditya III|848–892|“Gunaga”; fought Rashtrakutas
Rajaraja Narendra|1019–1061|Patron of Nannaya (Telugu Mahabharata)
Kulottunga I|1061–1070 (Vengi), then Chola emperor|Merged Vengi with the Chola empire
@rashtrakuta|Rashtrakutas|Deccan|Early Medieval|H3|Manyakheta (Malkhed)|c. 753–973 CE|“D-K-D-G-A-K” — Dantidurga, Krishna, Dhruva, Govinda, Amoghavarsha, Krishna III|
Dantidurga|c. 735–756|Founder; overthrew Badami Chalukyas
Krishna I|756–774|Kailasa temple, Ellora
Govinda II|774–780|Displaced by his brother
Dhruva|780–793|Joined the Tripartite struggle in the north
Govinda III|793–814|Raided north up to Kanauj
Amoghavarsha I|814–878|Kavirajamarga; Jain leanings; praised by Sulaiman
Krishna II|878–914|Wars with Eastern Chalukyas and Cholas
Indra III|914–929|Sacked Kanauj (c. 916)
Krishna III|939–967|Won at Takkolam (949) against Cholas
Karka II|972–973|Last; overthrown by Tailapa II
@kalyani|Chalukyas of Kalyani (Western Chalukyas)|Deccan|Early Medieval|H3|Manyakheta → Kalyani|973–c. 1189 CE||
Tailapa II|973–997|Founder; defeated Paramara Munja
Satyashraya|997–1008|Fought Rajaraja Chola
Someshvara I|1042–1068|Made Kalyani the capital
Vikramaditya VI|1076–1126|Chalukya-Vikrama era; Bilhana & Vijnaneshvara at court
Someshvara III|1126–1138|Wrote Manasollasa (encyclopaedia)
Someshvara IV|1184–c. 1189|Last; kingdom split among Yadavas, Kakatiyas, Hoysalas
@pallava|Pallavas of Kanchi|South|Early Medieval|H3|Kanchipuram|c. 575–897 CE|“Simha → Mahendra → Narasimha” (lion, king, man-lion)|
Simhavishnu|c. 575–600|Founder of the imperial line
Mahendravarman I|600–630|Mattavilasa Prahasana; rock-cut temples; converted by Appar
Narasimhavarman I|630–668|“Mamalla”, “Vatapikonda”; killed Pulakeshin II; Mahabalipuram rathas
Mahendravarman II|668–670|Short reign
Parameshvaravarman I|670–695|Fought Chalukyas
Narasimhavarman II|695–722|“Rajasimha”; Shore temple; Kailasanatha temple, Kanchi
Nandivarman II|731–796|Vaikuntha Perumal temple
Nandivarman III|c. 846–869|Won at Tellaru
Aparajita|c. 885–897|Last; defeated by Aditya I Chola
@chola|Imperial Cholas|South|Early Medieval|H3|Thanjavur → Gangaikondacholapuram|c. 850–1279 CE|“Vijay Aditya Paranta… Raja Rajendra” — V-A-P-R-R|
Vijayalaya|c. 850–871|Founder; captured Thanjavur
Aditya I|871–907|Defeated the Pallavas
Parantaka I|907–955|Uttaramerur inscriptions; lost Takkolam (949)
Rajaraja I|985–1014|Brihadishvara temple; Sri Lanka & Maldives; land survey
Rajendra I|1014–1044|Gangaikonda; naval raid on Srivijaya (1025)
Rajadhiraja I|1044–1054|Died at Koppam fighting Chalukyas
Rajendra II|1054–1063|Chola king
Virarajendra|1063–1070|Fought Kalyani Chalukyas
Kulottunga I|1070–1120|Chalukya-Chola; sent 72 merchants to China
Kulottunga III|1178–1218|Last strong Chola
Rajendra III|1246–1279|Last Chola
@pandya|Pandyas (medieval)|South|Early Medieval|H3|Madurai|c. 590–1311 CE||
Kadungon|c. 590–620|Revived the dynasty after the Kalabhras
Varaguna II|c. 862–880|Lost at Sripurambiyam
Jatavarman Sundara Pandya I|1251–1268|Peak of second Pandya empire
Maravarman Kulasekhara I|1268–1310|Marco Polo visited; succession war after him
@pala|Palas of Bengal|East|Early Medieval|H3|Gauda, Pataliputra, Monghyr|c. 750–1161 CE|“Good Dogs Don’t Make Racket” — Gopala, Dharmapala, Devapala, Mahipala, Ramapala|
Gopala|c. 750–770|Elected to end matsyanyaya (Khalimpur plate)
Dharmapala|c. 770–810|Founded Vikramashila; Somapura vihara
Devapala|c. 810–850|Grant to Nalanda for Shailendra Balaputradeva
Mahipala I|c. 988–1038|Revived Pala power; defeated by Rajendra Chola
Ramapala|c. 1077–1130|Ramacharita (Sandhyakaranandi); crushed Kaivarta revolt
Madanapala|c. 1144–1161|Last important Pala
@sena|Senas of Bengal|East|Early Medieval|H3|Gauda, Nadia, Vikramapura|c. 1070–1230 CE||
Samantasena|late 11th c.|Founder (from Karnataka)
Vijayasena|1095–1158|Built the dynasty’s power
Ballalasena|1158–1179|Danasagara; Kulinism tradition
Lakshmanasena|1179–1206|Jayadeva at court; fled Nadia before Bakhtiyar Khalji
@pratihara|Gurjara-Pratiharas|North|Early Medieval|H3|Ujjain → Kanauj|c. 730–1036 CE|“Naga-Vatsa-Naga-Mihira”|
Nagabhata I|c. 730–760|Resisted Arab invasions
Vatsaraja|c. 775–800|Entered the Tripartite struggle
Nagabhata II|c. 800–833|Captured Kanauj
Mihira Bhoja|c. 836–885|Gwalior prashasti; Adivaraha coins
Mahendrapala I|c. 885–910|Patron of Rajashekhara
Mahipala I|c. 913–944|Kanauj sacked by Indra III
Rajyapala|c. 1018|Fled Kanauj before Mahmud of Ghazni
@paramara|Paramaras of Malwa|West|Early Medieval|H3|Dhara|c. 9th c.–1305 CE||
Siyaka II|c. 949–972|Sacked Manyakheta (972)
Vakpati Munja|c. 972–994|Poet-king; killed by Tailapa II
Bhoja|c. 1010–1055|Samaranganasutradhara; Bhojshala; Bhojpur lake
Mahlakadeva|d. 1305|Last; defeated by Alauddin Khalji
@chandela|Chandelas of Jejakabhukti|North|Early Medieval|H3|Khajuraho, Mahoba, Kalinjar|c. 831–1315 CE||
Nannuka|c. 831|Founder
Yashovarman|c. 925–950|Lakshmana temple, Khajuraho
Dhanga|c. 950–999|Vishvanatha temple
Vidyadhara|c. 1003–1035|Kandariya Mahadeva temple; resisted Mahmud
Paramardi|1165–1203|Defeated by Prithviraj III; lost Kalinjar to Aibak (1202); Alha-Udal legends
@chahamana|Chahamanas of Shakambhari & Ajmer|North|Early Medieval|H3|Shakambhari → Ajmer|c. 7th c.–1192 CE||
Ajayaraja II|early 12th c.|Founded Ajmer (Ajayameru)
Vigraharaja IV|c. 1150–1164|Visaladeva; took Delhi from the Tomaras; Harikeli Nataka
Someshvara|c. 1169–1178|Father of Prithviraj
Prithviraj III|c. 1178–1192|Won Tarain I (1191), lost Tarain II (1192)
@gahadavala|Gahadavalas of Kanauj|North|Early Medieval|H3|Kanauj, Varanasi|c. 1089–1194 CE|“Chandra → Govinda → Jaya”|
Chandradeva|c. 1089–1103|Founder
Govindachandra|c. 1114–1155|Minister Lakshmidhara (Kritya-kalpataru)
Vijayachandra|c. 1155–1170|Gahadavala king
Jayachandra|c. 1170–1194|Killed at Chandawar by Muhammad Ghori
@kalachuri|Kalachuri-Chedis of Tripuri|North|Early Medieval|H3|Tripuri (near Jabalpur)|c. 875–1212 CE||
Kokalla I|c. 875|Founder
Gangeyadeva|c. 1015–1041|Took the title Vikramaditya
Lakshmikarna|c. 1041–1073|Most powerful Kalachuri; wide campaigns
@chaulukya|Chaulukyas (Solankis) of Gujarat|West|Early Medieval|H3|Anahilapataka (Patan)|c. 941–1244 CE||
Mularaja I|941–996|Founder
Bhima I|1022–1064|Somnath sacked by Mahmud (1025); Modhera Sun temple
Jayasimha Siddharaja|1092–1142|Great patron; Sahasralinga tank
Kumarapala|1143–1172|Jain patron; Hemachandra
Mularaja II|1175–1178|Kayadara victory over Ghori (regent Naiki Devi)
Bhima II|1178–1240|Long reign; Vaghela ministers rose
@maitraka|Maitrakas of Valabhi|West|Early Medieval|H3|Valabhi|c. 475–776 CE||
Bhatarka|c. 475|Founder; Gupta general
Dhruvasena II|c. 627–641|Son-in-law of Harsha
Shiladitya VII|c. 766–776|Last Maitraka
@kadamba|Kadambas of Banavasi|Deccan|Early Medieval|H3|Banavasi|c. 345–540 CE||
Mayurasharman|c. 345–365|Brahmin founder; Talagunda inscription tells his story
Kakusthavarma|c. 435–455|Matrimonial ties with Guptas
Ravivarma|c. 485–519|Last strong Kadamba
@westernganga|Western Gangas of Talakad|Deccan|Early Medieval|H3|Kolar → Talakad|c. 350–1004 CE||
Konganivarman|c. 350|Founder
Durvinita|c. 529–579|Scholar-king
Rachamalla IV|c. 975–986|Minister Chamundaraya built Gommateshvara (Shravanabelagola)
@hoysala|Hoysalas|Deccan|Early Medieval|H3|Belur → Dvarasamudra (Halebid)|c. 1026–1343 CE||
Vishnuvardhana|1108–1152|Converted by Ramanuja; Chennakeshava temple, Belur
Veera Ballala II|1173–1220|First fully independent Hoysala
Narasimha III|1263–1292|Kesava temple, Somanathapura built in his time
Veera Ballala III|1292–1343|Raided by Malik Kafur (1311); last Hoysala
@yadava|Yadavas (Seunas) of Devagiri|Deccan|Early Medieval|H3|Devagiri|c. 1187–1317 CE||
Bhillama V|1173–1192|Founded Devagiri
Singhana II|1210–1246|Greatest Yadava
Mahadeva|1261–1271|Minister Hemadri
Ramachandra|1271–1311|Submitted to Alauddin (1296); Malik Kafur 1307
@kakatiya|Kakatiyas of Warangal|Deccan|Early Medieval|H3|Hanamkonda → Warangal|c. 1163–1323 CE||
Rudradeva|1158–1195|Thousand Pillar temple
Ganapati|1199–1262|Expanded kingdom; Ramappa temple era
Rudramadevi|1262–1289|Woman ruler; praised by Marco Polo
Prataparudra|1289–1323|Defeated by Ulugh Khan (Muhammad bin Tughlaq)
@easternganga|Eastern Gangas of Odisha|East|Medieval|H4|Kalinganagara → Cuttack|1078–1434 CE||
Anantavarman Chodaganga|1078–1147|Began Jagannath temple, Puri
Narasimhadeva I|1238–1264|Konark Sun temple; defeated Bengal Sultan
Bhanudeva IV|1414–1434|Last; replaced by Kapilendra Deva
@gajapati|Suryavamshi Gajapatis|East|Medieval|H4|Cuttack|1434–1541 CE||
Kapilendra Deva|1434–1467|Founder; expanded to Andhra
Purushottama Deva|1467–1497|Kanchi-Kaveri legend
Prataparudra Deva|1497–1540|Devotee of Chaitanya; lost to Krishnadevaraya
@varman|Varmans of Kamarupa|East|Early Medieval|H3|Pragjyotishpura|c. 350–650 CE||
Pushyavarman|c. 350|Founder
Mahendravarman|c. 470–494|Performed ashvamedhas
Bhaskaravarman|c. 600–650|Ally of Harsha; host of Hiuen Tsang; Nidhanpur plate
@mamluk|Mamluk / Ilbari (Slave) dynasty|North|Medieval|H4|Lahore → Delhi|1206–1290|“All Indians Respect Balban”|1
Qutbuddin Aibak|1206–1210|“Lakh Bakhsh”; Quwwat-ul-Islam mosque; died playing chaugan
Aram Shah|1210–1211|Displaced by Iltutmish
Iltutmish|1211–1236|Chahalgani; tanka & jital; Caliph’s investiture (1229)
Ruknuddin Firuz|1236|Ruled for months; mother Shah Turkan dominated
Raziya|1236–1240|Only woman Sultan of Delhi; Yaqut; Altunia
Muizuddin Bahram Shah|1240–1242|Post of naib-i-mamlikat created
Alauddin Masud Shah|1242–1246|Deposed by nobles
Nasiruddin Mahmud|1246–1266|Balban as naib; Tabaqat-i-Nasiri dedicated
Ghiyasuddin Balban|1266–1287|Niyabat-i-Khudai; sijda & paibos; Diwan-i-Arz
Muizuddin Kaiqubad|1287–1290|Weak; Qiran-us-Sadain describes meeting with father
Kayumars|1290|Infant; displaced by Jalaluddin Khalji
@khalji|Khaljis|North|Medieval|H4|Delhi (Kilokhri, Siri)|1290–1320||1
Jalaluddin Firuz Khalji|1290–1296|Lenient; killed by Alauddin at Kara
Alauddin Khalji|1296–1316|Market control; dagh & chehra; Malik Kafur’s campaigns
Shihabuddin Umar|1316|Puppet king
Qutbuddin Mubarak Shah|1316–1320|Killed by Khusrau Khan
Khusrau Khan|1320|Nasiruddin; overthrown by Ghazi Malik
@tughlaq|Tughlaqs|North|Medieval|H4|Tughlaqabad, Delhi (Jahanpanah, Firozabad)|1320–1414||1
Ghiyasuddin Tughlaq|1320–1325|Tughlaqabad; died in pavilion collapse
Muhammad bin Tughlaq|1325–1351|Token currency; Daulatabad; Ibn Battuta
Firoz Shah Tughlaq|1351–1388|Canals; Diwan-i-Khairat; hereditary iqtas
~Ghiyasuddin Tughlaq II|1388–1389|Later Tughlaq
~Abu Bakr Shah|1389–1390|Later Tughlaq
~Nasiruddin Muhammad Shah III|1390–1394|Later Tughlaq
Nasiruddin Mahmud Shah|1394–1412|Timur’s invasion (1398)
@sayyid|Sayyids|North|Medieval|H4|Delhi|1414–1451||1
Khizr Khan|1414–1421|Timur’s deputy; title Rayat-i-Ala
Mubarak Shah|1421–1434|Founded Mubarakabad; Yahya Sirhindi’s chronicle
Muhammad Shah|1434–1445|Weak rule
Alam Shah|1445–1451|Retired to Badaun; gave Delhi to Bahlul Lodi
@lodi|Lodis|North|Medieval|H4|Delhi → Agra|1451–1526||1
Bahlul Lodi|1451–1489|First Afghan dynasty; conquered Jaunpur
Sikandar Lodi|1489–1517|Founded Agra (1504); gaz-i-Sikandari; “Gulrukhi”
Ibrahim Lodi|1517–1526|Killed at First Panipat by Babur
@sur|Surs|North|Medieval|H4|Delhi|1540–1556||
Sher Shah Suri|1540–1545|Rupiya; GT Road; patta–qabuliyat
Islam Shah Suri|1545–1553|Continued Sher Shah’s system
~Firuz Shah Suri|1553|Killed within days
Muhammad Adil Shah|1553–1556|Minister Hemu
Sikandar Shah Suri|1555|Lost Sirhind to Humayun
@mughal|Mughals|North|Medieval|H4|Agra, Fatehpur Sikri, Lahore, Delhi|1526–1857|“Bade Hamare Abba Jaan Shaadi Aaye” — Babur, Humayun, Akbar, Jahangir, Shah Jahan, Aurangzeb|1
Babur|1526–1530|Panipat I; Khanwa; Baburnama
Humayun|1530–1540, 1555–1556|Lost to Sher Shah; regained 1555
Akbar|1556–1605|Mansabdari; Sulh-i-kul; Din-i-Ilahi
Jahangir|1605–1627|Chain of justice; Nur Jahan; Thomas Roe
Shah Jahan|1628–1658|Taj Mahal; Red Fort; Peacock Throne
Aurangzeb|1658–1707|Jizya reimposed; Deccan conquests
Bahadur Shah I|1707–1712|Released Shahu; “Shah-i-Bekhabar”
Jahandar Shah|1712–1713|Zulfiqar Khan wazir; ijara
Farrukhsiyar|1713–1719|Sayyid brothers; 1717 farman to EIC
~Rafi-ud-Darajat|1719|Puppet of Sayyids
~Shah Jahan II|1719|Puppet of Sayyids
Muhammad Shah|1719–1748|“Rangila”; Nadir Shah’s invasion (1739)
Ahmad Shah Bahadur|1748–1754|Abdali raids
Alamgir II|1754–1759|Killed by wazir Imad-ul-Mulk
Shah Alam II|1759–1806|Buxar (1764); Allahabad treaty (1765)
Akbar II|1806–1837|Gave Ram Mohan Roy the title Raja
Bahadur Shah II|1837–1857|“Zafar”; led 1857; exiled to Rangoon
@vijayanagara|Vijayanagara (Sangama → Saluva → Tuluva → Aravidu)|Deccan|Medieval|H4|Hampi; later Penukonda, Chandragiri|1336–1646|“Some Silly Tigers Attack” — Sangama, Saluva, Tuluva, Aravidu|
Harihara I|1336–1356|Sangama; co-founder with Bukka
Bukka I|1356–1377|Sangama; sent embassy to China
Harihara II|1377–1404|Sangama; took the title Maharajadhiraja
Devaraya I|1406–1422|Sangama; Tungabhadra dam; Nicolo Conti
Devaraya II|1424–1446|Sangama; Abdur Razzaq (1443); Muslims in army
Virupaksha II|1465–1485|Last Sangama
Saluva Narasimha|1485–1491|Founded the Saluva line
Vira Narasimha|1505–1509|Founded the Tuluva line
Krishnadevaraya|1509–1529|Tuluva; Amuktamalyada; Raichur (1520); Domingo Paes
Achyutadevaraya|1529–1542|Tuluva; Fernao Nuniz
Sadashivaraya|1542–1570|Tuluva; regent Rama Raya; Talikota (1565)
Tirumala|1570–1572|Founded the Aravidu line at Penukonda
Venkata II|1586–1614|Aravidu; capital Chandragiri
@bahmani|Bahmani kingdom|Deccan|Medieval|H4|Gulbarga → Bidar|1347–1527||
Alauddin Hasan Bahman Shah|1347–1358|Founder (Hasan Gangu)
Muhammad Shah I|1358–1375|Organised administration; wars with Vijayanagara
Tajuddin Firoz Shah|1397–1422|Observatory near Daulatabad; scholar-king
Ahmad Shah Wali|1422–1436|Shifted capital to Bidar
Muhammad Shah III|1463–1482|Mahmud Gawan wazir (executed 1481)
Kalimullah|1525–1527|Last Bahmani
@adilshahi|Adil Shahis of Bijapur|Deccan|Medieval|H4|Bijapur|1490–1686||
Yusuf Adil Shah|1490–1510|Founder; lost Goa to Portuguese (1510)
Ibrahim Adil Shah II|1580–1627|Kitab-i-Nauras; “Jagadguru”; Firishta at court
Muhammad Adil Shah|1627–1656|Gol Gumbaz
Sikandar Adil Shah|1672–1686|Last; Aurangzeb annexed Bijapur
@qutbshahi|Qutb Shahis of Golconda|Deccan|Medieval|H4|Golconda → Hyderabad|1518–1687||
Sultan Quli Qutb-ul-Mulk|1518–1543|Founder
Ibrahim Quli Qutb Shah|1550–1580|Patron of Telugu
Muhammad Quli Qutb Shah|1580–1612|Founded Hyderabad (1591); Charminar; Dakhni poet
Abdullah Qutb Shah|1626–1672|Accepted Mughal overlordship (1636)
Abul Hasan Tana Shah|1672–1687|Last; Golconda annexed by Aurangzeb
@nizamshahi|Nizam Shahis of Ahmadnagar|Deccan|Medieval|H4|Ahmadnagar|1490–1636||
Ahmad Nizam Shah|1490–1510|Founder; built Ahmadnagar
Burhan Nizam Shah I|1510–1553|Adopted Shi‘ism
Husain Nizam Shah I|1553–1565|Joined the Talikota alliance
Bahadur Nizam Shah|1596–1600|Chand Bibi regent; Mughals took Ahmadnagar (1600)
Murtaza Nizam Shah II|1600–1610 (nominal)|Malik Ambar the real power
@chhatrapati|Maratha Chhatrapatis|West|Medieval|H4|Raigad → Satara|1674–1818||1
Shivaji|1674–1680|Coronation at Raigad; Ashtapradhan
Sambhaji|1680–1689|Executed by Aurangzeb
Rajaram|1689–1700|Took refuge at Jinji
Shivaji II|1700–1707|Under regency of Tarabai
Shahu|1707–1749|Released by Mughals; appointed Peshwas
@peshwa|Peshwas|West|Medieval|H4|Pune|1713–1818|“B-B-B-M” — Balaji, Baji, Balaji, Madhav|1
Balaji Vishwanath|1713–1720|Secured Mughal grants (1719)
Baji Rao I|1720–1740|Palkhed (1728); raid on Delhi (1737)
Balaji Baji Rao|1740–1761|Nana Saheb; Third Panipat (1761)
Madhav Rao I|1761–1772|Revived Maratha power
Narayan Rao|1772–1773|Murdered in Pune
Raghunath Rao|1773–1774|“Raghoba”; allied with the British
Sawai Madhav Rao|1774–1795|Nana Phadnavis’ regency
Baji Rao II|1796–1818|Treaty of Bassein (1802); pensioned at Bithur
@sikhguru|Sikh Gurus|North|Medieval|H6|Kartarpur, Goindwal, Amritsar, Anandpur|1469–1708|“Naa Aao Re, Abhi Hum Hamesha Haste Tum Gaao”|1
Guru Nanak|1469–1539|Founder; langar; Kartarpur
Guru Angad|1539–1552|Gurmukhi script
Guru Amar Das|1552–1574|Manji system
Guru Ram Das|1574–1581|Founded Ramdaspur (Amritsar)
Guru Arjan Dev|1581–1606|Adi Granth (1604); executed 1606
Guru Hargobind|1606–1644|Miri-piri; Akal Takht
Guru Har Rai|1644–1661|Supported Dara Shikoh
Guru Har Krishan|1661–1664|Child Guru
Guru Tegh Bahadur|1664–1675|Executed in Delhi (1675)
Guru Gobind Singh|1675–1708|Khalsa (1699); killed at Nanded
@bengalnawab|Nawabs of Bengal|East|Modern|H7|Murshidabad|1717–1765||1
Murshid Quli Khan|1717–1727|Moved capital to Murshidabad; revenue farming
Shujauddin|1727–1739|Son-in-law of Murshid Quli
Sarfaraz Khan|1739–1740|Killed by Alivardi Khan
Alivardi Khan|1740–1756|Faced Maratha bargi raids
Siraj-ud-Daula|1756–1757|Plassey (1757)
Mir Jafar|1757–1760|Puppet of Clive
Mir Qasim|1760–1763|Monghyr; Buxar (1764)
@awadh|Nawabs of Awadh|North|Modern|H7|Faizabad → Lucknow|1722–1856||
Saadat Khan Burhan-ul-Mulk|1722–1739|Founder
Safdar Jang|1739–1754|Wazir of Mughal empire
Shuja-ud-Daula|1754–1775|Fought at Buxar (1764)
Asaf-ud-Daula|1775–1797|Moved capital to Lucknow; Bara Imambara
Saadat Ali Khan II|1798–1814|Ceded half of Awadh to EIC (1801)
Wajid Ali Shah|1847–1856|Deposed; Awadh annexed (1856)
@nizam|Nizams of Hyderabad (Asaf Jahis)|Deccan|Modern|H7|Aurangabad → Hyderabad|1724–1948||
Asaf Jah I (Nizam-ul-Mulk)|1724–1748|Founder; Shakar Kheda (1724)
Nizam Ali Khan (Asaf Jah II)|1762–1803|First to accept subsidiary alliance (1798)
Mahbub Ali Khan|1869–1911|Sixth Nizam
Mir Osman Ali Khan|1911–1948|Last; Operation Polo (1948)
@mysore|Mysore (Hyder Ali & Tipu)|Deccan|Modern|H7|Srirangapatna|1761–1799||1
Hyder Ali|1761–1782|Rose as commander; I & II Anglo-Mysore Wars
Tipu Sultan|1782–1799|Killed in IV Anglo-Mysore War
@sikhempire|Sikh Empire of Punjab|North|Modern|H7|Lahore|1799–1849||
Ranjit Singh|1801–1839|Treaty of Amritsar (1809); Kohinoor
Kharak Singh|1839–1840|Weak successor
Sher Singh|1841–1843|Assassinated
Duleep Singh|1843–1849|Last; Punjab annexed (1849)
@governorgeneral|Governors-General & Viceroys|All-India|Modern|H7|Calcutta → Delhi|1773–1950||1
Warren Hastings|1773–1785|First GG of Bengal; Regulating Act; Rohilla war; impeached
Lord Cornwallis|1786–1793|Permanent Settlement; Cornwallis Code; III Anglo-Mysore War
Sir John Shore|1793–1798|Policy of non-intervention
Lord Wellesley|1798–1805|Subsidiary Alliance; IV Anglo-Mysore War; Fort William College
~Lord Cornwallis (2nd term)|1805|Died at Ghazipur soon after arrival
Sir George Barlow|1805–1807|Vellore mutiny (1806)
Lord Minto I|1807–1813|Treaty of Amritsar (1809); Charter Act 1813
Lord Hastings|1813–1823|Paramountcy; III Anglo-Maratha War; Anglo-Nepal War
Lord Amherst|1823–1828|First Anglo-Burmese War
Lord William Bentinck|1828–1835|Sati abolished (1829); English Education Act (1835); first GG of India (1833)
Sir Charles Metcalfe|1835–1836|Freed the press (1835)
Lord Auckland|1836–1842|First Anglo-Afghan War
Lord Ellenborough|1842–1844|Annexed Sindh (1843)
Lord Hardinge I|1844–1848|First Anglo-Sikh War
Lord Dalhousie|1848–1856|Doctrine of Lapse; railways (1853); Post Office Act; annexed Punjab & Awadh
Lord Canning|1856–1862|Revolt of 1857; first Viceroy (1858); Indian Councils Act 1861
Lord Elgin I|1862–1863|Wahabi movement suppressed
Sir John Lawrence|1864–1869|Policy of masterly inactivity (Afghanistan)
Lord Mayo|1869–1872|Financial decentralisation; first census (1872); assassinated in Andamans
Lord Northbrook|1872–1876|Kuka movement; Prince of Wales’s visit
Lord Lytton|1876–1880|Vernacular Press Act; Arms Act; Delhi Durbar (1877)
Lord Ripon|1880–1884|Local self-government (1882); Hunter Commission; Ilbert Bill; repealed VP Act
Lord Dufferin|1884–1888|INC founded (1885); Third Anglo-Burmese War
Lord Lansdowne|1888–1894|Indian Councils Act 1892; Durand Line (1893)
Lord Elgin II|1894–1899|Plague in Bombay; Chapekar brothers
Lord Curzon|1899–1905|Partition of Bengal; Universities Act; ASI revived
Lord Minto II|1905–1910|Morley–Minto reforms; Muslim League founded
Lord Hardinge II|1910–1916|Delhi Durbar 1911; capital to Delhi
Lord Chelmsford|1916–1921|Montford reforms; Rowlatt Act; Jallianwala Bagh
Lord Reading|1921–1926|Chauri Chaura; Kakori; Swaraj Party
Lord Irwin|1926–1931|Simon Commission; Dandi March; Gandhi–Irwin Pact
Lord Willingdon|1931–1936|Communal Award; Poona Pact; GoI Act 1935
Lord Linlithgow|1936–1944|August Offer; Cripps Mission; Quit India
Lord Wavell|1944–1947|Simla Conference; Cabinet Mission
Lord Mountbatten|1947–1948|3 June Plan; first GG of free India
C. Rajagopalachari|1948–1950|Only Indian Governor-General
@primeminister|Prime Ministers of India|All-India|Post-1947|H9|New Delhi|1947–present||1
Jawaharlal Nehru|1947–1964|Planning; NAM; Panchsheel
Lal Bahadur Shastri|1964–1966|1965 war; Tashkent Declaration; “Jai Jawan Jai Kisan”
Indira Gandhi|1966–1977|Bank nationalisation; 1971 war; Emergency
Morarji Desai|1977–1979|First non-Congress PM (Janata)
Charan Singh|1979–1980|Never faced Parliament as PM
Indira Gandhi (2nd term)|1980–1984|Operation Blue Star; assassinated
Rajiv Gandhi|1984–1989|NPE 1986; 61st Amendment (voting age 18)
V.P. Singh|1989–1990|Mandal Commission report implemented
Chandra Shekhar|1990–1991|Gold pledged in BoP crisis
P.V. Narasimha Rao|1991–1996|Liberalisation (LPG)
~Atal Bihari Vajpayee (1st term)|1996|13-day government
H.D. Deve Gowda|1996–1997|United Front government
I.K. Gujral|1997–1998|Gujral Doctrine
Atal Bihari Vajpayee|1998–2004|Pokhran-II; Kargil
Manmohan Singh|2004–2014|RTI, MGNREGA
Narendra Modi|2014–present|GST; NEP 2020
`;
  var cur = null;
  RAW.split('\n').forEach(function (line) {
    line = line.trim();
    if (!line) return;
    var p = line.split('|');
    if (line.charAt(0) === '@') {
      cur = { id: p[0].slice(1), name: p[1], region: p[2], era: p[3], u: p[4], capital: p[5], span: p[6], mn: p[7] || '', full: p[8] === '1', kings: [] };
      J.dyn.push(cur);
    } else if (cur) {
      var skip = p[0].charAt(0) === '~';
      cur.kings.push({ n: skip ? p[0].slice(1) : p[0], r: p[1] || '', f: p[2] || '', skip: skip });
    }
  });
})(window.JRF);
