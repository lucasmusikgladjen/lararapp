# Musikglädjen - Airtable Schema Documentation

> **Auto-generated:** 2026-01-05
> Run `npm run generate-schema` to update.

**Base ID:** `app1l4NwAMtwlTIUC`

## Tables

| Table | Fields |
|-------|--------|
| [Elev](#elev) | 71 |
| [Vårdnadshavare](#vårdnadshavare) | 59 |
| [Lärare](#lärare) | 51 |
| [Jobbansökningar](#jobbansökningar) | 32 |
| [Lektioner](#lektioner) | 24 |
| [Fakturor](#fakturor) | 19 |
| [Löner](#löner) | 25 |
| [Löneperiod](#löneperiod) | 2 |
| [Admin_Meddelanden](#admin-meddelanden) | 7 |
| [Kundavtal](#kundavtal) | 3 |
| [Mailmerge](#mailmerge) | 3 |
| [Mailmerge - Hemkodat](#mailmerge---hemkodat) | 4 |
| [Mejlmallar](#mejlmallar) | 5 |
| [Matchningsförslag](#matchningsförslag) | 5 |
| [Matchningar](#matchningar) | 4 |
| [Skickat avtal](#skickatavtal) | 4 |
| [Veckorapport](#veckorapport) | 4 |
| [Notiser](#notiser) | 10 |

---

## Elev

- **Table ID:** `tblAj4VVugqhdPWnR`
- **Primary field:** ID

| Field Name | Type |
|------------|------|
| **ID** (primary) | Formula: `CONCATENATE({fldhdPPKPmku2jJym},  " "  , {fld8QwcBDb08ngIt8})` |
| Vårdnadshavare | Link to **Vårdnadshavare** |
| Lärare | Link to **Lärare** |
| Matchningsdag | Last modified time |
| Namn | Single line text |
| Status | Single select: `Söker lärare`, `Aktiv`, `Inaktiv`, `Uppehåll` |
| Radera | Checkbox |
| NummerID | Auto number |
| Förnamn | Single line text |
| Instrument | Single line text |
| Födelseår | Single line text |
| Kommentar | Long text |
| VårdnadshavareRecordID | Lookup values |
| LärareRecordID | Lookup values |
| Önskar | Link to **Lärare** |
| Lektioner | Link to **Lektioner** |
| Gata | Lookup values |
| Gatunummer | Lookup values |
| Ort | Lookup values |
| Longitude | Lookup values |
| Latitude | Lookup values |
| Samtalsanteckningar | Lookup values |
| Vårdnadshavare e-post | Lookup values |
| Vårdnadshavare telefon | Lookup values |
| Starttid | Single line text |
| Göm från matchning | Checkbox |
| ElevRecordID | Formula: `RECORD_ID()` |
| Lektionspris | Lookup values |
| Ansökningsdag | Formula: `CREATED_TIME()` |
| Matchningskommentar (intern) | Long text |
| Datum genomförd (from Rapportering) | Lookup values |
| Bokade lektioner | Lookup values |
| Lektioner - Feb | Lookup values |
| Lektioner - Jan | Lookup values |
| Lektioner - Mars | Lookup values |
| Lektioner - April | Lookup values |
| Lektioner - Maj | Lookup values |
| Lektioner - Juni  | Lookup values |
| Lektioner - Juli | Lookup values |
| Lektioner - Aug | Lookup values |
| Lektioner - Sep | Lookup values |
| Lektioner - Okt | Lookup values |
| Lektioner - Nov | Lookup values |
| Lektioner - Dec | Lookup values |
| Lektionstid | Single line text |
| Reservtid | Single line text |
| Kundavtal | Single line text |
| Lärare e-post | Lookup values |
| Terminsmål | Long text |
| Lärandematerial | Attachments |
| ÖnskaKommentar | Long text |
| Lärarens förnamn | Lookup values |
| Kommentar till matchning | Long text |
| Elevens erfarenhetsnivå | Single select: `Nybörjare (aldrig spelat)`, `Har spelat lite (mindre än 1 år)`, `Har spelat en del (1-3 år)`, `Avancerad (3+ år)` |
| Kort om eleven (från anmälan) | Long text |
| Sammansatt adress (from Vårdnadshavare) | Lookup values |
| Lead score | Single line text |
| Närmaste lärare | Link to **Lärare** |
| Närmaste jobbansökan | Link to **Jobbansökningar** |
| Jobbansökningar | Link to **Jobbansökningar** |
| Lärare 2 | Link to **Lärare** |
| Lärare 3 | Link to **Lärare** |
| Vårdnadshavare namn | Lookup values |
| Jobbansökningar 2 | Single line text |
| Bedömning | Single select: `Kan bli av`, `Känns osannolikt`, `Gammal`, `Rann ut i sanden` |
| Onboarding status | Single select: `Ej kontaktad`, `Påbörjad`, `Överlämnad till lärare`, `Skickat avtal` |
| Onboarding anteckningar | Long text |
| Anteckning till lärarkarta | Long text |
| Onboarding status changed at | Date & Time |
| Matchningsförslag | Link to **Matchningsförslag** |
| Matchningar | Link to **Matchningar** |
| Lektionstider | Lookup to **Lektioner** |

---

## Vårdnadshavare

- **Table ID:** `tblfYUEqhO9gtSQMh`
- **Primary field:** ID

| Field Name | Type |
|------------|------|
| **ID** (primary) | Formula: `CONCATENATE({fldPAf9IBN4kUyVUn},  " "  , {fldy0ub7JD6s7fOfg})` |
| Namn | Single line text |
| Förnanmn (Vårdnadshavare) | Formula: `IF(FIND(" ", {fldPAf9IBN4kUyVUn}) > 0, LEFT({fldPAf9IBN4kUyVUn}, FIND(" ", {fldPAf9IBN4kUyVUn}) - 1), {fldPAf9IBN4kUyVUn})`|
| Elevnamn | Single line text |
| Elev | Link to **Elev** |
| NummerID | Auto number |
| Gata | Single line text |
| Gatunummer | Single line text |
| Ort | Single line text |
| Postnummer | Single line text |
| E-post | Single line text |
| Telefon | Phone number |
| Upplägg | Single select: `Individuell lektion`, `Delad lektion`, `Dubbellektion` |
| Lektion längd | Formula: `IF({fldO96tavVxFijdBF} = "Individuell lektion", "45-60 min", IF(OR({fldO96tavVxFijdBF} = "Delad lektion", {fldO96tavVxFijdBF} = "Delad lektion 90 min"), "90 min", IF(OR({fldO96tavVxFijdBF} = "Dubbellektion",{fldO96tavVxFijdBF} = "Dubbellektion 120 min"), "120 min", "")))` |
| RecordID | Formula: `RECORD_ID()` |
| Adress | Formula: `CONCATENATE({fldxkdwYPjdNKbE3A},  ", "  , {fldap3PBNkEHBACLF}, ", Sweden")` |
| Latitude | Number |
| Longitude | Number |
| Lärare | Lookup values |
| Lärare e-post (from Elev) | Lookup values |
| Lärarens förnamn | Lookup values |
| Kommentar | Lookup values |
| Elevens födelseår | Lookup values |
| Elevens förnamn | Lookup values |
| Instrument | Lookup values |
| Samtalsanteckning | Long text |
| Ansökningsdag | Formula: `CREATED_TIME()` |
| Kundnummer Stripe | Single line text |
| Grundpris | Formula: `IF(OR({fldO96tavVxFijdBF} = "Delad lektion", {fldO96tavVxFijdBF} = "Delad lektion 90 min"), 562.5, 375)` |
| Prisjustering | Number |
| Lektionspris | Formula: `{fldyqjrP0VPKoLeJM} + {fldzmFbSBs57XosAA}` |
| Månadspris | Formula: `IF(OR({fldO96tavVxFijdBF} = "Delad lektion", {fldO96tavVxFijdBF} = "Delad lektion 90 min", {fldO96tavVxFijdBF} = "Dubbellektion", {fldO96tavVxFijdBF} = "Dubbellektion 120 min"), IF(OR({fldO96tavVxFijdBF} = "Dubbellektion", {fldO96tavVxFijdBF} = "Dubbellektion 120 min"), 3000, 2250), 1500) + {fldzmFbSBs57XosAA}` |
| Betalningssystem | Single select: `Flex`, `Abonnemang` |
| Status | Rollup |
| Matchningsdatum | Lookup values |
| Sista bokade lektion | Rollup |
| Kontakta status | Single select: `Ringt (svar)`, `Sms (svar)`, `Mejl (svar)`, `Mejl (ej svar)`, `Ringt (ej svar)`, `Sms (ej svar)`, `Avvakta`, `Pre-ringning` |
| Kontakt skickastatus | Single select: `Villkor skickat` |
| Lektionstid | Single line text |
| Reservtid | Single line text |
| Instrument - format | Rollup |
| Första faktura skickades | Last modified time |
| Avtal status | Single select: `Avtal redo att skickas`, `Avtal skickat`, `Avtal signerat` |
| Länk till kundavtal | Formula: `"https://airtable.com/app1l4NwAMtwlTIUC/pagyuOt1kiXi3YhOj/form" & "?prefill_V%C3%A5rdnadshavare+ID=" & ENCODE_URL_COMPONENT({fldo4z6hEk7osiNOw}) & "&prefill_Namn=" & ENCODE_URL_COMPONENT({fldPAf9IBN4kUyVUn}) & "&hide_V%C3%A5rdnadshavare+ID=true"` |
| Första lektionen | Date |
| Kommentar från första lektionen | Long text |
| Anmälningskommentar (intern) | Long text |
| Fakturor | Link to **Fakturor** |
| Bokio ID | Single line text |
| Hur snart vill ni komma igång | Single select: `Så snart som möjligt`, `Nästa termin`, `Jag är bara nyfiken` |
| Tillgång till instrument | Single select: `Ja, vi har redan ett instrument`, `Vi planerar att skaffa inom kort`, `Nej, behöver råd` |
| Vad hoppas ni fått ut av undervisning | Multiple select: `En rolig fritidsaktivitet`, `Att eleven utvecklas och lär sig spela instrumentet`, `En äldre förebild för eleven`, `Bättre koncentrationsförmåga`, `En aktivitet som inte kräver planering och logistik` |
| Kommunikationspreferens | Multiple select: `Telefon`, `SMS`, `E-post` |
| Något annat vi bör veta? | Long text |
| Elevens erfarenhetsnivå | Lookup values |
| Kort om eleven (från anmälan) | Lookup values |
| Radera | Checkbox |
| Lead score | Single line text |
| Sammansatt adress | Formula: `{fldxkdwYPjdNKbE3A} & ", " & {fldap3PBNkEHBACLF}` |

---

## Lärare

- **Table ID:** `tbldsyppY5wQ9MpSp`
- **Primary field:** ID

| Field Name | Type |
|------------|------|
| **ID** (primary) | Formula: `CONCATENATE({fld8DxY4w7Qg0yoqG},  " "  , {fldt8Pke9wyfkiOox})` |
| Namn | Single line text |
| NummerID | Auto number |
| Förnamn | Formula: `IF(FIND(" ", {fld8DxY4w7Qg0yoqG}) > 0, LEFT({fld8DxY4w7Qg0yoqG}, FIND(" ", {fld8DxY4w7Qg0yoqG}) - 1), {fld8DxY4w7Qg0yoqG})` |
| Adress | Single line text |
| Postnummer | Single line text |
| Ort | Single line text |
| Region | Single line text |
| Födelseår | Single line text |
| E-post | Single line text |
| Telefon | Single line text |
| Bankkontonummer | Single line text |
| Bank | Single line text |
| Personnummer | Single line text |
| Instrument | Single line text |
| Elev | Link to **Elev** |
| Timlön | Formula: `IF(YEAR(TODAY())-{fldPuU7VoMqHSZaLu} <= 15, 90, IF(YEAR(TODAY())-{fldPuU7VoMqHSZaLu} = 16, 100, IF(YEAR(TODAY())-{fldPuU7VoMqHSZaLu} = 17, 107, IF(YEAR(TODAY())-{fldPuU7VoMqHSZaLu} = 18, 115, IF(YEAR(TODAY())-{fldPuU7VoMqHSZaLu} = 19, 125, IF(YEAR(TODAY())-{fldPuU7VoMqHSZaLu} > 19, 130)))))) + {fld6LdD8fSd2HEhEB}` |
| Skattesats | Formula: `IF({fldVIbjDDQ0r0wsyc} != "", 0, 0.3)` |
| Lönepålägg | Number |
| Specifikationsnummer | Formula: `{fldt8Pke9wyfkiOox}` |
| Slutar | Single select: `Aktiv`, `Paus`, `Slutat` |
| Rapportering | Link to **Lektioner** |
| Lösenord | Single line text |
| Återställningskod | Single line text |
| RecordID | Formula: `RECORD_ID()` |
| Önskar | Link to **Elev** |
| Jämkning | Attachments |
| Belastningsregister | Attachments |
| Avtal | Attachments |
| Saknas något? | Formula: `IF(AND({fld5zKkXvvmudk2zT} = "", {fldKqLk4LgnGuRTuo} = ""), "❌  Allt saknas", IF({fld5zKkXvvmudk2zT} = "", "❌  Belastning", IF({fldKqLk4LgnGuRTuo} = "", "❌  Avtal", "✅  Allt är inskickat")))` |
| Profilbild | Attachments |
| Biografi | Long text |
| Inlagt i bank | Checkbox |
| Önskat antal elever | Number |
| Elever | Rollup |
| Dagar/tider | Long text |
| ÖnskarKommentar | Long text |
| Vårdnadshavare | Single line text |
| Löner | Link to **Löner** |
| Jobbansökningar | Link to **Jobbansökningar** |
| Info om lärare | Rich text |
| Bedömning (från intervju) | Single select: `Okej`, `Bra`, `Jättebra` |
| Sammansatt adress | Formula: `{fldEYirpcA3v95QRL} & " " & {fldK81F4k5PMJBgg1}` |
| Latitude | Number |
| Longitude | Number |
| Närmast till dessa elever (från elevsidan) | Link to **Elev** |
| Närmaste elev vid ansökan | Link to **Elev** |
| Närmast elev just nu | Link to **Elev** |
| Närmast elev just nu avstånd km | Number |
| Matchningsförslag | Link to **Matchningsförslag** |
| Matchningar | Link to **Matchningar** |

---

## Jobbansökningar

- **Table ID:** `tblnJd5fEqh2qXC2R`
- **Primary field:** Namn

| Field Name | Type |
|------------|------|
| **Namn** (primary) | Single line text |
| Födelseår | Single line text |
| E-post | Single line text |
| Telefon | Phone number |
| Adress | Single line text |
| Ort | Single line text |
| Kommentar | Long text |
| Instrument | Single line text |
| Förnamn | Formula: `IF(LEN({fld9jynw2n1r13z8a}) - LEN(SUBSTITUTE({fld9jynw2n1r13z8a}, " ", '')) > 0 ,LEFT({fld9jynw2n1r13z8a}, FIND(" ", {fld9jynw2n1r13z8a}) - 1),{fld9jynw2n1r13z8a})` |
| Berätta vad du tyckte om kandidaten | Long text |
| Något vi bör hålla extra koll på? | Long text |
| Status | Single select: `Inbjuden`, `Ringt`, `Okvalificerad`, `Avvakta`, `Anställ`, `Refuserad`, `Intervjuad`, `Klar` |
| Status-utskick | Single select: `Inbjuden skickat`, `Okvalificerad skickat`, `Avvakta skickat`, `Anställ skickat`, `Refuserad skickat` |
| Kommentar från intervju och uppstartsmöte | Long text |
| Bedömning | Single select: `Jättebra`, `Bra`, `Okej`, `Dålig` |
| Ansökningdatum | Formula: `CREATED_TIME()` |
| Länk till lärare | Link to **Lärare** |
| Elev (from Länk till lärare) | Lookup values |
| Önskat startdatum | Single select: `Så snart som möjligt `, `Nästa termin`, `Osäker`, `Så snart som möjligt` |
| Antal elever | Single select: `1-2 elever`, `3-4 elever`, `5+ elever` |
| Vad vill du ha ut av jobbet? | Multiple select: `Att tjäna lite extra vid sidan av plugget`, `Ett meningsfullt arbete med barn`, `Ett roligt jobb där du får jobba med musik`, `Personlig utveckling inom musik och pedagogik` |
| Undervisningsområden | Single line text |
| Musikerfarenheter | Long text |
| Erfarenheter med barn | Long text |
| Latitude | Number |
| Longitude | Number |
| Sammansatt adress | Formula: `{fldrtbbYuugtiwRFK} & " " & {fldk3BJ5ilg6NKu3R}` |
| record_ID | Formula: `RECORD_ID()` |
| Närmaste elever (från elevsidan) | Link to **Elev** |
| Lead score | Single line text |
| Närmaste elev vid ansökan | Link to **Elev** |
| Matchningsförslag | Link to **Matchningsförslag** |

---

## Lektioner

- **Table ID:** `tblbMwm8gitNwBAUH`
- **Primary field:** ID

| Field Name | Type |
|------------|------|
| **ID** (primary) | Auto number |
| Lärare | Link to **Lärare** |
| E-post (Lärare) | Lookup values |
| Vårdnadshavare | Lookup values |
| Datum | Date |
| Datum genomförd | Date |
| Upplägg | Single select: `45-60 min`, `90 min`, `120 min`, `Annat` |
| Lektionslängd | Formula: `IF(OR({fldza0hczRvPuFwTc} = "Individuell lektion", {fldza0hczRvPuFwTc} = "45-60 min"), 60, IF(OR({fldza0hczRvPuFwTc} = "Delad lektion",{fldza0hczRvPuFwTc} = "Delad lektion 90 min", {fldza0hczRvPuFwTc} = "90 min"), 90, IF(OR({fldza0hczRvPuFwTc} = "Dubbellektion",{fldza0hczRvPuFwTc} = "Dubbellektion 120 min",{fldza0hczRvPuFwTc} = "120 min"), 120,"")))` |
| Genomförd | Checkbox |
| Inställd | Checkbox |
| Elev | Link to **Elev** |
| Elev Namn | Lookup values |
| Month-Year | Formula: `SWITCH( DATETIME_FORMAT({fldhxKHitzVVkEXDC}, 'MMMM'), "January", "Januari", "February", "Februari", "March", "Mars", "April", "April", "May", "Maj", "June", "Juni", "July", "Juli", "August", "Augusti", "September", "September", "October", "Oktober", "November", "November", "December", "December") & " " & DATETIME_FORMAT({fldhxKHitzVVkEXDC}, 'YYYY')` | 
| Påminnelse skickad | Checkbox |
| Klockslag | Single line text |
| Läxa | Long text |
| Lektionsanteckning | Long text |
| Ombokad till | Date |
| Anledning ombokning | Long text |
| Anledning inställd | Long text |
| Fakturor | Link to **Fakturor** |
| Löner | Link to **Löner** |
| Lärare (backup) | Single line text |
| Vårdnadshavare (backup) | Single line text |

---

## Fakturor

- **Table ID:** `tbl6g2vgzED4GsF3w`
- **Primary field:** Månad

| Field Name | Type |
|------------|------|
| **Månad** (primary) | Single line text |
| Vårdnadshavare | Link to **Vårdnadshavare** |
| Elev | Lookup values |
| Elev copy 2 | Lookup values |
| Elev copy copy | Lookup values |
| Elev copy | Lookup values |
| Bokio ID | Lookup values |
| Fakturakommentar | Long text |
| Status | Single select: `Utkast`, `Faktura redo`, `Faktura skickat`, `Inga lektioner` |
| Hämta lektioner | Checkbox |
| Lektioner | Link to **Lektioner** |
| Faktureringstyp | Single select: `Flex`, `Abonnemang` |
| Antal lektioner | Count |
| Lektionspris | Number |
| Månadspris | Number |
| Prisjustering | Number |
| Totalt | Formula: `IF({fld5IfVzzEci62JuJ} = "Abonnemang", {fldDSjbenVQOoHzKe} + {fldIFd10AXAzwK2Lr}, ({fldbytiWMp4Un1Jng} * {fldy9ADNNg1G3GwGE}) + {fldIFd10AXAzwK2Lr})` |
| Totalt (exkl. moms) | Formula: `{fld1ELy2UqgmOblNZ}/1.25` |
| E-post (from Vårdnadshavare) | Lookup values |

---

## Löner

- **Table ID:** `tblxpoEVPggnxR5FZ`
- **Primary field:** Månad

| Field Name | Type |
|------------|------|
| **Månad** (primary) | Single line text |
| Lärare | Link to **Lärare** |
| Bankkontonummer | Lookup values |
| Bank | Lookup values |
| Personnummer | Lookup values |
| Specifikationsnummer | Lookup values |
| Status | Single select: `Utkast`, `Preliminär lön`, `Deklarerad`, `Betald & deklarerad` |
| Lektioner | Link to **Lektioner** |
| Antal lektioner | Number |
| Arbetstimmar | Number |
| Timlön | Number |
| Skattesats | Percent |
| Totallön | Formula: `IF({fld7WDUAZWdn95ziA} * {fldKEvGO9Pz9pnlBp}, ROUND({fld7WDUAZWdn95ziA} * {fldKEvGO9Pz9pnlBp}, 0))` |
| Personalskatt | Formula: `IF({fldDMgf9EmCCemuJO}, IF(ROUND({fldDMgf9EmCCemuJO} * {fldivup8B6yrKwubp}, 0) = 0, 0, ROUND({fldDMgf9EmCCemuJO} * {fldivup8B6yrKwubp}, 0)))`|
| Utbetald | Formula: `IF({fldDMgf9EmCCemuJO} - {fldM9WNReIq6QiOGS}, ROUND({fldDMgf9EmCCemuJO} - {fldM9WNReIq6QiOGS}, 2))` |
| Semesterersättning | Formula: `IF({fldDMgf9EmCCemuJO} * 0.12, ROUND({fldDMgf9EmCCemuJO} * 0.12, 0))` |
| Grundlön | Formula: `IF({fldDMgf9EmCCemuJO} - {fldX9bQMY31MqbDdj}, {fldDMgf9EmCCemuJO} - {fldX9bQMY31MqbDdj})`|
| Inlagt i bank | Lookup values |
| Mellanrum (1) | Single line text |
| Mellanrum (2) | Single line text |
| E-post | Email |
| Namn | Single line text |
| Skicka status | Single select: `Preliminär lön skickat`, `Slutlig lön skickat` |
| Skicka preliminärt lönebesked | Button |
| Utbetalningdatum | Date |

---

## Löneperiod

- **Table ID:** `tbllMRQq7HpM9IyEh`
- **Primary field:** Månad

| Field Name | Type |
|------------|------|
| **Månad** (primary) | Single line text |
| Aktiv | Checkbox |

---

## Admin_Meddelanden

- **Table ID:** `tblup7A7IHxPi82si`
- **Primary field:** Datum

| Field Name | Type |
|------------|------|
| **Datum** (primary) | Date |
| Rubrik | Single line text |
| Meddelande | Rich text |
| Länk | URL |
| Länktext | Single line text |
| Bild | Attachments |
| Viktigt | Checkbox |

---

## Kundavtal

- **Table ID:** `tblSt2PIM3Mc5Rsw1`
- **Primary field:** Namn

| Field Name | Type |
|------------|------|
| **Namn** (primary) | Single line text |
| Vårdnadshavare ID | Single line text |
| Avtal | Checkbox |

---

## Mailmerge

- **Table ID:** `tbl89ihke2a3mdFAR`
- **Primary field:** E-post

| Field Name | Type |
|------------|------|
| **E-post** (primary) | Long text |
| Skicka | Checkbox |
| Skickat | Checkbox |

---

## Mailmerge - Hemkodat

- **Table ID:** `tbluLHxPuQLLO6NaW`
- **Primary field:** E-post

| Field Name | Type |
|------------|------|
| **E-post** (primary) | Email |
| Namn | Single line text |
| Skicka | Checkbox |
| Skickat | Checkbox |

---

## Mejlmallar

- **Table ID:** `tbll1zoNBY21LzE1e`
- **Primary field:** Namn

| Field Name | Type |
|------------|------|
| **Namn** (primary) | Single line text |
| Ämne | Single line text |
| Innehåll | Rich text |
| Avsändare | Single line text |
| Används till | Multiple select: `Sålla elevanmälningar`, `Matchning` |

---

## Matchningsförslag

- **Table ID:** `tblc2jk1PzTCQQwJL`
- **Primary field:** Namn

| Field Name | Type |
|------------|------|
| **Namn** (primary) | Formula: `{fldcfW28NwEmg42La} & " → " & IF({flddXyDaR6ZRbqT9Z}, {flddXyDaR6ZRbqT9Z}, {fldBYmYfmAg32ledL})` |
| Elev | Link to **Elev** |
| Lärare | Link to **Lärare** |
| Ansökan | Link to **Jobbansökningar** |
| Skapad | Created time |

---

## Matchningar

- **Table ID:** `tblDTZvicLnVlM3Ur`
- **Primary field:** Name

| Field Name | Type |
|------------|------|
| **Name** (primary) | Formula: `"MATCH SKICKAD: " & {fldGLSh97DFzOkf0Q} & " & " & {fldbTs3uNEyx13BkB}` |
| Elev | Link to **Elev** |
| Lärare | Link to **Lärare** |
| Skapad | Created time |

---

## Skickat avtal

- **Table ID:** `tbl25GU0oypkc9ZEP`
- **Primary field:** Name

| Field Name | Type |
|------------|------|
| **Name** (primary) | Formula: `"AVTAL:" & {Vårdnadshavare} & " & " & {Lärare}` |
| Vårdnadshavare | Link to **Vårdnadshavare** |
| Lärare | Link to **Lärare** |
| Skapad | Created time |

---

## Veckorapport

- **Table ID:** `tbldwu3KzmZwrQnL2`
- **Primary field:** Name

| Field Name | Type |
|------------|------|
| **Name** (primary) | Single line text |
| Lektioner | Link to **Lektioner** |
| Skapad | Created time |
| Status | Single select: `Ny`, `Läst`, `Uppföljd` |
| Anteckning | Long text |

---

## Notiser

- **Table ID:** `tblNotiser` *(uppdatera med rätt ID)*
- **Primary field:** Name

| Field Name | Type |
|------------|------|
| **Name** (primary) | Single line text |
| Typ | Single select: `Aktiv lärare saknar belastningsregister`, `Aktiv lärare saknar avtal`, `Aktiv lärare saknar bankkontonummer`, `Lärare saknar adress/koordinater`, `Aktiv elev saknar lärare`, `Aktiv elev har inga bokade lektioner`, `Elev saknar adress/koordinater`, `Elev med onboarding påbörjad > 14 dagar`, `Lektion inställd utan anledning`, `Tre+ lektioner inställda i rad`, `Avtal skickat > 14 dagar utan signatur`, `Matchningsförslag äldre än 14 dagar`, `Elev överlämnad > 14 dagar utan lektion` |
| Kategori | Single select: `Alarm` |
| Skapad | Created time |
| Status | Single select: `Löst`, `Skjut upp en dag`, `Skjut upp en vecka`, `Inte relevant` |
| Status senast ändrad | Last modified time (on Status) |
| Lärare | Link to **Lärare** |
| Elev | Link to **Elev** |
| Vårdnadshavare | Link to **Vårdnadshavare** |
| Jobbansökan | Link to **Jobbansökningar** |
| Lektion | Link to **Lektioner** |
| Matchningsförslag | Link to **Matchningsförslag** |

---

---

# APP-SPECIFIKA SCHEMA-ÄNDRINGAR

> **VIKTIGT:** Följande tabeller och fält måste skapas MANUELLT i Airtable innan appen kan implementeras.
> En LLM kan inte skapa dessa automatiskt - detta måste göras av en människa med Airtable-access.

---

## NYA TABELLER ATT SKAPA

### AppNotifikationer (NY TABELL)

**Syfte:** Lagrar notifikationer som visas i lärarappen. Admin skapar notifikationer här som pushas till lärare.

**Skapa tabell med namn:** `AppNotifikationer`

| Field Name | Type | Beskrivning |
|------------|------|-------------|
| **ID** (primary) | Auto number | Automatiskt genererat ID |
| Lärare | Link to **Lärare** | Vilken lärare notifikationen gäller |
| Typ | Single select | Typ av notifikation (se värden nedan) |
| Titel | Single line text | Rubrik som visas i appen |
| Meddelande | Long text | Detaljerat meddelande |
| Läst | Checkbox | Om läraren har läst/åtgärdat notifikationen |
| Metadata | Long text | JSON-sträng med extra data (t.ex. `{"lessonId": "rec123"}`) |
| Skapad | Created time | När notifikationen skapades |
| LäsDatum | Date | När notifikationen markerades som läst |
| Prioritet | Single select | `Hög`, `Normal`, `Låg` |

**Typ-fältets värden (Single select options):**
- `UNREPORTED_LESSON` - Du har glömt rapportera en lektion
- `NEW_MATCH` - Ny matchning till dig!
- `NEW_STUDENT_NEARBY` - Ny elev nära dig
- `MISSING_BELASTNINGSREGISTER` - Du saknar aktuellt belastningsregister
- `SALARY_AVAILABLE` - Din lön är tillgänglig
- `LESSON_REMINDER` - Påminnelse om kommande lektion
- `GENERAL_MESSAGE` - Allmänt meddelande från admin

---

### PushTokens (NY TABELL)

**Syfte:** Lagrar Firebase Cloud Messaging device tokens för att kunna skicka push-notifikationer till lärarnas enheter.

**Skapa tabell med namn:** `PushTokens`

| Field Name | Type | Beskrivning |
|------------|------|-------------|
| **ID** (primary) | Auto number | Automatiskt genererat ID |
| Lärare | Link to **Lärare** | Vilken lärare token tillhör |
| Token | Single line text | Firebase device token |
| Platform | Single select | `ios`, `android` |
| Aktiv | Checkbox | Om token fortfarande är giltig |
| Skapad | Created time | När token registrerades |
| SenastAnvänd | Date | När token senast användes för push |

**Notera:** En lärare kan ha flera tokens (en per enhet de loggar in på).

---

## NYA FÄLT I BEFINTLIGA TABELLER

### Lärare-tabellen - Nya fält

Lägg till följande fält i den befintliga **Lärare**-tabellen:

| Field Name | Type | Beskrivning |
|------------|------|-------------|
| PasswordHash | Single line text | Bcrypt-hashad version av lösenordet (ersätter det osäkra Lösenord-fältet) |
| RefreshToken | Single line text | JWT refresh token för att förnya access tokens |
| LastLogin | Date | Datum/tid för senaste inloggning |
| DirectionsCount | Number | Antal Google Directions API-anrop idag (för rate limiting) |
| DirectionsResetTime | Date | Tidpunkt när DirectionsCount ska nollställas |
| AppRegistrerad | Checkbox | Om läraren har registrerat sig via appen (vs. webbsidan) |
| OnboardingKlar | Checkbox | Om läraren har slutfört onboarding i appen |

**VIKTIGT om Lösenord-fältet:**
- Det befintliga `Lösenord`-fältet (rad 212) innehåller idag hashade lösenord från webbsidan
- Behåll detta fält för bakåtkompatibilitet
- Det nya `PasswordHash`-fältet används för app-autentisering
- Backend bör kontrollera båda fälten vid inloggning för att stödja både webb- och app-användare

---

### Elev-tabellen - Nya fält

**OBS:** Fältet `Önskar` (Link to Lärare) finns redan på rad 54 i schemat. Detta används för ansökningsflödet i FindStudents.

Lägg till följande fält i den befintliga **Elev**-tabellen:

| Field Name | Type | Beskrivning |
|------------|------|-------------|
| DisplayID | Formula | Anonymiserat ID för visning i appen: `CONCATENATE("Elev: ", {NummerID})` |
| ÖnskarDatum | Date | När senaste ansökan från lärare inkom |

---

### Lektioner-tabellen - Nya fält

Lägg till följande fält i den befintliga **Lektioner**-tabellen:

| Field Name | Type | Beskrivning |
|------------|------|-------------|
| RapporteradViaApp | Checkbox | Om lektionen rapporterades via appen |
| RapporteringsDatum | Date | När lektionen rapporterades |
| SkapadViaApp | Checkbox | Om lektionen skapades via appen |

---

## AUTOMATION: SKAPA NOTIFIKATIONER

Sätt upp följande Airtable Automations för att automatiskt skapa notifikationer:

### 1. Orapporterad lektion
**Trigger:** När `Datum` i Lektioner passerar OCH `Genomförd` = false OCH `Inställd` = false
**Vänta:** 24 timmar
**Action:** Skapa post i AppNotifikationer med:
- Lärare: Koppla till lektionens lärare
- Typ: `UNREPORTED_LESSON`
- Titel: "Glömd rapportering"
- Meddelande: "Du har en lektion som inte rapporterats"
- Metadata: `{"lessonId": "<record_id>"}`

### 2. Saknar belastningsregister
**Trigger:** Varje måndag kl 09:00
**Filter:** Lärare där `Slutar` = "Aktiv" OCH `Belastningsregister` är tom
**Action:** Skapa post i AppNotifikationer för varje matchande lärare

### 3. Ny elev nära dig
**Trigger:** När ny Elev skapas med `Status` = "Söker lärare"
**Action:** Skapa post i AppNotifikationer för alla aktiva lärare inom 10 km (kräver eventuellt extern integration)

---

## SAMMANFATTNING: CHECKLIST FÖR AIRTABLE-ADMIN

Innan appen kan tas i bruk, säkerställ att följande är gjort:

- [ ] **Skapa tabell:** AppNotifikationer (med alla fält enligt specifikation)
- [ ] **Skapa tabell:** PushTokens (med alla fält enligt specifikation)
- [ ] **Lägg till fält i Lärare:** PasswordHash, RefreshToken, LastLogin, DirectionsCount, DirectionsResetTime, AppRegistrerad, OnboardingKlar
- [ ] **Lägg till fält i Elev:** DisplayID (formula), ÖnskarDatum
- [ ] **Lägg till fält i Lektioner:** RapporteradViaApp, RapporteringsDatum, SkapadViaApp
- [ ] **Sätt upp automation:** Orapporterad lektion → AppNotifikationer
- [ ] **Sätt upp automation:** Saknar belastningsregister → AppNotifikationer
- [ ] **Verifiera fält:** Kontrollera att `Önskar` (Link to Lärare) finns i Elev-tabellen

---

