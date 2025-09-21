# EVENT EASE - College Event Management System

A comprehensive college event management platform that simplifies event planning, promotion, and participation for students and organizers.

## 🚀 Features

- **Event Discovery**: Browse events by categories (Cultural, Sports, Workshops, Tech Talks, etc.)
- **User Authentication**: Secure login/signup system with IndexedDB storage
- **Event Booking**: Easy booking system with payment integration
- **Interactive Map**: Campus venue location finder
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **Real-time Updates**: Dynamic content loading and notifications
- **Contact System**: Built-in messaging for queries and support

## 📋 Event Categories

- **Cultural**: Music, dance, drama, and arts festivals
- **Sports**: Track, field, indoor, and outdoor games
- **Workshops**: Hands-on learning sessions
- **Tech Talks**: Technology seminars and panels
- **Hackathons**: Collaborative coding events
- **Social Impact**: Community drives and volunteering
- **Literary**: Debates, poetry, storytelling
- **E-Sports**: Gaming tournaments
- **Entrepreneurship**: Startup pitches and ideathons
- **Photography**: Photo contests and exhibitions
- **Quizzes**: Academic and general knowledge competitions
- **Alumni**: Networking and mentorship events

## 🛠️ Technology Stack

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **IndexedDB**: Client-side data storage
- **Service Worker**: Offline capabilities

### Backend Options
- **Python Flask**: RESTful API server
- **Node.js/Express**: Alternative backend implementation

## 📦 Installation & Setup

### Prerequisites
- Python 3.7+ (for Flask backend) OR Node.js 14+ (for Express backend)
- Modern web browser with IndexedDB support

### Option 1: Python Flask Backend

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-ease
   ```

2. **Set up Python virtual environment**
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server**
   ```bash
   python app.py
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

### Option 2: Node.js Express Backend

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-ease
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Run the Express server**
   ```bash
   npm start
   # For development with auto-reload:
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000 for Flask, 3000 for Express)

### Database Configuration
The application uses IndexedDB for client-side storage by default. For production, consider implementing a proper database backend.

## 📱 Usage

### For Students
1. **Register/Login**: Create an account or sign in
2. **Browse Events**: Explore different event categories
3. **Book Events**: Select and book events with payment
4. **Manage Bookings**: View and cancel bookings in "My Bookings"
5. **Find Venues**: Use the interactive map to locate event venues
6. **Contact Support**: Reach out via the contact form

### For Organizers
1. **Event Management**: Add and manage events through the admin interface
2. **Booking Tracking**: Monitor event registrations and attendance
3. **Communication**: Respond to student queries via the contact system

## 🎨 Customization

### Themes
The application supports both light and dark themes. Users can toggle between themes in the Settings page.

### Styling
Modify `styles.css` or the embedded styles in `index.html` to customize the appearance.

### Adding New Event Categories
1. Update the categories in the frontend navigation
2. Create corresponding booking forms
3. Add category handling in the backend API

## 🔒 Security Features

- **Input Validation**: All form inputs are validated
- **CORS Protection**: Cross-origin request handling
- **Password Hashing**: Secure password storage using SHA-256
- **Session Management**: Secure user session handling

## 📊 API Endpoints

### Bookings
- `GET /api/bookings` - Retrieve all bookings
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Cancel a booking

### Contacts
- `GET /api/contacts` - Retrieve contact submissions
- `POST /api/contacts` - Submit a contact form

### Health Check
- `GET /api/health` - Server health status

## 🚀 Deployment

### Production Considerations
1. **Database**: Replace in-memory storage with a persistent database (PostgreSQL, MongoDB)
2. **Authentication**: Implement proper JWT-based authentication
3. **File Storage**: Set up cloud storage for event images and documents
4. **SSL/HTTPS**: Enable secure connections
5. **Environment Variables**: Use proper environment configuration
6. **Monitoring**: Add logging and monitoring solutions

### Deployment Platforms
- **Heroku**: Easy deployment with buildpacks
- **Vercel/Netlify**: For static frontend deployment
- **AWS/GCP/Azure**: For scalable cloud deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and queries:
- Create an issue on GitHub
- Use the contact form in the application
- Email: support@eventeaseapp.com

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - Event browsing and booking
  - User authentication
  - Payment integration
  - Interactive map
  - Responsive design

## 🙏 Acknowledgments

- Font: Inter from Google Fonts
- Icons: Custom SVG icons
- Maps: Google Maps integration
- Design inspiration: Modern web design principles

---

**EVENT EASE** - Making college event management simple and accessible for everyone! 🎓✨