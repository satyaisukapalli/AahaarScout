/**
 * Content Moderation Engine
 * Strictly filters out vulgarity, obscenity, hate speech, NSFW terms,
 * harassment, and abusive language in English and regional Indian languages.
 */

// Blocklist of prohibited vulgar, obscene, explicit, or abusive patterns
const BANNED_PATTERNS: RegExp[] = [
  // Profanity & explicit vulgarity (English)
  /\b(fuck|fucking|fucker|fck|f\*ck|fuk|shit|sh\*t|bitch|b\*tch|asshole|bastard|dick|pussy|cunt|slut|whore|nude|naked|porn|nsfw|sex|orgasm|penis|vagina|boobs|tits|blowjob|cock)\b/i,
  /\b(motherfucker|muthafucka|mf|dumbass|jackass|dipshit|bullshit|horseshit|cockhead)\b/i,
  
  // Obscene/Vulgar Hindi/Urdu transliterations
  /\b(chutiya|chutiye|madarchod|bhenchod|behenchod|bhosdike|bhosadi|gaand|gandu|lauda|loda|lund|randi|harami|chinal|kamina|kamine|suar)\b/i,
  /\b(mc|bc|bsdk|chutiyaap|lawde|lode|jhant|jhat)\b/i,

  // Obscene/Vulgar Telugu transliterations
  /\b(dengu|dengey|dengudu|lanja|lanjakodaka|lanjamunda|modda|guddha|puku|pooku|erripooku|erripappa|naa kodaka|bokka|munda|chedagottu)\b/i,

  // Obscene/Vulgar Tamil transliterations
  /\b(thevidiya|thevidiya paiya|oombu|sunni|poolu|punda|pundai|baadu|kena|lavade|otha|okkalaoli)\b/i,

  // Obscene/Vulgar Malayalam transliterations
  /\b(myre|myla|kunna|koothi|thendi|polayadi|ninte amma|thayoli)\b/i,

  // Hate speech, slurs & discriminatory attacks
  /\b(nigger|nigga|faggot|retard|casteist|terrorist|kill yourself|die in hell)\b/i,
];

// Normalized check to defeat spaced/character substituted attempts (e.g., "f u c k", "b.i.t.c.h", "s_h_i_t")
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[+]/g, 't')
    .replace(/[^a-z0-9\s]/g, '') // remove special symbols
    .replace(/\s+/g, ' '); // normalize whitespace
}

function checkSpacedObscenities(rawText: string): boolean {
  // Test for spaced bad words like "f u c k", "l a n j a"
  const stripped = rawText.toLowerCase().replace(/[^a-z]/g, '');
  const dangerousShortKeywords = [
    'fuck', 'shit', 'bitch', 'cunt', 'pussy', 'nude', 'porn', 'cock',
    'chutiya', 'madarchod', 'bhenchod', 'bhosdike', 'gandu', 'lauda',
    'lanja', 'modda', 'pooku', 'erripooku', 'myre', 'punda', 'otha'
  ];
  
  for (const kw of dangerousShortKeywords) {
    if (stripped.includes(kw)) {
      return true;
    }
  }
  return false;
}

export interface ModerationResult {
  isValid: boolean;
  reason?: string;
  flaggedTerm?: string;
}

/**
 * Validates text input against community safety standards
 */
export function validateContent(
  text: string, 
  contextName = 'post'
): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { isValid: true };
  }

  const rawLower = text.toLowerCase();
  const normalized = normalizeText(text);

  // Check direct regex patterns
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(rawLower) || pattern.test(normalized)) {
      return {
        isValid: false,
        reason: `Your ${contextName} contains prohibited vulgar, obscene, or abusive terms. Aahaarscout enforces a family-friendly foodie community.`,
        flaggedTerm: 'Profanity / Vulgarity'
      };
    }
  }

  // Check spaced obscenities
  if (checkSpacedObscenities(text)) {
    return {
      isValid: false,
      reason: `Your ${contextName} was flagged for disguised profanity or explicit phrasing. Please keep discussions welcoming and respectful.`,
      flaggedTerm: 'Disguised Obscenity'
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive multi-field validator for complete post creation
 */
export function validateForumPostInput(input: {
  title: string;
  content: string;
  memeTopText?: string;
  memeBottomText?: string;
  tags?: string[];
  pollQuestion?: string;
  pollOptions?: string[];
}): ModerationResult {
  // Check Title
  const titleCheck = validateContent(input.title, 'title');
  if (!titleCheck.isValid) return titleCheck;

  // Check Content
  const contentCheck = validateContent(input.content, 'description/body');
  if (!contentCheck.isValid) return contentCheck;

  // Check Meme Text if provided
  if (input.memeTopText) {
    const memeTopCheck = validateContent(input.memeTopText, 'meme top text');
    if (!memeTopCheck.isValid) return memeTopCheck;
  }
  if (input.memeBottomText) {
    const memeBottomCheck = validateContent(input.memeBottomText, 'meme bottom text');
    if (!memeBottomCheck.isValid) return memeBottomCheck;
  }

  // Check Poll if provided
  if (input.pollQuestion) {
    const pollCheck = validateContent(input.pollQuestion, 'poll question');
    if (!pollCheck.isValid) return pollCheck;
  }
  if (input.pollOptions) {
    for (let i = 0; i < input.pollOptions.length; i++) {
      const optCheck = validateContent(input.pollOptions[i], `poll option ${i + 1}`);
      if (!optCheck.isValid) return optCheck;
    }
  }

  // Check Tags
  if (input.tags) {
    for (const tag of input.tags) {
      const tagCheck = validateContent(tag, 'hashtag tag');
      if (!tagCheck.isValid) return tagCheck;
    }
  }

  return { isValid: true };
}

/**
 * Validates video duration (Strictly <= 15.5 seconds)
 */
export function validateVideoDuration(durationSeconds: number): { isValid: boolean; message?: string } {
  if (durationSeconds > 15.5) {
    return {
      isValid: false,
      message: `Video exceeds the 15-second limit (${Math.round(durationSeconds)}s). Please trim your clip to under 15 seconds.`
    };
  }
  return { isValid: true };
}
