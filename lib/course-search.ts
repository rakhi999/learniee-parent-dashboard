import { promises as fs } from "fs";
import path from "path";
import type { Course, CourseSearchResponse } from "@/lib/types";

let cache: Course[] | null = null;

async function getCourses() {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "data", "courses.json");
  const raw = await fs.readFile(filePath, "utf8");
  cache = JSON.parse(raw) as Course[];
  return cache;
}

function numberParam(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function searchCourses(params: URLSearchParams): Promise<CourseSearchResponse> {
  const courses = await getCourses();
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const grade = (params.get("grade") ?? "").trim();
  const subject = (params.get("subject") ?? "").trim();
  const minPrice = Math.max(0, numberParam(params.get("minPrice"), 0));
  const maxPrice = Math.max(minPrice, numberParam(params.get("maxPrice"), Number.MAX_SAFE_INTEGER));
  const minRating = Math.min(5, Math.max(0, numberParam(params.get("minRating"), 0)));
  const sort = params.get("sort") ?? "recommended";
  const page = Math.max(1, Math.floor(numberParam(params.get("page"), 1)));
  const pageSize = Math.min(12, Math.max(3, Math.floor(numberParam(params.get("pageSize"), 6))));

  let filtered = courses.filter((course) => {
    const matchesQuery =
      !query ||
      course.title.toLowerCase().includes(query) ||
      course.subject.toLowerCase().includes(query) ||
      course.teacher.toLowerCase().includes(query);
    return (
      matchesQuery &&
      (!grade || course.grade === grade) &&
      (!subject || course.subject === subject) &&
      course.price >= minPrice &&
      course.price <= maxPrice &&
      course.rating >= minRating
    );
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating-desc") return b.rating - a.rating || b.reviews - a.reviews;
    return b.rating * Math.log10(b.reviews + 10) - a.rating * Math.log10(a.reviews + 10);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
    filters: {
      grades: Array.from(new Set(courses.map((course) => course.grade))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      subjects: Array.from(new Set(courses.map((course) => course.subject))).sort(),
      maxPrice: Math.max(...courses.map((course) => course.price)),
    },
  };
}
