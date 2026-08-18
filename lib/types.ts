export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Pick<UserRecord, "id" | "name" | "email" | "createdAt">;

export type Course = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  price: number;
  rating: number;
  reviews: number;
  teacher: string;
  durationWeeks: number;
  schedule: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  accent: string;
};

export type CourseSearchResponse = {
  items: Course[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  filters: {
    grades: string[];
    subjects: string[];
    maxPrice: number;
  };
};
