enum ColorIntensity {
  LIGHT = 'light',
  SEMI_DARK = 'semi-dark',
  DARK = 'dark',
}
const COLOR_INTENSITIES = [
  ColorIntensity.LIGHT,
  ColorIntensity.SEMI_DARK,
  ColorIntensity.DARK,
];

export default interface Color {
  id: number;
  accountId: number;
  name: string;
  hex: string;
  red: number;
  green: number;
  blue: number;
  intensity: ColorIntensity;
  custom: boolean;
  createdAt: string;
  updatedAt: string;
}

export function validateColor (color:any):{ valid:boolean; error:string; } {
  const {
    accountId,
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = color;

  let error = '';

  if (!accountId || typeof accountId !== 'number') {
    error = '"accountId" is required';
  }

  if (!name?.length) {
    error = '"name" is empty';
  }

  if (!hex?.length || !hex.startsWith('#')) {
    error = '"hex" is invalid';
  }

  if (typeof red !== 'number' || red < 0 || red > 255) {
    error = '"red" is invalid';
  }
  if (typeof green !== 'number' || green < 0 || green > 255) {
    error = '"green" is invalid';
  }
  if (typeof blue !== 'number' || blue < 0 || blue > 255) {
    error = '"blue" is invalid';
  }

  if (!intensity?.length || !COLOR_INTENSITIES.includes(intensity)) {
    error = '"intensity" is invalid';
  }

  return {
    valid: !error,
    error,
  };
}
