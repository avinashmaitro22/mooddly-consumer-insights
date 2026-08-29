import type { QuestionMetadata } from "@/lib/supabase";

export type QuestionType =
  | "single_select"
  | "multi_select"
  | "scale"
  | "slider"
  | "text"
  | "checkbox";

export type OptionDef = {
  code: string;
  text: string;
  value?: number;
};

export type QuestionDef = {
  id: string; // stable local id used by the engine
  code: string; // question_code (matches DB)
  text: string;
  type: QuestionType;
  section: string;
  required: boolean;
  options?: OptionDef[];
  validation: {
    min_selections?: number;
    max_selections?: number;
    min?: number;
    max?: number;
    step?: number;
    max_length?: number;
  };
  metadata?: QuestionMetadata;
};

export type BranchRule = {
  source: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "greater_than_or_equal"
    | "less_than"
    | "less_than_or_equal"
    | "in"
    | "not_in";
  value: unknown;
  action: "show" | "hide" | "skip" | "jump_to";
  target: string;
  priority?: number;
};

export const SURVEY_SLUG = "mooddly-consumer-insights";

export const QUESTIONS: QuestionDef[] = [
  {
    id: "q1",
    code: "age_group",
    text: "How old are you?",
    type: "single_select",
    section: "Demographics",
    required: true,
    options: [
      { code: "under_18", text: "Under 18" },
      { code: "18_21", text: "18–21" },
      { code: "22_25", text: "22–25" },
      { code: "26_30", text: "26–30" },
      { code: "31_40", text: "31–40" },
      { code: "41_plus", text: "41+" },
    ],
    validation: {},
  },
  {
    id: "q2",
    code: "location",
    text: "Where do you currently live?",
    type: "single_select",
    section: "Demographics",
    required: true,
    options: [
      { code: "metro", text: "Metro city" },
      { code: "tier1", text: "Tier 1 city" },
      { code: "tier2", text: "Tier 2 city" },
      { code: "tier3", text: "Tier 3/smaller city" },
      { code: "town_village", text: "Town/village" },
    ],
    validation: {},
    metadata: {
      follow_up_field: {
        code: "city",
        label: "City (optional)",
        required: false,
      },
    },
  },
  {
    id: "q3",
    code: "lifestyle",
    text: "Which best describes your day?",
    type: "single_select",
    section: "Demographics",
    required: true,
    options: [
      { code: "student", text: "Student" },
      { code: "professional", text: "Working professional" },
      { code: "entrepreneur", text: "Entrepreneur/business owner" },
      { code: "fitness", text: "Fitness-focused" },
      { code: "homemaker", text: "Homemaker" },
      { code: "other", text: "Other" },
    ],
    validation: {},
  },
  {
    id: "q4",
    code: "beverage_frequency",
    text: "How often do you buy packaged beverages?",
    type: "single_select",
    section: "Behaviour",
    required: true,
    options: [
      { code: "daily", text: "Daily" },
      { code: "4_6_week", text: "4–6 times/week" },
      { code: "2_3_week", text: "2–3 times/week" },
      { code: "weekly", text: "Once/week" },
      { code: "less_weekly", text: "Less than once/week" },
    ],
    validation: {},
  },
  {
    id: "q5",
    code: "drinks_bought",
    text: "Which drinks do you buy most often?",
    type: "multi_select",
    section: "Behaviour",
    required: true,
    options: [
      { code: "water", text: "Packaged water" },
      { code: "sparkling", text: "Sparkling/carbonated water" },
      { code: "energy", text: "Energy drinks" },
      { code: "sports", text: "Sports/electrolyte drinks" },
      { code: "soft", text: "Soft drinks" },
      { code: "juice", text: "Juice" },
      { code: "coconut", text: "Coconut water" },
      { code: "tea_coffee", text: "Tea/coffee" },
      { code: "functional", text: "Functional/wellness drinks" },
      { code: "other", text: "Other" },
    ],
    validation: { min_selections: 1 },
  },
  {
    id: "q6",
    code: "purchase_occasion",
    text: "When do you usually buy a beverage?",
    type: "multi_select",
    section: "Behaviour",
    required: true,
    options: [
      { code: "work_study", text: "During work/study" },
      { code: "exercise", text: "Before/during/after exercise" },
      { code: "travelling", text: "While travelling" },
      { code: "meals", text: "With meals" },
      { code: "tired", text: "When tired" },
      { code: "social", text: "Social occasions" },
      { code: "refresh", text: "To refresh myself" },
      { code: "impulse", text: "Random impulse purchase" },
    ],
    validation: { min_selections: 1 },
  },
  {
    id: "q7",
    code: "biggest_problem",
    text: "What's your biggest problem with today's beverages?",
    type: "single_select",
    section: "Pain points",
    required: true,
    options: [
      { code: "sugar", text: "Too much sugar" },
      { code: "artificial", text: "Too many artificial ingredients" },
      { code: "price", text: "Too expensive" },
      { code: "benefits", text: "Not enough functional benefits" },
      { code: "refreshing", text: "Not refreshing enough" },
      { code: "confusing", text: "Too many confusing choices" },
      { code: "none", text: "Nothing really bothers me" },
      { code: "other", text: "Other" },
    ],
    validation: {},
  },
  {
    id: "q8",
    code: "switch_reasons",
    text: "What would make you switch from your current drink to a new one?",
    type: "multi_select",
    section: "Pain points",
    required: true,
    options: [
      { code: "taste", text: "Better taste" },
      { code: "less_sugar", text: "Less/no sugar" },
      { code: "hydration", text: "Better hydration" },
      { code: "electrolytes", text: "Electrolytes" },
      { code: "energy", text: "Energy" },
      { code: "focus", text: "Focus" },
      { code: "recovery", text: "Recovery" },
      { code: "ingredients", text: "Better ingredients" },
      { code: "price", text: "Better price" },
      { code: "packaging", text: "Better packaging" },
      { code: "trust", text: "Brand I trust" },
    ],
    validation: { min_selections: 1, max_selections: 3 },
  },
  {
    id: "q9",
    code: "frustration",
    text: "How frustrated are you with the current beverage options?",
    type: "scale",
    section: "Pain points",
    required: true,
    validation: { min: 1, max: 10 },
  },
  {
    id: "q10",
    code: "one_thing_better",
    text: "If a drink could do ONE thing better for you, what would it be?",
    type: "single_select",
    section: "Needs",
    required: true,
    options: [
      { code: "hydrate", text: "Hydrate" },
      { code: "refresh", text: "Refresh" },
      { code: "energy", text: "Give energy" },
      { code: "electrolytes", text: "Provide electrolytes" },
      { code: "recovery", text: "Help recovery" },
      { code: "focus", text: "Improve focus" },
      { code: "wellness", text: "Support daily wellness" },
      { code: "relax", text: "Help me relax" },
      { code: "other", text: "Other" },
    ],
    validation: {},
  },
  {
    id: "q11",
    code: "functional_importance",
    text: "How important are functional benefits when choosing a beverage?",
    type: "scale",
    section: "Needs",
    required: true,
    validation: { min: 1, max: 5 },
  },
  {
    id: "q12",
    code: "wtp_extra",
    text: "How much extra would you pay for a drink that genuinely delivered that benefit?",
    type: "single_select",
    section: "Pricing",
    required: true,
    options: [
      { code: "0", text: "₹0 extra", value: 0 },
      { code: "5", text: "₹5 extra", value: 5 },
      { code: "10", text: "₹10 extra", value: 10 },
      { code: "15", text: "₹15 extra", value: 15 },
      { code: "20_plus", text: "₹20+", value: 20 },
      { code: "depends", text: "Depends on the benefit" },
    ],
    validation: {},
  },
  {
    id: "q13",
    code: "functional_hydration_meaning",
    text: "When you hear \"functional hydration\", what does it mean to you?",
    type: "single_select",
    section: "Perception",
    required: true,
    options: [
      { code: "better", text: "Better hydration than normal water" },
      { code: "electrolytes", text: "Electrolytes/minerals" },
      { code: "energy", text: "Hydration + energy" },
      { code: "recovery", text: "Hydration + recovery" },
      { code: "wellness", text: "Hydration + wellness" },
      { code: "dont_know", text: "I don't know" },
      { code: "marketing", text: "Sounds like marketing" },
    ],
    validation: {},
  },
  {
    id: "q14",
    code: "ideal_hydration",
    text: "What would you expect from an ideal hydration drink?",
    type: "multi_select",
    section: "Perception",
    required: true,
    options: [
      { code: "zero_sugar", text: "Zero sugar" },
      { code: "low_cal", text: "Low calories" },
      { code: "electrolytes", text: "Electrolytes" },
      { code: "minerals", text: "Minerals" },
      { code: "vitamins", text: "Vitamins" },
      { code: "natural", text: "Natural ingredients" },
      { code: "taste", text: "Great taste" },
      { code: "no_colours", text: "No artificial colours" },
      { code: "no_sweeteners", text: "No artificial sweeteners" },
      { code: "packaging", text: "Convenient packaging" },
    ],
    validation: { min_selections: 1, max_selections: 3 },
  },
  {
    id: "q15",
    code: "sparkling_feeling",
    text: "How do you feel about sparkling/carbonated water?",
    type: "single_select",
    section: "Sparkling",
    required: true,
    options: [
      { code: "love", text: "Love it" },
      { code: "like", text: "Like it" },
      { code: "neutral", text: "Neutral" },
      { code: "dislike", text: "Don't like it" },
      { code: "never", text: "Never tried it" },
    ],
    validation: {},
  },
  {
    id: "q16",
    code: "sparkling_like_why",
    text: "What do you like about sparkling drinks?",
    type: "single_select",
    section: "Sparkling",
    required: true,
    options: [
      { code: "refreshing", text: "More refreshing" },
      { code: "taste", text: "Taste" },
      { code: "fizzy", text: "Fizzy sensation" },
      { code: "premium", text: "Feels premium" },
      { code: "soda_alt", text: "Good alternative to soda" },
      { code: "avoid_sugar", text: "Helps me avoid sugary drinks" },
      { code: "other", text: "Other" },
    ],
    validation: {},
  },
  {
    id: "q17",
    code: "sparkling_try_why",
    text: "What would make you try a sparkling functional drink?",
    type: "single_select",
    section: "Sparkling",
    required: true,
    options: [
      { code: "flavour", text: "Better flavour" },
      { code: "zero_sugar", text: "Zero sugar" },
      { code: "electrolytes", text: "Electrolytes" },
      { code: "price", text: "Lower price" },
      { code: "benefit", text: "Interesting benefit" },
      { code: "natural", text: "Natural ingredients" },
      { code: "recommendation", text: "Recommendation" },
      { code: "never", text: "Never interested" },
    ],
    validation: {},
  },
  {
    id: "q18",
    code: "sugar_importance",
    text: "How important is zero/low sugar to you?",
    type: "slider",
    section: "Sugar",
    required: true,
    validation: { min: 0, max: 10, step: 1 },
  },
  {
    id: "q19",
    code: "sugar_stance",
    text: "Which statement best describes you?",
    type: "single_select",
    section: "Sugar",
    required: true,
    options: [
      { code: "avoid", text: "I actively avoid sugar" },
      { code: "low", text: "I prefer low sugar" },
      { code: "dont_care", text: "I don't care much" },
      { code: "like", text: "I like regular sugary drinks" },
      { code: "depends", text: "Depends on the drink" },
    ],
    validation: {},
  },
  {
    id: "q20",
    code: "flavours",
    text: "Which flavour directions would you actually want to drink?",
    type: "multi_select",
    section: "Flavour",
    required: true,
    options: [
      { code: "lemon", text: "Lemon" },
      { code: "lime", text: "Lime" },
      { code: "orange", text: "Orange" },
      { code: "berry", text: "Berry" },
      { code: "apple", text: "Apple" },
      { code: "peach", text: "Peach" },
      { code: "watermelon", text: "Watermelon" },
      { code: "mint", text: "Mint" },
      { code: "ginger", text: "Ginger" },
      { code: "tropical", text: "Tropical" },
      { code: "unusual", text: "Something unusual" },
      { code: "unflavoured", text: "Unflavoured" },
    ],
    validation: { min_selections: 1, max_selections: 3 },
  },
  {
    id: "q21",
    code: "flavour_adventure",
    text: "How adventurous are you with new beverage flavours?",
    type: "scale",
    section: "Flavour",
    required: true,
    validation: { min: 1, max: 5 },
    metadata: {
      options: [
        { code: "1", text: "I stick to familiar flavours", value: 1 },
        { code: "5", text: "I love trying new/weird flavours", value: 5 },
      ],
    },
  },
  {
    id: "q22",
    code: "price_reasonable",
    text: "What would feel like a reasonable price for a premium functional beverage?",
    type: "single_select",
    section: "Pricing",
    required: true,
    options: [
      { code: "under_30", text: "Under ₹30", value: 30 },
      { code: "30_39", text: "₹30–₹39", value: 39 },
      { code: "40_49", text: "₹40–₹49", value: 49 },
      { code: "50_59", text: "₹50–₹59", value: 59 },
      { code: "60_79", text: "₹60–₹79", value: 79 },
      { code: "80_plus", text: "₹80+", value: 80 },
    ],
    validation: {},
  },
  {
    id: "q23",
    code: "price_suspicious",
    text: "At what price would you think the product is suspiciously cheap?",
    type: "single_select",
    section: "Pricing",
    required: true,
    options: [
      { code: "under_30", text: "Under ₹30", value: 30 },
      { code: "30_39", text: "₹30–₹39", value: 39 },
      { code: "40_49", text: "₹40–₹49", value: 49 },
      { code: "50_59", text: "₹50–₹59", value: 59 },
      { code: "60_79", text: "₹60–₹79", value: 79 },
      { code: "80_plus", text: "₹80+", value: 80 },
    ],
    validation: {},
  },
  {
    id: "q24",
    code: "concept_appeal",
    text: "How appealing is this concept?",
    type: "scale",
    section: "Concept",
    required: true,
    validation: { min: 1, max: 10 },
  },
  {
    id: "q25",
    code: "buy_reasons",
    text: "What would make you most likely to buy MOODDLY?",
    type: "multi_select",
    section: "Concept",
    required: true,
    options: [
      { code: "sugar", text: "Zero/low sugar" },
      { code: "hydration", text: "Hydration" },
      { code: "electrolytes", text: "Electrolytes" },
      { code: "functional", text: "Functional benefit" },
      { code: "taste", text: "Taste" },
      { code: "ingredients", text: "Ingredients" },
      { code: "price", text: "Price" },
      { code: "packaging", text: "Packaging" },
      { code: "brand", text: "Brand identity" },
      { code: "curiosity", text: "Curiosity" },
    ],
    validation: { min_selections: 1, max_selections: 3 },
  },
  {
    id: "q26",
    code: "trial_likelihood",
    text: "How likely would you be to try MOODDLY if it were available near you?",
    type: "scale",
    section: "Concept",
    required: true,
    validation: { min: 1, max: 10 },
  },
  {
    id: "q27",
    code: "purchase_channels",
    text: "Where would you expect to buy it?",
    type: "multi_select",
    section: "Distribution",
    required: true,
    options: [
      { code: "kirana", text: "Kirana/local store" },
      { code: "supermarket", text: "Supermarket" },
      { code: "gym", text: "Gym" },
      { code: "cafe", text: "Café" },
      { code: "college", text: "College" },
      { code: "amazon", text: "Amazon" },
      { code: "quick_commerce", text: "Quick-commerce" },
      { code: "website", text: "Brand website" },
      { code: "food_delivery", text: "Food delivery app" },
      { code: "other", text: "Other" },
    ],
    validation: { min_selections: 1 },
  },
  {
    id: "q28",
    code: "founder_message",
    text: "If you could tell MOODDLY's founders ONE thing before they launch, what would you say?",
    type: "text",
    section: "Open",
    required: false,
    validation: { max_length: 500 },
    metadata: { placeholder: "Be brutally honest..." },
  },
];

// Branching rules. Evaluated in priority order.
export const BRANCH_RULES: BranchRule[] = [
  // Q15 → Q16 (positive/neutral) or Q17 (negative/never)
  {
    source: "sparkling_feeling",
    operator: "in",
    value: ["love", "like", "neutral"],
    action: "show",
    target: "sparkling_like_why",
    priority: 10,
  },
  {
    source: "sparkling_feeling",
    operator: "in",
    value: ["dislike", "never"],
    action: "show",
    target: "sparkling_try_why",
    priority: 10,
  },
  {
    source: "sparkling_feeling",
    operator: "in",
    value: ["love", "like", "neutral"],
    action: "hide",
    target: "sparkling_try_why",
    priority: 10,
  },
  {
    source: "sparkling_feeling",
    operator: "in",
    value: ["dislike", "never"],
    action: "hide",
    target: "sparkling_like_why",
    priority: 10,
  },
];

// Concept screen appears after Q23 and before Q24.
export const CONCEPT_AFTER_QUESTION = "price_suspicious";
export const CONCEPT_BEFORE_QUESTION = "concept_appeal";

export function getQuestionByCode(code: string): QuestionDef | undefined {
  return QUESTIONS.find((q) => q.code === code);
}

export function getQuestionIndex(code: string): number {
  return QUESTIONS.findIndex((q) => q.code === code);
}
