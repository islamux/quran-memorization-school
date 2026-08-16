# Quran Memorization School Management System

*Read this in other languages: [العربية](README.ar.md)*

A simple, clean, and beginner-friendly web application for managing Quran memorization schools. Built with Next.js, TypeScript, and Tailwind CSS.

**Repository**: [https://github.com/islamux/quran-memorization-school](https://github.com/islamux/quran-memorization-school)

## 🌟 Features

### Core Functionality
- **Student Management**: Add, view, edit, and track student progress
- **Teacher Management**: Manage teaching staff and their assignments
- **Schedule Management**: View and organize weekly class schedules
- **Attendance Tracking**: Mark and monitor daily student attendance with detailed reports
- **Dashboard Overview**: Quick insights and statistics
- **Offline Support**: Enhanced offline capabilities with Dexie.js database
- **Multi-language Support**: Full Arabic and English interface with easy language switching
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progressive Web App (PWA)**: Install on Android devices as a native-like app
- **Works Offline**: Full functionality without internet connection
- **Auto Updates**: Automatically updates when new versions are available

### Key Pages
1. **Home Dashboard**: Overview with statistics and quick actions
2. **Students List**: Comprehensive student management with search and filters
3. **Add/Edit Student**: User-friendly forms for student enrollment
4. **Schedule View**: Weekly schedule with detailed class information
5. **Teachers View**: Teacher profiles with detailed information modals
6. **Attendance Page**: Daily attendance marking with status tracking
7. **Attendance Reports**: Comprehensive attendance analytics and reports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or extract the project**
   ```bash
   cd quran-memorization-school
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized pages
│   │   ├── page.tsx       # Home dashboard
│   │   ├── students/      # Student management pages
│   │   ├── schedule/      # Schedule pages
│   │   ├── teachers/      # Teacher pages
│   │   └── attendance/    # Attendance tracking pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── Layout.tsx         # Main layout component
│   ├── LanguageSwitcher.tsx # Language toggle component
│   └── ui/               # UI components (Button, Card, Input)
├── lib/                  # Core libraries
│   └── dexieDB.ts        # Dexie.js database (IndexedDB) + Zod validation
├── messages/             # Internationalization files
│   ├── ar.json          # Arabic translations (default)
│   ├── en.json          # English translations
│   ├── fr.json          # French translations
│   ├── ur.json          # Urdu translations
│   └── id.json          # Indonesian translations
├── types/                # TypeScript type definitions
├── data/                 # Mock data for development
├── utils/                # Utility functions and data helpers
└── globals.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary Green**: Used for branding and primary actions
- **Status Colors**: Green (active), Gray (inactive), Blue (graduated)
- **Background**: Clean gray-50 background with white cards

### Typography
- **Font**: Inter (clean, readable)
- **Hierarchy**: Clear heading and text size distinctions

### Components
- **Cards**: Clean white cards with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline, danger)
- **Forms**: Well-structured with proper validation
- **Navigation**: Responsive with mobile-friendly design

## 📊 Data Structure

### Student Model
```typescript
interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  parentName: string;
  parentPhone: string;
  email?: string;
  enrollmentDate: string;
  currentSurah: string;
  completedSurahs: string[];
  memorizedVerses: number;
  teacherId: string;
  status: 'active' | 'inactive' | 'graduated';
  notes?: string;
}
```

### Attendance Model
```typescript
interface AttendanceRecord {
  id?: number;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  note?: string;
  timestamp: string;
}
```

### Teacher Model
```typescript
interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  students: string[];
  schedule: ScheduleSlot[];
  status: 'active' | 'inactive';
}
```

### Schedule Model
```typescript
interface ScheduleSlot {
  id: string;
  teacherId: string;
  studentIds: string[];
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room?: string;
  type: 'individual' | 'group';
}
```

## 🔧 Customization

### Adding New Features
1. **New Pages**: Add to `src/app/` directory following Next.js App Router conventions
2. **Components**: Create reusable components in `src/components/`
3. **Data Models**: Extend types in `src/types/index.ts`
4. **Styling**: Use Tailwind CSS classes for consistent design

### Storage Options
The application supports multiple storage backends:

1. **Dexie.js (Default)**: IndexedDB-based storage for offline support
2. **Local Storage**: Simple browser storage for basic needs
3. **API Integration**: Ready for backend integration

To switch storage methods, modify `src/utils/storage.ts`.

### Mock Data
Currently uses local mock data in `src/data/mockData.ts`. To integrate with a real backend:

1. Replace data functions in `src/lib/database.ts`
2. Add API calls using fetch or your preferred HTTP client
3. Implement proper error handling and loading states

### Database Integration
For production use, consider integrating with:
- **PostgreSQL** with Prisma ORM
- **MongoDB** with Mongoose
- **Supabase** for quick setup
- **Firebase** for real-time features

## 🎯 Best Practices Implemented

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **Component Structure**: Clean, reusable components
- **Separation of Concerns**: Clear separation between UI, data, and business logic
- **Consistent Naming**: Clear, descriptive variable and function names
- **Internationalization**: Proper i18n setup with next-intl

### User Experience
- **Responsive Design**: Mobile-first approach
- **Multi-language Support**: Seamless switching between Arabic and English
- **Offline Functionality**: Works without internet connection
- **Loading States**: Proper feedback for user actions
- **Form Validation**: Client-side validation with clear error messages
- **Accessibility**: Semantic HTML and proper ARIA labels

### Performance
- **Next.js Optimization**: Automatic code splitting and optimization
- **Efficient Rendering**: Proper use of React hooks and state management
- **Image Optimization**: Next.js automatic image optimization

## 🚀 Deployment

### Netlify (configured)
The repo ships with `netlify.toml` (build command, publish dir `.next`, headers). Import the repo in Netlify and deploy.

### Vercel
```bash
npm run build
```
Vercel auto-detects Next.js — import the repo and deploy.

### Traditional Hosting
```bash
npm run build
npm start
```

> Full details: see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Traditional Hosting
```bash
npm run build
npm start
```

## 🤝 Contributing

This project is designed to be beginner-friendly and open for contributions:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** following the existing code style
4. **Test thoroughly** on both desktop and mobile
5. **Submit a pull request** with a clear description

### Development Guidelines
- Follow the existing TypeScript patterns
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Add proper error handling
- Update documentation for new features

## 📝 License

This project is open source and available under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from Unicode emojis for simplicity
- Designed for Islamic education institutions

## 📞 Support

For questions, suggestions, or contributions:
- Create an issue in the repository
- Follow the contributing guidelines
- Ensure all tests pass before submitting

---

**May this project serve the noble cause of Quran education and memorization. Barakallahu feekum!** 🤲

