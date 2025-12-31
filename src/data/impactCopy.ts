export type Language = 'bn' | 'en';

export const impactCopy = {
  bn: {
    title: 'OGRO প্রভাব ড্যাশবোর্ড',
    description: 'সার্ভে ফলাফল এবং বাস্তব মেট্রিক্সের ভিত্তিতে OGRO-এর প্রভাব বিশ্লেষণ। সব ফলাফল সমষ্টিগত (anonymous)।',
    emptyState: 'এখনও কোনো সার্ভে রেসপন্স নেই। আগে সার্ভেটি জমা দিন।',
    executiveSummary: 'সারসংক্ষেপ',
    kpis: {
      overallSatisfaction: 'মোট সন্তুষ্টি',
      strongestModule: 'সবচেয়ে বেশি প্রভাবিত মডিউল',
      weakestModule: 'সবচেয়ে কম প্রভাবিত মডিউল',
      perceptionRealityGap: 'ধারণা বনাম বাস্তব পার্থক্য',
    },
    kpiDescriptions: {
      overallSatisfaction: {
        high: 'সব ক্ষেত্রে উচ্চ সন্তুষ্টি',
        medium: 'মাঝারি সন্তুষ্টি, উন্নতির সুযোগ আছে',
        low: 'নিম্ন সন্তুষ্টি - অবিলম্বে মনোযোগ প্রয়োজন',
      },
      strongestModule: {
        default: 'সর্বোচ্চ প্রভাবিত মডিউল',
        withScore: 'সর্বোচ্চ প্রভাবিত মডিউল {score}%',
        noData: 'কোনো সার্ভে ডেটা নেই',
      },
      weakestModule: {
        default: 'সর্বনিম্ন প্রভাবিত মডিউল',
        withScore: 'সর্বনিম্ন প্রভাবিত মডিউল {score}% - ফোকাস প্রয়োজন',
        noData: 'কোনো সার্ভে ডেটা নেই',
      },
      perceptionRealityGap: {
        excellent: 'চমৎকার সামঞ্জস্য - ব্যবহারকারীরা সঠিকভাবে প্রভাব বুঝতে পারছে',
        good: 'ভালো সামঞ্জস্য, ছোটখাটো পার্থক্য আছে',
        significant: 'উল্লেখযোগ্য পার্থক্য - যোগাযোগ ও প্রশিক্ষণ পর্যালোচনা করুন',
      },
    },
    charts: {
      overallSatisfaction: {
        title: 'মোট সন্তুষ্টি স্কোর',
        insight: 'মোট সন্তুষ্টি স্কোর পাঁচটি গুরুত্বপূর্ণ ক্ষেত্রে ব্যবহারকারীর ধারণা একত্রিত করে: ম্যানুয়াল কাজ হ্রাস, সময় সাশ্রয়, তথ্যের নির্ভুলতা, ট্র্যাকিং সহজতা এবং সামগ্রিক দক্ষতা বৃদ্ধি। ৭০% এর উপরে স্কোর OGRO-এর প্রভাবের উপর শক্তিশালী ব্যবহারকারী সন্তুষ্টি নির্দেশ করে। নিম্ন স্কোরগুলি অতিরিক্ত প্রশিক্ষণ, বৈশিষ্ট্য উন্নতি বা যোগাযোগের ক্ষেত্রগুলি নির্দেশ করতে পারে যেখানে উপলব্ধি সর্বাধিক করার জন্য প্রয়োজন।',
      },
      moduleImpact: {
        title: 'মডিউল অনুযায়ী প্রভাব',
        yAxisLabel: 'সার্ভে প্রভাব (%)',
        xAxisLabel: 'OGRO মডিউল',
        insight: 'এই ভিজ্যুয়ালাইজেশনটি ব্যবহারকারী সার্ভে রেসপন্সের ভিত্তিতে প্রতিটি OGRO মডিউলের গড় উপলব্ধি প্রভাব দেখায়। উচ্চ বারগুলি এমন মডিউল নির্দেশ করে যেখানে ব্যবহারকারীরা শক্তিশালী ইতিবাচক প্রভাব রিপোর্ট করে, যা সফল গ্রহণ এবং মূল্য উপলব্ধি নির্দেশ করে। নিম্ন স্কোরযুক্ত মডিউলগুলি লক্ষ্যবস্তু প্রশিক্ষণ, বৈশিষ্ট্য উন্নতি বা তাদের সুবিধা সম্পর্কে আরও ভাল যোগাযোগ থেকে উপকৃত হতে পারে। এই ডেটা কোন মডিউলগুলিকে প্রচার, উন্নতি বা অতিরিক্ত সহায়তা প্রদান করতে হবে তা অগ্রাধিকার দিতে সাহায্য করে।',
      },
      timeComparison: {
        title: 'OGRO-এর আগে ও পরে সময়ের পরিবর্তন',
        yAxisLabel: 'ঘণ্টা',
        xAxisLabel: 'সার্ভে রেসপন্স',
        beforeLabel: 'OGRO-এর আগে',
        afterLabel: 'OGRO-এর পরে',
        insight: 'এই তুলনা OGRO বাস্তবায়নের মাধ্যমে অর্জিত স্পষ্ট সময় সাশ্রয় প্রদর্শন করে। সময় ব্যয়ের হ্রাস (বারগুলির মধ্যে পার্থক্য) দক্ষতা বৃদ্ধি পরিমাপ করে এবং প্ল্যাটফর্মের ROI যাচাই করে। একাধিক রেসপন্স জুড়ে ধারাবাহিক হ্রাস নির্ভরযোগ্য, পরিমাপযোগ্য সময় সাশ্রয় নির্দেশ করে। এই ডেটা স্টেকহোল্ডারদের কাছে মূল্য প্রদর্শন, অব্যাহত বিনিয়োগের ন্যায্যতা এবং কোন ওয়ার্কফ্লোগুলি অটোমেশন থেকে সবচেয়ে বেশি উপকৃত হয় তা চিহ্নিত করার জন্য মূল্যবান।',
      },
      perceptionReality: {
        title: 'সার্ভে বনাম বাস্তব প্রভাব তুলনা',
        yAxisLabel: 'প্রভাব (%)',
        xAxisLabel: 'OGRO মডিউল',
        surveyLabel: 'সার্ভে প্রভাব (ধারণা)',
        realityLabel: 'বাস্তব স্কোর (মেট্রিক্স)',
        insight: 'এই গুরুত্বপূর্ণ তুলনা ব্যবহারকারীর ধারণা (সার্ভে থেকে) এবং প্রকৃত পরিমাপিত প্রভাব (সিস্টেম অ্যানালিটিক্স থেকে) এর মধ্যে সামঞ্জস্য প্রকাশ করে। যখন বারগুলি একই রকম হয়, ব্যবহারকারীর ধারণা বাস্তবতাকে সঠিকভাবে প্রতিফলিত করে, যা ভাল যোগাযোগ এবং ব্যবহারকারী সচেতনতা নির্দেশ করে। বড় পার্থক্যগুলি সুযোগ নির্দেশ করে: যখন ধারণা বাস্তবতার চেয়ে বেশি হয়, ব্যবহারকারীরা মূল্যকে অতিমূল্যায়ন করতে পারে (প্রশিক্ষণ প্রয়োজন)। যখন বাস্তবতা ধারণাকে ছাড়িয়ে যায়, ব্যবহারকারীরা সিস্টেমকে অবমূল্যায়ন করতে পারে (যোগাযোগ/প্রশিক্ষণ পার্থক্য)। এই বিশ্লেষণ ব্যবহারকারী শিক্ষা, বৈশিষ্ট্য প্রচার বা পণ্য উন্নতিতে কোথায় বিনিয়োগ করতে হবে তা চিহ্নিত করতে সাহায্য করে।',
      },
      alignmentAnalysis: {
        title: 'ধারণা বনাম বাস্তব — সামঞ্জস্য বিশ্লেষণ',
        xAxisLabel: 'সার্ভে প্রভাব (%) (ব্যবহারকারী ধারণা)',
        yAxisLabel: 'বাস্তব স্কোর (%) (পরিমাপিত প্রভাব)',
        quadrants: {
          highHigh: 'উচ্চ–উচ্চ: শক্তিশালী সাফল্য (ধারণা বাস্তবতার সাথে মিলে যায় - আদর্শ অবস্থা)',
          highLow: 'উচ্চ–কম: ট্রেনিং/অভ্যাসের ঘাটতি (ব্যবহারকারীরা শক্তিশালী মেট্রিক্স থাকা সত্ত্বেও মূল্য দেখতে পায় না)',
          lowHigh: 'কম–উচ্চ: UX/কমিউনিকেশন উন্নতি দরকার (মূল্য বিদ্যমান কিন্তু কার্যকরভাবে যোগাযোগ করা হয়নি)',
          lowLow: 'কম–কম: প্রোডাক্ট উন্নতি দরকার (ধারণা এবং বাস্তবতা উভয়েই উন্নতি প্রয়োজন)',
        },
        insight: 'এই কৌশলগত স্ক্যাটার প্লট সার্ভে ধারণা (X-অক্ষ) এবং পরিমাপিত বাস্তবতা (Y-অক্ষ) এর ভিত্তিতে প্রতিটি মডিউলের অবস্থান ম্যাপ করে। শীর্ষ-ডান কোয়াড্রেন্টে (উচ্চ–উচ্চ) পয়েন্টগুলি সফল মডিউলগুলিকে উপস্থাপন করে যেখানে ধারণা এবং বাস্তবতা উভয়ই শক্তিশালী - এগুলি সাফল্যের গল্প যা প্রতিলিপি করা যায়। অন্যান্য কোয়াড্রেন্টগুলি লক্ষ্যবস্তু হস্তক্ষেপের প্রয়োজন এমন ক্ষেত্রগুলি হাইলাইট করে: উচ্চ–কম প্রশিক্ষণ পার্থক্য নির্দেশ করে যেখানে ব্যবহারকারীরা মূল্য চিনতে পারে না, কম–উচ্চ যোগাযোগ পার্থক্য নির্দেশ করে যেখানে মূল্য বিদ্যমান কিন্তু উপলব্ধি করা হয় না, এবং কম–কম পণ্যের সমস্যা সংকেত দেয় যার জন্য বৈশিষ্ট্য উন্নতির প্রয়োজন। এই ভিজ্যুয়ালাইজেশন নেতৃত্বকে প্রশিক্ষণ, যোগাযোগ এবং পণ্য উন্নয়ন জুড়ে সম্পদ বরাদ্দের অগ্রাধিকার দিতে সাহায্য করে।',
      },
    },
    footer: {
      follow: 'GitHub-এ আমাকে ফলো করুন',
    },
  },
  en: {
    title: 'OGRO Impact Dashboard',
    description: 'OGRO impact analysis based on survey results and real operational metrics. All results are aggregated (anonymous).',
    emptyState: 'No survey responses yet. Submit the survey first.',
    executiveSummary: 'Executive Summary',
    kpis: {
      overallSatisfaction: 'Overall Satisfaction',
      strongestModule: 'Strongest Module',
      weakestModule: 'Weakest Module',
      perceptionRealityGap: 'Perception vs Reality Gap',
    },
    kpiDescriptions: {
      overallSatisfaction: {
        high: 'Strong user satisfaction across all key impact areas',
        medium: 'Moderate satisfaction with room for improvement',
        low: 'Low satisfaction - requires immediate attention',
      },
      strongestModule: {
        default: 'Highest perceived impact at {score}%',
        noData: 'No survey data available',
      },
      weakestModule: {
        default: 'Lowest perceived impact at {score}% - needs focus',
        noData: 'No survey data available',
      },
      perceptionRealityGap: {
        excellent: 'Excellent alignment - users accurately perceive impact',
        good: 'Good alignment with minor gaps to address',
        significant: 'Significant gap - review communication and training',
      },
    },
    charts: {
      overallSatisfaction: {
        title: 'Overall Satisfaction Score',
        insight: 'The Overall Satisfaction Score aggregates user perceptions across five critical impact areas: reduced manual work, daily time savings, improved data accuracy, tracking ease, and overall efficiency gains. Scores above 70% indicate strong user satisfaction and validate OGRO\'s value proposition. Lower scores suggest areas where additional training, feature improvements, or communication may be needed to maximize perceived value.',
      },
      moduleImpact: {
        title: 'Impact by Module',
        yAxisLabel: 'Survey Impact (%)',
        xAxisLabel: 'OGRO Modules',
        insight: 'This visualization shows the average perceived impact of each OGRO module based on user survey responses. Higher bars indicate modules where users report stronger positive impact, suggesting successful adoption and value realization. Modules with lower scores may benefit from targeted training, feature enhancements, or better communication about their benefits. This data helps prioritize which modules to promote, improve, or provide additional support for.',
      },
      timeComparison: {
        title: 'Time Before vs After OGRO',
        yAxisLabel: 'Hours',
        xAxisLabel: 'Survey Responses',
        beforeLabel: 'Before OGRO',
        afterLabel: 'After OGRO',
        insight: 'This comparison demonstrates the tangible time savings achieved through OGRO implementation. The reduction in time spent (difference between bars) quantifies efficiency gains and validates the ROI of the platform. Consistent reductions across multiple responses indicate reliable, measurable time savings. This data is valuable for demonstrating value to stakeholders, justifying continued investment, and identifying which workflows benefit most from automation.',
      },
      perceptionReality: {
        title: 'Survey vs Reality Impact Comparison',
        yAxisLabel: 'Impact %',
        xAxisLabel: 'OGRO Modules',
        surveyLabel: 'Survey Impact (Perception)',
        realityLabel: 'Reality Score (Metrics)',
        insight: 'This critical comparison reveals alignment between user perceptions (from surveys) and actual measured impact (from system analytics). When bars are similar, user perceptions accurately reflect reality, indicating good communication and user awareness. Large gaps suggest opportunities: when perception is higher than reality, users may be overestimating value (training needed). When reality exceeds perception, users may be undervaluing the system (communication/training gap). This analysis helps identify where to invest in user education, feature promotion, or product improvements.',
      },
      alignmentAnalysis: {
        title: 'Perception vs Reality — Alignment Analysis',
        xAxisLabel: 'Survey Impact % (User Perception)',
        yAxisLabel: 'Reality Score % (Measured Impact)',
        quadrants: {
          highHigh: 'High–High: Strong success (perception matches reality - ideal state)',
          highLow: 'High–Low: Training gap (users don\'t see the value despite strong metrics)',
          lowHigh: 'Low–High: UX / comms gap (value exists but not communicated effectively)',
          lowLow: 'Low–Low: Product issue (needs improvement in both perception and reality)',
        },
        insight: 'This strategic scatter plot maps each module\'s position based on survey perception (X-axis) and measured reality (Y-axis). Points in the top-right quadrant (High–High) represent successful modules where both perception and reality are strong - these are success stories to replicate. The other quadrants highlight areas needing targeted intervention: High–Low suggests training gaps where users don\'t recognize value, Low–High indicates communication gaps where value exists but isn\'t perceived, and Low–Low signals product issues requiring feature improvements. This visualization helps leadership prioritize resource allocation across training, communication, and product development.',
      },
    },
    footer: {
      follow: 'Follow me on GitHub',
    },
  },
};

