/*
📊 SZIMULÁCIÓS TERV:
  1. Fázis: 100 pop, 100 gen, 50 meccs
  2. Fázis: 100 pop, 1000 gen, 500 meccs
--------------------------------------------------

✅ 1. FÁZIS VÉGEREDMÉNY:
⚙️ Beállítások: Fázis 1 | Pop: 100 | Meccsek: 50

🏆 Új legjobb variáció megtalálva (Generáció: 40)!
Fitness: -0.0786 (+0.003764)
  ├─ Balance Score: -0.0740 (Winrate eltérés)
  └─ Turn Penalty:  -0.0046 (Hossz büntetés)

📊 Átlagos Winrate eltérés: 7.40%
📉 Winrate tartomány: 30.0% - 84.6% (Diff: 54.62%)
⏱️ Átlagos meccs hossz: 49.5 kör (Cél: 50)
🔄 Összes lejátszott meccs: 199 650

Kártya Statisztikák (Winrate szerint):
 WR %  |  W/M    | Név (ID)
-------|---------|----------------------
 84.6% |  11/13  | Vakító Ordítás (card_5)
 69.2% |   9/13  | Tudó Villám (card_6)
 61.5% |   8/13  | Thievery Corp (card_7)
 61.5% |   8/13  | Nicili Fusion (card_17)
 58.8% |  10/17  | Csere Géza (card_35)
 57.1% |   8/14  | Mészáros (card_32)
 54.5% |  12/22  | István (card_30)
 54.5% |   6/11  | Gengszter Niki (card_34)
 54.2% |  13/24  | Gólya (card_13)
 53.8% |   7/13  | Üvöltő Villám (card_3)
 53.8% |   7/13  | All-Covering Pollen (card_33)
 53.8% |   7/13  | Elfogy a Benzin (card_37)
 52.9% |   9/17  | Alkoholizmus A Dézsában (card_20)
 52.4% |  11/21  | Toyota Verso (card_24)
 52.2% |  12/23  | Vízi Bence (card_21)
 50.0% |   4/8   | Gábori Trükkmester (card_9)
 50.0% |   9/18  | Barna Medve (card_10)
 50.0% |   4/8   | Orgia A Dézsában (card_22)
 50.0% |   6/12  | Ai Doll (card_28)
 47.1% |   8/17  | Lángoló Tok (card_0)
 47.1% |   8/17  | Éjszakai Vadász (card_8)
 47.1% |   8/17  | Pók Benó (card_26)
 46.2% |   6/13  | Cskiló Fény-Világ (card_4)
 46.2% |   6/13  | Bénó Ragu (card_27)
 46.2% |   6/13  | Kedves Gergő (card_36)
 45.5% |  10/22  | Chin-Gaze (card_1)
 44.4% |   4/9   | Szivárvány (card_23)
 40.0% |   6/15  | Náthás Kutató (card_29)
 36.8% |   7/19  | Bromance (card_25)
 35.7% |   5/14  | Chin-Gaze (card_2)
 35.7% |   5/14  | Tüzes Cserebogár VMAX (card_19)
 33.3% |   7/21  | Gábori Pagoda (card_18)
 30.0% |   3/10  | Sárkány Cili (card_31)
==================================================

⚙️ Beállítások: Fázis 2 | Pop: 100 | Meccsek: 500

🏆 Új legjobb variáció megtalálva (Generáció: 394)!
Fitness: -0.0334 (+0.000315)
  ├─ Balance Score: -0.0330 (Winrate eltérés)
  └─ Turn Penalty:  -0.0004 (Hossz büntetés)

📊 Átlagos Winrate eltérés: 3.30%
📉 Winrate tartomány: 39.7% - 59.3% (Diff: 19.55%)
⏱️ Átlagos meccs hossz: 49.9 kör (Cél: 50)
🔄 Összes lejátszott meccs: 14 699 000

Kártya Statisztikák (Winrate szerint):
 WR %  |  W/M    | Név (ID)
-------|---------|----------------------
 59.3% |  83/140 | Tudó Villám (card_6)
 57.4% | 105/183 | Gábori Pagoda (card_18)
 55.9% |  90/161 | Mészáros (card_32)
 55.0% |  93/169 | Barna Medve (card_10)
 54.7% |  76/139 | Pók Benó (card_26)
 54.3% |  76/140 | Sárkány Cili (card_31)
 52.9% |  81/153 | Lángoló Tok (card_0)
 52.1% |  85/163 | István (card_30)
 52.1% |  73/140 | Tüzes Cserebogár VMAX (card_19)
 51.6% |  79/153 | Vakító Ordítás (card_5)
 51.6% |  79/153 | Gólya (card_13)
 51.5% |  86/167 | Thievery Corp (card_7)
 51.3% |  80/156 | Üvöltő Villám (card_3)
 51.0% |  76/149 | Orgia A Dézsában (card_22)
 50.7% |  75/148 | Vízi Bence (card_21)
 50.6% |  80/158 | Toyota Verso (card_24)
 50.6% |  82/162 | Gábori Trükkmester (card_9)
 50.0% |  74/148 | Bénó Ragu (card_27)
 50.0% |  74/148 | Csere Géza (card_35)
 50.0% |  85/170 | Kedves Gergő (card_36)
 49.3% |  66/134 | Náthás Kutató (card_29)
 48.9% |  66/135 | Chin-Gaze (card_2)
 48.4% |  77/159 | Éjszakai Vadász (card_8)
 47.8% |  64/134 | Chin-Gaze (card_1)
 46.7% |  79/169 | Alkoholizmus A Dézsában (card_20)
 46.7% |  77/165 | Nicili Fusion (card_17)
 46.3% |  68/147 | Cskiló Fény-Világ (card_4)
 46.1% |  70/152 | Elfogy a Benzin (card_37)
 44.9% |  57/127 | Szivárvány (card_23)
 44.4% |  67/151 | All-Covering Pollen (card_33)
 42.6% |  52/122 | Gengszter Niki (card_34)
 42.2% |  65/154 | Ai Doll (card_28)
 39.7% |  60/151 | Bromance (card_25)

--- Időközi Mérföldkövek (10 generációnként) ---
📍 [490. Gen] Fitness (Gen/Max): -0.0403 / -0.0334 | WR: 3.72% | Körök: 50.4
📍 [480. Gen] Fitness (Gen/Max): -0.0382 / -0.0334 | WR: 3.75% | Körök: 50.2
📍 [470. Gen] Fitness (Gen/Max): -0.0354 / -0.0334 | WR: 3.54% | Körök: 50.0
📍 [460. Gen] Fitness (Gen/Max): -0.0397 / -0.0334 | WR: 3.96% | Körök: 50.0
📍 [450. Gen] Fitness (Gen/Max): -0.0479 / -0.0334 | WR: 4.52% | Körök: 50.4
📍 [440. Gen] Fitness (Gen/Max): -0.0390 / -0.0334 | WR: 3.89% | Körök: 50.1
📍 [430. Gen] Fitness (Gen/Max): -0.0411 / -0.0334 | WR: 3.99% | Körök: 49.8
📍 [420. Gen] Fitness (Gen/Max): -0.0401 / -0.0334 | WR: 3.72% | Körök: 50.4
📍 [410. Gen] Fitness (Gen/Max): -0.0392 / -0.0334 | WR: 3.58% | Körök: 49.6
📍 [400. Gen] Fitness (Gen/Max): -0.0439 / -0.0334 | WR: 4.38% | Körök: 50.1
📍 [390. Gen] Fitness (Gen/Max): -0.0411 / -0.0337 | WR: 4.11% | Körök: 50.0
📍 [380. Gen] Fitness (Gen/Max): -0.0388 / -0.0337 | WR: 3.77% | Körök: 50.2
📍 [370. Gen] Fitness (Gen/Max): -0.0433 / -0.0337 | WR: 4.31% | Körök: 49.9
📍 [360. Gen] Fitness (Gen/Max): -0.0359 / -0.0337 | WR: 3.40% | Körök: 49.7
📍 [350. Gen] Fitness (Gen/Max): -0.0456 / -0.0337 | WR: 4.37% | Körök: 49.7
📍 [340. Gen] Fitness (Gen/Max): -0.0390 / -0.0337 | WR: 3.79% | Körök: 50.2
📍 [330. Gen] Fitness (Gen/Max): -0.0432 / -0.0337 | WR: 4.27% | Körök: 49.8
📍 [320. Gen] Fitness (Gen/Max): -0.0476 / -0.0337 | WR: 4.73% | Körök: 50.1
📍 [310. Gen] Fitness (Gen/Max): -0.0434 / -0.0337 | WR: 4.23% | Körök: 49.8
📍 [300. Gen] Fitness (Gen/Max): -0.0430 / -0.0337 | WR: 4.25% | Körök: 50.2
📍 [290. Gen] Fitness (Gen/Max): -0.0376 / -0.0350 | WR: 3.64% | Körök: 49.8
📍 [280. Gen] Fitness (Gen/Max): -0.0421 / -0.0371 | WR: 3.79% | Körök: 49.5
📍 [270. Gen] Fitness (Gen/Max): -0.0391 / -0.0375 | WR: 3.77% | Körök: 49.7
📍 [260. Gen] Fitness (Gen/Max): -0.0502 / -0.0375 | WR: 5.02% | Körök: 50.0
📍 [250. Gen] Fitness (Gen/Max): -0.0405 / -0.0375 | WR: 3.92% | Körök: 50.2
📍 [240. Gen] Fitness (Gen/Max): -0.0462 / -0.0375 | WR: 4.49% | Körök: 49.7
📍 [230. Gen] Fitness (Gen/Max): -0.0394 / -0.0375 | WR: 3.57% | Körök: 49.6
📍 [220. Gen] Fitness (Gen/Max): -0.0478 / -0.0375 | WR: 4.75% | Körök: 50.1
📍 [210. Gen] Fitness (Gen/Max): -0.0419 / -0.0394 | WR: 4.17% | Körök: 49.9
📍 [200. Gen] Fitness (Gen/Max): -0.0430 / -0.0411 | WR: 4.00% | Körök: 50.4
📍 [190. Gen] Fitness (Gen/Max): -0.0482 / -0.0411 | WR: 4.72% | Körök: 50.2
📍 [180. Gen] Fitness (Gen/Max): -0.0467 / -0.0411 | WR: 4.64% | Körök: 49.9
📍 [170. Gen] Fitness (Gen/Max): -0.0440 / -0.0411 | WR: 4.29% | Körök: 50.2
📍 [160. Gen] Fitness (Gen/Max): -0.0516 / -0.0459 | WR: 5.15% | Körök: 49.9
📍 [150. Gen] Fitness (Gen/Max): -0.0492 / -0.0459 | WR: 4.91% | Körök: 49.9
📍 [140. Gen] Fitness (Gen/Max): -0.0514 / -0.0472 | WR: 4.76% | Körök: 50.4
⭐ [130. Gen] Fitness (Gen/Max): -0.0495 / -0.0495 | WR: 4.95% | Körök: 50.0
📍 [120. Gen] Fitness (Gen/Max): -0.0531 / -0.0510 | WR: 5.28% | Körök: 50.1
📍 [110. Gen] Fitness (Gen/Max): -0.0589 / -0.0566 | WR: 5.87% | Körök: 50.1
📍 --- 2. FÁZIS INDUL ---
📍 [100. Gen] Fitness (Gen/Max): -0.0969 / -0.0786 | WR: 9.63% | Körök: 49.8
📍 [90. Gen] Fitness (Gen/Max): -0.0960 / -0.0786 | WR: 8.88% | Körök: 50.6
📍 [80. Gen] Fitness (Gen/Max): -0.1014 / -0.0786 | WR: 9.68% | Körök: 49.5
📍 [70. Gen] Fitness (Gen/Max): -0.1059 / -0.0786 | WR: 9.55% | Körök: 50.7
📍 [60. Gen] Fitness (Gen/Max): -0.1058 / -0.0786 | WR: 10.40% | Körök: 50.3
📍 [50. Gen] Fitness (Gen/Max): -0.0959 / -0.0786 | WR: 9.41% | Körök: 49.7
⭐ [40. Gen] Fitness (Gen/Max): -0.0786 / -0.0786 | WR: 7.40% | Körök: 49.5
📍 [30. Gen] Fitness (Gen/Max): -0.0896 / -0.0823 | WR: 8.61% | Körök: 50.4
📍 [20. Gen] Fitness (Gen/Max): -0.0955 / -0.0823 | WR: 9.54% | Körök: 50.1
📍 [10. Gen] Fitness (Gen/Max): -0.0980 / -0.0823 | WR: 9.54% | Körök: 49.6
*/

const optimizedCardOverrides = {
    "card_0": {
        "maxHp": 90,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 263,
                "hits": 4,
                "cost": 4,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 250,
                "hits": 4,
                "cost": 6,
                "accuracy": 0.7965744511072961
            },
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 62,
                "hits": 3,
                "cost": 2,
                "accuracy": 0.8971354828887074
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            }
        ]
    },
    "card_1": {
        "maxHp": 70,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 139,
                "hits": 3,
                "cost": 3,
                "accuracy": 0.9888795287400793
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 249,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.9726685491783083
            },
            {
                "type": "heal",
                "healAmount": 78,
                "cost": 6,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            }
        ]
    },
    "card_2": {
        "maxHp": 70,
        "attacks": [
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 259,
                "hits": 4,
                "cost": 6,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 247,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.8828086559799219
            },
            {
                "type": "heal",
                "healAmount": 83,
                "cost": 6,
                "accuracy": 1
            }
        ]
    },
    "card_3": {
        "maxHp": 120,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 253,
                "hits": 2,
                "cost": 5,
                "accuracy": 0.9479596836861366
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 121,
                "hits": 2,
                "cost": 3,
                "accuracy": 0.9569426208764182
            },
            {
                "type": "dmg",
                "dmg": 281,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.9696367837592125
            },
            {
                "type": "heal",
                "healAmount": 74,
                "cost": 2,
                "accuracy": 1
            }
        ]
    },
    "card_4": {
        "maxHp": 120,
        "attacks": [
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 40,
                "hits": 1,
                "cost": 1,
                "accuracy": 0.6690405691425224
            },
            {
                "type": "dmg",
                "dmg": 287,
                "hits": 2,
                "cost": 6,
                "accuracy": 0.77703778278091
            },
            {
                "type": "dmg",
                "dmg": 245,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.9372207817603755
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_5": {
        "maxHp": 130,
        "attacks": [
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 241,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.7480939904222746
            },
            {
                "type": "dmg",
                "dmg": 68,
                "hits": 3,
                "cost": 2,
                "accuracy": 0.9844651555834372
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 241,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.9270885848191607
            }
        ]
    },
    "card_6": {
        "maxHp": 130,
        "attacks": [
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 256,
                "hits": 3,
                "cost": 6,
                "accuracy": 0.9481261424123509
            },
            {
                "type": "dmg",
                "dmg": 27,
                "hits": 1,
                "cost": 0,
                "accuracy": 0.874992164114105
            },
            {
                "type": "heal",
                "healAmount": 82,
                "cost": 4,
                "accuracy": 1
            }
        ]
    },
    "card_7": {
        "maxHp": 130,
        "attacks": [
            {
                "type": "heal",
                "healAmount": 106,
                "cost": 3,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 34,
                "hits": 4,
                "cost": 1,
                "accuracy": 0.7993059396388985
            },
            {
                "type": "dmg",
                "dmg": 214,
                "hits": 4,
                "cost": 3,
                "accuracy": 0.5
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            }
        ]
    },
    "card_8": {
        "maxHp": 130,
        "attacks": [
            {
                "type": "dmg",
                "effect": "mark",
                "dmg": 270,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.9810069930044601
            },
            {
                "type": "dmg",
                "dmg": 199,
                "hits": 1,
                "cost": 3,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 12,
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_9": {
        "maxHp": 50,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 30,
                "hits": 3,
                "cost": 0,
                "accuracy": 0.8458324925902989
            },
            {
                "type": "dmg",
                "dmg": 246,
                "hits": 3,
                "cost": 6,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 74,
                "cost": 4,
                "accuracy": 1
            }
        ]
    },
    "card_10": {
        "maxHp": 120,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 28,
                "hits": 2,
                "cost": 0,
                "accuracy": 0.8003197264907835
            },
            {
                "type": "dmg",
                "dmg": 241,
                "hits": 2,
                "cost": 4,
                "accuracy": 0.9886746815487523
            },
            {
                "type": "shield",
                "effect": "counter",
                "cost": 2,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 73,
                "cost": 3,
                "accuracy": 1
            }
        ]
    },
    "card_13": {
        "maxHp": 110,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 194,
                "hits": 3,
                "cost": 3,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 245,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.9975571673211167
            },
            {
                "type": "heal",
                "healAmount": 73,
                "cost": 5,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_17": {
        "maxHp": 330,
        "attacks": [
            {
                "type": "heal",
                "healAmount": 76,
                "cost": 5,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 239,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.7577332181165244
            },
            {
                "type": "dmg",
                "dmg": 293,
                "hits": 2,
                "cost": 5,
                "accuracy": 0.7147177826255222
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            }
        ]
    },
    "card_18": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 256,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.9532377991785144
            },
            {
                "type": "dmg",
                "dmg": 283,
                "hits": 2,
                "cost": 5,
                "accuracy": 0.791160532975106
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 104,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_19": {
        "maxHp": 330,
        "attacks": [
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 240,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.9445502457514787
            },
            {
                "type": "dmg",
                "dmg": 256,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.5633129442353043
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 270,
                "hits": 2,
                "cost": 6,
                "accuracy": 0.8809209368343369
            }
        ]
    },
    "card_20": {
        "maxHp": 169,
        "attacks": [
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 249,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.771740837123873
            },
            {
                "type": "dmg",
                "dmg": 241,
                "hits": 3,
                "cost": 4,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 101,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_21": {
        "maxHp": 169,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 268,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.871456060359958
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 118,
                "hits": 4,
                "cost": 2,
                "accuracy": 0.8772013947149513
            },
            {
                "type": "heal",
                "healAmount": 91,
                "cost": 3,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            }
        ]
    },
    "card_22": {
        "maxHp": 169,
        "attacks": [
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 243,
                "hits": 2,
                "cost": 4,
                "accuracy": 0.9664083535698085
            },
            {
                "type": "dmg",
                "dmg": 291,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.9307488329450262
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 71,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_23": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 254,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.8511354254260134
            },
            {
                "type": "dmg",
                "dmg": 254,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.8491725657494701
            },
            {
                "type": "heal",
                "healAmount": 84,
                "cost": 6,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_24": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 318,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.8775127203394522
            },
            {
                "type": "dmg",
                "dmg": 267,
                "hits": 1,
                "cost": 4,
                "accuracy": 0.9387272833870763
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 76,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_25": {
        "maxHp": 220,
        "attacks": [
            {
                "type": "heal",
                "healAmount": 78,
                "cost": 4,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 245,
                "hits": 1,
                "cost": 4,
                "accuracy": 0.8594123738536836
            },
            {
                "type": "dmg",
                "dmg": 248,
                "hits": 3,
                "cost": 6,
                "accuracy": 0.6125699281059628
            },
            {
                "type": "shield",
                "cost": 2,
                "accuracy": 1
            }
        ]
    },
    "card_26": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "heal",
                "healAmount": 73,
                "cost": 4,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 263,
                "hits": 2,
                "cost": 4,
                "accuracy": 0.7832986482118918
            },
            {
                "type": "dmg",
                "dmg": 15,
                "hits": 2,
                "cost": 0,
                "accuracy": 0.9123604586581571
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_27": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 241,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.6935522378792441
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 238,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.9816765092940958
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 245,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.9050320252783646
            }
        ]
    },
    "card_28": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 34,
                "hits": 3,
                "cost": 1,
                "accuracy": 0.8527674201874514
            },
            {
                "type": "dmg",
                "dmg": 253,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.7477112960365657
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 30,
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_29": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 256,
                "hits": 2,
                "cost": 6,
                "accuracy": 0.8792429530240662
            },
            {
                "type": "dmg",
                "dmg": 252,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.7885861376484092
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 278,
                "hits": 2,
                "cost": 4,
                "accuracy": 0.764868267349254
            }
        ]
    },
    "card_30": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 139,
                "hits": 2,
                "cost": 2,
                "accuracy": 0.6070594521809896
            },
            {
                "type": "dmg",
                "dmg": 33,
                "hits": 2,
                "cost": 1,
                "accuracy": 0.6258677138075247
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 115,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_31": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 41,
                "hits": 2,
                "cost": 1,
                "accuracy": 0.5676512365198866
            },
            {
                "type": "dmg",
                "dmg": 243,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.8756268749525075
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "effect": "burn",
                "dmg": 237,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.8468729642345945
            }
        ]
    },
    "card_32": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 70,
                "hits": 1,
                "cost": 3,
                "accuracy": 0.9609425955252097
            },
            {
                "type": "dmg",
                "effect": "lifesteal",
                "dmg": 251,
                "hits": 2,
                "cost": 5,
                "accuracy": 0.8573111453040645
            },
            {
                "type": "heal",
                "healAmount": 100,
                "cost": 4,
                "accuracy": 1
            },
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            }
        ]
    },
    "card_33": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "effect": "poison",
                "dmg": 251,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.7233119857095635
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 259,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.8754314340041831
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 85,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_34": {
        "maxHp": 300,
        "attacks": [
            {
                "type": "shield",
                "cost": 0,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 250,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.5786927632027722
            },
            {
                "type": "dmg",
                "dmg": 255,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.7393052683006566
            },
            {
                "type": "heal",
                "healAmount": 73,
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_35": {
        "maxHp": 300,
        "attacks": [
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "dmg",
                "dmg": 244,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.9265515897577505
            },
            {
                "type": "dmg",
                "dmg": 247,
                "hits": 3,
                "cost": 6,
                "accuracy": 0.739244002285521
            },
            {
                "type": "heal",
                "healAmount": 92,
                "cost": 6,
                "accuracy": 1
            }
        ]
    },
    "card_36": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 36,
                "hits": 3,
                "cost": 0,
                "accuracy": 0.8966607264889311
            },
            {
                "type": "dmg",
                "dmg": 258,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.7179070558870569
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 72,
                "cost": 3,
                "accuracy": 1
            }
        ]
    },
    "card_37": {
        "maxHp": 160,
        "attacks": [
            {
                "type": "dmg",
                "dmg": 252,
                "hits": 3,
                "cost": 6,
                "accuracy": 0.8172894502932095
            },
            {
                "type": "dmg",
                "effect": "paralyze",
                "dmg": 236,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.9943351974684331
            },
            {
                "type": "shield",
                "cost": 1,
                "accuracy": 1
            },
            {
                "type": "heal",
                "healAmount": 24,
                "cost": 1,
                "accuracy": 1
            }
        ]
    }
};
