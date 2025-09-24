"use client"

import { useEffect, useState } from "react"
import { ChevronDown, X, BookOpen, Users, Brain, MessageCircle, Zap, Target, Globe, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MarxistTheoryScroll() {
  const [activeSection, setActiveSection] = useState(0)
  const [modalContent, setModalContent] = useState<string | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([])
  const [quizScore, setQuizScore] = useState(0)

  const sections = [
    "hero",
    "problem",
    "objectives",
    "framework",
    "contradictions",
    "class-struggle",
    "case-studies",
    "contemporary",
    "quiz",
    "discussion",
    "resources",
    "footer",
  ]

  const quizCards = [
    {
      question: "Công cụ đá, máy hơi nước, internet... thuộc về giai đoạn phát triển nào của xã hội?",
      answer:
        "Công cụ đá → cộng sản nguyên thủy. Máy hơi nước → tư bản chủ nghĩa. Internet → kinh tế số, thời kỳ hiện đại.",
      points: 10,
    },
    {
      question: "Vì sao lực lượng sản xuất luôn phát triển?",
      answer: "Vì con người luôn sáng tạo ra công cụ, công nghệ và kỹ năng mới để cải thiện năng suất lao động.",
      points: 10,
    },
    {
      question: "Mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất nảy sinh khi nào?",
      answer: "Khi quan hệ sản xuất trở thành xiềng xích kìm hãm sự phát triển của lực lượng sản xuất.",
      points: 15,
    },
    {
      question: "Kiến trúc thượng tầng gồm những yếu tố nào?",
      answer: "Nhà nước, pháp luật, chính trị, tôn giáo, triết học, nghệ thuật, ý thức xã hội.",
      points: 10,
    },
    {
      question: "Quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng là gì?",
      answer:
        "Cơ sở hạ tầng quyết định kiến trúc thượng tầng. Kiến trúc thượng tầng có tác động ngược lại, có thể thúc đẩy hoặc kìm hãm sự phát triển của xã hội.",
      points: 15,
    },
    {
      question:
        "Bạn là công nhân trong xã hội tư bản. Bạn sẽ chọn gì?\n(A) Chấp nhận điều kiện bóc lột.\n(B) Tham gia phong trào công nhân, đấu tranh đòi quyền lợi.",
      answer: "(B) → Vì đấu tranh giai cấp là động lực trực tiếp thúc đẩy thay đổi xã hội.",
      points: 20,
    },
    {
      question: "Đấu tranh giai cấp dẫn đến kết quả gì?",
      answer: "Xóa bỏ quan hệ sản xuất cũ, mở đường cho quan hệ sản xuất mới tiến bộ hơn.",
      points: 15,
    },
    {
      question: "Tại sao xã hội luôn vận động và phát triển mà không đứng yên?",
      answer:
        "Do quy luật biện chứng - phát triển lực lượng sản xuất, mâu thuẫn với quan hệ sản xuất, đấu tranh giai cấp và sự biến đổi của kiến trúc thượng tầng.",
      points: 25,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const currentSection = Math.floor(scrollPosition / windowHeight)
      setActiveSection(Math.min(currentSection, sections.length - 1))

      // Animate sections on scroll
      const elements = document.querySelectorAll(".section-fade-in")
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < windowHeight * 0.8) {
          el.classList.add("visible")
        }
      })

      // Animate timeline items
      const timelineItems = document.querySelectorAll(".timeline-item")
      timelineItems.forEach((item) => {
        const rect = item.getBoundingClientRect()
        if (rect.top < windowHeight * 0.8) {
          item.classList.add("visible")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (index: number) => {
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    })
  }

  const openModal = (content: string) => {
    setModalContent(content)
  }

  const closeModal = () => {
    setModalContent(null)
  }

  const flipQuizCard = () => {
    setQuizAnswers((prev) => {
      const newAnswers = [...prev]
      if (!newAnswers[currentQuiz]) {
        setQuizScore((prevScore) => prevScore + quizCards[currentQuiz].points)
      }
      newAnswers[currentQuiz] = !newAnswers[currentQuiz]
      return newAnswers
    })
  }

  return (
    <div className="relative">
      <div className="educational-video-background"></div>
      <div className="floating-particles">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      <div className="academic-waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">Học thuyết Mác-Lênin</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex space-x-6">
                {[
                  "Trang chủ",
                  "Vấn đề",
                  "Mục tiêu",
                  "Lý thuyết",
                  "Mâu thuẫn",
                  "Đấu tranh",
                  "Minh chứng",
                  "Đương đại",
                  "Quiz",
                  "Thảo luận",
                  "Tài liệu",
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`text-sm transition-colors hover:text-primary ${
                      activeSection === index ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-secondary/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="section-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text floating-animation text-balance">
              Xã hội không bao giờ đứng yên
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto text-balance">
              Hiểu để lý giải, học để tranh biện
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
              Học thuyết hình thái kinh tế – xã hội của chủ nghĩa Mác – Lênin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection(1)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                Khám phá học thuyết <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
              <Button onClick={() => scrollToSection(8)} variant="outline" className="px-8 py-3 text-lg">
                Lý giải vì sao xã hội không đứng yên
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-card/30 to-secondary/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="section-fade-in max-w-5xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-balance">Đặt vấn đề</h2>
            <div
              className="text-xl md:text-2xl leading-relaxed cursor-pointer p-8 rounded-lg bg-card/60 hover:bg-card/80 transition-all duration-300 border border-border backdrop-blur-sm"
              onClick={() => openModal("problem-detail")}
            >
              <p className="text-balance mb-6 font-medium text-primary">
                "Có người cho rằng xã hội càng phát triển thì càng ổn định, nhưng thực tế cho thấy luôn có biến động,
                thay đổi và khủng hoảng."
              </p>
              <p className="text-balance text-lg">
                Vậy tại sao xã hội loài người không đứng yên ổn định mà luôn vận động, phát triển không ngừng?
              </p>
              <p className="text-sm text-muted-foreground mt-6">Nhấp để xem phân tích chi tiết</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Objectives */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Yêu cầu</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: "Trình bày lý thuyết",
                  content:
                    "Học thuyết hình thái kinh tế – xã hội, các khái niệm cơ bản về lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng",
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Vận dụng phân tích",
                  content:
                    "Mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất trong quá trình phát triển lịch sử xã hội",
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Vai trò đấu tranh giai cấp",
                  content: "Hiểu đấu tranh giai cấp như động lực trực tiếp của sự thay đổi và cách mạng xã hội",
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Lý giải trung tâm",
                  content: "Từ đó lý giải vì sao xã hội luôn vận động và biến đổi, không bao giờ đứng yên",
                },
              ].map((objective, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:scale-105 transition-all duration-300 bg-card/60 border-border backdrop-blur-sm"
                  onClick={() => openModal(`objective-${index}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-primary mb-4 flex justify-center">{objective.icon}</div>
                    <h3 className="text-lg font-semibold mb-3 text-balance">{objective.title}</h3>
                    <p className="text-sm text-muted-foreground text-balance leading-relaxed">{objective.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Theoretical Framework */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Khung lý thuyết</h2>
            <p className="text-center text-muted-foreground mb-12 text-lg max-w-3xl mx-auto text-balance">
              Chương 3: Chủ nghĩa duy vật lịch sử - Học thuyết hình thái kinh tế-xã hội
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                {
                  term: "Lực lượng sản xuất (LVSX)",
                  definition: "Bao gồm người lao động, tay nghề, kiến thức, tư liệu sản xuất, kỹ thuật và công nghệ",
                  detail: "Yếu tố quyết định căn bản, luôn phát triển không ngừng",
                },
                {
                  term: "Quan hệ sản xuất (QHSX)",
                  definition:
                    "Mối quan hệ xã hội về sở hữu tư liệu sản xuất, phân phối sản phẩm, phân công lao động xã hội",
                  detail: "Ví dụ: nô lệ-chủ nô; địa chủ-nông dân; tư bản-lao động tiền lương",
                },
                {
                  term: "Kiến trúc thượng tầng (KTTT)",
                  definition:
                    "Các hiện tượng pháp quyền, chính trị, tín ngưỡng, triết học, nghệ thuật; phản ánh và tổ chức đời sống xã hội",
                  detail: "Có tính độc lập tương đối, tác động ngược lại cơ sở hạ tầng",
                },
                {
                  term: "Hình thái kinh tế-xã hội (HTKTXH)",
                  definition: "Trạng thái đồng nhất của LVSX, QHSX và KTTT trong một giai đoạn lịch sử nhất định",
                  detail: "Từ cộng sản nguyên thủy → nô lệ → phong kiến → tư bản → xã hội chủ nghĩa",
                },
              ].map((concept, index) => (
                <div key={index} className="flip-card h-64">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <h3 className="text-lg font-semibold text-balance mb-2">{concept.term}</h3>
                      <p className="text-xs text-muted-foreground">Nhấp để xem định nghĩa</p>
                    </div>
                    <div className="flip-card-back">
                      <p className="text-sm text-balance mb-3">{concept.definition}</p>
                      <p className="text-xs text-primary-foreground/80 italic">{concept.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contradictions Analysis */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Phân tích mâu thuẫn</h2>
            <p className="text-center text-xl text-primary mb-12 font-medium">Lực lượng sản xuất vs Quan hệ sản xuất</p>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="bg-card/60 border-border">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Bản chất mâu thuẫn</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      LVSX luôn tiến lên (cải tiến kỹ thuật, phân công lao động, tăng năng suất), trong khi QHSX là
                      khuôn khổ xã hội (luật chơi, chế độ sở hữu).
                    </p>
                    <p className="text-foreground">
                      Khi LVSX vượt ra khỏi khung QHSX cũ, hệ thống cũ không còn phù hợp → nảy sinh mâu thuẫn.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-accent">Cơ chế chuyển biến</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Tác động của KTTT: quyền lực chính trị có thể trì hoãn hoặc thích nghi bằng cải cách
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Vai trò các chủ thể xã hội: giai cấp thực hiện hành động để thay đổi QHSX
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Bước nhảy lịch sử: khi mâu thuẫn vượt mức, cách mạng xảy ra
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary"></div>
                {[
                  {
                    era: "Cộng sản nguyên thủy",
                    description: "Sở hữu chung, không có giai cấp",
                    detail: "Công cụ đá, săn bắt hái lượm, cộng đồng bình đẳng",
                  },
                  {
                    era: "Chiếm hữu nô lệ",
                    description: "Mâu thuẫn chủ nô - nô lệ",
                    detail: "Nông nghiệp phát triển, xuất hiện thặng dư, phân hóa giai cấp",
                  },
                  {
                    era: "Phong kiến",
                    description: "Mâu thuẫn địa chủ - nông dân",
                    detail: "Thủ công nghiệp, thương nghiệp phát triển, mâu thuẫn với quan hệ địa tô",
                  },
                  {
                    era: "Tư bản chủ nghĩa",
                    description: "Mâu thuẫn tư bản - lao động",
                    detail: "Máy móc sản xuất, công nghiệp hóa, giai cấp công nhân hình thành",
                  },
                  {
                    era: "Xã hội chủ nghĩa",
                    description: "Hướng tới xóa bỏ mâu thuẫn giai cấp",
                    detail: "Sở hữu tập thể, nhà nước công nhân nông dân",
                  },
                  {
                    era: "Cộng sản cao cấp",
                    description: "Xã hội không giai cấp",
                    detail: "Tự động hóa hoàn toàn, phân phối theo nhu cầu",
                  },
                ].map((stage, index) => (
                  <div
                    key={index}
                    className={`timeline-item flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                      <Card className="bg-card/80 border-border hover:bg-card transition-all duration-300">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-primary mb-2 text-lg">{stage.era}</h3>
                          <p className="text-sm text-foreground mb-2 font-medium">{stage.description}</p>
                          <p className="text-xs text-muted-foreground">{stage.detail}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Struggle */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Vai trò đấu tranh giai cấp</h2>
            <div className="max-w-5xl mx-auto">
              <blockquote className="text-2xl md:text-3xl italic mb-6 text-primary font-medium">
                "Lịch sử của mọi xã hội cho đến nay là lịch sử của đấu tranh giai cấp."
              </blockquote>
              <p className="text-right text-muted-foreground mb-12 text-lg">— Karl Marx & Friedrich Engels</p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    title: "Đại diện LVSX mới",
                    description: "Giai cấp mới (hoặc tầng lớp có lợi ích gắn với LVSX mới) muốn thiết lập QHSX phù hợp",
                    icon: <TrendingUp className="h-8 w-8" />,
                  },
                  {
                    title: "Tiền đề tổ chức",
                    description:
                      "Đấu tranh biến mâu thuẫn lan man thành năng lực chính trị tập trung (đảng, liên minh, phong trào)",
                    icon: <Users className="h-8 w-8" />,
                  },
                  {
                    title: "Thay đổi quyền lực",
                    description:
                      "Khi giai cấp giành đủ ảnh hưởng sẽ biến đổi cơ cấu sở hữu, luật lệ, và quan hệ xã hội",
                    icon: <Zap className="h-8 w-8" />,
                  },
                ].map((aspect, index) => (
                  <Card
                    key={index}
                    className="transform transition-all duration-500 hover:scale-105 bg-card/60 border-border"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-primary mb-4 flex justify-center">{aspect.icon}</div>
                      <h3 className="text-lg font-semibold mb-3">{aspect.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{aspect.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Vòng quay lịch sử</h3>
                  <p className="text-lg text-balance leading-relaxed">
                    Sau khi QHSX mới được thiết lập, xã hội bước vào giai đoạn ổn định tương đối — nhưng LVSX tiếp tục
                    phát triển → chu kỳ mâu thuẫn mới bắt đầu.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies with Horizontal Parallax Gallery */}
      <section className="horizontal-parallax-section">
        <div className="horizontal-scroll-wrapper">
          <div className="parallax-img-wrapper parallax-slower">
            <a href="#" rel="noopener">
              <img src="/ancient-communist-society-primitive-tools.jpg" alt="Cộng sản nguyên thủy" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-faster">
            <a href="#" rel="noopener">
              <img src="/ancient-slavery-roman-empire-chains.jpg" alt="Chế độ chiếm hữu nô lệ" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-slower parallax-vertical">
            <a href="#" rel="noopener">
              <img src="/medieval-feudal-castle- peasants-working-fields.jpg" alt="Chế độ phong kiến" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-slower parallax-slower-down">
            <a href="#" rel="noopener">
              <img src="/industrial-revolution-factory-workers-steam-engine.jpg" alt="Chủ nghĩa tư bản" />
            </a>
          </div>

          <div className="parallax-img-wrapper">
            <a href="#" rel="noopener">
              <img src="/russian-revolution-1917-red-flags-workers.jpg" alt="Cách mạng Nga 1917" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-slower">
            <a href="#" rel="noopener">
              <img src="/vietnam-war-independence-ho-chi-minh.jpg" alt="Cách mạng Việt Nam" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-faster1">
            <a href="#" rel="noopener">
              <img src="/modern-china-socialist-construction-buildings.jpg" alt="Xây dựng CNXH Trung Quốc" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-slower parallax-slower2">
            <a href="#" rel="noopener">
              <img src="/digital-economy-ai-robots-future-society.jpg" alt="Kinh tế số và AI" />
            </a>
          </div>

          <div className="parallax-img-wrapper">
            <a href="#" rel="noopener">
              <img src="/global-climate-change-environmental-movement.jpg" alt="Biến đổi khí hậu toàn cầu" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-slower">
            <a href="#" rel="noopener">
              <img src="/future-communist-society-equality-technology.jpg" alt="Xã hội cộng sản tương lai" />
            </a>
          </div>

          <div className="parallax-img-wrapper parallax-slower parallax-last">
            <a href="#" rel="noopener">
              <img src="/world-peace-unity-diverse-people-holding-hands.jpg" alt="Hòa bình thế giới" />
            </a>
          </div>
        </div>

        <div className="parallax-scroll-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M50,67.1c-0.6,0-1.2-0.2-1.8-0.7c-3.8-3.8-7.7-7.7-11.5-11.5c-2.3-2.3,1.2-5.8,3.5-3.5c2.5,2.5,4.9,4.9,7.4,7.4      c0-13.7,0-27.4,0-41.2c0-0.6,0.2-1.2,0.5-1.5c0,0,0,0,0,0c0.4-0.6,1.1-1,2-0.9c13.7,0.3,26.4,7.2,33.5,19.1      C96.5,55.9,84.7,85,60.2,91.6C35.5,98.2,11.6,79.1,11.1,54c-0.1-3.2,4.9-3.2,5,0c0.3,13.8,8.4,26.4,21.3,31.5      c12.5,5,27.1,1.9,36.6-7.5c9.5-9.5,12.5-24.1,7.5-36.6c-4.8-12.1-16.3-20.1-29-21.2c0,12.8,0,25.5,0,38.3      c2.5-2.5,4.9-4.9,7.4-7.4c2.3-2.3,5.8,1.3,3.5,3.5c-3.9,3.9-7.8,7.8-11.8,11.8C51.2,66.9,50.6,67.1,50,67.1z" />
          </svg>
          <span>Cuộn để khám phá lịch sử</span>
        </div>

        <div className="parallax-header">
          <h3>Hành trình lịch sử các hình thái kinh tế - xã hội</h3>
          <p>Từ cộng sản nguyên thủy đến xã hội tương lai</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Gắn kết thực tiễn</h2>
            <p className="text-center text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance">
              Minh chứng đương đại & ứng dụng phân tích hiện đại
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Tự động hóa, AI & kinh tế số",
                  lvsx: "Công nghệ tự động, nền tảng dữ liệu, trí tuệ nhân tạo",
                  contradiction:
                    "Tự động hóa làm giảm nhu cầu lao động tay nghề thấp → bất ổn việc làm, thay đổi quan hệ lao động",
                  consequence: "Xuất hiện các nhóm lợi ích mới (big tech), cần thay đổi chính sách sở hữu dữ liệu",
                  icon: <Brain className="h-8 w-8" />,
                },
                {
                  title: "Biến đổi khí hậu & phát triển bền vững",
                  lvsx: "Công nghiệp nặng, mô hình phát triển dựa trên khai thác tài nguyên",
                  contradiction: "Tăng trưởng kinh tế truyền thống xung đột với bền vững môi trường",
                  consequence: "Tranh chấp về quyền sử dụng đất, đòi hỏi thay đổi trong QHSX để phát triển bền vững",
                  icon: <Globe className="h-8 w-8" />,
                },
                {
                  title: "Kinh tế gig & cấu trúc lao động mới",
                  lvsx: "Nền tảng ứng dụng, hợp đồng ngắn hạn, dữ liệu làm trung tâm",
                  contradiction: "Thiếu an toàn lao động, mâu thuẫn giữa luật lao động cổ điển và tổ chức việc làm mới",
                  consequence: "Xuất hiện phong trào đòi bảo vệ lao động nền tảng, cần điều chỉnh thể chế",
                  icon: <TrendingUp className="h-8 w-8" />,
                },
              ].map((example, index) => (
                <Card key={index} className="bg-card/60 border-border hover:bg-card/80 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">{example.icon}</div>
                    <h3 className="text-lg font-bold mb-4 text-balance">{example.title}</h3>

                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-accent mb-1">LVSX:</h4>
                        <p className="text-muted-foreground">{example.lvsx}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-primary mb-1">Mâu thuẫn:</h4>
                        <p className="text-muted-foreground">{example.contradiction}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Hệ quả:</h4>
                        <p className="text-muted-foreground">{example.consequence}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quiz Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Marx Quest - Flashcard Quiz</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Điểm hiện tại: <span className="text-primary font-bold">{quizScore} XP</span>
            </p>

            <div className="max-w-3xl mx-auto">
              <div className="quiz-card h-80 mb-8 cursor-pointer" onClick={flipQuizCard}>
                <div className={`flip-card-inner ${quizAnswers[currentQuiz] ? "transform rotate-y-180" : ""}`}>
                  <div className="flip-card-front">
                    <h3 className="text-xl font-semibold text-balance mb-4">{quizCards[currentQuiz].question}</h3>
                    <p className="text-sm text-muted-foreground">Nhấp để xem đáp án</p>
                    <p className="text-xs text-accent mt-4">+{quizCards[currentQuiz].points} XP</p>
                  </div>
                  <div className="flip-card-back">
                    <p className="text-lg text-balance mb-4">{quizCards[currentQuiz].answer}</p>
                    <p className="text-sm text-primary-foreground/80">+{quizCards[currentQuiz].points} XP đã cộng!</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-6 mb-8">
                <Button
                  onClick={() => {
                    setCurrentQuiz(Math.max(0, currentQuiz - 1))
                    setQuizAnswers((prev) => {
                      const newAnswers = [...prev]
                      newAnswers[currentQuiz] = false
                      return newAnswers
                    })
                  }}
                  disabled={currentQuiz === 0}
                  variant="outline"
                  className="px-6 py-2"
                >
                  ← Trước
                </Button>

                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {currentQuiz + 1} / {quizCards.length}
                  </span>
                  <div className="flex space-x-1">
                    {quizCards.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentQuiz ? "bg-primary" : quizAnswers[index] ? "bg-accent" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCurrentQuiz(Math.min(quizCards.length - 1, currentQuiz + 1))
                    setQuizAnswers((prev) => {
                      const newAnswers = [...prev]
                      newAnswers[currentQuiz] = false
                      return newAnswers
                    })
                  }}
                  disabled={currentQuiz === quizCards.length - 1}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Sau →
                </Button>
              </div>

              {quizScore >= 100 && (
                <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">🏆 Huy hiệu "Nhà Biện Chứng Trẻ"</h3>
                    <p className="text-muted-foreground">
                      Chúc mừng! Bạn đã hoàn thành xuất sắc bài quiz về học thuyết Mác-Lênin!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Zone */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in text-center">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Thảo luận</h2>
            <div className="max-w-5xl mx-auto space-y-8">
              <Card className="bg-card/60 border-border">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-balance text-primary">
                    Theo bạn, xã hội trong tương lai sẽ vận động theo hướng nào?
                  </h3>
                  <p className="text-muted-foreground text-balance leading-relaxed mb-6">
                    Hãy suy nghĩ về những thay đổi trong công nghệ, kinh tế số, trí tuệ nhân tạo và cách chúng có thể
                    tạo ra những mâu thuẫn mới trong xã hội hiện đại.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Công nghệ & Lao động</h4>
                      <p className="text-muted-foreground">AI có thay thế hoàn toàn lao động con người?</p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Môi trường & Phát triển</h4>
                      <p className="text-muted-foreground">Làm sao cân bằng tăng trưởng và bền vững?</p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Bất bình đẳng & Công bằng</h4>
                      <p className="text-muted-foreground">Khoảng cách giàu nghèo sẽ như thế nào?</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Tài nguyên học tập</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/60 border-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-primary">Giáo trình chính thức</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• Giáo trình triết học Mác – Lênin 2019 (tr. 165–172)</li>
                      <li>• Giáo trình triết học Mác – Lênin 2021 (tr. 305–316)</li>
                      <li>• Chương 3: Chủ nghĩa duy vật lịch sử</li>
                      <li>• Biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-accent">Tài liệu tham khảo</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• Marxists Internet Archive</li>
                      <li>
                        •{" "}
                        <a href="http://www.marxists.org/xlang/index.htm" className="text-primary hover:underline">
                          Tài liệu tiếng Anh
                        </a>
                      </li>
                      <li>• Các nghiên cứu đương đại về lý thuyết Mác</li>
                      <li>• Ứng dụng trong phân tích xã hội hiện đại</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <div className="section-fade-in">
            <h2 className="text-3xl font-bold mb-8">Kết luận</h2>
            <Card className="max-w-5xl mx-auto bg-card/40 border-border backdrop-blur-sm">
              <CardContent className="p-10">
                <blockquote className="text-xl md:text-2xl italic mb-8 text-primary font-medium text-balance">
                  "Chính quy luật biện chứng – phát triển lực lượng sản xuất, mâu thuẫn với quan hệ sản xuất, đấu tranh
                  giai cấp và sự biến đổi của kiến trúc thượng tầng – là nguyên nhân sâu xa khiến xã hội loài người
                  không bao giờ đứng yên mà luôn vận động, biến đổi và tiến lên."
                </blockquote>

                <div className="mt-12 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Minh bạch AI:</strong> AI được sử dụng để hỗ trợ tạo nội dung web (sơ đồ, quiz, visual), mọi
                    lý luận được tham chiếu từ giáo trình Triết học Mác – Lênin 2019, 2021.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    © 2025 Học thuyết hình thái kinh tế - xã hội. Được tạo cho mục đích giáo dục và tranh biện học
                    thuật.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Modal */}
      {modalContent && (
        <div className={`modal-overlay ${modalContent ? "active" : ""}`} onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary">Chi tiết</h3>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="prose prose-invert max-w-none">
              {modalContent === "problem-detail" && (
                <div className="space-y-4">
                  <p className="text-lg mb-4 leading-relaxed">
                    Câu hỏi này đặt ra mâu thuẫn cốt lõi trong quan niệm về sự phát triển xã hội. Nhiều người tin rằng
                    sự tiến bộ dẫn đến ổn định, nhưng thực tế lịch sử cho thấy xã hội luôn trong trạng thái biến động.
                  </p>
                  <p className="leading-relaxed">
                    Học thuyết Mác-Lênin giải thích hiện tượng này thông qua quy luật mâu thuẫn giữa lực lượng sản xuất
                    và quan hệ sản xuất, tạo nên động lực không ngừng cho sự thay đổi xã hội.
                  </p>
                  <div className="bg-secondary/20 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2 text-accent">Hướng dẫn phân tích:</h4>
                    <p className="text-sm text-muted-foreground">
                      Người dùng click vào để đọc khái quát, sau đó đi sâu từng phần lý thuyết, minh chứng lịch sử và
                      ứng dụng đương đại.
                    </p>
                  </div>
                </div>
              )}
              {modalContent?.startsWith("objective-") && (
                <div>
                  <p className="leading-relaxed">
                    Nội dung chi tiết về mục tiêu học tập này được trình bày đầy đủ trong các phần tiếp theo của
                    website, bao gồm lý thuyết, phân tích mâu thuẫn, vai trò đấu tranh giai cấp và minh chứng lịch sử.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
