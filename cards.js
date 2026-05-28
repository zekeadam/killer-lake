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
        id: "vizi_bence",
        name: "Vízi Bence",
        image: "card/21.png",
        maxHp: 169,
        attacks: [
            { name: "Kozmikus Buborék-sokk", type: "dmg", dmg: 120, cost: 3 },
            { name: "Buborékcsapda", type: "dmg", dmg: 40, cost: 1, effect: "paralyze" },
            { name: "Mélytengeri Gyógyulás", type: "heal", healAmount: 60, cost: 2 },
            { name: "Víz-pajzs", type: "shield", cost: 1 }
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