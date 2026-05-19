# Airtable Schema Migration — 2026-05-18

**Gammal bas:** `Musikglädjen (May 18, 2026)` (`appNCWbE6l3ANqtOE`)  
**Ny bas:** `Musikglädjen` (`app1l4NwAMtwlTIUC`)  
**Källa:** Verifierat direkt mot Airtable API 2026-05-19

---

## Övergripande sammanfattning

Det är inte enbart fältnamn som ändrats. Det är en strukturell schemamigrering:

- Platta fält i **Elev** och **Vårdnadshavare** har konsoliderats till JSON-fält
- Flera relationer har **bytt namn men behållit samma field ID** (kod som använder field ID klarar sig; kod som använder namn bryts)
- `Elev.Instrument` bytte **typ** från `singleLineText` till `multipleSelects` — kod måste skriva `string[]`, inte `string`
- `Elev.Ansökningsdag` bytte **typ** från `formula` till `createdTime` — är nu read-only
- `Matchningar` fick ett nytt fält `FörstaLektionAnteckning`
- `Lektioner` fick ett nytt lookup-fält `Lärare Namn`

---

## Tabell: Elev

**Table ID:** `tblAj4VVugqhdPWnR` (samma i båda baserna)

### Oförändrade fält

| Fält | Field ID | Typ |
|---|---|---|
| ID | fldxX24Faj0UDldZW | formula |
| Vårdnadshavare | fldxkFL79H43YScsc | multipleRecordLinks |
| Lärare | fldqzrvq31ZKShwFi | multipleRecordLinks |
| Namn | fldhdPPKPmku2jJym | singleLineText |
| Status | fldQivIk3EscVrpOg | singleSelect |
| NummerID | fld8QwcBDb08ngIt8 | autoNumber |
| Födelseår | fldtyHL3nuA8WK02D | singleLineText |
| Lektioner | fldj8qRGthJyTlbc2 | multipleRecordLinks |
| Onboarding status | fld7SW88CkejTQYZY | singleSelect |
| Matchningar | fldngERmA974LbGPN | multipleRecordLinks |
| Lektionstider | fldFGD8VuTOfvS6PW | multipleLookupValues |
| Händelser | fldq83WjfUqeNNNIN | multilineText |
| Uppehåll till | fld0uhmFojaKaGhkz | date |

### Namnändrade fält — samma field ID

Kod som använder fältnamn (t.ex. `fields["Önskar"]`) bryts. Kod som använder field ID klarar sig.

| Field ID | Gammalt namn | Nytt namn | Typ |
|---|---|---|---|
| fldXszVxwxqSgaJjo | Önskar | LärareÖnskar | multipleRecordLinks |
| flddTrZsYsnVbApXS | Anteckning till lärarkarta | LärarkartAnteckning | multilineText |
| fldhk8ttcMpQfxWc9 | Onboarding status changed at | OnboardingÄndringsdatum | dateTime |
| fldndBiMUoWAI1mz4 | Förslag | LärareFörslag | multipleRecordLinks |

### Typändrade fält — samma field ID — BREAKING

| Field ID | Fält | Gammal typ | Ny typ | Konsekvens |
|---|---|---|---|---|
| fld6WeKwTuGEVda1U | Instrument | singleLineText | multipleSelects | Kod måste skriva `[{ name: "Piano" }]` eller `string[]` beroende på API-format, inte `"Piano"` |
| fldGSJc2tX2McFuQh | Ansökningsdag | formula | createdTime | Read-only. Kod ska inte skriva hit. |

### Nya fält i ny bas

| Fält | Field ID | Typ | JSON-schema |
|---|---|---|---|
| Barn | fldF8leCYv6NK3EXb | multilineText | `[{"namn": "", "födelseår": "", "årkurs": "", "instrument": []}]` |
| Lektionsupplägg | fldU2BIH4aHpw1R8O | multilineText | `{"form": "", "längd": 0, "lektionstid": "", "reservtid": "", "terminsmål": "", "kommentar": ""}` |
| LärareÖnskarKommentar | fld4ju4lMaMU2vFsm | multilineText | Fritext |

### Borttagna fält

| Gammalt fält | Typ |
|---|---|
| Matchningsdag | lastModifiedTime |
| Radera | checkbox |
| Förnamn | singleLineText |
| Kommentar | multilineText |
| LärareRecordID | multipleLookupValues |
| Gata | multipleLookupValues |
| Gatunummer | multipleLookupValues |
| Ort | multipleLookupValues |
| Longitude | multipleLookupValues |
| Latitude | multipleLookupValues |
| Samtalsanteckningar | multipleLookupValues |
| Vårdnadshavare e-post | multipleLookupValues |
| Vårdnadshavare telefon | multipleLookupValues |
| Starttid | singleLineText |
| Göm från matchning | checkbox |
| ElevRecordID | formula |
| Lektionspris | multipleLookupValues |
| Matchningskommentar (intern) | multilineText |
| Datum genomförd (from Rapportering) | multipleLookupValues |
| Bokade lektioner | multipleLookupValues |
| Lektioner - Jan…Dec (12 fält) | multipleLookupValues |
| Lektionstid | singleLineText |
| Reservtid | singleLineText |
| Kundavtal | singleLineText |
| Lärare e-post | multipleLookupValues |
| Terminsmål | multilineText |
| Lärandematerial | multipleAttachments |
| ÖnskaKommentar | multilineText |
| Lärarens förnamn | multipleLookupValues |
| Kommentar till matchning | multilineText |
| Elevens erfarenhetsnivå | singleSelect |
| Kort om eleven (från anmälan) | multilineText |
| Sammansatt adress (from Vårdnadshavare) | multipleLookupValues |
| Lead score | singleLineText |
| Närmaste lärare | multipleRecordLinks |
| Närmaste jobbansökan | singleLineText |
| Jobbansökningar | singleLineText |
| Lärare 2 | multipleRecordLinks |
| Lärare 3 | multipleRecordLinks |
| Vårdnadshavare namn | multipleLookupValues |
| Jobbansökningar 2 | singleLineText |
| Egen anteckning | multilineText |
| Matchningsförslag | singleLineText |
| Notiser | singleLineText |
| Lektioner Genomförda | multipleLookupValues |
| Lektioner Inställda | multipleLookupValues |
| Lektioner Läxa | multipleLookupValues |
| Lektioner Anteckning | multipleLookupValues |
| Lektioner Payload | multipleLookupValues |
| Senast ändrat önskar | lastModifiedTime |

### Mappning

| Gammalt | Nytt |
|---|---|
| Önskar | LärareÖnskar (samma field ID) |
| Förslag | LärareFörslag (samma field ID) |
| Anteckning till lärarkarta | LärarkartAnteckning (samma field ID) |
| Onboarding status changed at | OnboardingÄndringsdatum (samma field ID) |
| Lektionstid | Lektionsupplägg.lektionstid |
| Reservtid | Lektionsupplägg.reservtid |
| Terminsmål | Lektionsupplägg.terminsmål |
| Kommentar | Lektionsupplägg.kommentar |
| Lektionsform (ej i Elev direkt) | Lektionsupplägg.form |
| Instrument (string) | Instrument (multipleSelects array) |
| Förnamn, Födelseår, Instrument per barn | Barn[*].namn, Barn[*].födelseår, Barn[*].instrument |

---

## Tabell: Vårdnadshavare

**Table ID:** `tblfYUEqhO9gtSQMh` (samma i båda baserna)

### Oförändrade fält

| Fält | Field ID | Typ |
|---|---|---|
| ID | fldLDfkkydiv8ioyH | formula |
| Namn | fldPAf9IBN4kUyVUn | singleLineText |
| NummerID | fldy0ub7JD6s7fOfg | autoNumber |
| Elev | fld9SX90dylYVMTCf | multipleRecordLinks |
| Lärare | flder1EKdOuLA9C5g | multipleLookupValues |
| Latitude | fld57ZFPdKPEg6xkG | number |
| Longitude | fldcwWdbJV6Du1i0o | number |
| Grundpris | fldyqjrP0VPKoLeJM | formula |
| Prisjustering | fldzmFbSBs57XosAA | number |
| Lektionspris | fldFr2IlZ3Otu1P8w | formula |
| Månadspris | fldLo6OFIZqnmfoyA | formula |
| Betalningssystem | fld5Xx3qG6puqSVOs | singleSelect |
| Fakturor | fldgOwBLV8DezhdQS | multipleRecordLinks |
| Bokio ID | fldkzZBXYsNTeA5rU | singleLineText |
| Ansökningsdag | fldHd3tvlCM2yqTxk | formula |

### Nya fält i ny bas — BREAKING för create/update

| Fält | Field ID | Typ | JSON-schema |
|---|---|---|---|
| Kontaktuppgifter | fldxOAeCt9zLNkFLL | multilineText | `{"epost": "", "telefon": "", "gata": "", "gatunummer": "", "postnummer": "", "ort": ""}` |
| Anmälningsinfo | flde9zyX5sZZYaC8D | multilineText | `{"hurSnart": "", "vadHoppas": [], "tillgangInstrument": "", "annatViBorVeta": "", "kommunikationspreferens": []}` |
| Anteckning | fldw3qDboPQAxwG6c | multilineText | Fritext. Ersätter Samtalsanteckning, Kommentar från första lektionen och Något annat vi bör veta? |
| Abonnemangsupplägg | fldg9hFFvSrndEflN | multilineText | `{"upplägg": "veckovis|varannan", "längd": 60}` |

### Borttagna fält

| Gammalt fält | Typ |
|---|---|
| Förnanmn (Vårdnadshavare) | formula |
| Elevnamn | singleLineText |
| Gata | singleLineText |
| Gatunummer | singleLineText |
| Ort | singleLineText |
| Postnummer | singleLineText |
| E-post | singleLineText |
| Telefon | phoneNumber |
| Lektionsform | singleSelect |
| Lektion längd | formula |
| RecordID | formula |
| Adress | formula |
| Lärare e-post (from Elev) | multipleLookupValues |
| Lärarens förnamn | multipleLookupValues |
| Kommentar | multipleLookupValues |
| Elevens födelseår | multipleLookupValues |
| Elevens förnamn | multipleLookupValues |
| Instrument | multipleLookupValues |
| Samtalsanteckning | multilineText |
| Kundnummer Stripe | singleLineText |
| Status | rollup |
| Matchningsdatum | multipleLookupValues |
| Sista bokade lektion | rollup |
| Lektionstid | singleLineText |
| Reservtid | singleLineText |
| Instrument - format | rollup |
| Första faktura skickades | lastModifiedTime |
| **Avtal status** | singleSelect |
| Första lektionen | date |
| Kommentar från första lektionen | multilineText |
| Anmälningskommentar (intern) | multilineText |
| Hur snart vill ni komma igång | singleSelect |
| Tillgång till instrument | singleSelect |
| Vad hoppas ni fått ut av undervisning | multipleSelects |
| Kommunikationspreferens | multipleSelects |
| Något annat vi bör veta? | multilineText |
| Elevens erfarenhetsnivå | multipleLookupValues |
| Kort om eleven (från anmälan) | multipleLookupValues |
| Radera | checkbox |
| Lead score | singleLineText |
| Sammansatt adress | formula |
| Skickat avtal | singleLineText |
| Notiser | singleLineText |
| Nya Fakturor | singleLineText |

> **Notering:** `Avtal status` är borttaget utan direkt ersättare. Affärslogik kopplad till detta fält kan ha tyst försvunnit — kontrollera vad som använde det.

### Mappning

| Gammalt | Nytt |
|---|---|
| E-post | Kontaktuppgifter.epost |
| Telefon | Kontaktuppgifter.telefon |
| Gata | Kontaktuppgifter.gata |
| Gatunummer | Kontaktuppgifter.gatunummer |
| Postnummer | Kontaktuppgifter.postnummer |
| Ort | Kontaktuppgifter.ort |
| Hur snart vill ni komma igång | Anmälningsinfo.hurSnart |
| Vad hoppas ni fått ut av undervisning | Anmälningsinfo.vadHoppas |
| Tillgång till instrument | Anmälningsinfo.tillgangInstrument |
| Kommunikationspreferens | Anmälningsinfo.kommunikationspreferens |
| Något annat vi bör veta? | Anmälningsinfo.annatViBorVeta |
| Samtalsanteckning | Anteckning |
| Kommentar från första lektionen | Anteckning eller Matchningar.FörstaLektionAnteckning |
| Anmälningskommentar (intern) | Anteckning |
| Lektionsform | Abonnemangsupplägg.upplägg |
| Lektion längd | Abonnemangsupplägg.längd |
| Lektionstid | → Elev.Lektionsupplägg.lektionstid |
| Reservtid | → Elev.Lektionsupplägg.reservtid |

> **Hög risk:** All kod som skapar eller uppdaterar Vårdnadshavare måste migrera. Det räcker inte med update-routes — även create-flöden (t.ex. elev-anmälan) måste bygga JSON-fälten korrekt.

---

## Tabell: Lärare

**Table ID:** `tbldsyppY5wQ9MpSp` (samma i båda baserna)

### Oförändrade fält

| Fält | Field ID | Typ |
|---|---|---|
| ID | fldonffy8sUkWY0HP | formula |
| Namn | fld8DxY4w7Qg0yoqG | singleLineText |
| Status | fldCFz1WOILk9q86U | singleSelect |
| Instrument | fldIgFv4kwsoR4sDv | multipleSelects |
| Elev | fldbCjxfyHJ7RYYGO | multipleRecordLinks |
| E-post | fldPVsJUpdLKB33Ia | singleLineText |
| Telefon | fldzsOJPIMXuG1T6P | singleLineText |
| Adress | fldEYirpcA3v95QRL | singleLineText |
| Bankkontonummer | fld0eARexLBh9ehYN | singleLineText |
| Bank | fld9hqL6CwLVIDCHl | singleLineText |
| Personnummer | fldJBB0W5BZSTj2VW | singleLineText |
| Lönepålägg | fld6LdD8fSd2HEhEB | number |
| Timlön | fldfEQNPVRFAaLVTO | formula |
| Skattesats | fldE76rpMrERQn7Bf | formula |
| Inlagt i bank | fld69Lkboyh2krlit | checkbox |
| Önskat antal elever | fldfSohZjRay02U4E | number |
| Jämkning | fldVIbjDDQ0r0wsyc | multipleAttachments |
| Belastningsregister | fld5zKkXvvmudk2zT | multipleAttachments |
| Avtal | fldKqLk4LgnGuRTuo | multipleAttachments |
| Profilbild | fldjZsVJc8ivp3Z5Q | multipleAttachments |
| Biografi | fldnXqR3Y0mH1R84t | multilineText |
| Födelseår | fldPuU7VoMqHSZaLu | singleLineText |
| Löner | fldbL67M5LlhJOb0B | multipleRecordLinks |
| Jobbansökningar | fldyqGyOXYIeA7Ar3 | multipleRecordLinks |
| Matchningar | flddJwq196VYVExhY | multipleRecordLinks |
| Uppstartsmöten | fldzynK284X9oA2ic | multipleRecordLinks |
| Latitude | fldGIUOGFIuxXn2eD | number |
| Longitude | fldZqHNhPWf8iqzzF | number |
| Sista arbetsdag | fldNPVHs93iBFqgwM | date |
| Uppehåll till | fldYsXmu4UaTL9IKR | date |
| PushToken | fld9wJXURMoHLeHib | singleLineText |
| Notifications 2 | fldVXzjLXNkx5zz9b | multipleRecordLinks |
| Återställningskod | fldjduKuuZFydZypU | singleLineText |
| Lösenord | fldwh7z9brGAAcJvr | singleLineText |
| Undervisningsområden | fld6ylaaoZZHtjYiu | singleLineText |

### Namnändrade fält — samma field ID

| Field ID | Gammalt namn | Nytt namn | Typ |
|---|---|---|---|
| fldt8Pke9wyfkiOox | NummerID | Specifikationsnummer | autoNumber |
| fld8IIoBKs4GUnZPw | Rapportering | Lektioner | multipleRecordLinks |
| fldmLKOQPstjDLIS3 | Önskar | ElevÖnskemål | multipleRecordLinks |
| fld9kv363OWGQLMgc | Elev 2 | ElevFörslag | multipleRecordLinks |

### Nytt fält — NYTT field ID (ej namnbyte)

| Gammalt fält | Gammalt field ID | Nytt fält | Nytt field ID | Typ |
|---|---|---|---|---|
| Kommentar från admin | fld0Oq5IIfR1aAVdD | LärarAnteckning | fldPqKDimwwrxNC92 | multilineText |

> **Notering:** Dessa har **olika field IDs**. Det är inte ett namnbyte utan ett nytt fält. Kod som söker på det gamla fält-IDt hittar ingenting i nya basen.

### Borttagna fält

| Gammalt fält | Typ |
|---|---|
| Förnamn | formula |
| Postnummer | singleLineText |
| Ort | singleLineText |
| Instrument_backup | singleLineText |
| RecordID | formula |
| Saknas något? | formula |
| Elever | rollup |
| Sammansatt adress | formula |
| Närmast till dessa elever (från elevsidan) | multipleRecordLinks |
| Närmaste elev vid ansökan | multipleRecordLinks |
| Närmast elev just nu | multipleRecordLinks |
| Närmast elev just nu avstånd km | number |
| Skapat | createdTime |
| Kommentar från admin | multilineText |
| ÖnskarKommentar | multilineText |
| Specifikationsnummer (gammalt formula-fält) | formula |

> **Notering:** `Postnummer` och `Ort` för Lärare saknar direkt ersättare i nya basen. Lärare har fortfarande `Adress` (singleLineText) men inga separata adressfält.

### Mappning

| Gammalt | Nytt |
|---|---|
| Rapportering | Lektioner (samma field ID) |
| Önskar | ElevÖnskemål (samma field ID) |
| Elev 2 | ElevFörslag (samma field ID) |
| NummerID | Specifikationsnummer (samma field ID) |
| Kommentar från admin | LärarAnteckning (nytt field ID) |

---

## Tabell: Jobbansökningar

**Table ID:** `tblnJd5fEqh2qXC2R` (samma i båda baserna)

### Oförändrade fält

Alla JSON-fält (`Kontaktuppgifter`, `Erfarenheter`, `Övrigt`) fanns redan i gamla basen med samma field IDs. `Instrument` var redan `multipleSelects` i gamla basen.

| Fält | Field ID | Typ |
|---|---|---|
| Namn | fld9jynw2n1r13z8a | singleLineText |
| Födelseår | fldOsBOwWWpwrGytT | singleLineText |
| Status | fldQfvT0oGCvXcNJp | singleSelect |
| Instrument | fldCEc2Rl2X3SsKIg | multipleSelects |
| EgenAnteckning | fldW105mIHjk72rAd | multilineText |
| Länk till lärare | fldnqvkyX4bDg8oeK | multipleRecordLinks |
| Latitude | fld2QDW50sNrpWkj5 | number |
| Longitude | fldvVj8KnUzFhtmda | number |
| Kontaktuppgifter | fld581AIBWHKyzm4S | multilineText |
| Erfarenheter | fld8UZXKhPTTQsWFh | multilineText |
| Övrigt | fld2TG0mRPtG2KtpY | multilineText |
| Ansökningdatum | fldeks5Xr6CsuCvFb | formula |

### Borttagna fält

| Gammalt fält | Field ID | Typ |
|---|---|---|
| Instrument_backup | fld9Q2uXSTTpF0VCh | singleLineText |

> Tabellen var redan delvis migrerad i gamla basen. Risk är bara kod som fortfarande skriver `Instrument_backup` eller skriver `Instrument` som string.

---

## Tabell: Lektioner

**Table ID:** `tblbMwm8gitNwBAUH` (samma i båda baserna)

### Oförändrade fält

Nästan allt är oförändrat. Fältet `Anteckningar` (JSON) fanns redan i gamla basen.

| Fält | Field ID | Typ |
|---|---|---|
| ID | fldG77p2mFwxJ7aty | autoNumber |
| Lärare | fldWjgdt01zesOqxu | multipleRecordLinks |
| E-post (Lärare) | fldzguQmot8onILVr | multipleLookupValues |
| Vårdnadshavare | fldxUcaCVDr5Zjp00 | multipleLookupValues |
| Month-Year | fldhN5iUDTAZgIEeC | formula |
| Datum | fldhxKHitzVVkEXDC | date |
| Datum genomförd | fldBXcfJy1wlveMt5 | date |
| Status | fldejNtPGmDn3bbLd | singleSelect |
| Lektionsform | fldza0hczRvPuFwTc | singleSelect |
| Lektionslängd | fld6lMU7qKesHG7ZR | formula |
| Elev | fldPYRz2CEQSfyK3K | multipleRecordLinks |
| Elev Namn | fldw9kI1XVR3BtbnD | multipleLookupValues |
| Påminnelse skickad | fldc9m4EOXrIVqhR1 | checkbox |
| Klockslag | fldwPjSMmtzPxSWeR | singleLineText |
| Ombokad till | fldczCBLxn7GyIBZ2 | date |
| Fakturor | fldpXHFsspi1xIY2Q | multipleRecordLinks |
| Löner | fldcyxycA7pu02pHw | multipleRecordLinks |
| API_Payload | fldYwZLi8wzOrThRo | formula |
| Anteckningar | fldK1DksQkVUwQG9l | multilineText |
| Orsak | fldwiVaqSd4ydLTjk | multilineText |

### Nya fält i ny bas

| Fält | Field ID | Typ |
|---|---|---|
| Lärare Namn | fldZAIovLtEbUawE3 | multipleLookupValues |

### Viktigt befintligt JSON-fält

`Anteckningar` (fldK1DksQkVUwQG9l) är JSON i **båda** baserna:

```json
{
  "lektionsanteckning": "",
  "laxa": ""
}
```

Kod som söker efter separata gamla fält som `Lektionsanteckning` eller `Läxa` är redan trasig (gäller båda baserna).

---

## Tabell: Matchningar

**Table ID:** `tblDTZvicLnVlM3Ur` (samma i båda baserna)

### Oförändrade fält

| Fält | Field ID | Typ |
|---|---|---|
| Name | fldOFcojzegv3PX4N | formula |
| Elev | fldGLSh97DFzOkf0Q | multipleRecordLinks |
| Lärare | fldbTs3uNEyx13BkB | multipleRecordLinks |
| Skapad | fldA54JGs950jo8ui | createdTime |
| Skickad lärare | fldUkJ7cBhZAjDJNJ | checkbox |
| Skickad vårdnadshavare | fldQxOcR4lZv5HUKS | checkbox |
| Första lektion genomförd | fldYzHZ2IvVuo1IKo | date |

### Nytt fält i ny bas

| Fält | Field ID | Typ |
|---|---|---|
| FörstaLektionAnteckning | fldTcIsonv8Lz1Uxw | multilineText |

> Om "Kommentar från första lektionen" tidigare skrevs till `Vårdnadshavare.Kommentar från första lektionen`, behöver den nu troligen skrivas till `Matchningar.FörstaLektionAnteckning` eller `Vårdnadshavare.Anteckning`.

---

## Tabeller utan skillnader

Dessa tabeller är identiska i båda baserna:

| Tabell | Table ID |
|---|---|
| Fakturor | tbl6g2vgzED4GsF3w |
| Löner | tblxpoEVPggnxR5FZ |
| Ekonomistyrning | tbllMRQq7HpM9IyEh |
| Admin_Meddelanden | tblup7A7IHxPi82si |
| Mejlmallar | tbll1zoNBY21LzE1e |
| Notifications | tblu5XzB4HAFPbNGh |
| Notification Templates | tblui1WgqdfGeLfjc |
| Uppstartsmöten | tblLnbvCTptmMtuto |
| AdminKonton | tblVkxo9wEY9w0gew |
| AdminNotiser | tblwhYiQ3nVHqJyRb |

> **Notering:** Fakturor hämtar lookup-data från Vårdnadshavare. Eftersom Vårdnadshavare har tappat platta adressfält kan indirekt påverkan uppstå om lookup-källorna ändrats.

---

## Samlad lista — alla kodbrytande ändringar

### A. Gamla fält → JSON i Vårdnadshavare

Måste hanteras i **både** create och update:

| Gammalt fält | Nytt JSON-fält | Nyckel |
|---|---|---|
| E-post | Kontaktuppgifter | `.epost` |
| Telefon | Kontaktuppgifter | `.telefon` |
| Gata | Kontaktuppgifter | `.gata` |
| Gatunummer | Kontaktuppgifter | `.gatunummer` |
| Postnummer | Kontaktuppgifter | `.postnummer` |
| Ort | Kontaktuppgifter | `.ort` |
| Lektionsform | Abonnemangsupplägg | `.upplägg` |
| Lektion längd | Abonnemangsupplägg | `.längd` |
| Hur snart vill ni komma igång | Anmälningsinfo | `.hurSnart` |
| Tillgång till instrument | Anmälningsinfo | `.tillgangInstrument` |
| Vad hoppas ni fått ut av undervisning | Anmälningsinfo | `.vadHoppas` |
| Kommunikationspreferens | Anmälningsinfo | `.kommunikationspreferens` |
| Något annat vi bör veta? | Anmälningsinfo | `.annatViBorVeta` |
| Samtalsanteckning | Anteckning | (fritext) |
| Kommentar från första lektionen | Anteckning eller Matchningar.FörstaLektionAnteckning | |
| Anmälningskommentar (intern) | Anteckning | |

### B. Gamla fält → JSON i Elev

| Gammalt fält | Nytt JSON-fält | Nyckel |
|---|---|---|
| Lektionstid | Lektionsupplägg | `.lektionstid` |
| Reservtid | Lektionsupplägg | `.reservtid` |
| Terminsmål | Lektionsupplägg | `.terminsmål` |
| Kommentar | Lektionsupplägg | `.kommentar` |
| Lektionsform | Lektionsupplägg | `.form` |
| Barn-info (namn, födelseår, instrument per barn) | Barn | JSON-array |

### C. Typändringar

| Tabell | Fält | Gammal typ | Ny typ | Åtgärd |
|---|---|---|---|---|
| Elev | Instrument | singleLineText | multipleSelects | Skriv som `[{ name: "..." }]` |
| Elev | Ansökningsdag | formula | createdTime | Ta bort från write-payloads |

### D. Relationer/namnbyten (samma field ID)

| Tabell | Gammalt namn | Nytt namn |
|---|---|---|
| Elev | Önskar | LärareÖnskar |
| Elev | Förslag | LärareFörslag |
| Elev | Anteckning till lärarkarta | LärarkartAnteckning |
| Elev | Onboarding status changed at | OnboardingÄndringsdatum |
| Lärare | Rapportering | Lektioner |
| Lärare | Önskar | ElevÖnskemål |
| Lärare | Elev 2 | ElevFörslag |
| Lärare | NummerID | Specifikationsnummer |

### E. Nytt field ID (ej namnbyte)

| Tabell | Gammalt fält + ID | Nytt fält + ID |
|---|---|---|
| Lärare | Kommentar från admin (`fld0Oq5IIfR1aAVdD`) | LärarAnteckning (`fldPqKDimwwrxNC92`) |

### F. Lektioner

| Gammalt | Nytt |
|---|---|
| Lektionsanteckning (separat fält) | Anteckningar.lektionsanteckning (JSON) |
| Läxa (separat fält) | Anteckningar.laxa (JSON) |

---

## Read-only fält — får aldrig skrivas

Dessa fält ska **aldrig** finnas i create- eller update-payloads:

| Tabell | Fält | Typ |
|---|---|---|
| Elev | Ansökningsdag | createdTime |
| Elev | ID | formula |
| Elev | NummerID | autoNumber |
| Elev | Lektionstider | multipleLookupValues |
| Vårdnadshavare | ID | formula |
| Vårdnadshavare | NummerID | autoNumber |
| Vårdnadshavare | Grundpris | formula |
| Vårdnadshavare | Lektionspris | formula |
| Vårdnadshavare | Månadspris | formula |
| Lärare | ID | formula |
| Lärare | Specifikationsnummer | autoNumber |
| Lärare | Timlön | formula |
| Lärare | Skattesats | formula |
| Lektioner | ID | autoNumber |
| Lektioner | Lektionslängd | formula |
| Lektioner | API_Payload | formula |
| Lektioner | Lärare Namn | multipleLookupValues |
| Lektioner | Elev Namn | multipleLookupValues |
| Matchningar | Name | formula |
| Matchningar | Skapad | createdTime |
