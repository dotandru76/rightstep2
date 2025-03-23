
export const getFieldsForStep = (currentStep: number) => {
  switch (currentStep) {
    case 1: return ["name"];
    case 2: return ["sex"];
    case 3: return ["age", "weight", "height"];
    case 4: return [];
    default: return [];
  }
};

export const TOTAL_STEPS = 4;
