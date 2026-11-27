import './styles.css'
import cameraPhoto from './assets/camera.jpg'

const app = document.querySelector('#app')

const customerDates = [
  { id: '2026-11-14', label: '14 November', remaining: 4 },
  { id: '2026-11-21', label: '21 November', remaining: 5 },
  { id: '2026-11-28', label: '28 November', remaining: 2 },
]

const adminDates = [
  { id: '2026-11-14', label: '14 November', time: 'kl. 10-15' },
  { id: '2026-11-18', label: '18 November', time: 'kl. 10-15' },
  { id: '2026-11-21', label: '21 November', time: 'kl. 10-15' },
]

const initialBookings = [
  { id: 1, date: '2026-11-14', name: 'Sara Lind', seats: 1 },
  { id: 2, date: '2026-11-14', name: 'Joel Andersson', seats: 1 },
  { id: 3, date: '2026-11-14', name: 'Kim Berg', seats: 1 },
  { id: 4, date: '2026-11-14', name: 'Filippa Kvarg', seats: 1 },
  { id: 5, date: '2026-11-14', name: 'Mary Johnsson', seats: 1 },
  { id: 6, date: '2026-11-14', name: 'Linn Bäck', seats: 1, email: 'Linn.Bäck@gmail.com' },
]

const state = {
  step: 'home',
  selectedDate: customerDates[0].id,
  participantCount: 1,
  customer: { firstName: '', lastName: '', email: '', phone: '', consent: false },
  adminView: 'login',
  adminDate: adminDates[0].id,
  selectedBooking: null,
  bookings: [...initialBookings],
  loginMessage: '',
}

const icons = {
  location: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  calendar: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  people: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3"/><path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M16 5.2a3 3 0 0 1 0 5.6"/></svg>',
  camera: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  card: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
  alert: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/></svg>',
  person: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5 20v-1.5a7 7 0 0 1 14 0V20Z"/></svg>',
}

const icon = (name) => icons[name]
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

function currentCustomerDate() {
  return customerDates.find((date) => date.id === state.selectedDate) ?? customerDates[0]
}

function formatLongDate(dateId) {
  const date = customerDates.find((item) => item.id === dateId)
  return date ? `${date.label.toLowerCase()} 2026` : '14 november 2026'
}

function customerShell(content, className = '') {
  return `<main class="customer-shell ${className}">${content}</main>`
}

function renderHome() {
  return customerShell(`
    <div class="customer-home-grid">
      <h1 class="home-heading">Ta kontroll över din kamera</h1>
      <div class="home-booking">
        <div class="workshop-meta">
          <div class="meta-item">${icon('location')}<span>Södermalm,<br>Stockholm</span></div>
          <div class="meta-item">${icon('card')}<span><strong>1 200kr</strong><small>(inkl. moms)</small></span></div>
        </div>
        <button class="primary-button home-cta" data-go="times">Se tillgängliga tider</button>
      </div>
      <figure class="hero-image">
        <img src="${cameraPhoto}" alt="En kamera fotograferad framifrån" />
      </figure>
      <div class="home-details">
        <section class="workshop-info" aria-labelledby="short-info-heading">
          <div class="workshop-info-copy">
            <h2 id="short-info-heading">Information</h2>
            <p>Workshopen tar plats på Södermalm, Stockholm i ljusrum fotostudio.</p>
            <p>Dagen innehåller korta genomgångar och praktiska fotoövningar, både inne och ute. Därav kläder efter väder.</p>
          </div>
          <div class="workshop-info-summary">
            <h3>Det här ingår</h3>
            <ul class="included-list home-included-list">
              <li>Handledning ingår</li>
              <li>Övningsmaterial ingår</li>
              <li>Fika ingår</li>
              <li class="warning">OBS! Lunch ingår inte</li>
            </ul>
            <button class="text-button" data-go="info">Läs mer</button>
          </div>
        </section>
      </div>
    </div>
  `, 'customer-home')
}

function renderInfo() {
  return customerShell(`
    <button class="step-back" data-go="home">← Tillbaka</button>
    <h1>Allt du behöver veta om workshopen</h1>
    <div class="info-layout">
      <section class="workshop-description" aria-labelledby="workshop-description-heading">
        <h2 id="workshop-description-heading">Plats och upplägg</h2>
        <p>Workshopen tar plats på Södermalm, Stockholm i ljusrum fotostudio.</p>
        <p>Dagen innehåller korta genomgångar och praktiska fotoövningar, både inne och ute. Därav kläder efter väder.</p>
        <p>Det kommer att ingå handledning, övningsmaterial och fika.</p>
      </section>
      <aside class="info-aside" aria-labelledby="info-aside-heading">
        <h2 id="info-aside-heading">Pris och lunch</h2>
        <ul class="included-list info-copy">
          <li>Pris: 1 200 kr inklusive moms.</li>
          <li>Lunch ingår inte.</li>
        </ul>
        <button class="primary-button" data-go="times">Se tillgängliga tider</button>
      </aside>
    </div>
  `, 'info-shell')
}

function renderTimes() {
  const dateButtons = customerDates.map((date) => `
    <button class="date-option" type="button" data-date="${date.id}" aria-pressed="${date.id === state.selectedDate}">
      <span class="date-label">${icon('calendar')}<span>${date.label}<small>kl. 10-15</small></span></span>
      <span class="availability">${date.remaining} platser kvar<span class="radio-dot" aria-hidden="true"></span></span>
    </button>
  `).join('')

  return customerShell(`
    <button class="step-back" data-go="home">← Tillbaka</button>
    <h1>Välj tid</h1>
    <p class="step-intro">Workshopen hålls vid 3 tillfällen.</p>
    <p class="step-intro">Det finns endast 10 platser per tillfälle.</p>
    <div class="date-list" role="group" aria-label="Välj workshopdatum">${dateButtons}</div>
    <aside class="notice">
      <h2 class="notice-heading">${icon('alert')}Bra att veta</h2>
      <p>Ta med egen kamera där det går att ställa in bländare, slutartid, ISO, laddat batteri och minneskort. Mobilkamera räcker INTE. Extra objektiv behövs inte.</p>
    </aside>
    <button class="primary-button times-cta" data-go="details">Granska bokning</button>
  `, 'times-shell')
}

function renderDetails() {
  const available = currentCustomerDate().remaining
  const maxParticipants = Math.max(1, available)
  const participantOptions = Array.from({ length: maxParticipants }, (_, index) => {
    const count = index + 1
    return `<option value="${count}" ${count === state.participantCount ? 'selected' : ''}>${count} ${count === 1 ? 'person' : 'personer'}</option>`
  }).join('')

  return customerShell(`
    <h1>Dina uppgifter</h1>
    <p class="details-intro">Fyll i uppgifterna för din bokning.</p>
    <form class="booking-form" id="customer-form">
      <div class="form-field">
        <label for="first-name">Förnamn</label>
        <input id="first-name" name="firstName" autocomplete="given-name" required value="${escapeHtml(state.customer.firstName)}">
      </div>
      <div class="form-field">
        <label for="last-name">Efternamn</label>
        <input id="last-name" name="lastName" autocomplete="family-name" required value="${escapeHtml(state.customer.lastName)}">
      </div>
      <div class="form-field">
        <label for="email">E-postadress</label>
        <input id="email" name="email" type="email" autocomplete="email" placeholder="namn@example.se" required value="${escapeHtml(state.customer.email)}">
      </div>
      <div class="form-field">
        <label for="phone">Telefonnummer</label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="070 000 00 00" pattern="[0-9+() -]{7,20}" required value="${escapeHtml(state.customer.phone)}">
      </div>
      <div class="form-field">
        <label for="participants">Antal deltagare</label>
        <select id="participants" name="participants" aria-label="Antal deltagare">${participantOptions}</select>
      </div>
      <label class="consent-row">
        <input type="checkbox" name="consent" required ${state.customer.consent ? 'checked' : ''}>
        <span>Jag godkänner att mina uppgifter används för bokningen.</span>
      </label>
      <button class="primary-button details-cta" type="submit">Granska bokning</button>
    </form>
    <button class="text-button details-back" data-go="times">← Ändra tid</button>
  `, 'details-shell')
}

function renderReview() {
  const date = currentCustomerDate()
  const total = (state.participantCount * 1200).toLocaleString('sv-SE')

  return customerShell(`
    <h1>Granska din bokning</h1>
    <p class="review-workshop">Ta kontroll över din kamera - workshop</p>
    <div class="review-facts">
      <div class="review-fact">${icon('calendar')}<span>Lördag ${formatLongDate(date.id)}</span></div>
      <div class="review-fact">${icon('clock')}<span>Kl. 10:00 - 15:00</span></div>
      <div class="review-fact">${icon('location')}<span>Södermalm, Stockholm</span></div>
      <div class="review-fact">${icon('people')}<span>${state.participantCount} deltagare · Max 10 deltagare</span></div>
      <div class="review-fact">${icon('camera')}<span><em>OBS! Glöm ej kameran</em></span></div>
    </div>
    <section class="payment-block">
      <h2>Betalning</h2>
      <div class="payment-total">${icon('card')}<p><strong>Totalt: ${total} kr</strong><small>Betalas på plats.</small></p></div>
    </section>
    <button class="primary-button review-cta" data-action="confirm-booking">Bekräfta tid</button>
    <button class="text-button review-back" data-go="times">← Ändra tid</button>
  `, 'review-shell')
}

function renderConfirmation() {
  const name = `${state.customer.firstName} ${state.customer.lastName}`.trim()
  const date = currentCustomerDate()
  return customerShell(`
    <div class="confirmation-mark" aria-hidden="true">✓</div>
    <h1>Tack för din bokning${name ? `, ${escapeHtml(name)}` : ''}!</h1>
    <p>Din plats på workshopen är bokad. Betalning sker på plats.</p>
    <div class="confirmation-card">
      <strong>Ta kontroll över din kamera</strong>
      <span>${formatLongDate(date.id)} · kl. 10:00-15:00</span>
      <span>${state.participantCount} ${state.participantCount === 1 ? 'deltagare' : 'deltagare'}</span>
    </div>
    <button class="primary-button" data-go="home">Till startsidan</button>
  `, 'confirmation-shell')
}

function renderCustomer() {
  const views = {
    home: renderHome,
    info: renderInfo,
    times: renderTimes,
    details: renderDetails,
    review: renderReview,
    confirmed: renderConfirmation,
  }
  app.innerHTML = `<div class="customer-app">${customerHeader()}${views[state.step]?.() ?? renderHome()}</div>`
}

function customerHeader() {
  return `
    <header class="admin-header">
      <a class="brand" href="/" aria-label="Ljusrum – startsida">Ljusrum</a>
      <nav class="admin-header-actions" aria-label="Växla vy">
        <a class="site-switch-link" href="/admin">Admin</a>
      </nav>
    </header>
  `
}

function adminHeader() {
  return `
    <header class="admin-header">
      <a class="brand" href="/" aria-label="Ljusrum – startsida">Ljusrum</a>
      <div class="admin-header-actions">
        <a class="site-switch-link" href="/">Kundsida</a>
        <div class="admin-profile">
          <span class="admin-avatar" aria-hidden="true">AD</span>
          <span class="admin-profile-copy">Admin<small>Administratör</small></span>
        </div>
      </div>
    </header>
  `
}

function renderAdminLogin() {
  return `<div class="admin-app">
    ${adminHeader()}
    <main class="admin-login">
      <p class="login-eyebrow">Administratör</p>
      <h1>Logga in</h1>
      <p class="admin-subtitle">Logga in för att hantera workshops och bokningar.</p>
      <form id="admin-login-form">
        <div class="form-field">
          <label for="admin-email">E-postadress</label>
          <input id="admin-email" name="email" type="email" autocomplete="username" placeholder="namn@example.se" required>
        </div>
        <div class="form-field">
          <label for="admin-password">Lösenord</label>
          <input id="admin-password" name="password" type="password" autocomplete="current-password" placeholder="Ange ditt lösenord" required>
        </div>
        <button class="login-button" type="submit">Logga in</button>
        <p class="login-message" role="status">${escapeHtml(state.loginMessage)}</p>
        <button class="text-button forgot-button" type="button" data-action="forgot-password">Glömt lösenord?</button>
      </form>
    </main>
  </div>`
}

function renderBookingRows(bookings) {
  if (!bookings.length) return '<p class="empty-bookings">Inga bokningar för det här datumet ännu.</p>'
  return bookings.map((booking) => `
    <div class="booking-row">
      <span class="booking-person"><span class="person-icon">${icon('person')}</span>${escapeHtml(booking.name)}</span>
      <span class="booking-number">${booking.id}</span>
      <span class="booking-seats">${booking.seats}</span>
      <button class="booking-link" type="button" data-booking="${booking.id}" aria-label="Visa bokning ${booking.id}, ${escapeHtml(booking.name)}">Visa bokning →</button>
    </div>
  `).join('')
}

function renderAdminDashboard() {
  const activeDate = adminDates.find((date) => date.id === state.adminDate) ?? adminDates[0]
  const bookings = state.bookings.filter((booking) => booking.date === activeDate.id)
  const remaining = Math.max(0, 10 - bookings.reduce((total, booking) => total + booking.seats, 0))
  const dateButtons = adminDates.map((date) => `
    <button class="admin-date" type="button" data-admin-date="${date.id}" aria-pressed="${date.id === state.adminDate}">
      ${date.label} ${date.time}
    </button>
  `).join('')

  return `<div class="admin-app">
    ${adminHeader()}
    <main class="admin-page">
      <h1>Workshops</h1>
      <p class="admin-subtitle">Välj en visning för att se bokningarna.</p>
      <div class="admin-dates" role="group" aria-label="Filtrera bokningar efter datum">${dateButtons}</div>
      <div class="booking-heading">
        <h2>Bokningar ${activeDate.label}</h2>
        <p class="booking-count">${bookings.length} bokningar- ${remaining} kvar</p>
      </div>
      <section class="booking-table" aria-label="Bokningslista">
        <div class="booking-row booking-row--head" aria-hidden="true">
          <span>Namn</span><span>Bokning</span><span>Antal platser</span><span></span>
        </div>
        ${renderBookingRows(bookings)}
      </section>
    </main>
  </div>`
}

function renderAdminDetail() {
  const booking = state.bookings.find((item) => item.id === state.selectedBooking) ?? initialBookings[5]
  const dateLabel = adminDates.find((date) => date.id === booking.date)?.label.toLowerCase() ?? '14 november'
  const email = booking.email ?? 'Ingen e-postadress finns'

  return `<div class="admin-app">
    ${adminHeader()}
    <main class="admin-page admin-detail">
      <button class="admin-back" type="button" data-action="admin-back">← Tillbaka</button>
      <div class="detail-title">
        <h1>Besökaren</h1>
        <p>Bokning ${booking.id}</p>
      </div>
      <dl class="detail-list">
        <div class="detail-row"><dt>Workshop</dt><dd>Ta kontroll över din kamera</dd></div>
        <div class="detail-row"><dt>Datum och tid</dt><dd>${dateLabel} kl. 10.00-15.00</dd></div>
        <div class="detail-row"><dt>Antal platser</dt><dd>${booking.seats} ${booking.seats === 1 ? 'person' : 'personer'}</dd></div>
        <div class="detail-row"><dt>Namn</dt><dd>${escapeHtml(booking.name)}</dd></div>
        <div class="detail-row"><dt>Mejladress</dt><dd>${escapeHtml(email)}</dd></div>
      </dl>
    </main>
  </div>`
}

function renderAdmin() {
  if (state.adminView === 'dashboard') app.innerHTML = renderAdminDashboard()
  else if (state.adminView === 'detail') app.innerHTML = renderAdminDetail()
  else app.innerHTML = renderAdminLogin()
}

function render() {
  if (location.pathname.startsWith('/admin')) renderAdmin()
  else renderCustomer()
}

function navigateCustomer(step, replace = false) {
  state.step = step
  const url = step === 'home' ? '/' : `/?step=${encodeURIComponent(step)}`
  history[replace ? 'replaceState' : 'pushState']({}, '', url)
  render()
  window.scrollTo(0, 0)
}

function navigateAdmin(view, options = {}, replace = false) {
  state.adminView = view
  if (options.date) state.adminDate = options.date
  if (options.bookingId !== undefined) state.selectedBooking = options.bookingId
  const params = new URLSearchParams()
  params.set('view', view)
  if (view === 'dashboard') params.set('date', state.adminDate)
  if (view === 'detail' && state.selectedBooking !== null) params.set('booking', String(state.selectedBooking))
  history[replace ? 'replaceState' : 'pushState']({}, '', `/admin?${params}`)
  render()
  window.scrollTo(0, 0)
}

function saveCustomerForm(form) {
  const formData = new FormData(form)
  state.customer.firstName = String(formData.get('firstName') ?? '').trim()
  state.customer.lastName = String(formData.get('lastName') ?? '').trim()
  state.customer.email = String(formData.get('email') ?? '').trim()
  state.customer.phone = String(formData.get('phone') ?? '').trim()
  state.customer.consent = formData.get('consent') === 'on'
  state.participantCount = Number(formData.get('participants') ?? 1)
}

app.addEventListener('click', (event) => {
  const dateButton = event.target.closest('[data-date]')
  if (dateButton) {
    state.selectedDate = dateButton.dataset.date
    const max = currentCustomerDate().remaining
    state.participantCount = Math.min(state.participantCount, max)
    render()
    return
  }

  const adminDateButton = event.target.closest('[data-admin-date]')
  if (adminDateButton) {
    navigateAdmin('dashboard', { date: adminDateButton.dataset.adminDate })
    return
  }

  const bookingButton = event.target.closest('[data-booking]')
  if (bookingButton) {
    navigateAdmin('detail', { bookingId: Number(bookingButton.dataset.booking) })
    return
  }

  const goButton = event.target.closest('[data-go]')
  if (goButton) {
    navigateCustomer(goButton.dataset.go)
    return
  }

  const actionButton = event.target.closest('[data-action]')
  if (!actionButton) return

  if (actionButton.dataset.action === 'forgot-password') {
    state.loginMessage = 'Kontakta systemadministratören för att återställa lösenordet.'
    renderAdmin()
  } else if (actionButton.dataset.action === 'admin-back') {
    navigateAdmin('dashboard')
  } else if (actionButton.dataset.action === 'confirm-booking') {
    const name = `${state.customer.firstName} ${state.customer.lastName}`.trim()
    const nextId = Math.max(...state.bookings.map((booking) => booking.id), 0) + 1
    state.bookings.push({
      id: nextId,
      date: state.selectedDate,
      name,
      email: state.customer.email,
      seats: state.participantCount,
    })
    navigateCustomer('confirmed')
  }
})

app.addEventListener('change', (event) => {
  if (event.target.name === 'participants') state.participantCount = Number(event.target.value)
  if (event.target.name === 'consent') state.customer.consent = event.target.checked
})

app.addEventListener('input', (event) => {
  const { name, value } = event.target
  if (Object.hasOwn(state.customer, name)) state.customer[name] = value
})

app.addEventListener('submit', (event) => {
  if (event.target.id === 'customer-form') {
    event.preventDefault()
    saveCustomerForm(event.target)
    navigateCustomer('review')
    return
  }

  if (event.target.id === 'admin-login-form') {
    event.preventDefault()
    const formData = new FormData(event.target)
    if (!String(formData.get('email') ?? '').trim() || !String(formData.get('password') ?? '').trim()) {
      state.loginMessage = 'Fyll i både e-postadress och lösenord.'
      renderAdmin()
      return
    }
    state.loginMessage = ''
    navigateAdmin('dashboard')
  }
})

window.addEventListener('popstate', () => {
  if (location.pathname.startsWith('/admin')) {
    const params = new URLSearchParams(location.search)
    const view = params.get('view')
    state.adminView = view === 'detail' ? 'detail' : view === 'dashboard' ? 'dashboard' : 'login'
    state.adminDate = adminDates.some((date) => date.id === params.get('date'))
      ? params.get('date')
      : adminDates[0].id
    state.selectedBooking = Number(params.get('booking')) || null
    renderAdmin()
  } else {
    const step = new URLSearchParams(location.search).get('step')
    const validSteps = ['home', 'info', 'times', 'details', 'review', 'confirmed']
    state.step = validSteps.includes(step) ? step : 'home'
    renderCustomer()
  }
})

if (location.pathname.startsWith('/admin')) {
  const params = new URLSearchParams(location.search)
  const view = params.get('view')
  state.adminView = view === 'dashboard' ? 'dashboard' : view === 'detail' ? 'detail' : 'login'
  state.adminDate = adminDates.some((date) => date.id === params.get('date'))
    ? params.get('date')
    : adminDates[0].id
  state.selectedBooking = Number(params.get('booking')) || null
} else {
  const step = new URLSearchParams(location.search).get('step')
  if (['info', 'times', 'details', 'review', 'confirmed'].includes(step)) state.step = step
}

render()
