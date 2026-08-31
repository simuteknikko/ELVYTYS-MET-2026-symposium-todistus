import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './style.css';

const app = document.querySelector('#app');
const assetBase = import.meta.env.BASE_URL;

app.innerHTML = `
  <main class="app-shell">
    <section class="intro-panel" aria-labelledby="page-title">
      <h1 id="page-title">Kiitos osallistumisesta.</h1>
      <p class="intro-copy">Täytä nimesi alle. Saat henkilökohtaisen todistuksen ladattavana PDF-tiedostona.</p>
      <div class="event-note"><span class="event-note-line"></span><span>ELVYTYS-MET 2026 · Helsinki</span></div>
    </section>

    <section class="workspace" aria-label="Todistuksen luonti">
      <form class="form-panel" id="certificate-form">
        <div class="panel-heading">
          <span class="step">01</span>
          <div>
            <p class="eyebrow">Vastaanottaja</p>
            <h2>Kirjoita nimesi</h2>
          </div>
        </div>
        <div class="field-grid">
          <label class="field">
            <span>Etunimi</span>
            <input id="first-name" name="firstName" type="text" autocomplete="given-name" placeholder="Etunimi" required maxlength="60" />
          </label>
          <label class="field">
            <span>Sukunimi</span>
            <input id="last-name" name="lastName" type="text" autocomplete="family-name" placeholder="Sukunimi" required maxlength="60" />
          </label>
        </div>
        <p class="form-message" id="form-message" role="status" aria-live="polite"></p>
        <button class="primary-button" type="submit">
          <span>Luo ja lataa todistus</span>
          <span class="button-arrow" aria-hidden="true">↗</span>
        </button>
        <p class="privacy-note">Nimeäsi käsitellään vain tässä selaimessa. Sitä ei tallenneta tai lähetetä eteenpäin.</p>
      </form>

      <div class="preview-panel">
        <div class="preview-toolbar"><span class="eyebrow">Esikatselu</span><span class="a4-label">A4 · 1 sivu</span></div>
        <div class="certificate-wrap">
          <article class="certificate" id="certificate" aria-label="Osallistumistodistuksen esikatselu">
            <div class="certificate-top-rule"></div>
            <div class="certificate-content">
              <p class="certificate-kicker">Osallistumistodistus</p>
              <h2 class="certificate-title">ELVYTYS-MET<br /><em>2026</em></h2>
              <div class="certificate-divider"></div>
              <p class="recipient-name" id="recipient-name">Etunimi Sukunimi</p>
              <p class="certificate-text certificate-text--lower">on osallistunut valtakunnalliseen<br />ELVYTYS-MET 2026 -symposiumiin.</p>
              <p class="certificate-details">29.10.2026–30.10.2026 · Helsinki</p>
              <div class="certificate-signature">HUS Leikkaus- ja tehohoitokeskus<br /><span>HUS Simulaatiokoulutuskeskus · MET Alliance of Finland</span></div>
            </div>
            <div class="certificate-footer">
              <div class="certificate-logo-slot certificate-logo-slot--hus">
                <img src="${assetBase}assets/hus-logo.png" alt="HUS" />
              </div>
              <div class="certificate-logo-slot certificate-logo-slot--event">
                <img src="${assetBase}assets/event-logo.png" alt="ELVYTYS-MET 2026" />
              </div>
              <div class="certificate-logo-slot certificate-logo-slot--alliance">
                <img src="${assetBase}assets/met-alliance.jpg" alt="MET Alliance" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
`;

const form = document.querySelector('#certificate-form');
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const recipientName = document.querySelector('#recipient-name');
const message = document.querySelector('#form-message');
const button = form.querySelector('button');

function updatePreview() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  recipientName.textContent = [firstName, lastName].filter(Boolean).join(' ') || 'Etunimi Sukunimi';
}

[firstNameInput, lastNameInput].forEach((input) => input.addEventListener('input', updatePreview));

function waitForImages(element) {
  return Promise.all([...element.querySelectorAll('img')].map((image) => image.complete
    ? Promise.resolve()
    : new Promise((resolve) => { image.onload = resolve; image.onerror = resolve; })));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const fullName = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`.replace(/\s+/g, ' ');
  if (!fullName.trim()) return;

  button.disabled = true;
  button.querySelector('span').textContent = 'Luodaan PDF-tiedostoa...';
  message.textContent = '';
  updatePreview();

  try {
    await waitForImages(document.querySelector('#certificate'));
    const canvas = await html2canvas(document.querySelector('#certificate'), {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fffdf9'
    });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    pdf.save(`osallistumistodistus-${fullName.toLocaleLowerCase('fi-FI').replace(/[^a-z0-9åäö]+/gi, '-')}.pdf`);
    message.textContent = 'Todistus ladattu onnistuneesti.';
    message.className = 'form-message success';
  } catch (error) {
    console.error(error);
    message.textContent = 'PDF:n luominen ei onnistunut. Yritä hetken kuluttua uudelleen.';
    message.className = 'form-message error';
  } finally {
    button.disabled = false;
    button.querySelector('span').textContent = 'Luo ja lataa todistus';
  }
});
