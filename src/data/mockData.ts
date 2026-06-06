import type { ScenarioData, ChatMessage } from "@/types"

export const welcomeMessages: ChatMessage[] = [
  { role: "assistant", content: "你好，我是「未来」。我会陪你一起推演即将面临的重要选择。" },
  { role: "assistant", content: "在正式开始之前，我想了解一下你的基本情况。你现在面临的是什么类型的决策呢？" },
]

export const mockScenarioData: ScenarioData = {
  userSummary: "一位来自中等收入家庭的计算机专业大三学生，性格偏向理性分析，重视长期职业发展，希望在学术深度与产业实践之间找到平衡。家庭经济条件一般，父母支持继续深造但不支持二战。",
  researchSummary: "北京大学信科学院2024届保研率约为35%，其中计算机系竞争最为激烈。学院近年推行\"科研早鸟计划\"，大二即可进入实验室。清华软院则更加注重工程实践，校企合作资源丰富，但学术氛围相对薄弱。两校在AI方向的导师资源均处于国内顶尖水平。",
  branches: [
    {
      id: 1, name: "北大信科 · 学术深耕路线", icon: "🎓", shortDesc: "以科研为导向，追求学术深度与顶会论文",
      stages: [
        {
          stage: "大三上学期", period: "2025年9月 - 2026年1月",
          scene: "九月的燕园，银杏叶刚刚开始泛黄。你拖着行李箱回到熟悉的宿舍，窗外的未名湖泛着微光。新学期伊始，你已经收到了\"科研早鸟计划\"的面试通知——这是进入顶尖实验室的敲门砖。宿舍里，室友正在讨论即将到来的保研资格排名，空气中弥漫着一种紧张而期待的气息。你打开电脑，屏幕上是三位心仪导师的研究主页，每一个方向都让你心潮澎湃。",
          actionItems: ["保持GPA在专业前10%", "联系目标导师申请进实验室", "开始阅读实验室近期顶会论文"],
          milestone: "大三上结束时GPA排名进入前15%",
          choices: [
            { text: "全力冲刺科研，争取发一篇CVPR", personality: "激进、野心驱动", strategy: "激进冒险" },
            { text: "稳扎稳打，先打好基础再深入", personality: "稳健、务实", strategy: "保守稳健" },
          ],
          imageUrl: "/images/scene-campus.jpg",
        },
        {
          stage: "大三下学期", period: "2026年2月 - 2026年7月",
          scene: "实验室的日光灯在深夜依然明亮。你的第一篇论文经历了第三次被拒，审稿人的意见像冰冷的雨点打在心上。窗外的北京城已经沉入梦乡，只有你桌上的咖啡还冒着热气。导师推门进来，拍了拍你的肩膀，递给你一份重写建议。那一刻你突然明白，科研不是一蹴而就的闪电战，而是一场漫长的马拉松。",
          actionItems: ["根据审稿意见修改论文", "参加学术会议拓展人脉", "准备暑期科研实习申请"],
          milestone: "论文终稿完成并投出",
          choices: [
            { text: "日夜赶工，争取在暑期前再投一次", personality: "执着、不屈", strategy: "激进冒险" },
            { text: "调整方向，寻找一个更有把握的子领域", personality: "灵活、务实", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-study.jpg",
        },
        {
          stage: "大四保研季", period: "2026年9月 - 2027年3月",
          scene: "保研面试的那一天，阳光意外地好。你站在信科楼的大厅里，看着墙上挂着的院士照片，心跳如鼓。一年的实验室经历让你的简历充实了许多——虽然没有顶会，但有一个在审的工作和一个暑期实习项目。面试官问你：\"如果这次没有成功，你会怎么办？\"你深吸一口气，给出了自己真实的答案。",
          actionItems: ["准备保研面试", "联系推荐人", "整理科研成果"],
          milestone: "获得保研资格并确定导师",
          choices: [
            { text: "坦诚表达自己对科研的热爱，不计后果", personality: "真诚、热血", strategy: "激进冒险" },
            { text: "稳妥展示成果，强调自己的可塑性", personality: "沉稳、策略性", strategy: "保守稳健" },
          ],
          imageUrl: "/images/scene-office.jpg",
        },
      ],
      bestCase: "成功发表顶会论文，进入院士组直博，5年后成为学术界新星",
      worstCase: "论文反复被拒，保研竞争激烈导致失利，需紧急准备考研",
      mostLikely: "发表一篇B类会议论文，顺利保研至中等偏上实验室",
      pros: ["学术氛围浓厚，导师资源丰富", "保研率较高，路径确定性较强", "科研训练扎实，适合长期学术发展"],
      cons: ["学术压力大，论文发表周期长", "工程实践机会相对较少", "竞争激烈，容错率低"],
      scores: { difficulty: 4, satisfaction: 5, risk: 3, growth: 5 },
    },
    {
      id: 2, name: "清华软院 · 工程实践路线", icon: "💼", shortDesc: "以工程能力为核心，追求产业影响力",
      stages: [
        {
          stage: "大三上学期", period: "2025年9月 - 2026年1月",
          scene: "清华软件学院的实训中心，巨大的落地窗外是紫操的绿茵。你正在参加一个企业联合项目的启动会，对面坐着来自字节跳动的技术负责人。这里的一切都散发着务实的气息——没有冗长的理论推导，只有\"这个feature什么时候能上线\"。你打开笔记本，开始记录需求文档中的技术要点。",
          actionItems: ["参与校企合作项目", "提升工程代码能力", "建立行业人脉"],
          milestone: "独立完成项目中的核心模块开发",
          choices: [
            { text: "主动承担最复杂的技术难点", personality: "自信、挑战者", strategy: "激进冒险" },
            { text: "选择适合自己的模块，确保交付质量", personality: "可靠、务实", strategy: "保守稳健" },
          ],
          imageUrl: "/images/scene-campus.jpg",
        },
        {
          stage: "大三下学期", period: "2026年2月 - 2026年7月",
          scene: "实习的第一个月，你已经加班了三个周末。办公室里的空调开得很足，但你额头上的汗珠说明了一切——生产环境的bug总是比教科书上的例题复杂一百倍。 mentor走过来，递给你一杯咖啡，说：\"你知道吗，能在这个时候坚持下来的实习生，最后都拿到了return offer。\"你笑了笑，继续调试。",
          actionItems: ["争取实习return offer", "学习工业界最佳实践", "积累可量化的项目成果"],
          milestone: "获得实习单位的书面推荐信",
          choices: [
            { text: "继续加码，主动申请更多高难度任务", personality: "拼搏、进取", strategy: "激进冒险" },
            { text: "平衡工作与学业，保持健康节奏", personality: "理性、自律", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-office.jpg",
        },
        {
          stage: "大四求职季", period: "2026年9月 - 2027年3月",
          scene: "秋招的最后一轮面试，你坐在会议室里，对面是公司的CTO。三年的工程积累在这一刻凝聚成你回答每一个技术问题时的从容。CTO最后问：\"你觉得自己和其他候选人最大的区别是什么？\"你微笑着说：\"我不仅写过代码，还理解代码背后的业务价值。\"",
          actionItems: ["冲刺秋招核心岗位", "整理项目作品集", "准备系统设计面试"],
          milestone: "拿到理想offer并签订三方",
          choices: [
            { text: "全力冲击一线大厂的SSP offer", personality: "野心、自信", strategy: "激进冒险" },
            { text: "选择业务前景好的中型公司核心岗位", personality: "远见、务实", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-study.jpg",
        },
      ],
      bestCase: "进入顶级大厂核心部门，快速晋升技术负责人",
      worstCase: "实习表现不佳未获留用，秋招竞争激烈只能接受降档offer",
      mostLikely: "获得中厂偏上的offer，起薪25-35万",
      pros: ["工程实践能力强，就业面广", "校企资源丰富，实习机会多", "收入起点高，经济独立快"],
      cons: ["学术深度不足，长期天花板可能受限", "工作强度大，work-life balance差", "技术迭代快，需要持续学习"],
      scores: { difficulty: 2, satisfaction: 4, risk: 2, growth: 4 },
    },
    {
      id: 3, name: "北大信科 · 产学研融合路线", icon: "🔄", shortDesc: "兼顾学术与工程，走差异化竞争路径",
      stages: [
        {
          stage: "大三上学期", period: "2025年9月 - 2026年1月",
          scene: "这是一个秋天，你站在两个世界的交界处。一边是高深的学术殿堂，一边是喧嚣的产业江湖。你选择了第三条路——在北大信科寻找一个既做前沿研究又和产业紧密结合的实验室。你得知新成立的\"智能系统实验室\"正是这样的地方，导师既发顶会也做落地项目。你敲开了实验室的门。",
          actionItems: ["调研产学研结合型实验室", "准备跨学科知识储备", "建立学术+工程双轨能力"],
          milestone: "找到合适的实验室并加入",
          choices: [
            { text: "直接联系导师，展示自己的复合背景", personality: "主动、多元", strategy: "灵活变通" },
            { text: "先做一段时间助研，用实际表现说话", personality: "踏实、低调", strategy: "隐忍蓄力" },
          ],
          imageUrl: "/images/scene-campus.jpg",
        },
        {
          stage: "大三下学期", period: "2026年2月 - 2026年7月",
          scene: "实验室的项目进入了关键阶段——你们正在把一个学术研究转化为一个实际产品demo。白天你在调试模型参数，晚上你在写前端界面。这种\"左手论文、右手代码\"的生活让你筋疲力尽，但也让你看到了别人看不到的风景。导师在一次组会上说：\"能把技术落地的人，永远比只会写论文的人更稀缺。\"",
          actionItems: ["推进学术项目至可演示阶段", "撰写技术博客建立个人品牌", "寻找暑期实习强化工程能力"],
          milestone: "完成一个可演示的产学研项目",
          choices: [
            { text: "以学术为主，工程为辅，确保有论文产出", personality: "均衡、理性", strategy: "保守稳健" },
            { text: "all in工程落地，先做出产品再补论文", personality: "实践、果断", strategy: "激进冒险" },
          ],
          imageUrl: "/images/scene-study.jpg",
        },
        {
          stage: "大四综合发展季", period: "2026年9月 - 2027年3月",
          scene: "这是收获的季节。你的简历上既有在审的论文，也有上线的产品demo，还有两段实习经历。当其他同学在为\"学术还是工程\"纠结时，你发现自己拥有了选择的自由。保研面试中，你的项目demo让评委眼前一亮；秋招面试中，你的论文背景又让你区别于其他工程候选人。",
          actionItems: ["同时准备保研和求职两条线", "突出差异化竞争优势", "做好路径最终选择的心理准备"],
          milestone: "获得保研offer或理想工作offer",
          choices: [
            { text: "选择保研，继续深耕学术+工程路线", personality: "长期主义、耐心", strategy: "保守稳健" },
            { text: "直接就业，用已有积累抢占市场先机", personality: "果断、行动派", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-office.jpg",
        },
      ],
      bestCase: "成为学术界与工业界都认可的复合型人才，创业成功",
      worstCase: "两边都不够深入，在竞争中缺乏突出优势",
      mostLikely: "以差异化背景获得不错的保研或就业机会",
      pros: ["差异化竞争优势明显", "选择面宽，进可攻退可守", "复合能力适应未来趋势"],
      cons: ["时间精力分散，容易两头落空", "需要极强的自我管理能力", "社会认可度可能不如纯学术或纯工程路线"],
      scores: { difficulty: 3, satisfaction: 4, risk: 3, growth: 5 },
    },
  ],
  recommendation: {
    primaryId: 1,
    reasoning: "基于你的理性分析型性格和重视长期发展的价值观，北大信科的学术深耕路线最符合你的核心诉求。你的家庭条件虽然一般，但北大较高的保研率提供了相对确定的路径。你对学术深度的追求在清华软院的工程导向环境中可能得不到充分满足。",
    tips: ["大三上学期是进入实验室的黄金窗口，不要犹豫", "即使没有顶会发表，扎实的研究经历也足以支撑保研", "保持GPA的同时，尽早确定研究方向"],
    actionChecklist: [
      "大三上学期结束前联系至少2位目标导师",
      "每周投入15+小时在实验室项目上",
      "大三寒假前完成第一篇论文初稿",
      "大三下学期投递至少2个学术会议",
      "保研面试前准备好3分钟的研究介绍",
    ],
    pitfalls: [
      "不要同时跟多个导师\"暧昧\"，学术界圈子很小",
      "避免过度追求完美导致错过投稿deadline",
      "不要忽视GPA，这是保研的第一道门槛",
    ],
  },
  disclaimer: "本推演结果基于AI模型生成，仅供参考。真实的人生充满不确定性，请结合自身实际情况和专业人士建议做出最终决策。",
}

export const decisionTypes = [
  { value: "", label: "请选择决策类型" },
  { value: "gaokao", label: "🎓 高考填志愿" },
  { value: "graduate", label: "📚 考研/保研择校" },
  { value: "job", label: "💼 求职选offer" },
  { value: "career", label: "🔄 职业转型" },
  { value: "city", label: "🏙️ 城市选择" },
  { value: "other", label: "📝 其他" },
]
