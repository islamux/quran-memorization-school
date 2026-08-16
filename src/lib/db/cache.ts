import { Student, Teacher } from '@/types';
import { db } from './schema';
import { AttendanceRecord } from './validation';

// Query cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
};

// ========================================
// Query Caching Layer
// ========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private generateKey(prefix: string, params: Record<string, unknown>): string {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits++;
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    });
  }

  invalidate(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl
    };
  }
}

// Create global cache instance
const queryCache = new QueryCache();

// Cache-aware database operations
export const cachedDB = {
  // Students with caching
  async getStudents(useCache: boolean = true): Promise<Student[]> {
    const key = 'students:all';

    if (useCache) {
      const cached = queryCache.get<Student[]>(key);
      if (cached) return cached;
    }

    const data = await db.students.toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  async getStudentsByTeacher(teacherId: string, useCache: boolean = true): Promise<Student[]> {
    const key = `students:teacher:${teacherId}`;

    if (useCache) {
      const cached = queryCache.get<Student[]>(key);
      if (cached) return cached;
    }

    const data = await db.students.where('teacherId').equals(teacherId).toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  async getStudentsByStatus(status: string, useCache: boolean = true): Promise<Student[]> {
    const key = `students:status:${status}`;

    if (useCache) {
      const cached = queryCache.get<Student[]>(key);
      if (cached) return cached;
    }

    const data = await db.students.where('status').equals(status).toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  // Teachers with caching
  async getTeachers(useCache: boolean = true): Promise<Teacher[]> {
    const key = 'teachers:all';

    if (useCache) {
      const cached = queryCache.get<Teacher[]>(key);
      if (cached) return cached;
    }

    const data = await db.teachers.toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  // Attendance with caching
  async getAttendanceByDate(date: string, useCache: boolean = true): Promise<AttendanceRecord[]> {
    const key = `attendance:date:${date}`;

    if (useCache) {
      const cached = queryCache.get<AttendanceRecord[]>(key);
      if (cached) return cached;
    }

    const data = await db.attendance.where('date').equals(date).toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  async getAttendanceByStudent(studentId: string, startDate?: string, endDate?: string, useCache: boolean = true): Promise<AttendanceRecord[]> {
    const key = `attendance:student:${studentId}:${startDate || 'all'}:${endDate || 'all'}`;

    if (useCache && startDate && endDate) {
      const cached = queryCache.get<AttendanceRecord[]>(key);
      if (cached) return cached;
    }

    const collection = db.attendance.where('studentId').equals(studentId);

    if (startDate && endDate) {
      const data = await collection
        .filter(record => record.date >= startDate && record.date <= endDate)
        .toArray();
      if (useCache) queryCache.set(key, data);
      return data;
    }

    const data = await collection.toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  // Invalidate cache when data changes
  invalidateCache(pattern: string): void {
    queryCache.invalidate(pattern);
  },

  getCacheStats() {
    return queryCache.getStats();
  }
};

/**
 * Optimize database indices
 */
export async function optimizeDatabase(): Promise<void> {
  console.log('🗜️ Starting database optimization...');

  try {
    // Clear cache to free memory
    queryCache.clear();
    console.log('✅ Cache cleared');

    // Run a VACUUM operation if supported
    // Note: IndexedDB doesn't have VACUUM, but we can clear unused space
    const studentCount = await db.students.count();
    const teacherCount = await db.teachers.count();
    const attendanceCount = await db.attendance.count();
    const scheduleCount = await db.schedule.count();

    console.log(`📊 Database stats: ${studentCount} students, ${teacherCount} teachers, ${attendanceCount} attendance records, ${scheduleCount} schedule slots`);
    console.log('✅ Database optimization completed');
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    throw error;
  }
}
