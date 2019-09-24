# WaitingListApplication

Pasirinkau daryti su Node.js ir Express.js pamatęs, kad kaip pliusą žymite jei naudojamas ne Laravel ar Symfony framework. Be to jį geriausiai ir pažįstu. Esu kūręs projektą su .Net Core, esu vieną, kiek didesnį (buvo daugiau laiko jam, nes neturėjau deadline) su Express, o dabar lygiagrečiai mokausi Symfony (https://www.udemy.com/symfony-api-platform-reactjs-full-stack-masterclass/learn/lecture/12294360#overview)

# Apie pačią aplikaciją
**Technologijos**


Naudojau remotemysql.com serverį laikyti duomenis ir heroku hostinti svetainę. Taigi projektas yra "live", tačiau tikrai nėra jis tobulas, neturėjau laiko ištestuoti visų galimų atvejų, neprigeneravau daug duomenų į duomenų bazę, tai nenustebčiau jei kažkur gali atsirasti kokia fatal klaida. Pagrinde dirbau su VisualStudioCode editoriumi ir dariau pažingsninius commit į atskiras šakas, tačiau suprantu, kad juos reiktų dėti dažniau, su kiekviena nauja savybe, kad atsektum klaidą ir galėtum grįžti. Čia gavosi, kad dėjau blokais, kiekvieno darbo etapo pabaigoje. Authentikacijai bei Front End'ui naudojau templates, nekūriau savo nuo nulio.

**Programos Veikimas**


Duomenų bazėje yra 3 lentelės: specializacijos (iš esmės čia yra enum, leidžiantis pasirinkti kokius specialistus registruoti sistemoje), specialistai (kurie kartu yra ir vartotojai, jie gali prisijungti ir keisti klientų būseną į aptarnautą) bei patys klientai.
Naujas į eilę norintis žmogus suveda savo duomenis įvadiniame puslapyje esančiame lauke, tai yra įveda savo varda ir pasirenka pas kokį specialistą jis nori atsistoti į eilę. Šitoje vietoje yra ir backend data validation patikrinti įvedamą informaciją, bei duomenys siunčiami per POST request. Jei viskas gerai atidaromas kliento puslapis (su unikaliai jam sugeneruotu raktu), duomenys atnaujinami ne kas 5s, o kas 20s, nes išvedamas informacinis laukas, kad išsisaugokite unikalią nuorodą pakankamai ilgas ir kadangi visos klaidos ar sėkmingi veiksmai rodomi per flash puslapiui persikrovus dingsta ir nespėja vartotojas perskaityti, o kelios sekundės laukimo laiko atnaujinime jo nepaveiks. Šitame kliento puslapyje yra galimybė apsikeisti su už tavęs esančiu, tai yra pavėlinti laiką arba iš vis atšaukti susitikimą(DELETE request). Toliau vartotojas gali matyti švieslentės puslapį, kuris atsinaujina kas 5s paspaudęs ant "Waiting List". Čia pritaikyta ir ta LIMIT sąlyga apribojanti rodomų laukiančiųjų skaičių iki 20. Yra specialistų statististikos puslapis su galimybe filtruoti pagal specialistą. Duomenys grupuojami pagal dienas, tai klientas gali matyti, kuriomis dienomis specialistas priverstas skubėti ir aptarnavo daug klientų, o kuriomis mažiau. (Grupavau pagal dienas, suabejojau ar savaitės dienas reiktų, bet reikalavimuose rašote dienas, tai taip ir palikau).
Specialistų prisijungimai, jei nenorite kurti naujo ir pridėti jam klientų, vartotojo vardas - vardas.pavarde (vardo ir pavardės rinkinys per tašką) ir visų slaptožodis vienodas - admin, duombazėje saugomos heshuotos jų reikšmės.
Kiek laukti liko laiko skaičiuojama (BilietukoSūkurimoLaikas+KelintasEilėjeEsi * VidutinisLaikasAptarnavimoPasSpecialistą-DabartinisLaikas) arba jei specialistas neturi dar klientų ir todėl nežinome jo vidutinio laiko KelintasEilėjeEsi * 5min, taip pat pridedame kada sukūrta minus kiek dabar laiko

**Failų hierarchija**


Yra config direktorija sudaryta iš failo prijungiančio programą prie duomenų bazės (db.js) ir authentikacijos strategijų apibrėžimo bei Passport įrankio konfiguracijos (passport.js). Į middleware direktoriją įdėjau patikrinimo ar vartotojas prisijungęs funkciją (auth.js) ir globalių kintamųjų deklaravimą. Jų reikia, kad iš galėčiau klaidą parodyti ir tame puslapyje į kurį redirectinu, bei taip pasiekiu sesijos duomenis apie vartotoją. Pagrindiniai Routes (maršrutai) yra index.js faile esančiame routes direktorijoje. O pagrindinis programos (Startup) failas yra app.js bei žinoma matomi Views atitinkamoje direktorijoje.
