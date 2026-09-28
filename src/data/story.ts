export interface ParagraphItem {
  id: string;
  speaker: 'narrator' | 'amanuel' | 'lelise';
  text: string;
  translation?: string;
  highlightWords?: string[];
}

export interface Chapter {
  id: number;
  geeNum: string;
  title: string;
  titleEn: string;
  time: string;
  summary: string;
  paragraphs: ParagraphItem[];
  keyQuote: {
    text: string;
    speaker: string;
  };
}

export interface CharacterProfile {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  age: string;
  avatarSeed: string;
  description: string;
  backstory: string;
  motivation: string;
  voiceStyle: string;
  geminiVoice: string;
  traits: string[];
}

export interface GlossaryItem {
  term: string;
  phonetic: string;
  definition: string;
  context: string;
}

export const NOVEL_META = {
  title: "የባቡር ጣቢያው ጥላ",
  titleEn: "The Shadow of the Train Station",
  author: "የአማርኛ ስነ-ጽሑፍ ትረካ",
  setting: "ላፍቶ ባቡር ጣቢያ (Lafto Train Station), አዲስ አበባ",
  destination: "ድሬዳዋ - ጅቡቲ መስመር (Dire Dawa - Djibouti Line)",
  atmosphere: "ጭጋጋማ ዝናብ፣ የናስ ሰዓት ድምፅ፣ የብረት ሀዲድ ማሚቶ",
  synopsisAm: "በላፍቶ ባቡር ጣቢያ ስለተገናኙትና ሕይወታቸውን በአዲስ መልክ ስለሚጀምሩት ስለአማኑኤል እና ሌሊሴ የሚተርክ ድንቅ ታሪክ ነው። አማኑኤል ከአምስት ዓመት በፊት የተለየችውንና የምትመለስበትን ሰዓት የሚጠብቅ ሲሆን፣ ሌሊሴ ደግሞ የራሷን መንገድ ለመፈለግ ከቤተሰቦቿ ሸሽታ የመጣች ወጣት ነች። የባቡሩ መምጫ ሰዓት ሲደርስ ሁለቱም ያለፉትን ትዝታዎች ወደ ጎን በመተው አብረው አዲስ ጉዞ ለመጀመር ይወስናሉ።",
  synopsisEn: "A poignant Amharic tale of Amanuel, who spent five long years waiting at Lafto train station for a past love to return, and Lelise, an artist who fled the rigid chains of her family to forge her own destiny. In the twilight mist of the station platform, as the midnight train whistle echoes, two wandering souls cast off yesterday's grief to embark together into the dawn."
};

export const CHARACTERS: CharacterProfile[] = [
  {
    id: "amanuel",
    name: "አማኑኤል",
    nameEn: "Amanuel",
    role: "ትዝታን ያነገበው ተጓዥ",
    roleEn: "The Nostalgic Wanderer",
    age: "29 ዓመት",
    avatarSeed: "amanuel",
    description: "ረጅሙን ጥቁር ኮት ለብሶ፣ ያረጀ የኪስ ሰዓት እያየ ላለፉት አምስት ዓመታት በየሳምንቱ አርብ ላፍቶ ጣቢያ የሚመላለስ ጸጥተኛ ሰው።",
    backstory: "ከአምስት ዓመታት በፊት በፍቅር የወደቀባት ሳራ 'በዚህ ባቡር እመለሳለሁ' ብላ ተስፋ ሰጥታው ወደ ምስራቅ ተጓዘች። እርሱ ግን የገባውን ቃል ሳያፈርስ በጣቢያው ጥላ ስር ቆሞ የቀን መቁጠሪያውን ብቻ ያገላብጣል፤ ዛሬ ግን ያ ተስፋ ጥላ ብቻ ሆኖ ቀርቷል።",
    motivation: "ከቀደመው ህመሙና ካለፈው እስራት ተላቆ እንደገና ለመተንፈስና አዲስ ህይወት ለማግኘት መሻት።",
    voiceStyle: "ጥልቅ፣ የተረጋጋ፣ ጥቂት የናፍቆት ቅላጼ ያለበት የወንድ ድምፅ",
    geminiVoice: "Puck",
    traits: ["ታማኝ", "አስተዋይ", "ውስጠ-ታዋቂ", "ትዕግስተኛ"]
  },
  {
    id: "lelise",
    name: "ሌሊሴ",
    nameEn: "Lelise",
    role: "ነጻነቷን የፈለገችው ብሩህ ኮከብ",
    roleEn: "The Free-Spirited Seeker",
    age: "23 ዓመት",
    avatarSeed: "lelise",
    description: "የቀለም ብሩሾቿንና ማስታወሻ ደብተሯን የያዘ የቆዳ ቦርሳ አሸክማ፣ ነጠላዋን በዝናብ አርሳ የሮጠች ደፋርና ስሜታዊ ወጣት።",
    backstory: "ቤተሰቦቿ ለእርሷ ሳይሆን ለክብራቸው ብለው ያዘጋጁላትን አስገዳጅ ጋብቻ እና የቢሮ ህይወት ጥላ፣ የራሷን ህልም ለመሳል እና የስዕል አለሟን ለማስፋት ከአዳማ ወደ ላፍቶ አምልጣ መጣች።",
    motivation: "የሌሎችን ውሳኔ ሳይሆን የራሷን እውነተኛ ማንነት እና ነጻነት ለመኖር ጽናት ማግኘት።",
    voiceStyle: "ብርሃናማ፣ ገላጭ፣ ቆራጥ እና ስሜታዊ የሆነ የሴት ድምፅ",
    geminiVoice: "Kore",
    traits: ["ደፋር", "የስነ-ጥበብ አፍቃሪ", "እውነተኛ", "አልሸነፍ ባይ"]
  }
];

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    geeNum: "፩",
    title: "የላፍቶ ምሽት እና አምስቱ ዓመታት",
    titleEn: "Twilight at Lafto and the Five Years",
    time: "ምሽት 10:15",
    summary: "አማኑኤል በቀዝቃዛው የላፍቶ ባቡር ጣቢያ የመጠባበቂያ ወንበር ላይ ተቀምጦ የብረት ሀዲዶቹን ዝምታ ያዳምጣል። ላለፉት አምስት ዓመታት በየሳምንቱ እዚህ የመጣው ለማን እንደነበረ በልቡ እያሰበ፣ የትዝታው ክብደት ያንገላታዋል።",
    keyQuote: {
      text: "የባቡር ሀዲድ የሚለያይ መስሎት ሁልጊዜ በሌላ ከተማ ላይ ይገናኛል፤ እኔ ግን በአንድ ስፍራ ተቸንክሬ የቀረሁ ጥላ ነኝ።",
      speaker: "አማኑኤል"
    },
    paragraphs: [
      {
        id: "ch1-p1",
        speaker: "narrator",
        text: "በላፍቶ የባቡር ጣቢያ ላይ የቀዘቀዘው የምሽት ጭጋግ እንደ ቀጭን ነጠላ ተዘርግቷል። ከቆርቆሮው ጣሪያ ላይ የሚንጠባጠበው የዝናብ ጠብታ በብረት ሀዲዱ ላይ እያረፈ ልዩ ዜማ ይፈጥራል። የመድረኩ ቢጫ አምፖሎች በእርጥበቱ ብርጭቆ ውስጥ ሲንቀጠቀጡ ይታያሉ።",
        translation: "A chill evening mist spread like fine gauze across Lafto train station. Rain droplets dripping from corrugated roofing struck the iron rails in a rhythmic hum."
      },
      {
        id: "ch1-p2",
        speaker: "narrator",
        text: "አማኑኤል ረጅሙን የሱፍ ኮት አንገት ሰብሰብ አድርጎ በእንጨት ወንበሩ ላይ ተቀምጧል። እጆቹ በኪሱ ውስጥ የነበረውን ያረጀ የናስ ኪስ ሰዓት ያለ እረፍት ያሻሻሉ። ሰዓቱ 10:15 ይላል። ከአምስት ዓመታት በፊት ሳራ በዚሁ መድረክ ላይ 'በመከር ባቡር እመለሳለሁ' ያለችበት ሰዓት ልክ እንደ ዛሬው ነበር።",
        translation: "Amanuel sat upon the weathered wooden bench, collar pulled tight. His fingers unconsciously traced the edges of an old brass pocket watch."
      },
      {
        id: "ch1-p3",
        speaker: "amanuel",
        text: "አምስት ዓመታት... አምስት ሙሉ ክረምቶችና በጋዎች አለፉ። በየሳምንቱ አርብ በዚህ ወንበር ላይ እቀመጣለሁ። ባቡሮቹ ይመጣሉ፣ ሰዎችን ያራግፋሉ፣ አዳዲስ ተጓዦችን ጭነው ወደ ድሬዳዋ ይከንፋሉ። እኔ ግን የቆምኩት በጊዜ ውስጥ ሳይሆን በጠፋ ተስፋ ጥላ ስር ነው። እውነት የምጠብቃት እርሷን ነው ወይስ ራሴን?",
        translation: "Five whole years... Five complete rainy seasons. I sit here every Friday. Trains arrive, passengers disperse, new souls board for Dire Dawa. But I am anchored beneath the shadow of a forgotten promise."
      },
      {
        id: "ch1-p4",
        speaker: "narrator",
        text: "የጣቢያው ድምጽ ማጉያ በዝግታ ተንሾካሾከ፡ 'ከአዲስ አበባ ወደ ድሬዳዋ የሚጓዘው የምሽቱ ፈጣን ባቡር በ11:50 መድረክ ሁለት ላይ ይደርሳል።' ድምፁ በአማኑኤል ልብ ውስጥ የቆየ ስንጥቅ ፈጠረ። ያቺ የመጨረሻዋ ባቡር የዛሬዋም የመጨረሻ ተስፋው ናት።",
        translation: "The station loudspeaker crackled gently: 'The night express from Addis Ababa to Dire Dawa will arrive on Platform Two at 11:50.' The announcement stirred an old ache in Amanuel's chest."
      }
    ]
  },
  {
    id: 2,
    geeNum: "፪",
    title: "የሸሸችው ኮከብ",
    titleEn: "The Escaped Star",
    time: "ምሽት 10:45",
    summary: "ሌሊሴ በጣቢያው በር በኩል በሩጫ ትገባለች። የቆዳ ቦርሳዋ በስዕል መገልገያዎች የተሞላ ሲሆን፣ ከቤተሰቦቿ አስገዳጅ ውሳኔ አምልጣ የመጣችበት እያንዳንዱ እርምጃ የነጻነት ሽታ አለው።",
    keyQuote: {
      text: "የሌሎችን ሕልም ከመኖር ይልቅ በገዛ እጄ በሳልኩት የችጋር መንገድ ላይ መራመድ ይበልጥብኛል።",
      speaker: "ሌሊሴ"
    },
    paragraphs: [
      {
        id: "ch2-p1",
        speaker: "narrator",
        text: "የጣቢያው የብረት በር በኃይል ተከፈተ። አንዲት ወጣት ሴት በከባድ አተነፋፈስ ወደ መድረኩ ገባች። ነጠላዋ በዝናብ ረጥቧል፤ ነገር ግን በትከሻዋ ላይ ያነገበችውን የቆዳ ቦርሳ እንደ ውድ ሀብት አጥብቃ ይዛዋለች። ዓይኖቿ በፍርሃት ሳይሆን በታላቅ የነጻነት ረሃብ ያበሩ ነበር።",
        translation: "The iron gate rattled open. A young woman entered the platform, chest heaving. Her shawl was drenched, yet she clutched a leather satchel like sacred treasure."
      },
      {
        id: "ch2-p2",
        speaker: "lelise",
        text: "አመለጠሁ... በመጨረሻ አመለጠሁ! ቤተሰቦቼ ያሰመሩልኝን የውሸት ክብርና የጋብቻ ሰንሰለት ቆርጬ ጣልኩት። በዚያ ቤት ውስጥ ብቀር ኖሮ ነፍሴ እንደ ቀለሙ እቃ ትደርቅ ነበር። እኔ ሰዓሊ ነኝ፤ ቀለሜ ደግሞ በነጻ አየር ላይ ብቻ ነው የሚፈነዳው!",
        translation: "I broke away... at last! I severed the fabricated honor and arranged shackles my elders drew for me. Had I stayed, my soul would have withered like dried tempera paint."
      },
      {
        id: "ch2-p3",
        speaker: "narrator",
        text: "ሌሊሴ ወደ መድረኩ ጥላ ስር ተጠጋች። ከዝናቡ ለመጠለል ስትፈልግ፣ በመብራቱ ድንግዝግዝ ውስጥ በአንድ ወንበር ጫፍ ላይ የተቀመጠውን ጭምት ሰው ተመለከተች። ፊቱ ላይ ያረፈው ጸጥታ እንግዳ የሆነ መረጋጋት ፈጠረባት። ወደ እርሱ ተጠግታ በጣቢያው የእንጨት ወንበር ሌላኛው ጫፍ ላይ ተቀመጠች።",
        translation: "Lelise sought shelter beneath the wooden overhang. In the amber station dusk, she caught sight of a contemplative man seated on the bench end, his stillness strangely soothing."
      },
      {
        id: "ch2-p4",
        speaker: "lelise",
        text: "ይቅርታ አድርግልኝ ጋሼ... እዚህ መቀመጥ እችላለሁ? ዝናቡ ከውጭ በጣም በረታ። ቦርሳዬ ውስጥ ያሉት ሸራዎች እንዳይበላሹ ብቻ ነው የፈራሁት።",
        translation: "Pardon me, brother... May I sit here? The rain has turned fierce. I only feared for the canvases in my bag."
      }
    ]
  },
  {
    id: 3,
    geeNum: "፫",
    title: "በሻይ ኩባያ መካከል የተሰበረ ዝምታ",
    titleEn: "Silence Broken Over Tea",
    time: "ምሽት 11:20",
    summary: "አማኑኤል እና ሌሊሴ ከጣቢያው አነስተኛ ሻይ ቤት የተገዛውን የቁንዶ በርበሬ እና ቀረፋ ሻይ እየተጎነጩ፣ የልባቸውን ሚስጥር ይለዋወጣሉ። አማኑኤል የ5 ዓመቱን የመጠባበቅ ባርነት ሲናገር፣ ሌሊሴ የመሸሽ ድፍረቷን ታካፍለዋለች።",
    keyQuote: {
      text: "አንዳንድ ጊዜ የምንጠብቀው ሰው ሳይሆን የሞተውን የራሳችንን ትዝታ ነው። ሙታንን በባቡር ጣቢያ መፈለግ ማቆም አለብህ።",
      speaker: "ሌሊሴ"
    },
    paragraphs: [
      {
        id: "ch3-p1",
        speaker: "narrator",
        text: "አማኑኤል አንገቱን አቅንቶ አያት። በእርሷ ዓይኖች ውስጥ ያየው ብርሃን በጣቢያው ውስጥ ለዓመታት ካየው የደከመ እይታ ፈጽሞ የተለየ ነበር። ተነሥቶ ወደ ጣቢያው ጥግ ሄደና ሁለት የጋለ ቀረፋ ሻይ በቆርቆሮ ኩባያ ይዞ ተመለሰ። አንዱን ዘረጋላት።",
        translation: "Amanuel looked up. The vibrancy burning in her eyes was unlike the exhausted stares he had witnessed on this platform for half a decade. He brought back two steaming cups of spiced tea."
      },
      {
        id: "ch3-p2",
        speaker: "amanuel",
        text: "ይህ የላፍቶ ሻይ ብርዱን ያስረሳል፤ ጠጪው። እኔ አማኑኤል እባላለሁ። ላለፉት አምስት ዓመታት በዚህ መድረክ ላይ ብዙ ሰዎችን አይቻለሁ፤ ነገር ግን እንደ አንቺ በነጻነት ለመብረር የቋመጠች ወፍ አይቼ አላውቅም። ማንን ነው የምትሸሺው?",
        translation: "This Lafto spiced tea cuts through the cold; drink. I am Amanuel. For five years on this platform I've watched countless souls, but never a bird so desperate to unfurl her wings. What are you fleeing?"
      },
      {
        id: "ch3-p3",
        speaker: "lelise",
        text: "ስሜ ሌሊሴ ይባላል። እኔ የምሸሸው ከሰው ሳይሆን ከታነቀ ሕይወት ነው። ቤተሰቦቼ 'የእኛን ክብር ጠብቂ' እያሉ በሳጥን ውስጥ ሊያስቀምጡኝ ፈለጉ። አንተስ አማኑኤል? አምስት ዓመት ሙሉ እዚህ ምን ትሰራለህ? ሰዓትህን ደጋግመህ ስታይ አስተውዬሃለሁ።",
        translation: "My name is Lelise. I am not running from a person, but from a strangled life. My family sought to box me in. And what of you, Amanuel? What have you done here for five whole years?"
      },
      {
        id: "ch3-p4",
        speaker: "amanuel",
        text: "የምጠብቃት ሴት ነበረች... ሳራ። በዚህ ጣቢያ ተሰናብታኝ ስትሄድ 'እመለሳለሁ' ያለችኝን ቃል እንደ ቅዱስ መጽሐፍ አምኜው ኖርኩ። ግን አሁን ሳስበው፣ እርሷ ከሄደች በሦስተኛው ወር እንደተጋባች አውቃለሁ፤ እኔ ግን ተስፋዋን ሳይሆን የራሴን ብቸኝነት ነበር ሳመልክ የኖርኩት።",
        translation: "There was a woman I waited for... Sara. When she parted here, I clung to her promise like scripture. Yet deep down I knew she married within months; it was not her I worshipped, but my own solitude."
      },
      {
        id: "ch3-p5",
        speaker: "lelise",
        text: "አማኑኤል፣ የባቡር ጣቢያ የመሸጋገሪያ ቦታ እንጂ የመቃብር ስፍራ አይደለም! የማትመጣውን ጥላ እየጠበቅህ እንዴት ወጣትነትህን ትገብራለህ? ያ የቆየ ሰዓትህ የትናንትን ሰኮንዶች ነው የሚቆጥረው። ወደ ፊት መጓዝ አትፈልግም?",
        translation: "Amanuel, a train station is a portal of transition, not a graveyard! Why surrender your prime awaiting an phantom? Your antique watch counts dead seconds. Do you not yearn to look forward?"
      }
    ]
  },
  {
    id: 4,
    geeNum: "፬",
    title: "የመጨረሻው ፊሽካ እና አዲስ ጎህ",
    titleEn: "The Final Whistle and a New Dawn",
    time: "ምሽት 11:50",
    summary: "የምሽቱ ፈጣን ባቡር በታላቅ ጭስና ጩኸት ላፍቶ ደረሰ። አማኑኤል የኪስ ሰዓቱን ከማየት ይልቅ የሌሊሴን እጅ አይቶ ወሰነ። ያለፈውን ጥላ ጥለው አብረው ወደ ባቡሩ ገቡ፤ የድሬዳዋ ጉዞ የአዲስ ሕይወት መጀመሪያ ሆነ።",
    keyQuote: {
      text: "ትናንት ጥላ ነበረ፤ ዛሬ ግን በጋራ የምንጽፈው አዲስ መጽሐፍ ነው።",
      speaker: "አማኑኤል እና ሌሊሴ"
    },
    paragraphs: [
      {
        id: "ch4-p1",
        speaker: "narrator",
        text: "በሩቅ የብረት ሀዲድ ላይ የሚንቀጠቀጥ የብርሃን ምሰሶ ታየ። የባቡሩ ኃይለኛ ፊሽካ የላፍቶን ሸለቆ ቀደደው። ጩኸቱ፣ የብረቱ መጋጨትና የመንኮራኩሮቹ ፉጨት የመድረኩን ዝምታ በጣጥሰው። የምሽቱ 11:50 ፈጣን ባቡር በእንፋሎት ታጅቦ ቆመ።",
        translation: "Along the far tracks, a trembling beam of white light sliced the dark. The locomotive's horn ripped across the valley of Lafto, shattering the platform's melancholy."
      },
      {
        id: "ch4-p2",
        speaker: "narrator",
        text: "የባቡሩ በሮች ተከፈቱ። ጥቂት ተሳፋሪዎች ሲወርዱ፣ ሌሊሴ ቦርሳዋን አጥብቃ ይዛ ተነሳች። ወደ አማኑኤል ዞር አለች፤ ፊቷ ላይ ግብዣና ተስፋ ተደባልቆ ይነበብ ነበር። 'እኔ ወደ ድሬዳዋ ከዚያም ወደ ጅቡቲ እጓዛለሁ፤ አዲስ ቀለም አለኝ። አንተስ አማኑኤል፣ ዛሬም እዚህ ጥላ ስር ታድራለህ?'",
        translation: "The carriages hissed open. Lelise hoisted her satchel, turning back toward Amanuel with an unspoken invitation in her gaze: 'I ride toward Dire Dawa, then Djibouti. Will you spend another night beneath the platform's shade?'"
      },
      {
        id: "ch4-p3",
        speaker: "amanuel",
        text: "አይ... ከአሁን በኋላ ጥላ አልሆንም! ላለፉት አምስት ዓመታት የቆምኩት በመቃብር ደጃፍ ነበር። ዛሬ ግን የመጀመሪያዬን እርምጃ መራመድ እፈልጋለሁ። ሌሊሴ፣ ትኬት አለኝ፤ ከዚህ ሰዓት ጀምሮ ጉዞዬ ከአንቺ ጋር ይሁን!",
        translation: "No... never again shall I dwell in shadows! For five years I lingered outside a tomb. Tonight I take my first living stride. Lelise, I hold a ticket—let my journey begin beside you!"
      },
      {
        id: "ch4-p4",
        speaker: "narrator",
        text: "አማኑኤል ያረጀውን የናስ ኪስ ሰዓት ከኪሱ አውጥቶ በወንበሩ ላይ ተወው። የሌሊሴን እጅ ያዘ። ሁለቱም ደረጃዎቹን ረግጠው ወደ ሞቃታማው የባቡር ክፍል ገቡ። ባቡሩ ዳግም ጮኸ፤ መንኮራኩሮቹ ተሽከረከሩ። የላፍቶ ጣቢያ ጥላ ወደ ኋላ እየራቀ ሲሄድ፣ በፊታቸው የወርቅ የጎህ ብርሃን ተዘረጋ።",
        translation: "Amanuel laid his antique pocket watch upon the bench, leaving it behind forever. He took Lelise's hand. Together they boarded the illuminated carriage. As the station faded into the dark, an amber dawn rose before them."
      }
    ]
  }
];

export const GLOSSARY: GlossaryItem[] = [
  {
    term: "ላፍቶ ጣቢያ",
    phonetic: "Lafto Tabya",
    definition: "በአዲስ አበባ ደቡብ-ምዕራብ አቅጣጫ የሚገኘው ታሪካዊና ዘመናዊ የባቡር መስመር ማቆሚያ፤ የከተማዋ መነሻና መሸኛ ምልክት።",
    context: "የታሪኩ ዋና መድረክ ሲሆን የብቸኝነትና የአዲስ ጅምር መገናኛ ሆኖ አገልግሏል።"
  },
  {
    term: "የናስ ኪስ ሰዓት",
    phonetic: "Ye-Nas Keese Se'at",
    definition: "ጥንታዊ የኪስ ሰዓት፤ በታሪኩ ውስጥ ያለፈው ጊዜ እስራትና የናፍቆት ምልክት ሆኖ የቀረበ።",
    context: "አማኑኤል ለ5 ዓመታት ሲያሻሸው ኖሮ በመጨረሻ በወንበሩ ላይ ጥሎት የወጣው ተምሳሌት።"
  },
  {
    term: "የቀረፋ ሻይ",
    phonetic: "Ye-Qerefa Shay",
    definition: "በኢትዮጵያ ባህላዊ ባቡር ጣቢያዎች የሚሸጥ፣ በቁንዶ በርበሬና ቀረፋ የጋለ ሞቅ ያለ ሻይ።",
    context: "የአማኑኤልና የሌሊሴን ዝምታ የሰበረውና መቀራረባቸውን የፈጠረው ተምሳሌታዊ መጠጥ።"
  },
  {
    term: "ድሬዳዋ መስመር",
    phonetic: "Dire Dawa Mesmer",
    definition: "ከአዲስ አበባ ወደ ምስራቅ ኢትዮጵያና ጅቡቲ የሚወስደው ጥንታዊና ፈጣን የባቡር አውታር።",
    context: "የነጻነት፣ የስራ ፈጠራና የክፍት አድማስ መዳረሻ ተደርጎ ተወስዷል።"
  },
  {
    term: "ጥላ",
    phonetic: "T'ila",
    definition: "በስነ-ጽሑፋዊ ትርጉሙ ያለፈ ህመም፣ የጸጸት ጭንብል ወይም በጊዜ ውስጥ የመቀረት ሁኔታ።",
    context: "በልብ-ወለዱ ርዕስ 'የባቡር ጣቢያው ጥላ' ተብሎ የተገለጸው ዋና ፍልስፍና።"
  }
];
