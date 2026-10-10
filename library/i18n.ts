export const translations = {
  English: {
    takePhoto: "Take a photo of the label",
    analyze: "Analyze Label",
    reading: "Reading your label...",
    amount: "Amount for your tank",
    harvest: "Safe harvest date",
    wait: "Wait",
    days: "days after spraying before harvest.",
    source: "Show source text",
    hideSource: "Hide source text",
    cannotRead: "Cannot safely read label",
    retry: "Take another photo",
    cropNotListed: "This crop is not listed on the pesticide label.",
  },

  Hindi: {
    takePhoto: "लेबल की फोटो लें",
    analyze: "लेबल की जांच करें",
    reading: "आपका लेबल पढ़ा जा रहा है...",
    amount: "आपकी टंकी के लिए मात्रा",
    harvest: "सुरक्षित कटाई की तारीख",
    wait: "स्प्रे के बाद",
    days: "दिन तक फसल की कटाई न करें।",
    source: "लेबल का मूल पाठ दिखाएं",
    hideSource: "मूल पाठ छिपाएं",
    cannotRead: "लेबल को सुरक्षित रूप से पढ़ नहीं सके",
    retry: "दूसरी फोटो लें",
    cropNotListed: "यह फसल कीटनाशक के लेबल पर सूचीबद्ध नहीं है।",
  },

  Kannada: {
    takePhoto: "ಲೇಬಲ್‌ನ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
    analyze: "ಲೇಬಲ್ ಪರಿಶೀಲಿಸಿ",
    reading: "ನಿಮ್ಮ ಲೇಬಲ್ ಓದಲಾಗುತ್ತಿದೆ...",
    amount: "ನಿಮ್ಮ ಟ್ಯಾಂಕ್‌ಗೆ ಬೇಕಾದ ಪ್ರಮಾಣ",
    harvest: "ಸುರಕ್ಷಿತ ಕೊಯ್ಲು ದಿನಾಂಕ",
    wait: "ಸಿಂಪಡಿಸಿದ ನಂತರ",
    days: "ದಿನಗಳವರೆಗೆ ಕೊಯ್ಲು ಮಾಡಬೇಡಿ.",
    source: "ಮೂಲ ಪಠ್ಯವನ್ನು ತೋರಿಸಿ",
    hideSource: "ಮೂಲ ಪಠ್ಯವನ್ನು ಮರೆಮಾಡಿ",
    cannotRead: "ಲೇಬಲ್ ಅನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",
    retry: "ಮತ್ತೆ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
    cropNotListed: "ಈ ಬೆಳೆ ಕೀಟನಾಶಕದ ಲೇಬಲ್‌ನಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ.",
  },
} as const;

export type Language = keyof typeof translations;