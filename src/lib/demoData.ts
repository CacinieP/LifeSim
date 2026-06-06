import type { ScenarioData, ChatMessage } from "@/types"

export const demoScenarioData: ScenarioData = {
  userSummary: "你是一个注重稳定、家庭经济条件中等、对学术研究有浓厚兴趣的理工科学生。你最看重保研率和导师资源，对竞争压力较为敏感。",
  researchSummary: "北大信科的部分导师近年转向产业界合作，学术指导时间减少。清华软院的校企联合培养项目可能更适合你的性格。",
  branches: [
    {
      id: 1, name: "稳健保研路线", icon: "\u{1F6E1}", shortDesc: "以高保研率为核心目标，稳步积累科研经历",
      stages: [
        {
          stage: "大三上学期", period: "2027年9月 - 2028年3月",
          scene: "北大的秋风裹挟着银杏的香气铺满未名湖畔。你背着书包从图书馆走出，手里攥着刚刚打印出来的成绩单——GPA 3.8，专业排名前 8%。手机震动，是导师发来的微信：「下周来实验室一趟，有个项目适合你。」你抬头望向远处灯火通明的理教楼，心中泛起一丝期待，却又隐隐不安。",
          actionItems: ["保持 GPA 在专业前 10%", "联系导师申请进实验室", "开始了解目标导师的研究方向"],
          milestone: "大三上结束时 GPA 排名进入前 15%",
          choices: [
            { text: "全力投入实验室项目，争取发表论文", personality: "野心驱动", strategy: "激进冒险" },
            { text: "保持当前节奏，稳守 GPA 为主", personality: "稳扎稳打", strategy: "保守稳健" },
            { text: "尝试联系其他导师，寻找更匹配的方向", personality: "审时度势", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-campus.jpg",
        },
        {
          stage: "大三下学期", period: "2028年3月 - 2028年9月",
          scene: "实验室的日光灯管发出轻微的嗡嗡声。你的工位上堆满了论文打印件，显示器上是跑了三个小时的实验数据。隔壁工位的师兄伸了个懒腰：「师弟，这次组会你准备讲什么？」你揉了揉发酸的眼睛，想起下周就是保研材料提交截止日期了。窗外的樱花已经谢了，绿意爬满了枝头。",
          actionItems: ["完成一篇课程论文或实验报告", "准备保研材料和个人陈述", "参加至少一个学术竞赛"],
          milestone: "获得至少一项科研经历或竞赛奖项",
          choices: [
            { text: "熬夜冲刺，争取在截止日期前出一篇完整论文", personality: "拼命三郎", strategy: "激进冒险" },
            { text: "按部就班准备材料，确保不出差错", personality: "谨慎细致", strategy: "保守稳健" },
            { text: "同时准备考研作为保底方案", personality: "多手准备", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-library.jpg",
        },
        {
          stage: "大四上学期", period: "2028年9月 - 2029年1月",
          scene: "保研结果公布的那一天，你在寝室里刷新了无数次教务系统。当看到「拟录取」三个字时，你的手微微颤抖。室友拍了拍你的肩膀：「恭喜你啊，上岸了！」你长舒一口气，但心里清楚，这只是另一个开始。导师发来消息：「明年春季有个合作项目，你提前准备一下。」",
          actionItems: ["确认保研录取结果", "与导师沟通研究生阶段的规划", "利用大四时间补充专业知识"],
          milestone: "成功获得保研资格并确认录取",
          choices: [
            { text: "立刻投入导师的项目，争取研一就有产出", personality: "积极主动", strategy: "激进冒险" },
            { text: "先好好休息，大四下再开始准备", personality: "张弛有度", strategy: "保守稳健" },
            { text: "自学一些研究生课程，为将来做准备", personality: "未雨绸缪", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-office.jpg",
        },
      ],
      bestCase: "顺利保研进入理想实验室，发表1-2篇论文，获得全额奖学金",
      worstCase: "保研竞争激烈，最终去了保底院校",
      mostLikely: "成功保研，进入目标实验室，平稳度过研究生阶段",
      pros: ["风险较低", "有导师指导", "学术氛围好", "经济压力小"],
      cons: ["竞争激烈", "选择范围有限", "可能错过其他机会"],
      scores: { difficulty: 3, satisfaction: 4, risk: 2, growth: 4 },
    },
    {
      id: 2, name: "激进科研路线", icon: "\u{1F680}", shortDesc: "以发表顶会论文为目标，高风险高回报",
      stages: [
        {
          stage: "大三上学期", period: "2027年9月 - 2028年3月",
          scene: "深夜的实验室只剩下你一个人。显示器的光映在你疲惫的脸上，代码一行行滚动。你给自己定下了一个疯狂的目标：大三结束前投出一篇 CVPR。咖啡杯在桌角堆成了小山，窗外的天色从墨黑转为鱼肚白。你揉了揉眼睛，在 IDE 里敲下最后一个函数的闭合括号。",
          actionItems: ["每天保证 6 小时以上的科研时间", "精读 20 篇以上顶会论文", "复现至少 3 篇关键论文的实验"],
          milestone: "完成第一个可运行的实验原型",
          choices: [
            { text: "继续通宵调试，明天必须跑出结果", personality: "不眠不休", strategy: "激进冒险" },
            { text: "先回去休息，明天再仔细调试", personality: "理性克制", strategy: "保守稳健" },
            { text: "找师兄讨论一下方向是否正确", personality: "虚心求教", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-library.jpg",
        },
        {
          stage: "大三下学期", period: "2028年3月 - 2028年9月",
          scene: "论文被拒稿了。审稿人的意见像一把把尖刀插在心上：「实验不够充分」「贡献不够新颖」「写作需要大幅改进」。你盯着屏幕上的 rejection 邮件，感觉所有的努力都化为了泡影。但内心深处，有一个声音在说：「再试一次。」",
          actionItems: ["认真分析审稿意见", "补充实验数据", "寻找下一个投稿目标"],
          milestone: "论文修改后重新投稿",
          choices: [
            { text: "立刻开始修改，争取赶上下一个截止日期", personality: "百折不挠", strategy: "激进冒险" },
            { text: "重新评估方向的可行性，考虑调整", personality: "冷静分析", strategy: "保守稳健" },
            { text: "同时准备保研材料，两手抓", personality: "分散风险", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-campus.jpg",
        },
        {
          stage: "大四上学期", period: "2028年9月 - 2029年1月",
          scene: "论文中了！虽然不是 CVPR，但 ECCV 也是顶会。看到 acceptance 的那一刻，你在实验室里大喊了一声，吓了所有人一跳。师兄笑着走过来：「恭喜你，师弟。这一路的辛苦，值了。」你知道，这个成果不仅意味着保研十拿九稳，更意味着你在学术道路上迈出了坚实的一步。",
          actionItems: ["准备 camera-ready 版本", "准备保研面试", "规划研究生阶段的研究方向"],
          milestone: "论文被顶会接收",
          choices: [
            { text: "趁热打铁，立刻开始下一个项目", personality: "乘胜追击", strategy: "激进冒险" },
            { text: "先好好庆祝一下，适当放松", personality: "及时行乐", strategy: "保守稳健" },
            { text: "参加学术会议，扩展人脉", personality: "长袖善舞", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-office.jpg",
        },
      ],
      bestCase: "发表顶会论文，获得全额奖学金，进入顶级实验室",
      worstCase: "论文屡投不中，身心俱疲，影响学业",
      mostLikely: "发表一篇中等水平论文，成功保研",
      pros: ["学术成果突出", "保研竞争力强", "导师青睐", "未来发展好"],
      cons: ["风险极高", "身心压力大", "可能影响 GPA", "成功率低"],
      scores: { difficulty: 5, satisfaction: 5, risk: 5, growth: 5 },
    },
    {
      id: 3, name: "灵活变通路线", icon: "\u{1F504}", shortDesc: "多手准备，保研考研出国三线并行",
      stages: [
        {
          stage: "大三上学期", period: "2027年9月 - 2028年3月",
          scene: "你的书桌上摆着三份资料：保研政策解读、考研复习规划、出国留学指南。室友看到都惊了：「你这也太拼了吧？」你笑了笑：「鸡蛋不能放在一个篮子里嘛。」但其实你心里也没底，三条路同时进行，时间和精力都是巨大的考验。",
          actionItems: ["了解三条路径的具体要求和时间节点", "准备托福/雅思考试", "开始复习考研基础课程"],
          milestone: "三条路径的初步规划完成",
          choices: [
            { text: "重点冲刺出国，开始准备 GRE", personality: "志在高远", strategy: "激进冒险" },
            { text: "以保研为主，其他两条路轻量准备", personality: "主次分明", strategy: "保守稳健" },
            { text: "三条路平均分配精力，随机应变", personality: "八面玲珑", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-library.jpg",
        },
        {
          stage: "大三下学期", period: "2028年3月 - 2028年9月",
          scene: "托福成绩出来了：105分。你长舒一口气，至少出国这条路是保底的。与此同时，你也在实验室攒了一些经历，虽然不够出彩，但应付保研面试应该够了。考研复习进度落后了一些，但你安慰自己：「反正还有时间。」",
          actionItems: ["提交托福成绩单", "继续积累科研经历", "保持考研复习进度"],
          milestone: "托福成绩达标",
          choices: [
            { text: "全力准备出国文书，争取名校 offer", personality: "精益求精", strategy: "激进冒险" },
            { text: "以保研为重心，同时递交出国申请", personality: "稳扎稳打", strategy: "保守稳健" },
            { text: "根据保研夏令营结果，动态调整策略", personality: "随机应变", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-campus.jpg",
        },
        {
          stage: "大四上学期", period: "2028年9月 - 2029年1月",
          scene: "好消息接踵而至：保研夏令营拿到了优秀营员，出国申请收到了两所学校的 offer。你坐在书桌前，看着手里的多份录取通知书，突然有些恍惚。曾经以为是最艰难的选择，现在看来，有选择本身就是一种幸福。",
          actionItems: ["综合比较各个 offer 的优劣", "与家人和导师充分沟通", "做出最终选择并确认"],
          milestone: "获得多个录取/offer",
          choices: [
            { text: "选择出国，追求更广阔的学术视野", personality: "胸怀天下", strategy: "激进冒险" },
            { text: "选择保研，走最稳妥的路", personality: "安土重迁", strategy: "保守稳健" },
            { text: "选择最适合自己的，不盲目追求排名", personality: "知己者明", strategy: "灵活变通" },
          ],
          imageUrl: "/images/scene-office.jpg",
        },
      ],
      bestCase: "手握多个 offer，最终选择最适合自己的",
      worstCase: "精力分散，三条路都没走通",
      mostLikely: "至少获得一个不错的 offer，有选择空间",
      pros: ["选择余地大", "风险分散", "信息面广", "心态更稳"],
      cons: ["精力分散", "每条路都不够深入", "决策成本高", "容易焦虑"],
      scores: { difficulty: 4, satisfaction: 4, risk: 3, growth: 4 },
    },
  ],
  recommendation: {
    primaryId: 1,
    reasoning: "基于你的画像，AI 倾向于推荐「稳健保研路线」。你的性格适合循序渐进，家庭经济条件也不支持激进路线的风险。在故事模式中，你多次选择了稳健策略，这与你的内在特质高度一致。",
    tips: ["保持 GPA 是重中之重，不要因科研而牺牲成绩", "尽早联系导师，但不要同时联系多个导师", "多参加学术活动，拓展视野"],
    actionChecklist: [
      "大三上学期联系导师申请进实验室",
      "保持 GPA 在专业前 10%",
      "大三下学期开始准备保研材料",
      "参加至少一个科研项目",
      "大三暑假参加目标院校夏令营",
      "大四上学期确认保研资格",
    ],
    pitfalls: [
      "不要同时跟多个导师「暧昧」，学术圈子很小",
      "不要忽视英语六级的刷分，部分导师看重这个",
      "不要等到大四才想起来联系导师",
      "不要过分追求完美，完成比完美更重要",
    ],
  },
  disclaimer: "本报告由 AI 生成，仅供参考。人生充满不确定性，请结合自身实际情况做出最终决策。",
}

export const demoChatHistory: ChatMessage[] = [
  { role: "assistant", content: "你好呀，我是未来。听说你正面临一个重要选择？不用紧张，我们慢慢来。可以先告诉我你目前的处境吗？" },
  { role: "user", content: "我在北大计算机和清华软件工程之间纠结，不知道该怎么选。" },
  { role: "assistant", content: "这是两个非常优秀的选择！为了给你更精准的建议，我想多了解一些。你觉得自己是什么样性格的人？比如，你更喜欢稳定按部就班，还是愿意冒险追求更大的突破？" },
  { role: "user", content: "我比较保守，喜欢稳定，不太能接受失败。" },
  { role: "assistant", content: "明白了，稳妥型性格。那你家庭经济条件怎么样？如果走科研路线，可能需要较长时间没有收入，这一点你和家人能接受吗？" },
  { role: "user", content: "家庭条件中等，父母希望我能早点工作赚钱。" },
  { role: "assistant", content: "了解了。最后一个问题：你对学术研究有多大热情？是真心喜欢做研究，还是更偏向工程实践？" },
  { role: "user", content: "我更喜欢学术研究，对工程实践兴趣不大。" },
  { role: "assistant", content: "非常好，我已经了解了你的基本情况。你是一位偏保守、喜欢稳定、家庭经济条件中等但热爱学术研究的同学。接下来，我将为你生成三条不同的未来路径，你可以通过交互式故事来体验每种选择的不同结果。准备好了吗？" },
]

export const decisionTypeOptions = [
  { value: "", label: "请选择决策类型" },
  { value: "gaokao", label: "高考填志愿" },
  { value: "graduate", label: "考研保研择校" },
  { value: "job", label: "求职选 offer" },
  { value: "career", label: "职业转型" },
  { value: "city", label: "城市选择" },
  { value: "other", label: "其他" },
]

export const providerOptions = [
  { value: "deepseek", label: "DeepSeek" },
  { value: "openai", label: "OpenAI" },
  { value: "moonshot", label: "月之暗面" },
  { value: "zhipu", label: "智谱 AI" },
  { value: "wanjie", label: "万界方舟" },
  { value: "custom", label: "自定义" },
]

export const defaultModels: Record<string, string> = {
  deepseek: "deepseek-chat",
  openai: "gpt-4o-mini",
  moonshot: "moonshot-v1-8k",
  zhipu: "glm-4",
  wanjie: "deepseek-chat",
  custom: "",
}
