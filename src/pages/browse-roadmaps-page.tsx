import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import RoadmapCard from "@/features/roadmap/components/roadmap-card";

// 1. Khai báo khuôn dữ liệu chuẩn
export interface MasterRoadmap {
  _id?: string;
  id?: string;
  roleName?: string;
  title?: string;
  name?: string;
  role?: string;
  description: string;
  difficulty: string;
  duration: string;
  topicsCount: number;
  tag?: string;
}

export default function BrowseRoadmapsPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [tab, setTab] = useState("recommended");

  const clearFilters = () => {
    setSearch("");
    setRole("all");
    setDifficulty("all");
  };

  const {
    data: rawRoadmaps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["master-roadmaps"],
    queryFn: async () => {
      const response = await apiClient.get("/master-roadmaps");
      return response.data?.data || response.data || [];
    },
  });

  const filteredRoadmaps = useMemo(() => {
    return rawRoadmaps.filter((roadmap: MasterRoadmap) => {
      const titleToSearch =
        roadmap.roleName || roadmap.title || roadmap.name || "";
      const matchSearch =
        search === "" ||
        titleToSearch.toLowerCase().includes(search.toLowerCase());

      const roleToSearch = roadmap.roleName || roadmap.role || "";
      const matchRole =
        role === "all" ||
        roleToSearch.toLowerCase().includes(role.toLowerCase());

      const matchDifficulty =
        difficulty === "all" ||
        roadmap.difficulty?.toLowerCase() === difficulty.toLowerCase();
      return matchSearch && matchRole && matchDifficulty;
    });
  }, [rawRoadmaps, search, role, difficulty]);
  return (
    <div className="animate-in fade-in mx-auto w-full max-w-7xl p-6 duration-500 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Browse all roadmaps
        </h1>
        <p className="text-slate-500">
          Explore curated learning paths and choose the one that fits you best.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="focus:border-brand-purple-500 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none"
        >
          <option value="all">All Roles</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="focus:border-brand-purple-500 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
        </select>

        <input
          type="text"
          placeholder="Search roadmaps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus:border-brand-purple-500 min-w-50 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
        />

        <button
          onClick={clearFilters}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-6">
          {["recommended", "all", "popular", "new"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-bold capitalize transition-colors ${tab === t ? "border-brand-purple-600 text-brand-purple-600 border-b-2" : "text-slate-500 hover:text-slate-800"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="pb-3 text-sm font-medium text-slate-500">
          {filteredRoadmaps.length} roadmaps found
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-spinner loading-lg text-brand-purple-600"></span>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 py-16 text-center text-red-500">
          <p className="text-lg font-bold">Lỗi tải dữ liệu!</p>
          <p className="text-sm">
            Vui lòng kiểm tra lại đường dẫn API Backend.
          </p>
        </div>
      ) : filteredRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredRoadmaps.map((item: MasterRoadmap) => (
            <RoadmapCard key={item._id || item.id} data={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-slate-500">
          <p className="mb-1 text-lg font-bold text-slate-700">
            Không tìm thấy Roadmap nào
          </p>
          <p className="text-sm">
            Chưa có dữ liệu từ Backend hoặc thử xóa bộ lọc tìm kiếm.
          </p>
        </div>
      )}
    </div>
  );
}
