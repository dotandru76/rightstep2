import { useMemo } from 'react';

interface BMIResult {
  bmi: number;
  category: string;
  healthyWeightRange: string;
}

// Named export - this is the correct way based on your import
export function useBMI(heightCm: number, weightKg: number): BMIResult {
  return useMemo(() => {
    // Default values in case of invalid inputs
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return {
        bmi: 0,
        category: 'Unknown',
        healthyWeightRange: '0-0',
      };
    }

    // Convert height from cm to m and calculate BMI
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Determine BMI category
    let category: string;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    // Calculate healthy weight range for the person's height
    const minHealthyWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxHealthyWeight = (24.9 * heightM * heightM).toFixed(1);
    const healthyWeightRange = `${minHealthyWeight}-${maxHealthyWeight}`;

    return {
      bmi,
      category,
      healthyWeightRange,
    };
  }, [heightCm, weightKg]);
}