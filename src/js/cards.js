// A játékban szereplő összes karakter kártya adatbázisa
const cardDatabase = [
    {
        id: "card_0",
        name: "Lángoló Tok",
        image: "assets/card/0.png",
        maxHp: 90,
        attacks: [
            { name: "Dühös Lángcsapás", type: "dmg", dmg: 40, hits: 1, cost: 1, accuracy: 0.9 },
            { name: "Plazma-Orkán", type: "dmg", dmg: 20, hits: 3, cost: 3, accuracy: 0.9 },
            { name: "Elem-Töltet", type: "dmg", dmg: 20, hits: 1, cost: 2, effect: "burn", accuracy: 0.9 },
            { name: "Lángpajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_1",
        name: "Chin-Gaze",
        image: "assets/card/1.png",
        maxHp: 70,
        attacks: [
            { name: "Kozmikus Tok-sugár", type: "dmg", dmg: 30, cost: 1, accuracy: 0.9 },
            { name: "Duzzogó Arc-ütés", type: "dmg", dmg: 10, cost: 1, effect: "paralyze", accuracy: 0.9 },
            { name: "Pszicho-Menedék", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 },
            { name: "Sokkos Tekintet", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_2",
        name: "Chin-Gaze",
        image: "assets/card/2.png",
        maxHp: 70,
        attacks: [
            { name: "Tok-gúnyos", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Pszicho-tokos-sugár", type: "dmg", dmg: 50, cost: 2, accuracy: 0.8 },
            { name: "Grimasz-Suhintás", type: "dmg", dmg: 10, cost: 1, effect: "paralyze", accuracy: 0.9 },
            { name: "Pszicho-Menedék", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_3",
        name: "Üvöltő Villám",
        image: "assets/card/3.png",
        maxHp: 120,
        attacks: [
            { name: "Plazma-Visítás", type: "dmg", dmg: 30, hits: 2, cost: 2, accuracy: 0.9 },
            { name: "Villantó-Üvöltés", type: "dmg", dmg: 30, hits: 1, cost: 1, effect: "paralyze", accuracy: 0.9 },
            { name: "Hangrobbanás", type: "dmg", dmg: 10, hits: 4, cost: 2, accuracy: 0.9 },
            { name: "Fókuszálás", type: "heal", healAmount: 30, cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_4",
        name: "Cskiló Fény-Világ",
        image: "assets/card/4.png",
        maxHp: 120,
        attacks: [
            { name: "Lángoló Tekintet", type: "dmg", dmg: 70, cost: 2, effect: "burn", accuracy: 0.8 },
            { name: "Kozmikus Tűz-roham", type: "dmg", dmg: 150, cost: 4, accuracy: 0.6 },
            { name: "Pszicho-Gyújtó", type: "dmg", dmg: 30, cost: 1, accuracy: 0.9 },
            { name: "Fény-pajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_5",
        name: "Vakító Ordítás",
        image: "assets/card/5.png",
        maxHp: 130,
        attacks: [
            { name: "Sokkos Fény-csóva", type: "dmg", dmg: 60, cost: 2, effect: "paralyze", accuracy: 0.8 },
            { name: "Lángoló Szem-roham", type: "dmg", dmg: 110, cost: 3, accuracy: 0.7 },
            { name: "Vakító Szempár", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Láng-aura", type: "dmg", dmg: 20, cost: 1, effect: "burn", accuracy: 0.9 }
        ]
    },
    {
        id: "card_6",
        name: "Tudó Villám",
        image: "assets/card/6.png",
        maxHp: 130,
        attacks: [
            { name: "Tervezett Túlfeszültség", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Vakító Lézer", type: "dmg", dmg: 30, cost: 2, effect: "paralyze", accuracy: 0.9 },
            { name: "Kozmikus Villám-vihar", type: "dmg", dmg: 110, cost: 4, accuracy: 0.7 },
            { name: "Villám-Feltöltés", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_7",
        name: "Thievery Corp",
        image: "assets/card/7.png",
        maxHp: 130,
        attacks: [
            { name: "Halk Tolvajlás", type: "heal", healAmount: 30, cost: 1, accuracy: 1.0 },
            { name: "Visító Szendvics", type: "dmg", dmg: 60, cost: 2, effect: "paralyze", accuracy: 0.8 },
            { name: "Szonikus Hangrobbanás", type: "dmg", dmg: 120, cost: 4, accuracy: 0.7 },
            { name: "Zsebtolvajlás", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_8",
        name: "Éjszakai Vadász",
        image: "assets/card/8.png",
        maxHp: 130,
        attacks: [
            { name: "Megjelölő Rúna", type: "dmg", dmg: 60, cost: 2, effect: "mark", accuracy: 0.8 },
            { name: "Árny Kivégzés", type: "dmg", dmg: 110, cost: 3, synergy: "mark", accuracy: 0.7 },
            { name: "Álcázó Brindle", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Pihenés", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_9",
        name: "Gábori Trükkmester",
        image: "assets/card/9.png",
        maxHp: 50,
        attacks: [
            { name: "Kezességi Csere", type: "dmg", dmg: 20, cost: 1, accuracy: 0.9 },
            { name: "Kezességi Pofon", type: "dmg", dmg: 10, cost: 2, accuracy: 0.9 },
            { name: "Trükkös Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Gyors Gyógyulás", type: "heal", healAmount: 20, cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_10",
        name: "Barna Medve",
        image: "assets/card/10.png",
        maxHp: 120,
        attacks: [
            { name: "Békés Pofon", type: "dmg", dmg: 20, cost: 1, accuracy: 0.9 },
            { name: "Dühös Riadó-harapás", type: "dmg", dmg: 60, cost: 2, accuracy: 0.8 },
            { name: "Vastag Bunda (Counter)", type: "shield", cost: 1, effect: "counter", accuracy: 1.0 },
            { name: "Erőgyűjtés", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_11",
        name: "Medve Riasztás",
        image: "assets/card/11.png",
        type: "supporter",
        description: "Megriasztja az ellenfelet: 30 sebzés és bénítás.",
        action: { type: "dmg", dmg: 30, effect: "paralyze" },
        maxHp: 50,
        attacks: []
    },
    {
        id: "card_12",
        name: "Gyermekláncfű Mező",
        image: "assets/card/12.png",
        type: "supporter",
        description: "Visszatölt 60 Életerőt az aktív karakternek.",
        action: { type: "heal", healAmount: 60 },
        maxHp: 50,
        attacks: []
    },
    {
        id: "card_13",
        name: "Gólya",
        image: "assets/card/13.png",
        maxHp: 110,
        attacks: [
            { name: "Szélvihar-csapkodás", type: "dmg", dmg: 30, cost: 1, accuracy: 0.9 },
            { name: "Kozmikus Csőr", type: "dmg", dmg: 60, cost: 2, accuracy: 0.8 },
            { name: "Fészekőrző", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 },
            { name: "Elkerülés", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_14",
        name: "Via Ferrata",
        image: "assets/card/14.png",
        type: "supporter",
        description: "Ad 2 Pajzsot az aktív karakternek.",
        action: { type: "shield", amount: 2 },
        maxHp: 50,
        attacks: []
    },
    {
        id: "card_15",
        name: "Nincs Víz Ezért Nem Lehet Lehúzni A WC-t",
        image: "assets/card/15.png",
        type: "supporter",
        description: "Meggyújtja az ellenfelet (Égés).",
        action: { type: "status", effect: "burn" },
        maxHp: 50,
        attacks: []
    },
    {
        id: "card_16",
        name: "Kutya Kula Csapda",
        image: "assets/card/16.png",
        type: "item",
        description: "Elvesz 2 AP-t az ellenféltől.",
        action: { type: "ap_drain", amount: 2 },
        maxHp: 50,
        attacks: []
    },
    {
        id: "card_17",
        name: "Nicili Fusion",
        image: "assets/card/17.png",
        maxHp: 330,
        attacks: [
            { name: "Fúziós Adrenalin", type: "heal", healAmount: 60, cost: 2, accuracy: 1.0 },
            { name: "Gigabob-Roham", type: "dmg", dmg: 180, cost: 3, accuracy: 0.6 },
            { name: "Kozmikus Gál-zuhatag", type: "dmg", dmg: 260, cost: 3, accuracy: 0.5 },
            { name: "Fúziós Pajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_18",
        name: "Gábori Pagoda",
        image: "assets/card/18.png",
        maxHp: 160,
        attacks: [
            { name: "Villogó Bádog", type: "dmg", dmg: 50, cost: 1, effect: "paralyze", accuracy: 0.8 },
            { name: "Pagoda-csapás", type: "dmg", dmg: 130, cost: 3, accuracy: 0.7 },
            { name: "Álcázó Tető", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Kozmikus Erőtér", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_19",
        name: "Tüzes Cserebogár VMAX",
        image: "assets/card/19.png",
        maxHp: 330,
        attacks: [
            { name: "Tűzvihar-lehelet", type: "dmg", dmg: 40, cost: 2, effect: "burn", accuracy: 0.9 },
            { name: "Kemence-harag", type: "dmg", dmg: 240, cost: 4, accuracy: 0.5 },
            { name: "VMAX Kitartás", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Izzó Páncél", type: "dmg", dmg: 60, cost: 2, accuracy: 0.8 }
        ]
    },
    {
        id: "card_20",
        name: "Alkoholizmus A Dézsában",
        image: "assets/card/20.png",
        maxHp: 169,
        attacks: [
            { name: "Dézsa-Gőz Sokk", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Sokkos Tekintet", type: "dmg", dmg: 20, cost: 1, accuracy: 0.9 },
            { name: "Kozmikus Pofon-Zuhany", type: "dmg", dmg: 120, cost: 3, accuracy: 0.7 },
            { name: "Gőzös Regeneráció", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_21",
        name: "Vízi Bence",
        image: "assets/card/21.png",
        maxHp: 169,
        attacks: [
            { name: "Kozmikus Buborék-sokk", type: "dmg", dmg: 120, cost: 3, accuracy: 0.7 },
            { name: "Buborékcsapda", type: "dmg", dmg: 40, cost: 1, effect: "paralyze", accuracy: 0.9 },
            { name: "Mélytengeri Gyógyulás", type: "heal", healAmount: 60, cost: 2, accuracy: 1.0 },
            { name: "Víz-pajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_22",
        name: "Orgia A Dézsában",
        image: "assets/card/22.png",
        maxHp: 169,
        attacks: [
            { name: "Dézsa-Ordítás", type: "dmg", dmg: 40, cost: 1, effect: "paralyze", accuracy: 0.9 },
            { name: "Kozmikus Dézsa-Tsunami", type: "dmg", dmg: 100, cost: 3, accuracy: 0.7 },
            { name: "Dézsa-Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Vizes Tisztulás", type: "heal", healAmount: 30, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_23",
        name: "Szivárvány",
        image: "assets/card/23.png",
        maxHp: 160,
        attacks: [
            { name: "Szivárvány Fény", type: "dmg", dmg: 50, cost: 1, effect: "paralyze", accuracy: 0.8 },
            { name: "Pagoda-csapás", type: "dmg", dmg: 130, cost: 3, accuracy: 0.7 },
            { name: "Ragyogás", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 },
            { name: "Fénytörés", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_24",
        name: "Toyota Verso",
        image: "assets/card/24.png",
        maxHp: 160,
        attacks: [
            { name: "Gazdaságos Út", type: "dmg", dmg: 50, cost: 1, accuracy: 0.8 },
            { name: "Családi Szállítás", type: "dmg", dmg: 130, cost: 3, accuracy: 0.7 },
            { name: "Dízelerő", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Tankolás", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_25",
        name: "Bromance",
        image: "assets/card/25.png",
        maxHp: 220,
        attacks: [
            { name: "Összefogás", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 },
            { name: "Szilárd Váll", type: "dmg", dmg: 90, cost: 3, accuracy: 0.7 },
            { name: "Örök Barátság", type: "dmg", dmg: 180, cost: 4, accuracy: 0.6 },
            { name: "Egymásért Pajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_26",
        name: "Pók Benó",
        image: "assets/card/26.png",
        maxHp: 160,
        attacks: [
            { name: "Zseniális Hálózat", type: "heal", healAmount: 60, cost: 3, accuracy: 1.0 },
            { name: "Szikla-Szcramble", type: "dmg", dmg: 50, cost: 2, accuracy: 0.8 },
            { name: "Háló-Betiprás", type: "dmg", dmg: 130, cost: 4, accuracy: 0.7 },
            { name: "Háló-Pajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_27",
        name: "Bénó Ragu",
        image: "assets/card/27.png",
        maxHp: 160,
        attacks: [
            { name: "Tartalmas Kavarás", type: "dmg", dmg: 50, cost: 1, accuracy: 0.8 },
            { name: "Bénó Hatás: Fingat", type: "dmg", dmg: 130, cost: 3, effect: "paralyze", accuracy: 0.7 },
            { name: "Séf Szabály", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Felforrás", type: "dmg", dmg: 30, cost: 1, effect: "burn", accuracy: 0.9 }
        ]
    },
    {
        id: "card_28",
        name: "Ai Doll",
        image: "assets/card/28.png",
        maxHp: 160,
        attacks: [
            { name: "Nézéssel Fagyasztó", type: "dmg", dmg: 80, cost: 2, accuracy: 0.8 },
            { name: "Generatív Romlás", type: "dmg", dmg: 120, cost: 3, accuracy: 0.7 },
            { name: "Digitális Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Adat-helyreállítás", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_29",
        name: "Náthás Kutató",
        image: "assets/card/29.png",
        maxHp: 160,
        attacks: [
            { name: "Csiped-csípős Csapás", type: "dmg", dmg: 60, cost: 1, accuracy: 0.8 },
            { name: "Náthás Nyomás", type: "dmg", dmg: 130, cost: 3, accuracy: 0.7 },
            { name: "Zsebkendő Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Vírus Terjesztés", type: "dmg", dmg: 20, cost: 1, effect: "burn", accuracy: 0.9 }
        ]
    },
    {
        id: "card_30",
        name: "István",
        image: "assets/card/30.png",
        maxHp: 160,
        attacks: [
            { name: "Mélyremenő Melegítés", type: "dmg", dmg: 80, cost: 3, accuracy: 0.8 },
            { name: "Összefüggő Gondolat", type: "dmg", dmg: 120, cost: 3, accuracy: 0.7 },
            { name: "Megfontolt Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Gondolati Erő", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_31",
        name: "Sárkány Cili",
        image: "assets/card/31.png",
        maxHp: 160,
        attacks: [
            { name: "Forgó Energia Mező", type: "dmg", dmg: 80, cost: 3, accuracy: 0.8 },
            { name: "Spirál Szél-Támadás", type: "dmg", dmg: 80, cost: 3, accuracy: 0.8 },
            { name: "Pikkely-pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Sárkány-lehelet", type: "dmg", dmg: 40, cost: 2, effect: "burn", accuracy: 0.9 }
        ]
    },
    {
        id: "card_32",
        name: "Mészáros",
        image: "assets/card/32.png",
        maxHp: 160,
        attacks: [
            { name: "Tudat-törlő Támadás", type: "dmg", dmg: 40, hits: 2, cost: 2, effect: "paralyze", accuracy: 0.9 },
            { name: "Árnyék Csapolás", type: "dmg", dmg: 80, hits: 1, cost: 2, effect: "lifesteal", accuracy: 0.8 },
            { name: "Sötét Paktum", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 },
            { name: "Árny-Pajzs", type: "shield", cost: 1, accuracy: 1.0 }
        ]
    },
    {
        id: "card_33",
        name: "All-Covering Pollen",
        image: "assets/card/33.png",
        maxHp: 160,
        attacks: [
            { name: "Mérgező Spórák", type: "dmg", dmg: 80, cost: 2, effect: "poison", accuracy: 0.8 },
            { name: "Generatív Fulladás", type: "dmg", dmg: 80, cost: 2, effect: "paralyze", accuracy: 0.8 },
            { name: "Folyondár Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Fotoszintézis", type: "heal", healAmount: 60, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_34",
        name: "Gengszter Niki",
        image: "assets/card/34.png",
        maxHp: 300,
        attacks: [
            { name: "Álner Védő", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Brigád Támadás", type: "dmg", dmg: 160, cost: 3, accuracy: 0.6 },
            { name: "Gengszter Csapás", type: "dmg", dmg: 240, cost: 3, accuracy: 0.5 },
            { name: "Brigád Segély", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_35",
        name: "Csere Géza",
        image: "assets/card/35.png",
        maxHp: 300,
        attacks: [
            { name: "Gyűjtői Szenvedély", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Ritkaság Változás", type: "dmg", dmg: 160, cost: 4, accuracy: 0.6 },
            { name: "Amisz Csapás", type: "dmg", dmg: 240, cost: 4, accuracy: 0.5 },
            { name: "Ritka Gyógyír", type: "heal", healAmount: 60, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_36",
        name: "Kedves Gergő",
        image: "assets/card/36.png",
        maxHp: 160,
        attacks: [
            { name: "Kedves De Erős", type: "dmg", dmg: 50, cost: 1, accuracy: 0.8 },
            { name: "Brigád Támadás Gengszter Csapás", type: "dmg", dmg: 240, cost: 4, accuracy: 0.5 },
            { name: "Kedves Pajzs", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Segítő Kéz", type: "heal", healAmount: 40, cost: 2, accuracy: 1.0 }
        ]
    },
    {
        id: "card_37",
        name: "Elfogy a Benzin",
        image: "assets/card/37.png",
        maxHp: 160,
        attacks: [
            { name: "Brigád Támadás", type: "dmg", dmg: 160, cost: 4, accuracy: 0.6 },
            { name: "Gengszter Csapás", type: "dmg", dmg: 100, cost: 3, effect: "paralyze", accuracy: 0.7 },
            { name: "Kétfutásos Terv", type: "shield", cost: 1, accuracy: 1.0 },
            { name: "Kannás Utántöltés", type: "heal", healAmount: 50, cost: 2, accuracy: 1.0 }
        ]
    }
];
