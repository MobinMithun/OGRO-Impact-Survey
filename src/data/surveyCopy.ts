export type Language = 'bn' | 'en';

export const surveyCopy = {
  bn: {
    title: 'OGRO Impact Survey',
    description: `এই সার্ভেটির উদ্দেশ্য হলো OGRO অ্যাপ ব্যবহারের ফলে আপনার কাজ কতটা সহজ, দ্রুত ও নির্ভুল হয়েছে—তা বোঝা। প্রাপ্ত ফিডব্যাক বিশ্লেষণ করে টেক টিম OGRO-এর প্রকৃত প্রভাব বুঝতে এবং ভবিষ্যৎ উন্নয়নে কাজ করতে পারবে।

এই সার্ভের সব তথ্য গোপনীয় থাকবে এবং শুধুমাত্র সমষ্টিগত বিশ্লেষণের জন্য ব্যবহার করা হবে। সার্ভেটি সম্পন্ন করতে প্রায় ৫ মিনিট সময় লাগবে।`,
    fields: {
      name: {
        label: 'নাম',
        helper: 'এই তথ্যটি শুধুমাত্র অভ্যন্তরীণ রেফারেন্সের জন্য ব্যবহৃত হবে এবং কারও সাথে শেয়ার করা হবে না।',
      },
    },
    sections: {
      a: {
        title: 'ভূমিকা ও ব্যবহার সম্পর্কিত তথ্য',
        description: 'আপনার ভূমিকা ও OGRO ব্যবহারের অভিজ্ঞতা সম্পর্কে সাধারণ তথ্য।',
        questions: {
          role: '১. আপনার ভূমিকা',
          usageDuration: '২. OGRO ব্যবহারের সময়কাল',
          modulesUsed: '৩. ব্যবহৃত মডিউল',
          modulesUsedHelper: 'একাধিক অপশন নির্বাচন করা যাবে।',
        },
      },
      b: {
        title: 'সামগ্রিক সন্তুষ্টি',
        description: 'OGRO ব্যবহারের ফলে আপনার দৈনন্দিন কাজ কতটা সহজ ও কার্যকর হয়েছে—তা মূল্যায়ন করুন।',
        questions: {
          reducedManualWork: '৪. OGRO ব্যবহারের ফলে আমার ম্যানুয়াল কাজের পরিমাণ কমেছে',
          savesTimeDaily: '৫. OGRO আমার দৈনন্দিন সময় সাশ্রয় করে',
          dataAccuracyImproved: '৬. OGRO-এর মাধ্যমে তথ্যের নির্ভুলতা বেড়েছে',
          easierTracking: '৭. OGRO-এর মাধ্যমে ট্র্যাকিং ও ফলো-আপ করা সহজ হয়েছে',
          improvedEfficiency: '৮. OGRO সামগ্রিকভাবে আমার কাজের দক্ষতা বাড়িয়েছে',
        },
      },
      c: {
        title: 'মডিউল-ভিত্তিক প্রভাব',
        description: 'OGRO-এর বিভিন্ন মডিউল আপনার কাজের উপর কতটা প্রভাব ফেলেছে—তা এখানে আলাদা করে মূল্যায়ন করুন।',
        scaleHint: '১ = কোনো প্রভাব নেই | ৫ = খুব বেশি প্রভাব',
      },
      d: {
        title: 'আগে ও পরে',
        description: 'OGRO ব্যবহারের আগে ও পরে আপনার কাজের সময় এবং ভুলের পরিমাণে কী পরিবর্তন হয়েছে—তা বোঝার জন্য এই অংশ।',
        questions: {
          timeSpentBefore: '৯. OGRO ব্যবহারের আগে সময় ব্যয়',
          timeSpentAfter: '১০. OGRO ব্যবহারের পরে সময় ব্যয়',
          errorFrequencyBefore: '১১. OGRO ব্যবহারের আগে ভুলের পরিমাণ',
          errorFrequencyAfter: '১২. OGRO ব্যবহারের পরে ভুলের পরিমাণ',
        },
      },
      e: {
        title: 'বিশ্বাস ও গ্রহণযোগ্যতা',
        description: 'OGRO-এর তথ্য ও সিস্টেমের উপর আপনার বিশ্বাস এবং এটি আপনি কতটা নিয়মিত ব্যবহার করেন তা মূল্যায়ন করুন।',
        questions: {
          trustOGROData: '১৩. আমি OGRO-এর তথ্যের উপর বিশ্বাস রাখি',
          lessExcelWhatsApp: '১৪. OGRO ব্যবহারের ফলে Excel/WhatsApp ব্যবহার কমেছে',
          preferOGROOverOldTools: '১৫. আমি পুরনো সরঞ্জামের চেয়ে OGRO-কে পছন্দ করি',
        },
      },
      f: {
        title: 'মুক্ত মতামত',
        description: 'আপনার নিজের ভাষায় OGRO সম্পর্কে গুরুত্বপূর্ণ মতামত বা পরামর্শ দিতে পারেন (ঐচ্ছিক)।',
        questions: {
          biggestImprovement: '১৬. সবচেয়ে বড় উন্নতি',
          oneImprovementNeeded: '১৭. একটি উন্নতির প্রয়োজন',
        },
      },
    },
    options: {
      likert: {
        1: 'সম্পূর্ণ অসম্মত',
        2: 'অসম্মত',
        3: 'নিরপেক্ষ',
        4: 'সম্মত',
        5: 'সম্পূর্ণ সম্মত',
      },
      impact: {
        1: 'কোনো প্রভাব নেই',
        2: 'কম প্রভাব',
        3: 'মাঝারি প্রভাব',
        4: 'বেশি প্রভাব',
        5: 'খুব বেশি প্রভাব',
      },
      timeBefore: {
        '4–6 hrs': '৪–৬ ঘণ্টা',
        '2–4 hrs': '২–৪ ঘণ্টা',
        '<2 hrs': '২ ঘণ্টার কম',
      },
      timeAfter: {
        '<1 hr': '১ ঘণ্টার কম',
        '1–2 hrs': '১–২ ঘণ্টা',
        '2+ hrs': '২+ ঘণ্টা',
      },
      errorBefore: {
        'Very high': 'খুব বেশি',
        'High': 'বেশি',
        'Medium': 'মাঝারি',
        'Low': 'কম',
      },
      errorAfter: {
        'Very low': 'খুব কম',
        'Low': 'কম',
        'Medium': 'মাঝারি',
      },
      usageDuration: {
        '< 3 months': '৩ মাসের কম',
        '3–6 months': '৩–৬ মাস',
        '6–12 months': '৬–১২ মাস',
        '12+ months': '১২+ মাস',
      },
      roles: {
        'Field Officer (FO)': 'ফিল্ড অফিসার (FO)',
        'Area Manager (AM)': 'এরিয়া ম্যানেজার (AM)',
        'Regional Manager (RM)': 'রিজিওনাল ম্যানেজার (RM)',
        'Operations': 'অপারেশন',
        'Finance & Accounts': 'ফাইন্যান্স ও অ্যাকাউন্টস',
      },
      modules: {
        'Farmer Onboarding': 'ফার্মার অনবোর্ডিং',
        'Bank Panel': 'ব্যাংক প্যানেল',
        'Input Panel': 'ইনপুট প্যানেল',
        'Collection Panel': 'কালেকশন প্যানেল',
        'Deposit & Bank Settlement': 'ডিপোজিট ও ব্যাংক সেটেলমেন্ট',
        'ERP / Dashboards': 'ERP / ড্যাশবোর্ড',
        'Field Force Monitoring': 'ফিল্ড ফোর্স মনিটরিং',
      },
    },
    form: {
      required: '*',
      selectRole: 'ভূমিকা নির্বাচন করুন...',
      selectDuration: 'সময়কাল নির্বাচন করুন...',
      selectTime: 'নির্বাচন করুন...',
      submitButton: 'সার্ভে জমা দিন',
      placeholders: {
        biggestImprovement: 'আপনার অভিজ্ঞতায় সবচেয়ে বড় উন্নতি শেয়ার করুন...',
        oneImprovementNeeded: 'একটি উন্নতির প্রয়োজন আছে বলে আপনি মনে করেন?',
      },
      validation: {
        required: 'এই প্রশ্নটি পূরণ করা আবশ্যক',
        name: 'নাম পূরণ করা আবশ্যক',
        role: 'ভূমিকা নির্বাচন করা আবশ্যক',
        usageDuration: 'ব্যবহারের সময়কাল নির্বাচন করা আবশ্যক',
        modulesUsed: 'অন্তত একটি মডিউল নির্বাচন করা আবশ্যক',
        moduleImpact: 'প্রভাবের মাত্রা নির্বাচন করা আবশ্যক',
      },
    },
    alert: {
      title: 'অসম্পূর্ণ তথ্য!',
      message: 'জমা দেওয়ার আগে {count}টি আবশ্যক ক্ষেত্র পূরণ করুন।',
      hint: 'কোন ক্ষেত্রগুলো পূরণ করতে হবে তা দেখতে নিচে স্ক্রল করুন।',
    },
    footer: {
      follow: 'GitHub-এ আমাকে ফলো করুন',
    },
    matrix: {
      module: 'মডিউল',
      selectModules: 'Section A-তে মডিউল নির্বাচন করুন তাদের প্রভাব মূল্যায়ন করার জন্য',
    },
  },
  en: {
    title: 'OGRO Impact Survey',
    description: `This survey aims to understand how OGRO has impacted your work by reducing manual effort, saving time, and improving accuracy.

This survey is completely anonymous. No personal data is collected.  
It takes less than 5 minutes to complete.`,
    fields: {
      name: {
        label: 'Name',
        helper: 'This information will be used for internal reference only and will not be shared with anyone.',
      },
    },
    sections: {
      a: {
        title: 'Role & Usage Context',
        description: 'Basic information about your role and experience using OGRO.',
        questions: {
          role: '1. Your Role',
          usageDuration: '2. OGRO Usage Duration',
          modulesUsed: '3. Modules Used',
          modulesUsedHelper: 'You may select multiple options.',
        },
      },
      b: {
        title: 'Overall Satisfaction',
        description: 'Evaluate how OGRO has made your daily work easier and more effective.',
        questions: {
          reducedManualWork: '4. OGRO has reduced my manual work',
          savesTimeDaily: '5. OGRO saves me time daily',
          dataAccuracyImproved: '6. Data accuracy has improved with OGRO',
          easierTracking: '7. Tracking and follow-ups are easier with OGRO',
          improvedEfficiency: '8. OGRO has improved my overall work efficiency',
        },
      },
      c: {
        title: 'Module-wise Impact',
        description: 'Please evaluate how much impact each OGRO module has had on your work.',
        scaleHint: '1 = No impact | 5 = Very high impact',
      },
      d: {
        title: 'Before vs After',
        description: 'This section compares your work experience before and after using OGRO.',
        questions: {
          timeSpentBefore: '9. Time spent BEFORE OGRO',
          timeSpentAfter: '10. Time spent AFTER OGRO',
          errorFrequencyBefore: '11. Error frequency BEFORE OGRO',
          errorFrequencyAfter: '12. Error frequency AFTER OGRO',
        },
      },
      e: {
        title: 'Confidence & Adoption',
        description: 'Evaluate your confidence in OGRO data and how regularly you use the system.',
        questions: {
          trustOGROData: '13. I trust OGRO data',
          lessExcelWhatsApp: '14. Less Excel / WhatsApp usage due to OGRO',
          preferOGROOverOldTools: '15. I prefer OGRO over old tools',
        },
      },
      f: {
        title: 'Open Feedback',
        description: 'You may share any important feedback or suggestions in your own words (optional).',
        questions: {
          biggestImprovement: '16. Biggest improvement',
          oneImprovementNeeded: '17. One improvement needed',
        },
      },
    },
    options: {
      likert: {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree',
      },
      impact: {
        1: 'No impact',
        2: 'Low impact',
        3: 'Moderate impact',
        4: 'High impact',
        5: 'Very high impact',
      },
      timeBefore: {
        '4–6 hrs': '4–6 hours',
        '2–4 hrs': '2–4 hours',
        '<2 hrs': 'Less than 2 hours',
      },
      timeAfter: {
        '<1 hr': 'Less than 1 hour',
        '1–2 hrs': '1–2 hours',
        '2+ hrs': '2+ hours',
      },
      errorBefore: {
        'Very high': 'Very high',
        'High': 'High',
        'Medium': 'Medium',
        'Low': 'Low',
      },
      errorAfter: {
        'Very low': 'Very low',
        'Low': 'Low',
        'Medium': 'Medium',
      },
      usageDuration: {
        '< 3 months': '< 3 months',
        '3–6 months': '3–6 months',
        '6–12 months': '6–12 months',
        '12+ months': '12+ months',
      },
      roles: {
        'Field Officer (FO)': 'Field Officer (FO)',
        'Area Manager (AM)': 'Area Manager (AM)',
        'Regional Manager (RM)': 'Regional Manager (RM)',
        'Operations': 'Operations',
        'Finance & Accounts': 'Finance & Accounts',
      },
      modules: {
        'Farmer Onboarding': 'Farmer Onboarding',
        'Bank Panel': 'Bank Panel',
        'Input Panel': 'Input Panel',
        'Collection Panel': 'Collection Panel',
        'Deposit & Bank Settlement': 'Deposit & Bank Settlement',
        'ERP / Dashboards': 'ERP / Dashboards',
        'Field Force Monitoring': 'Field Force Monitoring',
      },
    },
    form: {
      required: '*',
      selectRole: 'Select role...',
      selectDuration: 'Select duration...',
      selectTime: 'Select...',
      submitButton: 'Submit Survey',
      placeholders: {
        biggestImprovement: "Share the biggest improvement you've experienced...",
        oneImprovementNeeded: "What's one thing you'd like to see improved?",
      },
      validation: {
        required: 'This question is required',
        name: 'Name is required',
        role: 'Role selection is required',
        usageDuration: 'Usage duration selection is required',
        modulesUsed: 'At least one module must be selected',
        moduleImpact: 'Impact level selection is required',
      },
    },
    alert: {
      title: 'Missing Fields Detected!',
      message: 'Please fill in {count} required field{plural} before submitting.',
      hint: 'Scroll down to see which fields need to be completed.',
    },
    footer: {
      follow: 'Follow me on GitHub',
    },
    matrix: {
      module: 'Module',
      selectModules: 'Select modules in Section A to rate their impact',
    },
  },
};
