# URL Tracker Platform

A versatile URL tracker platform with features like geolocation, IP address, device info tracking, and URL shortener.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **URL Tracking**: Track visits to your shared URLs
- **Geolocation**: Capture and display visitor locations on a map
- **IP Address Tracking**: Log IP addresses of visitors
- **Device Info**: Collect information about visitor devices and browsers
- **URL Shortener**: Create short, easy-to-share links
- **Admin Dashboard**: Manage and analyze tracked data
- **Real-time Updates**: View live visitor data
- **Customizable Share Links**: Create personalized tracking links

## Technologies Used

- Next.js
- React
- TypeScript
- Firebase (Realtime Database)
- Leaflet (for maps)
- Tailwind CSS
- Shadcn UI Components

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/url-tracker-platform.git
   ```

2. Navigate to the project directory:
   ```
   cd url-tracker-platform
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up your Firebase configuration:
   - Create a new Firebase project
   - Copy your Firebase configuration
   - Create a `.env.local` file in the root directory
   - Add your Firebase configuration to the `.env.local` file:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Create a new share link from the dashboard.
2. Customize the link with a name, description, and expiration date if desired.
3. Share the generated URL with your audience.
4. Track visits, locations, and other data in real-time from the admin dashboard.

## API Endpoints

- `/api/track`: Endpoint for tracking URL visits
- `/api/shorten`: Endpoint for creating shortened URLs
- `/api/analytics`: Endpoint for retrieving analytics data

For detailed API documentation, please refer to the [API Documentation](docs/api.md) file.


## Contributors

We appreciate the contributions of all our developers. Here are some of our key contributors:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/moeidsaleem">
        <img src="https://github.com/moeidsaleem.png" width="100px;" alt="Moeid Saleem"/>
        <br />
        <sub><b>Moeid  Saleem Khan</b></sub>
      </a>
      <br />
      <sub>CTO / Full Stack Developer</sub>
    </td>
    <!-- Add more contributors as needed -->
  </tr>
</table>

<!-- Add more contributor bios as needed -->



## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
