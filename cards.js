// A játékban szereplő összes karakter kártya adatbázisa
const cardDatabase = [
    {
        id: "langolo_tok",
        name: "Lángoló Tok",
        image: "card/0.png",
        maxHp: 90,
        attacks: [
            { name: "Dühös Lángcsapás", type: "dmg", dmg: 40, hits: 1, cost: 1 },
            { name: "Plazma-Orkán", type: "dmg", dmg: 20, hits: 3, cost: 3 },
            { name: "Elem-Töltet", type: "dmg", dmg: 20, hits: 1, cost: 2, effect: "burn" },
            { name: "Lángpajzs", type: "shield", cost: 1 }
        ]
    },
    {
        id: "chin_gaze",
        name: "Chin-Gaze",
        image: "card/1.png",
        maxHp: 70,
        attacks: [
            { name: "Kozmikus Tok-sugár", type: "dmg", dmg: 30, cost: 1 },
            { name: "Duzzogó Arc-ütés", type: "dmg", dmg: 10, cost: 1, effect: "paralyze" },
            { name: "Pszicho-Menedék", type: "heal", healAmount: 40, cost: 2 },
            { name: "Sokkos Tekintet", type: "shield", cost: 1 }
        ]
    },
    {
        id: "gengszter_niki",
        name: "Gengszter Niki",
        image: "card/2.png",
        maxHp: 300,
        attacks: [
            { name: "Brigád Támadás", type: "dmg", dmg: 160, cost: 3 },
            { name: "Gengsztercsapás", type: "dmg", dmg: 240, cost: 4, effect: "paralyze" },
            { name: "Alner Védő", type: "shield", cost: 1 },
            { name: "Brigád Segély", type: "heal", healAmount: 50, cost: 2 }
        ]
    },
    {
        id: "uvolto_villam",
        name: "Üvöltő Villám",
        image: "card/3.png",
        maxHp: 120,
        attacks: [
            { name: "Plazma-Visítás", type: "dmg", dmg: 30, hits: 2, cost: 2 },
            { name: "Villantó-Üvöltés", type: "dmg", dmg: 30, hits: 1, cost: 1, effect: "paralyze" },
            { name: "Hangrobbanás", type: "dmg", dmg: 10, hits: 4, cost: 2 },
            { name: "Fókuszálás", type: "heal", healAmount: 30, cost: 1 }
        ]
    },
    {
        id: "cskilo_feny_vilag",
        name: "Cskiló Fény-Világ",
        image: "card/4.png",
        maxHp: 120,
        attacks: [
            { name: "Lángoló Tekintet", type: "dmg", dmg: 70, cost: 2, effect: "burn" },
            { name: "Kozmikus Tűz-roham", type: "dmg", dmg: 150, cost: 4 },
            { name: "Pszicho-Gyújtó", type: "dmg", dmg: 30, cost: 1 },
            { name: "Fény-pajzs", type: "shield", cost: 1 }
        ]
    },
    {
        id: "vakito_orditas",
        name: "Vakító Ordítás",
        image: "card/5.png",
        maxHp: 130,
        attacks: [
            { name: "Sokkos Fény-csóva", type: "dmg", dmg: 60, cost: 2, effect: "paralyze" },
            { name: "Lángoló Szem-roham", type: "dmg", dmg: 110, cost: 3 },
            { name: "Vakító Szempár", type: "shield", cost: 1 },
            { name: "Láng-aura", type: "dmg", dmg: 20, cost: 1, effect: "burn" }
        ]
    },
    {
        id: "csere_geza",
        name: "Csere Géza",
        image: "card/6.png",
        maxHp: 300,
        attacks: [
            { name: "Amisz Csapás", type: "dmg", dmg: 160, cost: 3 },
            { name: "Ritkaság Változás", type: "dmg", dmg: 240, cost: 4, effect: "paralyze" },
            { name: "Gyűjtői Szenvedély", type: "shield", cost: 1 },
            { name: "Ritka Gyógyír", type: "heal", healAmount: 60, cost: 2 }
        ]
    },
    {
        id: "tuzes_cserebogar_vmax",
        name: "Tüzes Cserebogár VMAX",
        image: "card/7.png",
        maxHp: 330,
        attacks: [
            { name: "Kemence-harag", type: "dmg", dmg: 240, cost: 4 },
            { name: "Tűzvihar-lehelet", type: "dmg", dmg: 40, cost: 1, effect: "burn" },
            { name: "VMAX Szabály", type: "shield", cost: 1 },
            { name: "Parázs-eső", type: "dmg", dmg: 30, hits: 3, cost: 2 }
        ]
    },
    {
        id: "ejszakai_vadasz",
        name: "Éjszakai Vadász",
        image: "card/8.png",
        maxHp: 130,
        attacks: [
            { name: "Rúna-tépés", type: "dmg", dmg: 60, cost: 2, effect: "paralyze" },
            { name: "Éjszakai Támadás", type: "dmg", dmg: 110, cost: 3 },
            { name: "Álcázó Brindle", type: "shield", cost: 1 },
            { name: "Pihenés", type: "heal", healAmount: 50, cost: 2 }
        ]
    },
    {
        id: "nicili_fusion",
        name: "Nicili Fusion",
        image: "card/9.png",
        maxHp: 330,
        attacks: [
            { name: "Kozmikus Gál-zuhatag", type: "dmg", dmg: 260, cost: 4 },
            { name: "Gigabob-Roham", type: "dmg", dmg: 180, cost: 3, effect: "paralyze" },
            { name: "Fúziós Adrenalin", type: "heal", healAmount: 40, cost: 2 },
            { name: "Kozmikus Pajzs", type: "shield", cost: 1 }
        ]
    },
    {
        id: "barna_medve",
        name: "Barna Medve",
        image: "card/10.png",
        maxHp: 120,
        attacks: [
            { name: "Békés Pofon", type: "dmg", dmg: 20, cost: 1 },
            { name: "Dühös Riadó-harapás", type: "dmg", dmg: 60, cost: 2 },
            { name: "Vastag Bunda", type: "shield", cost: 1 },
            { name: "Erőgyűjtés", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "bromance",
        name: "Bromance",
        image: "card/11.png",
        maxHp: 220,
        attacks: [
            { name: "Örök Barátság", type: "dmg", dmg: 180, cost: 3 },
            { name: "Szilárd Váll", type: "dmg", dmg: 90, cost: 2 },
            { name: "Összefogás", type: "heal", healAmount: 40, cost: 2 },
            { name: "Vállt vállnak", type: "shield", cost: 1 }
        ]
    },
    {
        id: "orgia_a_dezsaban",
        name: "Orgia a Dézsában",
        image: "card/12.png",
        maxHp: 169,
        attacks: [
            { name: "Kozmikus Dézsa-Tsunami", type: "dmg", dmg: 80, cost: 2 },
            { name: "Dézsa-ordítás", type: "dmg", dmg: 40, cost: 1, effect: "paralyze" },
            { name: "Fürdőzés", type: "heal", healAmount: 50, cost: 2 },
            { name: "Hab-Pajzs", type: "shield", cost: 1 }
        ]
    },
    {
        id: "golya",
        name: "Gólya",
        image: "card/13.png",
        maxHp: 110,
        attacks: [
            { name: "Szélvihar-csapkodás", type: "dmg", dmg: 30, cost: 1 },
            { name: "Kozmikus Csőr", type: "dmg", dmg: 60, cost: 2 },
            { name: "Fészekőrző", type: "heal", healAmount: 50, cost: 2 },
            { name: "Elkerülés", type: "shield", cost: 1 }
        ]
    },
    {
        id: "alkoholizmus_a_dezsaban",
        name: "Alkoholizmus a Dézsában",
        image: "card/14.png",
        maxHp: 169,
        attacks: [
            { name: "Kozmikus Pofon-zuhany", type: "dmg", dmg: 120, cost: 3 },
            { name: "Sokkos Tekintet", type: "dmg", dmg: 20, cost: 1, effect: "paralyze" },
            { name: "Dézsa-gőz Sokk", type: "shield", cost: 1 },
            { name: "Gőz-regeneráció", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "pok_beno",
        name: "Pók Benó",
        image: "card/15.png",
        maxHp: 160,
        attacks: [
            { name: "Háló-Betiprás", type: "dmg", dmg: 130, cost: 3, effect: "paralyze" },
            { name: "Szikla-Scramble", type: "dmg", dmg: 50, cost: 1 },
            { name: "Zseniális Hálózat", type: "shield", cost: 1 },
            { name: "Háló-csapda", type: "dmg", dmg: 30, cost: 1, effect: "paralyze" }
        ]
    },
    {
        id: "pancelos_malac",
        name: "Páncélos Malac",
        image: "card/16.png",
        maxHp: 170,
        attacks: [
            { name: "Sár-Dagasztás", type: "dmg", dmg: 40, cost: 1 },
            { name: "Röfi-Roham", type: "dmg", dmg: 100, cost: 3 },
            { name: "Vastag Szalonna", type: "shield", cost: 1 },
            { name: "Túrás", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "gombamod",
        name: "Gombamód",
        image: "card/17.png",
        maxHp: 110,
        attacks: [
            { name: "Spóra-Felhő", type: "dmg", dmg: 30, cost: 1, effect: "paralyze" },
            { name: "Mérgező Kalap", type: "dmg", dmg: 50, cost: 2, effect: "burn" },
            { name: "Tönk-Erősítés", type: "shield", cost: 1 },
            { name: "Eső-Gyűjtés", type: "heal", healAmount: 50, cost: 2 }
        ]
    },
    {
        id: "gabori_pagoda",
        name: "Gábori Pagoda",
        image: "card/18.png",
        maxHp: 160,
        attacks: [
            { name: "Villogó Bádog", type: "dmg", dmg: 50, cost: 1, effect: "paralyze" },
            { name: "Pagoda-csapás", type: "dmg", dmg: 130, cost: 3 },
            { name: "Álcázó Tető", type: "shield", cost: 1 },
            { name: "Kozmikus Erőtér", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "tuzes_cserebogar",
        name: "Tüzes Cserebogár VMAX",
        image: "card/19.png",
        maxHp: 330,
        attacks: [
            { name: "Tűzvihar-lehelet", type: "dmg", dmg: 40, cost: 2, effect: "burn" },
            { name: "Kemence-harag", type: "dmg", dmg: 240, cost: 4 },
            { name: "VMAX Kitartás", type: "shield", cost: 1 },
            { name: "Izzó Páncél", type: "dmg", dmg: 60, cost: 2 }
        ]
    },
    {
        id: "hosies_hoember",
        name: "Hősies Hóember",
        image: "card/20.png",
        maxHp: 130,
        attacks: [
            { name: "Hógolyó-Zápor", type: "dmg", dmg: 20, hits: 3, cost: 2 },
            { name: "Fagyasztó Lehelet", type: "dmg", dmg: 40, cost: 2, effect: "paralyze" },
            { name: "Hó-Pajzs", type: "shield", cost: 1 },
            { name: "Újrafagyás", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "vizi_bence",
        name: "Vízi Bence",
        image: "card/21.png",
        maxHp: 1690,
        attacks: [
            { name: "Kozmikus Buborék-sokk", type: "dmg", dmg: 120, cost: 3 },
            { name: "Buborékcsapda", type: "dmg", dmg: 40, cost: 1, effect: "paralyze" },
            { name: "Mélytengeri Gyógyulás", type: "heal", healAmount: 60, cost: 2 },
            { name: "Víz-pajzs", type: "shield", cost: 1 }
        ]
    },
    {
        id: "lila_kod",
        name: "Lila Köd",
        image: "card/22.png",
        maxHp: 140,
        attacks: [
            { name: "Misztikus Csapás", type: "dmg", dmg: 40, cost: 1 },
            { name: "Köd-Bénítás", type: "dmg", dmg: 30, cost: 2, effect: "paralyze" },
            { name: "Eltűnés", type: "shield", cost: 1 },
            { name: "Lelki Béke", type: "heal", healAmount: 50, cost: 2 }
        ]
    },
    {
        id: "szivarvany",
        name: "Szivárvány",
        image: "card/23.png",
        maxHp: 160,
        attacks: [
            { name: "Szivárvány Fény", type: "dmg", dmg: 50, cost: 1, effect: "paralyze" },
            { name: "Pagoda-csapás", type: "dmg", dmg: 130, cost: 3 },
            { name: "Ragyogás", type: "heal", healAmount: 40, cost: 2 },
            { name: "Fénytörés", type: "shield", cost: 1 }
        ]
    },
    {
        id: "toyota_verso",
        name: "Toyota Verso",
        image: "card/24.png",
        maxHp: 160,
        attacks: [
            { name: "Gazdaságos Út", type: "dmg", dmg: 50, cost: 1 },
            { name: "Családi Szállítás", type: "dmg", dmg: 130, cost: 3 },
            { name: "Dízelerő", type: "shield", cost: 1 },
            { name: "Tankolás", type: "heal", healAmount: 50, cost: 2 }
        ]
    },
    {
        id: "rozsdas_bicikli",
        name: "Rozsdás Bicikli",
        image: "card/25.png",
        maxHp: 120,
        attacks: [
            { name: "Lánc-Csörgetés", type: "dmg", dmg: 30, cost: 1 },
            { name: "Féktelen Száguldás", type: "dmg", dmg: 70, cost: 2 },
            { name: "Olajozás", type: "heal", healAmount: 30, cost: 1 },
            { name: "Küllő-Védő", type: "shield", cost: 1 }
        ]
    },
    {
        id: "szuper_szendvics",
        name: "Szuper Szendvics",
        image: "card/26.png",
        maxHp: 110,
        attacks: [
            { name: "Mustár-Sokk", type: "dmg", dmg: 40, cost: 1, effect: "paralyze" },
            { name: "Húsos Csapás", type: "dmg", dmg: 60, cost: 2 },
            { name: "Energia-Falat", type: "heal", healAmount: 50, cost: 2 },
            { name: "Héj-Páncél", type: "shield", cost: 1 }
        ]
    },
    {
        id: "beno_ragu",
        name: "Bénó Ragu",
        image: "card/27.png",
        maxHp: 160,
        attacks: [
            { name: "Tartalmas Kavarás", type: "dmg", dmg: 50, cost: 1 },
            { name: "Bénó Hatás: Fingat", type: "dmg", dmg: 130, cost: 3, effect: "paralyze" },
            { name: "Séf Szabály", type: "shield", cost: 1 },
            { name: "Felforrás", type: "dmg", dmg: 30, cost: 1, effect: "burn" }
        ]
    },
    {
        id: "kandur_bandi",
        name: "Kandúr Bandi",
        image: "card/28.png",
        maxHp: 130,
        attacks: [
            { name: "Pofon-Zápor", type: "dmg", dmg: 20, hits: 4, cost: 2 },
            { name: "Dühös Morgás", type: "dmg", dmg: 50, cost: 2, effect: "paralyze" },
            { name: "Kandúr-Tartás", type: "shield", cost: 1 },
            { name: "Dorombolás", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "nathas_kutato",
        name: "Náthás Kutató",
        image: "card/29.png",
        maxHp: 160,
        attacks: [
            { name: "Csiped-csípős Csapás", type: "dmg", dmg: 60, cost: 1 },
            { name: "Náthás Nyomás", type: "dmg", dmg: 130, cost: 3 },
            { name: "Zsebkendő Pajzs", type: "shield", cost: 1 },
            { name: "Vírus Terjesztés", type: "dmg", dmg: 20, cost: 1, effect: "burn" }
        ]
    },
    {
        id: "zseb_zombi",
        name: "Zseb-Zombi",
        image: "card/30.png",
        maxHp: 140,
        attacks: [
            { name: "Apró Harapás", type: "dmg", dmg: 40, cost: 1 },
            { name: "Zombi-Láz", type: "dmg", dmg: 30, cost: 2, effect: "burn" },
            { name: "Sötét Energia", type: "heal", healAmount: 40, cost: 2 },
            { name: "Csont-Vért", type: "shield", cost: 1 }
        ]
    },
    {
        id: "tukor_kep",
        name: "Tükör-Kép",
        image: "card/31.png",
        maxHp: 120,
        attacks: [
            { name: "Fénytörés-ütés", type: "dmg", dmg: 50, cost: 2 },
            { name: "Vakítás", type: "dmg", dmg: 20, cost: 1, effect: "paralyze" },
            { name: "Üveg-Pajzs", type: "shield", cost: 1 },
            { name: "Polírozás", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "meszaros",
        name: "Mészáros",
        image: "card/32.png",
        maxHp: 160,
        attacks: [
            { name: "Tudat-törlő Támadás", type: "dmg", dmg: 40, hits: 2, cost: 2, effect: "paralyze" },
            { name: "Az Árnyék Mestere", type: "dmg", dmg: 80, hits: 1, cost: 2 },
            { name: "Sötét Paktum", type: "heal", healAmount: 50, cost: 2 },
            { name: "Árny-Pajzs", type: "shield", cost: 1 }
        ]
    },
    {
        id: "all_covering_pollen",
        name: "All-Covering Pollen",
        image: "card/33.png",
        maxHp: 160,
        attacks: [
            { name: "Pollen-áradás", type: "dmg", dmg: 80, cost: 2 },
            { name: "Generatív Fulladás", type: "dmg", dmg: 80, cost: 2, effect: "paralyze" },
            { name: "Folyondár Pajzs", type: "shield", cost: 1 },
            { name: "Fotoszintézis", type: "heal", healAmount: 60, cost: 2 }
        ]
    },
    {
        id: "kocka_kobra",
        name: "Kocka-Kobra",
        image: "card/34.png",
        maxHp: 130,
        attacks: [
            { name: "Digitális Marás", type: "dmg", dmg: 50, cost: 2, effect: "burn" },
            { name: "Pixel-Fojtás", type: "dmg", dmg: 80, cost: 3 },
            { name: "Adat-Véd", type: "shield", cost: 1 },
            { name: "Rendszer-Visszaállítás", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "gyemant_galamb",
        name: "Gyémánt Galamb",
        image: "card/35.png",
        maxHp: 110,
        attacks: [
            { name: "Csillogó Csípés", type: "dmg", dmg: 40, cost: 1 },
            { name: "Ékkő-Rohanás", type: "dmg", dmg: 90, cost: 3 },
            { name: "Ragyogó Szárny", type: "shield", cost: 1 },
            { name: "Tiszta Forrás", type: "heal", healAmount: 50, cost: 2 }
        ]
    },
    {
        id: "plazma_parduc",
        name: "Plazma-Párduc",
        image: "card/36.png",
        maxHp: 150,
        attacks: [
            { name: "Elektromos Mancs", type: "dmg", dmg: 50, cost: 2, effect: "paralyze" },
            { name: "Plazma-Vágta", type: "dmg", dmg: 100, cost: 3 },
            { name: "Sokk-Mező", type: "shield", cost: 1 },
            { name: "Töltődés", type: "heal", healAmount: 40, cost: 2 }
        ]
    },
    {
        id: "elfogy_a_benzin",
        name: "Elfogy a Benzin",
        image: "card/37.png",
        maxHp: 160,
        attacks: [
            { name: "Brigád Támadás", type: "dmg", dmg: 160, cost: 4 },
            { name: "Gengszter Csapás", type: "dmg", dmg: 100, cost: 3, effect: "paralyze" },
            { name: "Kétfutásos Terv", type: "shield", cost: 1 },
            { name: "Kannás Utántöltés", type: "heal", healAmount: 50, cost: 2 }
        ]
    }
];