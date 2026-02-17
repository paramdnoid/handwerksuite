/**
 * Gewerke gemäß Handwerksordnung (HwO)
 * Anlage A: Zulassungspflichtige Handwerke
 * Anlage B: Zulassungsfreie Handwerke
 */
export const CRAFT_TYPES = {
  // Anlage A – Zulassungspflichtig
  SHK: "shk",
  ELEKTRO: "elektro",
  TISCHLER: "tischler",
  MALER: "maler",
  DACHDECKER: "dachdecker",
  ZIMMERER: "zimmerer",
  METALLBAU: "metallbau",
  KFZ: "kfz",
  MAURER: "maurer",
  STRASSENBAUER: "strassenbauer",
  SCHORNSTEINFEGER: "schornsteinfeger",
  FLEISCHER: "fleischer",
  BAECKER: "baecker",
  AUGENOPTIKER: "augenoptiker",
  HOERGERAETEAKUSTIKER: "hoergeraeteakustiker",
  ZAHNTECHNIKER: "zahntechniker",
  FRISEUR: "friseur",
  GLASER: "glaser",
  STEINMETZ: "steinmetz",
  OFEN_LUFTHEIZUNGSBAUER: "ofen_luftheizungsbauer",
  KLEMPNER: "klempner",
  KAELTEANLAGENBAUER: "kaelteanlagenbauer",
  INFORMATIONSTECHNIKER: "informationstechniker",
  ELEKTROMASCHINENBAUER: "elektromaschinenbauer",
  BETON_STAHLBETONBAUER: "beton_stahlbetonbauer",
  // Anlage B1 – Zulassungsfrei
  FLIESEN_PLATTEN_MOSAIKLEGER: "fliesen_platten_mosaikleger",
  PARKETTLEGER: "parkettleger",
  RAUMAUSSTATTER: "raumausstatter",
  GEBAEUNDEREINIGER: "gebaeudereiniger",
  SCHILDER_LICHTREKLAMEHERSTELLER: "schilder_lichtreklamehersteller",
} as const;

export type CraftTypeKey = keyof typeof CRAFT_TYPES;
export type CraftTypeValue = (typeof CRAFT_TYPES)[CraftTypeKey];

export interface CraftTypeInfo {
  key: CraftTypeKey;
  value: CraftTypeValue;
  label: string;
  category: "anlage_a" | "anlage_b1" | "anlage_b2";
  requiresMeisterbrief: boolean;
}

export const CRAFT_TYPE_INFO: Record<CraftTypeValue, CraftTypeInfo> = {
  shk: {
    key: "SHK",
    value: "shk",
    label: "Sanitär, Heizung, Klima",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  elektro: {
    key: "ELEKTRO",
    value: "elektro",
    label: "Elektrotechnik",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  tischler: {
    key: "TISCHLER",
    value: "tischler",
    label: "Tischlerei",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  maler: {
    key: "MALER",
    value: "maler",
    label: "Maler und Lackierer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  dachdecker: {
    key: "DACHDECKER",
    value: "dachdecker",
    label: "Dachdecker",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  zimmerer: {
    key: "ZIMMERER",
    value: "zimmerer",
    label: "Zimmerer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  metallbau: {
    key: "METALLBAU",
    value: "metallbau",
    label: "Metallbau",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  kfz: {
    key: "KFZ",
    value: "kfz",
    label: "KFZ-Technik",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  maurer: {
    key: "MAURER",
    value: "maurer",
    label: "Maurer und Betonbauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  strassenbauer: {
    key: "STRASSENBAUER",
    value: "strassenbauer",
    label: "Straßenbauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  schornsteinfeger: {
    key: "SCHORNSTEINFEGER",
    value: "schornsteinfeger",
    label: "Schornsteinfeger",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  fleischer: {
    key: "FLEISCHER",
    value: "fleischer",
    label: "Fleischer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  baecker: {
    key: "BAECKER",
    value: "baecker",
    label: "Bäcker",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  augenoptiker: {
    key: "AUGENOPTIKER",
    value: "augenoptiker",
    label: "Augenoptiker",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  hoergeraeteakustiker: {
    key: "HOERGERAETEAKUSTIKER",
    value: "hoergeraeteakustiker",
    label: "Hörgeräteakustiker",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  zahntechniker: {
    key: "ZAHNTECHNIKER",
    value: "zahntechniker",
    label: "Zahntechniker",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  friseur: {
    key: "FRISEUR",
    value: "friseur",
    label: "Friseur",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  glaser: {
    key: "GLASER",
    value: "glaser",
    label: "Glaser",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  steinmetz: {
    key: "STEINMETZ",
    value: "steinmetz",
    label: "Steinmetz und Steinbildhauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  ofen_luftheizungsbauer: {
    key: "OFEN_LUFTHEIZUNGSBAUER",
    value: "ofen_luftheizungsbauer",
    label: "Ofen- und Luftheizungsbauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  klempner: {
    key: "KLEMPNER",
    value: "klempner",
    label: "Klempner",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  kaelteanlagenbauer: {
    key: "KAELTEANLAGENBAUER",
    value: "kaelteanlagenbauer",
    label: "Kälteanlagenbauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  informationstechniker: {
    key: "INFORMATIONSTECHNIKER",
    value: "informationstechniker",
    label: "Informationstechniker",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  elektromaschinenbauer: {
    key: "ELEKTROMASCHINENBAUER",
    value: "elektromaschinenbauer",
    label: "Elektromaschinenbauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  beton_stahlbetonbauer: {
    key: "BETON_STAHLBETONBAUER",
    value: "beton_stahlbetonbauer",
    label: "Beton- und Stahlbetonbauer",
    category: "anlage_a",
    requiresMeisterbrief: true,
  },
  fliesen_platten_mosaikleger: {
    key: "FLIESEN_PLATTEN_MOSAIKLEGER",
    value: "fliesen_platten_mosaikleger",
    label: "Fliesen-, Platten- und Mosaikleger",
    category: "anlage_b1",
    requiresMeisterbrief: false,
  },
  parkettleger: {
    key: "PARKETTLEGER",
    value: "parkettleger",
    label: "Parkettleger",
    category: "anlage_b1",
    requiresMeisterbrief: false,
  },
  raumausstatter: {
    key: "RAUMAUSSTATTER",
    value: "raumausstatter",
    label: "Raumausstatter",
    category: "anlage_b1",
    requiresMeisterbrief: false,
  },
  gebaeudereiniger: {
    key: "GEBAEUNDEREINIGER",
    value: "gebaeudereiniger",
    label: "Gebäudereiniger",
    category: "anlage_b1",
    requiresMeisterbrief: false,
  },
  schilder_lichtreklamehersteller: {
    key: "SCHILDER_LICHTREKLAMEHERSTELLER",
    value: "schilder_lichtreklamehersteller",
    label: "Schilder- und Lichtreklamehersteller",
    category: "anlage_b1",
    requiresMeisterbrief: false,
  },
};
