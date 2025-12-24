import { ClarityGrade, Certification } from '../config/filterConfig';

interface ClarityDisplayInfo {
  grade: string;
  label: string;
  description: string;
}

interface CertificationDisplayInfo {
  name: string;
  fullName: string;
  description: string;
}

export function getClarityDisplayInfo(grade: ClarityGrade | string): ClarityDisplayInfo {
  const clarityInfo: Record<string, ClarityDisplayInfo> = {
    'FL': {
      grade: 'FL',
      label: 'Flawless',
      description: 'No inclusions or blemishes visible under 10x magnification'
    },
    'IF': {
      grade: 'IF',
      label: 'Internally Flawless',
      description: 'No inclusions visible under 10x magnification'
    },
    'VVS1': {
      grade: 'VVS1',
      label: 'Very Very Slightly Included 1',
      description: 'Inclusions extremely difficult to see under 10x magnification'
    },
    'VVS2': {
      grade: 'VVS2',
      label: 'Very Very Slightly Included 2',
      description: 'Inclusions very difficult to see under 10x magnification'
    },
    'VS1': {
      grade: 'VS1',
      label: 'Very Slightly Included 1',
      description: 'Inclusions difficult to see under 10x magnification'
    },
    'VS2': {
      grade: 'VS2',
      label: 'Very Slightly Included 2',
      description: 'Inclusions somewhat easy to see under 10x magnification'
    },
    'SI1': {
      grade: 'SI1',
      label: 'Slightly Included 1',
      description: 'Inclusions easy to see under 10x magnification'
    },
    'SI2': {
      grade: 'SI2',
      label: 'Slightly Included 2',
      description: 'Inclusions very easy to see under 10x magnification'
    },
    'I1': {
      grade: 'I1',
      label: 'Included 1',
      description: 'Inclusions visible to the naked eye'
    },
    'I2': {
      grade: 'I2',
      label: 'Included 2',
      description: 'Inclusions easily visible to the naked eye'
    },
    'I3': {
      grade: 'I3',
      label: 'Included 3',
      description: 'Inclusions very easily visible to the naked eye'
    }
  };

  return clarityInfo[grade] || {
    grade,
    label: grade,
    description: 'Clarity information not available'
  };
}

export function getCertificationDisplayInfo(cert: Certification | string): CertificationDisplayInfo {
  const certInfo: Record<string, CertificationDisplayInfo> = {
    'GIA': {
      name: 'GIA',
      fullName: 'Gemological Institute of America',
      description: 'The world\'s foremost authority in gemology'
    },
    'IGI': {
      name: 'IGI',
      fullName: 'International Gemological Institute',
      description: 'Leading independent laboratory for grading and evaluation'
    },
    'HRD': {
      name: 'HRD',
      fullName: 'HRD Antwerp',
      description: 'Official certification institute of the Antwerp diamond industry'
    },
    'AGS': {
      name: 'AGS',
      fullName: 'American Gem Society',
      description: 'Non-profit trade association of jewelers and gemologists'
    }
  };

  return certInfo[cert] || {
    name: cert,
    fullName: cert,
    description: 'Certification information not available'
  };
}

export function getClarityRecommendation(budget: number): ClarityGrade[] {
  if (budget < 3000) {
    return ['SI1', 'SI2', 'VS2'];
  } else if (budget < 7000) {
    return ['VS1', 'VS2', 'VVS2'];
  } else {
    return ['VVS1', 'VVS2', 'IF'];
  }
}

export function getCertificationRecommendation(isLabGrown: boolean): Certification[] {
  return isLabGrown ? ['IGI', 'GIA'] : ['GIA', 'AGS'];
}
