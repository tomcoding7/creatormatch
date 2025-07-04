# CreatorMatch

CreatorMatch is a web platform that helps content creators find collaboration partners based on shared interests, goals, and content style. Built with Next.js and Supabase, it provides a modern, user-friendly interface for connecting with other creators.

## Features

- **Smart Matching**: Find creators based on shared interests, goals, and content style
- **Profile Creation**: Create detailed profiles with your content niches, platforms, and preferences
- **Collaboration Ideas**: Get AI-powered suggestions for potential collaborations
- **Real-time Chat**: Connect with matched creators through built-in messaging
- **Mobile-Friendly**: Fully responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Animation**: Framer Motion
- **UI Components**: Headless UI
- **Notifications**: React Hot Toast

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/creator-match.git
   cd creator-match
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main tables in Supabase:

- `creators`: User profiles and preferences
- `matches`: Connection records between creators
- `messages`: Chat messages between matched creators
- `collab_suggestions`: AI-generated collaboration ideas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to [Heroicons](https://heroicons.com/) for the beautiful icons
- Thanks to the Next.js and Supabase teams for the amazing tools #   c r e a t o r m a t c h  
 