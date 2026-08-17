# ELVYTYS-MET 2026 symposium -todistus

Selainpohjainen osallistumistodistusgeneraattori ELVYTYS-MET 2026 -symposiumiin. Osallistuja syöttää etu- ja sukunimensä, ja sovellus luo ladattavan yhden sivun PDF-todistuksen.

## Kehitys

Asenna riippuvuudet ja käynnistä paikallinen kehityspalvelin:

```bash
npm install
npm run dev
```

Tuotantobuildi syntyy komennolla:

```bash
npm run build
```

## GitHub Pages

`main`-haaraan pushattu muutos julkaistaan automaattisesti GitHub Pagesiin workflowlla `.github/workflows/deploy-pages.yml`. Ota repositoryn asetuksista Pagesin lähteeksi **GitHub Actions**.

Sivu löytyy osoitteesta:

`https://simuteknikko.github.io/ELVYTYS-MET-2026-symposium-todistus/`

Sovellus toimii kokonaan selaimessa. Nimeä ei tallenneta eikä lähetetä palvelimelle. Tapahtuman nimi, ajankohta ja järjestäjätiedot löytyvät todistusmallista tiedostosta `src/main.js`.
