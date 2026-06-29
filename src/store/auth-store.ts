import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    email: 'admin@edusync.com',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    phone: '+1 (555) 100-0001',
  },
  teacher: {
    id: '2',
    name: 'James Wilson',
    email: 'teacher@edusync.com',
    role: 'teacher',
    avatar: '/avatars/teacher.jpg',
    phone: '+1 (555) 200-0002',
  },
  student: {
    id: '3',
    name: 'Emily Chen',
    email: 'student@edusync.com',
    role: 'student',
    avatar: '/avatars/student.jpg',
    phone: '+1 (555) 300-0003',
  },
  parent: {
    id: '4',
    name: 'Michael Chen',
    email: 'parent@edusync.com',
    role: 'parent',
    avatar: '/avatars/parent.jpg',
    phone: '+1 (555) 400-0004',
  },
  accountant: {
    id: '5',
    name: 'Lisa Park',
    email: 'accountant@edusync.com',
    role: 'accountant',
    avatar: '/avatars/accountant.jpg',
    phone: '+1 (555) 500-0005',
  },
  librarian: {
    id: '6',
    name: 'Robert Taylor',
    email: 'librarian@edusync.com',
    role: 'librarian',
    avatar: '/avatars/librarian.jpg',
    phone: '+1 (555) 600-0006',
  },
};

export const getMockUser = (role: UserRole): User => mockUsers[role];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'edusync-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
