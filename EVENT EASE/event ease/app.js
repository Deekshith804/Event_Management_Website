// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navigation toggle for mobile
document.querySelector('.nav-toggle').addEventListener('click', function() {
    const nav = document.querySelector('.site-nav');
    nav.classList.toggle('active');
    this.setAttribute('aria-expanded', nav.classList.contains('active'));
});

// Database setup using IndexedDB
const DB_NAME = 'EventEaseDB';
const DB_VERSION = 2;
const BOOKING_STORE = 'bookings';
const CONTACT_STORE = 'contactSubmissions';
const USERS_STORE = 'users';
const THEME_KEY = 'themePreference';
const ACCOUNT_KEY = 'accountDetails';

let db;

// Initialize the database
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // Create bookings store if it doesn't exist
            if (!database.objectStoreNames.contains(BOOKING_STORE)) {
                const bookingStore = database.createObjectStore(BOOKING_STORE, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                bookingStore.createIndex('email', 'email', { unique: false });
                bookingStore.createIndex('event', 'event', { unique: false });
                bookingStore.createIndex('date', 'date', { unique: false });
            }
            
            // Create contact submissions store if it doesn't exist
            if (!database.objectStoreNames.contains(CONTACT_STORE)) {
                const contactStore = database.createObjectStore(CONTACT_STORE, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                contactStore.createIndex('email', 'email', { unique: false });
                contactStore.createIndex('date', 'date', { unique: false });
            }

            // Create users store for auth
            if (!database.objectStoreNames.contains(USERS_STORE)) {
                const users = database.createObjectStore(USERS_STORE, { keyPath: 'email' });
                users.createIndex('email', 'email', { unique: true });
            }
        };
    });
}

// Add a booking to the database
function addBooking(booking) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([BOOKING_STORE], 'readwrite');
        const store = transaction.objectStore(BOOKING_STORE);
        
        // Add date to booking
        booking.date = new Date().toISOString();
        booking.status = 'confirmed';
        
        const request = store.add(booking);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Get all bookings from the database
function getAllBookings() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([BOOKING_STORE], 'readonly');
        const store = transaction.objectStore(BOOKING_STORE);
        const request = store.getAll();
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Delete a booking from the database
function deleteBooking(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([BOOKING_STORE], 'readwrite');
        const store = transaction.objectStore(BOOKING_STORE);
        const request = store.delete(id);
        
        request.onsuccess = () => {
            resolve(true);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Add a contact submission to the database
function addContactSubmission(contact) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([CONTACT_STORE], 'readwrite');
        const store = transaction.objectStore(CONTACT_STORE);
        
        // Add date to contact
        contact.date = new Date().toISOString();
        
        const request = store.add(contact);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Router functionality
const routes = {
    'home': 'home-page',
    'about': 'about-page',
    'categories': 'categories-page',
    'cultural': 'cultural-page',
    'sports': 'sports-page',
    'workshops': 'workshops-page',
    'techtalks': 'techtalks-page',
    'hackathons': 'hackathons-page',
    'social': 'social-page',
    'literary': 'literary-page',
    'esports': 'esports-page',
    'entrepreneurship': 'entrepreneurship-page',
    'photography': 'photography-page',
    'quizzes': 'quizzes-page',
    'alumni': 'alumni-page',
    'bookings': 'bookings-page',
    'map': 'map-page',
    'contact': 'contact-page',
    'login': 'login-page',
    'settings': 'settings-page',
    'payment': 'payment-page'
};

// Handle navigation
function navigateTo(page) {
    // Auth guard: force login if not authenticated
    const isAuthenticated = !!getSession();
    if (!isAuthenticated && page !== 'login') {
        page = 'login';
    }
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    
    // Show the requested page
    const pageId = routes[page] || 'home-page';
    document.getElementById(pageId).classList.add('active');
    
    // Update body page background class while preserving theme
    const preserveDark = document.body.classList.contains('theme-dark');
    document.body.classList.remove('bg-hero', 'bg-events');
    document.body.classList.add(page === 'home' ? 'bg-hero' : 'bg-events');
    if (preserveDark) document.body.classList.add('theme-dark');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + page) {
            link.classList.add('active');
        }
    });
    
    // Update URL
    window.location.hash = page;
    
    // Close mobile nav if open
    document.querySelector('.site-nav').classList.remove('active');
    document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Special handling for bookings page
    if (page === 'bookings') {
        loadBookings();
    }
}

// Theme helpers
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.remove('theme-dark');
    }
}
        
function loadThemePreference() {
    const pref = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(pref);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.checked = pref === 'dark';
}
        
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('change', () => {
        const theme = toggle.checked ? 'dark' : 'light';
        applyTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    });
}

// Account helpers
function prefillFormsWithAccount(account) {
    if (!account) return;
    try {
        document.querySelectorAll('form .form-row input[name="name"]').forEach(input => {
            if (!input.value) input.value = account.name || '';
        });
        document.querySelectorAll('form .form-row input[name="email"]').forEach(input => {
            if (!input.value) input.value = account.email || '';
        });
    } catch (e) {
        console.warn('Prefill error:', e);
    }
}
        
function loadAccountDetails() {
    try {
        const raw = localStorage.getItem(ACCOUNT_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        const nameInput = document.getElementById('accName');
        const emailInput = document.getElementById('accEmail');
        if (nameInput) nameInput.value = data.name || '';
        if (emailInput) emailInput.value = data.email || '';
        return data;
    } catch (e) {
        console.warn('Failed to load account details:', e);
        return null;
    }
}
        
function initAccountForm() {
    const form = document.getElementById('accountForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('accName')?.value || '').trim();
        const email = (document.getElementById('accEmail')?.value || '').trim();
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ name, email }));
        prefillFormsWithAccount({ name, email });
        showToast('Account details saved.');
    });
    const account = loadAccountDetails();
    prefillFormsWithAccount(account);
}

// --- Simple Auth using IndexedDB ---
async function hashText(text) {
    try {
        if (window.crypto && window.crypto.subtle) {
            const enc = new TextEncoder();
            const data = enc.encode(text);
            const digest = await crypto.subtle.digest('SHA-256', data);
            const arr = Array.from(new Uint8Array(digest));
            return arr.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (_) { /* ignore and fallback */ }
    // Fallback: djb2 simple hash (not for production)
    let hash = 5381;
    for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash) + text.charCodeAt(i);
    return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction([USERS_STORE], 'readonly');
        const store = tx.objectStore(USERS_STORE);
        const req = store.get(email);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}

function saveUser(user) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction([USERS_STORE], 'readwrite');
        const store = tx.objectStore(USERS_STORE);
        const req = store.put(user);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

function setSession(user) {
    localStorage.setItem('authUser', JSON.stringify({ email: user.email, name: user.name }));
    // Sync account details for prefill
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ name: user.name || '', email: user.email }));
    updateAuthUI();
}

function clearSession() {
    localStorage.removeItem('authUser');
    updateAuthUI();
}

function getSession() {
    try { return JSON.parse(localStorage.getItem('authUser')); } catch { return null; }
}

function updateAuthUI() {
    const session = getSession();
    const loginNav = document.getElementById('nav-login');
    const settingsNav = document.getElementById('nav-settings');
    const logoutBtn = document.getElementById('logoutBtn');
    const navLinks = document.querySelectorAll('.site-nav .nav-link');
    if (session) {
        if (loginNav) loginNav.textContent = 'Account';
        if (loginNav) loginNav.setAttribute('href', '#settings');
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        // Show all links
        navLinks.forEach(a => {
            const href = a.getAttribute('href') || '';
            if (href === '#login') return; // will act as Account
            a.parentElement.style.display = '';
        });
    } else {
        if (loginNav) loginNav.textContent = 'Login';
        if (loginNav) loginNav.setAttribute('href', '#login');
        if (logoutBtn) logoutBtn.style.display = 'none';
        // Hide all links except Login
        navLinks.forEach(a => {
            const href = a.getAttribute('href') || '';
            if (href === '#login') {
                a.parentElement.style.display = '';
            } else {
                a.parentElement.style.display = 'none';
            }
        });
    }
}

// Load and display bookings
async function loadBookings() {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = '<div class="spinner"></div>';
    
    try {
        const bookings = await getAllBookings();
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>No bookings found.</p>';
            return;
        }
        
        bookingsList.innerHTML = '';
        
        bookings.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(booking => {
            const bookingDate = new Date(booking.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const bookingItem = document.createElement('div');
            bookingItem.className = 'booking-item';
            bookingItem.innerHTML = `
                <div class="booking-info">
                    <h3>${booking.event}</h3>
                    <p><strong>Category:</strong> ${booking.category}</p>
                    <p><strong>Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Booked on:</strong> ${bookingDate}</p>
                    <p><strong>Status:</strong> <span class="status">${booking.status}</span></p>
                </div>
                <div class="booking-actions">
                    <button class="btn secondary delete-booking" data-id="${booking.id}">Cancel</button>
                </div>
            `;
            
            bookingsList.appendChild(bookingItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-booking').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                if (confirm('Are you sure you want to cancel this booking?')) {
                    try {
                        await deleteBooking(id);
                        showToast('Booking cancelled successfully.');
                        loadBookings(); // Reload the bookings list
                    } catch (error) {
                        console.error('Error deleting booking:', error);
                        showToast('Error cancelling booking.', 'error');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsList.innerHTML = '<p>Error loading bookings. Please try again.</p>';
    }
}

// Handle hash changes
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    navigateTo(hash || 'home');
});

// Initial navigation
const initialHash = window.location.hash.substring(1);
navigateTo(initialHash || 'login');

// Set up navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        navigateTo(target);
    });
});

// Handle booking forms (exclude settings/account and auth forms via data-category presence)
document.querySelectorAll('.booking-form').forEach(form => {
    if (!form.hasAttribute('data-category')) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            category: this.getAttribute('data-category'),
            event: this.querySelector('[name="event"]').value,
            name: this.querySelector('[name="name"]').value,
            email: this.querySelector('[name="email"]').value
        };
        
        try {
            // Store booking in database
            const bookingId = await addBooking(formData);
            
            // Store booking data for payment page
            sessionStorage.setItem('currentBooking', JSON.stringify({
                ...formData,
                id: bookingId
            }));
            
            // Navigate to payment page
            navigateTo('payment');
            
            // Update payment summary
            document.getElementById('summaryCategory').textContent = formData.category;
            document.getElementById('summaryEvent').textContent = formData.event;
            document.getElementById('summaryName').textContent = formData.name;
            document.getElementById('summaryEmail').textContent = formData.email;
        } catch (error) {
            console.error('Error saving booking:', error);
            showToast('Error saving booking. Please try again.', 'error');
        }
    });
});

// Handle payment form
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent || 'Pay Now';
        submitBtn.textContent = 'Processing...';
    }
    showToast('Payment successful! Your booking is confirmed.');
    
    // Clear booking data
    sessionStorage.removeItem('currentBooking');
    
    // Navigate back to home after a delay
    setTimeout(() => navigateTo('home'), 2000);
    // Re-enable button shortly after navigation (in case navigation is prevented)
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Pay Now';
        }
    }, 2100);
});

// Handle contact form
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        message: this.querySelector('[name="message"]').value
    };
    
    try {
        await addContactSubmission(formData);
        showToast('Message sent successfully! We will get back to you soon.');
        this.reset();
    } catch (error) {
        console.error('Error saving contact submission:', error);
        showToast('Error sending message. Please try again.', 'error');
    }
});

// Handle map search
document.getElementById('mapSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('mapQuery').value;
    if (query) {
        const encodedQuery = encodeURIComponent(query + ' college campus');
        document.getElementById('mapFrame').src = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
    }
});

// Payment method toggle
document.getElementById('method').addEventListener('change', function() {
    const method = this.value;
    document.getElementById('upiRow').style.display = method === 'upi' ? 'grid' : 'none';
    document.getElementById('cardRow').style.display = method === 'card' ? 'grid' : 'none';
    document.getElementById('netRow').style.display = method === 'netbanking' ? 'grid' : 'none';
});

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'warning') {
        toast.classList.add('warning');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize the application
async function initApp() {
    try {
        await initDatabase();
        console.log('Database initialized successfully');
        
        // Load and set theme preference
        loadThemePreference();
        initThemeToggle();

        // Initialize account form and prefill forms
        initAccountForm();

        // Attach logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                clearSession();
                showToast('Logged out.');
                navigateTo('home');
            });
        }

        // Toggle between sign in and sign up forms
        const showSignIn = document.getElementById('showSignIn');
        const showSignUp = document.getElementById('showSignUp');
        const signInForm = document.getElementById('signInForm');
        const signUpForm = document.getElementById('signUpForm');
        if (showSignIn && showSignUp && signInForm && signUpForm) {
            showSignIn.addEventListener('click', () => {
                signInForm.style.display = '';
                signUpForm.style.display = 'none';
            });
            showSignUp.addEventListener('click', () => {
                signInForm.style.display = 'none';
                signUpForm.style.display = '';
            });
        }

        // Sign Up submit
        if (signUpForm) {
            signUpForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('signupName').value.trim();
                const email = document.getElementById('signupEmail').value.trim().toLowerCase();
                const password = document.getElementById('signupPassword').value;
                const confirm = document.getElementById('signupConfirm').value;
                if (password !== confirm) {
                    showToast('Passwords do not match.', 'error');
                    return;
                }
                try {
                    const existing = await getUserByEmail(email);
                    if (existing) {
                        showToast('An account already exists with this email.', 'warning');
                        return;
                    }
                    const passwordHash = await hashText(password);
                    await saveUser({ email, name, passwordHash, createdAt: new Date().toISOString() });
                    showToast('Account created. You can log in now.');
                    // Switch to sign in
                    if (showSignIn) showSignIn.click();
                    // Prefill sign in email
                    const loginEmail = document.getElementById('loginEmail');
                    if (loginEmail) loginEmail.value = email;
                } catch (err) {
                    console.error(err);
                    showToast('Error creating account.', 'error');
                }
            });
        }

        // Sign In submit
        if (signInForm) {
            signInForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim().toLowerCase();
                const password = document.getElementById('loginPassword').value;
                try {
                    const user = await getUserByEmail(email);
                    if (!user) {
                        showToast('No account found for this email.', 'warning');
                        return;
                    }
                    const passwordHash = await hashText(password);
                    if (passwordHash !== user.passwordHash) {
                        showToast('Invalid credentials.', 'error');
                        return;
                    }
                    setSession(user);
                    showToast('Logged in successfully.');
                    navigateTo('settings');
                    // Populate account fields
                    const acc = { name: user.name || '', email: user.email };
                    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(acc));
                    loadAccountDetails();
                } catch (err) {
                    console.error(err);
                    showToast('Error logging in.', 'error');
                }
            });
        }

        // Reflect auth state in nav
        updateAuthUI();

        // Initialize payment method visibility
        document.getElementById('method').dispatchEvent(new Event('change'));
        
        // Check if we have a booking in session storage for payment page
        if (window.location.hash === '#payment') {
            const bookingData = sessionStorage.getItem('currentBooking');
            if (bookingData) {
                const booking = JSON.parse(bookingData);
                document.getElementById('summaryCategory').textContent = booking.category;
                document.getElementById('summaryEvent').textContent = booking.event;
                document.getElementById('summaryName').textContent = booking.name;
                document.getElementById('summaryEmail').textContent = booking.email;
            }
        }

        // UI: scroll and header behaviors
        const toTopBtn = document.getElementById('toTop');
        function handleScrollUI() {
            const scrolled = window.scrollY || document.documentElement.scrollTop;
            const header = document.querySelector('.site-header');
            if (header) {
                if (scrolled > 80) header.classList.add('shrink');
                else header.classList.remove('shrink');
            }
            if (toTopBtn) {
                if (scrolled > 400) toTopBtn.classList.add('show');
                else toTopBtn.classList.remove('show');
            }
        }
        window.addEventListener('scroll', handleScrollUI, { passive: true });
        if (toTopBtn) {
            toTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        handleScrollUI();

        // Form UX: card number formatting and basic UPI check
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', () => {
                const digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 19);
                cardNumberInput.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
            });
        }
        const upiInput = document.getElementById('upiId');
        if (upiInput) {
            upiInput.addEventListener('blur', () => {
                const value = (upiInput.value || '').trim();
                if (!value) return;
                const isValid = /^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(value);
                if (!isValid) {
                    showToast('Please enter a valid UPI ID (e.g., name@bank)', 'warning');
                }
            });
        }
    } catch (error) {
        console.error('Error initializing application:', error);
        showToast('Error initializing application. Some features may not work.', 'error');
    }
}

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}




