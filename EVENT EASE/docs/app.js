// Event Ease - Static Version for GitHub Pages
class EventEase {
    constructor() {
        this.currentUser = null;
        this.events = [];
        this.bookings = [];
        this.contacts = [];
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.loadSampleEvents();
        this.showSection('home');
    }

    // Local Storage Management
    loadFromStorage() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.events = JSON.parse(localStorage.getItem('events')) || [];
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    saveToStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('events', JSON.stringify(this.events));
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Forms
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    // Navigation
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section, .hero').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load section-specific content
        if (sectionId === 'events') {
            this.renderEvents();
        } else if (sectionId === 'bookings') {
            this.renderBookings();
        }

        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }

    // Sample Data
    loadSampleEvents() {
        if (this.events.length === 0) {
            this.events = [
                {
                    id: 1,
                    title: 'Tech Talk: AI in Education',
                    category: 'Tech Talks',
                    description: 'Explore how artificial intelligence is transforming education.',
                    date: '2024-02-15',
                    time: '14:00',
                    venue: 'Auditorium A',
                    price: 'Free',
                    image: 'https://via.placeholder.com/300x200?text=AI+Tech+Talk'
                },
                {
                    id: 2,
                    title: 'Cultural Fest 2024',
                    category: 'Cultural',
                    description: 'Annual cultural festival featuring music, dance, and drama.',
                    date: '2024-02-20',
                    time: '18:00',
                    venue: 'Main Campus',
                    price: '$10',
                    image: 'https://via.placeholder.com/300x200?text=Cultural+Fest'
                },
                {
                    id: 3,
                    title: 'Startup Pitch Competition',
                    category: 'Entrepreneurship',
                    description: 'Present your startup ideas to industry experts.',
                    date: '2024-02-25',
                    time: '10:00',
                    venue: 'Innovation Hub',
                    price: '$5',
                    image: 'https://via.placeholder.com/300x200?text=Startup+Pitch'
                },
                {
                    id: 4,
                    title: 'Photography Workshop',
                    category: 'Photography',
                    description: 'Learn professional photography techniques.',
                    date: '2024-03-01',
                    time: '13:00',
                    venue: 'Art Studio',
                    price: '$15',
                    image: 'https://via.placeholder.com/300x200?text=Photography'
                },
                {
                    id: 5,
                    title: 'Hackathon 2024',
                    category: 'Hackathons',
                    description: '48-hour coding challenge with amazing prizes.',
                    date: '2024-03-05',
                    time: '09:00',
                    venue: 'Computer Lab',
                    price: 'Free',
                    image: 'https://via.placeholder.com/300x200?text=Hackathon'
                },
                {
                    id: 6,
                    title: 'Sports Tournament',
                    category: 'Sports',
                    description: 'Inter-college sports competition.',
                    date: '2024-03-10',
                    time: '08:00',
                    venue: 'Sports Complex',
                    price: 'Free',
                    image: 'https://via.placeholder.com/300x200?text=Sports'
                }
            ];
            this.saveToStorage();
        }
    }

    // Render Functions
    renderEvents() {
        const eventsGrid = document.getElementById('events-grid');
        if (!eventsGrid) return;

        eventsGrid.innerHTML = this.events.map(event => `
            <div class="event-card">
                <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <span class="event-date">${this.formatDate(event.date)} at ${event.time}</span>
                    <span class="event-price">${event.price}</span>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="app.bookEvent(${event.id})">
                        ${this.isEventBooked(event.id) ? 'Booked' : 'Book Now'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderBookings() {
        const bookingsList = document.getElementById('bookings-list');
        if (!bookingsList) return;

        if (this.bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="text-center">
                    <p>No bookings yet. <a href="#" onclick="app.showSection('events')">Browse events</a> to get started!</p>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = this.bookings.map(booking => {
            const event = this.events.find(e => e.id === booking.eventId);
            return `
                <div class="booking-item">
                    <div class="booking-header">
                        <h3>${event ? event.title : 'Unknown Event'}</h3>
                        <span class="booking-status status-${booking.status}">${booking.status}</span>
                    </div>
                    <p><strong>Date:</strong> ${this.formatDate(booking.date)}</p>
                    <p><strong>Venue:</strong> ${event ? event.venue : 'TBD'}</p>
                    <p><strong>Booked on:</strong> ${this.formatDate(booking.bookedAt)}</p>
                    <button class="btn btn-secondary" onclick="app.cancelBooking(${booking.id})">Cancel Booking</button>
                </div>
            `;
        }).join('');
    }

    // Event Management
    bookEvent(eventId) {
        if (this.isEventBooked(eventId)) {
            this.showNotification('You have already booked this event!', 'warning');
            return;
        }

        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const booking = {
            id: Date.now(),
            eventId: eventId,
            userId: this.currentUser ? this.currentUser.id : 'guest',
            date: event.date,
            status: 'confirmed',
            bookedAt: new Date().toISOString().split('T')[0]
        };

        this.bookings.push(booking);
        this.saveToStorage();
        this.showNotification('Event booked successfully!', 'success');
        this.renderEvents(); // Refresh to show "Booked" status
    }

    cancelBooking(bookingId) {
        this.bookings = this.bookings.filter(b => b.id !== bookingId);
        this.saveToStorage();
        this.showNotification('Booking cancelled successfully!', 'success');
        this.renderBookings();
    }

    isEventBooked(eventId) {
        return this.bookings.some(b => b.eventId === eventId);
    }

    // Form Handlers
    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const contact = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };

        this.contacts.push(contact);
        this.saveToStorage();
        this.showNotification('Message sent successfully!', 'success');
        e.target.reset();
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Simple demo login (in real app, this would be secure)
        if (email && password) {
            this.currentUser = {
                id: Date.now(),
                email: email,
                name: email.split('@')[0]
            };
            this.saveToStorage();
            this.showNotification('Logged in successfully!', 'success');
            this.showSection('home');
        } else {
            this.showNotification('Please enter valid credentials!', 'error');
        }
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions for onclick handlers
function showSection(sectionId) {
    app.showSection(sectionId);
}

function showSignup() {
    app.showNotification('Signup feature coming soon!', 'info');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EventEase();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);