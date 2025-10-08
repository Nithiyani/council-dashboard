// types/chairman.ts
export type Language = "en" | "ta" | "si";

export interface MultilingualText {
  en: string;
  ta: string;
  si: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: MultilingualText;
}

export interface TenureInfo {
  startDate: MultilingualText;
  currentTerm: MultilingualText;
}

export interface ChairmanData {
  name: MultilingualText;
  position: MultilingualText;
  photo: string;
  message: MultilingualText;
  contact: ContactInfo;
  tenure: TenureInfo;
}

export interface InfoCardItem {
  id: string;
  title: MultilingualText;
  subtext?: MultilingualText;
}

// constants/chairman.ts
export const LANGUAGES = [
  { value: "en" as const, label: "English" },
  { value: "ta" as const, label: "Tamil" },
  { value: "si" as const, label: "Sinhala" },
] as const;

export const INITIAL_CHAIRMAN_DATA: ChairmanData = {
  name: {
    en: "Dr. Sarah Johnson",
    ta: "டாக்டர் சாரா ஜான்சன்",
    si: "ඩා. සාරා ජොන්සන්"
  },
  position: {
    en: "Chairman",
    ta: "தலைவர்",
    si: "ප්‍රධානියා"
  },
  photo: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300",
  message: {
    en: "As Chairman, I am committed to serving our community with transparency, dedication, and progress. Together, we will build a stronger, more prosperous future for all residents.",
    ta: "தலைவராக, நான் வெளிப்படைத்தன்மை, அர்ப்பணிப்பு மற்றும் முன்னேற்றத்துடன் எங்கள் சமூகத்திற்கு சேவை செய்ய உறுதிபூண்டுள்ளேன். ஒன்றாக, அனைத்து குடிமக்களுக்கும் வலுவான, செழிப்பான எதிர்காலத்தை உருவாக்குவோம்.",
    si: "ප්‍රධානියා ලෙස, පාරදෘෂ්ටිකත්වය, කැපවීම සහ ප්‍රගතිය සමඟ අපගේ ප්‍රජාවට සේවය කිරීමට මම ප්‍රතිඥා දෙනවා. එක්ව, සියලුම වැසියන් සඳහා ශක්තිමත්, සමෘද්ධිමත් අනාගතයක් ගොඩනඟමු."
  },
  contact: {
    phone: "+1 (555) 123-4567",
    email: "chairman@council.gov",
    address: {
      en: "Municipal Building, Main Street",
      ta: "நகராட்சி கட்டடம், மெயின் தெரு",
      si: "මහ නගර සභා ගොඩනැගිල්ල, ප්‍රධාන වීදිය"
    }
  },
  tenure: {
    startDate: {
      en: "January 2022",
      ta: "ஜனவரி 2022",
      si: "2022 ජනවාරි"
    },
    currentTerm: {
      en: "2022-2026",
      ta: "2022-2026",
      si: "2022-2026"
    }
  }
};