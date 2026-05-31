import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Lock, 
  Key,
  Search, 
  Filter, 
  Trash2, 
  FileDown, 
  LogOut, 
  User, 
  Phone, 
  Clock, 
  Wallet, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  StickyNote, 
  Eye, 
  EyeOff, 
  MapPin, 
  RefreshCw,
  X,
  MessageCircle,
  Bell
} from "lucide-react";


interface Submission {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  debtAmount: string;
  monthlyIncome?: string;
  dependentsCount?: string;
  hasMoreDebtThanAssets: string;
  region: string;
  difficulties: string[];
  ageGroup: string;
  status: "신청완료" | "상담중" | "서류요청" | "접수완료" | "완료" | "기각";
  counselorNotes: string;
  createdAt: string;
  updatedAt: string;
  isSimpleConsultation?: boolean;
}

interface Article {
  id: string;
  category: string;
  title: string;
  age?: string;
  job?: string;
  originalDebt?: string;
  reducedDebt?: string;
  monthlyPayment?: string;
  reductionRate?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "statistics" | "articles">("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Articles list & editor states
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorCategory, setEditorCategory] = useState("성공사례");
  const [editorContent, setEditorContent] = useState("");
  const [editorAge, setEditorAge] = useState("");
  const [editorJob, setEditorJob] = useState("");
  const [editorOriginalDebt, setEditorOriginalDebt] = useState("");
  const [editorReducedDebt, setEditorReducedDebt] = useState("");
  const [editorMonthlyPayment, setEditorMonthlyPayment] = useState("");
  const [editorReductionRate, setEditorReductionRate] = useState("");
  const [editorError, setEditorError] = useState("");
  const [editorSuccess, setEditorSuccess] = useState("");
  const [editorCreatedAt, setEditorCreatedAt] = useState("");
  const [editorStatus, setEditorStatus] = useState("draft");
  const [statusFilterArticles, setStatusFilterArticles] = useState<string>("all");

  const [isArticleDeleteConfirmOpen, setIsArticleDeleteConfirmOpen] = useState(false);
  const [deleteArticleId, setDeleteArticleId] = useState("");
  const [deleteArticleTitle, setDeleteArticleTitle] = useState("");

  // Change Password Modal States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");

  // Kakao Channel URL Modal States
  const [isKakaoUrlOpen, setIsKakaoUrlOpen] = useState(false);
  const [kakaoUrlVal, setKakaoUrlVal] = useState("");
  const [kakaoUrlError, setKakaoUrlError] = useState("");
  const [kakaoUrlSuccess, setKakaoUrlSuccess] = useState("");

  // Solapi SMS Alert Modal States
  const [isSolapiOpen, setIsSolapiOpen] = useState(false);
  const [solapiApiKey, setSolapiApiKey] = useState("");
  const [solapiApiSecret, setSolapiApiSecret] = useState("");
  const [solapiReceiverPhone, setSolapiReceiverPhone] = useState("");
  const [solapiError, setSolapiError] = useState("");
  const [solapiSuccess, setSolapiSuccess] = useState("");

  // Brand Logo and Lawyer Profile Photo Modal States
  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [logoBase64, setLogoBase64] = useState("");
  const [profileBase64, setProfileBase64] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [imagesSuccess, setImagesSuccess] = useState("");

  // Delete Confirmation and Custom Alert Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmType, setDeleteConfirmType] = useState<"single" | "bulk">("single");
  const [singleDeleteId, setSingleDeleteId] = useState("");
  const [singleDeleteName, setSingleDeleteName] = useState("");

  const [customAlertOpen, setCustomAlertOpen] = useState(false);
  const [customAlertTitle, setCustomAlertTitle] = useState("");
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [customAlertStatus, setCustomAlertStatus] = useState<"success" | "error" | "warning">("success");

  const showCustomAlert = (title: string, message: string, status: "success" | "error" | "warning" = "success") => {
    setCustomAlertTitle(title);
    setCustomAlertMessage(message);
    setCustomAlertStatus(status);
    setCustomAlertOpen(true);
  };

  const handleOpenSolapiModal = async () => {
    setIsSolapiOpen(true);
    setSolapiError("");
    setSolapiSuccess("");
    try {
      const res = await fetch("/api/admin/solapi-config", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data) {
        setSolapiApiKey(data.solapiApiKey || "");
        setSolapiApiSecret(data.solapiApiSecret || "");
        setSolapiReceiverPhone(data.solapiReceiverPhone || "");
      }
    } catch (err) {
      console.error("Error fetching Solapi config:", err);
    }
  };

  const handleUpdateSolapi = async (e: React.FormEvent) => {
    e.preventDefault();
    setSolapiError("");
    setSolapiSuccess("");

    if (!solapiApiKey.trim() || !solapiApiSecret.trim() || !solapiReceiverPhone.trim()) {
      setSolapiError("모든 항목을 올바르게 채워서 넣어 주십시오.");
      return;
    }

    try {
      const res = await fetch("/api/admin/solapi-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          solapiApiKey: solapiApiKey.trim(),
          solapiApiSecret: solapiApiSecret.trim(),
          solapiReceiverPhone: solapiReceiverPhone.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSolapiSuccess("솔라피 실시간 상담 예약 알림 설정이 완료되었습니다!");
        setTimeout(() => {
          setIsSolapiOpen(false);
          setSolapiSuccess("");
        }, 1800);
      } else {
        setSolapiError(data.error || "솔라피 설정 저장에 에러가 발생했습니다.");
      }
    } catch (err) {
      setSolapiError("서버와 통신하는 동안 연결에 실패했습니다.");
    }
  };

  const handleOpenKakaoUrlModal = async () => {
    setIsKakaoUrlOpen(true);
    setKakaoUrlError("");
    setKakaoUrlSuccess("");
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data && data.kakaoChannelUrl) {
        setKakaoUrlVal(data.kakaoChannelUrl);
      }
    } catch (err) {
      console.error("Error fetching config:", err);
    }
  };

  const handleUpdateKakaoUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setKakaoUrlError("");
    setKakaoUrlSuccess("");

    if (!kakaoUrlVal.trim() || !kakaoUrlVal.trim().startsWith("http")) {
      setKakaoUrlError("올바른 http/https 형식의 카카오 채널 주소를 기입해 주십시오.");
      return;
    }

    try {
      const res = await fetch("/api/admin/kakao-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url: kakaoUrlVal.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setKakaoUrlSuccess("카카오톡 비즈니스 채널 주소가 안전하게 설정 변경되었습니다!");
        setTimeout(() => {
          setIsKakaoUrlOpen(false);
          setKakaoUrlSuccess("");
        }, 1800);
      } else {
        setKakaoUrlError(data.error || "카카오 채널 주소 저장 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setKakaoUrlError("네트워크 서버와 통신 도중 실패했습니다.");
    }
  };

  const handleOpenImagesModal = async () => {
    setIsImagesOpen(true);
    setImagesError("");
    setImagesSuccess("");
    try {
      // Get logo image
      const resLogo = await fetch("/api/logo-image");
      const dataLogo = await resLogo.json();
      if (dataLogo && dataLogo.image) {
        setLogoBase64(dataLogo.image);
      } else {
        setLogoBase64("");
      }
      
      // Get profile image
      const resProfile = await fetch("/api/profile-image");
      const dataProfile = await resProfile.json();
      if (dataProfile && dataProfile.image) {
        setProfileBase64(dataProfile.image);
      } else {
        setProfileBase64("");
      }
    } catch (err) {
      console.error("Error loading images config:", err);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "profile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImagesError("이미지 크기는 최대 2MB까지 지원됩니다. 다른 이미지를 선택하세요.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === "logo") {
        setLogoBase64(base64);
      } else {
        setProfileBase64(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateImages = async (e: React.FormEvent) => {
    e.preventDefault();
    setImagesError("");
    setImagesSuccess("");

    try {
      // Update logo image
      const resLogo = await fetch("/api/logo-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ image: logoBase64 })
      });
      if (!resLogo.ok) {
        throw new Error("로고 업로드 중 권한이 없거나 서버 오류가 발생했습니다.");
      }

      // Update profile image
      const resProfile = await fetch("/api/profile-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ image: profileBase64 })
      });
      if (!resProfile.ok) {
        throw new Error("프로필 사진 업로드 중 권한이 없거나 서버 오류가 발생했습니다.");
      }

      setImagesSuccess("로고 및 프로필 사진이 성공적으로 저장되었습니다!");
      
      // Dispatch custom events for live dynamic updates in Header and LawyerIntroduction components
      window.dispatchEvent(new CustomEvent("logo-updated"));
      window.dispatchEvent(new CustomEvent("profile-updated"));

    } catch (err: any) {
      setImagesError(err.message || "이미지 저장 중 오류가 발생했습니다.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");

    if (!newPasswordVal.trim()) {
      setChangePasswordError("새 비밀번호를 입력해 주십시오.");
      return;
    }

    if (newPasswordVal.trim().length < 4) {
      setChangePasswordError("보안 강화를 위해 최소 4자 이상으로 기입해 주십시오.");
      return;
    }

    if (newPasswordVal !== confirmPasswordVal) {
      setChangePasswordError("새 비밀번호와 비밀번호 확인 입력값이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ newPassword: newPasswordVal })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setChangePasswordSuccess("비밀번호가 안전하게 변경되었습니다! 2초 후 보안 세션이 만료되며 새로 로그인이 필요합니다.");
        setNewPasswordVal("");
        setConfirmPasswordVal("");
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setChangePasswordSuccess("");
          handleLogout();
        }, 2200);
      } else {
        setChangePasswordError(data.error || "비밀번호 변경 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setChangePasswordError("네트워크 서버와 통신 도중 실패했습니다.");
    }
  };

  // Load token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchSubmissions(savedToken);
      fetchArticles(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        fetchSubmissions(data.token);
        fetchArticles(data.token);
      } else {
        setAuthError(data.message || "비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      setAuthError("서버와 통신하는 도중 오류가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
    setSubmissions([]);
    setArticles([]);
    setPassword("");
  };

  const fetchSubmissions = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async (authToken?: string) => {
    const currentToken = authToken || token;
    if (!currentToken) return;
    setArticlesLoading(true);
    try {
      const res = await fetch("/api/admin/articles", {
        headers: { "Authorization": `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setSubmissions(prev => 
          prev.map(sub => sub.id === id ? { ...sub, status: newStatus as any, updatedAt: new Date().toISOString() } : sub)
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ counselorNotes: notes })
      });
      if (res.ok) {
        setSubmissions(prev => 
          prev.map(sub => sub.id === id ? { ...sub, counselorNotes: notes, updatedAt: new Date().toISOString() } : sub)
        );
      }
    } catch (err) {
      console.error("Error updating counselor notes:", err);
    }
  };

  const handleDeleteSubmissionClick = (id: string, name: string) => {
    setSingleDeleteId(id);
    setSingleDeleteName(name);
    setDeleteConfirmType("single");
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSubmissionExecute = async () => {
    if (!token || !singleDeleteId) return;
    try {
      const res = await fetch(`/api/submissions/${singleDeleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== singleDeleteId));
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== singleDeleteId));
        showCustomAlert("성공", `${singleDeleteName || "의뢰인"} 정보가 성공적으로 영구 삭제되었습니다.`, "success");
      } else {
        showCustomAlert("오류", "의뢰인 정보 삭제 중 오류가 발생했습니다.", "error");
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
      showCustomAlert("오류", "서버 통신 중 에러가 발생했습니다.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setSingleDeleteId("");
      setSingleDeleteName("");
    }
  };

  const handleOpenEditor = (article: Article | null = null) => {
    setSelectedArticle(article);
    setEditorError("");
    setEditorSuccess("");
    if (article) {
      setEditorTitle(article.title);
      setEditorCategory(article.category);
      setEditorContent(article.content);
      setEditorAge(article.age || "");
      setEditorJob(article.job || "");
      setEditorOriginalDebt(article.originalDebt || "");
      setEditorReducedDebt(article.reducedDebt || "");
      setEditorMonthlyPayment(article.monthlyPayment || "");
      setEditorReductionRate(article.reductionRate ? String(article.reductionRate) : "");
      setEditorCreatedAt(article.createdAt ? new Date(article.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
      setEditorStatus(article.status || "published");
    } else {
      setEditorTitle("");
      setEditorCategory("성공사례");
      setEditorContent(`<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black flex items-center gap-2 mb-4">
    <span>💡 여환동 법무사의 사건 분석 보고서</span>
  </div>

  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-4">
    <div class="space-y-4">
      <div>
        <h4 class="text-sm font-black text-slate-900 flex items-center gap-1.5">
          1. 사실관계
        </h4>
        <p class="text-xs sm:text-[13.5px] text-slate-650 pl-3 mt-1 leading-relaxed">
          [이곳에 의뢰인의 구체적인 나이대, 직종, 채무 급증 경위 등 사실관계를 작성해 주세요]
        </p>
      </div>

      <div>
        <h4 class="text-sm font-black text-slate-900 flex items-center gap-1.5">
          2. 핵심쟁점
        </h4>
        <p class="text-xs sm:text-[13.5px] text-slate-650 pl-3 mt-1 leading-relaxed">
          [이곳에 법원의 엄격한 보정 권고 및 소명 난이도 등의 핵심쟁점을 작성해 주세요]
        </p>
      </div>

      <div>
        <h4 class="text-sm font-black text-slate-900 flex items-center gap-1.5">
          3. 신청전략
        </h4>
        <p class="text-xs sm:text-[13.5px] text-slate-650 pl-3 mt-1 leading-relaxed">
          저희 사무소는 14년 법원 실무 경력의 노하우를 바탕으로, 단순 실패가 아닌 배우자와의 이혼 과정에서 발생한 위자료 및 자녀 양육비 지출 내역을 세부 통장 내역 거래를 통해 1원 단위까지 분리 입증했습니다. 코인 손실금 중 실제 소비로 사라진 부분과 투자 실패로 소멸한 실질 자산을 소명 도표로 정리하여 법원이 요구하는 '최근 채무 소명 자료'를 완벽히 메웠습니다. 또한, 1인 생계비 외에 한부모 가정으로서의 '추가 생계비(자녀 치료비 및 교육비)' 필요성을 강력하게 소명하여 월 소득 대비 가용소득을 최소화하는 데 성공했습니다.
        </p>
      </div>

      <div>
        <h4 class="text-sm font-black text-slate-900 flex items-center gap-1.5">
          4. 인가결정
        </h4>
        <div class="bg-amber-500/[0.03] p-3 rounded-lg border border-amber-500/10 my-2 text-xs sm:text-[13.5px] text-slate-700">
          <ul class="list-none space-y-1.5 pl-1">
            <li><strong>총 채무액:</strong> 1억 2,000만 원</li>
            <li><strong>조정 후 총변제액:</strong> 2,160만 원 (원금의 18%만 변제)</li>
            <li><strong>탕감율:</strong> 82% 면책 결정</li>
            <li><strong>월 변제금:</strong> 60만 원 (36개월 납입)</li>
          </ul>
        </div>
        <p class="text-xs sm:text-[13.5px] text-slate-650 pl-3 leading-relaxed">
          [이곳에 인가결정의 의의 또는 채무자의 갱생 소회를 작성해 주세요]
        </p>
      </div>
    </div>
  </div>
</div>`);
      setEditorAge("");
      setEditorJob("");
      setEditorOriginalDebt("");
      setEditorReducedDebt("");
      setEditorMonthlyPayment("");
      setEditorReductionRate("");
      setEditorCreatedAt(new Date().toISOString().split("T")[0]);
      setEditorStatus("draft");
    }
    setIsEditorModalOpen(true);
  };

  const handleSaveArticle = async (statusVal: "draft" | "published", e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEditorError("");
    setEditorSuccess("");

    if (!editorTitle.trim() || !editorCategory.trim() || !editorContent.trim()) {
      setEditorError("제목, 카테고리, 본문 내용은 필수 기입 요소입니다.");
      return;
    }

    const payload = {
      title: editorTitle.trim(),
      category: editorCategory.trim(),
      content: editorContent.trim(),
      age: editorAge.trim() || undefined,
      job: editorJob.trim() || undefined,
      originalDebt: editorOriginalDebt.trim() || undefined,
      reducedDebt: editorReducedDebt.trim() || undefined,
      monthlyPayment: editorMonthlyPayment.trim() || undefined,
      reductionRate: editorReductionRate.trim() ? Number(editorReductionRate) : undefined,
      status: statusVal,
      createdAt: editorCreatedAt ? new Date(editorCreatedAt).toISOString() : new Date().toISOString()
    };

    try {
      const url = selectedArticle ? `/api/articles/${selectedArticle.id}` : "/api/articles";
      const method = selectedArticle ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setEditorSuccess(statusVal === "draft" ? "글이 임시저장함에 보존되었습니다!" : "성공사례 글이 실시간 등록/배포되었습니다!");
        fetchArticles();
        setTimeout(() => {
          setIsEditorModalOpen(false);
          setSelectedArticle(null);
        }, 1200);
      } else {
        setEditorError(data.error || "글 저장에 실패했습니다.");
      }
    } catch (err) {
      setEditorError("네트워크 통신 중 에러가 발생했습니다.");
    }
  };

  const handleDeleteArticleClick = (id: string, title: string) => {
    setDeleteArticleId(id);
    setDeleteArticleTitle(title);
    setIsArticleDeleteConfirmOpen(true);
  };

  const handleDeleteArticleExecute = async () => {
    if (!token || !deleteArticleId) return;
    try {
      const res = await fetch(`/api/articles/${deleteArticleId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setArticles(prev => prev.filter(art => art.id !== deleteArticleId));
        showCustomAlert("성공", "성공사례/칼럼 글이 안전하게 삭제되었습니다.", "success");
      } else {
        showCustomAlert("오류", "글 삭제 중 에러가 발생했습니다.", "error");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      showCustomAlert("오류", "서버 통신 중 실패했습니다.", "error");
    } finally {
      setIsArticleDeleteConfirmOpen(false);
      setDeleteArticleId("");
      setDeleteArticleTitle("");
    }
  };

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setEditorError("이미지 크기는 최대 3MB까지 가능합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const imgHtml = `<img src="${base64}" alt="첨부사진" style="max-width:100%; height:auto; border-radius:12px; margin: 12px 0; display:block;" />`;
      setEditorContent(prev => prev + imgHtml);
    };
    reader.readAsDataURL(file);
  };

  const togglePhoneReveal = (id: string) => {
    setRevealedPhones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getMaskedPhone = (phone: string, isRevealed: boolean) => {
    if (isRevealed) return phone;
    // Format is like 010-1234-5678, we mask middle numbers
    const parts = phone.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
    return phone.slice(0, 3) + "****" + phone.slice(-4);
  };

  const formatOccupation = (key: string) => {
    switch (key) {
      case "regular_employee": return "직장인 (정규직)";
      case "non_regular_employee": return "직장인 (비정규직)";
      case "business_owner": return "자영업자";
      case "freelancer_parttime": return "프리랜서 / 알바";
      case "no_income": return "무직 / 소득없음";
      default: return key;
    }
  };

  const formatDebtAmount = (id: string) => {
    if (!id) return "미기재";
    const numericVal = parseInt(id, 10);
    if (!isNaN(numericVal)) {
      if (numericVal >= 10000) {
        const eok = Math.floor(numericVal / 10000);
        const man = numericVal % 10000;
        return `${eok}억 ${man > 0 ? man.toLocaleString() + '만' : ''} 원`;
      }
      return `${numericVal.toLocaleString()}만 원`;
    }
    switch (id) {
      case "under_10m": return "1천만 원 미만";
      case "10m_30m": return "1천만 원 ~ 3천만 원";
      case "30m_50m": return "3천만 원 ~ 5천만 원";
      case "50m_100m": return "5천만 원 ~ 1억 원";
      case "over_100m": return "1억 원 이상";
      default: return id;
    }
  };

  const formatIncomeRange = (id?: string) => {
    if (!id) return "미기재 (직종환산)";
    const numericVal = parseInt(id, 10);
    if (!isNaN(numericVal)) {
      return `월 ${numericVal.toLocaleString()}만 원`;
    }
    switch (id) {
      case "under_150": return "150만 원 미만";
      case "150_200": return "150만 원 ~ 200만 원";
      case "200_300": return "200만 원 ~ 300만 원";
      case "300_400": return "300만 원 ~ 400만 원";
      case "over_400": return "400만 원 이상";
      default: return id;
    }
  };

  const formatRegion = (key: string) => {
    if (!key) return "미기재";
    switch (key) {
      case "seoul_metropolitan": return "서울 / 경기 / 인천";
      case "busan_gyeongnam": return "울산 / 부산 / 경남 (전담구역)";
      case "daegu_gyeongbuk": return "대구 / 경북";
      case "daejeon_chungcheong": return "대전 / 충청";
      case "gwangju_jeolla": return "광주 / 전라";
      case "gangwon_jeju": return "강원 / 제주";
      default: return "울산 및 기타";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "신청완료": return "bg-sky-50 text-sky-700 border-sky-200/50";
      case "상담중": return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "서류요청": return "bg-violet-50 text-violet-700 border-violet-200/50";
      case "접수완료": return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "완료": return "bg-slate-100 text-slate-700 border-slate-200";
      case "기각": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  // Export Submissions to CSV format file
  const exportToCSV = () => {
    if (submissions.length === 0) {
      alert("출력할 회신 데이터가 존재하지 않습니다.");
      return;
    }

    const headers = ["ID", "성함", "연락처", "직업유형", "소득유형", "부양가족수", "채무액수", "빚이재산보다많음", "희망거주지역", "상태", "상담자노트", "접수시간"];
    const rows = submissions.map(sub => {
      const isSimple = !!sub.isSimpleConsultation || !sub.occupation;
      return [
        sub.id,
        sub.name,
        sub.phone,
        isSimple ? "미기재 (간편 예약)" : formatOccupation(sub.occupation),
        isSimple ? "미기재 (간편 예약)" : formatIncomeRange(sub.monthlyIncome),
        isSimple ? "미기재 (간편 예약)" : (sub.dependentsCount ? `${sub.dependentsCount}명` : "미지표"),
        isSimple ? "미기재 (간편 예약)" : formatDebtAmount(sub.debtAmount),
        isSimple ? "미기재 (간편 예약)" : (sub.hasMoreDebtThanAssets === "yes" ? "예" : "아니오"),
        isSimple ? "미기재 (간편 예약)" : formatRegion(sub.region),
        sub.status,
        sub.counselorNotes.replace(/\n/g, " "),
        new Date(sub.createdAt).toLocaleString("ko-KR")
      ];
    });

    // Format Excel/CSV UTF-8 string with BOM for Korean character safety
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `여환동법무사_실시간회생신청_DB_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search computation
  const filteredSubmissions = submissions.filter(sub => {
    // Keep only simple consultation submissions (exclude 1-minute self-diagnosis)
    const isSimple = !!sub.isSimpleConsultation || !sub.occupation;
    if (!isSimple) return false;

    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Selective deletion helpers
  const toggleSelectSubmission = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = (checked: boolean) => {
    if (checked) {
      const visibleIds = filteredSubmissions.map(sub => sub.id);
      setSelectedIds(prev => {
        const union = new Set([...prev, ...visibleIds]);
        return Array.from(union);
      });
    } else {
      const visibleIds = filteredSubmissions.map(sub => sub.id);
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    }
  };

  const handleDeleteSelectedClick = () => {
    if (!token) return;
    if (selectedIds.length === 0) {
      showCustomAlert("선택 대상 없음", "삭제할 대상을 먼저 하나 이상 선택해 주십시오.", "warning");
      return;
    }
    setDeleteConfirmType("bulk");
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSelectedExecute = async () => {
    if (!token || selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/submissions/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (res.ok) {
        setSubmissions(prev => prev.filter(sub => !selectedIds.includes(sub.id)));
        setSelectedIds([]);
        showCustomAlert("성공", "선택 정보가 안전하게 일괄 영구 삭제되었습니다.", "success");
      } else {
        const errorData = await res.json();
        showCustomAlert("오류", errorData.error || "일괄 삭제 도중 오류가 발생했습니다.", "error");
      }
    } catch (err) {
      console.error("Error bulk deleting submissions:", err);
      showCustomAlert("오류", "서버 통신 중 실패했습니다.", "error");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // Calculate high level statistics for layout
  const simpleSubmissions = submissions.filter(sub => !!sub.isSimpleConsultation || !sub.occupation);
  const totalInquiries = simpleSubmissions.length;
  const inConsultation = simpleSubmissions.filter(s => s.status === "상담중").length;
  const newRequests = simpleSubmissions.filter(s => s.status === "신청완료").length;
  const completeFiling = simpleSubmissions.filter(s => s.status === "접수완료" || s.status === "완료").length;

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16" id="representative-admin-portal">
      <div className="max-w-6xl mx-auto px-4">
        {/* Verification View Modal / Card */}
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-violet-600" />
                
                <div className="flex flex-col items-center text-center space-y-4 mb-8 pt-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-lg shadow-emerald-50">
                    <Lock className="w-6 h-6 text-emerald-400 stroke-[2]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                      법무사여환동사무소 관리자
                    </h1>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wide uppercase mb-1.5">
                      관리자 등록 비밀번호 (ADMIN PASSKEY)
                    </label>
                    <input
                      type="password"
                      placeholder="설정 파일의 보안 코드를 기입하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 text-center bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-sm shadow-xl shadow-emerald-50 transition-all cursor-pointer"
                  >
                    로그인 하기
                  </button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <button
                    onClick={() => { handleLogout(); onBack(); }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-extrabold transition-all cursor-pointer"
                  >
                    메인 홈화면으로 되돌아가기
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Admin Core Dashboard Layer */
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 animate-fade-in"
            >
              {/* Header Navbar banner */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black tracking-wider uppercase">
                      <Database className="w-3 h-3 text-emerald-400 animate-pulse" />
                      실시간 동기화 완료
                    </span>
                    
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    상담 신청 고객
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full md:w-auto mt-4 md:mt-0">
                  <button
                    onClick={() => fetchSubmissions(token || "")}
                    className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-white/5"
                    title="새로고침"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
                    동기화
                  </button>
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 text-emerald-300 hover:text-emerald-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                    title="대표 비밀번호 변경"
                  >
                    <Key className="w-4 h-4 text-emerald-400" />
                    비밀번호 변경
                  </button>
                  <button
                    onClick={handleOpenImagesModal}
                    className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 text-pink-300 hover:text-pink-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                    title="대표 로고 및 법무사 스마트 프로필 사진 설정"
                  >
                    <User className="w-4 h-4 text-pink-400" />
                    디자인/사진 변경
                  </button>
                   <button
                    onClick={handleOpenKakaoUrlModal}
                    className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 text-amber-300 hover:text-amber-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                    title="카카오톡 1:1 상담 비즈니스 채널 주소 설정"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    카톡 채널 연동
                  </button>
                  <button
                    onClick={handleOpenSolapiModal}
                    className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 text-sky-300 hover:text-sky-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                    title="실시간 상담 예약/종합 진단 제출 시 즉시 SMS 알림 발송 설정"
                  >
                    <Bell className="w-4 h-4 text-sky-450 text-sky-400 animate-pulse" />
                    솔라피 알림 연동
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileDown className="w-4 h-4 text-slate-950" />
                    엑셀(CSV) 내려받기
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    title="안전 로그아웃"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Tab Selector for Admin View */}
              <div className="flex gap-2 border-b border-slate-200 pb-4 mb-6">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    activeTab === "list"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  📋 상담 신청 고객 리스트
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    activeTab === "articles"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  ✍ 성공사례 관리
                </button>
              </div>

              {activeTab === "list" && (
                <>
                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-3xs">
                  <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">누적 총 신청건수</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">{totalInquiries}</span>
                    <span className="text-xs text-slate-400 font-bold">건</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-3xs">
                  <span className="block text-[11px] text-amber-500 font-black uppercase tracking-wider">신규 신청 확인</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">{newRequests}</span>
                    <span className="text-xs text-slate-400 font-bold">건</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-3xs">
                  <span className="block text-[11px] text-emerald-600 font-black uppercase tracking-wider">상담 진행지표</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">{inConsultation}</span>
                    <span className="text-xs text-slate-400 font-bold">건</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-3xs">
                  <span className="block text-[11px] text-indigo-600 font-black uppercase tracking-wider">최종 인가예정건</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-600">{completeFiling}</span>
                    <span className="text-xs text-slate-400 font-bold">건</span>
                  </div>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="성함 혹은 연락처 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Status Tabs filters */}
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end">
                  {["all", "신청완료", "상담중", "서류요청", "접수완료", "완료", "기각"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === filter
                          ? "bg-slate-900 border-slate-900 text-white shadow-3xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50"
                      }`}
                    >
                      {filter === "all" ? "전체 보기" : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selective / Bulk Delete Bar */}
              {submissions.length > 0 && !loading && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-3s flex flex-wrap items-center justify-between gap-3 text-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="select-all-checkbox"
                      checked={filteredSubmissions.length > 0 && filteredSubmissions.every(sub => selectedIds.includes(sub.id))}
                      onChange={(e) => handleSelectAllVisible(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 transition-all cursor-pointer"
                    />
                    <label htmlFor="select-all-checkbox" className="text-xs text-slate-700 font-extrabold cursor-pointer select-none">
                      현재 목록 전체 선택 ({filteredSubmissions.length}건 중 {filteredSubmissions.filter(s => selectedIds.includes(s.id)).length}건 선택됨)
                    </label>
                  </div>

                  {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2.5 animate-fade-in">
                      <span className="text-xs text-rose-600 font-black">
                        총 {selectedIds.length}개 선택됨
                      </span>
                      <button
                        onClick={handleDeleteSelectedClick}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        선택 삭제 (영구 제거)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submissions List Container */}
              <div className="space-y-4">
                {loading ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-sm text-slate-400 font-bold">대표 행정서약 서버로부터 DB를 유도하는 중입니다...</p>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 md:text-sm font-semibold">
                    조건에 해당하는 진단자 인입 데이터가 발견되지 않았습니다.
                  </div>
                ) : (
                  filteredSubmissions.map((sub, idx) => {
                    const isRevealed = !!revealedPhones[sub.id];
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-3xs hover:shadow-xs transition-all relative overflow-hidden"
                      >
                        {/* Upper flex bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(sub.id)}
                              onChange={() => toggleSelectSubmission(sub.id)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-200 transition-all cursor-pointer mr-0.5"
                            />
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-extrabold text-sm border border-slate-200/50">
                              <User className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                 <h3 className="text-base font-black text-slate-900 leading-tight flex items-center gap-1.5">
                                   {sub.name} 
                                   <span className="text-[11px] font-bold text-slate-400">
                                     {sub.isSimpleConsultation || !sub.occupation ? "(간편 상담)" : `(${sub.ageGroup || "나이 미지정"})`}
                                   </span>
                                 </h3>
                                 {/* Region Tag */}
                                 {!(sub.isSimpleConsultation || !sub.occupation) && (
                                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black border border-slate-200/60">
                                     <MapPin className="w-3 h-3" />
                                     {formatRegion(sub.region)}
                                   </span>
                                 )}
                               </div>
                              <p className="text-slate-400 text-[10px] font-medium leading-none mt-1">
                                접수번호: <span className="font-mono text-slate-900 font-bold">{sub.id}</span> | 등록일시: {new Date(sub.createdAt).toLocaleString("ko-KR")}
                              </p>
                            </div>
                          </div>

                          {/* Status Select action and Delete */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <span className="text-[11px] font-black text-slate-400 mr-1.5 hidden sm:inline">상태 관리:</span>
                            <select
                              value={sub.status}
                              onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                              className={`px-3 py-1.5 font-bold rounded-xl text-xs border cursor-pointer outline-none transition-colors ${getStatusColor(sub.status)}`}
                            >
                              <option value="신청완료">신청완료</option>
                              <option value="상담중">상담중</option>
                              <option value="서류요청">서류요청</option>
                              <option value="접수완료">접수완료</option>
                              <option value="완료">완료</option>
                              <option value="기각">기각</option>
                            </select>
                            
                            <button
                              onClick={() => handleDeleteSubmissionClick(sub.id, sub.name)}
                              className="p-2.5 bg-rose-50/50 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-xl transition-all border border-rose-100/30 cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer specifications grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Left Column: Essential details */}
                          <div className="space-y-3.5 bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100">
                            {(() => {
                              const isSimple = !!sub.isSimpleConsultation || !sub.occupation;
                              return (
                                <>
                                  <h4 className="text-[11px] font-black text-slate-400 tracking-wide uppercase border-b border-slate-200/60 pb-1.5 flex items-center justify-between">
                                    <span>{isSimple ? "간편 상담 예약 사양" : "자가진단 분석 지표"}</span>
                                    {isSimple && (
                                      <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">간편 상담</span>
                                    )}
                                  </h4>
                                  
                                  <div className="space-y-2.5 text-xs">
                                    {/* Phone */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400 font-bold flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5" /> 연락처
                                      </span>
                                      <span className="flex items-center gap-1.5 font-mono font-black text-slate-800">
                                        {getMaskedPhone(sub.phone, isRevealed)}
                                        <button
                                          onClick={() => togglePhoneReveal(sub.id)}
                                          className="p-1 rounded-sm hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                                          title={isRevealed ? "가리기" : "번호 보기"}
                                        >
                                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                      </span>
                                    </div>

                                    {/* Occupation */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400 font-bold">직종 형태</span>
                                      <span className={`font-extrabold ${isSimple ? "text-slate-400 font-medium font-sans" : "text-slate-800"}`}>
                                        {isSimple ? "-(간편예약 미입력)" : formatOccupation(sub.occupation)}
                                      </span>
                                    </div>

                                    {/* Monthly Income */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400 font-bold">희망 환산 소득</span>
                                      {isSimple ? (
                                        <span className="text-slate-400 font-medium font-sans">-(간편예약 미입력)</span>
                                      ) : (
                                        <span className="font-extrabold text-slate-900 bg-teal-50 border border-teal-200 text-teal-800 px-1.5 py-0.5 rounded text-[10px]">
                                          {formatIncomeRange(sub.monthlyIncome)}
                                        </span>
                                      )}
                                    </div>

                                    {/* Dependents */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400 font-bold">총 부양가족</span>
                                      <span className={`font-extrabold ${isSimple ? "text-slate-400 font-medium font-sans" : "text-slate-800"}`}>
                                        {isSimple ? "-(간편예약 미입력)" : (sub.dependentsCount ? `본인 포함 ${sub.dependentsCount}명` : "기본 1명 (본인)")}
                                      </span>
                                    </div>

                                    {/* Core asset status */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400 font-bold">부채 &gt; 자산 여부</span>
                                      {isSimple ? (
                                        <span className="text-slate-400 font-medium font-sans">-(간편예약 미입력)</span>
                                      ) : (
                                        <span className="font-black text-slate-900 flex items-center gap-0.5">
                                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                          부채가 더 많음 (적격)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>

                           {/* Middle Column: Debt levels & reasons */}
                           {(() => {
                             const isSimple = !!sub.isSimpleConsultation || !sub.occupation;
                             return (
                               <div className="space-y-4">
                                 <div>
                                   <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wide">
                                     입력된 무담보 채무 범위액
                                   </span>
                                   {isSimple ? (
                                     <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400 font-semibold font-sans">
                                       <Wallet className="w-4 h-4 text-slate-350" />
                                       -(간편 예약 경로 미입력)
                                     </div>
                                   ) : (
                                     <div className="flex items-center gap-1.5 mt-1.5 text-base sm:text-lg font-black text-rose-600">
                                       <Wallet className="w-5 h-5 text-rose-500" />
                                       {formatDebtAmount(sub.debtAmount)}
                                     </div>
                                   )}
                                 </div>

                                 <div>
                                   <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                                     연체 및 채무가 가해온 압력 사유
                                   </span>
                                   <div className="flex flex-wrap gap-1">
                                     {sub.difficulties && sub.difficulties.length > 0 ? (
                                       sub.difficulties.map((diff, index) => {
                                         let label = diff;
                                         if (diff === "high_interest") label = "고금리 대출/일수";
                                         else if (diff === "living_cost") label = "생활비 부족";
                                         else if (diff === "business_hardship") label = "사업 운영 악화";
                                         else if (diff === "scam_guarantee") label = "보증 피해";
                                         else if (diff === "investment_loss") label = "투자/주식/코인";
                                         else if (diff === "medical_cost") label = "의료/병원비";
                                         
                                         const isSpecialIcon = diff === "전화상담" || diff === "카카오톡상담";
                                         return (
                                           <span
                                             key={index}
                                             className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                                               isSpecialIcon
                                                 ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                                                 : "bg-rose-50 border-rose-100 text-rose-700"
                                             }`}
                                           >
                                             #{label}
                                           </span>
                                         );
                                       })
                                     ) : (
                                       <span className="text-slate-400 text-xs font-semibold">선택 사유 없음</span>
                                     )}
                                   </div>
                                 </div>
                               </div>
                             );
                           })()}

                          {/* Right Column: Counselor Notes Workspace */}
                          <div className="space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="flex items-center gap-1 text-[11px] font-black text-slate-400 uppercase tracking-wide">
                                <StickyNote className="w-3.5 h-3.5 text-sky-500" />
                                법률상담 직무 노트 (실시간 기록)
                              </span>
                              <textarea
                                defaultValue={sub.counselorNotes || ""}
                                onBlur={(e) => handleUpdateNotes(sub.id, e.target.value)}
                                placeholder="고객 통화 내용 또는 특이 보정 사항을 기입하고 바깥을 클릭(포커스아웃)하면 자동 실시간 저장됩니다."
                                className="w-full h-24 p-3 bg-indigo-50/20 hover:bg-indigo-50/40 border border-indigo-100 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/80 transition-all placeholder:text-slate-400 placeholder:font-normal leading-relaxed"
                              />
                            </div>
                            <p className="text-[10px] text-right text-emerald-600 font-bold block leading-none">
                              ※ 입력상자를 벗어나면 서버 DB에 즉각 안전 보존됩니다.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              </>
              )}

              {/* Articles Management View */}
              {activeTab === "articles" && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                      <div className="relative w-full md:w-60">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="글 제목 혹은 내용 검색"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      
                      {/* Draft Status Filters */}
                      <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                        {[
                          { key: "all", label: "전체" },
                          { key: "published", label: "등록완료" },
                          { key: "draft", label: "임시저장" }
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            onClick={() => setStatusFilterArticles(btn.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              statusFilterArticles === btn.key
                                ? "bg-slate-900 text-white shadow-3xs"
                                : "text-slate-650 hover:bg-slate-200/50"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleOpenEditor(null)}
                      className="w-full md:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      ✍ 새 성공사례 작성하기
                    </button>
                  </div>

                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articlesLoading ? (
                      <div className="col-span-2 py-20 text-center flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
                        <p className="text-sm text-slate-400 font-bold">칼럼 및 성공사례 목록을 동기화하고 있습니다...</p>
                      </div>
                    ) : articles.length === 0 ? (
                      <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 md:text-sm font-semibold">
                        등록된 성공사례 글이 없습니다. [새 성공사례 작성하기]를 눌러 첫 글을 남겨보세요!
                      </div>
                    ) : (
                      articles
                        .filter(art => {
                          const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesStatus = statusFilterArticles === "all" || 
                                                (statusFilterArticles === "published" && art.status !== "draft") ||
                                                (statusFilterArticles === "draft" && art.status === "draft");
                          return matchesSearch && matchesStatus;
                        })
                        .map((art) => {
                          const isCase = art.category !== "칼럼";
                          const isDraft = art.status === "draft";
                          return (
                            <div key={art.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-3xs flex flex-col justify-between hover:shadow-xs transition-all relative overflow-hidden">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex gap-1.5 items-center">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide border ${
                                      isCase ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-blue-50 border-blue-200 text-blue-700"
                                    }`}>
                                      {art.category}
                                    </span>
                                    {/* Status Badge */}
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                                      isDraft 
                                        ? "bg-slate-50 border-slate-200 text-slate-450 text-slate-500" 
                                        : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    }`}>
                                      {isDraft ? "임시저장" : "등록완료"}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    조회수: {art.views || 0}회 | {new Date(art.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-1">
                                  {art.title}
                                </h3>
                                
                                {isCase && (
                                  <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-extrabold text-slate-600">
                                    <div>
                                      <span className="block text-[9px] text-slate-400 leading-none mb-1">나이/직업</span>
                                      {art.age || "-"} / {art.job || "-"}
                                    </div>
                                    <div>
                                      <span className="block text-[9px] text-slate-400 leading-none mb-1">기존채무</span>
                                      {art.originalDebt || "-"}
                                    </div>
                                    <div>
                                      <span className="block text-[9px] text-slate-400 leading-none mb-1">조정결과</span>
                                      <span className="text-rose-600 font-bold">{art.reducedDebt || "-"}</span>
                                    </div>
                                  </div>
                                )}
                                
                                <div 
                                  className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: art.content.replace(/<[^>]*>/g, '') }}
                                />
                              </div>
                              
                              <div className="flex gap-2 pt-5 border-t border-slate-100 mt-5">
                                <button
                                  onClick={() => handleOpenEditor(art)}
                                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg text-xs transition-colors cursor-pointer"
                                >
                                  수정하기
                                </button>
                                <button
                                  onClick={() => handleDeleteArticleClick(art.id, art.title)}
                                  className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Back */}
              <div className="pt-6 text-center border-t border-slate-200">
                <button
                  onClick={() => { handleLogout(); onBack(); }}
                  className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-xl text-xs transition-colors cursor-pointer"
                >
                  관리자 포탈 닫기 (메인 화면 이동)
                </button>
              </div>

              {/* Password Change Modal */}
              <AnimatePresence>
                {isChangePasswordOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsChangePasswordOpen(false);
                        setChangePasswordError("");
                      }}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Body */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600" />
                      
                      <button
                        onClick={() => {
                          setIsChangePasswordOpen(false);
                          setChangePasswordError("");
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto sm:mx-0">
                          <Key className="w-6 h-6 text-emerald-600" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-black tracking-tight text-slate-900 text-center sm:text-left">
                            대표 관리자 패스코드 변경
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed text-center sm:text-left">
                            나만이 기억할 수 있는 보안 비밀번호로 즉각 안전하게 재설정합니다.
                          </p>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                          <div className="text-left">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              새 관리자 패스코드
                            </label>
                            <input
                              type="password"
                              placeholder="새 비밀번호 입력 (최소 4자 이상)"
                              value={newPasswordVal}
                              onChange={(e) => setNewPasswordVal(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
                              required
                              autoFocus
                            />
                          </div>

                          <div className="text-left">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              새 관리자 패스코드 확인
                            </label>
                            <input
                              type="password"
                              placeholder="동일하게 한 번 더 입력"
                              value={confirmPasswordVal}
                              onChange={(e) => setConfirmPasswordVal(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
                              required
                            />
                          </div>

                          {changePasswordError && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold text-left leading-relaxed">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{changePasswordError}</span>
                            </div>
                          )}

                          {changePasswordSuccess && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-bold text-left leading-relaxed">
                              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                              <span>{changePasswordSuccess}</span>
                            </div>
                          )}

                          <div className="pt-2 flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsChangePasswordOpen(false);
                                setChangePasswordError("");
                              }}
                              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-100 transition-colors cursor-pointer text-center"
                            >
                              변경 완료하기
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Kakao URL Setting Modal */}
              <AnimatePresence>
                {isKakaoUrlOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsKakaoUrlOpen(false);
                        setKakaoUrlError("");
                      }}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Body */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-505 to-yellow-500 bg-[#FEE500]" />
                      
                      <button
                        onClick={() => {
                          setIsKakaoUrlOpen(false);
                          setKakaoUrlError("");
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#FEE500]/20 text-slate-800 flex items-center justify-center mx-auto sm:mx-0">
                          <MessageCircle className="w-6 h-6 text-amber-600" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-black tracking-tight text-slate-900 text-center sm:text-left">
                            카카오톡 비즈니스 채널 연동
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed text-center sm:text-left">
                            상담 신청 예약 완료 시 의뢰인들을 연동된 카카오톡 비즈니스 채널로 즉시 자동 연결시킵니다.
                          </p>
                        </div>

                        <form onSubmit={handleUpdateKakaoUrl} className="space-y-4 pt-2">
                          <div className="text-left">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              카카오톡 채널 주소 (Kakao Link URL)
                            </label>
                            <input
                              type="url"
                              placeholder="예: https://pf.kakao.com/_xcVaxj"
                              value={kakaoUrlVal}
                              onChange={(e) => setKakaoUrlVal(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
                              required
                              autoFocus
                            />
                            <span className="block text-[10px] text-zinc-400 font-medium mt-1 leading-normal">
                              * 법인/비즈니스 카카오 채널 주소를 기입하세요. (예: http://pf.kakao.com/_XXXX)
                            </span>
                          </div>

                          {kakaoUrlError && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold text-left leading-relaxed">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{kakaoUrlError}</span>
                            </div>
                          )}

                          {kakaoUrlSuccess && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-bold text-left leading-relaxed">
                              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                              <span>{kakaoUrlSuccess}</span>
                            </div>
                          )}

                          <div className="pt-2 flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsKakaoUrlOpen(false);
                                setKakaoUrlError("");
                              }}
                              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3.5 bg-[#FEE500] hover:bg-[#FDD835] text-slate-900 font-black rounded-xl text-xs shadow-md transition-colors cursor-pointer text-center"
                            >
                              설정 저장하기
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Solapi SMS Alert Setting Modal */}
              <AnimatePresence>
                {isSolapiOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsSolapiOpen(false);
                        setSolapiError("");
                      }}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Body */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-500 to-sky-600 bg-sky-500" />
                      
                      <button
                        onClick={() => {
                          setIsSolapiOpen(false);
                          setSolapiError("");
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto sm:mx-0">
                          <Bell className="w-6 h-6 animate-swing" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-black tracking-tight text-slate-900 text-center sm:text-left">
                            솔라피(Solapi) SMS 알림 연동
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed text-center sm:text-left">
                            의뢰인이 간편 상담 예약에 일시 지정을 완료하거나 종합 진단을 제출하면, 설정하신 관리자 연락처로 실시간 상세 정보 알림이 문자/카톡 형태로 발송됩니다.
                          </p>
                        </div>

                        <form onSubmit={handleUpdateSolapi} className="space-y-4 pt-2 text-left">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              솔라피 API Key (API_KEY)
                            </label>
                            <input
                              type="text"
                              placeholder="예: NCSOQLMBYMAXFE8U"
                              value={solapiApiKey}
                              onChange={(e) => setSolapiApiKey(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-350"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              솔라피 Secret Key
                            </label>
                            <input
                              type="password"
                              placeholder="예: 7SQ1OC8T3OE7LXBHAS..."
                              value={solapiApiSecret}
                              onChange={(e) => setSolapiApiSecret(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-350"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              알림 전송 수신처 번호
                            </label>
                            <input
                              type="text"
                              placeholder="예: 010-5410-5679"
                              value={solapiReceiverPhone}
                              onChange={(e) => setSolapiReceiverPhone(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-350"
                              required
                            />
                            <span className="block text-[10px] text-zinc-400 font-medium mt-1 leading-normal">
                              * 이 발송 수신 번호는 솔라피 계정에 발신번호(Sender ID)로 등록이 완료된 상태여야 정상 전송됩니다.
                            </span>
                          </div>

                          {solapiError && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold text-left leading-relaxed">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{solapiError}</span>
                            </div>
                          )}

                          {solapiSuccess && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-bold text-left leading-relaxed">
                              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                              <span>{solapiSuccess}</span>
                            </div>
                          )}

                          <div className="pt-2 flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSolapiOpen(false);
                                setSolapiError("");
                              }}
                              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3.5 bg-sky-550 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer text-center"
                            >
                              알림 설정 저장
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
              
              {/* Brand Logo & Lawyer Profile Photo Setting Modal */}
              <AnimatePresence>
                {isImagesOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsImagesOpen(false);
                        setImagesError("");
                      }}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Body */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-500 to-rose-600 bg-pink-500" />
                      
                      <button
                        onClick={() => {
                          setIsImagesOpen(false);
                          setImagesError("");
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto sm:mx-0">
                          <User className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-black tracking-tight text-slate-900 text-center sm:text-left">
                            로고 및 프로필 사진 설정 변경
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed text-center sm:text-left">
                            헤더 로고(모바일/PC 탑 브랜드바) 및 법무사 소개 페이지 대표 프로필 사진을 직접 실시간 업로드하여 최신 상태로 조율합니다.
                          </p>
                        </div>

                        <form onSubmit={handleUpdateImages} className="space-y-5 pt-2 text-left">
                          
                          {/* Part 1: Official Logo Upload */}
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                              1. 공식 홈페이지 로고 (추천: PNG, 크기 120x120px)
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                {logoBase64 ? (
                                  <img src={logoBase64} alt="로고 미리보기" className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-xs text-slate-400 font-bold">없음</span>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange(e, "logo")}
                                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                                />
                                {logoBase64 && (
                                  <button
                                    type="button"
                                    onClick={() => setLogoBase64("")}
                                    className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
                                  >
                                    기본 로고(아이콘)로 초기화
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Part 2: Lawyer Portrait Photo Upload */}
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                              2. 법무사 대표 프로필 사진 (추천: 정장 프로필 이미지)
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-18 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                {profileBase64 ? (
                                  <img src={profileBase64} alt="프로필 미리보기" className="w-full h-full object-cover object-top" />
                                ) : (
                                  <span className="text-xs text-slate-400 font-bold">없음</span>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange(e, "profile")}
                                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                                />
                                {profileBase64 && (
                                  <button
                                    type="button"
                                    onClick={() => setProfileBase64("")}
                                    className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
                                  >
                                    기본 프로필 사진으로 초기화
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {imagesError && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold text-left leading-relaxed">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{imagesError}</span>
                            </div>
                          )}

                          {imagesSuccess && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-bold text-left leading-relaxed">
                              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                              <span>{imagesSuccess}</span>
                            </div>
                          )}

                          <div className="pt-2 flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsImagesOpen(false);
                                setImagesError("");
                              }}
                              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer text-center"
                            >
                              설정 및 사진 저장
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Custom Delete Confirmation Modal */}
              <AnimatePresence>
                {deleteConfirmOpen && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Content */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-650 bg-rose-600" />
                      
                      <button
                        onClick={() => setDeleteConfirmOpen(false)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto sm:mx-0">
                          <Trash2 className="w-6 h-6" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-black tracking-tight text-slate-900 text-center sm:text-left">
                            {deleteConfirmType === "single" ? "의뢰인 정보 영구 삭제" : "선택한 의뢰인 정보 일괄 영구 삭제"}
                          </h3>
                          <p className="text-xs text-slate-500 font-bold leading-relaxed text-center sm:text-left whitespace-pre-line">
                            {deleteConfirmType === "single" 
                              ? `[경고] "${singleDeleteName || "의뢰인"}" 님의 자격 진단 데이터를 실시간 데이터베이스에서 완전히 영구 삭제하시겠습니까?\n이 작업은 복구가 불가능합니다.`
                              : `[경고] 선택된 의뢰인 총 ${selectedIds.length}명의 모든 데이터를 실시간 데이터베이스에서 영구 삭제하시겠습니까?\n이 작업은 복구가 불가능합니다.`}
                          </p>
                        </div>

                        <div className="pt-3 flex gap-2.5">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmOpen(false)}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={deleteConfirmType === "single" ? handleDeleteSubmissionExecute : handleDeleteSelectedExecute}
                            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer text-center"
                          >
                            영구 삭제 승인
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Article WYSIWYG Editor Modal */}
              <AnimatePresence>
                {isEditorModalOpen && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsEditorModalOpen(false);
                        setSelectedArticle(null);
                      }}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Content */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative z-10 border border-slate-100 overflow-y-auto max-h-[90vh] text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 bg-amber-500" />
                      
                      <button
                        onClick={() => {
                          setIsEditorModalOpen(false);
                          setSelectedArticle(null);
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2 text-left">
                        <div className="space-y-1">
                          <h3 className="text-lg font-black tracking-tight text-slate-900">
                            {selectedArticle ? "✍ 성공사례 글 수정" : "✍ 새 성공사례 글 등록"}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                            대표법무사님이 직접 의뢰인 성공사례를 실시간 작성 및 임베딩합니다.
                          </p>
                        </div>

                        <form onSubmit={handleSaveArticle} className="space-y-4 pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                구분 (카테고리)
                              </label>
                              <select
                                value={editorCategory}
                                onChange={(e) => setEditorCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-bold text-slate-800 cursor-pointer"
                              >
                                <option value="코인/투자 채무">🪙 코인/투자 채무</option>
                                <option value="생활비/다중채무">👨‍👩‍👧 생활비/다중채무</option>
                                <option value="사업 실패 채무">💼 사업 실패 채무</option>
                                <option value="생활비/병원비">🏥 생활비/병원비</option>
                                <option value="사기 피해 채무">⚠️ 사기 피해 채무</option>
                                <option value="보증 채무">🤝 보증 채무</option>
                                <option value="성공사례">✨ 일반 성공사례</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                글 제목
                              </label>
                              <input
                                type="text"
                                value={editorTitle}
                                onChange={(e) => setEditorTitle(e.target.value)}
                                placeholder="예: 코인 투자 실패로 인한 채무 급증 해결 사례"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-900 outline-none"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                작성일 지정 (날짜 선택)
                              </label>
                              <input
                                type="date"
                                value={editorCreatedAt}
                                onChange={(e) => setEditorCreatedAt(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                                required
                              />
                            </div>
                          </div>

                          {/* Extra fields if category is NOT column */}
                          {editorCategory !== "칼럼" && (
                            <div className="bg-amber-50/20 p-4 rounded-2xl border border-[#FAF4E5] grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                              <div className="col-span-2 sm:col-span-1">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                  연령대 (예: 20대 후반, 40대 중반)
                                </label>
                                <input
                                  type="text"
                                  value={editorAge}
                                  onChange={(e) => setEditorAge(e.target.value)}
                                  placeholder="20대 후반"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                  직업 (예: IT 프리랜서, 자영업자)
                                </label>
                                <input
                                  type="text"
                                  value={editorJob}
                                  onChange={(e) => setEditorJob(e.target.value)}
                                  placeholder="IT 프리랜서"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                  원래 빚 총액 (예: 6,400만 원)
                                </label>
                                <input
                                  type="text"
                                  value={editorOriginalDebt}
                                  onChange={(e) => setEditorOriginalDebt(e.target.value)}
                                  placeholder="6,400만 원"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                  조정 후 빚 총액 (예: 1,800만 원)
                                </label>
                                <input
                                  type="text"
                                  value={editorReducedDebt}
                                  onChange={(e) => setEditorReducedDebt(e.target.value)}
                                  placeholder="1,800만 원"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                  월 변제금 (예: 50만 원 (36개월))
                                </label>
                                <input
                                  type="text"
                                  value={editorMonthlyPayment}
                                  onChange={(e) => setEditorMonthlyPayment(e.target.value)}
                                  placeholder="50만 원 (36개월)"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                  실제 탕감률 % (예: 72)
                                </label>
                                <input
                                  type="number"
                                  value={editorReductionRate}
                                  onChange={(e) => setEditorReductionRate(e.target.value)}
                                  placeholder="72"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                            </div>
                          )}

                          {/* HTML WYSIWYG Content Area */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                              본문 내용 및 디자인 편집기 (HTML WYSIWYG Editor)
                            </label>
                            
                            {/* Editor Toolbar */}
                            <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-250">
                              <button
                                type="button"
                                onClick={() => setEditorContent(prev => prev + "<b>굵은 텍스트</b>")}
                                className="px-2.5 py-1 text-xs font-black bg-white border border-slate-250 hover:bg-slate-50 rounded cursor-pointer"
                                title="굵게"
                              >
                                굵게 (Bold)
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditorContent(prev => prev + "<u>밑줄</u>")}
                                className="px-2.5 py-1 text-xs font-black bg-white border border-slate-250 hover:bg-slate-50 rounded cursor-pointer"
                                title="밑줄"
                              >
                                밑줄 (Under)
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditorContent(prev => prev + '<h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 20px; margin-bottom: 8px;">소제목2</h2>')}
                                className="px-2.5 py-1 text-xs font-black bg-white border border-slate-250 hover:bg-slate-50 rounded cursor-pointer"
                                title="소제목 H2"
                              >
                                H2
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditorContent(prev => prev + '<h3 style="font-size: 17px; font-weight: 800; color: #AA8010; margin-top: 16px; margin-bottom: 6px;">소제목3</h3>')}
                                className="px-2.5 py-1 text-xs font-black bg-white border border-slate-250 hover:bg-slate-50 rounded cursor-pointer"
                                title="소제목 H3"
                              >
                                H3
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditorContent(prev => prev + "<p style='margin: 10px 0;'>줄바꿈 단락</p>")}
                                className="px-2.5 py-1 text-xs font-black bg-white border border-slate-250 hover:bg-slate-50 rounded cursor-pointer"
                                title="단락 추가"
                              >
                                단락 (P)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const url = prompt("유튜브 동영상 재생 주소나 일반 공유 링크를 붙여넣으세요:\n(예: https://youtu.be/xxxx 혹은 https://www.youtube.com/watch?v=xxxx)");
                                  if (url) {
                                    let videoId = "";
                                    const match1 = url.match(/v=([^&#]+)/);
                                    const match2 = url.match(/youtu\.be\/([^&#\?]+)/);
                                    if (match1) videoId = match1[1];
                                    else if (match2) videoId = match2[1];
                                    
                                    if (videoId) {
                                      const embedHtml = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:16px; margin: 16px 0; border: 1px solid #FAF4E5;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`;
                                      setEditorContent(prev => prev + embedHtml);
                                    } else {
                                      alert("유효한 유튜브 비디오 ID를 인식할 수 없습니다.");
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 text-xs font-black bg-white border border-slate-250 hover:bg-slate-50 rounded text-red-650 cursor-pointer"
                                title="유튜브 비디오 프레임 임베딩"
                              >
                                📺 유튜브 삽입
                              </button>
                              
                              {/* File Portrait Image Upload in toolbar */}
                              <div className="relative inline-block">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditorImageUpload}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-[65px]"
                                />
                                <button
                                  type="button"
                                  className="px-2.5 py-1 text-xs font-black bg-pink-50 border border-pink-250 hover:bg-pink-100 rounded text-pink-700 pointer-events-none"
                                >
                                  📷 사진 첨부
                                </button>
                              </div>
                            </div>

                            {/* Main editing area */}
                            <textarea
                              value={editorContent}
                              onChange={(e) => setEditorContent(e.target.value)}
                              placeholder="위 툴바 버튼을 사용해 서식을 넣거나, HTML 태그를 직접 적어 세련되게 꾸밀 수 있습니다. 이미지나 유튜브 동영상 삽입도 지원합니다."
                              className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none leading-relaxed"
                              required
                            />
                            
                            {/* Live html preview */}
                            {editorContent.trim() && (
                              <div className="space-y-1 mt-4">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wide">🔍 실시간 디자인 미리보기 (Live Design Preview)</span>
                                <div 
                                  className="p-5 border border-amber-100 rounded-2xl bg-amber-50/10 max-h-48 overflow-y-auto text-xs prose"
                                  dangerouslySetInnerHTML={{ __html: editorContent }}
                                />
                              </div>
                            )}
                          </div>

                          {editorError && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold leading-relaxed">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{editorError}</span>
                            </div>
                          )}

                          {editorSuccess && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-bold leading-relaxed">
                              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                              <span>{editorSuccess}</span>
                            </div>
                          )}

                          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditorModalOpen(false);
                                setSelectedArticle(null);
                              }}
                              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center order-3 sm:order-1"
                            >
                              작성 취소
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleSaveArticle("draft", e)}
                              className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold border border-slate-300 rounded-xl text-xs transition-colors cursor-pointer text-center order-2"
                            >
                              임시저장으로 보존 (Draft)
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleSaveArticle("published", e)}
                              className="flex-1 py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shadow-md transition-colors cursor-pointer text-center order-1 sm:order-3"
                            >
                              {selectedArticle ? "성공사례 바로 수정등록" : "성공사례 바로 게시 (Publish)"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Article Delete Confirmation Modal */}
              <AnimatePresence>
                {isArticleDeleteConfirmOpen && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsArticleDeleteConfirmOpen(false)}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Body */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-600" />
                      
                      <button
                        onClick={() => setIsArticleDeleteConfirmOpen(false)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 pt-2 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto sm:mx-0">
                          <Trash2 className="w-6 h-6" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-black tracking-tight text-slate-900">
                            성공사례/칼럼 글 영구 삭제
                          </h3>
                          <p className="text-xs text-slate-500 font-bold leading-relaxed whitespace-pre-line">
                            [경고] 작성하신 글 `"{deleteArticleTitle}"`을 서버 데이터베이스에서 완전히 영구 삭제하시겠습니까?
                            이 작업은 절대 복구할 수 없습니다.
                          </p>
                        </div>

                        <div className="pt-3 flex gap-2.5">
                          <button
                            type="button"
                            onClick={() => setIsArticleDeleteConfirmOpen(false)}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteArticleExecute}
                            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer text-center"
                          >
                            글 영구 삭제 승인
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Custom Alert Modal */}
              <AnimatePresence>
                {customAlertOpen && (
                  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setCustomAlertOpen(false)}
                      className="absolute inset-0 bg-slate-950"
                    />

                    {/* Modal Content */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden text-slate-900 text-center"
                    >
                      <div className={`absolute top-0 inset-x-0 h-1.5 ${
                        customAlertStatus === "success" ? "bg-emerald-500" :
                        customAlertStatus === "error" ? "bg-rose-500" : "bg-amber-500"
                      }`} />

                      <div className="space-y-4 pt-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                          customAlertStatus === "success" ? "bg-emerald-50 text-emerald-600" :
                          customAlertStatus === "error" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {customAlertStatus === "success" ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base font-black tracking-tight text-slate-900">
                            {customAlertTitle}
                          </h3>
                          <p className="text-xs text-slate-500 font-bold leading-relaxed">
                            {customAlertMessage}
                          </p>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setCustomAlertOpen(false)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer text-center"
                          >
                            확인
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
