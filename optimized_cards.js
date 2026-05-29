/*
📊 SZIMULÁCIÓS TERV:
  1. Fázis: 100 pop, 100 gen, 50 meccs
  2. Fázis: 100 pop, 1000 gen, 500 meccs
--------------------------------------------------

✅ 1. FÁZIS VÉGEREDMÉNY:
⚙️ Beállítások: Fázis 1 | Pop: 100 | Meccsek: 50

🏆 Új legjobb variáció megtalálva (Generáció: 83)!
Fitness: -0.0857 (+0.001802)
  ├─ Balance Score: -0.0795 (Winrate eltérés)
  └─ Turn Penalty:  -0.0063 (Hossz büntetés)

📊 Átlagos Winrate eltérés: 7.95%
📉 Winrate tartomány: 16.7% - 72.2% (Diff: 55.56%)
⏱️ Átlagos meccs hossz: 49.4 kör (Cél: 50)
🔄 Összes lejátszott meccs: 414 050

Kártya Statisztikák (Winrate szerint):
 WR %  |  W/M    | Név (ID)
-------|---------|----------------------
 72.2% |  13/18  | Mészáros (card_32)
 71.4% |  10/14  | Barna Medve (card_10)
 69.2% |   9/13  | Gábori Pagoda (card_18)
 64.7% |  11/17  | Elfogy a Benzin (card_37)
 61.1% |  11/18  | Ai Doll (card_28)
 57.9% |  11/19  | All-Covering Pollen (card_33)
 57.1% |   8/14  | Tüzes Cserebogár VMAX (card_19)
 56.5% |  13/23  | Náthás Kutató (card_29)
 55.6% |  10/18  | Chin-Gaze (card_2)
 54.5% |   6/11  | Pók Benó (card_26)
 53.3% |   8/15  | Toyota Verso (card_24)
 52.9% |   9/17  | Vakító Ordítás (card_5)
 50.0% |   3/6   | Chin-Gaze (card_1)
 50.0% |   7/14  | Cskiló Fény-Világ (card_4)
 50.0% |   6/12  | Éjszakai Vadász (card_8)
 50.0% |   5/10  | Gábori Trükkmester (card_9)
 50.0% |   7/14  | Nicili Fusion (card_17)
 50.0% |   8/16  | Bromance (card_25)
 50.0% |   9/18  | Bénó Ragu (card_27)
 50.0% |   6/12  | István (card_30)
 47.1% |   8/17  | Sárkány Cili (card_31)
 46.7% |   7/15  | Tudó Villám (card_6)
 46.7% |   7/15  | Orgia A Dézsában (card_22)
 45.5% |   5/11  | Üvöltő Villám (card_3)
 44.4% |   8/18  | Alkoholizmus A Dézsában (card_20)
 43.8% |   7/16  | Thievery Corp (card_7)
 42.9% |   6/14  | Gólya (card_13)
 40.0% |   8/20  | Lángoló Tok (card_0)
 38.5% |   5/13  | Csere Géza (card_35)
 35.7% |   5/14  | Vízi Bence (card_21)
 33.3% |   6/18  | Szivárvány (card_23)
 33.3% |   6/18  | Kedves Gergő (card_36)
 16.7% |   2/12  | Gengszter Niki (card_34)
==================================================

⚙️ Beállítások: Fázis 2 | Pop: 100 | Meccsek: 500

🏆 Új legjobb variáció megtalálva (Generáció: 236)!
Fitness: -0.0355 (+0.007605)
  ├─ Balance Score: -0.0353 (Winrate eltérés)
  └─ Turn Penalty:  -0.0002 (Hossz büntetés)

📊 Átlagos Winrate eltérés: 3.53%
📉 Winrate tartomány: 37.2% - 59.8% (Diff: 22.64%)
⏱️ Átlagos meccs hossz: 49.9 kör (Cél: 50)
🔄 Összes lejátszott meccs: 6 798 580

Kártya Statisztikák (Winrate szerint):
 WR %  |  W/M    | Név (ID)
-------|---------|----------------------
 59.8% |  79/132 | Vakító Ordítás (card_5)
 59.7% |  80/134 | Gengszter Niki (card_34)
 55.7% |  88/158 | Éjszakai Vadász (card_8)
 55.6% |  79/142 | Vízi Bence (card_21)
 55.5% |  81/146 | Üvöltő Villám (card_3)
 53.7% |  88/164 | Mészáros (card_32)
 53.6% |  74/138 | Tüzes Cserebogár VMAX (card_19)
 53.1% |  85/160 | Alkoholizmus A Dézsában (card_20)
 52.8% |  85/161 | All-Covering Pollen (card_33)
 52.7% |  77/146 | Lángoló Tok (card_0)
 52.7% |  89/169 | Thievery Corp (card_7)
 51.9% |  84/162 | Cskiló Fény-Világ (card_4)
 51.5% |  85/165 | Toyota Verso (card_24)
 50.7% |  77/152 | Pók Benó (card_26)
 50.3% |  73/145 | Tudó Villám (card_6)
 50.3% |  78/155 | Bénó Ragu (card_27)
 49.7% |  71/143 | Gólya (card_13)
 49.4% |  80/162 | Chin-Gaze (card_1)
 49.3% |  75/152 | Orgia A Dézsában (card_22)
 49.3% |  69/140 | Chin-Gaze (card_2)
 49.0% |  75/153 | István (card_30)
 48.5% |  80/165 | Csere Géza (card_35)
 48.5% |  79/163 | Nicili Fusion (card_17)
 48.3% |  71/147 | Gábori Pagoda (card_18)
 47.8% |  65/136 | Kedves Gergő (card_36)
 47.7% |  74/155 | Szivárvány (card_23)
 47.6% |  68/143 | Gábori Trükkmester (card_9)
 46.2% |  73/158 | Bromance (card_25)
 45.5% |  65/143 | Barna Medve (card_10)
 44.7% |  63/141 | Sárkány Cili (card_31)
 43.3% |  65/150 | Náthás Kutató (card_29)
 41.2% |  61/148 | Ai Doll (card_28)
 37.2% |  64/172 | Elfogy a Benzin (card_37)

--- Időközi Mérföldkövek (10 generációnként) ---
📍 [330. Gen] Fitness (Gen/Max): -0.0525 / -0.0355 | WR: 4.72% | Körök: 49.5
📍 [320. Gen] Fitness (Gen/Max): -0.0520 / -0.0355 | WR: 5.16% | Körök: 50.1
📍 [310. Gen] Fitness (Gen/Max): -0.0505 / -0.0355 | WR: 5.03% | Körök: 50.1
📍 [300. Gen] Fitness (Gen/Max): -0.0491 / -0.0355 | WR: 4.18% | Körök: 49.4
📍 [290. Gen] Fitness (Gen/Max): -0.0435 / -0.0355 | WR: 4.33% | Körök: 49.9
📍 [280. Gen] Fitness (Gen/Max): -0.0482 / -0.0355 | WR: 4.79% | Körök: 50.1
📍 [270. Gen] Fitness (Gen/Max): -0.0459 / -0.0355 | WR: 4.58% | Körök: 50.1
📍 [260. Gen] Fitness (Gen/Max): -0.0461 / -0.0355 | WR: 3.81% | Körök: 50.6
📍 [250. Gen] Fitness (Gen/Max): -0.0499 / -0.0355 | WR: 4.37% | Körök: 50.6
📍 [240. Gen] Fitness (Gen/Max): -0.0470 / -0.0355 | WR: 4.62% | Körök: 50.2
📍 [230. Gen] Fitness (Gen/Max): -0.0467 / -0.0431 | WR: 4.58% | Körök: 50.2
📍 [220. Gen] Fitness (Gen/Max): -0.0520 / -0.0431 | WR: 4.54% | Körök: 50.6
📍 [210. Gen] Fitness (Gen/Max): -0.0498 / -0.0431 | WR: 4.96% | Körök: 50.1
📍 [200. Gen] Fitness (Gen/Max): -0.0529 / -0.0445 | WR: 5.28% | Körök: 50.1
📍 [190. Gen] Fitness (Gen/Max): -0.0515 / -0.0445 | WR: 4.90% | Körök: 50.4
📍 [180. Gen] Fitness (Gen/Max): -0.0482 / -0.0445 | WR: 4.69% | Körök: 49.7
📍 [170. Gen] Fitness (Gen/Max): -0.0464 / -0.0448 | WR: 4.42% | Körök: 49.7
📍 [160. Gen] Fitness (Gen/Max): -0.0542 / -0.0448 | WR: 5.42% | Körök: 50.0
⭐ [150. Gen] Fitness (Gen/Max): -0.0448 / -0.0448 | WR: 4.41% | Körök: 49.8
📍 [140. Gen] Fitness (Gen/Max): -0.0550 / -0.0531 | WR: 5.24% | Körök: 50.4
📍 [130. Gen] Fitness (Gen/Max): -0.0643 / -0.0546 | WR: 5.97% | Körök: 49.5
📍 [120. Gen] Fitness (Gen/Max): -0.0655 / -0.0598 | WR: 6.50% | Körök: 49.8
📍 [110. Gen] Fitness (Gen/Max): -0.0617 / -0.0604 | WR: 5.98% | Körök: 50.3
📍 --- 2. FÁZIS INDUL ---
📍 [100. Gen] Fitness (Gen/Max): -0.0946 / -0.0857 | WR: 9.46% | Körök: 50.0
📍 [90. Gen] Fitness (Gen/Max): -0.1129 / -0.0857 | WR: 11.09% | Körök: 50.3
📍 [80. Gen] Fitness (Gen/Max): -0.1061 / -0.0875 | WR: 10.51% | Körök: 50.2
📍 [70. Gen] Fitness (Gen/Max): -0.1115 / -0.0892 | WR: 11.01% | Körök: 49.7
📍 [60. Gen] Fitness (Gen/Max): -0.1089 / -0.0892 | WR: 10.12% | Körök: 50.6
📍 [50. Gen] Fitness (Gen/Max): -0.1070 / -0.0948 | WR: 9.48% | Körök: 49.2
📍 [40. Gen] Fitness (Gen/Max): -0.1043 / -0.0948 | WR: 10.43% | Körök: 50.0
⭐ [30. Gen] Fitness (Gen/Max): -0.1004 / -0.1004 | WR: 9.37% | Körök: 49.4
📍 [20. Gen] Fitness (Gen/Max): -0.1226 / -0.1010 | WR: 10.92% | Körök: 50.8
📍 [10. Gen] Fitness (Gen/Max): -0.1107 / -0.1090 | WR: 9.92% | Körök: 49.2
*/

const optimizedCardOverrides = {
    "card_0": {
        "maxHp": 90,
        "attacks": [
            {
                "dmg": 16,
                "hits": 2,
                "cost": 0,
                "accuracy": 0.8800883817214288
            },
            {
                "dmg": 10,
                "hits": 1,
                "cost": 2,
                "accuracy": 0.7808715992602456
            },
            {
                "dmg": 44,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.8640224276916786
            },
            {
                "cost": 3,
                "accuracy": 0.8901127956735106
            }
        ]
    },
    "card_1": {
        "maxHp": 70,
        "attacks": [
            {
                "dmg": 11,
                "hits": 3,
                "cost": 0,
                "accuracy": 1
            },
            {
                "dmg": 19,
                "hits": 3,
                "cost": 3,
                "accuracy": 1
            },
            {
                "healAmount": 55,
                "cost": 1,
                "accuracy": 1
            },
            {
                "cost": 6,
                "accuracy": 0.9024057863650145
            }
        ]
    },
    "card_2": {
        "maxHp": 70,
        "attacks": [
            {
                "cost": 4,
                "accuracy": 0.9186259806112577
            },
            {
                "dmg": 44,
                "hits": 4,
                "cost": 6,
                "accuracy": 0.8468641458867936
            },
            {
                "dmg": 40,
                "hits": 2,
                "cost": 3,
                "accuracy": 0.9194023638350378
            },
            {
                "healAmount": 90,
                "cost": 3,
                "accuracy": 0.9125622313113564
            }
        ]
    },
    "card_3": {
        "maxHp": 120,
        "attacks": [
            {
                "dmg": 36,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.923001733904965
            },
            {
                "dmg": 14,
                "hits": 2,
                "cost": 6,
                "accuracy": 0.8969372372843252
            },
            {
                "dmg": 13,
                "hits": 3,
                "cost": 0,
                "accuracy": 0.9489808686063945
            },
            {
                "healAmount": 60,
                "cost": 2,
                "accuracy": 0.921279985127206
            }
        ]
    },
    "card_4": {
        "maxHp": 120,
        "attacks": [
            {
                "dmg": 67,
                "hits": 1,
                "cost": 3,
                "accuracy": 0.8823910869496284
            },
            {
                "dmg": 148,
                "hits": 1,
                "cost": 2,
                "accuracy": 0.6791584004426521
            },
            {
                "dmg": 10,
                "hits": 1,
                "cost": 2,
                "accuracy": 0.9267374516182528
            },
            {
                "cost": 3,
                "accuracy": 0.984348385868876
            }
        ]
    },
    "card_5": {
        "maxHp": 130,
        "attacks": [
            {
                "dmg": 44,
                "hits": 2,
                "cost": 2,
                "accuracy": 0.8758895767748821
            },
            {
                "dmg": 105,
                "hits": 4,
                "cost": 1,
                "accuracy": 0.6834720530767201
            },
            {
                "cost": 0,
                "accuracy": 0.6533655818504791
            },
            {
                "dmg": 14,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.9511294071921503
            }
        ]
    },
    "card_6": {
        "maxHp": 130,
        "attacks": [
            {
                "cost": 1,
                "accuracy": 0.8436614715758892
            },
            {
                "dmg": 25,
                "hits": 2,
                "cost": 1,
                "accuracy": 0.7789262698960709
            },
            {
                "dmg": 151,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.574001304805183
            },
            {
                "healAmount": 22,
                "cost": 0,
                "accuracy": 0.9086070491903808
            }
        ]
    },
    "card_7": {
        "maxHp": 130,
        "attacks": [
            {
                "healAmount": 10,
                "cost": 1,
                "accuracy": 0.870123629391647
            },
            {
                "dmg": 36,
                "hits": 3,
                "cost": 0,
                "accuracy": 0.7655035214623592
            },
            {
                "dmg": 107,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.6509186937534698
            },
            {
                "cost": 4,
                "accuracy": 0.9293321427687288
            }
        ]
    },
    "card_8": {
        "maxHp": 130,
        "attacks": [
            {
                "dmg": 22,
                "hits": 2,
                "cost": 1,
                "accuracy": 0.893476559127798
            },
            {
                "dmg": 110,
                "hits": 3,
                "cost": 1,
                "accuracy": 0.6650357402989433
            },
            {
                "cost": 5,
                "accuracy": 1
            },
            {
                "healAmount": 31,
                "cost": 0,
                "accuracy": 0.8787066937409301
            }
        ]
    },
    "card_9": {
        "maxHp": 50,
        "attacks": [
            {
                "dmg": 23,
                "hits": 3,
                "cost": 0,
                "accuracy": 0.722956343878937
            },
            {
                "dmg": 23,
                "hits": 3,
                "cost": 6,
                "accuracy": 0.8897148987678056
            },
            {
                "cost": 6,
                "accuracy": 0.757833385364447
            },
            {
                "healAmount": 35,
                "cost": 3,
                "accuracy": 0.9419048140653872
            }
        ]
    },
    "card_10": {
        "maxHp": 120,
        "attacks": [
            {
                "dmg": 51,
                "hits": 1,
                "cost": 4,
                "accuracy": 1
            },
            {
                "dmg": 73,
                "hits": 2,
                "cost": 4,
                "accuracy": 0.8910167703649468
            },
            {
                "cost": 3,
                "accuracy": 0.9017730566179991
            },
            {
                "healAmount": 73,
                "cost": 6,
                "accuracy": 0.9772663470133737
            }
        ]
    },
    "card_13": {
        "maxHp": 110,
        "attacks": [
            {
                "dmg": 52,
                "hits": 1,
                "cost": 0,
                "accuracy": 0.7230620969912696
            },
            {
                "dmg": 57,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.7300102425402794
            },
            {
                "healAmount": 43,
                "cost": 4,
                "accuracy": 0.8910648033819346
            },
            {
                "cost": 1,
                "accuracy": 0.9710440855768885
            }
        ]
    },
    "card_17": {
        "maxHp": 330,
        "attacks": [
            {
                "healAmount": 69,
                "cost": 2,
                "accuracy": 0.8361016547988114
            },
            {
                "dmg": 170,
                "hits": 2,
                "cost": 3,
                "accuracy": 0.5211527304077773
            },
            {
                "dmg": 273,
                "hits": 4,
                "cost": 2,
                "accuracy": 0.5252244046773631
            },
            {
                "cost": 2,
                "accuracy": 0.73644463456388
            }
        ]
    },
    "card_18": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 81,
                "hits": 1,
                "cost": 2,
                "accuracy": 0.7798566074799045
            },
            {
                "dmg": 138,
                "hits": 4,
                "cost": 6,
                "accuracy": 0.7248365603020307
            },
            {
                "cost": 2,
                "accuracy": 1
            },
            {
                "healAmount": 31,
                "cost": 2,
                "accuracy": 1
            }
        ]
    },
    "card_19": {
        "maxHp": 330,
        "attacks": [
            {
                "dmg": 40,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.7398316581826879
            },
            {
                "dmg": 258,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.5420497739054372
            },
            {
                "cost": 2,
                "accuracy": 1
            },
            {
                "dmg": 59,
                "hits": 1,
                "cost": 0,
                "accuracy": 0.7221043076030562
            }
        ]
    },
    "card_20": {
        "maxHp": 169,
        "attacks": [
            {
                "cost": 5,
                "accuracy": 0.9911558242319894
            },
            {
                "dmg": 36,
                "hits": 1,
                "cost": 1,
                "accuracy": 0.9361789110767008
            },
            {
                "dmg": 107,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.7326786881101652
            },
            {
                "healAmount": 54,
                "cost": 3,
                "accuracy": 0.8893885021912515
            }
        ]
    },
    "card_21": {
        "maxHp": 169,
        "attacks": [
            {
                "dmg": 144,
                "hits": 3,
                "cost": 5,
                "accuracy": 0.8192722322254573
            },
            {
                "dmg": 10,
                "cost": 0,
                "accuracy": 0.8955160733321792,
                "hits": 3
            },
            {
                "healAmount": 61,
                "cost": 0,
                "accuracy": 0.8257369504695429
            },
            {
                "cost": 5,
                "accuracy": 1
            }
        ]
    },
    "card_22": {
        "maxHp": 169,
        "attacks": [
            {
                "dmg": 39,
                "hits": 1,
                "cost": 3,
                "accuracy": 0.8942920542476416
            },
            {
                "dmg": 88,
                "hits": 4,
                "cost": 2,
                "accuracy": 0.6102795295782124
            },
            {
                "cost": 0,
                "accuracy": 1
            },
            {
                "healAmount": 33,
                "cost": 1,
                "accuracy": 0.8136765397954605
            }
        ]
    },
    "card_23": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 40,
                "hits": 3,
                "cost": 2,
                "accuracy": 0.5897410499071265
            },
            {
                "dmg": 155,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.5
            },
            {
                "healAmount": 64,
                "cost": 4,
                "accuracy": 0.958526270614676
            },
            {
                "cost": 1,
                "accuracy": 0.9542325589989885
            }
        ]
    },
    "card_24": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 61,
                "hits": 2,
                "cost": 1,
                "accuracy": 0.746883281298794
            },
            {
                "dmg": 174,
                "hits": 4,
                "cost": 5,
                "accuracy": 0.5179293921555465
            },
            {
                "cost": 1,
                "accuracy": 0.924415406531768
            },
            {
                "healAmount": 82,
                "cost": 5,
                "accuracy": 0.9875419476135738
            }
        ]
    },
    "card_25": {
        "maxHp": 220,
        "attacks": [
            {
                "healAmount": 71,
                "cost": 4,
                "accuracy": 1
            },
            {
                "dmg": 66,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.8700587660812943
            },
            {
                "dmg": 177,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.6905985657766864
            },
            {
                "cost": 6,
                "accuracy": 1
            }
        ]
    },
    "card_26": {
        "maxHp": 160,
        "attacks": [
            {
                "healAmount": 35,
                "cost": 2,
                "accuracy": 0.8447840664443971
            },
            {
                "dmg": 61,
                "hits": 1,
                "cost": 0,
                "accuracy": 0.668745761652816
            },
            {
                "dmg": 144,
                "hits": 2,
                "cost": 5,
                "accuracy": 0.8128823735722204
            },
            {
                "cost": 6,
                "accuracy": 0.6783446695218921
            }
        ]
    },
    "card_27": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 36,
                "hits": 2,
                "cost": 1,
                "accuracy": 0.9394695904832499
            },
            {
                "dmg": 117,
                "hits": 3,
                "cost": 6,
                "accuracy": 0.7351449064435212
            },
            {
                "cost": 4,
                "accuracy": 0.912455753936099
            },
            {
                "dmg": 29,
                "hits": 1,
                "cost": 1,
                "accuracy": 0.6355489596730713
            }
        ]
    },
    "card_28": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 82,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.6526277045601903
            },
            {
                "dmg": 106,
                "hits": 1,
                "cost": 3,
                "accuracy": 0.6018997382617197
            },
            {
                "cost": 6,
                "accuracy": 0.8708468730448868
            },
            {
                "healAmount": 54,
                "cost": 2,
                "accuracy": 0.8520246805063053
            }
        ]
    },
    "card_29": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 16,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.6795585597494184
            },
            {
                "dmg": 170,
                "hits": 3,
                "cost": 4,
                "accuracy": 0.7383655331410198
            },
            {
                "cost": 1,
                "accuracy": 0.8341635284779321
            },
            {
                "dmg": 61,
                "hits": 1,
                "cost": 3,
                "accuracy": 1
            }
        ]
    },
    "card_30": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 69,
                "hits": 1,
                "cost": 1,
                "accuracy": 0.9095057244790088
            },
            {
                "dmg": 123,
                "hits": 2,
                "cost": 5,
                "accuracy": 0.7787204709481926
            },
            {
                "cost": 5,
                "accuracy": 0.9694091885784686
            },
            {
                "healAmount": 45,
                "cost": 5,
                "accuracy": 0.9141150763014166
            }
        ]
    },
    "card_31": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 81,
                "hits": 4,
                "cost": 2,
                "accuracy": 0.5830991383946655
            },
            {
                "dmg": 67,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.8745007694631213
            },
            {
                "cost": 0,
                "accuracy": 0.9963837793782662
            },
            {
                "dmg": 19,
                "hits": 4,
                "cost": 2,
                "accuracy": 0.6035527585621383
            }
        ]
    },
    "card_32": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 29,
                "hits": 1,
                "cost": 6,
                "accuracy": 0.935219820594214
            },
            {
                "dmg": 97,
                "hits": 1,
                "cost": 2,
                "accuracy": 0.6349296822380583
            },
            {
                "healAmount": 61,
                "cost": 3,
                "accuracy": 0.9972164007059332
            },
            {
                "cost": 3,
                "accuracy": 1
            }
        ]
    },
    "card_33": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 83,
                "hits": 3,
                "cost": 3,
                "accuracy": 0.6079917824104548
            },
            {
                "dmg": 92,
                "hits": 4,
                "cost": 4,
                "accuracy": 0.8435495014035361
            },
            {
                "cost": 3,
                "accuracy": 0.9945558665179881
            },
            {
                "healAmount": 55,
                "cost": 2,
                "accuracy": 0.9645497228350588
            }
        ]
    },
    "card_34": {
        "maxHp": 300,
        "attacks": [
            {
                "cost": 0,
                "accuracy": 1
            },
            {
                "dmg": 152,
                "hits": 1,
                "cost": 5,
                "accuracy": 0.6041702228301242
            },
            {
                "dmg": 267,
                "hits": 4,
                "cost": 1,
                "accuracy": 0.5699842095388492
            },
            {
                "healAmount": 75,
                "cost": 3,
                "accuracy": 0.8387251156213946
            }
        ]
    },
    "card_35": {
        "maxHp": 300,
        "attacks": [
            {
                "cost": 2,
                "accuracy": 1
            },
            {
                "dmg": 174,
                "hits": 2,
                "cost": 4,
                "accuracy": 0.7036073928112954
            },
            {
                "dmg": 270,
                "hits": 1,
                "cost": 3,
                "accuracy": 0.5
            },
            {
                "healAmount": 50,
                "cost": 0,
                "accuracy": 0.8989166373103136
            }
        ]
    },
    "card_36": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 56,
                "hits": 4,
                "cost": 5,
                "accuracy": 1
            },
            {
                "dmg": 236,
                "hits": 2,
                "cost": 2,
                "accuracy": 0.5864064826998969
            },
            {
                "cost": 3,
                "accuracy": 0.9861912130477664
            },
            {
                "healAmount": 39,
                "cost": 2,
                "accuracy": 0.99616605953388
            }
        ]
    },
    "card_37": {
        "maxHp": 160,
        "attacks": [
            {
                "dmg": 163,
                "hits": 4,
                "cost": 6,
                "accuracy": 0.5469037643995539
            },
            {
                "dmg": 82,
                "hits": 2,
                "cost": 3,
                "accuracy": 0.5901186042825909
            },
            {
                "cost": 3,
                "accuracy": 1
            },
            {
                "healAmount": 22,
                "cost": 0,
                "accuracy": 1
            }
        ]
    }
};
